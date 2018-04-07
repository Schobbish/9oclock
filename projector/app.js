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
        $('#clock').html(d.toLocaleTimeString('en-us'));

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
        // >>> #clock, textarea = font-family: "Times New Roman"
        for(var i = 0; i < lines.length; i++) {
            // split at first space to see if it's a command
            var args = lines[i].split(' ', 1);

            // check if command
            if(args[0] == '>>>') {
                // properties are keys and values are values
                // this will only ever have one item but it must be done this way
                var styles = {};

                // Selector and Declaration
                var sd = lines[i].split(' = ', 2);
                // take out >>> from the first value of sd and you've got the selector
                var selector = sd[0].replace('>>> ', '');
                console.log(sd);
                console.log(selector);

                // allows for a done command later
                if(selector != 'done') {
                    // assign value to property
                    styles[args[2]] = args[3];
                    if(selector == '--main') {
                        // this selector will select #clock and textarea
                        selector = '#clock, textarea';
                    }
                    if(selector == '--foot') {
                        // this selector will selector the footer and the paragraph and links in it
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
        /*
        if(splitText[0] == '>>>') {
            switch(splitText[1]) {
            case 'background-color':

            };
        };*/
   });
});
