$(document).ready(function() {
   var audioBox = document.getElementById("audioBox");
   var d;
   setInterval(function() {
      d = new Date();
      $('#timeBox').html(d.toLocaleTimeString());
      if(d.getSeconds() == 0) {
         $('#testBox').html('whole minute')
      };
   }, 1000);
});
