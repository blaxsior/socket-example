import e from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import {randomUUID} from 'crypto';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req,res) => {
    console.log(req.params);
    res.render('home');
});
// app.listen(3000);

const server = createServer(app);
const wss = new WebSocketServer({server: server});

wss.on('connection', (ws) => {
    const uuuid = randomUUID();
    const data = {
        uid: uuuid
    };

    ws.on('close', (code,reason) => {
        console.log(code);
    });

    ws.on('message', (data,isBinary) => {
        console.log(data.toString('utf-8'));
    });

    ws.send(JSON.stringify(data));
});

wss.on('close', () => {
    console.log("closed");
})

server.listen(3000);