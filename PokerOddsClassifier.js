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

var cards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen',
  'King', 'Ace'];

var handRanks = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight',
  'Flush', 'Full house', 'Four of a kind', 'Straight flush', 'Royal flush'];

// Calculates future pussible hand ranks based on community cards
function calculateFutureHandRanks(cards) {

}

// Calculates hand rank based on known cards
function calculateHandRank(cards) {

}

function classifyContext(trainingSet, contextToBeClassified) {

}

module.exports = classifyContext;