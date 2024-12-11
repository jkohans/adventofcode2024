const fs = require('node:fs');

const readData = (inputFilename: string) => {
    const data: number[][] = [];
    const fileContents = fs.readFileSync(inputFilename);
    const reports = fileContents.toString().split('\n');

    for (const report of reports) {
        const levels = report.split(/\s+/).map((x: string) => +x);
        data.push(levels);
    }
    return data;
}

const isValidReport = (report: number[]) => {
    // short-circuit: not increasing or decreasing
    if (report[1] === report[0]) {
        return false;
    }

    const isIncreasing = report[0] < report[1];

    if (isIncreasing) {
        if (!checkPairwise(report, (x, y) => x < y)) {
            return false;
        }
    }
    else {
        if (!checkPairwise(report, (x, y) => x > y)) {
            return false;
        }
    }

    return checkPairwise(report, (x, y) => {
       const difference = Math.abs(x - y);
       return difference >= 1 && difference <= 3;
    });
};

const checkPairwise = (report: number[], fn: (x: number, y: number) => boolean) => {
    for (let i=0; i < report.length-1; i++) {
        const first = report[i];
        const second = report[i+1];

        if (!fn(first, second)) {
            return false;
        }
    }

    return true;
}

const mutateReport = (report: number[]) => {
    let reports: number[][] = [];

    for (let i=0; i < report.length; i++) {
        const mutated = report.slice(0, i).concat(report.slice(i+1));
        reports.push(mutated);
    }

    return reports;
}

const anyIsValid = (report: number[]) => {
    if (isValidReport(report)) {
        return true;
    }

    const mutated = mutateReport(report);
    return mutated.some(isValidReport);
}

const data = readData("./src/day02/input.txt");

let numSafe = 0;
for (const report of data) {
    if (anyIsValid(report)) {
        numSafe = numSafe + 1;
    }
}

console.log(numSafe);
export {}; // make it a module
