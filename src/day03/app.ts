const fs = require("node:fs");

const loadData = (inputfilename: string) => {
    const data = fs.readFileSync(inputfilename);

    return data.toString();
}

// pattern to match is mul(x{1-3}, x{1-3})
const data = loadData('./src/day03/input.txt');
const re = /mul\((\d{1,3}),\d{1,3}\)|do(n't)?\(\)/g;
const matches = data.matchAll(re);
let sum = 0;

let enabled = true;

for (let m of matches) {
    const instruction = m[0];

    if (instruction.startsWith('mul') && enabled) {
        let numbersPart = m[0].substring(4, m[0].length-1);
        const [num1, num2] = numbersPart.split(",").map((x: string) => +x);
        sum = sum + num1 * num2;
    } else {
        if (instruction.startsWith("don")) {
            enabled = false;
        }
        else if (instruction.startsWith("do")) {
            enabled = true;
        }
    }
}
console.log(sum);

export {};
