/*jshint esversion: 6*/
/* TODO:
 * Make timer/stopwatch correctly display times above 23:59:59
 * previous command shortcut
 * update css command
 * Update documentation
 * Put stuff that doesn't need to be in the doc ready function outside it
 * DRY stuff
 *
 * TEST COMMANDS:
>> verbose please
>> h1 { color: red; font-family: "Trebuchet MS"; font-size: 32px; }
>> --finished { color: blue }
>> create clock
>> create stopwatch
>> create timer 00:1:5
>> done
**/


class Clock {
    constructor() {
        // find timezone name for hover text (don't do hover text for default clocks)
        var timeZoneName = (new Date()).toLocaleTimeString('en-US', { hour12: "false", timeZoneName: "short" }).split(' ')[2];

        $('#main').append(`<h1 class="clock" id="object${objectCounter}"></h1>`);
        // with hover text:
        // $('#main').append(`<h1 class="clock" id="object${objectCounter}" title="Time zone: ${timeZoneName}"></h1>`);
        this.objectID = objectCounter;
        objectCounter++;
    }
    update() {
        $(`#object${this.objectID}`).html(d.toLocaleTimeString('en-us'));
    }
}


class Countdown {
    constructor(time) {
        // time should be a string in the hh:mm:ss format
        $('#main').append(`<h1 class="countdown" id="object${objectCounter}"></h1>`);
        this.objectID = objectCounter;
        this.object = document.getElementById(`object${this.objectID}`);
        this.finished = false;
        objectCounter++;

        // parse duration
        this.targetTime = new Date(d.toDateString() + ' ' + time);

        // add another day if this date already passed
        if (this.targetTime.getTime() <= d.getTime())
            this.targetTime.setDate(this.targetTime.getDate() + 1);
    }
    update() {
        if (!this.finished) {
            this.timeLeft = new Date(this.targetTime.getTime() - d.getTime());

            // check if there's still time left
            if (this.timeLeft.getTime() < 0) {
                // stop the timer
                this.finished = true;
                interval = 50;

                $(`#object${this.objectID}`).addClass('finished');
                $('.finished').css(finishedStyles);
                // change color to red if not specified
                if (!finishedStyles.color)
                    $(`#object${this.objectID}`).css('color', '#ff0000');
                if (verbose)
                    console.log(`the countdown clock #object${this.objectID} has ended.`);
            } else {
                $(`#object${this.objectID}`).html(parseDate(this.timeLeft, 'countdown'));
            }
        }
    }
}


class Timer {
    constructor(duration) {
        // duration should be a string in the hh:mm:ss format
        $('#main').append(`<h1 class="timer" id="object${objectCounter}">${this.output}</h1>`);
        this.objectID = objectCounter;
        this.object = document.getElementById(`object${this.objectID}`);
        this.lastTime = 0;
        this.going = false;
        this.finished = false;
        objectCounter++;

        // parse duration
        this.durationString = duration;
        this.durationNumbers = this.durationString.split(':');
        this.durationHours = parseInt(this.durationNumbers[0]);
        this.durationMinutes = parseInt(this.durationNumbers[1]);
        this.durationSeconds = parseInt(this.durationNumbers[2]);
        this.durationDate = new Date(Date.UTC(70, 0, 1, this.durationHours, this.durationMinutes, this.durationSeconds, 0));

        $(`#object${this.objectID}`).html(parseDate(this.durationDate, 'timer'));

        this.object.addEventListener('mouseup', function() {
            // get object id
            var id = $(this).attr('id').slice(6);
            for (var i = 0; i < objects.length; i++) {
                // find object with that id
                if (objects[i].objectID == id) {
                    // reverse `going` value
                    if (objects[i].going == true) {
                        objects[i].pause();
                    } else {
                        objects[i].start();
                    }
                    break;
                }
            }
        });
    }
    start() {
        this.startTime = d;
        // prevents the timer from starting again once finished
        if (!this.finished) {
            this.going = true;
        }
    }
    pause() {
        this.lastTime = d - this.startTime + this.lastTime;
        this.going = false;
    }
    update() {
        if (this.going) {
            this.timeLeft = new Date(this.durationDate.getTime() - (d - this.startTime + this.lastTime));
            // check if there's any time left
            if (this.timeLeft.getTime() < 0) {
                // stop timer
                this.finished = true;
                this.going = false;

                $(`#object${this.objectID}`).addClass('finished');
                $('.finished').css(finishedStyles);
                // change color to red if not specified
                if (!finishedStyles.color)
                    $(`#object${this.objectID}`).css('color', '#ff0000');
                if (verbose)
                    console.log(`the timer #object${this.objectID} has ended.`);
            } else {
                // update timer normally
                $(`#object${this.objectID}`).html(parseDate(this.timeLeft, 'timer'));
            }
        }
    }
}


