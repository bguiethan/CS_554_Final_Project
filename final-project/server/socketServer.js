const app = require('../node_modules/express')();
const http = require('http').Server(app);
const io = require('../node_modules/socket.io/lib')(http);

const port = 4000

io.on('connection', function(socket) {
    console.log("connected")
    socket.on('user_join', function(data) {
      this.username = data.username;
      this.roomName = data.roomName
      console.log(data.username + " joined " + data.roomName)
      socket.in(data.roomName).emit('user_join', data);
    });
  
    socket.on('chat_message', function(data) {
      // data.username = this.username;
      socket.to(data.roomName).emit('chat_message', data);
      console.log(data.username + " sent a message: " + data.message)
    });
  
    socket.on('disconnect', function(data) {
      socket.to(this.roomName).emit('user_leave', this.username);
      console.log(this.username + " left " + this.roomName)
    });

    socket.on('join_room', (data) => {
      socket.leave(data.prevRoom);
      socket.join(data.currRoom);
      this.roomName = data.currRoom
      console.log(data.username + " switched from " + data.prevRoom + " to " + data.currRoom);
      socket.to(data.prevRoom).emit('user_leave', data.username);
      socket.in(data.currRoom).emit('user_join', data);
    });
  });
  
 http.listen(port, function () {
    console.log('Listening on *:' + port);
});