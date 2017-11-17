document.addEventListener('DOMContentLoaded', function() {
  
  var player;

  window.onYouTubeIframeAPIReady = function() {
    if (!player) {
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'tvTRZJ-4EyI',
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: {
            'onStateChange': onPlayerStateChange
          }
      });
    }
  }
      
  var ready = false;
  function onPlayerStateChange(event) {
    if (event.data === 1 && ready === false) {
      player.pauseVideo();
      player.seekTo(0);
      ready = true;
    }
  }
  
  window.setTimeout(window.onYouTubeIframeAPIReady, 200);
  
  /* SYNCING */

  socket = io();
  
  var syncButton = document.getElementById('sync');
  var bestRtt = 9999;
  var counter = 0;
  
  var time = 0;
  syncButton.addEventListener("click", function () {
    player.playVideo();
    
    time = performance.now();
    socket.emit('sync');
  });
  
  var offset = 0;
  
  socket.on('sync', function(serverTime) {
    var rtt = performance.now() - time;
    
    if (rtt < bestRtt) {
      offset = serverTime - Date.now() + rtt * 0.5;
      console.log(offset);
      bestRtt = rtt;
    }
    
    if (counter < 15) {
      time = performance.now();
      socket.emit('sync');
    }
    
    counter++;
  });
  
  
  /* PLAYING */
  
  var playButton = document.getElementById('play');

  playButton.addEventListener("click", function () {
    socket.emit('start');
  });
    
  socket.on('start', function(startTime) {
    var delay = startTime - (Date.now() + offset);
    
    var start = performance.now();
    var intervalId = window.setInterval(function() {
      var diff = performance.now() - start;
      if (diff >= delay) {
        player.playVideo();
        
        clearInterval(intervalId);
      }
    }, 0);
    
  });
  
  /* JOINING */
  document.getElementById('join').addEventListener("click", function () {
    socket.emit('join');
  });
    
  socket.on('join', function(startTime) {
    var timePassed = (Date.now() + offset) - startTime;
        
    var seekTime = Math.ceil((timePassed + 1000)/1000);
    player.seekTo(seekTime);
    
    var delay = seekTime * 1000 - timePassed;

    var start = performance.now();
    var intervalId = window.setInterval(function() {
      var diff = performance.now() - start;
      if (diff >= delay) {
        player.playVideo();
        
        clearInterval(intervalId);
      }
    }, 0);
    
  });

});
  
