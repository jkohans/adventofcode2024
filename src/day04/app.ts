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

    // unnecessary for XMAS and MAS which are all made up of distinct letters
    // don't count any previously used coordinates
    // used as array over set/hash for readability & debugging
    // if (used.some(({x, y}: Coordinate) => x === next.x && y === next.y)) {
    //     return false;
    // }

    return true;
};

const findOccurrencesStartingAt = (
    board: string[][], 
    word: string, 
    last: Coordinate, 
    used: Coordinate[]) : Coordinate[][] => 
{
    let occurrences: Coordinate[][] = [];
    
    if (word.length === 0) {  // base case
        return [used];
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
                    occurrences = occurrences.concat(
                        findOccurrencesStartingAt(
                            board, 
                            word.substring(1), 
                            next, 
                            used.concat([next])
                    )!);
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

        if (isValid(board, next, used)) {
            const nextLetter = board[next.x][next.y];

            if (word.startsWith(nextLetter)) {
                occurrences = occurrences.concat(
                    findOccurrencesStartingAt(
                        board, 
                        word.substring(1), 
                        next, 
                        used.concat([next])
                )!);
            }
        }
    }

    return occurrences;
};

const findAllOccurrences = (board: string[][], word: string) => {
    let allOccurrences = [];

    for (let i=0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const letter = board[i][j];

            if (word.startsWith(letter)) {
                const coordinate = {x: i, y: j}
                const occurences = findOccurrencesStartingAt(
                    board, 
                    word.substring(1), 
                    coordinate, 
                    [coordinate]);
                allOccurrences.push(...occurences)!;
            }
        }
    }

    return allOccurrences;
}

const isDiagonal = (used: Coordinate[]) => {
    const lastOne = used[used.length-1];
    const lastTwo = used[used.length-2];

    const delta = {
        x: lastOne.x - lastTwo.x,
        y: lastOne.y - lastTwo.y
    }

    return Math.abs(delta.x) === 1 && Math.abs(delta.y) === 1
};

const countOverlappingDiagonals = (diagonals: Coordinate[][]) => {
    // here we can be a little tricky since we know the target word is always MAS
    // we can look for pairs of diagonals where the 2nd letter (A) is overlapping
    let count = 0;

    for (let i=0; i < diagonals.length; i++) {
        for (let j=i+1; j < diagonals.length; j++) {  // start from i+1 to prevent dup matches
            const diagonal1 = diagonals[i];
            const diagonal2 = diagonals[j];

            // check x&y for 2nd letter match
            if (diagonal1[1].x === diagonal2[1].x && diagonal1[1].y === diagonal2[1].y) {
                count = count + 1;
            }
        }
    }

    return count;
};

const board = readData('src/day04/input.txt');
const allOccurrences = findAllOccurrences(board, "MAS");
// find all MAS's on diagonals and then cross-check which have overlapping As
const diagonals = allOccurrences.filter(isDiagonal);
console.log(countOverlappingDiagonals(diagonals));

export {};
