$(document).ready(function() {
    var d;
    // this will run fifty times a second (for accuracy)
    setInterval(function() {
        d = new Date();
        $('#clock').html(d.toLocaleTimeString('en-us'));
    }, 20);

    // for commands in the textarea
    $('textarea').change(function() {
        /* TEST COMMANDS:
>>> h1 { color: red; font-family: "Trebuchet MS"; font-size: 32px; }
>>> --foot { display: none }
>>> done
        */
        // get value of textarea
        text = $(this).val();
        // split at each line
        lines = text.split('\n');
        
        for(var i = 0; i < lines.length; i++) {
            // check if a command by splitting at the first space
            if(lines[i].split(' ', 1) == '>>>') {
                // properties are keys and values are values
                var styles = {};
                // split at the curly brace to separate the selector from the declaration
                var selectDeclar = lines[i].split(' { ', 2);
                // take out >>> from the first value of sd to get the selector
                var selector = selectDeclar[0].replace('>>> ', '');

                // allows for a done command later
                if(selector != 'done') {
                    // split into individual declarations
                    var declars = selectDeclar[1].split('; ');
                    // take off curly brace from the last declaration
                    var lastDeclar = declars.length - 1;
                    declars[lastDeclar] = declars[lastDeclar].replace(' }', '');

                    // for every declaration...
                    for(var j = 0; j < declars.length; j++) {
                        // split the declaration by the colon to get property and its value
                        var propVal = declars[j].split(': ', 2);
                        // assign value to property in dictionary
                        styles[propVal[0]] = propVal[1];
                    }

                    // handle special selectors
                    if(selector == '--main') {
                        selector = '#clock, textarea';
                    }
                    if(selector == '--foot') {
                        selector = 'footer, footer p, footer a';
                    }

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
