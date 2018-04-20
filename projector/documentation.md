# Projector Mode Documentation
The projector mode is made to display only a clock on a projector or other display. It has a couple extra features that the original website does not have:

- **It's silent.** The code that sings the song on the original website has been completely removed, so it should not make a noise, even if it is 9 o'clock on a Saturday.
- **The cursor can be hidden.** The cursor will be hidden if it's on the clock.
- **Messages can be displayed.** There's also a text box below the clock for displaying messages.
- **It's highly customizable through commands.** You can change the look of the website through CSS-style commands. This will be described in detail in the next section.

## Commands
The syntax is like this:
```
>> <selector> { <property>: <value>[; <property2>: <value2>] }
```
It's basically like CSS (in fact it uses jQuery's CSS function). You can declare more than one property at a time as long as they're on the same line and separated by semicolons. It is not recommended to put a semicolon after the last declaration. Spaces are important because the script splits the command at spaces. Avoid using colons, semicolons, and curly braces in selectors, properties, and values because the script also uses those characters for splitting.

Here are some useful selectors:

| Selector                 | Description                       |
| :----------------------- | :-------------------------------- |
| `body`                   | Use this to change the background |
| `#clock` or `h1`         | Selects the clock                 |
| `#message` or `textarea` | Selects the text box              |
| `footer`                 | Selects the footer                |

There are also some special selectors:

| Selector | Description                                                       |
| :------- | :---------------------------------------------------------------- |
| `--main` | Selects the clock and the text box                                |
| `--foot` | Selects the footer, the paragraph in it, and the links in the paragraph |
| `done`   | Clears the text box (helpful when copying and pasting commands)   |
| `verbose please` | Logs more stuff in the console (can't be turned off afterwards) |

### Examples
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

Change the colors to mimic the original website (multi-line example)
```
>> body { background-color: #ffffff }
>> #clock { color: #000000 }
>> --foot { color: #dcdcdc }
>> done
```
