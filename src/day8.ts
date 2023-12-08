let example1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

let example2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

// I miss clojure
function* cycle<T>(xs: Iterable<T>) {
  while (true) yield* xs;
}

function part1(input: string) {
  let [strategy, _blank, ...networkStrs] = input.split("\n");

  let network: { [key: string]: [string, string] } = {};
  for (let ns of networkStrs) {
    let [_, node, left, right] = ns.match(/(\w+) = \((\w+), (\w+)\)/) || [];
    network[node] = [left, right];
  }

  let node = "AAA";
  let moves = 0;
  for (let move of cycle(strategy)) {
    if (node === "ZZZ") return moves;
    let [left, right] = network[node];
    if (move === "L") node = left;
    if (move === "R") node = right;
    moves++;
  }
  return moves;
}

part1(example1);

part1(example2);

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day8", "utf8"));
