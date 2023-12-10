import { matchNumbers, sum } from "./util";

let example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

function part1(input: string) {
  function extrapolate(ns: number[]): number {
    let deltas: number[] = [];
    for (let i = 1; i < ns.length; i++) {
      deltas.push(ns[i] - ns[i - 1]);
    }
    if (deltas.every((n) => n === 0)) {
      return ns[ns.length - 1];
    } else {
      return ns[ns.length - 1] + extrapolate(deltas);
    }
  }
  return input
    .split("\n")
    .map((line) => extrapolate(matchNumbers(line)))
    .reduce(sum);
}

part1(example);

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day9", "utf8"));
