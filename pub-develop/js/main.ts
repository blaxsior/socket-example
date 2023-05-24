import {io} from 'socket.io-client';

const messageList = document.querySelector("#messages") as HTMLUListElement;
const messageForm = document.querySelector("#submit") as HTMLButtonElement;

const socket = io();
// function handleRoom(event: SubmitEvent) {
//     event.preventDefault();
// }