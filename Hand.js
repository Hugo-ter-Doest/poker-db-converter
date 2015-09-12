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

};

Hand.prototype.fiveCardHandProb = function() {

};

Hand.prototype.twoCardHandProb = function() {

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
  console.log('Rank probability: ' + this.rankProbability);
  return(this.rank);
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
  Hand: Hand
};