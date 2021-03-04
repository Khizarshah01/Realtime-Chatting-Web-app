const express = require('express');
const http = require('http');
const { disconnect } = require('process');
const socketio = require('socket.io');
const {msgmaker ,OldMessageMaker} =  require('./utils/msgformat')
const {userjoin ,getcurrentUser ,DelUser ,ShowMe ,MessageAdd ,ShowMessageToNewUser} = require('./utils/join')
var sr_no = 0
var destination = '/index.html'

const app = express();
const HttpServer = http.createServer(app)
const io = socketio(HttpServer)
const bot = 'watch_dog'

app.use(express.static(`${__dirname}/views`))
io.on('connection',socket=>{
    socket.on('join' , ({usrname , room})=>{
        const user = userjoin(socket.id ,usrname,room)
        if (user != true){
            socket.join(user.room)
            // message on connection
            socket.broadcast.to(user.room).emit('message',msgmaker(bot,`${user.username} has connected ;)`))
            console.log(user.room)
            const OldMessages = ShowMessageToNewUser(user.room)
            OldMessages.forEach(element=>{
                io.to(user.id).emit('message',OldMessageMaker(element.username ,element.message ,element.time))
            })
        }else{
            socket.emit('redirect',destination)
        }
    }) 
    socket.on('chatmessage',message=>{
        const getuser = getcurrentUser(socket.id)
        sr_no += 1
        MessageAdd(msgmaker(getuser.username ,message),getuser.room ,sr_no)
        io.to(getuser.room).emit('message',msgmaker(getuser.username,message))
        const Show = ShowMe()
    })
    // message on disconnection
    socket.on('disconnect',()=>{
        userClosed = getcurrentUser(socket.id)
        if (userClosed != undefined){
            console.log(userClosed)
            socket.broadcast.to(userClosed.room).emit('message',msgmaker(bot,`${userClosed.username} disconnected;(`))
            DelUser(userClosed.id)
        }
    })
})

var PORT = 3000 ||process.env.PORT

HttpServer.listen(PORT,()=>{
    console.log(`listening of ${PORT}`)
})
