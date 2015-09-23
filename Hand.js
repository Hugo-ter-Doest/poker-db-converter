/*
  Hand class
  Copyright (C) 2015 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var Card = require('./Card');

var HIGHCARD = 0;
var PAIR = 1;
var TWOPAIR = 2;
var THREEOFAKIND = 3;
var STRAIGHT = 4;
var FLUSH = 5;
var FULLHOUSE = 6;
var FOUROFAKIND = 7;
var STRAIGHTFLUSH = 8;
var ROYALFLUSH = 9;

var handRankNames = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight',
  'Flush', 'Full house', 'Four of a kind', 'Straight flush', 'Royal flush'];

// var HIGHCARD= 0;
// var PAIR = 1;
var SUITEDCARDS = 2;
var CONNECTEDCARDS = 3;
var CONNECTEDANDSUITED = 4;
var pocketRankNames = ['High card', 'Pair', 'Suited cards', 'Connected cards',
  'Connected and suited'];

function Hand(cards) {
  this.cards = cards;
  this.numberOfPairs = 0;
  this.hasThreeOfAKind = false;
  this.hasFourOfAKind = false;
  this.suites = {};
}

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 7 card probabilities
// Total number of combinations is 133,784,560
// hand 	        number 	    Probability
// Royal flush    4,324 	    .000032
// Straight flush 37,260 	    .000279
// 4-of-a-kind 	  224,848 	  .0017
// Full house 	  3,473,184 	.026
// Flush 	        4,047,644 	.030
// Straight 	    6,180,020 	.046
// 3-of-a-kind 	  6,461,620 	.048
// Two pairs 	    31,433,400 	.235
// Pair 	        58,627,800 	.438
// High card 	    23,294,460 	.174
Hand.prototype.sevenCardHandProb = function() {
  var totalNumberOfCombinations = 133784560;
  var numberOfCombinations = 0;
  switch (this.rank) {
    case HIGHCARD:
      numberOfCombinations = 23294460;
      break;
    case PAIR:
      numberOfCombinations = 58627800;
      break;
    case TWOPAIR:
      numberOfCombinations = 31433400;
      break;
    case THREEOFAKIND:
      numberOfCombinations = 6461620;
      break;
    case STRAIGHT:
      numberOfCombinations = 6180020;
      break;
    case FLUSH:
      numberOfCombinations = 4047644;
      break;
    case FULLHOUSE:
      numberOfCombinations = 3473184;
      break;
    case FOUROFAKIND:
      numberOfCombinations = 224848;
      break;
    case STRAIGHTFLUSH:
      numberOfCombinations = 37260;
      break;
    case ROYALFLUSH:
      numberOfCombinations = 4324;
      break;
  }
  this.rankProbability = numberOfCombinations / totalNumberOfCombinations;
};

Hand.prototype.sixCardHandProb = function() {
  var totalNumberOfCombinations = C(52, 6);
  var numberOfCombinations = 0;
  switch (this.rank) {
    case HIGHCARD:
      numberOfCombinations = 0;
      break;
    case PAIR:
      // Possible pairs, 5 cards are freely chosen, minus three of a kind and four of a kind
      numberOfCombinations = C(13, 1) * C(4, 2) * C(50, 3);
      break;
    case TWOPAIR:
      numberOfCombinations = 0;
      break;
    case THREEOFAKIND:
      numberOfCombinations = 0;
      break;
    case STRAIGHT:
      numberOfCombinations = 0;
      break;
    case FLUSH:
      numberOfCombinations = 0;
      break;
    case FULLHOUSE:
      numberOfCombinations = 0;
      break;
    case FOUROFAKIND:
      numberOfCombinations = 0;
      break;
    case STRAIGHTFLUSH:
      numberOfCombinations = 0;
      break;
    case ROYALFLUSH:
      numberOfCombinations = 0;
      break;
  }
  this.rankProbability = numberOfCombinations / totalNumberOfCombinations;

};

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 5 card probabilities
// Total number of combinations is C(52, 5) = 2,598,960
// hand 	        number 	    Probability
// Royal flush    4 	        0.00000154
// Straight flush 36 	        0.0000139
// 4-of-a-kind 	  624 	      0.000240
// Full house 	  3,744 	    0.001441
// Flush 	        5,108 	    0.001965
// Straight 	    10,200 	    0.003925
// 3-of-a-kind 	  54,912 	    0.021128
// Two pairs 	    123,552 	  0.047539
// Pair 	        1,098,240 	0.422569
// High card 	    1,302,540 	0.501177
Hand.prototype.fiveCardHandProb = function() {
  var totalNumberOfCombinations = 2598960;
  var numberOfCombinations = 0;
  switch (this.rank) {
    case HIGHCARD:
      numberOfCombinations = 1302540;
      break;
    case PAIR:
      numberOfCombinations = 1098240;
      break;
    case TWOPAIR:
      numberOfCombinations = 123552;
      break;
    case THREEOFAKIND:
      numberOfCombinations = 54912;
      break;
    case STRAIGHT:
      numberOfCombinations = 10200;
      break;
    case FLUSH:
      numberOfCombinations = 5108;
      break;
    case FULLHOUSE:
      numberOfCombinations = 3744;
      break;
    case FOUROFAKIND:
      numberOfCombinations = 624;
      break;
    case STRAIGHTFLUSH:
      numberOfCombinations = 36;
      break;
    case ROYALFLUSH:
      numberOfCombinations = 4;
      break;
  }
  this.rankProbability = numberOfCombinations / totalNumberOfCombinations;
};

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 2 card probabilities
// Total number of combinations is C(52, 2) = 1,326
//Pair                                        78/1326 = 0.0588
//Suited cards                                312/1326 = 0.2353
//Unsuited cards non paired                   936/1325 = 0.7059
//Suited connectors                           (13 x 4) / 1326 = 0.0392
//Connected cards                             (13 x 4 x 4) / 1326 = 0.156

//AKs (or any specific suited cards) 	        0.00302 	331 : 1
//AA (or any specific pair) 	                0.00452 	221 : 1
//AKs, KQs, QJs, or JTs (suited cards) 	      0.0121 	  81.9 : 1
//AK (or any specific non-pair incl. suited) 	0.0121 	  81.9 : 1
//AA, KK, or QQ 	                            0.0136 	  72.7 : 1
//AA, KK, QQ or JJ 	                          0.0181 	  54.3 : 1
//Suited cards, jack or better 	              0.0181 	  54.3 : 1
//AA, KK, QQ, JJ, or TT 	                    0.0226 	  43.2 : 1
//Suited cards, 10 or better 	                0.0302 	  32.2 : 1
//Suited connectors 	                        0.0392 	  24.5 : 1
//Connected cards, 10 or better 	            0.0483 	  19.7 : 1
//Any 2 cards with rank at least queen 	      0.0498 	  19.1 : 1
//Any 2 cards with rank at least jack 	      0.0905 	  10.1 : 1
//Any 2 cards with rank at least 10 	        0.143 	  5.98 : 1
//Connected cards (cards of consecutive rank) 0.157 	  5.38 : 1
//Any 2 cards with rank at least 9 	          0.208 	  3.81 : 1
//Not connected nor suited, at least one 2-9 	0.534 	  0.873 : 1
Hand.prototype.twoCardHandProb = function() {
  var totalNumberOfCombinations = 1326;
  var numberOfCombinations = 0;
  switch (this.rank) {
    case HIGHCARD:
      // Unsuited cards non paired
      numberOfCombinations = 936;
      break;
    case SUITEDCARDS:
      numberOfCombinations = 312;
      break;
    case CONNECTEDCARDS:
      numberOfCombinations = 208;
      break;
    case CONNECTEDANDSUITED:
      numberOfCombinations = 52;
      break;
    case PAIR:
      numberOfCombinations = 78;
      break;
  }
  this.rankProbability = numberOfCombinations / totalNumberOfCombinations;
};

// Binomial coefficient
function C(n, k) {
  var coeff = 1;
  for (var x = n - k + 1; x <= n; x++) {
    coeff *= x;
  }
  for (x = 1; x <= k; x++) {
    coeff /= x;
  }
  return coeff;
}

// Function for conditional probabilities given a hand with two cards
// Maps hand rank to new (better) hand ranks
Hand.prototype.preflopProbabilities = function() {
  this.frequency = [];
  this.probability = [];
  this.totalCombinations = C(50, 3);
  // Depending on the hand rank we calculate the probabilities of
  // a new rank
  switch(this.rank) {
    case HIGHCARD:
      // Pair: two cases:
      // - Two ranks and three suites to form a pair, 2 other cards have 11
      //   ranks left to choose from (but must be unique, suite is free
      // - Board pairing
      this.frequency[PAIR] = 2 * 3 * 4 * 4 * C(11, 2) +
        // Board pairing, third card is from 10 ranks, 4 suites
        C(11, 1) * C(4, 2) * C(40, 1);

      // Two pair: two cases
      // - Both pocket cards should be matched: 3 cards to form first
      //   pair, 3 cards to form second pair, third card has 11 ranks left,
      //   suite is free
      // - One matching card and a board pairing
      this.frequency[TWOPAIR] =  C(3, 1) * C(3, 1) *  C(44, 1) +
        // Board pairing
        C(3, 1) * C(2, 1) *  C(4, 2) * C(11, 1);

      // Three of a kind: two cases:
      // - Two cards should match the rank of a pocket card,
      //   three suites left; third card has 11 ranks left, suite is free
      // - Board three of a kind
      this.frequency[THREEOFAKIND] =
        // Two board cards match pocket cards
        C(3, 2) * C(2, 1) * C(44, 1) +
        // Board three of a kind: rank is fixed, suite is 3 of 4 suites
        C(4, 3) * C(11, 1);

      // Four of a kind: all three cards match a pocket card, there are two
      // ranks to choose from all three suites are used -> 2 cases
      this.frequency[FOUROFAKIND] = 2;

      // Straight; possible if two cards are a max. of  4 ranks from each other
      this.frequency[STRAIGHT] = 0;
      // We need three distinctly ranked cards, all 4 suites can be used,
      // cases:
      // - 3 cards in between -> two cases: with or without Ace as first card
      if (((this.cards[0].rank + 4) === this.cards[1].rank)  ||
        ((this.cards[1].rank === Card.ACE) && (this.cards[0].rank === Card.FIVE))) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 2 in between, 1 before
      if (((this.cards[0].rank + 3) === this.cards[1].rank) &&
        (this.cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 2 in between, 1 after
      if (((this.cards[0].rank + 3) === this.cards[1].rank) &&
        (this.cards[0].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 2 before
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[0].rank >= Card.THREE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 2 after
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[1].rank + 1 < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 1 before, 1 after
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[1].rank < Card.ACE) &&
        (this.cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }

      // High card: three cards that do not make a pair (choose 3 ranks from 11,
      // suites are free), and do not make a flush or straight
      this.frequency[HIGHCARD] = 4 * 4 * 4 * C(11, 3) -
        this.frequency[STRAIGHT];

      // Flush; not possible because cards are not suited
      this.frequency[FLUSH] = 0;

      // Full house: One card is matched once to make a pair, one card is
      // matched twice to make a triple
      this.frequency[FULLHOUSE] = C(3, 2) * C(2, 1) * C(3, 1) * C(1, 1);

      // Straight flush; not possible because straight is impossible
      this.frequency[STRAIGHTFLUSH] = 0;

      // Royal flush; not possible because straight is impossible
      this.frequency[ROYALFLUSH] = 0;
      break;
    case PAIR:
      // Pair
      this.frequency[PAIR] =
        // All three card combinations
        C(48, 3) -
        // Minus pairs
        C(12, 1) * C(4, 2) * C(44, 1) -
        // Minus three of a kind
        C(12, 1) * C(4, 3);

      // Two pair: implies a board pairing: 12 ranks available
      this.frequency[TWOPAIR] = C(12, 1) * C(4, 2) * C(44, 1);

      // Three of a kind: 1 card matches the pocket cards,
      // remaining cards from 48 left-over cards minus all possible pairs
      this.frequency[THREEOFAKIND] =
        2 * (C(48, 2) - C(12, 1) * C(4, 2));

      // Four of a kind: two cards match the pocket cards making four of a kind,
      // third card is chosen from 48 remaining cards.
      this.frequency[FOUROFAKIND] =  1 * C(48, 1);

      // Straight
      this.frequency[STRAIGHT] = 0;

      // Flush
      this.frequency[FLUSH] = 0;

      // Full house: two cases:
      this.frequency[FULLHOUSE] =
        // - A board three of a kind from one of the remaining ranks
        C(12, 1) * C(4, 3) +
        // - 1 cards makes a set from the pocket cards plus a pair
        2 * C(12,1) * C(4, 2);

      // Straight flush
      this.frequency[STRAIGHTFLUSH] = 0;

      // Royal flush
      this.frequency[ROYALFLUSH] = 0;
      break;
    case SUITEDCARDS:
      // Pair: two cases:
      // - Two ranks and three suites to form a pair, 2 other cards have 11
      //   ranks left to choose from (but must be unique, suite is free
      // - Board pairing
      this.frequency[PAIR] = 2 * 3 * 4 * 4 * C(11, 2) +
        // Board pairing, third card is from 10 ranks, 4 suites
        C(11, 1) * C(4, 2) * C(40, 1);

      // Two pair: two cases
      // - Both pocket cards should be matched: 3 cards to form first
      //   pair, 3 cards to form second pair, third card has 11 ranks left,
      //   suite is free
      // - One matching card and a board pairing
      this.frequency[TWOPAIR] =  C(3, 1) * C(3, 1) *  C(44, 1) +
        // Board pairing
        C(3, 1) * C(2, 1) *  C(4, 2) * C(11, 1);

      // Three of a kind: two cases:
      // - Two cards should match the rank of a pocket card,
      //   three suites left; third card has 11 ranks left, suite is free
      // - Board three of a kind
      this.frequency[THREEOFAKIND] =
        // Two board cards match pocket cards
        C(3, 2) * C(2, 1) * C(44, 1) +
          // Board three of a kind: rank is fixed, suite is 3 of 4 suites
        C(4, 3) * C(11, 1);

      // Four of a kind: all three cards match a pocket card, there are two
      // ranks to choose from all three suites are used -> 2 cases
      this.frequency[FOUROFAKIND] = 2;

      // Straight; possible if two cards are a max. of  4 ranks from each other.
      this.frequency[STRAIGHT] = 0;
      this.frequency[STRAIGHTFLUSH] = 0;
      // Straight flush (1) is substracted in each case
      // Cases:
      // - 3 cards in between -> two cases: with or without Ace as first card
      if (((this.cards[0].rank + 4) === this.cards[1].rank)  ||
        ((this.cards[1].rank === Card.ACE) && (this.cards[0].rank === Card.FIVE))) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 2 in between, 1 before
      if (((this.cards[0].rank + 3) === this.cards[1].rank) &&
        (this.cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 2 in between, 1 after
      if (((this.cards[0].rank + 3) === this.cards[1].rank) &&
        (this.cards[0].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 2 before
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[0].rank >= Card.THREE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 2 after
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[1].rank + 1 < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 1 before, 1 after
      if (((this.cards[0].rank + 2) === this.cards[1].rank) &&
        (this.cards[1].rank < Card.ACE) &&
        (this.cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }

      // Flush: we need three more cards of the same suite, 11 cards available
      // Substract straight flush
      this.frequency[FLUSH] = C(11, 3) - 1;

      // High card: three uniquely ranked cards that do not pair with pocket cards and do not form
      // a flush or straight
      this.frequency[HIGHCARD] =
        // Three uniquely ranked cards, suite is free
        C(11, 3) * 4 * 4 * 4 -
          // Substract flushes
        this.frequency[FLUSH] -
          // Substract straights
        this.frequency[STRAIGHT] -
          // Substract straight flushes
        this.frequency[STRAIGHTFLUSH];

      // Full house: One card is matched once to make a pair, one card is
      // matched twice to make a triple
      this.frequency[FULLHOUSE] = C(3, 2) * C(2, 1) * C(3, 1) * C(1, 1);

      // Royal flush: if the pocket cards imply a royal flush
      this.frequency[ROYALFLUSH] = 0;
      break;
    case CONNECTEDCARDS:
      // Pair: two cases:
      // - Two ranks and three suites to form a pair, 2 other cards have 11
      //   ranks left to choose from (but must be unique, suite is free
      // - Board pairing
      this.frequency[PAIR] = 2 * 3 * 4 * 4 * C(11, 2) +
          // Board pairing, third card is from 10 ranks, 4 suites
        C(11, 1) * C(4, 2) * C(40, 1);

      // Two pair: two cases
      // - Both pocket cards should be matched: 3 cards to form first
      //   pair, 3 cards to form second pair, third card has 11 ranks left,
      //   suite is free
      // - One matching card and a board pairing
      this.frequency[TWOPAIR] =  C(3, 1) * C(3, 1) *  C(44, 1) +
        // Board pairing
        C(3, 1) * C(2, 1) *  C(4, 2) * C(11, 1);

      // Three of a kind: two cases:
      // - Two cards should match the rank of a pocket card,
      //   three suites left; third card has 11 ranks left, suite is free
      // - Board three of a kind
      this.frequency[THREEOFAKIND] =
        // Two board cards match pocket cards
        C(3, 2) * C(2, 1) * C(44, 1) +
        // Board three of a kind: rank is fixed, suite is 3 of 4 suites
        C(4, 3) * C(11, 1);

      // Full house: One card is matched once to make a pair, one card is
      // matched twice to make a triple
      this.frequency[FULLHOUSE] = C(3, 2) * C(2, 1) * C(3, 1) * C(1, 1);

      // Four of a kind: all three cards match a pocket card, there are two
      // ranks to choose from all three suites are used -> 2 cases
      this.frequency[FOUROFAKIND] = 2;

      // Straight: cards are connected, so we have the following cases:
      this.frequency[STRAIGHT] = 0;
      // - three before
      if (this.cards[0].rank >= Card.FOUR) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - two before, one after
      if ((this.cards[0].rank >= Card.THREE) && (this.cards[1].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - one before, two after
      if ((this.cards[0].rank >= Card.TWO) && (this.cards[1].rank < Card.KING)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - three after
      if (this.cards[1] < Card.QUEEN) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }

      this.frequency[STRAIGHTFLUSH] = 0;
      this.frequency[FLUSH] = 0;

      // High card: three uniquely ranked cards that do not pair with pocket cards and do not form
      // a flush or straight
      this.frequency[HIGHCARD] =
        // Three uniquely ranked cards, suite is free
        C(11, 3) * 4 * 4 * 4 -
        // Substract flushes
        0 -
        // Substract straights
        this.frequency[STRAIGHT] -
        // Substract straight flushes
        this.frequency[STRAIGHTFLUSH];

      this.frequency[ROYALFLUSH] = 0;
      break;
    case CONNECTEDANDSUITED:
      this.frequency[HIGHCARD] = 0;

      this.frequency[PAIR] = 0;

      this.frequency[TWOPAIR] = 0;

      this.frequency[THREEOFAKIND] = 0;

      this.frequency[FOUROFAKIND] = 0;

      this.frequency[STRAIGHT] = 0;

      this.frequency[FLUSH] = 0;

      this.frequency[STRAIGHTFLUSH] = 0;

      this.frequency[ROYALFLUSH] = 0;
      break;
  }
  var sumProb = 0;
  var sumFreq = 0;
  var that = this;
  this.frequency.forEach(function(f, index) {
    that.probability[index] = f / that.totalCombinations;
    sumProb += that.probability[index];
    sumFreq += that.frequency[index];
  });
  console.log('Total number of flop combinations: ' + this.totalCombinations);
  console.log('Sum of probabilities:              ' + sumProb);
  console.log('Total frequency:                   ' + sumFreq);
};

Hand.prototype.flopProbabilities = function() {

};

Hand.prototype.turnProbabilities = function() {

};

Hand.prototype.isFlush = function() {
  // Count number of cards per Suite
  var that = this;
  this.cards.forEach(function(card) {
    if (!that.suites[card.suite]) {
      that.suites[card.suite] = 1;
    }
    else {
      that.suites[card.suite]++;
    }
  });
  // Check if the hand has 5 cards of one suite
  return(
    Object.keys(this.suites).some(function(suite) {
      if (that.suites[suite] === 5) {
        that.flushSuite = suite;
        return (true);
      }
      else {
        return(false);
      }
    })
  );
};

// Look for a Straight from the highest ranked card down
Hand.prototype.isStraight = function() {
  for (var rank = Card.ACE; rank >= 0; rank--) {
    var isStraight = true;
    for (var i = 0; i < 4; i++) {
      isStraight = isStraight && this.ranksInHand[rank - i];
    }
    if (isStraight) {
      return (true);
    }
  }
  // Check for a Straight starting with Ace as 1
  return(this.ranksInHand[Card.ACE] &&
    this.ranksInHand[Card.TWO] &&
    this.ranksInHand[Card.THREE] &&
    this.ranksInHand[Card.FOUR] &&
    this.ranksInHand[Card.FIVE]);
};

// Precondition: hand is a Straight flush
Hand.prototype.isRoyalFlush = function() {
  var that = this;
  return(this.cards.some(function(c) {
    return((c.rank === Card.ACE) && (c.suite == that.flushSuite));
  }));
};

// Admin for double, triple, quadruple ranks
Hand.prototype.ranksInHand= function() {
  this.ranksInHand = {};
  // Check for equal ranks
  var that = this;
  this.cards.forEach(function(c) {
    if (!that.ranksInHand[c.rank]) {
      that.ranksInHand[c.rank] = 1;
    }
    else {
      that.ranksInHand[c.rank]++;
    }
  });
};

// Checks for x of a kind (pair, three of a kind, four of a kind)
Hand.prototype.xOfAKind = function() {
  var that = this;
  Object.keys(this.ranksInHand).forEach(function(rank) {
    if (that.ranksInHand[rank] === 4) {
      that.hasFourOfAKind = true;
    }
    if (that.ranksInHand[rank] === 2) {
      that.numberOfPairs++;
    }
    if (that.ranksInHand[rank] === 3) {
      that.hasThreeOfAKind = true;
    }
  });
};

Hand.prototype.twoCardSuited = function() {
  return(this.cards[0].suite === this.cards[1].suite);
};

Hand.prototype.twoCardConnected = function() {
  return(
    // Normal case
    (this.cards[0].rank + 1 === this.cards[1].rank) ||
    // Second card is an Ace and the first card is a 2
    ((this.cards[1].rank === Card.ACE) && (this.cards[0].rank === Card.TWO))
  );
};

// Calculates hand rank based on known cards
Hand.prototype.calculateHandRank = function() {
  // Sort the cards by rank in ascending order
  this.cards.sort(function(a, b) {
    return a.rank - b.rank;
  });
  this.ranksInHand();
  this.xOfAKind();

  var isFlush = this.isFlush();
  var isStraight = this.isStraight();

  if (isFlush && isStraight) {
    if (this.isRoyalFlush()) {
      this.rank = ROYALFLUSH;
    }
    else {
      this.rank = STRAIGHTFLUSH;
    }
  }
  else {
    if (isFlush) {
      this.rank = FLUSH;
    }
    else {
      if (isStraight) {
        this.rank = STRAIGHT;
      }
      else {
        if (this.hasFourOfAKind) {
          this.rank = FOUROFAKIND;
        }
        else {
          // Is this a Full house?
          if (this.hasThreeOfAKind && this.numberOfPairs) {
            this.rank = FULLHOUSE;
          }
          else {
            // Is this a Three of a kind?
            if (this.hasThreeOfAKind) {
              this.rank = THREEOFAKIND;
            }
            else {
              // Is this a Two pair?
              if (this.numberOfPairs > 1) {
                this.rank = TWOPAIR;
              }
              else {
                // Is this a Pair?
                if (this.numberOfPairs) {
                  this.rank = PAIR;
                }
                else {
                  // This is a High card
                  this.rank = HIGHCARD;
                }
              }
            }
          }
        }
      }
    }
  }
  if ((this.cards.length === 2) && (this.rank !== PAIR)) {
    // Narrow down pocket cards
    var twoCardSuited = this.twoCardSuited();
    var twoCardConnected = this.twoCardConnected();
    if (twoCardSuited && twoCardConnected) {
      this.rank = CONNECTEDANDSUITED;
    }
    else {
      if (twoCardSuited) {
        this.rank = SUITEDCARDS;
      }
      else {
        if (twoCardConnected) {
          this.rank = CONNECTEDCARDS;
        }
        else {
          // this.rank = HIGHCARD;
        }
      }
    }
  }
  switch (this.cards.length) {
    case 2:
      this.twoCardHandProb();
      break;
    case 5:
      this.fiveCardHandProb();
      break;
    case 6:
      this.sixCardHandProb();
      break;
    case 7:
      this.sevenCardHandProb();
      break;
  }
  console.log('Number of cards: ' + this.cards.length);
  console.log('Rank: ' + handRankNames[this.rank]);
  var p = 100 * this.rankProbability;
  console.log('Rank probability: ' + p.toFixed(4) + '%');
  return(this.rank);
};

function spaces(n) {
  var str = '';
  for (var i = 0; i < n; i++) {
    str += ' ';
  }
  return str;
}

Hand.prototype.prettyPrint = function() {
  var str = '===================================\n';
  // Print Hand
  str += 'HAND\n';
  this.cards.forEach(function(c) {
    str += Card.suites[c.suite] + ' ' + Card.ranks[c.rank] + '\n';
  });
  var handRankName = ';'
  if (this.cards.length === 2) {
    handRankName = pocketRankNames[this.rank];
  }
  else {
    handRankName = handRankNames[this.rank];
  }
  str += 'Highest rank:         ' + handRankName + '\n';
  str += 'A priori probability: '+
    Math.round(10000 * + this.rankProbability)/100 + '%\n';
  // Print conditional probabilities
  str += 'CONDITIONAL PROBABILITIES PREFLOP\n';
  var that = this;
  str += 'Hand               Freq.    Perc.\n'
  str += '-----------------------------------\n';
  this.frequency.forEach(function(f, index) {
    var space1 = spaces(24 - handRankNames[index].length - 1 - String(f).length);
    var percentage = Math.round(10000 * that.probability[index])/100 + '%';
    var space2 = spaces(8 - percentage.length);
    str += handRankNames[index] + ':' + space1 + f + space2 + percentage + '\n';
  });
  str += '-----------------------------------\n';
  str += 'TOTALS:' + spaces(24 - 7 - String(this.totalCombinations).length) +
    this.totalCombinations + spaces(8 - '100%'.length) + '100%\n';
  str += '===================================\n';
  return(str);
};

module.exports = {
  HIGHCARD: HIGHCARD,
  PAIR: PAIR,
  TWOPAIR: TWOPAIR,
  THREEOFAKIND: THREEOFAKIND,
  STRAIGHT: STRAIGHT,
  FLUSH:FLUSH,
  FULLHOUSE: FULLHOUSE,
  FOUROFAKIND: FOUROFAKIND,
  STRAIGHTFLUSH: STRAIGHTFLUSH,
  ROYALFLUSH: ROYALFLUSH,
  handRankNames: handRankNames,
  SUITEDCARDS: SUITEDCARDS,
  CONNECTEDCARDS: CONNECTEDCARDS,
  CONNECTEDANDSUITED: CONNECTEDANDSUITED,
  pocketRankNames: pocketRankNames,
  Hand: Hand
};