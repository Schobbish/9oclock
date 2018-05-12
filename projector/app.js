/*jshint esversion: 6*/
/* TODO:
 * Stopwatch - translate miliseconds to an actual time
 * Timer - ?? create countdown??
 * Put stuff that doesn't need to be in the doc ready function outside it
 * DRY stuff
 *
 * TEST COMMANDS:
>> verbose please
>> h1 { color: red; font-family: "Trebuchet MS"; font-size: 32px; }
>> --foot { display: none }
>> create clock
>> done
**/
class Clock {
    constructor() {
        $('#main').append(`<h1 class="clock" id="object${objectCounter}"></h1>`);
        this.objectID = objectCounter;
        objectCounter++;
    }
    update() {
        this.d = new Date();
        $(`#object${this.objectID}`).html(this.d.toLocaleTimeString('en-us'));
        return this.d;
    }
}
class Timer {
    constructor(duration) {
        $('#main').append(`<h1 class="timer" id="object${objectCounter}"></h1>`);
        this.objectID = objectCounter;
        this.creationTime = new Date();
        this.duration = duration;
        objectCounter++;
    }
}
class Stopwatch {
    constructor() {
        $('#main').append(`<h1 class="stopwatch" id="object${objectCounter}"></h1>`);
        this.objectID = objectCounter;
        this.creationTime = Date.now();
        objectCounter++;
    }
    update() {
        this.d = new Date();
        this.duration = new Date(2000, 0, 0, 0, 0, 0, this.d - this.creationTime);
        $(`#object${this.objectID}`).html();
    }
}
// remove an object based on its position in the objects array
function remove(position) {
    var idOfObject = objects[position].objectID;
    $(`#object${idOfObject}`).remove();
    objects.splice(position, 1);
    return 0;
}
var objectCounter = 0;
var objects = [new Clock()];
var verbose = false;


$(document).ready(function() {
    // for commands in the textarea
    $('textarea').change(function() {
        // get value of textarea
        text = $(this).val();
        // split at each line
        lines = text.split('\n');

        for (var i = 0; i < lines.length; i++) {
            // check if a command by splitting at the first space
            if (lines[i].split(' ', 1) == '>>') {
                // take out >>; the current command
                var command = lines[i].replace('>> ', '');
                // words in current command
                var words = command.split(' ');

                switch (words[0]) {
                    case 'done':
                        $(this).val('');
                        break;
                    case 'verbose':
                        switch (words[1]) {
                            case 'please':
                                verbose = true;
                                console.log('verbose mode is on');
                                break;
                            case 'off':
                                verbose = false;
                                console.log('verbose mode is off');
                                break;
                        }
                        break;
                    case 'delete':
                        remove(words[1]);
                        break;
                    case 'create':
                        switch (words[1]) {
                            case 'footer':
                                $('footer').show();
                                break;
                            case 'clock':
                                objects.push(new Clock());
                                break;
                            case 'timer':
                                objects.push(new Timer(words[2]));
                                break;
                            case 'stopwatch':
                                objects.push(new Stopwatch());
                                break;
                            default:
                                console.warn(words[1] + ' is not an object you can create');
                        }
                        break;

                    default:
                        // for css injection

                        // properties are keys and values are values
                        var styles = {};
                        // split at the curly brace to separate the selector from the declaration
                        var selectDeclar = command.split(' { ', 2);
                        // split into individual declarations
                        var declars = selectDeclar[1].split('; ');
                        // take off curly brace from the last declaration
                        var lastDeclar = declars.length - 1;
                        declars[lastDeclar] = declars[lastDeclar].replace(' }', '');

                        // for every declaration...
                        for (var j = 0; j < declars.length; j++) {
                            // split the declaration by the colon to get property and its value
                            var propVal = declars[j].split(': ', 2);
                            // assign value to property in dictionary
                            styles[propVal[0]] = propVal[1];
                        }

                        // handle special selectors
                        if (selectDeclar[0] == '--main') {
                            selectDeclar[0] = '#main *, textarea';
                        }
                        if (selectDeclar[0] == '--foot') {
                            selectDeclar[0] = 'footer, footer p, footer a';
                        }
                        if (verbose) {
                            console.log('selector: ' + selectDeclar[0]);
                            var counter = 0;
                            for (var property in styles) {
                                counter++;
                                console.log('property' + counter + ': ' + property);
                                console.log('   value' + counter + ': ' + styles[property]);
                            }
                        }
                        $(selectDeclar[0]).css(styles);
                }
                // log the command
                console.log(lines[i]);
                if (verbose) {
                    // add extra line for readibilty
                    console.log('\n');
                }
            }
        }
    });
    // this will run fifty times a second (for accuracy)
    setInterval(function() {
        if (objects) {
            for (var i = 0; i < objects.length; i++) {
                objects[i].update();
            }
        }
    }, 10);
});
