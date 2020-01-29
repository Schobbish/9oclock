# projector
Clock for displaying on a projector. Or whatever. There is no reason why this clock should only be used on a projector. It is meant to be displayed on any type of display. I'm just not good at coming up with clever names.

You can generate timers, countdown clocks, and stopwatches. You can also change the CSS of the website at your will.

## Contents

1. [Commands](#commands)
    1. [`create`](#create)
    2. [`delete`](#delete)
    3. [`style`](#style)
    4. [`done`](#done)
    5. [`stop!`](#stop)
    6. [`restart`](#restart)
2. [Widgets](#widgets)
    1. [Clock](#clock)
    2. [Countdown](#countdown)
    3. [Stopwatch](#stopwatch)
    4. [Timer](#timer)
3. [License](#license)

## Commands
You can give commands to the website in the textarea element. Each command should be prefixed with `>>␣` (with a space after). Fun fact if you hit shift+. (>) it will focus the textarea for you (does not work on older browsers). Obviously you can also type normal text in the textarea to show a message or something. Commands will always be converted to lowercase for parsing.

### `create <widget> [args]`
Creates a widget of your choosing! Some widgets accept additional arguments. See [Widgets](#widgets) for more information. This command will show an error if the widget does not exist.

### `delete <index>`
Deletes the widget at the index. The top widget has index 0. There is no way to delete by id.

### `done`
Unfocuses the textarea.

### `stop!`
Stop updating widgets. This is only meant for as a debugging tool.

### `restart`
Start updating widgets again. Only works if widgets are currently stopped. Any timers, stopwatches, etc. will update as if they never stopped if they were not stopped before the `stop!` command was issued.

## Widgets
There are various clock-related things which you can have on the page. Summon each by issuing the `create <widget>` command. Some widgets accept additional arguments.

### Clock
Creates a generic clock, defaulted in your time zone of course. Includes seconds, which you can't turn off. Accepts a timezone argument, preferably in the form of a UTC offset (±hh:mm, ±hhmm, or ±hh). You may also use a time zone abbreviation, but only a couple are supported (because I'm lazy). View (or add!) supported time zones [here](assets/tzAbbrs.js).

You can hide the cursor behind clocks.

### Stopwatch
Creates a stopwatch. To start or pause the stopwatch, simply click on it. (Starts/pauses on mouse up.) You may specify the time to start the stopwatch at in the form `[d.]h:m[:s]`. Partial seconds are allowed. The stopwatch prints its time in the form `[h:]mm:ss.cc`. The hover text shows when the stopwatch was started.

### Timer
Creates a timer. You must follow this command with a length as a duration in the form `[d.]h:m[:s]`. Partial seconds are allowed. To start or pause the timer, simply click on it. (Starts/pauses on mouse up.) The timer prints its time in the form `[[h:]mm:]ss[.cc]`, with hundredths appearing once the time is below one minute.

## License
This whole repository is licensed under the MIT License. What little content exists on the website itself is licensed under a Creative Commons Attribution 4.0 International License just in case.
