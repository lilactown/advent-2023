let example = `Time:      7  15   30
Distance:  9  40  200`;

/*
  distance = (time - held) * held

  (t - h) * h >= d
  -h^2 + th - d >= 0
  h^2 - th + d <= 0

  Example:
  h^2 - 7h + 9 >= 0

  h >= (7 - sqrt(13)) / 2
  h <= (7 + sqrt(13)) / 2

 */

function quadraticFormula(a: number, b: number, c: number): [number, number] {
  let neg = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  let pos = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return [neg, pos];
}

(7 - Math.sqrt(13)) / 2;
(7 + Math.sqrt(13)) / 2;

quadraticFormula(1, -7, 9); // [ 1.6972243622680054, 5.302775637731995 ]
quadraticFormula(1, -15, 40); // [ 3.4688711258507254, 11.531128874149275 ]
quadraticFormula(1, -30, 200); // [ 10, 20 ]

function computeDistance(time: number, held: number): number {
  return (time - held) * held;
}

function countSolutions(time: number, distance: number) {
  let [min, max] = quadraticFormula(1, -time, distance);
  // round to integers
  min = Math.floor(min);
  max = Math.ceil(max);

  // check the ends
  while (computeDistance(time, min) <= distance) {
    min++;
  }

  while (computeDistance(time, max) <= distance) {
    max--;
  }

  return max - min + 1; // add 1 to get the right count
}

function match(s: string, regexp: RegExp) {
  return Array.from(s.matchAll(regexp));
}

function matchNumbers(s: string) {
  return match(s, /(\d+)/g).map((m) => parseInt(m[0]));
}

function part1(input: string) {
  let [timesStr, distancesStr] = input.split("\n");
  let times = matchNumbers(timesStr);
  let distances = matchNumbers(distancesStr);

  let result = 1;
  for (let i = 0; i < times.length; i++) {
    result = result * countSolutions(times[i], distances[i]);
  }
  return result;
}

computeDistance(30, 10);

part1(example); // 288

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day6", "utf8"));

function part2(input: string) {
  let [time, distance] = matchNumbers(input.replaceAll(" ", ""));
  return countSolutions(time, distance);
}

part2(example); // 71503

part2(fs.readFileSync("../inputs/day6", "utf8"));
