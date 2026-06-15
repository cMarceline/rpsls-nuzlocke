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
    websocket: WebSocket;
    name?: string;
    availableMoves: availableMoves;
    currentOpponent?: string;
    state: userStates;
}

var players: { [id: string]: player } = {};

wss.on('connection', (ws: WebSocket) => {
    const playerId = uuidv4();
    const newPlayer: player = {
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

    players[playerId] = newPlayer;
    console.log(`Player connected: ${playerId}`);
    sendMessage(playerId, ServerMessage.welcome, playerId);

    ws.on('message', (message: string) => {
        receiveMessage(playerId, JSON.parse(message));
    });

    ws.on('close', () => {
        console.log(`Player disconnected: ${playerId}`);
        // Handle player disconnection here
        delete players[playerId];
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

async function handleChallenge(playerId: string, opponentId: string) {
    const player = players[playerId];
    const opponent = players[opponentId.trim()];
    
    if (!player || !opponent) {
        console.warn(`Player or opponent not found: ${playerId}, ${opponentId}`);
        sendMessage(playerId, ServerMessage.popup, 'Who the fuck you looking for????');
        return;
    }

    var challengeData
    if (player.name) {
        challengeData = {
            challenger: playerId,
            message: `${player.name} has challenged you to a game!`
        }
    } else {
        challengeData = {
            challenger: playerId,
            message: `${playerId} has challenged you to a game!`
        }
    };

    player.state = userStates.Challenging;
    player.currentOpponent = opponentId;
    
    if (opponent.state == userStates.Searching) {
        opponent.state = userStates.Challenged;
    } else {
        sendMessage(playerId, ServerMessage.popup, 'Player is busy');
        return;
    }

    sendMessage(opponentId, ServerMessage.challenge, challengeData);
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