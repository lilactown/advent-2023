let example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

type Game = {
  id: number,
  choices: { cubes: { color: Color, count: number }[] }[]
}

function parseGames(input: string): Game[] {
  let games = [];
  for (let line of input.split('\n')) {
    // 'Game (id): ...'
    let gameIdPos = line.indexOf(': ');
    let id = line.substring(0, gameIdPos).match(/(\d+)/g)?.[0];
    line = line.substring(gameIdPos + 2); // 2 for length of ': '

    let choices = [];
    for (let choice of line.split('; ')) {
      // '(num) (color),' '(num) (color)'
      let choiceMatches = choice.matchAll(/(\d+) (\w+)/g)

      // Each 'choice' the Elf reaches into a back and produces some number of
      // cubes. We break the cubes down into the number of red, blue and green
      // produced. That is a single 'choice' - the cubes are then put back into
      // the bag.

      let cubes = []
      for (let [_, count, color] of choiceMatches) {
        cubes.push({ count: parseInt(count), color: color as Color })
      }
      choices.push({ cubes })
    }

    games.push({ id: parseInt(id as string), choices, string: line});
  }
  return games;
}

console.dir(parseGames(example), {depth: null})


function part1(games: Game[]) {
  return games.filter(game => {
    for (let choice of game.choices) {
      for (let cube of choice.cubes) {
        if (cube.color === 'red' && cube.count > 12) return false
        if (cube.color === 'green' && cube.count > 13) return false
        if (cube.color === 'blue' && cube.count > 14) return false
      }
    }
    return true
  }).reduce((sum, { id }) => sum + id, 0);
}

part1(parseGames(example)) // 8


let fs = require('node:fs');

part1(parseGames(fs.readFileSync('inputs/day2', 'utf8')));


function part2(games: Game[]) {
  return games.map(game => {
    let red = 0, green = 0, blue = 0;
    for (let choice of game.choices) {
      for (let cube of choice.cubes) {
        if (cube.color === 'red' && cube.count > red) red = cube.count;
        if (cube.color === 'green' && cube.count > green) green = cube.count;
        if (cube.color === 'blue' && cube.count > blue) blue = cube.count;
      }
    }
    return red * green * blue;
  }).reduce((sum, power) => sum + power);
}

part2(parseGames(example)) // 2286

part2(parseGames(fs.readFileSync('inputs/day2', 'utf8')))
