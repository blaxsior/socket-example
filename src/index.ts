import e from 'express';
import { createServer } from 'http';
import { Server as WebSocketServer } from 'socket.io';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req, res) => {
    res.render('home');
});


const server = createServer(app);
const wss = new WebSocketServer(server);

const nameMap = new WeakMap();

wss.on("connection", (socket) => {
    socket.on('enter-room', (data, done) => { // 객체도 전송 가능
        done(); // 클라이언트에서 실행될 콜백 함수. 호출"만" 서버에서 수행
        nameMap.set(socket, 'Anonymous'); // 일단 사용자 이름을 Anonymous로 지정

        const roomName = data.payload;
        socket.join(roomName);
        socket.to(roomName).emit("welcome", nameMap.get(socket));
    });

    socket.on('message', (msg, roomName, done) => {
        // console.log(msg);
        // console.log(roomName);
        socket.to(roomName).emit('message', nameMap.get(socket),msg);
        done();
    })

    socket.on('name-change', (name, roomName, done) => {
        const name_bef = nameMap.get(socket);
        nameMap.set(socket, name);
        const name_aft = nameMap.get(socket);
        done();

        socket.to(roomName).emit('name-change',name_bef, name_aft);
    })

    socket.on("disconnecting", () => {
        const name = nameMap.get(socket);
        socket.rooms.forEach(room => socket.to(room).emit("bye", name));
    });
});

server.listen(3000);