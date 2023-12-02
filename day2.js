let example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;


function parseGames(input) {
  let games = [];
  for (let line of input.split('\n')) {
    let gameIdPos = line.indexOf(': ');
    let id = line.substring(0, gameIdPos).match(/(\d+)/g)[0];
    line = line.substring(gameIdPos + 2); // 2 for length of ': '

    let choices = [];
    for (let round of line.split('; ')) {
      let choiceMatches = round.matchAll(/(\d+) (\w+)/g)
      let cubes = []
      for (let [_, count, color] of choiceMatches) {
        cubes.push({ count: parseInt(count), color })
      }
      choices.push({ cubes })
    }

    games.push({ id: parseInt(id), choices, string: line});
  }
  return games;
}

console.dir(parseGames(example), {depth: null})


function part1(games) {
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
