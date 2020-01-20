# projector
Clock for displaying on a projector. Or whatever. There is no reason why this clock should only be used on a projector. It is meant to be displayed on any type of display. I'm just not good at coming up with clever names.

You can generate timers, countdown clocks, and stopwatches. You can also change the CSS of the website at your will.

## Contents

1. [Commands](#commands)
    1. [`create`](#create)
    2. [`delete`](#delete)
    3. [`done`](#done)
2. [Widgets](#widgets)
    1. [Clock](#clock)
3. [License](#license)

## Commands
You can give commands to the website in the textarea element. Each command should be prefixed with `>>␣` (with a space after). Fun fact if you hit shift+. (>) it will focus the textarea for you (does not work on older browsers). Obviously you can also type normal text in the textarea to show a message or something. Commands will always be converted to lowercase for parsing.

### `create <widget>`
Creates a widget of your choosing! Some widgets accept additional arguments. See [Widgets](#widgets) for more information. This command will show an error if the widget does not exist.

### `delete <index>`
Deletes the widget at the index. The top widget has index 0. There is no way to delete by id.

## Widgets
There are various clock-related things which you can have on the page. Summon each by issuing the `create <widget>` command. Some widgets accept additional arguments.

### Clock
Creates a generic clock, defaulted in your time zone of course. Includes seconds, which you can't turn off. Accepts a timezone argument, preferably in the form of a UTC offset (±hh:mm, ±hhmm, or ±hh). You may also use a time zone abbreviation, but only a couple are supported (because I'm lazy). View (or add!) supported time zones [here](assets/tzAbbrs.js). If the time zone is invalid, it will show an error (or is this necessary? Should it be ignored instead?).

## License
This whole repository is licensed under the MIT License. What content exists on the website itself is licensed under a Creative Commons Attribution 4.0 International License.
