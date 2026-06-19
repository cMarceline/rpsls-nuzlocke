const socket = new WebSocket('ws://localhost:8080');
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

const buzzer = document.getElementById("buzzer")

// User Functions
buzzer.onclick = sendBuzz;
function sendBuzz(){
    var message = {
        time : Date.now(),
        name : document.getElementById("nameInput").value
    }
    sendMessage('buzz', message)
    buzzer.disabled = true
}

// enum ClientMessage {
//     buzz = 'buzz',
//     lockConfirmed = 'locked',
//     lock = 'lock',
//     reset = 'reset',
// }
// Server Communication Functions
function sendMessage(type, data) {
    const message = JSON.stringify({ type, data });
    console.log('Sending message:', message);
    socket.send(message);
}

// enum ServerMessage {
//     whatTheFuck = 'what the fuck',
//     lock = 'lock',
//     unlock = 'unlock',
//     reset = 'reset',
// }
function receiveMessage(message) {
    console.log('Received message:', message);
    const jsondata = JSON.parse(message);
    console.log('Parsed JSON data:', jsondata);
    const type = jsondata.type;
    
    switch (type) {
        case "popup":
            alert(jsondata.arg ?? jsondata.data);
            break;

        case "lock":
            console.log("lock");
            buzzer.disabled = true;
            sendMessage("locked");
            break;

        case "unlock":
            console.log("unlock");
            buzzer.disabled = false;
            break;

        default:
            console.warn('Unknown message type:', type);
    }
}