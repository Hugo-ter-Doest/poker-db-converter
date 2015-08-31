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

var sizeOfTrainingSet = 0.7;
var trainingSet = [];
var testingSet = [];

function splitIntoTestAndTrainSet() {
  classContextPairs.forEach(function(pair) {
    if (Math.random() < sizeOfTrainingSet) {
      trainingSet.push(pair);
    }
    else {
      testingSet.push(pair);
    }
  });
}

// context1 is a context available in the database
// context2 is a context that should be classified, it may be incomplete
function computeSimilarity(context1, context2) {
  var similarity = 0;
  // Compare number of players
  if (context2.numberOfPlayers) {
    if (math.abs(context2.numberOfPlayers - context1.numberOfPlayers) < 3) {
      similarity++;
    }
  }

  // Compare number of active players
  if (context2.numberOfActivePlayers) {
    if (context1.numberOfActivePlayers === context2.numberOfActivePlayers) {
      similarity += 1;
    }
  }

  // Compare player position
  if (context2.playerPosition) {
    if (context1.playerPosition === context2.playerPosition) {
      similarity += 1;
    }
  }

  // Compare pot before betting action
  if (context2.potBeforeBettingAction) {
    // Test whether pots are in the same magnitude
    if (math.round(math.log(context1.potBeforeBettingAction, 10)) ===
      math.round(math.log(context2.potBeforeBettingAction, 10))) {
      //similarity++;
    }
  }

  // Compare betting round
  if (context2.bettingRound) {
    if (context1.bettingRound === context2.bettingRound) {
      //similarity += 1;
    }
  }

  var maxIndex = -1;
  // Compare community cards
  switch (context2.bettingRound) {
    case PREFLOP:
      maxIndex = -1;
      break;
    case FLOP:
      maxIndex = 2;
      break;
    case TURN:
      maxIndex = 3;
      break;
    case RIVER:
      maxIndex = 4;
      break;
  }
  context2.communityCards.forEach(function(card, index) {
    // Look at cards that are known in this round
    if (index <= maxIndex) {
      var indexOfCard = context1.communityCards.indexOf(card);
      if ((indexOfCard !== -1) && (indexOfCard <= maxIndex)) {
        similarity += 1;
      }
    }
  });

  return(similarity);
}

function createContext(holeCards, bettingRound, communityCards, potBeforeBettingAction, numberOfPlayers) {
  var context = {};

  context.holeCards = holeCards;
  context.bettingRound = bettingRound;
  context.communityCards = communityCards;
  context.potBeforeBettingAction = potBeforeBettingAction;
  context.numberOfPlayers = numberOfPlayers;

  return(context);
}

function equalHoleCards(holeCards1, holeCards2) {
 return(
   ((holeCards1.indexOf(holeCards2[0]) > -1) &&
  (holeCards1.indexOf(holeCards2[1]) > -1)) ? 1 : 0
 );
}

function similarHoleCards(holeCards1, holeCards2) {
  return(
    (((holeCards1[0][0] === holeCards2[0][0]) &&
    (holeCards1[1][0] === holeCards2[1][0])) ||
    ((holeCards2[0][0] === holeCards1[1][0]) &&
    (holeCards2[0][0] === holeCards1[1][0]))) ? 1 : 0
  );
}

function suitedHoleCards(holeCards1, holeCards2) {
  return (
    ((holeCards1[0][1] === holeCards1[1][1]) &&
    (holeCards2[0][1] === holeCards2[1][1])) ? 1 : 0
  );
}

function classifyContext(contextToBeClassified) {
  // Find class context pairs for these hole card
  var matches = [];
  trainingSet.forEach(function(pair) {
    var similarity = equalHoleCards(contextToBeClassified.holeCards, pair.context.holeCards);
    //similarity += suitedHoleCards(contextToBeClassified.holeCards,
    // pair.context.holeCards);
    similarity += similarHoleCards(contextToBeClassified.holeCards, pair.context.holeCards);
    if (similarity) {
      pair.similarity = similarity;
      matches.push(pair);
    }
  });
  //console.log('classifyHand: number of matching betting actions based on' +
  //  ' hole cards: ' + matches.length);
  // Score the matched context
  matches.forEach(function(pair) {
    pair.similarity += computeSimilarity(pair.context, contextToBeClassified);
    //console.log(pair.similarity);
  });
  // Sort descending by similarity
  matches.sort(function(a, b) {
    return(b.similarity - a.similarity);
  });
  // Return the match with the highest similary
  return(matches[0]);
}

function testSimilarityMeasure() {
  var recallBettingAction = 0;
  var recallBettingActionPlusAmount = 0;
  var numberOfTestsProcessed = 0;
  splitIntoTestAndTrainSet();
  testingSet.forEach(function(pair) {
    var classification = classifyContext(pair.context);
    if (classification.class.bettingAction === pair.class.bettingAction) {
      recallBettingAction++;
      if (classification.class.bettingAmount === pair.class.bettingAmount) {
        recallBettingActionPlusAmount++;
      }
    }
    numberOfTestsProcessed++;
    console.log('Recall betting actions: ' + math.round(100 * recallBettingAction / numberOfTestsProcessed) + ' (' + numberOfTestsProcessed + ' tests processed)');
    console.log('Recall betting actions including betting amounts: ' + math.round(100 * recallBettingActionPlusAmount / numberOfTestsProcessed));
  });
}

testSimilarityMeasure();