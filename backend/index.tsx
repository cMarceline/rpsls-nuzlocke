import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { 
    gameModeration 
} from './gameFunctions';

export {}
const wss = new WebSocketServer({ port: 8080 });

export enum ServerMessage {
    whatTheFuck = 'what the fuck',
    setUUID = 'setUUID'
}

enum ClientMessage {
    olduuid = 'oldUUID',
    changeName = 'changeName',
    challengePlayer = 'challenge',
    acceptChallenge = 'acceptChallenge',
    makeMove = 'makeMove'
}

interface player {
    websocket: WebSocket;
    name?: string;
    gameID?: string;
}

var players: { [id: string]: player } = {}; 
wss.on('connection', (ws: WebSocket) => {
    const UUID = uuidv4
    const setUUID = ServerMessage.setUUID
    ws.websocket.send(JSON.stringify({ setUUID , UUID }));
    

    ws.on('message', (message: string) => {
        receiveMessage(UUID, JSON.parse(message))
    });

    ws.on('close', () => {

    });
});

async function receiveMessage(playerId: string, message: any) {
    switch (message.type) {
        case ClientMessage.olduuid :
            const oldUUID = message.arg
            if (players[oldUUID] && players[oldUUID].gameID) {
                
            }
            return;
        //case ClientMessage.challengePlayer:
    }
}

export function sendMessage(playerId: string, type: ServerMessage, arg: any) {
    const player = players[playerId];
    if (!player) {
        console.warn(`Player ${playerId} not found`);
        return;
    }
    player.websocket.send(JSON.stringify({ type, arg }));
}

console.log('WebSocket server is running on ws://localhost:8080');