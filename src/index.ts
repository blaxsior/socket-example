import e from 'express';
import { createServer } from 'http';
import { Server as WebSocketServer } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

const app = e();
app.set('view engine', 'ejs');
app.use(e.static('public'));

app.use((req, res) => {
    res.render('home');
});


const server = createServer(app);
const wss = new WebSocketServer(server, {
    cors: {
        origin: ["https://socket.io"],
        credentials: true
    }
});
instrument(wss, {
    auth: false
});

const nameMap = new WeakMap();
function publicRooms() {
    const sids = wss.sockets.adapter.sids;
    const rooms =  wss.sockets.adapter.rooms;

    const pubRooms: [string, number][] = [];
    rooms.forEach((value,key) => {
        if(!sids.has(key)) {
            pubRooms.push([key, value.size]);
        }
    });
    // private room이 아닌 경우->public인 경우 추가
    return pubRooms;
}

function countRoom(room: string) {
    const rcount = wss.sockets.adapter.rooms.get(room)?.size??0;
    return rcount;
}

wss.on("connection", (socket) => {
    socket.emit("room-change", publicRooms()); // 최초에 한번 룸 정보 가져와야 함
    socket.onAny((e) => {
        console.log(`socket event: ${e}`)
    })
    socket.on('enter-room', (data, done) => { // 객체도 전송 가능
        done(); // 클라이언트에서 실행될 콜백 함수. 호출"만" 서버에서 수행
        nameMap.set(socket, 'Anonymous'); // 일단 사용자 이름을 Anonymous로 지정

        const roomName = data.payload;
        socket.join(roomName);
        socket.to(roomName).emit("welcome", nameMap.get(socket), countRoom(roomName));
        wss.sockets.emit("room-change", publicRooms(),countRoom(roomName));
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

    socket.on("disconnecting", () => { // 해제되기 직전
        const name = nameMap.get(socket);
        socket.rooms.forEach(room => socket.to(room).emit("bye", name, countRoom(room) - 1));
    });

    socket.on("disconnect", () => { // 완전히 해제된 경우
        wss.sockets.emit("room-change", publicRooms());
    }); // room이 사라진 경우 작성...
});

server.listen(3000);