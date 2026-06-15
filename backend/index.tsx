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
        switch (message) {
            case 'createGame':
                const game = createGame(playerId);
                newPlayer.currentGame = game.id;
                ws.send(JSON.stringify({ type: 'gameCreated', gameId: game.id }));
                break;
            // Add more cases for joining games, making moves, etc.
        }
        // Handle incoming messages from clients here
    });

    ws.on('close', () => {
        console.log(`Player disconnected: ${playerId}`);
        // Handle player disconnection here
        players.splice(players.findIndex(p => p.id === playerId), 1);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');