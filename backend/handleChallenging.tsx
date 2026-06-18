
import {
    sendMessage
} from "./index"

export { handleChallenge };

enum ServerMessage {
    popup = 'popup',
    challenge = 'challenge',
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