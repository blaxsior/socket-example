const messageList = document.querySelector("#messages") as HTMLUListElement;
const messageForm = document.querySelector("#messageForm") as HTMLFormElement;
const nickForm = document.querySelector('#nickForm') as HTMLFormElement;

let socket: WebSocket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log("서버 연결");
}

socket.onmessage = (message) => {
    const twit = document.createElement('li');
    twit.className = 'mb-2';
    twit.textContent = message.data;
    messageList.appendChild(twit);
}

socket.onclose = () => {
    console.log("서버와의 연결이 끊김");
}

function handleNicknameSubmit(event: SubmitEvent) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    if (input) {
        const data = createMsg('nick', input.value);
        socket.send(data);
    }
}

function handleSubmit(event: SubmitEvent) {
    event.preventDefault(); // 제출 방지
    const input = messageForm.querySelector("input");
    if (input) {
        const data = createMsg('msg', input.value);
        socket.send(data);
        input.value = "";
    }
}

function createMsg<T>(type: string, payload: T) {
    return JSON.stringify({
        type,
        payload
    });
};

nickForm.addEventListener('submit', handleNicknameSubmit);
messageForm.addEventListener('submit', handleSubmit);