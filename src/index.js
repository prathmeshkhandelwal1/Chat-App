const http = require('http')
const express  = require('express')
const app = express();
const path = require('path')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const { generateMessage,generateLocation } = require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/user')
 


const port = process.env.PORT || 3000

const pathName = path.join(__dirname,'../public')

app.use(express.static(pathName))



io.on('connection',(socket)=>{

    console.log('New webSocket connected!')
    
    
    socket.on('join', ({username, room}, callback)=>{
        const {user, error} = addUser({id:socket.id , username, room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('WelcomeMsg', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('WelcomeMsg',generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room:user.room,
            users: getUserInRoom(user.room)
        })
        
    })

    
    socket.on('msgSent',(message,callback)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('WelcomeMsg',generateMessage(user.username,message))

        }
        callback()
    })

    socket.on('sentLocation', (position,callback) => {
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('locationMessage',generateLocation(user.username,`https://google.com/maps?q=${position.longitude},${position.latitude}`))
        }
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('WelcomeMsg', generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })

})

server.listen(port,()=>{
    console.log(`app is listening on port ${port}!`)
})


