class ClockErr {
    /**
     * Generic error display
     * @param {string} message Error message to display
     */
    constructor(message) {
        this.display = message;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(
            `<h1 class="error" id="widget${this.id}">${this.display}</h1>`);
    }
    update() {
        // no update action
    }
}
class Clock {
    /**
     * Clock thing. Has seconds.
     * @param timeZone Time zone as UTC offset or abbreviation.
     */
    constructor(timeZone) {
        this.timeZone;
        this.timeZoneName;
        this.id = widgetCounter;
        widgetCounter++;

        $("#main").append(
            `<h1 class="clock" id="widget${this.id}">clock</h1>`);

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
                // regex from moment.js source for UTC offsets
                this.timeZone = moment().utcOffset(timeZone).format("Z");
            }
        }
    }
    update() {
        // show time zone if set else show local time
        if (this.timeZone) {
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

/** List of available widgets. Widget objects must get registered here */
var availableWidgets = {
    "clock": Clock,
};
/** List of widgets currently active on the page */
var activeWidgets = [];
/** For widget IDs */
var widgetCounter = 0;

/** List of commands. Commands live here. */
var cmds = {
    // each command name should have an object with a `run()` function inside
    "create": {
        /**
         * Creates a new widget.
         * @param {string} newWidget Widget to be created.
         */
        run(newWidget, ...args) {
            if (availableWidgets[newWidget]) {
                // https://stackoverflow.com/a/8843181
                // need to add null to beginning of args first
                args.splice(0, 0, null);
                activeWidgets.push(
                    new (Function.prototype.bind.apply(
                        availableWidgets[newWidget], args)));
            } else {
                console.error(
                    `projector error: widget not found: ${newWidget}`);
                activeWidgets.push(
                    new ClockErr(`error: widget not found: ${newWidget}`));
            }
        }
    }, "delete": {
        /**
         * Deletes widget at index.
         * @param {int} index This is the index.
         */
        run(index) {
            if (activeWidgets[index]) {
                // delete element by id
                $(`#widget${activeWidgets[index].id}`).remove();
                activeWidgets.splice(index, 1);
            } else {
                console.error(
                    `projector error: invalid index to delete: ${index}`);
            }
        }
    }, "done": {
        /**
         * Gets cursor out of textarea. Don't run without a browser.
         */
        run() {
            // needs testing
            $(this).blur();
        }
    }
};

/**
 * Parses and runs commands and what not.
 * Returns true if the command was valid.
 * @param {string} cmd Command to run.
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
            cmds[args[0]].run.apply(null, args.slice(1));
        } else {
            console.error(`projector error: command not found: ${args[0]}`);
            activeWidgets.push(new ClockErr(
                `error: command not found: ${args[0]}`));
        }
        return true;
    } else {
        return false;
    }
}

var d;
var interval = 50;

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
                    $(this).val("")
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



    // this is like setInterval except the interval can be changed
    function intervalFunct() {
        d = moment();
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