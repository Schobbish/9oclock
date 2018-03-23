$(document).ready(function() {
   // playing this can't be done with the jquery function
   var audioBox = document.getElementById("audioBox");
   var d;

   // this will run fifty times a second (for accuracy)
   setInterval(function() {
      d = new Date();
      $('#timeBox').html(d.toLocaleTimeString('en-us'));

      if(d.getDay() == 6) {
         $('#dayBox').html('Today is Saturday');
      } else {
         $('#dayBox').html('Today is Not Saturday');
      }
      // if saturday and exactly at 9:00:00 (am or pm)
      // correct if statement:
      // d.getDay() == 6 && (d.getHours() == 9 || d.getHours() == 21) && d.getMinutes() == 0 && d.getSeconds() == 0
      if(d.getDay() == 6 && (d.getHours() == 9 || d.getHours() == 21) && d.getMinutes() == 0 && d.getSeconds() == 0) {
         audioBox.play();
      }
   }, 20);
});
