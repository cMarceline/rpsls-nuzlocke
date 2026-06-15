import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 8080 });

enum Move {
    Rock = 'rock',
    Paper = 'paper',
    Scissors = 'scissors',
    Lizard = 'lizard',
    Spock = 'spock'
}

interface availableMoves {
    [Move.Rock]: boolean;
    [Move.Paper]: boolean;
    [Move.Scissors]: boolean;
    [Move.Lizard]: boolean;
    [Move.Spock]: boolean;
}

enum userStates {
    Searching,
    Challenging,
    Challenged,
    InGame
}

interface player {
    id: string;
    websocket: WebSocket;
    availableMoves: availableMoves;
    currentOpponent?: string;
    state: userStates;
}

var players: player[] = [];

wss.on('connection', (ws: WebSocket) => {
    const playerId = uuidv4();
    const newPlayer: player = {
        id: playerId,
        websocket: ws,
        availableMoves: {
            [Move.Rock]: true,
            [Move.Paper]: true,
            [Move.Scissors]: true,
            [Move.Lizard]: true,
            [Move.Spock]: true
        },
        state: userStates.Searching,
        currentOpponent: undefined
    };

    players.push(newPlayer);
    console.log(`Player connected: ${playerId}`);
    ws.send(JSON.stringify({ type: 'welcome', playerId }));
    
    ws.on('message', (message: string) => {
        receivedMessage(playerId, JSON.parse(message));
    });

    ws.on('close', () => {
        console.log(`Player disconnected: ${playerId}`);
        // Handle player disconnection here
        players = players.filter(p => p.id !== playerId);
    });
});

// Websockets that server will send
enum ServerMessage {
    gameStarted,
    gameStateUpdate
}

enum ClientMessage {
    challengePlayer = 'challenge',
    acceptChallenge = 'acceptChallenge',
    makeMove = 'makeMove'
}

function receivedMessage(playerId: string, message: any) {

}

function sendMessage(playerId: string, message: any) {

}

console.log('WebSocket server is running on ws://localhost:8080');