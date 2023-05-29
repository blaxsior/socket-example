import { io } from 'socket.io-client';

const socket = io();
const face = document.querySelector('#face') as HTMLVideoElement;
const muteBtn = document.querySelector('#mute') as HTMLButtonElement;
const cameraBtn = document.querySelector('#cam') as HTMLButtonElement;
const cameraSelect = document.querySelector('#cameras') as HTMLSelectElement;

// 초기에는 첫번째 카메라 사용
let stream = await getMedia((await getCameraDevices())[0].deviceId);
await setCameraList(cameraSelect);
let muted = false;
let cameraOff = false;

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
        let stream = await window.navigator.mediaDevices.getUserMedia(
            deviceId? camConstraint : init
        );
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