let example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

type Mapping = (n: number) => number | null;

function createMap(
  destinationStart: number,
  sourceStart: number,
  length: number,
): Mapping {
  return function map(n: number) {
    let delta = n - sourceStart;
    if (delta >= 0 && delta < length) {
      return destinationStart + delta;
    }
    return null;
  };
}

createMap(50, 98, 2)(98); // 50
createMap(50, 98, 2)(99); // 51
createMap(50, 98, 2)(100); // null
createMap(50, 98, 2)(97); // null

function parseMappings(lines: string[]): Map<string, Mapping[]> {
  let mappings = new Map();
  let currentMappings = [],
    currentName: string = "";
  for (let line of lines.slice(2)) {
    let maybeName;
    if (line === "") {
      mappings.set(currentName, currentMappings);
      currentMappings = [];
    } else if ((maybeName = line.match(/([\w|-]+) map:/)?.[1])) {
      currentName = maybeName;
    } else {
      let numbers = Array.from(line.matchAll(/(\d+)/g)).map((m) =>
        parseInt(m[0]),
      );
      if (numbers.length != 3) throw new Error("Invalid mapping description");
      currentMappings.push(createMap(...(numbers as [number, number, number])));
    }
  }
  mappings.set(currentName, currentMappings);
  return mappings;
}

function applyMappings(seed: number, mappings: Map<string, Mapping[]>) {
  let result = seed;
  for (let [_name, maps] of mappings) {
    for (let map of maps) {
      let mr = map(result);
      if (mr) {
        result = mr;
        break;
      }
    }
  }
  return result;
}

function part1(input: string) {
  let lines = input.split("\n");
  let seeds = Array.from(lines[0].matchAll(/(\d+)/g)).map((m) =>
    parseInt(m[0]),
  );

  // create mappings
  let mappings = parseMappings(lines);

  // apply mappings
  return Math.min(...seeds.map((seed) => applyMappings(seed, mappings)));
}

part1(example); // 35

// let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day5", "utf8"));

// I miss clojure
function partition2<T>(xs: T[]): [T, T][] {
  let partitions = [];
  let currentPartition: T[] = [];
  for (let x of xs) {
    if (currentPartition.length === 2) {
      partitions.push(currentPartition as [T, T]);
      currentPartition = [];
    }
    currentPartition.push(x);
  }
  // don't drop
  if (currentPartition.length === 2) {
    partitions.push(currentPartition as [T, T]);
  }
  return partitions;
}

partition2([1, 2, 3, 4]); // [ [ 1, 2 ], [ 3, 4 ] ]
partition2([1, 2, 3]); // [ [ 1, 2 ] ]

function* range(start: number, end: number) {
  let n = start;
  while (n < end) {
    yield n++;
  }
}

[...range(0, 4)]; // [ 0, 1, 2, 3 ]
[...range(11, 14)]; // [ 11, 12, 13 ]

function part2(input: string) {
  let lines = input.split("\n");
  let seedRanges = partition2(
    Array.from(lines[0].matchAll(/(\d+)/g)).map((m) => parseInt(m[0])),
  );

  let mappings = parseMappings(lines);
  let result = Infinity;
  for (let [start, length] of seedRanges) {
    for (let seed of range(start, start + length)) {
      let seedResult = applyMappings(seed, mappings);
      if (seedResult < result) result = seedResult;
    }
  }
  return result;
}

part2(example); // 46
part2(fs.readFileSync("../inputs/day5", "utf8"));
