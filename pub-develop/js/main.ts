const messageList = document.querySelector("#messages") as HTMLUListElement;
const messageForm = document.querySelector("#submit") as HTMLButtonElement;

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log("서버 연결");
}

socket.onmessage = (message) => {
    console.log(message.data);
    setTimeout(() => {
        socket.send("my message");
    }, 5000);
}

socket.onclose = () => {
    console.log("서버와의 연결이 끊김")
}

function handleSubmit(event: SubmitEvent) {
    event.preventDefault(); // 제출 방지
    const input = messageForm.querySelector("input");
    if (input) {
        socket.send(input.value);
        input.value = "";
    }
}
messageForm.addEventListener('submit', handleSubmit);