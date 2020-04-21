let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  
  socket.on('join', function (data) {
    socket.join(data.from); // We are using room of socket io
  });

  socket.on('disconnect', function(data){
    io.to(data.channel).emit('users-changed', {user: socket.user, event: 'left'});   
  });
 
  socket.on('join', (data) => {
    socket.user = data.user;
    socket.join(data.channel);
    console.log(data);
    io.to(data.channel).emit('users-changed', {user: data.user, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
   // io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
    //check user is in the chennal or not . If not then save it into DB
        io.to(message.channel).emit('reciverPeer', {text: message.text, from: socket.user,to:message.to, created: new Date()});
      //  socket.emit('senderPeer', {text: message.text+'2', from: socket.user,to:message.to, created: new Date()});
  });

  socket.on('typing', (data) => {
   // io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  
        io.to(data.channel).emit('typing', {text: "Typing.....", from: socket.user,to:data.to});
      console.log('typing...');
      //  socket.emit('senderPeer', {text: message.text+'2', from: socket.user,to:message.to, created: new Date()});
  }); 
});

 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});