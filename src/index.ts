import e from 'express';
import {createServer} from 'http';
import {WebSocketServer, WebSocket} from 'ws';
import {randomUUID} from 'crypto';
import type { MessageFormat } from './interface/messageFormat.interface.d.ts';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req,res) => {
    console.log(req.params);
    res.render('home');
});
// app.listen(3000);

const server = createServer(app);
const nameMap = new WeakMap<WebSocket,string>();

const wss = new WebSocketServer({server: server});
wss.on('connection', (ws) => {

    ws.on('close', (code,reason) => {
        console.log(code);
    });

    ws.on('message', (data,isBinary) => {
        const msg = JSON.parse(data.toString('utf-8')) as MessageFormat<string>;
        switch(msg.type) {
            case 'nick':
                //nameMap에 정보 설정
                nameMap.set(ws, msg.payload);
                ws.send(data);
                break;
            case 'msg':
                const name = nameMap.get(ws);
                wss.clients.forEach(socket => socket.send(`[user-${name??"Anonymous"}]:${msg.payload}`));
                break;
        }
    });

    const uuuid = randomUUID();
    const data = {
        uid: uuuid
    };

    ws.send(JSON.stringify(data));
});

wss.on('close', () => {
    console.log("server closed");
})

server.listen(3000);