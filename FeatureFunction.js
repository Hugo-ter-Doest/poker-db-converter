/*
  Feature function that maps events (class, context) to {0, 1}
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

var PREFLOP = 0;
var FLOP = 1;
var TURN = 2;
var RIVER = 3;


function strongPocket(card1, card2) {

}

function strongHandFlop() {

}

function strongHandTurn() {

}

function strongHandRiver() {

}

// Pairs of class, context should fire 1 if they are interesting
function featureFunction(i, event) {
  // Differentiate on hand phase
  switch (event.bettingRound) {
    case PREFLOP:
      // Strong pocket cards with betting, calling and raising
      // Weak pocket with checking and folding
      break;
    case FLOP:
      // Strong hand with betting, calling and raising
      // Weak hand with checking and folding
      break;
    case TURN:
      // Strong hand with betting, calling and raising
      // Weak hand with checking and folding
      break;
    case RIVER:
      // Strong hand with betting, calling and raising
      // Weak hand with checking and folding
      break;
  }
}

module.exports = featureFunction;