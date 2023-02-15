const http = require('http');
const express = require('express')
const cors = require('cors');
// var bodyParser = require('body-parser')
const socketIo = require('socket.io');

const app=express();
const port = process.env.PORT || 4004;
app.use(cors());

 
app.get("/",(req,res) => {
    res.send("working");
})



const server=http.createServer(app);
const io=socketIo(server);
const users=[{}];

io.on("connection",(socket)=>{
    console.log("connection");


    socket.on('joined',({User})=>{
        users[socket.id]=User;
        console.log(`${User} has joined`);
        socket.broadcast.emit('userJoined',{user:'Admin',message:`${users[socket.id]} has joined`})
        socket.emit('welcome',{user:'admin',message:`welcome ${users[socket.id]} `})

    })
   
    // socket.broadcast.emit('userJoined',{user:'Admin',message:`${users[socket.id]} has joined`})
    socket.on('message',({id,message})=>{
        io.emit('sendMessage',{User:users[id],message,id})


    })
 
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"admin",message:"user has left"})
        console.log("user has left");
    })
})



server.listen(port,()=>{
    console.log(`run on the ${port}`);
})

