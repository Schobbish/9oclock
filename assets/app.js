class ClockErr {
    /**
     * Generic error display
     * @param {string} message Error message to display
     */
    constructor(message) {
        this.display = message;
        this.id = widgetCounter;
        widgetCounter++;
    }
    update() {

    }
}
class Clock {
    /**
     * Clock thing. Has seconds.
     * @param timeZone Time zone the clock should be in (how to implement?)
     */
    constructor(timeZone) {
        this.display = "hi";
        this.id = widgetCounter;
        widgetCounter++;
    }
    update() {

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
    // each command name should have an object with a `run()` funct inside
    "create": {
        /**
         * Creates a new widget.
         * @param {string} newWidget Widget to be created.
         */
        run(newWidget) {
            if (availableWidgets[newWidget]) {
                activeWidgets.push(new availableWidgets[newWidget]());
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
        run(index) {
            if (activeWidgets[index]) {
                activeWidgets.splice(index, 1);
            } else {
                console.error(`projector error: invalid index to delete: ${index}`);
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
 * @param {string} cmd Command to run.
 */
function run(cmd) {
    if (cmd.split(' ')[0] === ">>") {
        // then yes it is a command we need to run
        console.log(cmd);
        // make all lowercase (hopefully this won't matter)
        cmd = cmd.toLowerCase();

        /** Arguments given to command line. `args[0]` is the command name. */
        const args = cmd.split(' ').slice(1);
        if (cmds[args[0]]) {
            // gives all args after the first to the command
            cmds[args[0]].run.apply(null, args.slice(1));
        } else {
            console.error(`projector error: command not found: ${args[0]}`);
            activeWidgets.push(new ClockErr(`projector error: command not found: ${args[0]}`));
        }
    } // else do nothing
}

var d;
var interval = 50;

$(document).ready(function () {
    activeWidgets.push(new Clock());

    $('textarea').keyup(function () {
        if (event.key === "Enter") {
            lines = $(this).val().split('\n');
            for (const cmd of lines) {
                run(cmd);
            }
            // clear box for next command
            $(this).val('');
        }
    });
    // press shift+period (gt symbol) to focus the textarea
    $(window).keydown(function (event) {
        if (event.key === '>') {
            $('textarea').focus();
            // and apparently keydown goes before typing so no need for this
            // $('textarea').val($('textarea').val() + '>')
        }
    });
    // this is like setInterval except the interval can be changed
    function intervalFunct() {
        d = new Date();
        if (activeWidgets) {
            for (const widget of activeWidgets) {
                widget.update();
            }
        }
        // recursive
        setTimeout(intervalFunct, interval);
    }
    setTimeout(intervalFunct, interval);
});