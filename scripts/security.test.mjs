import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const cards = new Map();
runInNewContext(readFileSync(new URL("../dist/living-house-card.js", import.meta.url), "utf8"), {
  HTMLElement: class {},
  customElements: { get: (name) => cards.get(name), define: (name, card) => cards.set(name, card) },
  window: {},
  console: { info() {} },
});

const example = '<sample> & "value"';
const escaped = '&lt;sample&gt; &amp; &quot;value&quot;';
const entity = (state, attributes = {}) => ({ state, attributes });
const element = () => ({ classList: { add() {}, remove() {}, toggle() {} } });
const makeCard = (type, states = {}) => Object.assign(
  Object.create(cards.get(`living-${type}-card`).prototype),
  { _lang: "en", _pending: {}, _hass: { states, config: {} } },
);

test("icon attributes are escaped once in each card", () => {
  for (const type of ["house", "rooms", "cats"]) {
    const card = makeCard(type);
    assert.equal(card._icon(example, 'class="spin"'), `<ha-icon icon="${escaped}" class="spin"></ha-icon>`);
    assert.match(card._icon("mdi:cat"), /icon="mdi:cat"/);
  }
});

test("house status escapes alarm state, printer state, and printer name", () => {
  const house = makeCard("house", {
    "alarm_control_panel.home": entity(example),
    "sensor.printer": entity(example),
  });
  let html;
  Object.assign(house, {
    _cfg: { alarm: "alarm_control_panel.home", printer: { status: "sensor.printer", name: example } },
    _allLights: [], _heatingList: [], _tracked: () => [], _el: element,
    _html: (_, value) => { html = value; },
  });
  house._renderStatus();
  assert.equal(html.split(escaped).length - 1, 3);
  assert.doesNotMatch(html, /<sample>/);
});

test("house room identifiers and units are encoded at render time", () => {
  const house = makeCard("house", {
    "sensor.value": entity("24", { unit_of_measurement: example }),
  });
  const popup = element();
  const room = { id: example, name: "Living room", entities: [["sensor.value"]], shape: [[0, 0], [10, 0], [10, 10]] };
  Object.assign(house, {
    _cfg: {}, _rooms: [room], _room: room.id, _lights: { [room.id]: ["light.living_room"] }, _el: () => popup,
  });
  house._renderPop();
  assert.ok(popup.innerHTML.includes(`24 ${escaped}`));
  assert.ok(popup.innerHTML.includes(`data-roomlights="${escaped}"`));
  assert.ok(house._layersHtml().includes(`data-shade="${escaped}" style="clip-path:polygon(0% 0%,10% 0%,10% 10%)"`));
});

test("room climate dial and compact row escape unknown state and preserve known modes", () => {
  const climate = entity(example, { hvac_modes: ["heat", "off"], current_temperature: 20, temperature: 21 });
  const rooms = makeCard("rooms", { "climate.room": climate });
  for (const kind of ["main", "trv"]) {
    const html = rooms._wClimate(["climate.room", "Thermostat", kind]);
    assert.ok(html.includes(escaped));
    assert.doesNotMatch(html, /<sample>/);
    const mode = kind === "main" ? "heat" : "off";
    assert.ok(html.includes(`data-hvac="climate.room" data-v="${mode}"`));
  }
});

test("room sensor units and purifier labels are escaped once", () => {
  const rooms = makeCard("rooms", {
    "sensor.value": entity("42", { unit_of_measurement: example }),
    "fan.room": entity("on", { percentage: 42, preset_mode: example, preset_modes: [example] }),
  });
  assert.ok(rooms._wSensors({ sensors: [["sensor.value"]] }).includes(`42 ${escaped}`));
  const purifier = rooms._wDevice({ type: "purifier", fan: "fan.room" });
  assert.ok(purifier.includes(`<div class="dev-sub">${escaped}</div>`));
  assert.ok(purifier.includes(`data-v="${escaped}">${escaped}</button>`));
  assert.match(purifier, /value="42"/);
});

test("cats status remains plain text when rendered with textContent", () => {
  const cats = makeCard("cats");
  assert.equal(cats._litterText({ lst: example }), example);
  assert.equal(cats._feederText({ fst: example }), example);
});

test("house image uses a plain src and a CSS url() only in the style", () => {
  const html = [];
  const house = makeCard("house");
  const root = { set innerHTML(v) { html.push(v); }, addEventListener() {}, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
  const src = "/local/dom3d/house.webp";
  Object.assign(house, { _root: root, _cfg: { image: src }, _rooms: [], _energy: {}, _heatingList: [], _sideEntities: { left: [], right: [], heating: [] }, _sidePanel: () => "", _t: (k) => k, _layersHtml: () => "" });
  try { house._build(); } catch (e) { /* DOM work after the template is out of scope */ }
  const out = html.join("");
  assert.ok(out.includes(`<img src="${src}"`), "img src is the plain path");
  assert.doesNotMatch(out, /src="url\(/);
  assert.ok(out.includes(`--img:url('${src}')`), "CSS variable keeps url()");
});
