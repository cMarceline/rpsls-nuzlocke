const socket = new WebSocket('ws://localhost:8080');
var myUUID = null;

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

// User Functions
function changeMyName(newName) {
    sendMessage('changeName', newName);
}

function challengePlayer() {
    const opponentId = document.getElementById('opponentId').value;
    if (opponentId) {
        sendMessage('challenge', opponentId);
    } else {
        alert('Please enter an opponent ID to challenge!');
    }
}
// Server Communication Functions
function sendMessage(type, data) {
    const message = JSON.stringify({ type, arg : data });
    console.log('Sending message:', message);
    socket.send(message);
}

function receiveMessage(message) {
    console.log('Received message:', message);
    jsondata = JSON.parse(message);
    console.log('Parsed JSON data:', jsondata);
    switch (jsondata.type) {
        
        case 'welcome':
            myUUID = jsondata.arg;
            console.log('Received welcome message, assigned UUID:', myUUID);
            document.getElementById('playerId').textContent = myUUID;
            break;

        case 'popup':
            alert(jsondata.arg);
            break;

        case 'challenge':
            const accept = confirm(jsondata.arg.message);
            if (accept) {
                sendMessage('acceptChallenge', jsondata.arg.challenger);
            } else {
                sendMessage('declineChallenge', jsondata.arg.challenger);
            }
            break;

        default:
            console.warn('Unknown message type:', jsondata.type);

    }
}