/*
  Classifier based on poker odds
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

var suites = ['clubs', 'spades', 'diamonds', 'hearts'];

var ACE = 12;
var TWO = 0;
var TEN = 8;
var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen',
  'King', 'Ace'];

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
var handRanks = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight',
  'Flush', 'Full house', 'Four of a kind', 'Straight flush', 'Royal flush'];


function Card(suite, rank, isHoleCard) {
  this.suite = suites.indexOf(suite);
  this.rank = ranks.indexOf(rank);
  this.isHoleCard = isHoleCard;
}

// Calculates future possible hand ranks based on community cards
function calculateFutureHandRanks(cards) {

}

function containsAce(cards) {
  return(cards.some(function(c) {
    return(c.rank === ACE);
  }));
}

// Calculates hand rank based on known cards
function calculateHandRank(cards) {
  // Sort the cards by rank in ascending order
  cards.sort(function(a, b) {
    return a.rank - b.rank;
  });

  var isFlush = false;
  var isStraight = false;
  var isRoyalFlush = false;
  if (cards.length > 4) {
    // Is this a Flush ?
    isFlush = true;
    for (var i = 1; i < cards.length; i++) {
      isFlush = isFlush && (c[0].suite === c[i].suite);
    }
    // Is this a Straight ?
    var isStraight = true;
    for (var i = 0; i < cards.length; i++) {
      isStraight = isStraight && ((c[i - 1].rank + 1) === c[i].rank);
    }
      // No Straight but we have an Ace --> Is this a Straight with Ace as 1?
    if (containsAce(cards)) && (!isStraight)) {
      var isStraight = (cards[0].rank === TWO);
      for (var i = 1; i < cards.length - 1; i++) {
        isStraight = isStraight && ((c[i - 1].rank + 1) === c[i].rank);
      }
    }
    // Check for Royal Flush
    if (isFlush && isStraight) {
      if (cards)
      return(ROYALFLUSH);
    }
    if (isFlush && isStraight) {
      return(STRAIGHTFLUSH);
    }
    if (isFlush) {
      return(FLUSH);
    }
    if (isStraight) {
      return(STRAIGHT);
    }
  }

  // Is this a Four of a kind?
  var ranksInHand = {};
  var numberOfTwoOfAKind = 0;
  var hasThreeOfAKind = false;
  // Check for equal ranks
  cards.forEach(function(c) {
    if (!ranksInHand[c.rank]) {
      ranksInHand[c.rank] = 1;
    }
    else {
      ranksInHand[c.rank]++;
    }
  });
  // Check how many N of a kind we have
  Object.keys(ranksInHand).forEach(function(rank) {
    if (ranksInHand[rank] === 4) {
      return(FOUROFAKIND);
    }
    if (ranksInHand[rank] === 3) {
      hasThreeOfAKind = true;
    }
    else {
      if (ranksInHand[rank] === 2) {
        numberOfTwoOfAKind++;
      }
    }
  });

  // Is this a Full house?
  if (hasThreeOfAKind && numberOfTwoOfAKind) {
    return(FULLHOUSE);
  }

  // Is this a Three of a kind?
  if (hasThreeOfAKind) {
    return(THREEOFAKIND);
  }

  // Is this a Two pair?
  if (numberOfTwoOfAKind === 2) {
    return(TWOPAIR);
  }

  // Is this a Pair?
  if (numberOfTwoOfAKind === 1) {
    return(PAIR);
  }

  // This is a High card
  return(HIGHCARD);
}

function classifyContext(trainingSet, contextToBeClassified) {

}

module.exports = classifyContext;