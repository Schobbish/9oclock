
// this version will sign every minute at zero seconds

$(document).ready(function() {
   // playing can't be done with the jquery function
   var audioBox = document.getElementById("audioBox");
   var d;

   // this will run fifty times a second (for accuracy)
   setInterval(function() {
      d = new Date();
      // Date(2018, 2, 17) is a Saturday
      $('#timeBox').html(d.toLocaleTimeString('en-us'));

      if(d.getDay() == 6) {
         $('#dayBox').html('Today is Saturday');
      } else {
         $('#dayBox').html('Today is Not Saturday');
      }
      // if seconds are 0
      if(d.getSeconds() == 0) {
         audioBox.play();
      }
   }, 50);
});
