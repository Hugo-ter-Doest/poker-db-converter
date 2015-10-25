/*
 Class for calculating conditional probabilities for poker hands of 2, 5 and
  6 cards
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

// var HIGHCARD= 0;
// var PAIR = 1;
var SUITEDCARDS = 2;
var CONNECTEDCARDS = 3;
var CONNECTEDANDSUITED = 4;

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

function PosteriorProbabilities(hand) {
  this.hand = hand;
}

PosteriorProbabilities.prototype.initAnalysis = function() {
  this.frequency = [];
  for (var rank = HIGHCARD; rank <= ROYALFLUSH; rank++) {
    this.frequency[rank] = 0;
  }
};

// Calculates conditional probabilities given a hand with two cards
// Maps hand rank to new (better) hand ranks
PosteriorProbabilities.prototype.preflopProbabilities = function() {
  var cards = this.hand.cards;
  this.initAnalysis();
  this.totalCombinations = C(50, 3);
  // Depending on the hand rank we calculate the probabilities of
  // a new rank
  switch(this.hand.rank) {
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
      if (((cards[0].rank + 4) === cards[1].rank)  ||
        ((cards[1].rank === Card.ACE) && (cards[0].rank === Card.FIVE))) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 2 in between, 1 before
      if (((cards[0].rank + 3) === cards[1].rank) &&
        (cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 2 in between, 1 after
      if (((cards[0].rank + 3) === cards[1].rank) &&
        (cards[0].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 2 before
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[0].rank >= Card.THREE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 2 after
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[1].rank + 1 < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4;
      }
      // - 1 in between, 1 before, 1 after
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[1].rank < Card.ACE) &&
        (cards[0].rank >= Card.TWO)) {
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
      if (((cards[0].rank + 4) === cards[1].rank)  ||
        ((cards[1].rank === Card.ACE) && (cards[0].rank === Card.FIVE))) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 2 in between, 1 before
      if (((cards[0].rank + 3) === cards[1].rank) &&
        (cards[0].rank >= Card.TWO)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 2 in between, 1 after
      if (((cards[0].rank + 3) === cards[1].rank) &&
        (cards[0].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 2 before
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[0].rank >= Card.THREE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 2 after
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[1].rank + 1 < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - 1 in between, 1 before, 1 after
      if (((cards[0].rank + 2) === cards[1].rank) &&
        (cards[1].rank < Card.ACE) &&
        (cards[0].rank >= Card.TWO)) {
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
      this.frequency[PAIR] = 2 * 3 * 4 * 4 * C(11, 2) +
          // Board pairing, third card is from 10 ranks, 4 suites
        C(11, 1) * C(4, 2) * C(40, 1);

      // Two pair: two cases
      // - Both pocket cards should be matched: 3 cards to form first
      //   pair, 3 cards to form second pair, third card has 11 ranks left,
      //   suite is free
      this.frequency[TWOPAIR] =  C(3, 1) * C(3, 1) *  C(44, 1) +
          // One matching card and a board pairing
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
      if (cards[0].rank >= Card.FOUR) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - two before, one after
      if ((cards[0].rank >= Card.THREE) && (cards[1].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - one before, two after
      if ((cards[0].rank >= Card.TWO) && (cards[1].rank < Card.KING)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }
      // - three after
      if (cards[1].rank < Card.QUEEN) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
      }

      // Straight flush is 0 because pocket cards are only connected
      this.frequency[STRAIGHTFLUSH] = 0;

      // Flush: we need three more cards of the same suite, 11 cards available
      // Substract straight flush
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
      // Pair: two cases:
      // - Two ranks and three suites to form a pair, 2 other cards have 11
      //   ranks left to choose from (but must be unique, suite is free
      this.frequency[PAIR] = 2 * 3 * 4 * 4 * C(11, 2) +
          // Board pairing, third card is from 10 ranks, 4 suites
        C(11, 1) * C(4, 2) * C(40, 1);

      // Two pair: two cases
      // - Both pocket cards should be matched: 3 cards to form first
      //   pair, 3 cards to form second pair, third card has 11 ranks left,
      //   suite is free
      this.frequency[TWOPAIR] =  C(3, 1) * C(3, 1) *  C(44, 1) +
          // - One matching card and a board pairing
        C(3, 1) * C(2, 1) *  C(4, 2) * C(11, 1);

      // Three of a kind: two cases:
      // - Two cards should match the rank of a pocket card,
      //   three suites left; third card has 11 ranks left, suite is free
      this.frequency[THREEOFAKIND] =
        // Two board cards match a pocket card
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
      this.frequency[STRAIGHTFLUSH] = 0;
      // - three before
      if (cards[0].rank >= Card.FOUR) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - two before, one after
      if ((cards[0].rank >= Card.THREE) && (cards[1].rank < Card.ACE)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - one before, two after
      if ((cards[0].rank >= Card.TWO) && (cards[1].rank < Card.KING)) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }
      // - three after
      if (cards[1].rank < Card.QUEEN) {
        this.frequency[STRAIGHT] += 4 * 4 * 4 - 1;
        this.frequency[STRAIGHTFLUSH] += 1;
      }

      // Flush: we have two cards of the same suite: 11 ranks left, suite is
      // fixed, substract straight flushes
      this.frequency[FLUSH] = C(11, 3) - this.frequency[STRAIGHTFLUSH];

      // High card: three uniquely ranked cards that do not pair with pocket cards and do not form
      // a flush or straight or straight flush
      this.frequency[HIGHCARD] =
        // Three uniquely ranked cards, suite is free
        C(11, 3) * 4 * 4 * 4 -
          // Substract flushes
        this.frequency[FLUSH] -
          // Substract straights
        this.frequency[STRAIGHT] -
          // Substract straight flushes
        this.frequency[STRAIGHTFLUSH];

      this.frequency[ROYALFLUSH] = 0;
      break;
  }
};

// Checks a 5 card hand for a Straight draw
PosteriorProbabilities.prototype.isStraightDraw = function(cards) {
  // Straight masks
  var masks = ['11110', '01111', '11110', '10111', '11011', '11101'];

  var vector = this.hand.initVector(cards);

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

// Calculates the number of outs for an arbitrary hand
PosteriorProbabilities.prototype.nrOutsForStraight = function() {
  // Straight masks
  var masks = ['011110', '11110', '01111', '11110', '10111', '11011', '11101'];
  // Number of outs per mask
  var nrOuts = [8, 4, 4, 4, 4, 4, 4];

  this.hand.vector = this.hand.initVector(this.hand.cards);
  var maskIndex = -1;

  var that = this;
  // Check masks with Ace as highest card
  if (masks.some(function(m, index) {
      if (that.hand.vector.indexOf(m) > -1) {
        maskIndex = index;
        return(true);
      }
    })) {
    return nrOuts[maskIndex];
  }

  return 0;
};

var NODRAW = 0;
var STRAIGHTDRAW = 1;
var FLUSHDRAW = 2;
var STRAIGHTFLUSHDRAW = 3;

// Precondition: cards is a 5 card hand, and ordered
// Returns one of (NODRAW, STRAIGHTDRAW, FLUSHDRAW, STRAIGHTFLUSHDRAW)
PosteriorProbabilities.prototype.isStraightAndOrFlushDraw = function(cards) {
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
  if (this.hand.isFlush(cards)) {
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

// Calculates conditional probabilities given a hand of five cards
// Maps hand rank to new (better) hand ranks
PosteriorProbabilities.prototype.flopProbabilities = function() {
  var cards = this.hand.cards;
  this.initAnalysis();
  // 52 - 5 cards left to choose from
  this.totalCombinations = C(47, 1);
  switch (this.hand.rank) {
    case HIGHCARD:
      var isStraightAndOrFlushDraw = this.isStraightAndOrFlushDraw(cards.slice());
      console.log(isStraightAndOrFlushDraw);
      if (isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) {
        this.frequency[STRAIGHTFLUSH] = 1;
      }

      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === FLUSHDRAW)) {
        this.frequency[FLUSH] = 9 - this.frequency[STRAIGHTFLUSH];
      }


      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === STRAIGHTDRAW)) {
        this.frequency[STRAIGHT] = this.nrOutsForStraight() - this.frequency[STRAIGHTFLUSH];
      }

      // 5 ranks to choose from, suite is free
      this.frequency[PAIR] = 5 * 3;

      // If the hand is a Straight Flush draw then it is a Royal Flush draw if
      // the highest card is an Ace, or if the draw card should be an Ace.
      //this.frequency[ROYALFLUSH] = 0;

      // High Card: 5 unique ranks -> 8 ranks left minus possibilities for
      // Straight and Flush and Straight Flush
      this.frequency[HIGHCARD] = 8 * 4 -
        this.frequency[FLUSH] -
        this.frequency[STRAIGHT] -
        this.frequency[STRAIGHTFLUSH];
      break;

    case PAIR:
      var isStraightAndOrFlushDraw = this.isStraightAndOrFlushDraw(cards.slice());

      if (isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) {
        this.frequency[STRAIGHTFLUSH] = 1;
      }

      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === FLUSHDRAW)) {
        this.frequency[FLUSH] = 9 - this.frequency[STRAIGHTFLUSH];
      }


      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === STRAIGHTDRAW)) {
        this.frequency[STRAIGHT] = 9 - this.frequency[STRAIGHTFLUSH];
      }

      // Pair: No new pairings should occur -> 4 ranks are used -> 9 ranks
      // left, suite is free
      this.frequency[PAIR] = C(9, 1) * 4;

      // Two Pair: One of the three single ranks should be paired, 3
      // suites left
      this.frequency[TWOPAIR] = 3 * 3;

      // Three of a Kind: match the pair -> 2 suites left
      this.frequency[THREEOFAKIND] = 2;

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case TWOPAIR:
      // Two Pair: two components:
      // - cards that do not match one of the three ranks in the hand
      // - cards that match the rank of which only one card is in the hand
      this.frequency[TWOPAIR] = 10 * 4 + 3;

      // Full House: 2 ranks to choose from, each has 2 suites left
      this.frequency[FULLHOUSE] = 2 * 2;
      break;

    case THREEOFAKIND:
      // Three of a Kind: should not match the Three of a Kind and not the
      // other two cards -> 13 - 3 ranks left, suites are free
      this.frequency[THREEOFAKIND] = 10 * 4;

      // Full house: match one of the free cards -> 2 ranks, 3 suites
      this.frequency[FULLHOUSE] = 2 * 3;

      // Four of a Kind: 1 rank, 1 suite
      this.frequency[FOUROFAKIND] = 1;
      break;

    case STRAIGHT:
      var isStraightAndOrFlushDraw = this.isStraightAndOrFlushDraw(cards.slice());

      if (isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) {
        this.frequency[STRAIGHTFLUSH] = 1;
      }

      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === FLUSHDRAW)) {
        this.frequency[FLUSH] = 9 - this.frequency[STRAIGHTFLUSH];
      }


      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === STRAIGHTDRAW)) {
        this.frequency[STRAIGHT] = 47 -
          this.frequency[STRAIGHTFLUSH] -
          this.frequency[FLUSH];
      }

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case FLUSH:
      var isStraightAndOrFlushDraw = this.isStraightAndOrFlushDraw(cards.slice());

      if (isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) {
        this.frequency[STRAIGHTFLUSH] = 1;
      }

      if ((isStraightAndOrFlushDraw === STRAIGHTFLUSHDRAW) ||
        (isStraightAndOrFlushDraw === FLUSHDRAW)) {
        this.frequency[FLUSH] = 47 - this.frequency[STRAIGHTFLUSH];
      }

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case FULLHOUSE:
      // Four of a Kind: 1 card leads to a Four of a Kind
      this.frequency[FOUROFAKIND] = 1;

      // Full House: card should not make a four of a kind
      this.frequency[FULLHOUSE] = 47 - this.frequency[FOUROFAKIND];
      break;

    case FOUROFAKIND:
      // All posssible cards lead to Four of a Kind again
      this.frequency[FOUROFAKIND] = 47;
      break;

    case STRAIGHTFLUSH:
      // Royal Flush: happens if the straight is 9-10-J-Q-K
      if ((cards[0].rank === Card.NINE) &&
          (cards[1].rank === Card.TEN) &&
          (cards[2].rank === Card.JACK) &&
          (cards[3].rank === Card.QUEEN)  &&
          (cards[4].rank === Card.KING)) {
        this.frequency[ROYALFLUSH] = 1;
      }

      // Straight Flush: all cards minus Royal Flush
      this.frequency[STRAIGHTFLUSH] = 47 -
        this.frequency[ROYALFLUSH];
      break;

    case ROYALFLUSH:
      this.frequency[ROYALFLUSH] = 47;
      break;
  }
};

// Precondition: hand is a Straight; hand is 5 or 6 cards
// Returns true if a higher hand is possible
PosteriorProbabilities.prototype.higherStraightIsPossible = function() {
  var n = this.cards.length;
  // We check if Ace is used by the Straight
  // Two cases: King-Ace-Ace or King-Ace
  var isHighestStraight =
    ((n === 6) && (this.cards[5].rank === Card.ACE) && (this.cards[4].rank === Card.KING)) ||
    ((n === 6) && (this.cards[5].rank === Card.ACE) && (this.cards[3].rank === Card.KING)) ||
    ((n === 5) && (this.cards[4].rank === Card.ACE) && (this.cards[3].rank === Card.KING));
  return (!isHighestStraight);
};

// Checks each possible five card hand for Flush draw, Straight draw, and
// Straight Flush draw
PosteriorProbabilities.prototype.checkStraightAndOrFlush = function() {
  var nrOutsForStraight = this.nrOutsForStraight();
  var isStraightFlushDraw = false;
  var isFlushDraw = false;
  var isStraightDraw = false;
  var cards;
  for (var i = 0; i < 6; i++) {
    cards = this.hand.cards.slice();
    cards.splice(i, 1);
    isStraightAndOrFlush = this.isStraightAndOrFlushDraw(cards);
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
        isFlushDraw = true;
        break;
      case NODRAW:
        break;
    }
  }

  if (isStraightFlushDraw) {
    if (this.hand.vector.indexOf('011110') > -1) {
      this.frequency[STRAIGHTFLUSH] = 2;
    }
    else {
      this.frequency[STRAIGHTFLUSH] = 1;
    }
  }

  if (isStraightDraw) {
    this.frequency[STRAIGHT] = nrOutsForStraight - this.frequency[STRAIGHTFLUSH];
  }

  if (isFlushDraw) {
    // One suite of which 13-4 ranks are left
    this.frequency[FLUSH] = 9 - this.frequency[STRAIGHTFLUSH];
  }
};

// Calculates the probabilities of new hands at the turn
PosteriorProbabilities.prototype.turnProbabilities = function() {
  this.initAnalysis();
  // 52 - 6 cards left to choose from
  this.totalCombinations = 46;
  switch(this.hand.rank) {
    case HIGHCARD:
      // Pair: Each rank leads to a pair
      this.frequency[PAIR] = 6 * 3;

      this.checkStraightAndOrFlush();

      this.frequency[ROYALFLUSH] = 0;

      // High Card: 6 unique ranks -> 7 ranks left minus possibilities for
      // Straight and Flush and Straight Flush
      this.frequency[HIGHCARD] = 7 * 4 -
        this.frequency[FLUSH] -
        this.frequency[STRAIGHT] -
        this.frequency[STRAIGHTFLUSH];
      break;

    case PAIR:
      this.checkStraightAndOrFlush();

      // Pair: should not match any of the ranks in the hand and should not
      // make a Flush, Straight or Straight Flush
      this.frequency[PAIR] = 46 - 4 * 3 - 2 -
        this.frequency[FLUSH] -
        this.frequency[STRAIGHT] -
        this.frequency[STRAIGHTFLUSH];

      // Two Pair: should match one of the 4 non-pair cards
      this.frequency[TWOPAIR] = 4 * 3;

      // Three of a Kind: match the pair
      this.frequency[THREEOFAKIND] = 2;

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case TWOPAIR:
      this.checkStraightAndOrFlush();

      // Full House: match one of the pairs
      this.frequency[FULLHOUSE] = 2 * 2;

      // Two Pair: should not match any of the ranks
      this.frequency[TWOPAIR] = 46 -
        this.frequency[FULLHOUSE] -
        this.frequency[FLUSH] -
        this.frequency[STRAIGHT] -
        this.frequency[STRAIGHTFLUSH];

      this.frequency[ROYALFLUSH] = 0;
      break;

    case THREEOFAKIND:
      this.checkStraightAndOrFlush();

      // Full House: match one of the single ranks in the hand
      this.frequency[FULLHOUSE] = 3 * 3;

      // Four of a Kind: match the rank of the Three of a Kind
      this.frequency[FOUROFAKIND] = 1;

      // Three of a Kind: should not match any of the 4 ranks used in the hand
      this.frequency[THREEOFAKIND] = 46 -
        this.frequency[FOUROFAKIND] -
        this.frequency[FULLHOUSE] -
        this.frequency[FLUSH] -
        this.frequency[STRAIGHT] -
        this.frequency[STRAIGHTFLUSH];

      this.frequency[ROYALFLUSH] = 0;
      break;

    case STRAIGHT:
      // Straight and/or Flush
      this.checkStraightAndOrFlush();

      this.frequency[STRAIGHT] = 46 -
        this.frequency[STRAIGHTFLUSH] -
        this.frequency[FLUSH];

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case FLUSH:
      // Straight and/or Flush
      this.checkStraightAndOrFlush();

      this.frequency[FLUSH] = 46 -
        this.frequency[STRAIGHTFLUSH];

      //this.frequency[ROYALFLUSH] = 0;
      break;

    case FULLHOUSE:
      // Full House: 46 cards minus matches of the rank with three cards
      this.frequency[FULLHOUSE] = 46 - 1;

      // Four of a Kind: matches the the rank with three cards
      this.frequency[FOUROFAKIND] = 1;
      break;

    case FOUROFAKIND:
      // Four of a Kind: 46
      this.frequency[FOUROFAKIND] = 46;
      break;

    case STRAIGHTFLUSH:
      // Straight Flush: any card
      this.frequency[STRAIGHTFLUSH] = 46;

      this.frequency[ROYALFLUSH] = 0;
      break;

    case ROYALFLUSH:
      // Royal Flush: all cards allowed
      this.frequency[ROYALFLUSH] = 46;
      break;
  }
};

module.exports = PosteriorProbabilities;