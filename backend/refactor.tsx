import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { 
    gameModeration 
} from './gameFunctions';

export {
    sendMessage
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
    const playerId = uuidv4();
    const newPlayer: player = {
        websocket: ws,
        currentOpponent: undefined
    };

    connectingPlayers[playerId] = newPlayer;
    console.log(`Player connected: ${playerId}`);
    sendMessage(playerId, ServerMessage.welcome, playerId);

    ws.on('message', (message: string) => {
        receiveMessage(playerId, JSON.parse(message));
    });

    ws.on('close', () => {
        console.log(`Player disconnected: ${playerId}`);
        // Handle player disconnection here
        delete connectingPlayers[playerId];
    });
});

// Websockets that server will send
enum ServerMessage {
    welcome = 'welcome',
    popup = 'popup',
    challenge = 'challenge',
    gameStarted = 'gameStarted',
    gameStateUpdate = 'gameStateUpdate'
}

enum ClientMessage {
    changeName = 'changeName',
    challengePlayer = 'challenge',
    acceptChallenge = 'acceptChallenge',
    makeMove = 'makeMove'
}

async function receiveMessage(playerId: string, message: any) {
    console.log(`Received message from ${playerId}:`, message);
    
    const player = players[playerId];
    if (!player) {
        console.warn(`Player ${playerId} not found`);
        return;
    }

    switch (message.type) {
        case ClientMessage.changeName:
            console.log(`Player ${playerId} wants to change teir name to ${message.arg}`);
            player.name = message.arg;
            break;
        case ClientMessage.challengePlayer:
            console.log(`Player ${playerId} wants to challenge ${message.arg}`);
            await handleChallenge(playerId, message.arg);
            break;
    }
    //     case ClientMessage.challengePlayer:
}

function sendMessage(playerId: string, type: ServerMessage, arg: any) {
    const player = players[playerId];
    if (!player) {
        console.warn(`Player ${playerId} not found`);
        return;
    }
    player.websocket.send(JSON.stringify({ type, arg }));
}

console.log('WebSocket server is running on ws://localhost:8080');