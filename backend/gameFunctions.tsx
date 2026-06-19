import { sendMessage, ServerMessage } from "./index";
import { v4 as uuidv4 } from 'uuid';

export { gameModeration };

export enum Move {
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

interface gamePlayer {
    lockedIn? : Move,
    available : availableMoves
}

var games: { [id: string]: { [playerID: string]: gamePlayer } } = {};

function startGame(playerIDs: string[]) {
    const newGameUUID = uuidv4()
    var game: { [id: string]: gamePlayer } = {}; 
    for (const playerID of playerIDs) {
        const freshMoveList : availableMoves = {
            [Move.Rock] : true,
            [Move.Paper]: true,
            [Move.Scissors]: true,
            [Move.Lizard]: true,
            [Move.Spock]: true
        }
        const freshGamePlayer : gamePlayer = {
            available: freshMoveList
        }
        game[playerID] = freshGamePlayer
    }
    games[newGameUUID] = game
}

function changeUUID(gameID : string, oldUUID : string, newUUID : string) {
    if (!games[gameID]){
        sendMessage(newUUID, ServerMessage.whatTheFuck, "You got disconnected from a match :(");
        return;
    }
    if (!games[gameID][oldUUID]) {
        sendMessage(newUUID, ServerMessage.whatTheFuck, "You weren't in this game!");
        return;
    }
    games[gameID][newUUID] = games[gameID][oldUUID]
    delete(games[gameID][oldUUID]);
}

function gameModeration() {
}

function testFunction() {
}