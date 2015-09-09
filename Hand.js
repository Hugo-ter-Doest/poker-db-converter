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
}

Hand.prototype.containsAce = function() {
  return(this.cards.some(function(c) {
    return(c.rank === ACE);
  }));
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
      return(that.suites[suite] === 5);
    })
  );
};

// Look for a Straight from the highest ranked card down
Hand.prototype.isStraight = function() {
  for (var end = this.cards.length; end > this.cards.length - 2; end--) {
    if (end > 4) {
      // Is this a Straight ?
      var isStraight = true;
      for (var i = end - this.cards.length; i <=end; i++) {
        isStraight = isStraight && ((this.cards.[i - 1].rank + 1) === this.cards[i].rank);
      }
      // No Straight but we have an Ace --> Is this a Straight with Ace as 1?
      if (this.containsAce(this.cards)) && (!isStraight)) {
        var isStraight = (this.cards[0].rank === Card.TWO);
        for (var i = 1; i < this.cards.length - 1; i++) {
          isStraight = isStraight && ((this.cards[i - 1].rank + 1) === this.cards[i].rank);
        }
      }
      return(isStraight);
    }
    else {
      return(false);
    }
  }
};

// Precondition: hand is a Straight flush
Hand.prototype.isRoyalFlush = function() {

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

  var isFlush = this.isFlush();
  var isStraight = this.isStraight();
  if (isFlush && isStraight) {
    if (this.isRoyalFlush()) {
      return(ROYALFLUSH);
    }
    else {
      return (STRAIGHTFLUSH);
    }
  }
  if (isFlush) {
    return(FLUSH);
  }
  if (isStraight) {
    return(STRAIGHT);
  }

  this.ranksInHand();
  this.xOfAKind();

  if (this.hasFourOfAKind) {
    return(FOUROFAKIND);
  }

  // Is this a Full house?
  if (this.hasThreeOfAKind && this.numberOfPairs) {
    return(FULLHOUSE);
  }

  // Is this a Three of a kind?
  if (this.hasThreeOfAKind) {
    return(THREEOFAKIND);
  }

  // Is this a Two pair?
  if (this.numberOfPairs > 1) {
    return(TWOPAIR);
  }

  // Is this a Pair?
  if (this.numberOfPairs) {
    return(PAIR);
  }

  // This is a High card
  return(HIGHCARD);
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