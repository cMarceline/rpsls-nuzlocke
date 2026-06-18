export { gameModeration };

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

function gameModeration() {
    testFunction();
}

function testFunction() {
    console.log("testPassed")
}