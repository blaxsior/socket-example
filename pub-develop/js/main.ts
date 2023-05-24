import {io} from 'socket.io-client';

const enterDiv = document.querySelector("#enter-room") as HTMLDivElement;
const roomDiv = document.querySelector("#room") as HTMLDivElement;
roomDiv.hidden = true;
console.log(roomDiv);
function showRoom(roomName: string) {
    enterDiv.hidden = true;
    const roomNameElem = roomDiv.querySelector("h3[name='header']");
    roomNameElem.textContent = `Room: ${roomName}`;
    roomDiv.hidden = false;
}

const socket = io();
function handleRoom(event: SubmitEvent) {
    event.preventDefault();
    const input = enterDiv.querySelector('input');
    if(input) {
        const roomName = input.value;
        input.value = '';

        socket.emit('enter-room', {payload: roomName}, () => {
            console.log("server is done!");
        });
        showRoom(roomName);
    }
}

function addMessage(msg: string) {
    const msgList = roomDiv.querySelector("ul");
    const li = document.createElement('li');
    li.textContent = msg;
    msgList.appendChild(li);
}

enterDiv.addEventListener('submit', handleRoom);