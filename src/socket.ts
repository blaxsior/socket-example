import { Server as WebSocketServer } from 'socket.io';

export function socketDoing(wss: WebSocketServer) {
    wss.on('connection', (socket) => {
        // 방 들어갈 때
        socket.on('join_room', (roomName) => {
            socket.join(roomName);
            socket.to(roomName).emit('welcome'); // 들어갔다고 알림
        });
        socket.on('offer', (offer, roomName) => {
            socket.to(roomName).emit('offer', offer); // room에 대해 오퍼
        });
        socket.on('answer', (answer, roomName) => {
            socket.to(roomName).emit('answer', answer);
        });
        socket.on('ice', (candidate, roomName) => {
            socket.to(roomName).emit('ice', candidate);
        });
    });
}