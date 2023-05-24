import e from 'express';
import {createServer} from 'http';
import {Server as WebSocketServer} from 'socket.io';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req,res) => {
    console.log(req.params);
    res.render('home');
});


const server = createServer(app);
const wss = new WebSocketServer(server);

wss.on("connection", (socket) => {
    console.log(socket);
});

server.listen(3000);