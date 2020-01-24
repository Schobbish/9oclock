/**
 * @file Brains of the projector clock.
 * @author Nathaniel Adam
 * @license MIT
 */


/** Generic error display. */
class ClockErr {
    /**
     * Creates an error message.
     * @param {string} message Error message to display.
     */
    constructor(message) {
        this.display = message;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="error" id="widget${this.id}">${this.display}</h1>`);
    }

    /** Does nothing. */
    update() {
        // no update action
    }
}


/** Clock widget. Has seconds and supports different time zones. */
class Clock {
    /**
     * Creates a clock.
     * @param {string} [timeZone] Time zone as UTC offset or abbreviation.
     */
    constructor(timeZone) {
        this.timeZone;
        this.timeZoneName;
        this.error = false;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="clock" id="widget${this.id}">clock</h1>`);

        if (timeZone) {
            // if valid time zone abbr,
            //  set timeZone appropriately and set timeZoneName to that abbr.
            // else if valid UTC offset,
            //  set timeZone to that and have no timeZoneName.
            // else if invalid, pretend it never existed
            if (tzAbbrs.hasOwnProperty(timeZone)) {
                this.timeZone = moment().utcOffset(tzAbbrs[timeZone]).format("Z");
                this.timeZoneName = timeZone.toUpperCase();
            } else if (timeZone.match(/Z|[+-]\d\d(?::?\d\d)?/)) {
                // regex from moment.js source for UTC offsets (MIT)
                this.timeZone = moment().utcOffset(timeZone).format("Z");
            } else {
                // display error
                this.error = true;
                console.error(`clock: invalid time zone: ${timeZone}`);
                // remove clock class and add error class (questionable?)
                $(`#widget${this.id}`).removeClass("clock");
                $(`#widget${this.id}`).addClass("error");
                $(`#widget${this.id}`).html(`clock: invalid time zone: ${timeZone}`);
            }
        }
    }

    /** Updates the time on the clock. */
    update() {
        // do nothing if error else show time zone if set else show local time
        if (this.error) {

        } else if (this.timeZone) {
            // if there is a time zone name show that else show UTC offset
            if (this.timeZoneName) {
                $(`#widget${this.id}`).html(moment().utcOffset(this.timeZone).format(`LTS [${this.timeZoneName}]`));
            } else {
                $(`#widget${this.id}`).html(moment().utcOffset(this.timeZone).format("LTS [UTC]Z"));
            }
        } else {
            $(`#widget${this.id}`).html(moment().format("LTS"));
        }
    }
}


/** Stopwatch widget which can be clicked to start/pause. */
class Stopwatch {
    /**
     * Creates a stopwatch.
     * @param {string} [startTime] start at this time (format: d.h:m:s)
     */
    constructor(startTime) {
        /** Is the stopwatch going?? or not?? */
        this.going = false;
        /** Time in ms */
        this.totalTime = 0;
        this.stopTime = moment();
        /** Text for HTML title property. */
        this.title = "Click to start the stopwatch.";
        this.error = false;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="stopwatch" id="widget${this.id}" title="${this.title}">00:00.00</h1>`);
        if (startTime) {
            // check if valid duration (asp net time span)
            if (checkAspNetDuration(startTime)) {
                this.totalTime = moment.duration(startTime);
                $(`#widget${this.id}`).html(this.durToString());
            } else {
                // display error
                this.error = true;
                console.error(`stopwatch: invalid start time: ${startTime}`);
                $(`#widget${this.id}`).prop("title", "");
                $(`#widget${this.id}`).removeClass("stopwatch");
                $(`#widget${this.id}`).addClass("error");
                $(`#widget${this.id}`).html(`stopwatch: invalid start time: ${startTime}`);
            }
        }

        $(`#widget${this.id}`).click(function () {
            var id = $(this).attr('id').slice(6);
            for (const widget of activeWidgets) {
                // find widget with that id
                if (widget.id == id) {
                    // reverse `going` value
                    if (widget.going == true) {
                        widget.pause();
                    } else {
                        widget.start();
                    }
                    break;
                }
            }
        });
    }

    /** Starts the stopwatch. */
    start() {
        if (!this.error) {
            // reset startTime
            this.startTime = moment();
            this.going = true;
            this.title = "Click to pause the stopwatch.\n";

            // update title text
            // totalTime == 0 means that it was started at zero
            if (!this.totalTime) {
                this.title += "Started ";
            } else {
                this.title += "Would have started ";
            }
            this.title += moment().subtract(this.totalTime).calendar(null, {
                lastDay: "[yesterday at] LTS",
                sameDay: "[at] LTS",
                nextDay: "[tomorrow at] LTS",
                lastWeek: "[last] dddd [at] LTS",
                nextWeek: "[next] dddd [at] LTS",
                sameElse: "YYYY-MM-DD [at] LTS"
            }) + ".";

            $(`#widget${this.id}`).prop("title", this.title);
        }
    }

    /** Pauses the stopwatch. */
    pause() {
        if (!this.error) {
            // store duration stopwatch was going for
            this.going = false;
            this.totalTime += moment().diff(this.startTime);
            this.stopTime = moment();
            this.title = "Click to start the stopwatch.";

            $(`#widget${this.id}`).html(this.durToString());
            $(`#widget${this.id}`).prop("title", this.title);
        }
    }

    /**
     * Gets stopwatch's duration and outputs as string.
     * @returns {String} Duration in form [h:]mm:ss.cc (no days, just hours)
     */
    durToString() {
        // dur must be initialized for some reason (scopes???)
        var dur;
        var outStr = "";

        // better to get the duration from totalTime when stopped
        if (this.going) {
            dur = moment.duration(moment().diff(this.startTime) + this.totalTime);
        } else {
            dur = moment.duration(this.totalTime);
        }
        if (dur.asHours() >= 1) {
            outStr += Math.floor(dur.asHours()) + ":";
        }

        outStr += dur.minutes().toString().padStart(2, 0) + ":";
        outStr += dur.seconds().toString().padStart(2, 0) + ".";
        outStr += dur.milliseconds().toString().padStart(3, 0).slice(0, 2);

        return outStr;
    }

    /** Updates the time on stopwatch. */
    update() {
        if (this.going && !this.error) {
            interval = 10;
            $(`#widget${this.id}`).html(this.durToString());
        }
    }
}


