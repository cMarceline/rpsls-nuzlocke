const socket = new WebSocket('ws://localhost:9090');
// WebSocket event handlers
socket.addEventListener('open', () => {
    console.log('WebSocket connected');
});

socket.addEventListener('message', (event) => {
    receiveMessage(event.data);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error', event);
});

const lockButton = document.getElementById("lockBuzz")
const resetButton = document.getElementById("reset")
const unlockButton = document.getElementById("unlock")
lockButton.onclick = () => sendMessage("lock", Date.now());
resetButton.onclick = () => sendMessage("reset", Date.now());
unlockButton.onclick = () => sendMessage("unlock", Date.now());


function sendMessage(type, data) {
    const message = JSON.stringify({ type, data });
    console.log('Sending message:', message);
    socket.send(message);
}