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
        // split at each line
        lines = text.split('\n');
        for(var i = 0; i < lines.length; i++) {
            // check if a command by splitting at the first space
            if(lines[i].split(' ', 1) == '>>>') {
                // properties are keys and values are values
                // this will only ever have one item but it must be done this way
                var styles = {};

                // split at the equals sign to separate the selector from the declaration
                var selectDeclar = lines[i].split(' = ', 2);
                // take out >>> from the first value of sd to get the selector
                var selector = selectDeclar[0].replace('>>> ', '');

                // allows for a done command later
                if(selector != 'done') {
                    // split the declaration by the colon to get property and its value
                    var propVal = selectDeclar[1].split(': ', 2);

                    // assign value to property in dictionary
                    styles[propVal[0]] = propVal[1];
                    if(selector == '--main') {
                        // this selector will select #clock and textarea
                        selector = '#clock, textarea';
                    }
                    if(selector == '--foot') {
                        // this selector will selector the footer and the paragraph and links in it
                        selector = 'footer, footer p, footer a';
                    }
                    // use the styles dictionary to set the css
                    $(selector).css(styles);
                } else {
                    // creates the done command
                    $(this).val('');
                }
                // log the command
                console.log(lines[i]);
            }
        }
   });
});