/** List of available widgets. Widget objects must get registered here. */
var availableWidgets = {
    "clock": Clock,
    "stopwatch": Stopwatch
};
/** List of widgets currently active on the page. */
var activeWidgets = [];
/** For widget IDs */
var widgetCounter = 0;
/**
 * Inverval, in ms, at which the website updates.
 * 50 is normal, 10 for when there is a stopwatch or a timer < 60s
 */
var interval = 50;

/** List of commands. Commands live here. */
var cmds = {
    // each command name should have an object with a `run()` function inside
    "create": {
        /**
         * Creates a new widget.
         * @param {string} newWidget Widget to be created.
         * @param {...*} args Args to pass to widget constructor.
         */
        execute(newWidget, ...args) {
            if (availableWidgets[newWidget]) {
                // https://stackoverflow.com/a/8843181
                // need to add null to beginning of args first
                args.splice(0, 0, null);
                activeWidgets.push(
                    new (Function.prototype.bind.apply(
                        availableWidgets[newWidget], args)));
            } else {
                console.error(`projector error: widget not found: ${newWidget}`);
                activeWidgets.push(new ClockErr(`error: widget not found: ${newWidget}`));
            }
        }

    }, "delete": {
        /**
         * Deletes widget at index.
         * @param {int} index This is the index.
         */
        execute(index) {
            if (activeWidgets[index]) {
                // delete element by id
                $(`#widget${activeWidgets[index].id}`).remove();
                activeWidgets.splice(index, 1);
            } else {
                console.error(`projector error: invalid index to delete: ${index}`);
            }
        }

    }, "done": {
        /**
         * Gets cursor out of textarea.
         */
        execute() {
            // needs testing
            $("textarea").blur();
        }
    }
};

/**
 * Parses and runs commands.
 * @param {string} cmd Command to run.
 * @returns {boolean} true if command was valid
 */
function run(cmd) {
    if (cmd.split(" ")[0] === ">>") {
        // then yes it is a command we need to run
        // make all lowercase (hopefully this won't matter)
        cmd = cmd.toLowerCase();
        // permanent console log
        console.log(cmd);

        /** Arguments given to command line. `args[0]` is the command name. */
        const args = cmd.split(" ").slice(1);
        if (cmds[args[0]]) {
            // gives all args after the first to the command
            cmds[args[0]].execute.apply(null, args.slice(1));
        } else {
            console.error(`projector error: command not found: ${args[0]}`);
            activeWidgets.push(new ClockErr(`error: command not found: ${args[0]}`));
        }

        return true;
    } else {
        return false;
    }
}

/**
 * Checks if a string is a duration of form [d.]h:m[:s].
 * Regex from moment.js source (MIT)
 * @param {string} dur Duration string to check.
 * @returns {boolean} true if duration was valid.
 */
function checkAspNetDuration(dur) {
    if (dur.match(/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/)) {
        return true;
    } else {
        return false;
    }
}


$(document).ready(function () {
    activeWidgets.push(new Clock());

    // main thing that detects command inputs
    $("textarea").keydown(function () {
        // using event.code rather than event.key for compatibility
        // hopefully it won't matter for other keyboard layouts
        if (event.code === "Enter") {
            lines = $(this).val().split("\n");
            for (const cmd of lines) {
                if (run(cmd)) {
                    // clear box and prevent enter from printing if valid cmd
                    $(this).val("");
                    event.preventDefault();
                }
            }
        }

        // escape to blur
        if (event.code === "Escape") {
            $(this).blur();
        }
    });

    // press shift+period (greater than symbol) to focus the textarea
    $(window).keydown(function () {
        // event.key does not work on windows xp. too bad for them.
        // can't use event.code because that would assume layout
        if (event.key === ">") {
            $("textarea").focus();
        }
    });

    /**
     * Updates all widgets.
     * Uses setTimeout in a way that allows the delay (var interval)
     * to be set dynamically.
     */
    function intervalFunct() {
        // reset interval
        interval = 50;
        if (activeWidgets) {
            for (const widget of activeWidgets) {
                widget.update();
            }
        }
        // recursive!!
        setTimeout(intervalFunct, interval);
    }
    setTimeout(intervalFunct, interval);
});
