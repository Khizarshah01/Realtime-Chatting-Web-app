const express = require('express'); 
const http = require('http');
const socketio = require('socket.io');

// Importing modules from utils directory
const {msgmaker ,OldMessageMaker} =  require('./utils/msgformat');
const {userjoin ,getcurrentUser ,DelUser , ShowMe ,MessageAdd , ShowMessageToNewUser} = require('./utils/join');

// Server number for messages
var sr_no = 0;

// Destination for redirecting if incorrect credentials are entered
var destination = '/index.html';

// Initializing express app and http server
const app = express();
const HttpServer = http.createServer(app);

// Initializing socket.io on the http server
const io = socketio(HttpServer);

// Bot name
const bot = 'watch_dog';

// Serve the views directory to the client side
app.use(express.static(`${__dirname}/views`));

// Connection event for new user
io.on('connection',socket=>{
    // Event on receiving join data from the client
    socket.on('join' , ({usrname , room ,password})=>{
        // Call to the userjoin function to join a user to a room
        const user = userjoin(socket.id ,usrname ,room ,password);
        // If user joined successfully
        if (user != true && user != false){
            // Joining the room
            socket.join(user.room);
            // Message to all members of the room on user connection
            socket.broadcast.to(user.room).emit('message',msgmaker(bot,`${user.username} has connected ;)`));
            console.log(user.room);
            // Retrieve all messages of the room for new user
            const OldMessages = ShowMessageToNewUser(user.room);
            // Emit the messages to the new user
            OldMessages.forEach(element=>{
                io.to(user.id).emit('message',OldMessageMaker(element.username ,element.message ,element.time));
            });
        }else{
            // Redirect to destination if incorrect credentials are entered
            socket.emit('redirect',destination);
        }
    }); 

    // Event on receiving a new chat message from the client
    socket.on('chatmessage',message=>{
        // Retrieve the user who sent the message
        const getuser = getcurrentUser(socket.id);

        if(getuser){

            // Increment sr_no by 1
            sr_no += 1;
            // Add message to the room
            if (getuser) {
                MessageAdd(msgmaker(getuser.username ,message),getuser.room ,sr_no);
            }
            // Emit message to all members of the room
            io.to(getuser.room).emit('message',msgmaker(getuser.username,message));
            // Log all users
            const Show = ShowMe();
        }
    });

    // Event on user disconnection
    socket.on('disconnect',()=>{
        // Retrieve the disconnected user
        userClosed = getcurrentUser(socket.id);
        // If the disconnected user is found
        if (userClosed != undefined){
            console.log(userClosed);
            // Message to all members of the room on user disconnection

            socket.broadcast.to(userClosed.room).emit('message',msgmaker(bot,`${userClosed.username} disconnected;(`))
            DelUser(userClosed.id)
        }
    })
})

var PORT = 3000 ||process.env.PORT

HttpServer.listen(PORT,()=>{
    console.log(`listening of ${PORT}`)
})
