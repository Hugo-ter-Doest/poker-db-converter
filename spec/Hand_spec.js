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

var Hand = require('../Hand');

var testCases = [
  // Pocket cards
  ['Pair',
    ['2c', '2s'], Hand.PAIR],
  ['High Card',
    ['6c', '8s'], Hand.HIGHCARD],
  ['Suited Cards',
    ['2c', '6c'], Hand.SUITEDCARDS],
  ['Connected Cards',
    ['2c', '3s'], Hand.CONNECTEDCARDS],
  ['Connected Cards',
    ['Ac', '2s'], Hand.CONNECTEDCARDS],
  ['Connected and Suited Cards',
    ['2c', '3c'], Hand.CONNECTEDANDSUITED],
  ['Connected and Suited Cards',
    ['2c', '3c'], Hand.CONNECTEDANDSUITED],

  // Five card hands
  ['High Card',
    ['2c', 'Js', '5c', 'Th', 'Qh'], Hand.HIGHCARD,       Hand.PAIR, 15],
  ['High Card that is a Straight draw',
    ['2c', '3s', '5c', '6h', 'Qh'], Hand.HIGHCARD,       Hand.STRAIGHT, 4],
  ['High Card that is a Straight Flush draw',
    ['2c', '3c', 'Qh', '5c', '6c'], Hand.HIGHCARD,       Hand.STRAIGHTFLUSH, 1],
  ['Pair',
    ['2c', '2s', '5c', 'Th', 'Qh'], Hand.PAIR,           Hand.THREEOFAKIND, 2],
  ['Two Pair',
    ['2c', '2s', '5c', '5h', 'Qh'], Hand.TWOPAIR,        Hand.FULLHOUSE, 4],
  ['Three of a Kind',
    ['2c', '2s', '2h', '5c', 'Qh'], Hand.THREEOFAKIND,   Hand.FULLHOUSE, 6],
  ['Straight',
    ['2c', '3s', '5h', '4c', '6h'], Hand.STRAIGHT,       Hand.STRAIGHT, 47],
  ['5 Straight that is a Straigh Flush draw',
    ['2c', '3c', '5c', '4c', '6h'], Hand.STRAIGHT,       Hand.STRAIGHTFLUSH, 1],
  ['Straight',
    ['Ac', '3s', '4h', '5c', '2h'], Hand.STRAIGHT,       Hand.STRAIGHT, 47],
  ['5 Flush that is a Straight Flush draw',
    ['2c', '3c', '5c', '6c', 'Qc'], Hand.FLUSH,          Hand.STRAIGHTFLUSH, 1],
  ['Full of a House',
    ['2c', '2d', '3c', '3d', '3s'], Hand.FULLHOUSE,      Hand.FOUROFAKIND, 1],
  ['Four of a Kind',
    ['2c', '2d', '2h', '2s', '3s'], Hand.FOUROFAKIND,    Hand.FOUROFAKIND, 47],
  ['Straight Flush that is a Royal Flush draw',
    ['9c', 'Tc', 'Jc', 'Qc', 'Kc'], Hand.STRAIGHTFLUSH,  Hand.ROYALFLUSH, 1],
  ['Royal Flush',
    ['Tc', 'Jc', 'Qc', 'Kc', 'Ac'], Hand.ROYALFLUSH,     Hand.ROYALFLUSH, 47],

  // Six card hands
  ['High Card that is a Straight draw pattern 011110',
    ['2c', 'Js', '5c', 'Th', 'Qh', 'Kh'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['High Card that is a Straight draw pattern 011110',
    ['2c', '3s', '5c', '6h', '7h', '8h'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['High Card that is a Straight draw with pattern 11011',
    ['2c', 'Js', '5c', 'Th', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Straight draw with a hole in the middle and an Ace' +
  ' as lowest card',
    ['2c', '3s', '5c', 'Th', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Straight draw with consecutive cards and an Ace as' +
  ' lowest card',
    ['2c', '3s', '4c', 'Th', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High card that is a Straight draw with Ace as highest card',
    ['2c', '3s', 'Jc', 'Qh', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Flush draw',
    ['2c', '3s', 'Jh', '7h', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.FLUSH, 9],
  ['High card that is a Straight Flush draw',
    ['2c', '3s', 'Jh', 'Qh', 'Kh', 'Ah'], Hand.HIGHCARD,     Hand.STRAIGHTFLUSH, 1],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['2c', '3h', 'Jc', 'Qh', 'Kh', 'Th'], Hand.HIGHCARD,     Hand.STRAIGHTFLUSH, 0],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['2c', '3h', 'Jc', 'Qh', 'Kh', 'Th'], Hand.HIGHCARD,     Hand.FLUSH, 9],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['2c', '3h', 'Jc', 'Qh', 'Kh', 'Th'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['Pair',
    ['2c', '2s', '5c', 'Th', 'Qh', 'Ah'], Hand.PAIR,         Hand.THREEOFAKIND, 2],
  ['Pair',
    ['2c', '2s', '5c', 'Th', 'Qh', 'Ah'], Hand.PAIR,         Hand.TWOPAIR, 12],
  ['Pair that is a Flush draw',
    ['2c', '2s', '5h', 'Th', 'Qh', 'Ah'], Hand.PAIR,         Hand.FLUSH, 9],
  ['Pair that is a Flush draw',
    ['2c', '2s', '3h', '4h', 'Qh', '5h'], Hand.PAIR,         Hand.STRAIGHT, 8],
  ['Pair that is a Flush draw',
    ['2c', '2s', '3h', '4h', 'Qh', '5h'], Hand.PAIR,         Hand.FLUSH, 9],
  ['Pair that is a Flush draw',
    ['2c', '2s', '3h', '4h', 'Qh', '5h'], Hand.PAIR,         Hand.STRAIGHTFLUSH, 0],
  ['Pair that is a Straight Flush draw',
    ['Qc', 'Qs', '3h', '4h', '6h', '5h'], Hand.PAIR,         Hand.STRAIGHTFLUSH, 2],
  ['Pair that is a Straight Flush draw',
    ['Qc', 'Qs', '3h', '4h', '6h', '5h'], Hand.PAIR,         Hand.FLUSH, 7],
  ['Two Pair that is a Flush draw',
    ['Qh', 'Qs', '3c', '3h', '6h', '5h'], Hand.TWOPAIR,      Hand.FLUSH, 9],
  ['Two Pair that is a Flush draw',
    ['Qh', 'Qs', '3c', '3h', '6h', '5h'], Hand.TWOPAIR,      Hand.FULLHOUSE, 4],
  ['Two pair that is a Straight draw',
    ['2h', '2s', '3c', '3h', '4d', '5h'], Hand.TWOPAIR,      Hand.STRAIGHT, 8],
  ['Two pair that is a Straight Flush draw',
    ['2h', '2s', '3c', '3h', '4h', '5h'], Hand.TWOPAIR,      Hand.STRAIGHTFLUSH, 2],
  ['Two pair that is a Straight Flush draw',
    ['2h', '2s', '3c', '3h', '4h', '5h'], Hand.TWOPAIR,      Hand.FLUSH, 7],
  ['Three of a kind that is a Straight Flush draw',
    ['2h', '2s', '2c', '3h', '4h', '5h'], Hand.THREEOFAKIND, Hand.STRAIGHTFLUSH, 2],
  ['Three of a kind',
    ['2h', '2s', '2c', '3h', '4h', '7h'], Hand.THREEOFAKIND, Hand.FOUROFAKIND, 1],
  ['Three of a kind',
    ['2h', '2s', '2c', '3h', '4h', '7h'], Hand.THREEOFAKIND, Hand.FULLHOUSE, 9],
  ['Three of a kind that is a Flush draw',
    ['2h', '2s', '2c', '3h', '4h', '7h'], Hand.THREEOFAKIND, Hand.FLUSH, 9],
  ['Three of a kind that is a Straight draw',
    ['2d', '2s', '2c', '3h', '4h', '5h'], Hand.THREEOFAKIND, Hand.STRAIGHT, 8],
  ['Three of a kind that is a Straight Flush draw',
    ['2h', '2s', '2c', '3h', '4h', '5h'], Hand.THREEOFAKIND, Hand.STRAIGHTFLUSH, 2],
  ['Three of a kind that is a Straight Flush draw',
    ['2h', '2s', '2c', '3h', '4h', '5h'], Hand.THREEOFAKIND, Hand.FLUSH, 7],
  ['Three of a kind that is a Straight draw',
    ['2h', '2s', '2c', '3h', '4h', '5h'], Hand.THREEOFAKIND, Hand.STRAIGHT, 6],
  ['Straight that is a Flush draw',
    ['2h', '2s', '6c', '3h', '4h', '5h'], Hand.STRAIGHT, Hand.FLUSH, 8],
  ['Straight that is a Straight Flush draw',
    ['2h', '2s', '6c', '3h', '4h', '5h'], Hand.STRAIGHT, Hand.STRAIGHTFLUSH, 1],
  ['Flush',
    ['2h', '2s', '8h', '3h', '4h', 'Th'], Hand.FLUSH, Hand.FLUSH, 46],
  ['6.1 Flush that is a Straight Flush draw',
    ['2h', '2s', '3h', '4h', '5h', 'Th'], Hand.FLUSH, Hand.STRAIGHTFLUSH, 2],
  ['6.2 Flush that is a Straight Flush draw',
    ['2h', '2s', '3h', '4h', '5h', 'Th'], Hand.FLUSH, Hand.STRAIGHT, 6],
  ['6.3 Flush that is a Straight Flush draw',
    ['2h', '2s', '3h', '4h', '5h', 'Th'], Hand.FLUSH, Hand.FLUSH, 38],
  ['Full House',
    ['2h', '2s', '3h', '3d', '3c', 'Th'], Hand.FULLHOUSE, Hand.FOUROFAKIND, 1],
  ['Full House',
    ['2h', '2s', '3h', '3d', '3c', 'Th'], Hand.FULLHOUSE, Hand.FOUROFAKIND, 1],
  ['Four of a Kind',
    ['2h', '2s', '3h', '3d', '3c', '3s'], Hand.FOUROFAKIND, Hand.FOUROFAKIND, 46],
  ['Straight Flush',
    ['Ah', '2h', '3h', '4h', '5h', '3s'], Hand.STRAIGHTFLUSH, Hand.STRAIGHTFLUSH, 46],
  ['Straight Flush',
    ['Th', 'Jh', 'Qh', 'Kh', 'Ah', '3s'], Hand.ROYALFLUSH, Hand.ROYALFLUSH, 46],

];

describe('Hand', function() {
  testCases.forEach(function (testCase) {
    it('should correctly analyse ' + testCase[0], function() {
      var hand = new Hand.Hand(testCase[1]);
      var expectedRank = testCase[2];
      var handRank = hand.analyseHand();
      console.log(hand.prettyPrint());
      expect(handRank).toEqual(expectedRank);
      expect(hand.sumFrequencies).toEqual(hand.totalCombinations);
      if (testCase.length === 5) {
        expect(hand.frequency[testCase[3]]).toEqual(testCase[4]);
      }
    });
  });
});

