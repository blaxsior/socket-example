import {io} from 'socket.io-client';

const enterDiv = document.querySelector("#enter-room") as HTMLDivElement;
const roomDiv = document.querySelector("#room") as HTMLDivElement;
roomDiv.hidden = true;

let roomName = '';

const socket = io();
socket.on('welcome', (name) => {
    addMessage(`[system] User ${name} joined`);
});
socket.on('bye', (name) => {
    addMessage(`[system] User ${name} exited`);
})
socket.on('message', (user, msg) => {
    addMessage(`[${user}]: ${msg}`);
})
socket.on('name-change',(name_bef,name_aft) => {
    addMessage(`[system] User ${name_bef} changed his name to ${name_aft}`);
})

function showRoom(roomName: string) {
    enterDiv.hidden = true;
    const roomNameElem = roomDiv.querySelector("h3[name='header']");
    roomNameElem.textContent = `Room: ${roomName}`;
    roomDiv.hidden = false;
}

function handleRoomSubmit(event: SubmitEvent) {
    event.preventDefault();
    const input = enterDiv.querySelector('input');
    if(input) {
        roomName = input.value;
        input.value = '';
        socket.emit('enter-room', {payload: roomName}, () => {
            console.log("server is done!");
        });
        showRoom(roomName);
    }
}

function sendMessageSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = roomDiv.querySelector('#msg input') as HTMLInputElement;
    if(input) {
        const msg = input.value;
        input.value = '';

        if(msg) {
            socket.emit('message', msg, roomName, () => {
                addMessage(`[you]: ${msg}`);
            })
        }
    }
}
function nameSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = roomDiv.querySelector('#name input') as HTMLInputElement;
    if(input) {
        const msg = input.value;
        input.value = '';

        if(msg) {
            socket.emit('name-change', msg, roomName, () => {
                addMessage(`[system] your name is ${msg}`);
            })
        }
    }
}

function addMessage(msg: string) {
    const msgList = roomDiv.querySelector("ul");
    const li = document.createElement('li');
    li.textContent = msg;
    msgList.appendChild(li);
}

enterDiv.addEventListener('submit', handleRoomSubmit);
roomDiv.querySelector('#name form')?.addEventListener('submit',nameSubmit);
roomDiv.querySelector('#msg form')?.addEventListener('submit', sendMessageSubmit);