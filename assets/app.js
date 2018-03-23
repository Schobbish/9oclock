$(document).ready(function() {
   var audioBox = document.getElementById("audioBox");
   var d;

   // this will run fifty times a second (for accuracy)
   setInterval(function() {
      d = new Date();
      // Date(2018, 2, 17) is a Saturday
      $('#timeBox').html(d.toLocaleTimeString());

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
   }, 50);
});
