# Projector Mode Documentation
The projector mode is made to display only a clock on a projector or other display. It has a couple extra features that the original website does not have:

- **It's silent.** The code that sings the song on the original website has been completely removed, so it should not make a noise, even if it is 9 o'clock on a Saturday.
- **The cursor can be hidden.** The cursor will be hidden if it's on the clock.
- **Messages can be displayed.** There's also a text box below the clock for displaying messages.
- **It's highly customizable through commands.** You can change the look of the website through CSS-style commands. This will be described in detail in the next section.

## Commands
The syntax is like this: 
```
>>> <selector> { <property>: <value>
```
It's basically like CSS (in fact it uses jQuery's CSS function), except that you currently can only declare one property at a time, and every line is preceded with `>>>`. Notice also that the curly brace doesn't get closed. 
