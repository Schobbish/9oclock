# projector
Clock for displaying on a projector. Or whatever. There is no reason why this clock should only be used on a projector. It is meant to be displayed on any type of display. I'm just not good at coming up with clever names.

You can generate timers, countdown clocks, and stopwatches. You can also change the style of the website at your will.

## Contents

1. [Commands](#commands)
    1. [Create](#create)
    2. [Delete](#delete)
    3. [Insert](#insert)
    4. [Style](#style)
    5. [Done](#done)
    6. [Stop](#stop)
    7. [Restart](#restart)
2. [Widgets](#widgets)
    1. [Clock](#clock)
    2. [Countdown](#countdown)
    3. [Stopwatch](#stopwatch)
    4. [Timer](#timer)
    5. [Timestamp](#timestamp)
    6. [Blank](#blank)
    7. [Text](#text)
3. [Reporting Bugs](#reporting-bugs)
4. [License](#license)

## Commands
You can give commands to the website in the textarea element. Each command should be prefixed with `>>␣` (with a space after). Fun fact if you hit shift+. (>) it will focus the textarea for you (does not work on older browsers). You can also type normal text in the textarea to show a message or something. Commands are case-sensitive.

### Create

```
>> create <widget> [args...]
```

Creates widget `<widget>`. Some widgets accept additional arguments. See [Widgets](#widgets) for more information. This command will produce an error instead if the widget does not exist.

### Delete

```
>> delete <index>
```

Deletes the widget at `<index>`. The top widget has index zero. There is no way to delete by id.

### Insert

```
>> insert <index> <widget> [args...]
```

Inserts `<widget>` at index `<index>`. Some widgets accept additional arguments. See [Widgets](#widgets) for more information. This command will produce an error instead if the widget does not exist.

### Style

```
>> style <selector> <css>
```

Gives the elements selected by `<selector>` a `style` property with value `<css>`. This will not produce an error if your selector or CSS is invalid.

### Done

```
>> done
```

Unfocuses the textarea.

### Stop

```
>> stop!
```

Stop updating all widgets. This is only meant for as a debugging tool and may lead to inconsistent behavior. Widgets can still be clicked on (which may update them). This only stops the update clock.

### Restart

```
>> restart
```

Start updating all widgets again if they are currently stopped. Gives warning instead if widgets are not stopped. This is only meant for as a debugging tool and may lead to inconsistent behavior.

## Widgets
There are various clock-related things which you can have on the page. Summon each by issuing the `create` command. Some widgets accept additional arguments.

### Clock

```
>> create clock [time zone]
```

Creates a generic clock, defaulted in your time zone. Accepts an optional timezone argument in the form of an UTC offset (`±hh:mm`, `±hhmm`, or `±hh`). You may also use a time zone abbreviation, but only a couple are supported (because I'm lazy). View supported time zones [here](assets/tzAbbrs.js).

The output format will be `hh:mm:ss.cc`. You can hide the cursor behind clocks.

### Countdown

```
>> create countdown <end time>
```

Creates a countdown which ends at `<end time>`. `<end time>` must be a 24-hour time in your time zone. The time must be in the form `[d.]h:m[:s[.c]`.  By default, the countdown will end the next time that time occurs. To extend this time by a couple of days, add a multiple of 24 to hours or use the day unit.

The output format will be `[hh:]mm:ss` when the time left is over 1 minute and `ss.cc` when it's under 1 minute. Hover over the widget to see the time it's counting down to.

### Stopwatch

```
>> create stopwatch [starting duration]
```

Creates a stopwatch. By default it will start at 0, but if you need to you may specify a starting duration in the form `[d.]h:m[:s[.c]]`.

Click on the widget to start/pause it. The output format will be `[hh:]mm:ss.cc`. When it's running, you may hover over the stopwatch to see when it started (or when it would've started if it has been paused).

### Timer

```
>> create timer <length>
```

Creates a timer of length `<length>`. `<length>` should be in the form `[d.]h:m[:s[.c]]`.

Click on the widget to start/pause it. The output format will be `[hh:]mm:ss` when the time left is over 1 minute and `ss.cc` when it's under 1 minute. When it's running, you may hover over the timer to see when it started (or when it would've started if it has been paused) and when it will end.

### Timestamp

```
>> create timestamp [format]
```

Creates a timestamp in the ISO 8601 format or the format of your choice. Because this website uses the moment.js library, please go [here](https://momentjs.com/docs/#/displaying/format/) to see how to format formats. You may hover over the timestamp to see the format it's using.

### Blank

```
>> create blank [height]
```

Creates some whitespace of a default height or `[height]`. `[height]` should be some type of length that CSS can understand. The default height is 1em. An invalid height does not produce an error, but you can hover over the widget to view some diagnostic information if needed (or use DevTools).

The `font-size` of the widget is 3.75em (3em \* 1.25 line height so that 1em is the actual height of the line), which usually translates to 60px. Note that the widget also gets a `margin-bottom` of 0.16em, which is usually 9.6px.

### Text

```
>> create text [text]
```

Creates a widget which displays `[text]`. By default, the font size will be half that of the other widgets (3em vs. 6em).

## Reporting Bugs
To report a bug, please create an issue describing the bug (what you expected to happen vs. what actually happened). Please include the console output and what browser you're using (and its version).

## License
This whole repository is licensed under the MIT License. What little content exists on the website itself is licensed under a Creative Commons Attribution 4.0 International License just in case.
