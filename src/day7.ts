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

function score(hand: Hand) {
  if (isFiveOfAKind(hand)) {
    return 6;
  }
  if (isOfAKind(hand, 4)) {
    return 5;
  }
  if (isFullHouse(hand)) {
    return 4;
  }
  if (isOfAKind(hand, 3)) {
    return 3;
  }
  if (isTwoPair(hand)) {
    return 2;
  }
  if (isOfAKind(hand, 2)) {
    return 1;
  }
  // high card
  return 0;
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
