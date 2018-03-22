$(document).ready(function() {
   var audioBox = document.getElementById("myAudio");
   var d;
   setInterval(function() {
      d = new Date();
      $('#Time').html(d.toLocaleTimeString());
   }, 1000);
});
