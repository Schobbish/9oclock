$(document).ready(function() {
    var d;
    var verbose = false;
    // this will run fifty times a second (for accuracy)
    setInterval(function() {
        d = new Date();
        $('#clock').html(d.toLocaleTimeString('en-us'));
    }, 20);

    // for commands in the textarea
    $('textarea').change(function() {
        /* TEST COMMANDS:
>>> verbose please
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
            if(lines[i].split(' ', 1) == '>>') {
                // properties are keys and values are values
                var styles = {};
                // split at the curly brace to separate the selector from the declaration
                var selectDeclar = lines[i].split(' { ', 2);
                // take out >>> from the first value of sd to get the selector
                var selector = selectDeclar[0].replace('>>> ', '');

                // allows for a done command later
                switch(selector) {
                    case 'done':
                        $(this).val('');
                        break;
                    case 'verbose please':
                        verbose = true;
                        console.log('verbose mode is on');
                        break;

                    default:
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
                        if(verbose) {
                            console.log('selector: ' + selector);
                            var counter = 0;
                            for(var property in styles) {
                                counter++;
                                console.log('property' + counter + ': ' + property);
                                console.log('   value' + counter + ': ' + styles[property]);
                            }
                        }
                        $(selector).css(styles);
                        break;
                }
                // log the command
                console.log(lines[i]);
                if(verbose) {
                    // add extra line for readibilty
                    console.log('\n');
                }
            }
        }
   });
});
