/**
 * @file Brains of the clock.
 * @author Nathaniel Adam
 * @license MIT
 * @todo history feature, insert command
 * @todo run/save script
 * @todo event got deprecated??
 */


/**
 * Generic error display.
 * Should use showError() to replace a widget with an error
 */
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
        reapplyStyles();
    }

    /** Does nothing. */
    update() { }
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
                reapplyStyles();
            } else if (timeZone.match(/Z|[+-]\d\d(?::?\d\d)?/)) {
                // regex from moment.js source for UTC offsets (MIT)
                this.timeZone = moment().utcOffset(timeZone).format("Z");
                reapplyStyles();
            } else {
                // display error
                this.error = true;
                showError(this.id, "clock", `invalid time zone: ${timeZone}`);
            }
        } else {
            // need to reapply styles after any widget is made
            reapplyStyles();
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


/** Countdown widget */
class Countdown {
    /**
     * Creates a countdown timer.
     * @param {string} time Time to count down to
     */
    constructor(time) {
        this.error = false;
        this.finished = false;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="countdown" id="widget${this.id}" title="${this.title}">countdown</h1>`);

        if (time) {
            // validate time using checkAspNetDuration for consistency
            if (checkAspNetDuration(time)) {
                // let moment.js do the parsing
                var timeAsDur = moment.duration(time);
                // replace the current time with the parts of the duration
                this.targetTime = moment();
                this.targetTime.milliseconds(timeAsDur.milliseconds());
                this.targetTime.seconds(timeAsDur.seconds());
                this.targetTime.minutes(timeAsDur.minutes());
                this.targetTime.hours(timeAsDur.hours());
                // if targetTime has passed, add one more day
                if (this.targetTime < moment()) {
                    this.targetTime.add(1, "day");
                }
                // add additional days from duration
                this.targetTime.add(timeAsDur.days(), "day");
                this.title = this.targetTime.format("[Counting down to] Y-MM-DD LTS");
                $(`#widget${this.id}`).prop("title", this.title);
                reapplyStyles();
            } else {
                this.error = true;
                showError(this.id, "countdown", `invalid time: ${time}`);
            }
        } else {
            this.error = true;
            showError(this.id, "countdown", "time is required");
        }
    }

    /**
     * Gets the time left as a string.
     * Copy of from Timer.timeToString() (not good)
     * @returns {string} The time left in the form [[h:]m:]s[.cc].
     */
    timeToString() {
        var outStr = "";

        // don't want hours or minutes if unnecessary
        // if less than one minute show centiseconds.
        if (this.timeLeft.asHours() >= 1) {
            // unlike Stopwatch.totalTime timeLeft updates every cycle
            outStr += Math.floor(this.timeLeft.asHours()) + ":";
        }
        if (this.timeLeft.asMinutes() >= 1) {
            outStr += this.timeLeft.minutes().toString().padStart(2, "0") + ":";
            outStr += this.timeLeft.seconds().toString().padStart(2, "0");
        } else {
            outStr += this.timeLeft.seconds().toString().padStart(2, "0");
            outStr += "." + this.timeLeft.milliseconds().toString().padStart(3, "0").slice(0, 2);
        }
        return outStr;
    }

    /** Updates the countdown. */
    update() {
        if (!this.finished && !this.error) {
            this.timeLeft = moment.duration(this.targetTime.diff(moment()));

            // test if timer is done
            if (this.timeLeft.asMilliseconds() <= 0) {
                this.finished = true;
                this.title = this.targetTime.format("[Counted down to] Y-MM-DD LTS");

                $(`#widget${this.id}`).prop("title", this.title);
                $(`#widget${this.id}`).html("00.00");
                $(`#widget${this.id}`).addClass("finished finishedCountdown");
                reapplyStyles();
            } else {
                // faster interval if less than one min (centisecs are showing)
                if (this.timeLeft.asMinutes() < 1) {
                    interval = 10;
                }
                $(`#widget${this.id}`).html(this.timeToString());
            }
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
        this.error = false;
        /** Time in ms */
        this.totalTime = 0;
        this.stopTime = moment();
        /** Text for HTML title property. */
        this.title = "Click to start the stopwatch.";
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="stopwatch" id="widget${this.id}" title="${this.title}">00:00.00</h1>`);

        if (startTime) {
            // check if valid duration (asp net time span)
            if (checkAspNetDuration(startTime)) {
                this.totalTime = moment.duration(startTime);
                $(`#widget${this.id}`).html(this.durToString());
                reapplyStyles();
            } else {
                // display error
                this.error = true;
                showError(this.id, "stopwatch", `invalid start time: ${startTime}`);
            }
        } else {
            reapplyStyles();
        }

        $(`#widget${this.id}`).click(function () {
            const id = $(this).attr('id').slice(6);
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
            this.title += moment().subtract(this.totalTime).calendar(null, calendarSettings) + ".";

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
        outStr += dur.minutes().toString().padStart(2, "0") + ":";
        outStr += dur.seconds().toString().padStart(2, "0") + ".";
        outStr += dur.milliseconds().toString().padStart(3, "0").slice(0, 2);
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


/** Timer widget. */
class Timer {
    /**
     * Creates a timer.
     * @param {string} length Duration of timer. (format: d.h:m:s)
     */
    constructor(length) {
        /** Timer going or not. */
        this.going = false;
        this.error = false;
        this.finished = false;
        /** Time elapsed in ms. */
        this.timeElapsed = 0;
        /** Text for HTML title property. */
        this.title = "Click to start the timer.";
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="timer" id="widget${this.id}" title="${this.title}">timer</h1>`);

        // get length from param, if no length show error
        if (length) {
            // check if good duration, else show error
            if (checkAspNetDuration(length)) {
                this.len = moment.duration(length);
                this.timeLeft = this.len;
                $(`#widget${this.id}`).html(this.timeToString());
                reapplyStyles();
            } else {
                this.error = true;
                showError(this.id, "timer", `invalid length: ${length}`);
            }
        } else {
            this.error = true;
            showError(this.id, "timer", "length is required");
        }

        // give it an event handler
        $(`#widget${this.id}`).click(function () {
            const id = $(this).attr('id').slice(6);
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

    /** Starts the timer and updates its title. */
    start() {
        if (!this.error && !this.finished) {
            this.startTime = moment();
            this.going = true;

            this.title = "Click to pause the timer.\n";
            // if true, implies that it never has been paused
            if (!this.timeElapsed) {
                this.title += "Started ";
            } else {
                this.title += "Would have started ";
            }
            this.title += moment().subtract(this.timeElapsed).calendar(null, calendarSettings) + ".\n";
            this.title += "Will end ";
            this.title += moment().add(this.timeLeft).calendar(null, calendarSettings) + ".";

            $(`#widget${this.id}`).prop("title", this.title);
        }
    }

    /** Pauses the timer and updates this.timeElapsed and this.timeLeft. */
    pause() {
        if (!this.error && !this.finished) {
            this.going = false;
            // update timeElapsed and timeLeft
            this.timeElapsed += moment().diff(this.startTime);
            this.timeLeft = moment.duration(this.len - this.timeElapsed);
            this.stopTime = moment();
            this.title = "Click to start the timer.";

            $(`#widget${this.id}`).html(this.timeToString());
            $(`#widget${this.id}`).prop("title", this.title);
        }
    }

    /**
     * Gets the time left as a string.
     * @returns {string} The time left in the form [[h:]m:]s[.cc].
     */
    timeToString() {
        var outStr = "";

        // don't want hours or minutes if unnecessary
        // if less than one minute show centiseconds.
        if (this.timeLeft.asHours() >= 1) {
            // unlike Stopwatch.totalTime timeLeft updates every cycle
            outStr += Math.floor(this.timeLeft.asHours()) + ":";
        }
        if (this.timeLeft.asMinutes() >= 1) {
            outStr += this.timeLeft.minutes().toString().padStart(2, "0") + ":";
            outStr += this.timeLeft.seconds().toString().padStart(2, "0");
        } else {
            outStr += this.timeLeft.seconds().toString().padStart(2, "0");
            outStr += "." + this.timeLeft.milliseconds().toString().padStart(3, "0").slice(0, 2);
        }
        return outStr;
    }

    /** Updates the time on the timer. */
    update() {
        if (this.going && !this.finished && !this.error) {
            this.timeLeft = moment.duration(this.len - (this.timeElapsed + moment().diff(this.startTime)));

            // test if timer is done
            if (this.timeLeft.asMilliseconds() <= 0) {
                this.finished = true;
                this.stopTime = moment();
                this.title = `Ended ${this.stopTime.calendar(null, calendarSettings)}`;

                $(`#widget${this.id}`).addClass("finished finishedTimer");
                $(`#widget${this.id}`).prop("title", this.title);
                $(`#widget${this.id}`).html("00.00");
                reapplyStyles();
            } else {
                // faster interval if less than one min (centisecs are showing)
                if (this.timeLeft.asMinutes() < 1) {
                    interval = 10;
                }
                $(`#widget${this.id}`).html(this.timeToString());
            }
        }
    }
}


/** Timestamp widget. */
class Timestamp {
    /**
     * Creates a timestamp.
     * @param {...string} [format] The format of the timestamp.
     *  If omitted, ISO 8601 will be used instead.
     */
    constructor(...format) {
        this.format = format.join(" ");
        this.text = moment().format(this.format);
        this.title = this.format ? `Given format: ${this.format}` : "No format given; ISO 8601 used instead.";
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="timestamp" id="widget${this.id}" title="${this.title}">${this.text}</h1>`);
        reapplyStyles();
    }

    /** Only because it's required */
    update() { }
}


/** Whitespace widget. */
class Blank {
    /**
     * Creates the whitespace.
     * @param {string} [height="3.2em"] Height of whitespace.
     */
    constructor(height) {
        if (!height) {
            height = "1em";
        }
        this.height = height;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="blank" id="widget${this.id}" style="height: ${this.height};"></h1>`);
        reapplyStyles();

        // build title
        this.title = `Given height: ${this.height}.\nComputed height: `;
        this.title += $(`#widget${this.id}`).height();
        this.title += "px (including margins: ";
        this.title += $(`#widget${this.id}`).outerHeight(true) + "px).";
        $(`#widget${this.id}`).prop("title", this.title);
    }
    /** Only because it's required */
    update() { }
}


/** Text widget. */
class Text {
    /**
     * Creates some text!!
     * Text will have an nbsp appended to it so there isn't an invisible widget.
     * @param {...string} message Text to put on the widget!!
     *  Multiple args will be joined with a space as the separator.
     */
    constructor(...message) {
        this.text = message.join(" ");
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(`<h1 class="text" id="widget${this.id}">${this.text}</h1>`);
        reapplyStyles();
    }
    /** Only because it's required */
    update() { }
}


/**
 * Parses and runs commands.
 * @param {string} cmd Command to run.
 * @returns {boolean} true if command was valid
 */
function run(cmd) {
    if (cmd.split(" ")[0] === ">>") {
        // then yes it is a command we need to run

        // permanent console log
        console.log(cmd);

        /** Arguments given to command line. `args[0]` is the command name. */
        const args = cmd.split(" ").slice(1);
        if (cmds[args[0]]) {
            // gives all args after the first to the command
            cmds[args[0]].execute.apply(null, args.slice(1));
        } else {
            console.error(`error: command not found: ${args[0]}`);
            activeWidgets.push(new ClockErr(`error: command not found: ${args[0]}`));
        }

        return true;
    } else {
        return false;
    }
}

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
    lastTimeoutID = setTimeout(intervalFunct, interval);
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

/** Reapplies the styles in appliedStyles. */
function reapplyStyles() {
    for (const style of appliedStyles) {
        // append style to each applicable element's style attr
        $(style.selector).each(function () {
            if (!$(this).attr("style")) {
                $(this).prop("style", style.css);
            } else {
                $(this).prop("style", $(this).attr("style") + style.css);
            }
        });
    }
}

/**
 * Replaces a widget with an error message.
 * Must set `this.error = true` separately.
 * @param {number} id ID of widget to replace with error message.
 * @param {string} type The widget's type/class (lowercase).
 * @param {string} message Error message to display
 */
function showError(id, type, message) {
    console.error(`${type}: ${message}`);
    $(`#widget${id}`).prop("title", "");
    $(`#widget${id}`).removeClass(type);
    $(`#widget${id}`).addClass("error");
    $(`#widget${id}`).html(`${type}: ${message}`);
    reapplyStyles();
}

// in case browser doesn't support padStart
if (!window.String.prototype.padStart) {
    /**
     * (bad) Polyfill of padStart for old browsers
     * @param {targetLength} number Length string should be
     * @param {padChar} string One character only!!
     *  Character to pad string to targetLength
     */
    window.String.prototype.padStart = function (targetLength, padChar) {
        if (padChar.length > 1) {
            console.warn("This polyfill of padStart() should only be used with single character pad strings.");
        }
        if (this.length < targetLength) {
            var outStr = padChar.toString();
            for (let i = 0; i < targetLength - this.length - 1; i++) {
                outStr += padChar.toString();
            }
            outStr += this;
            return outStr;
        } else {
            return this;
        }
    };
}


/**
 * List of available widgets.
 * Widget classes must be declared here so that they can be created via string.
 */
const availableWidgets = {
    "clock": Clock,
    "countdown": Countdown,
    "stopwatch": Stopwatch,
    "timer": Timer,
    "timestamp": Timestamp,
    "blank": Blank,
    "text": Text
};
/** For use with moment#calendar. */
const calendarSettings = {
    lastDay: "[yesterday at] LTS",
    sameDay: "[at] LTS",
    nextDay: "[tomorrow at] LTS",
    lastWeek: "[last] dddd [at] LTS",
    nextWeek: "[next] dddd [at] LTS",
    sameElse: "Y-MM-DD [at] LTS"
};
/**
 * List of commands. Commands live here so they can be run via string.
 * Each command name should have an object with an `execute()` function inside
 */
const cmds = {
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
                console.error(`error: widget not found: ${newWidget}`);
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
                console.error(`error: invalid index to delete: ${index}`);
            }
        }

    }, "style": {
        /**
         * Apply some custom CSS.
         * @param {string} selector Selector to apply CSS to.
         * @param  {...string} css CSS to apply to selector (will be joined).
         */
        execute(selector, ...css) {
            switch (selector) {
                case "-footer":
                    selector = "footer *";
                    break;
                case "-main":
                    selector = "main *";
                    break;
                case "-dynamic":
                    selector = ".clock, .countdown, .stopwatch, .timer";
                    break;
                case "-static":
                    selector = ".blank, .error, .text, .timestamp";
                    break;
            }
            const cssString = css.join(" ");
            appliedStyles.push({
                selector: selector,
                css: cssString
            });
            reapplyStyles();
        }

    }, "done": {
        /** Gets cursor out of textarea. */
        execute() {
            $("textarea").blur();
        }

    }, "stop!": {
        /** Stops the recursive setTimeout loop. */
        execute() {
            clearTimeout(lastTimeoutID);
            emergencyStopped = true;
            console.warn("Emergency stop.");
        }

    }, "restart": {
        /** Restarts the setTimeout loop. Only works if it was stopped. */
        execute() {
            if (emergencyStopped) {
                emergencyStopped = false;
                setTimeout(intervalFunct, interval);
            } else {
                console.warn("Execution is not stopped.");
            }
        }
    }
};

/** List of widgets currently active on the page. */
var activeWidgets = [];
/** For widget IDs */
var widgetCounter = 0;
/**
 * List of applied custom styles.
 * Each element is an objet with a selector property and css property.
 */
var appliedStyles = [];
/**
 * Inverval, in ms, at which the website updates.
 * 50 is normal, 10 for when there is a stopwatch or a timer < 60s
 */
var interval = 50;
/** The last setTimeout ID used, used in the stop command */
var lastTimeoutID;
/** If execution was stopped */
var emergencyStopped = false;


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

    lastTimeoutID = setTimeout(intervalFunct, interval);
});
