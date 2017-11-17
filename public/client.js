document.addEventListener('DOMContentLoaded', function() {
  
  var player;

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'vCXsRoyFRQE',
      playerVars: { 'autoplay': 0, 'controls': 0 },
      events: {
          'onStateChange': onPlayerStateChange
        }
    });
  }
      
  var ready = false;
  var status = document.getElementById('status');
  function onPlayerStateChange(event) {
    status.innerHTML = event.data;
    
    if (event.data === 1 && ready === false) {
      player.pauseVideo();
      player.seekTo(0);
      ready = true;
    }
  }
  
  /////////////////////////////////////////////////

  socket = io();
  
  var syncButton = document.getElementById('sync');
  
  var time = 0;
  syncButton.addEventListener("click", function () {
    time = performance.now();
    socket.emit('sync');
  });
  
  var rtt = 0;
  socket.on('sync', function(serverTime) {
    rtt = performance.now() - time;
  });
  
  
  /////////////////////////
  var playButton = document.getElementById('play');

  playButton.addEventListener("click", function () {
    socket.emit('start');
  });
    
  socket.on('start', function(startTime) {
    var delay = startTime - rtt * 0.5;
    var currentTime = performance.now();
    
    var intervalID = setInterval(function() {
      if (performance.now() - currentTime >= delay) {
        player.playVideo();
        clearInterval(intervalID);
      } 
    }, 0);
    
  });
  
  function waitToStart() {
    
  }
  
  
});
  
