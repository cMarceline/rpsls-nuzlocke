import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 8080 });

enum Move {
    Rock,
    Paper,
    Scissors,
    Lizard,
    Spock
}

interface availableMoves {
    [Move.Rock]: boolean;
    [Move.Paper]: boolean;
    [Move.Scissors]: boolean;
    [Move.Lizard]: boolean;
    [Move.Spock]: boolean;
}

interface player {
    id: string;
    websocket: WebSocket;
    availableMoves: availableMoves;
    currentOpponent?: string;
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
        }
    };

    players.push(newPlayer);
    console.log(`Player connected: ${playerId}`);
    
    ws.on('message', (message: string) => {
        const msg = JSON.parse(message);
        switch (msg.type) {
            case ClientMessage.CreateGame:
                break;
            // Add more cases for joining games, making moves, etc.
        }
        // Handle incoming messages from clients here
    });

    ws.on('close', () => {
        console.log(`Player disconnected: ${playerId}`);
        // Handle player disconnection here
        players = players.filter(p => p.id !== playerId);
    });
});

// Websockets that server will send
enum ServerMessage {
    gameStarted = 'gameCreated',
    gameStateUpdate = 'gameStateUpdate',
    
}

// Websockets that clients will send
enum ClientMessage {
    CreateGame = 'challengePlayer',
    makeMove = 'makeMove',
    MakeMove = 'makeMove'
}

function sendMessage(playerId: string, message: any) {

}

console.log('WebSocket server is running on ws://localhost:8080');