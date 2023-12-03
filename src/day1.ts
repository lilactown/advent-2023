let example = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

function sumLines(sum: number, line: string[] | number[]){
  let first = line[0];
  let last = line[line.length - 1];
  // combine first and last as a string then parse
  let n = parseInt('' + first + last);

  return sum + n
}

function part1(input: string) {
  return input
    .split('\n')
    .map(line => line
      .split('')
      // for each character, keep it if it parses as a number
      .filter(char => !Number.isNaN(parseInt(char)))
  ).reduce(sumLines, 0)
}

part1(example) // 142

let fs = require('node:fs');

part1(fs.readFileSync('inputs/day1', 'utf8'))


let example2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

let numbers = ['1', '2', '3', '4','5','6','7','8','9','0',
  'one', 'two', 'three','four','five','six','seven','eight','nine']

function readNumber(s: string) {
  switch (s) {
  case 'one': return 1;
  case 'two': return 2;
  case 'three': return 3;
  case 'four': return 4;
  case 'five': return 5;
  case 'six': return 6;
  case 'seven': return 7;
  case 'eight': return 8;
  case 'nine': return 9;
  default: return parseInt(s);
  }
}

function part2(input: string) {
  return input.split('\n').map(line => {
    let found: RegExpMatchArray[] = [];
    for (let num of numbers) {
      // use fancy matchAll which returns a result that has `0` as the match,
      // `index` as the position it was found in
      let regex = new RegExp(num, 'g');
      found = [...found, ...line.matchAll(regex)]
    }
    return found
      // sort the found numbers by position in the line
      .sort((result1, result2) => (result1.index || 0) - (result2.index || 0))
      // map each match to a number
      .map(result => readNumber(result[0]));
  }).reduce(sumLines, 0) // sum up first and
}

part2(example2) // 281

part2(fs.readFileSync('inputs/day1', 'utf8'))
