
module.exports.chatSockets = function(socketServer){
    //let io = require('socket.io')(socketServer);
    let io = require('socket.io')(socketServer,
        {
          origins: ["http://localhost:3000"],
      
          handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Access-Control-Allow-Methods": "GET,POST",
              "Access-Control-Allow-Headers": "my-custom-header",
              "Access-Control-Allow-Credentials": true
            });
            res.end();
          }
        }
      )

    io.sockets.on('connection', function(socket){
        // console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        
        socket.on('join_room', function(data){
            // console.log('joining request rec.', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}