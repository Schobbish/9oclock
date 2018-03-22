$(document).ready(function() {
   var audioBox = document.getElementById("myAudio");
   var d;
   setInterval(function() {
      d = new Date();
      $('#Time').html(d.toLocaleTimeString());
      if(d.getSeconds() == 0) {
         $('#testBox').html('whole minute')
      };
   }, 1000);
});
