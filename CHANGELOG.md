# Changelog

## 0.6.0 – Small tablets, cameras and cards in panels

- Small landscape tablets (for example 7") keep the side panels next to the house. The card switches to a compact layout with narrower panels instead of moving them below.
- Camera tiles: add a `camera.` entity to a side panel and choose a refreshed snapshot (lighter) or a live stream.
- Any Home Assistant card in a side panel (`card:`), for example a calendar, buttons or a WebRTC/Frigate camera card.

## 0.5.4 – House image fix

- The house image shows again. In 0.5.3 the image tag received the CSS form `url('…')` instead of the file path, so only the blurred background was visible.
- A card without `image` shows the "configure" hint again.

## 0.5.3 – Safe HTML rendering

- Escape entity states, units, room IDs and icons in the three card templates.
- Lead with catalog search in the HACS installation instructions.

## 0.5.2 – Heating controls

- Heating rows get controls that match the entity type: − / + for thermostats, water heaters and numbers, a power button for switches, a list for selects. Sensors stay read-only.
- − / + changes the value on the card first and sends it once you stop clicking, so three taps make one change.
- Switching a heating switch off asks first; add `confirm: false` to skip the question, or `controls: false` to show the entity read-only.

## 0.5.1 – Lighter and heating for any boiler

- Faster updates: a panel is redrawn only when its content changes, so an entity update no longer redraws the whole card.
- The weather animation stops when the stars are too faint to see and pauses while the card is off screen.
- The heating field in the card editor accepts boilers (`water_heater`), sensors, switches and other heating entities, not only thermostats. Existing `heating` and `side_panels.heating` YAML keeps working.
- A boiler (`water_heater`) shows its current and target temperature like a thermostat.

## 0.5.0

- Add tiles to the left panel, right panel or heating section from the visual editor.
- Tiles can show entity details, open a dashboard view or run a Home Assistant action after confirmation.
- Show general entities alongside thermostats in the heating section.

## 0.4.1 – House dashboard fixes

- Render the house card once on startup instead of twice.
- Add entity rows to either side of the house with `side_panels.left` and `side_panels.right`. Selecting a row opens the entity details.
- Label the admin shortcut “Create HA script” and explain how to add scene buttons through the card configuration.

## 0.4.0 – Cat corner

### New
- New card `living-cats-card`: a living picture of the cat corner. The scene follows the litter box and the pet feeder – cat in the litter box, cat eating, cleaning glow, UV light, red ring when the bin is full, day/night with the sun (event scenes tinted at night).
- Glass panels: litter box status, visits today, cat weight, time today, clean button; feeder status, last meal, portion stepper with "Feed now", quick feed; any number of toggles (night mode, UV, deodorization, slow feed…).
- Pictures served from the repository (CDN) or locally with `image_base`; own pictures with `images:`.
- `back_path` / `back_name`: a back button on the cat corner (works with kiosk mode).
- `living-rooms-card`: a tile can be a shortcut to another view with `link:` (it is left out of the room tabs).
- Demo: `?card=cats`.
- More litter box and feeder states translated (caking, occupied, blocked, fed).

## 0.3.0 – Ready-made houses

### New
- `preset:` option – pick one of 8 ready-made houses (2 or 3 bedrooms, with or without basement and attic) with the picture, labels, room outlines and TV screen already in place. Just add entities to rooms by `id`.
- Visual editor: pick the house from a dropdown and choose lights, temperature, humidity and TV for each room – no YAML needed.
- Rooms in a preset can be renamed, re-iconed or removed (`hide: true`); room names follow the UI language (EN/PL).
- Tall houses are shown bigger: semi-transparent ▲▼ arrows (or mouse wheel / swipe) move the view one floor up or down (`scroll_floors`). Idea: Arkadiusz Piotr Piasecki.
- Demo: switch between all houses (`?house=basement`).

## 0.2.2 – 3D printer

### Fixes
- Printer pause/resume/stop buttons were hidden (button entities report `unknown` until pressed).
- Home status panel compacts itself when space is short, so the last row is never cut off; weather text stays on one line.


### New
- New device `printer` in `living-rooms-card`: glowing progress ring, time left and finish time, layer, task name, nozzle/bed temperatures, model preview ↔ live camera, AMS filament colours, chamber light, pause/resume/stop (stop asks first).
- `living-house-card`: optional `printer:` row in the home status panel ("Printing 45% · 1 h 12 min").
- Rooms tiles show "Printing 45%", "Print done" and a failed-print alert.
- Room `image` can be a `camera.*` or `image.*` entity.
- Rooms without climate put devices in the wide middle column.

## 0.1.0 – first public beta

- `living-house-card`: 3D house with live labels, per-room darkening (light weights), LED colour, TV glow and screen blackout, day/night sky, weather effects with last-known fallback, heat map, room zoom with device panel, frosted glass panels (weather, status, heating, air, energy), configurable scenes (incl. relative temperature), fit-to-screen, tablet screensaver.
- Calibration mode: drag labels, draw room/TV outlines, set zoom point, copy YAML.
- `living-rooms-card`: photo mosaic with automatic layout, live tiles (dim when dark), alerts, room view with lights (brightness, colour, kelvin), thermostat dials, media, sensors, devices (purifier, pet feeder, litter box, washer, dryer), 24 h chart, room tabs, fit-to-screen.
- Polish and English.
