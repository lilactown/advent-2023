let example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

// I miss clojure
function frequencyMap<T>(xs: Iterable<T>): Map<T, number> {
  let freqs = new Map();
  for (let x of xs) {
    freqs.set(x, (freqs.get(x) || 0) + 1);
  }
  return freqs;
}

frequencyMap("32T3K"); // Map(4) { '3' => 2, '2' => 1, 'T' => 1, 'K' => 1 }

type Hand = Map<string, number>;

function isFiveOfAKind(hand: Hand): boolean {
  return hand.size === 1;
}

isFiveOfAKind(frequencyMap("AAAAA")); // true
isFiveOfAKind(frequencyMap("AAAA2")); // false
isFiveOfAKind(frequencyMap("23456")); // false

function isOfAKind(hand: Hand, kind: number) {
  return Array.from(hand.values()).some((n) => n === kind);
}

isOfAKind(frequencyMap("AAAA2"), 4); // true
isOfAKind(frequencyMap("AAAAA"), 4); // false
isOfAKind(frequencyMap("23456"), 4); // false

function isFullHouse(hand: Hand): boolean {
  return isOfAKind(hand, 3) && isOfAKind(hand, 2);
}

isFullHouse(frequencyMap("AAA22")); // true
isFullHouse(frequencyMap("AAAA2")); // false
isFullHouse(frequencyMap("AAAAA")); // false
isFullHouse(frequencyMap("23456")); // false

function isTwoPair(hand: Hand): boolean {
  return isOfAKind(hand, 2) && hand.size === 3;
}

isTwoPair(frequencyMap("AA332")); // true
isTwoPair(frequencyMap("AA333")); // false
isTwoPair(frequencyMap("AA321")); // false
isTwoPair(frequencyMap("AAAAA")); // false

enum Scores {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  Pair = 1,
  None = 0,
}

function score(hand: Hand) {
  if (isFiveOfAKind(hand)) {
    return Scores.FiveOfAKind;
  }
  if (isOfAKind(hand, 4)) {
    return Scores.FourOfAKind;
  }
  if (isFullHouse(hand)) {
    return Scores.FullHouse;
  }
  if (isOfAKind(hand, 3)) {
    return Scores.ThreeOfAKind;
  }
  if (isTwoPair(hand)) {
    return Scores.TwoPair;
  }
  if (isOfAKind(hand, 2)) {
    return Scores.Pair;
  }
  // high card
  return Scores.None;
}

function scoreCard(card: string) {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    case "T":
      return 10;
    default:
      return parseInt(card);
  }
}

function part1(input: string) {
  return input
    .split("\n")
    .map((line) => {
      let [handStr, bid] = line.split(" ");
      return [handStr, frequencyMap(handStr), parseInt(bid)] as [
        string,
        Hand,
        number,
      ];
    })
    .sort(([handstrA, handA], [handstrB, handB]) => {
      let scoreA = score(handA);
      let scoreB = score(handB);

      if (scoreA < scoreB) {
        return -1;
      }
      if (scoreB < scoreA) {
        return 1;
      }
      // check for a high card
      for (let i = 0; i < handstrA.length; i++) {
        let cardA = scoreCard(handstrA[i]);
        let cardB = scoreCard(handstrB[i]);
        if (cardA < cardB) {
          return -1;
        }
        if (cardB < cardA) {
          return 1;
        }
      }
      return 0;
    })
    .reduce((result, [_handStr, _hand, bid], i) => {
      return result + bid * (i + 1);
    }, 0);
}

part1(example); // 6440

let fs = require("node:fs");

part1(fs.readFileSync("../inputs/day7", "utf8"));

function score2(hand: Hand) {
  let jokers = hand.get("J");
  switch (jokers) {
    case 5: // JJJJJ
      return Scores.FiveOfAKind;
    case 4: // xJJJJ
      return Scores.FiveOfAKind;
    case 3:
      if (isOfAKind(hand, 2)) {
        // xxJJJ
        return Scores.FiveOfAKind;
      } else {
        // xyJJJ
        return Scores.FourOfAKind;
      }
    case 2:
      if (isOfAKind(hand, 3)) {
        // xxxJJ
        return Scores.FiveOfAKind;
      } else if (isTwoPair(hand)) {
        // xxyJJ
        return Scores.FourOfAKind;
      } else {
        // xyzJJ
        return Scores.ThreeOfAKind;
      }
    case 1:
      if (isOfAKind(hand, 4)) {
        // aaaaJ
        return Scores.FiveOfAKind;
      } else if (isOfAKind(hand, 3)) {
        // aaabJ
        return Scores.FourOfAKind;
      } else if (isTwoPair(hand)) {
        // aabbJ
        return Scores.FullHouse;
      } else if (isOfAKind(hand, 2)) {
        // aabcJ
        return Scores.ThreeOfAKind;
      } else {
        // abcdJ
        return Scores.Pair;
      }
    default:
      break;
  }
  return score(hand);
}

score2(frequencyMap("32T3K")); // 1
score2(frequencyMap("KK677")); // 2
score2(frequencyMap("KTJJT")); // 5
score2(frequencyMap("T55J5")); // 5
score2(frequencyMap("QQQJA")); // 5

function s(h: string) {
  return score2(frequencyMap(h));
}

s("486AA"); // 1
s("KJAKA"); // 4
s("992JK"); // 3
s("44554"); // 4

function scoreCard2(card: string) {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 1; // weakest card
    case "T":
      return 10;
    default:
      return parseInt(card);
  }
}

function compareHands(
  [handstrA, handA]: [string, Hand, number],
  [handstrB, handB]: [string, Hand, number],
) {
  let scoreA = score2(handA);
  let scoreB = score2(handB);

  if (scoreA < scoreB) {
    return -1;
  }
  if (scoreB < scoreA) {
    return 1;
  }
  // check for a high card
  for (let i = 0; i < handstrA.length; i++) {
    let cardA = scoreCard2(handstrA[i]);
    let cardB = scoreCard2(handstrB[i]);
    if (cardA < cardB) {
      return -1;
    }
    if (cardB < cardA) {
      return 1;
    }
  }
  return 0;
}

function part2(input: string) {
  return input
    .split("\n")
    .map((line) => {
      let [handStr, bid] = line.split(" ");
      return [handStr, frequencyMap(handStr), parseInt(bid)] as [
        string,
        Hand,
        number,
      ];
    })
    .sort(compareHands)
    .reduce((result, [_handStr, _hand, bid], i) => {
      return result + bid * (i + 1);
    }, 0);
}

part2(example); // 5905

part2(fs.readFileSync("../inputs/day7", "utf8"));

// troubleshooting
// https://www.reddit.com/r/adventofcode/comments/18cr4xr/2023_day_7_better_example_input_not_a_spoiler/
let example2 = `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`;

part1(example2); // 6592
part2(example2); // 6803
