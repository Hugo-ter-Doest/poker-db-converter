/*
 Unit test for Hand class using Jasmine
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

var Card = require('../Card').Card;
var Hand = require('../Hand');


describe('Hand', function() {
  // Pocket cards
  it('should analyse poker hands correctly - Pocket cards - Pair', function() {
    var card1 = new Card('Clubs', '2', true);
    var card2 = new Card('Spades', '2', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.PAIR);
  });

  it('should analyse poker hands correctly - Pocket cards - High card', function() {
    var card1 = new Card('Clubs', '6', true);
    var card2 = new Card('Spades', '8', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pocket cards - Suited cards', function() {
    var card1 = new Card('Clubs', '2', true);
    var card2 = new Card('Clubs', '6', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.SUITEDCARDS);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pocket cards - Connected cards', function() {
    var card1 = new Card('Clubs', '2', true);
    var card2 = new Card('Spades', '3', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.CONNECTEDCARDS);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pocket cards - Connected cards', function() {
    var card1 = new Card('Clubs', '2', true);
    var card2 = new Card('Spades', '3', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.CONNECTEDCARDS);
  });

  it('should analyse poker hands correctly - Pocket cards - Connected cards' +
    ' - with Ace and Two', function() {
    var card1 = new Card('Clubs', 'Ace', true);
    var card2 = new Card('Spades', '2', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.CONNECTEDCARDS);
  });

  it('should analyse poker hands correctly - Pocket cards - Suited' +
    ' connected cards', function() {
    var card1 = new Card('Clubs', '2', true);
    var card2 = new Card('Clubs', '3', true);
    var hand = new Hand.Hand([card1, card2]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.CONNECTEDANDSUITED);
    console.log(hand.prettyPrint());
  });

  // 5 card hands
  it('should analyse poker hands correctly - High card', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', 'Jack', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card is a Straight draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '6', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card is a Straight' +
    ' Flush draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Clubs', '3', false);
    var card3 = new Card('Hearts', 'Queen', true);
    var card4 = new Card('Clubs', '5', false);
    var card5 = new Card('Clubs', '6', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pair', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.PAIR);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Two pair', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '5', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.TWOPAIR);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Three of a kind', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Hearts', '2', true);
    var card4 = new Card('Clubs', '5', false);
    var card5 = new Card('Hearts', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.THREEOFAKIND);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Straight', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Hearts', '5', true);
    var card4 = new Card('Clubs', '4', false);
    var card5 = new Card('Hearts', '6', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.STRAIGHT);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Straight (which is a Flush' +
    ' draw)', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Clubs', '3', false);
    var card3 = new Card('Clubs', '5', true);
    var card4 = new Card('Clubs', '4', false);
    var card5 = new Card('Hearts', '6', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.STRAIGHT);
    console.log(hand.prettyPrint());
  });

  // Straight with an Ace as 1
  it('should analyse poker hands correctly - Straight with Ace as 1', function() {
    var card1 = new Card('Clubs', 'Ace', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Hearts', '4', true);
    var card4 = new Card('Clubs', '5', false);
    var card5 = new Card('Hearts', '2', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.STRAIGHT);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Flush (which is a Straight' +
    ' draw)', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Clubs', '3', false);
    var card3 = new Card('Clubs', '5', true);
    var card4 = new Card('Clubs', '6', false);
    var card5 = new Card('Clubs', 'Queen', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.FLUSH);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Full house', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Diamonds', '2', false);
    var card3 = new Card('Clubs', '3', true);
    var card4 = new Card('Diamonds', '3', false);
    var card5 = new Card('Spades', '3', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.FULLHOUSE);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Four of a kind', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Diamonds', '2', false);
    var card3 = new Card('Hearts', '2', true);
    var card4 = new Card('Spades', '2', false);
    var card5 = new Card('Spades', '3', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.FOUROFAKIND);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Straight flush', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Clubs', '3', false);
    var card3 = new Card('Clubs', '4', true);
    var card4 = new Card('Clubs', '5', false);
    var card5 = new Card('Clubs', '6', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.STRAIGHTFLUSH);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Straight flush (highest rank is' +
    ' King)', function() {
    var card1 = new Card('Clubs', '9', false);
    var card2 = new Card('Clubs', '10', false);
    var card3 = new Card('Clubs', 'Jack', true);
    var card4 = new Card('Clubs', 'Queen', false);
    var card5 = new Card('Clubs', 'King', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.STRAIGHTFLUSH);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Royal flush', function() {
    var card1 = new Card('Clubs', '10', false);
    var card2 = new Card('Clubs', 'Jack', false);
    var card3 = new Card('Clubs', 'Queen', true);
    var card4 = new Card('Clubs', 'King', false);
    var card5 = new Card('Clubs', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.ROYALFLUSH);
    console.log(hand.prettyPrint());
  });

  // 6 card hands
  it('should analyse poker hands correctly - High card - Straight draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', 'Jack', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var card6 = new Card('Hearts', 'King', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Straight draw with' +
    ' a hole in the middle', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', 'Jack', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Straight draw with' +
    ' a hole in the middle and an Ace as lowest card', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Straight draw with' +
    ' consecutive cards and an Ace as lowest card', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Clubs', '4', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Straight draw with' +
    ' Ace as highest card', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Clubs', 'Jack', false);
    var card4 = new Card('Hearts', 'Queen', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Flush draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Hearts', 'Jack', false);
    var card4 = new Card('Hearts', '7', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - High card - Straight Flush draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '3', false);
    var card3 = new Card('Hearts', 'Jack', false);
    var card4 = new Card('Hearts', 'Queen', true);
    var card5 = new Card('Hearts', 'King', true);
    var card6 = new Card('Hearts', 'Ace', true);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.HIGHCARD);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pair', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Clubs', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var card6 = new Card('Hearts', 'Ace', false);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.PAIR);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pair that is a Flush draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Hearts', '5', false);
    var card4 = new Card('Hearts', '10', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var card6 = new Card('Hearts', 'Ace', false);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.PAIR);
    console.log(hand.prettyPrint());
  });

  it('should analyse poker hands correctly - Pair that is a Straight draw', function() {
    var card1 = new Card('Clubs', '2', false);
    var card2 = new Card('Spades', '2', false);
    var card3 = new Card('Hearts', '3', false);
    var card4 = new Card('Hearts', '4', true);
    var card5 = new Card('Hearts', 'Queen', true);
    var card6 = new Card('Hearts', '5', false);
    var hand = new Hand.Hand([card1, card2, card3, card4, card5, card6]);
    var handRank = hand.analyseHand();
    expect(handRank).toEqual(Hand.PAIR);
    console.log(hand.prettyPrint());
  });

});

