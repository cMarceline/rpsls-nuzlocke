import { WebSocketServer, WebSocket } from 'ws';
import { setTimeout } from 'timers';
import { v4 as uuidv4 } from 'uuid';
const admin_wss = new WebSocketServer({ port: 9090 });
const user_wss = new WebSocketServer({ port: 8080 });

export enum ServerMessage {
    whatTheFuck = 'what the fuck',
    lock = 'lock',
    unlock = 'unlock',
    reset = 'reset',
}

enum ClientMessage {
    buzz = 'buzz',
    lockConfirmed = 'locked',
    lock = 'lock',
    reset = 'reset',
}

interface Player {
    websocket: WebSocket,
    locked: Boolean,
}

var players: { [id: string]: Player } = {}
var globalLock = false
var buzzQueue: [Date, string][] = []

user_wss.on('connection', (ws: WebSocket) => {

    const uuid = uuidv4()
    const newPlayer : Player = {
        websocket: ws,
        locked: globalLock,
    }
    players[uuid] = newPlayer
    console.log(uuid + " connected!")

    ws.on('message', (message: string) => {
        console.log(message)
        receiveMessage(uuid, JSON.parse(message))
    });

    ws.on('close', () => {
        delete(players[uuid])
    });
});

admin_wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        receiveMessage("admin", JSON.parse(message))
    });
    ws.on('close', () => {
    });
});


function sendMessage(playerId: string, type: ServerMessage, arg: any) {
    const player = players[playerId];
    if (!player) {
        console.warn(`Player ${playerId} not found`);
        return;
    }
    player.websocket.send(JSON.stringify({ type, arg }));
}

async function receiveMessage(playerId: string, message: any) {
    console.log(message);
    if (!players[playerId]){
        return
    }

    switch (message.type) {
        // User Messages
        case ClientMessage.buzz :
            console.log([message.data.time, message.data.name])
            buzzQueue.push([message.data.time, message.data.name])
            lock()
            break
        case ClientMessage.lockConfirmed : 
            if (players[playerId]) {
                players[playerId].locked = true
            }
            break
        // Admin Messages
        case ClientMessage.lock: 
            console.log("Force Lock");
            break
        case ClientMessage.reset:
            console.log("reset!")
        //case ClientMessage.challengePlayer:
    }
}

async function lock() {
    if (globalLock){
        return
    }

    globalLock = true
    for (var player in players) {
        sendMessage(player, ServerMessage.lock, Date.now())
    }

    while (!(await isEveryoneLocked())) {
        console.log("waiting for everyone to lock up")
        await sleep(100)
    }

    buzzQueue.sort((a, b) => a[0].getTime() - b[0].getTime());
    // OBS Websocket
    if (buzzQueue[0]) {
        console.log(buzzQueue[0][1] + " Buzzed In First!" + "Runners Up" + buzzQueue);
    } else {
        console.log("No One Buzzed in!")
    }

}


async function isEveryoneLocked(): Promise<Boolean> {
    return Object.values(players).every(player => player?.locked);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


console.log('User WebSocket server is running on ws://localhost:8080');
console.log('Admin WebSocket server is running on ws://localhost:9090');