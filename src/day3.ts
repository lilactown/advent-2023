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
  numbers: SchematicValue[],
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
  let numbers = matchSchematicValues(lines, /(\d)+/g)
  let symbols = matchSchematicValues(lines, /([^\d^\.])+/g);
  return { numbers, symbols };
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
)

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: 2, start: 3, end: 3}
)

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: 1, start: 4, end: 4}
)

isAdjacent(
  { value: "123", y: 0, start: 0, end: 2},
  { value: "*", y: -1, start: 3, end: 3}
)


function part1(schematic: Schematic): number {
  return schematic.numbers
    .filter(number => schematic.symbols.some(symbol => isAdjacent(number, symbol)))
    .reduce((sum, number) => sum + parseInt(number.value), 0)
}

part1(parseSchematic(example)) // 4361

let fs = require('node:fs')

part1(parseSchematic(fs.readFileSync('../inputs/day3', 'utf8')))
