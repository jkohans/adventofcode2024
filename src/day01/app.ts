const fs = require('node:fs');

const readData = (inputFilename: string) => {
    const data = fs.readFileSync(inputFilename);
    const lines = data.toString().split('\n');
    const leftSide: number[] = [];
    const rightSide: number[] = [];

    for (let line of lines) {
        const pair = line.split(/\s+/).map((x: string) => +x);
        leftSide.push(pair[0]);
        rightSide.push(pair[1]);
    }

    return {
        leftSide,
        rightSide
    }
}

const calculateFrequencies = (list: number[]) => {
    let frequencies = new Map<number, number>();

    for (let num of list) {
        if (frequencies.has(num)) {
            frequencies.set(num, frequencies.get(num)! + 1);
        }
        else {
            frequencies.set(num, 1);
        }
    }

    return frequencies;
}

const {leftSide, rightSide} = readData('./src/day01/input.txt');
const sortedLeft = leftSide.sort();
const sortedRight = rightSide.sort();
const rightFrequencies = calculateFrequencies(sortedRight);

let sum = 0;
for (const num of sortedLeft) {
    if (rightFrequencies.has(num)) {
        sum = sum + num * rightFrequencies.get(num)!;
    }
}
console.log(sum);

// let sum = 0;
// for (let i = 0; i < sortedLeft.length; i++) {
//     const difference = Math.abs(sortedLeft[i] - sortedRight[i]);
//     sum += difference;
// }

export {};
