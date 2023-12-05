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

function createMap(
  destinationStart: number,
  sourceStart: number,
  length: number,
) {
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

function part1(input: string) {
  let lines = input.split("\n");
  let seeds = Array.from(lines[0].matchAll(/(\d+)/g)).map((m) =>
    parseInt(m[0]),
  );

  // create mappings
  let mappings: Map<string, ((n: number) => number | null)[]> = new Map();
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

  // apply mappings
  return Math.min(
    ...seeds.map((seed) => {
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
    }),
  );
}

part1(example); // 35

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day5", "utf8"));
