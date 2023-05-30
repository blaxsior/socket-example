import { io } from 'socket.io-client';

const socket = io();

// 채팅방 관련
const face = document.querySelector('#face') as HTMLVideoElement;
const muteBtn = document.querySelector('#mute') as HTMLButtonElement;
const cameraBtn = document.querySelector('#cam') as HTMLButtonElement;
const cameraSelect = document.querySelector('#cameras') as HTMLSelectElement;

let stream: MediaStream;
let muted = false;
let cameraOff = false;
// 방의 이름
let roomName: string;

async function getMedia(deviceId?: string) {
    const init = {
        audio: true,
        video: {facingMode: "user"}
    };
    const camConstraint = {
        audio: true,
        video: {deviceId: {exact: deviceId}}
    };

    try {
        stream = await window.navigator.mediaDevices.getUserMedia(
            deviceId? camConstraint : init
        ); // 최초 시점에도 stream이 존재해야 함.
        // console.log(stream.getTracks())
        face.srcObject = stream;
        return stream;
    } catch(e) {
        console.log(e);
        return null;
    }
}

async function setCameraList(select: HTMLSelectElement) {
    const cameras = await getCameraDevices();
    cameras.forEach(it => {
        const citem = document.createElement('option');
        citem.value = it.deviceId;
        citem.innerText = it.label;
        select.appendChild(citem);
    });
}

async function chooseCamera(e: Event) {
    const cid = (e.target as HTMLSelectElement).value;
    stream = await getMedia(cid);
    connection?.getSenders()
    .find((sender) => sender.track.kind === 'video')
    .replaceTrack(stream.getVideoTracks()[0]);
}

async function getCameraDevices() {
    try {
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        return devices.filter(it => it.kind==='videoinput');
    } catch(e) {
        console.log(e);
        return null;
    }
}

function handleMuteClick() {
    stream.getAudioTracks().forEach(it => it.enabled = !it.enabled);
    if(!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    stream.getVideoTracks().forEach(it => it.enabled = !it.enabled);
    if(!cameraOff) {
        cameraBtn.innerText = "Camera On";
        cameraOff = true;
    } else {
        cameraBtn.innerText = "Camera Off";
        cameraOff = false;
    }
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
cameraSelect.addEventListener('input', chooseCamera);

/***************************************************************/
// 방 화면 관련
const call = document.querySelector('#call') as HTMLDivElement;
call.hidden = true;

const welcome = document.querySelector('#welcome') as HTMLDivElement;
const welcomeForm = welcome.querySelector('form') as HTMLFormElement;

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false; 
    await getMedia((await getCameraDevices())[0].deviceId);
    await setCameraList(cameraSelect);
    makeConnection();
}

async function handleWelcomeSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    await startMedia();
    socket.emit('join_room', input.value);
    roomName = input.value;
    input.value = '';
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

/***************************************************************/
// RTC 커넥션
let connection: RTCPeerConnection;

function makeConnection() {
    connection = new RTCPeerConnection();
    connection.addEventListener('icecandidate', handleIce);
    connection.addEventListener('track', handleAddStream);
    stream.getTracks().forEach(track => connection.addTrack(track, stream));
}

function handleIce(e: RTCPeerConnectionIceEvent) {
    console.log("ICE 연결");
    console.log(e);
    socket.emit('ice', e.candidate, roomName); // ice 보내니까, 서버에서 처리해야지
}

function handleAddStream(e: RTCTrackEvent) {
    const [remotestream] = e.streams;
    const target = document.querySelector('#otherface') as HTMLVideoElement;
    target.srcObject = remotestream;
}
/***************************************************************/
// 소켓 관련 코드

socket.on('welcome',async () => { // 사람이 들어오면 
    const offer = await connection.createOffer(); // 오퍼 객체를 만들고
    connection.setLocalDescription(offer);
    console.log("welcome: offer 보냄");
    socket.emit('offer', offer, roomName); // 오퍼 수행
});

socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
    console.log("on offer: offer 받음");
    connection.setRemoteDescription(offer);
    const answer = await connection.createAnswer(); // answer 생성
    connection.setLocalDescription(answer);
    socket.emit('answer', answer, roomName);
    console.log("on offer: answer 보냄");
});

socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
    console.log("on answer: answer 받음")
    connection.setRemoteDescription(answer);
});

socket.on('ice', (candidate:RTCIceCandidate) => {
    console.log("received answer")
    connection.addIceCandidate(candidate);
});