/*
  Random classification algorithm
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

//var possibleBettingActions = ['bet', 'call', 'check', 'fold', 'raise',
// 'all-in'];

function randomBettingAction(contextToBeClassified) {
  var randomValue = Math.random();

  if (randomValue < 0.17) {
    return ('bet');
  }
  if (randomValue < 0.33) {
    return ('call');
  }
  if (randomValue < 0.5) {
    return ('check');
  }
  if (randomValue < 0.67) {
    return ('fold');
  }
  if (randomValue < 0.83) {
    return ('raise');
  }
  return ('all-in');
}

function randomBettingAmount(contextToBeClassified, action) {
  var currentBettingAmount, raiseAmount;
  var bigBlind = 10;
  smallBet = bigBlind;
  bigBet = 2 * bigBlind;

  switch (contextToBeClassified.bettingRound) {
    case 'preflop':
    case 'flop':
      currentBettingAmount = smallBet;
      raiseAmount = smallBet;
      break;
    case 'turn':
    case 'river':
      currentBettingAmount = bigBet;
      raiseAmount = bigBet;
  }
  switch (action) {
    case 'bet':
      return(currentBettingAmount);
    case 'call':
      return(currentBettingAmount);
    case 'check':
      return(0);
    case 'fold':
      return(0);
    case 'raise':
      return(raiseAmount);
    case 'all-in':
      return(contextToBeClassified.bankRollsBeforeBettingAction[contextToBeClassified.playerPosition - 1]);
  }
}

function classifyContext(trainingSet, contextToBeClassified) {
  var event = {};
  event.context = contextToBeClassified;
  event.class = {};
  event.class.bettingAction = randomBettingAction(contextToBeClassified);
  event.class.bettingAmount = randomBettingAmount(contextToBeClassified, event.class.bettingAction);
  return(event);
}

module.exports = classifyContext;