let example =
  `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;


type SchematicValue = {
  value: string,
  y: number,
  start: number,
  end: number,
}

type Schematic = {
  parts: SchematicValue[],
  symbols: SchematicValue[]
}


function matchSchematicValues(lines: string[], regex: RegExp): SchematicValue[] {
  let values = lines.flatMap((line, y) => {
    let matches = line.matchAll(regex);
    let values = []
    for (let match of matches) {
      if (match.index === undefined) {
        throw new Error("this is impossible. stfu typescript")
      }
      values.push({
        value: match[0],
        y,
        start: match.index,
        end: match.index + match[0].length - 1,
      })
    }
    return values;
  });
  return values;
}


function parseSchematic(input: string): Schematic {
  let lines = input.split('\n');
  let parts = matchSchematicValues(lines, /(\d)+/g)
  let symbols = matchSchematicValues(lines, /([^\d^\.])+/g);
  return { parts, symbols };
}

parseSchematic(example)


function isAdjacent(a: SchematicValue, b: SchematicValue): boolean {
  if (Math.abs(a.y - b.y) > 1) return false
  if (a.start - b.start > 1) return false
  if (a.end - b.end < -1) return false
  return true
}

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: 1, start: 3, end: 3}
) // true

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: 2, start: 3, end: 3}
) // false

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: 1, start: 4, end: 4}
) // false

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: -1, start: 3, end: 3}
) // true


function part1({ parts, symbols }: Schematic): number {
  return parts
    .filter(part => symbols.some(symbol => isAdjacent(part, symbol)))
    .reduce((sum, part) => sum + parseInt(part.value), 0);
}

part1(parseSchematic(example)); // 4361

let fs = require('node:fs');

part1(parseSchematic(fs.readFileSync('../inputs/day3', 'utf8')));


function part2({ parts, symbols }: Schematic): number {
  let gears = 0;
  for (let symbol of symbols) {
    if (symbol.value === '*') {
      let adjacent = parts.filter(part => isAdjacent(part, symbol));
      if (adjacent.length === 2) {
        let [a, b] = adjacent;
        gears += parseInt(a.value) * parseInt(b.value);
      }
    }
  }
  return gears
}

part2(parseSchematic(example)); // 467835


part2(parseSchematic(fs.readFileSync('../inputs/day3', 'utf8')));
