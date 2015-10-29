/*
  Probabilistic classification algorithm
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

var Hand = require('Hand');

function bettingAction(contextToBeClassified) {
  var cards = contextToBeClassified.holeCards.slice();
  cards.concat(contextToBeClassified.communityCards);
  var hand = new Hand(cards);
  // If the probability of a better hand is larger than a threshold
  // then we bet or go all-in
  var betThreshhold = 40;
  var allinThreshhold = 70;

}

function betttingAmount(contextToBeClassified, action) {

}

function classifyContext(trainingSet, contextToBeClassified) {
  var event = {};
  event.context = contextToBeClassified;
  event.class = {};
  event.class.bettingAction = bettingAction(contextToBeClassified);
  event.class.bettingAmount = bettingAmount(contextToBeClassified, event.class.bettingAction);
  return(event);
}

module.exports = classifyContext;