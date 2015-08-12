/*
  Naive classification algorithm based on a simple similarity measure
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

var math = require('mathjs');

var classContextPairs = require('./data/holdem.json');

var PREFLOP = 0;
var FLOP = 1;
var TURN = 2;
var RIVER = 3;

function classifyHand(holeCard1, holeCard2, bettingRound, communityCards, pot, numberOfPlayers) {
  // Find class context pairs for these hole card
  var matches = [];
  classContextPairs.forEach(function(pair) {
    if ((pair.context.holeCards.indexOf(holeCard1) > -1) && (pair.context.holeCards.indexOf(holeCard2) > -1)) {
      matches.push(pair);
    }
  });
  console.log('classifyHand: number of matching betting actions based on' +
    ' hole cards: ' + matches.length);
  // Score the matched context
  matches.forEach(function(pair) {
    pair.similarity = 0;
    // Test whether pots are in the same magnitude
    if (math.round(math.log(pair.context.potBeforeBettingAction, 10)) === math.round(math.log(pot, 10))) {
      pair.similarity++;
    }
    if (pair.bettingRound === bettingRound) {
      pair.similarity++;
    }
    if (math.abs(numberOfPlayers - pair.context.numberOfPlayers) < 3) {
      pair.similarity++;
    }
    communityCards.forEach(function(card) {
      if (pair.context.communityCards.indexOf(card) > -1) {
        pair.similarity++;
      }
    });
    console.log(pair.similarity);
  });
  // Sort descending by similarity
  matches.sort(function(a, b) {
    return(b.similarity - a.similarity);
  });
  // Return the match with the highest similary
  return(matches[0]);
}

var action = classifyHand('Jd', '7h', FLOP, ['2h', 'Kh', '8c'], 150, 7);
console.log('Best matching betting action: ' + JSON.stringify(action, null, 2));