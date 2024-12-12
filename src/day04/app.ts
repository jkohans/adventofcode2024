import fs from 'node:fs';

// class to be able to define a toString method on it
class Coordinate {
    x: number = -1;
    y: number = -1;

    toString() {
        return `x: ${this.x}, y: ${this.y}`
    };
};

const readData = (inputFileName: string) => {
    const data = fs.readFileSync(inputFileName);
    const contents = data.toString();
    let board: string[][] = [];

    const lines = contents.split('\n');
    for (const line of lines) {
        board.push(line.split(''))
    }

    return board;
}

const isValid = (
    board: string[][],
    next: Coordinate, 
    used: Coordinate[]) => 
{
    // out of bounds on x-axis
    if (next.x < 0 || next.x >= board.length) {
        return false;
    }

    // out of bounds on y-axis
    if (next.y < 0 || next.y >= board[next.x].length) {
        return false;
    }

    // don't count any previously used coordinates
    // used as array over set/hash for readability & debugging
    if (used.some(({x, y}: Coordinate) => x === next.x && y === next.y)) {
        return false;
    }

    return true;
};

const findOccurrencesStartingAt = (
    board: string[][], 
    word: string, 
    last: Coordinate, 
    used: Coordinate[]) => 
{
    // horizontal, vertical, diagonal, or backwards
    // not all at the same time :-)
    let numOccurrences = 0;
    
    if (word.length === 0) {  // base case
        return 1;
    }

    // establish the direction
    if (used.length == 1) {
        for (let i=last.x-1; i <= last.x+1; i++) {
            for (let j=last.y-1; j <= last.y+1; j++) {
                const next = {x: i, y: j};
                if(!isValid(board, next, used)) {
                    continue;  // don't stop the iteration
                }
                const nextLetter = board[next.x][next.y];

                if (word.startsWith(nextLetter)) {
                    numOccurrences += findOccurrencesStartingAt(
                        board, 
                        word.substring(1), 
                        next, 
                        used.concat([next])
                    )!;
                }
            }
        }
    }
    else { // follow the already established direction
        const lastOne: Coordinate = used[used.length - 1];
        const lastTwo: Coordinate = used[used.length - 2];

        const delta: Coordinate = {
            x: lastOne.x - lastTwo.x,
            y: lastOne.y - lastTwo.y
        };

        const next: Coordinate = {
            x: lastOne.x + delta.x,
            y: lastOne.y + delta.y
        };

        if (!isValid(board, next, used)) {
            return 0;
        }

        const nextLetter = board[next.x][next.y];

        if (word.startsWith(nextLetter)) {
            numOccurrences += findOccurrencesStartingAt(
                board, 
                word.substring(1), 
                next, 
                used.concat([next])
            )!;
        }
    }

    return numOccurrences;
};

const findAllOccurrences = (board: string[][], word: string) => {
    let totalOccurrences = 0;

    for (let i=0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const letter = board[i][j];

            if (word.startsWith(letter)) {
                const coordinate = {x: i, y: j}
                const numOccurrences = findOccurrencesStartingAt(
                    board, 
                    word.substring(1), 
                    coordinate, 
                    [coordinate]);
                totalOccurrences += numOccurrences!;
            }
        }
    }

    return totalOccurrences;
}

const board = readData('src/day04/input.txt');
console.log(findAllOccurrences(board, "XMAS"));

export {};
