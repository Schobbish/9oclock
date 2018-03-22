$(document).ready(function() {
   var audioBox = document.getElementById("myAudio");
   var d;
   alert(audioBox);
   alert($('#myAudio').html());
   setInterval(function() {
      d = new Date();
      $('#Time').html(d.toLocaleTimeString());
   }, 1000);
});
