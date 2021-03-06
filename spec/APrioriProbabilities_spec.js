/*
  Unit test for APrioriProbabilities
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

var APrioriProbabilities = require('../APrioriProbabilities');
var Hand = require('../Hand');


describe('APrioriProbabilities', function() {
  var hand = new Object();
  hand.cards = new Array(2);
  var aPrioriProbabilities = new APrioriProbabilities(hand);
  it('a priori frequencies should add up to total number of combinations for' +
    ' two card hands', function () {
    var totalComb = aPrioriProbabilities.totalCombinations();
    var totalFreq = 0;
    for (var rank = Hand.HIGHCARD; rank <= Hand.CONNECTEDANDSUITED; rank++) {
      hand.rank = rank;
      totalFreq += aPrioriProbabilities.rankFrequency();
    }
    expect(totalFreq).toEqual(totalComb);
  });
  var nrCardsA = [5, 6, 7];
  nrCardsA.forEach(function (nrCards) {
    it('a priori frequencies should add up to total number of combinations' +
      ' for ' + nrCards + ' card hands', function () {
      hand.cards = new Array(nrCards);
      var totalComb = aPrioriProbabilities.totalCombinations(nrCards);
      var totalFreq = 0;
      for (var rank = Hand.HIGHCARD; rank <= Hand.ROYALFLUSH; rank++) {
        hand.rank = rank;
        totalFreq += aPrioriProbabilities.rankFrequency(nrCards, rank);
      }
      expect(totalFreq).toEqual(totalComb);
    });
  });
});