let example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

function match(s: string, regexp: RegExp) {
  return Array.from(s.matchAll(regexp));
}

function matchNumbers(s: string) {
  return match(s, /(\d+)/g).map((m) => parseInt(m[0]));
}

function part1(input: string) {
  let totalScore = 0;
  for (let line of input.split("\n")) {
    let colonPos = line.indexOf(":");
    let pipePos = line.indexOf("|");
    let winners = matchNumbers(line.substring(colonPos + 1, pipePos));
    let myNumbers = matchNumbers(line.substring(pipePos + 1));

    let score = 0;
    let isFirst = true;
    for (let winner of winners.filter((n) => myNumbers.includes(n))) {
      if (isFirst === true) {
        score += 1;
        isFirst = false;
      } else {
        score = score * 2;
      }
    }
    totalScore += score;
  }
  return totalScore;
}

part1(example); // 13

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day4", "utf8"));
