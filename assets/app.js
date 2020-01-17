class ClockErr {
    /**
     * Generic error display
     * @param {string} message Error message to display
     */
    constructor(message) {
        this.display = message;
    }
}
class Clock {
    /**
     * Clock thing. Has seconds.
     * @param timeZone Time zone the clock should be in (how to implement?)
     */
    constructor() {
        this.name = "hi";
    }
}

/** List of available widgets. Widget objects must get registered here */
var availableWidgets = {
    "clock": Clock,
}
/** widgets currently active on the page */
var activeWidgets = [];

/** List of commands. Commands live here. */
var cmds = {
    "create": {
        execute(newWidget) {
            if (availableWidgets[newWidget]) {
                activeWidgets.push(new availableWidgets[newWidget]());
            } else {
                activeWidgets.push(new ClockErr(`Err: widget ${newWidget} not found`))
            }
        }
    }
}

/**
 * Parses and runs commands and what not.
 * @param {string} cmd Command to run.
 */
function cmdRunner(cmd) {
    const args = cmd.split(' ').slice(1);
    if (cmd.split(' ')[0] === ">>>") {
        // then yes it is a command we need to run

    }
}
var thing = cmds.create.execute("mmmm");
console.log(activeWidgets);