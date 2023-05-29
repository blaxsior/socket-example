import e from 'express';
import {readFileSync} from 'fs';
import {createServer} from 'https';
import { Server as WebSocketServer } from 'socket.io';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.get('/',(req, res) => {
    res.render('home');
});

const server = createServer({
    key: readFileSync("./secure/localhost-key.pem"),
    cert: readFileSync("./secure/localhost.pem"),
}, app);

const wss = new WebSocketServer(server);

server.listen(3000, () => {
    console.log("app started");
});