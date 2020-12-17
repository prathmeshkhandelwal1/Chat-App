const http = require('http')
const express  = require('express')
const app = express();
const path = require('path')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)



const port = process.env.PORT || 3000

const pathName = path.join(__dirname,'../public')

app.use(express.static(pathName))

const messege = `Welcome!`

io.on('connection',(socket)=>{

    console.log('New webSocket connected!')
    socket.emit('WelcomeMsg', messege)
    socket.broadcast.emit('WelcomeMsg','A new user has joined!')
    
    
    socket.on('msgSent',(message,callback)=>{
        io.emit('WelcomeMsg',message)
        callback()
    })

    socket.on('sentLocation', (position,callback) => {
        io.emit('WelcomeMsg',`https://google.com/maps?q=${position.longitude},${position.latitude}`)
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('WelcomeMsg', 'A user has been left :(')
    })

})

server.listen(port,()=>{
    console.log(`app is listening on port ${port}!`)
})


