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
    ['C2', 'S2'], Hand.PAIR],
  ['High Card',
    ['C6', 'S8'], Hand.HIGHCARD],
  ['Suited Cards',
    ['C2', 'C6'], Hand.SUITEDCARDS],
  ['Connected Cards',
    ['C2', 'S3'], Hand.CONNECTEDCARDS],
  ['Connected Cards',
    ['CA', 'S2'], Hand.CONNECTEDCARDS],
  ['Connected and Suited Cards',
    ['C2', 'C3'], Hand.CONNECTEDANDSUITED],
  ['Connected and Suited Cards',
    ['C2', 'C3'], Hand.CONNECTEDANDSUITED],

  // Five card hands
  ['High Card',
    ['C2', 'SJ', 'C5', 'HT', 'HQ'], Hand.HIGHCARD,       Hand.PAIR, 15],
  ['High Card that is a Straight draw',
    ['C2', 'S3', 'C5', 'H6', 'HQ'], Hand.HIGHCARD,       Hand.STRAIGHT, 4],
  ['High Card that is a Straight Flush draw',
    ['C2', 'C3', 'HQ', 'C5', 'C6'], Hand.HIGHCARD,       Hand.STRAIGHTFLUSH, 1],
  ['Pair',
    ['C2', 'S2', 'C5', 'HT', 'HQ'], Hand.PAIR,           Hand.THREEOFAKIND, 2],
  ['Two Pair',
    ['C2', 'S2', 'C5', 'H5', 'HQ'], Hand.TWOPAIR,        Hand.FULLHOUSE, 4],
  ['Three of a Kind',
    ['C2', 'S2', 'H2', 'C5', 'HQ'], Hand.THREEOFAKIND,   Hand.FULLHOUSE, 6],
  ['Straight',
    ['C2', 'S3', 'H5', 'C4', 'H6'], Hand.STRAIGHT,       Hand.STRAIGHT, 47],
  ['Straight that is a Straigh Flush draw',
    ['C2', 'C3', 'C5', 'C4', 'H6'], Hand.STRAIGHT,       Hand.STRAIGHTFLUSH, 1],
  ['Straight',
    ['CA', 'S3', 'H4', 'C5', 'H2'], Hand.STRAIGHT,       Hand.STRAIGHT, 47],
  ['Flush that is a Straight Flush draw',
    ['C2', 'C3', 'C5', 'C6', 'CQ'], Hand.FLUSH,          Hand.STRAIGHTFLUSH, 1],
  ['Full of a House',
    ['C2', 'D2', 'C3', 'D3', 'S3'], Hand.FULLHOUSE,      Hand.FOUROFAKIND, 1],
  ['Four of a Kind',
    ['C2', 'D2', 'H2', 'S2', 'S3'], Hand.FOUROFAKIND,    Hand.FOUROFAKIND, 47],
  ['Straight Flush that is a Royal Flush draw',
    ['C9', 'CT', 'CJ', 'CQ', 'CK'], Hand.STRAIGHTFLUSH,  Hand.ROYALFLUSH, 1],
  ['Royal Flush',
    ['CT', 'CJ', 'CQ', 'CK', 'CA'], Hand.ROYALFLUSH,     Hand.ROYALFLUSH, 47],

  // Six card hands
  ['High Card that is a Straight draw pattern 011110',
    ['C2', 'SJ', 'C5', 'HT', 'HQ', 'HK'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['High Card that is a Straight draw pattern 011110',
    ['C2', 'S3', 'C5', 'H6', 'H7', 'H8'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['High Card that is a Straight draw with pattern 11011',
    ['C2', 'SJ', 'C5', 'HT', 'HK', 'HA'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Straight draw with a hole in the middle and an Ace' +
  ' as lowest card',
    ['C2', 'S3', 'C5', 'HT', 'HK', 'HA'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Straight draw with consecutive cards and an Ace as' +
  ' lowest card',
    ['C2', 'S3', 'C4', 'HT', 'HK', 'HA'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High card that is a Straight draw with Ace as highest card',
    ['C2', 'S3', 'CJ', 'HQ', 'HK', 'HA'], Hand.HIGHCARD,     Hand.STRAIGHT, 4],
  ['High Card that is a Flush draw',
    ['C2', 'S3', 'HJ', 'H7', 'HK', 'HA'], Hand.HIGHCARD,     Hand.FLUSH, 9],
  ['High card that is a Straight Flush draw',
    ['C2', 'S3', 'HJ', 'HQ', 'HK', 'HA'], Hand.HIGHCARD,     Hand.STRAIGHTFLUSH, 1],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['C2', 'H3', 'CJ', 'HQ', 'HK', 'HT'], Hand.HIGHCARD,     Hand.STRAIGHTFLUSH, 0],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['C2', 'H3', 'CJ', 'HQ', 'HK', 'HT'], Hand.HIGHCARD,     Hand.FLUSH, 9],
  ['High card that is a Straight draw and Flush draw but not a Straight' +
  ' Flush draw',
    ['C2', 'H3', 'CJ', 'HQ', 'HK', 'HT'], Hand.HIGHCARD,     Hand.STRAIGHT, 8],
  ['Pair',
    ['C2', 'S2', 'C5', 'HT', 'HQ', 'HA'], Hand.PAIR,         Hand.THREEOFAKIND, 2],
  ['Pair',
    ['C2', 'S2', 'C5', 'HT', 'HQ', 'HA'], Hand.PAIR,         Hand.TWOPAIR, 12],
  ['Pair that is a Flush draw',
    ['C2', 'S2', 'H5', 'HT', 'HQ', 'HA'], Hand.PAIR,         Hand.FLUSH, 9],
  ['Pair that is a Flush draw',
    ['C2', 'S2', 'H3', 'H4', 'HQ', 'H5'], Hand.PAIR,         Hand.STRAIGHT, 8],
  ['Pair that is a Flush draw',
    ['C2', 'S2', 'H3', 'H4', 'HQ', 'H5'], Hand.PAIR,         Hand.FLUSH, 9],
  ['Pair that is a Flush draw',
    ['C2', 'S2', 'H3', 'H4', 'HQ', 'H5'], Hand.PAIR,         Hand.STRAIGHTFLUSH, 0],
  ['Pair that is a Straight Flush draw',
    ['CQ', 'SQ', 'H3', 'H4', 'H6', 'H5'], Hand.PAIR,         Hand.STRAIGHTFLUSH, 2],
  ['Pair that is a Straight Flush draw',
    ['CQ', 'SQ', 'H3', 'H4', 'H6', 'H5'], Hand.PAIR,         Hand.FLUSH, 7],
  ['Two Pair that is a Flush draw',
    ['HQ', 'SQ', 'C3', 'H3', 'H6', 'H5'], Hand.TWOPAIR,      Hand.FLUSH, 9],
  ['Two Pair that is a Flush draw',
    ['HQ', 'SQ', 'C3', 'H3', 'H6', 'H5'], Hand.TWOPAIR,      Hand.FULLHOUSE, 4],
  ['Two pair that is a Straight draw',
    ['H2', 'S2', 'C3', 'H3', 'D4', 'H5'], Hand.TWOPAIR,      Hand.STRAIGHT, 8],
  ['Two pair that is a Straight Flush draw',
    ['H2', 'S2', 'C3', 'H3', 'H4', 'H5'], Hand.TWOPAIR,      Hand.STRAIGHTFLUSH, 2],
  ['Two pair that is a Straight Flush draw',
    ['H2', 'S2', 'C3', 'H3', 'H4', 'H5'], Hand.TWOPAIR,      Hand.FLUSH, 7],
  ['Three of a kind that is a Straight Flush draw',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H5'], Hand.THREEOFAKIND, Hand.STRAIGHTFLUSH, 2],
  ['Three of a kind',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H7'], Hand.THREEOFAKIND, Hand.FOUROFAKIND, 1],
  ['Three of a kind',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H7'], Hand.THREEOFAKIND, Hand.FULLHOUSE, 9],
  ['Three of a kind that is a Flush draw',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H7'], Hand.THREEOFAKIND, Hand.FLUSH, 9],
  ['Three of a kind that is a Straight draw',
    ['D2', 'S2', 'C2', 'H3', 'H4', 'H5'], Hand.THREEOFAKIND, Hand.STRAIGHT, 8],
  ['Three of a kind that is a Straight Flush draw',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H5'], Hand.THREEOFAKIND, Hand.STRAIGHTFLUSH, 2],
  ['Three of a kind that is a Straight Flush draw',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H5'], Hand.THREEOFAKIND, Hand.FLUSH, 7],
  ['Three of a kind that is a Straight Flush draw',
    ['H2', 'S2', 'C2', 'H3', 'H4', 'H5'], Hand.THREEOFAKIND, Hand.STRAIGHT, 6],
  ['Straight that is a Flush draw',
    ['H2', 'S2', 'C6', 'H3', 'H4', 'H5'], Hand.STRAIGHT, Hand.FLUSH, 8],
  ['Straight that is a Straight Flush draw',
    ['H2', 'S2', 'C6', 'H3', 'H4', 'H5'], Hand.STRAIGHT, Hand.STRAIGHTFLUSH, 1],
  ['Flush',
    ['H2', 'S2', 'H8', 'H3', 'H4', 'HT'], Hand.FLUSH, Hand.FLUSH, 46],
  ['Flush that is a Straight Flush draw',
    ['H2', 'S2', 'H3', 'H4', 'H5', 'HT'], Hand.FLUSH, Hand.STRAIGHTFLUSH, 2],
  ['Flush that is a Straight Flush draw',
    ['H2', 'S2', 'H3', 'H4', 'H5', 'HT'], Hand.FLUSH, Hand.FLUSH, 44],
  ['Full House',
    ['H2', 'S2', 'H3', 'D3', 'C3', 'HT'], Hand.FULLHOUSE, Hand.FOUROFAKIND, 1],
  ['Full House',
    ['H2', 'S2', 'H3', 'D3', 'C3', 'HT'], Hand.FULLHOUSE, Hand.FOUROFAKIND, 1],
  ['Four of a Kind',
    ['H2', 'S2', 'H3', 'D3', 'C3', 'S3'], Hand.FOUROFAKIND, Hand.FOUROFAKIND, 46],
  ['Straight Flush',
    ['HA', 'H2', 'H3', 'H4', 'H5', 'S3'], Hand.STRAIGHTFLUSH, Hand.STRAIGHTFLUSH, 46],
  ['Straight Flush',
    ['HT', 'HJ', 'HQ', 'HK', 'HA', 'S3'], Hand.ROYALFLUSH, Hand.ROYALFLUSH, 46],

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

