/*
  Hand class with rank probabilities and predictive probabilities for flop,
   turn and river
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
var APrioriProbabilities = require('./APrioriProbabilities');
var PosteriorProbabilities = require('./PosteriorProbabilities');

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

var NODRAW = 0;
var STRAIGHTDRAW = 1;
var FLUSHDRAW = 2;
var STRAIGHTANDFLUSHDRAW = 3;
var STRAIGHTFLUSHDRAW = 4;

function Hand(cards) {
  this.cards = [];
  var that = this;
  if (cards) {
    cards.forEach(function (c) {
      that.cards.push(new Card.Card(c));
    });
    this.vector = this.initVector(this.cards);
  }
}

// Create a bit vector from the hand
Hand.prototype.initVector = function(cards) {
  // Create a histogram
  var histogram = {};
  // Check for equal ranks
  cards.forEach(function(c) {
    if (!histogram[c.rank]) {
      histogram[c.rank] = 1;
    }
    else {
      histogram[c.rank]++;
    }
  });

  var vector = '';
  for (var i = 0; i < 13; i++) {
    if (histogram[i]) {
      vector = vector + '1';
    }
    else {
      vector = vector + '0';
    }
  }

  // If we have an Ace add it at the beginning as well
  if (histogram[Card.ACE]) {
    vector = '1' + vector;
  }
  else {
    vector = '0' + vector;
  }
  return vector;
};

Hand.prototype.isFlush = function(cards) {
  var startSuite = cards[0].suite;
  var isFlush = true;

  for (var i = 1; i < cards.length; i++) {
    isFlush = isFlush && (cards[i].suite === startSuite);
  }
  return(isFlush);
};

Hand.prototype.isStraight = function(cards) {
  var isStraight = false;

  isStraight = ((cards[4].rank - cards[0].rank) === 4);
  if (cards[4].rank === Card.ACE) {
    isStraight = isStraight ||
      ((cards[3].rank - cards[0].rank) === 3);
  }
  return(isStraight);
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

// Checks a 5 card hand for a Straight draw
Hand.prototype.isStraightDraw = function(cards) {
  // Straight masks
  var masks = ['11110', '01111', '11110', '10111', '11011', '11101'];

  var vector = this.initVector(cards);

  var maskIndex = -1;
  if (masks.some(function (m, index) {
      if (vector.indexOf(m) > -1) {
        return (true);
      }
    })) {
    return true;
  }
  // No match, so no Straight draw
  return false;
};

// Precondition: cards is a 5 card hand, and ordered
// Returns one of (NODRAW, STRAIGHTDRAW, FLUSHDRAW, STRAIGHTFLUSHDRAW)
Hand.prototype.isStraightAndOrFlushDraw5 = function(cards) {
  nrCardsPerSuite = [0, 0, 0, 0];
  var that = this;
  cards.forEach(function(card) {
    nrCardsPerSuite[card.suite]++;
  });
  var flushSuite = -1;
  var isFlushDraw =
    nrCardsPerSuite.some(function(nrOfCards, suite) {
      if (nrOfCards === 4) {
        flushSuite = suite;
        return true;
      }
    });
  // Check for Straight Flush draw based on these four cards
  if (isFlushDraw) {
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].suite !== flushSuite) {
        // Remove card
        cards.splice(i, 1);
      }
    }
    if (this.isStraightDraw(cards)) {
      return STRAIGHTFLUSHDRAW;
    }
    else {
      return FLUSHDRAW;
    }
  }
  if (this.isFlush(cards)) {
    if (this.isStraightDraw(cards)) {
      return STRAIGHTFLUSHDRAW;
    }
    else {
      return FLUSHDRAW;
    }
  }

  if (this.isStraightDraw(cards)) {
    return STRAIGHTDRAW;
  }
  else {
    return NODRAW;
  }
};

// Checks each possible five card hand for Flush draw, Straight draw, and
// Straight Flush draw
Hand.prototype.isStraightAndOrFlushDraw = function() {
  var isStraightFlushDraw = false;
  var isFlushDraw = false;
  var isStraightDraw = false;
  var cards;
  for (var i = 0; i < 6; i++) {
    cards = this.cards.slice();
    cards.splice(i, 1);
    isStraightAndOrFlush = this.isStraightAndOrFlushDraw5(cards);
    switch (isStraightAndOrFlush) {
      case FLUSHDRAW:
        isFlushDraw = true;
        break;
      case STRAIGHTDRAW:
        console.log('STRAIGHT');
        isStraightDraw = true;
        break;
      case STRAIGHTFLUSHDRAW:
        isStraightFlushDraw = true;
        break;
      case NODRAW:
        break;
    }
  }
  if (isStraightFlushDraw) {
    return STRAIGHTFLUSHDRAW;
  }
  if (isFlushDraw && isStraightDraw) {
    return STRAIGHTANDFLUSHDRAW;
  }
  if (isFlushDraw) {
    return FLUSHDRAW;
  }
  if (isStraightDraw) {
    return STRAIGHTDRAW;
  }
};

// Based on
// http://nsayer.blogspot.nl/2007/07/algorithm-for-evaluating-poker-hands.html
Hand.prototype.calculateHandRank5 = function(cards) {
  // Sort the cards by rank in ascending order
  cards.sort(function(a, b) {
    return a.rank - b.rank;
  });

  // Create a histogram
  var histogram = {};
  // Check for equal ranks
  cards.forEach(function(c) {
    if (!histogram[c.rank]) {
      histogram[c.rank] = 1;
    }
    else {
      histogram[c.rank]++;
    }
  });

  // Check for n of a Kind
  var hasFourOfAKind = false;
  var numberOfPairs = 0;
  var hasThreeOfAKind = false;
  Object.keys(histogram).forEach(function(rank) {
    if (histogram[rank] === 4) {
      hasFourOfAKind = true;
    }
    if (histogram[rank] === 2) {
      numberOfPairs++;
    }
    if (histogram[rank] === 3) {
      hasThreeOfAKind = true;
    }
  });

  var isFlush = this.isFlush(cards);
  var isStraight = this.isStraight(cards);

  if (hasFourOfAKind) {
    return FOUROFAKIND;
  }
  else {
    if (hasThreeOfAKind && numberOfPairs) {
      return FULLHOUSE;
    }
    else {
      if (hasThreeOfAKind) {
        return THREEOFAKIND;
      }
      else {
        if (numberOfPairs > 1) {
          return TWOPAIR;
        }
        else {
          if (numberOfPairs) {
            return PAIR;
          }
          else {
            if (isFlush) {
              if (isStraight) {
                if ((cards[4].rank === Card.ACE) && (cards[3].rank === Card.KING)) {
                  return ROYALFLUSH;
                }
                else {
                  return STRAIGHTFLUSH;
                }
              }
              else {
                return FLUSH
              }
            }
            else {
              if (isStraight) {
                return STRAIGHT;
              }
            }
          }
        }
      }
    }
  }

  return(HIGHCARD);
};

Hand.prototype.calculateHandRank2 = function() {
  // Sort the cards by rank in ascending order
  this.cards.sort(function(a, b) {
    return a.rank - b.rank;
  });
  this.rank = HIGHCARD;
  if (this.cards[0].rank === this.cards[1].rank) {
    this.rank = PAIR;
  }
  else {
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
      }
    }
  }
};

Hand.prototype.calculateHandRank = function() {
  switch (this.cards.length) {
    case 2:
      this.calculateHandRank2();
      break;
    case 5:
      this.rank = this.calculateHandRank5(this.cards);
      break;
    case 6:
      var ranks = [];
      // Take out one a card and process 5 card hand
      for (var i = 0; i < this.cards.length; i++) {
        var cards = this.cards.slice();
        cards.splice(i, 1);
        ranks.push(this.calculateHandRank5(cards));
      }
      this.rank = Math.max.apply(Math, ranks);
      break;
    case 7:
      // Take out two cards and process 5 card hand
      var ranks = [];
      for (var i = 0; i < this.cards.length; i++) {
        for (var j = i + 1; j < this.cards.length; j++) {
          var cards = this.cards.slice();
          cards.splice(i, 1);
          cards.splice(j - 1, 1);
          ranks.push(this.calculateHandRank5(cards));
        }
      }
      this.rank = Math.max.apply(Math, ranks);
      break;
  }
};

// Analyses the hand: rank, a priori probability and conditonal
// probabilities for the next round
// Returns the hand rank
Hand.prototype.analyseHand = function() {
  this.calculateHandRank();
  var aPrioriProbability = new APrioriProbabilities(this);
  this.rankProbability = aPrioriProbability.rankProbability();

  var posteriorProbs = new PosteriorProbabilities(this);
  switch(this.cards.length) {
    case 2:
      posteriorProbs.preflopProbabilities();
      break;
    case 5:
      posteriorProbs.flopProbabilities();
      break;
    case 6:
      posteriorProbs.turnProbabilities();
      break;
  }
  this.frequency = posteriorProbs.frequency;
  this.totalCombinations = posteriorProbs.totalCombinations;
  this.sumFrequencies = 0;
  var that = this;
  posteriorProbs.frequency.forEach(function(f, index) {
    that.sumFrequencies += f;
  });
  return(this.rank);
};

function spaces(n) {
  var str = '';
  for (var i = 0; i < n; i++) {
    str += ' ';
  }
  return str;
}

// Pretty prints the analysis of the hand
// Returns a string
Hand.prototype.prettyPrint = function() {
  var str = '';
  str += '===================================\n';
  str += 'HAND\n';
  // Print Hand
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
  str += 'HAND VECTOR\n' + this.vector + '\n';

  str += '===================================\n';
  str += 'RANK\n';
  str += 'Highest rank:         ' + handRankName + '\n';
  str += 'A priori probability: '+
    Math.round(10000 * + this.rankProbability)/100 + '%\n';
  // Print conditional probabilities
  str += '===================================\n';
  str += 'CONDITIONAL PROBABILITIES\n';
  str += 'Total number of combinations: ' + this.totalCombinations + '\n'

  var that = this;
  str += 'Hand                Outs   Perc.\n'
  str += '-----------------------------------\n';
  this.frequency.forEach(function(f, index) {
    if (f) {
      var space1 = spaces(24 - handRankNames[index].length - 1 - String(f).length);
      var percentage = Math.round(10000 * that.frequency[index] / that.totalCombinations) / 100 + '%';
      var space2 = spaces(8 - percentage.length);
      str += handRankNames[index] + ':' + space1 + f + space2 + percentage + '\n';
    }
  });
  str += '-----------------------------------\n';
  str += 'TOTALS:' + spaces(24 - 7 - String(this.sumFrequencies).length) +
    this.sumFrequencies + spaces(8 - '100%'.length) +
    Math.round(10000 * this.sumFrequencies / that.totalCombinations) / 100 + '%\n';
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