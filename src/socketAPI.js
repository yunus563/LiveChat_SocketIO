
//^^^^^^^^^^^^^   -- SERVER QISMI --    ^^^^^^^^^^^^^^^^^//
const socketio = require('socket.io')
const colorRandom = require('../helper/randomColor')
const io = socketio()

const socketApi = {}
socketApi.io = io



const users = {}
// Connections
io.on('connection', (socket) => {
    // console.log("Foydalanuvchi boglandi");


    socket.on('newuser', (data) => {
        const defoultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color:colorRandom()

        }
        
        const userData = Object.assign(data, defoultData)
        users[socket.id] = userData
        

        socket.broadcast.emit('userData',  users[socket.id])

        socket.emit('initPlayers', users)

        socket.on('disconnect', () =>{
            socket.broadcast.emit('disUser', users[socket.id])
            delete users[socket.id]
        })
       
        socket.on('position', data =>{
            users[socket.id].position.x = data.x
            users[socket.id].position.y = data.y

            socket.broadcast.emit('animate', {
                socketID : socket.id,
                x: data.x,
                y: data.y
            })
        })
     
    })

       socket.on('newMesssage', data =>{
            // console.log(data);
            socket.broadcast.emit('newmessage' , data)
        })

})

//^^^^^^^^^^^^^   -- SERVER QISMI --    ^^^^^^^^^^^^^^^^^//




// Exports
module.exports = socketApi;