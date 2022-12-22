import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

const httpServer = app.listen(8080, ()=>{
    console.log("Server listening on port 8080...");
});

const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.static(__dirname + '/public/'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

//Utilizamos este Middleware genérico para enviar la instancia del servidor de Socket.io a las routes
app.use((req,res,next)=>{
    req.io = socketServer
    next()
})
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

socketServer.on('connection', socket =>{
    console.log(socket.id);
    socket.on('msg_front', message => console.log(message));
    socket.emit('msg_back',"Conectado al servicio, Bienvenido desde el Back")
    /* socket.emit('msg_individual', 'Este msj solo lo recibe el socket')
    socket.broadcast.emit('msg_resto','Este msj lo recibe todos menos el socket actual')
    socketServer.emit('msg_all','Mensaje a todos') */
})
