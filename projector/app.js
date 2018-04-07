/*jshint esversion: 6 */
$(document).ready(function() {
    /*
    This one has no if statment and can't play the song
    */
    // playing this can't be done with the jquery function
    // var audioBox = document.getElementById("audioBox");
    var d;

    // this will run fifty times a second (for accuracy)
    setInterval(function() {
        d = new Date();
        $('#timeBox').html(d.toLocaleTimeString('en-us'));

        /* if(d.getDay() == 6) {
            $('#dayBox').html('Today is Saturday');
        } else {
            $('#dayBox').html('Today is Not Saturday');
        } */
        // if saturday and exactly at 9:00:00 (am or pm)
        // correct if statement:
        // d.getDay() == 6 && (d.getHours() == 9 || d.getHours() == 21) && d.getMinutes() == 0 && d.getSeconds() == 0
        /* if(d.getDay() == 6 && (d.getHours() == 9 || d.getHours() == 21) && d.getMinutes() == 0 && d.getSeconds() == 0) {
         audioBox.play();
        } */
    }, 20);

    // for commands in the textarea
    $('textarea').change(function() {
        // get value of textarea
        text = $(this).val();
        lines = text.split('\n');

        for(var i = 0; i < lines.length; i++) {
            // split the line into words
            var args = lines[i].split(' ');

            if(args[0] == '>>>') {
                var property = args[1];
                var styles = {};
                // strip the colon off the property
                property = property.replace(':', '');

                switch(property) {
                    case 'background-color':
                    case 'background-image':
                    case 'background-position':
                    case 'background-size':
                    case 'background-repeat':
                    case 'background-attachment':
                        // for body styles that are the same in css
                        // if there are two arguments (for background-position)
                        if(args[2] && args[3]) {
                            // add an entry to the dictionary that will set new css styles
                            styles[property] = args[2] + ' ' + args[3];
                            console.log(`>>> ${property}: ${args[2]} ${args[3]}`);
                        } else if(args[2]) {
                            styles[property] = args[2];
                            console.log(`>>> ${property}: ${args[2]}`);
                        }
                        // add css styles to the body - css() accepts a dictionary
                        // with entries formatted like property: value
                        $('body').css(styles);
                        break;

                    case 'clock-color':
                    case 'clock-font-size':
                    case 'clock-font-family':
                        // font-family can only accept single word values (so no
                        // Times New Roman) right now
                    case 'clock-display':
                    case 'clock-margin-top':
                        // for #timeBox (the clock)
                        // take off the 'clock-' prefix before adding to dictionary
                        styles[property.replace('clock-', '')] = args[2];
                        console.log(`>>> ${property}: ${args[2]}`);
                        $('#timeBox').css(styles);
                        break;

                    case 'message-color':
                    case 'message-font-size':
                    case 'message-font-family':
                    case 'message-display':
                    case 'message-margin-top':
                    case 'message-resize':
                        // for the textarea
                        styles[property.replace('message-', '')] = args[2];
                        console.log(`>>> ${property}: ${args[2]}`);
                        $('textarea').css(styles);
                        break;

                    case 'footer-color':
                    case 'footer-font-size':
                    case 'footer-font-family':
                    case 'footer-display':
                        // for the footer
                        styles[property.replace('clock-', '')] = args[2];
                        console.log(`>>> ${property}: ${args[2]}`);
                        $('#timeBox').css(styles);
                        break;

                    case 'color':
                    case 'font-size':
                    case 'font-family':
                        // for both the clock and the textarea
                        styles[property] = args[2];
                        console.log(`>>> ${property}: ${args[2]}`);
                        $('#timeBox, textarea').css(styles);
                        break;

                    case 'done':
                        // clear the textarea when user is done
                        $(this).val('');
                        break;

                    default:
                        console.log(`${property} isn't a property you can use.`);
                } // end switch statement
            } // end '>>>' if statement
        }
        /*
        if(splitText[0] == '>>>') {
            switch(splitText[1]) {
            case 'background-color':

            };
        };*/
   });
});
