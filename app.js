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
      }
      if(d.getSeconds() == 0) {
         audioBox.play();
      }
   }, 50);
});
