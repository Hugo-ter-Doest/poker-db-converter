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
var similarityClassifier = require('./SimilarityClassifier');
var randomClassifier = require('./RandomClassifier');

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

function createContext(holeCards, bettingRound, communityCards, potBeforeBettingAction, numberOfPlayers) {
  var context = {};

  context.holeCards = holeCards;
  context.bettingRound = bettingRound;
  context.communityCards = communityCards;
  context.potBeforeBettingAction = potBeforeBettingAction;
  context.numberOfPlayers = numberOfPlayers;

  return(context);
}

function testSimilarityMeasure() {
  var classifiers = ['similarity', 'random'];
  var recallBettingAction = [0, 0];
  var recallBettingActionPlusAmount = [0, 0];
  var numberOfTestsProcessed = 0;
  splitIntoTestAndTrainSet();
  testingSet.forEach(function(pair) {
    var classificationSimilarity = similarityClassifier(trainingSet, pair.context);
    var classificationRandom = randomClassifier(trainingSet, pair.context);
    [classificationSimilarity, classificationRandom].forEach(function(classification, index) {
      if (classification.class.bettingAction === pair.class.bettingAction) {
        recallBettingAction[index]++;
        if (classification.class.bettingAmount === pair.class.bettingAmount) {
          recallBettingActionPlusAmount[index]++;
        }
      }
      console.log(classifiers[index] + ' recall betting actions: ' + math.round(100 * recallBettingAction[index] / numberOfTestsProcessed) + ' (' + numberOfTestsProcessed + ' tests processed)');
      console.log(classifiers[index] + ' recall betting actions including' +
        ' betting amounts: ' + math.round(100 * recallBettingActionPlusAmount[index] / numberOfTestsProcessed));
    });
    numberOfTestsProcessed++;
  });
}

testSimilarityMeasure();