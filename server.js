var express = require('express');
var app = express();
var server = app.listen(process.env.PORT);

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    socket.on('sync', function() {
      socket.emit('sync', Date.now());
    });
  
    socket.on('start',
      function(data) {
        io.sockets.emit('start', Date.now() + 1000);
      }
    );
  
    socket.on('print', function(data) {
      console.log(data);
    });
  }
);