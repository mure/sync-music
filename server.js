var express = require('express');
var app = express();
var server = app.listen(process.env.PORT);

app.use(express.static('public'));

var io = require('socket.io')(server);

var startTime = 0;

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    socket.on('sync', function() {
      socket.emit('sync', Date.now());
    });
  
    socket.on('start',
      function(data) {
        startTime = Date.now() + 400;
        io.sockets.emit('start', startTime);
      }
    );
  
    socket.on('join',
      function(data) {
        socket.emit('join', startTime);
      }
    );
  
    socket.on('print', function(data) {
      console.log(data);
    });
  }
);