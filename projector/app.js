$(document).ready(function() {
    /*
    This one has no if statment and can't play the song
    */
    var d;

    // this will run fifty times a second (for accuracy)
    setInterval(function() {
        d = new Date();
        $('#clock').html(d.toLocaleTimeString('en-us'));
    }, 20);

    // for commands in the textarea
    $('textarea').change(function() {
        /* TEST COMMAND:
>>> h1 { color: red; font-family: "Times New Roman; font-size: 16 }
        */
        // get value of textarea
        text = $(this).val();
        // split at each line
        lines = text.split('\n');
        for(var i = 0; i < lines.length; i++) {
            // check if a command by splitting at the first space
            if(lines[i].split(' ', 1) == '>>>') {
                // properties are keys and values are values
                // this will only ever have one item but it must be done this way
                var styles = {};

                // split at the curly brace to separate the selector from the declaration
                var selectDeclar = lines[i].split(' { ', 2);
                // take out >>> from the first value of sd to get the selector
                var selector = selectDeclar[0].replace('>>> ', '');

                // allows for a done command later
                if(selector != 'done') {
                    // split the declaration by the colon to get property and its value
                    var propVal = selectDeclar[1].split(': ', 2);

                    // assign value to property in dictionary
                    styles[propVal[0]] = propVal[1];
                    if(selector == '--main') {
                        // this selector will select #clock and textarea
                        selector = '#clock, textarea';
                    }
                    if(selector == '--foot') {
                        // this selector will selector the footer and the paragraph and links in it
                        selector = 'footer, footer p, footer a';
                    }
                    // use the styles dictionary to set the css
                    $(selector).css(styles);
                } else {
                    // creates the done command
                    $(this).val('');
                }
                // log the command
                console.log(lines[i]);
            }
        }
   });
});
