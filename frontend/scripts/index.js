const socket = new WebSocket('ws://localhost:8080');
var myUUID = null;

socket.addEventListener('open', () => {
    console.log('WebSocket connected');
});

socket.addEventListener('message', (event) => {
    receiveMessage(event.data);
});


socket.addEventListener('error', (event) => {
    console.error('WebSocket error', event);
});

function receiveMessage(message) {
    console.log('Received message:', message);
    jsondata = JSON.parse(message);
    console.log('Parsed JSON data:', jsondata);
    switch (jsondata.type) {
        case 'welcome':
            myUUID = jsondata.uuid;
            console.log('Received welcome message, assigned UUID:', myUUID);
            break;
        case 'gameStart':
            console.log('Game started with opponent:', jsondata.opponent);
            break;
        case 'moveResult':
            console.log('Move result:', jsondata.result);
            break;
        default:
            console.warn('Unknown message type:', jsondata.type);
    }`l`
}