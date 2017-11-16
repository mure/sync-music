document.addEventListener('DOMContentLoaded', function() {
    
  socket = io();
  var context, source;
  
  var request = new XMLHttpRequest();
  request.open('GET', 'https://cdn.glitch.com/b350410e-faf0-4604-9001-f6970313500e%2Fabrasive.mp3?1509677732140', true);
  request.responseType = 'arraybuffer';
  
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {  
      source.buffer = buffer;                    // tell the source which sound to play
      source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    });
  }
  
  var syncButton = document.getElementById('sync');
  
  var time = 0;
  syncButton.addEventListener("click", function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    source = context.createBufferSource(); // creates a sound source
    
    request.send();
    
    time = performance.now();
    socket.emit('sync');
  });
  
  var offset = 0;
  
  var request;
  socket.on('sync', function(serverTime) {
    var rtt = performance.now() - time;
    offset = serverTime - Date.now() + rtt * 0.5;
  });
  
  
  /////////////////////////
  var playButton = document.getElementById('play');

  playButton.addEventListener("click", function () {
    socket.emit('start');
  });
  
  
  socket.on('start', function(startTime) {
    var time = startTime - (Date.now() + offset);
    source.start(context.currentTime + time/1000.0);
  });
  
  
});
  