class Stopwatch {
    constructor() {
        $('#main').append(`<h1 class="stopwatch" id="object${objectCounter}">00:00.00</h1>`);
        this.objectID = objectCounter;
        this.object = document.getElementById(`object${this.objectID}`);
        // time from the last time the stopwatch was stopped
        // set to 3594000 to test hour change
        this.lastTime = 0;
        this.going = false;
        objectCounter++;

        this.object.addEventListener('mouseup', function() {
            // get object id
            var id = $(this).attr('id').slice(6);
            for (var i = 0; i < objects.length; i++) {
                // find object with that id
                if (objects[i].objectID == id) {
                    // reverse `going` value
                    if (objects[i].going == true) {
                        objects[i].pause();
                    } else {
                        objects[i].start();
                    }
                    break;
                }
            }
        });
    }
    start() {
        // reset startTime and start stopwatch
        this.startTime = d;
        this.going = true;
    }
    pause() {
        // store time and pause stopwatch
        this.lastTime = d - this.startTime + this.lastTime;
        this.going = false;
        // slower interval so that computer runs better (~60% better on my computer!)
        // if there are other stopwatches going interval will go back up
        interval = 50;
    }
    update() {
        if (this.going) {
            this.duration = new Date(d - this.startTime + this.lastTime);
            $(`#object${this.objectID}`).html(parseDate(this.duration, 'stopwatch'));
        }
    }
}


// converts a date to hh:mm:ss or a similar format
function parseDate(date, mode) {
    // add zero padding first
    var hours = date.getUTCHours().toString();
    var minutes = date.getUTCMinutes().toString().padStart(2, 0);
    var seconds = date.getUTCSeconds().toString().padStart(2, 0);
    var centiseconds;
    var output;

    if (date.getUTCHours() > 0) {
        // change format when over an hour
        output = `${hours}:${minutes}:${seconds}`;
        // enforce slower interval (this sometimes makes centiseconds look weird)
        interval = 50;
    } else {
        // stopwatch: with centiseconds; timer: without centiseconds
        if (mode == 'stopwatch') {
            // keep interval at 10 to show accurate centiseconds
            interval = 10;
            // i only want two digits for centiseconds
            centiseconds = date.getUTCMilliseconds().toString().padStart(3, 0).slice(0, 2);
            output = `${minutes}:${seconds}.${centiseconds}`;
        } else if (mode == 'timer') {
            output = `${minutes}:${seconds}`;
        } else if (mode == 'countdown') {
            // show centiseconds if less than one minute to go
            if (date.getUTCMinutes() <= 0) {
                interval = 10;
                centiseconds = date.getUTCMilliseconds().toString().padStart(3, 0).slice(0, 2);
                output = `${seconds}.${centiseconds}`;
            } else {
                output = `${minutes}:${seconds}`;
            }
        }
    }
    if (date == 'Invalid Date')
        output = 'Invalid Date';
    return output;
}

// remove an object based on its position in the objects array
function remove(position) {
    var idOfObject = objects[position].objectID;
    $(`#object${idOfObject}`).remove();
    objects.splice(position, 1);
    return 0;
}

var d;
var objectCounter = 0;
var objects = [new Clock()];
var verbose = false;
// styles for .finished; applied when a timer finishes
var finishedStyles = {};
var interval = 50;


$(document).ready(function() {
    // for commands in the textarea
    $('textarea').keyup(function(event) {
        // keyup feels weird but it won't leave an enter afterwards
        if(event.key == 'Enter') {
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
                            $(this).blur();
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
                                case 'countdown':
                                    objects.push(new Countdown(words[2]));
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
                            if (selectDeclar[0] == '--finished') {
                                finishedStyles = Object.assign(finishedStyles, styles);
                                if (verbose)
                                    console.log('styles saved for when a timer is finished');
                                $('.finished').css(styles);
                            } else {
                                $(selectDeclar[0]).css(styles);
                            }
                    }
                    // log the command
                    console.log(lines[i]);
                    if (verbose) {
                        // add extra line for readibilty
                        console.log('\n');
                    }
                    // clear box for next command
                    $(this).val('');
                }
            }
        }
    });

    // press shift+period (gt symbol) to focus the textarea
    $(window).keydown(function(event) {
        if (event.key === '>') {
            $('textarea').focus();
            // and apparently keydown goes before typing so no need for this
            // $('textarea').val($('textarea').val() + '>')
        }
    });

    // this is like setInterval except the interval can be changed
    function intervalFunct() {
        d = new Date();
        if (objects) {
            for (var i = 0; i < objects.length; i++) {
                objects[i].update();
            }
        }
        // recursive
        setTimeout(intervalFunct, interval);
    }
    setTimeout(intervalFunct, interval);
});
