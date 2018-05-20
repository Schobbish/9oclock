# Projector Mode Documentation
The projector mode is made to display only a clock on a projector or other display. It has a couple extra features that the original website does not have:

- **It's silent.** The code that sings the song on the original website has been completely removed, so it should not make a noise, even if it is 9 o'clock on a Saturday.
- **The cursor can be hidden.** The cursor will be hidden if it's on the clock.
- **Messages can be displayed.** There's also a text box below the clock for displaying messages.
- **It's highly customizable through commands.** You can change the look of the website through CSS injection. This will be described in detail in the next section. You can also add stopwatches and timers!

## Contents
1. [CSS Injection](#css-injection)
    1. [Selectors](#selectors)
    2. [Examples](#examples)
2. [More Commands](#more-commands)

## CSS Injection
You may change the styles of the clock without using an element inspector by typing some CSS into the text area. This is useful for when you want to reuse styles that you have made previously.

The syntax is like this:
```
>> <selector> { <property>: <value>[; <property2>: <value2>[; <property3>: <value2>...]] }
```

Some things to keep in mind:
- The `>>` in the front of each line is important. It lets the website know that the line is a command.
- Spaces are important. Put a space after the `>>`, around curly braces, and between each declaration and property/value pair.
- You may declare more than one property at a time, as long as they are on the same line and separated by semicolons.
- Each selector should have its own line.

### Selectors

| Selector                 | Description                                      |
| :----------------------- | :----------------------------------------------- |
| `body`                   | Use this to change the background                |
| `#main`                  | The div that the objects are in                  |
| `--main`                 | Selects the clock and the text box               |
| `h1`                     | Selects all objects (not including the textarea) |
| `.clock`                 | Selects clocks                                   |
| `.stopwatch`             | Selects stopwatches                              |
| `.timer`                 | Selects timers                                   |
| `--finished`             | Selects finished timers (saves for future ones too) |
| `textarea`               | Selects the text box                             |
| `--foot`                 | Selects the whole footer                         |

### Examples
These examples also use the `done` command, which is described in the next section.

Hide the footer (basic example)
```
>> footer { display: none }
```

Make the clock bigger then clear (`done` example)
```
>> #clock { font-size: 200px }
>> done
```
Set the background to an image (multi property example)
```
>> body { background-image: url("https://i.imgur.com/Uyzdxlu.gif"); background-repeat: no-repeat; background-position: center center }
>> done
```

<!-- removed in favor of the next one
Change the colors to mimic the original website (multi-line example)
```
>> body { background-color: #ffffff }
>> #clock { color: #000000 }
>> --foot { color: #dcdcdc }
>> done
```
-->

There's no need to be upset (multi-line example)
```
>> textarea { background: #000000 url("https://i.imgur.com/Uyzdxlu.gif") no-repeat top center }
>> h1 { font-size: 150px }
>> --foot { display: none }
>> done
```

## More Commands
There are additional commands that can create or delete objects, among other utility commands. Remember to type `>>` before each command.

### `create <object> [options]`
Creates a new object. `<object>` can be `clock`, `timer`, or `stopwatch`. `create timer` also requires another argument for the duration or the timer, written in the h\:m:s format.

#### Examples of `create`
Create a stopwatch
```
>> create stopwatch
```

Create a 12 minute and 30 second timer
```
>> create timer 0:12:30
```

### `done`
Blurs the textarea. On most browsers, this means that you are no longer typing in the textarea and the blue border goes away.
