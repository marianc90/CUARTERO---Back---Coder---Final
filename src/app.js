import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import __dirname from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';

import messagesModel from './dao/models/messages.model.js';


const app = express();



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public/'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

const uri = 'mongodb+srv://marianc90:sitela90@cluster90.qnx1iph.mongodb.net/?retryWrites=true&w=majority'

mongoose.set({strictQuery: true})
mongoose.connect(uri,{dbName: 'ecommerce'}, async (error)=>{
    if (!error){
        console.log('DB connected');
        const httpServer = app.listen(8080, ()=>{
            console.log("Server listening on port 8080...");
        });
        
        const socketServer = new Server(httpServer)

        let messages = []

        socketServer.on('connection', socket =>{
            console.log(socket.id);
            socket.on('msg_front', data => console.log(data));
            socket.emit('msg_back',"Conectado al servicio, Bienvenido desde el Back")
            /* socket.emit('msg_individual', 'Este msj solo lo recibe el socket')
            socket.broadcast.emit('msg_resto','Este msj lo recibe todos menos el socket actual')
            socketServer.emit('msg_all','Mensaje a todos') */

            socket.on('session', async data =>{// Esto es para que aparezcan los mensajes sin escribir nada antes, y despues de poner el usuario
                messages = await messagesModel.find(/* {$or:[{user:data }, {user:'At. al Cliente'}]} */).lean().exec();
                console.log(messages);
                socketServer.emit('first',messages)
            })
            

            socket.on('message', async data=>{
                await messagesModel.create(data)
                console.log(data);
                messages = await messagesModel.find(/* {$or:[{user:data.user }, {user:'At. al Cliente'}]} */).lean().exec();
                socketServer.emit('logs',messages)
                })
        })

        //Utilizamos este Middleware genérico para enviar la instancia del servidor de Socket.io a las routes
        app.use((req,res,next)=>{
            req.io = socketServer
            next()
        })
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartsRouter)
        app.use('/api/chat', chatRouter)

    } else {
        console.log("Can't connect to database");
    }
} )

