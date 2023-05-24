import e from 'express';
import {createServer} from 'http';
import {Server as WebSocketServer} from 'socket.io';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req,res) => {
    res.render('home');
});


const server = createServer(app);
const wss = new WebSocketServer(server);

wss.on("connection", (socket) => {
    socket.on('enter-room', (data, done) => { // 객체도 전송 가능
        console.log(socket.id);
        console.log(socket.rooms);// 초기 private room 
        socket.join(data.payload);
        console.log(socket.rooms);// room에 들어감.
        done(); // 클라이언트에서 실행될 콜백 함수. 호출"만" 서버에서 수행
    })
});

server.listen(3000);