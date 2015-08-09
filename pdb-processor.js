/*
  Module for converting data from http://poker.cs.ualberta.ca/IRCdata/ to
  pairs of (context, action)
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

var fs = require('fs');

// Poker hands database
var base = '/home/hugo/Workspace/poker-db/holdem/199504/';
var hdb_file = base + 'hdb';
var pdb_path = base + 'pdb/';

// Output file
var actionsFile = '';

var hands = {};
var actions = {};

var smallBlind = 5;
var bigBlind = 10;

var numberOfBettingRounds = 0;
var numberOfWrongCalculatedPots = 0;

var PREFLOP = 0;
var FLOP = 1;
var TURN = 2;
var RIVER = 3;

// Read database files
function readPokerDB() {
  // Read and process hands database
  var hdbLines = fs.readFileSync(hdb_file, 'utf8').match(/[^\r\n]+/g);
  hdbLines.forEach(function(hand) {
    var handCols = hand.split(/\s+/);
    var timeStamp = handCols[0];
    console.log(timeStamp);
    hands[timeStamp] = handCols;
  });

  // Read and process user databases
  var playerFiles = fs.readdirSync(pdb_path);
  playerFiles.forEach(function(playerFile) {
    console.log('readPokerDB: opening player file: ' + pdb_path + playerFile);
    var pdbLines = fs.readFileSync(pdb_path + playerFile, 'utf8').match(/[^\r\n]+/g);
    pdbLines.forEach(function(pdbLine) {
      var playerCols = pdbLine.split(/\s+/);
      timeStamp = playerCols[1];
      if (actions[timeStamp]) {
        actions[timeStamp].push(playerCols);
      }
      else {
        actions[timeStamp] = [playerCols];
      }
    });
  });
}

// Build a context of information that can be used for deciding on the next
// betting action
function createContext(hand, playerActions, bettingRound, pot, player, positionInActionString) {
  var context = {};

  context.playerPosition = player;
  context.bettingRound = bettingRound;
  context.pot = pot;
  // Cards that are know in this bettingRound
  context.communityCards = [];
  switch (bettingRound) {
    case PREFLOP:
      break;
    case FLOP:
      if (hand.length === 11) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
      }
      break;
    case TURN:
      if (hand.length === 12) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
        context.communityCards.push(hand[11]);
      }
      break;
    case RIVER:
      if (hand.length === 13) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
        context.communityCards.push(hand[11]);
        context.communityCards.push(hand[12]);
      }
  }
  // Hole cards (if known)
  if (playerActions[player].length === 13) {
    context.holeCards = [playerActions[player][11], playerActions[player][12]];
  }
  // Previous betting actions in this betting round
  i = 0;
  var newBettingActionFound;
  context.bettingHistory = [];
  do {
    newBettingActionFound = false;
    playerActions.forEach(function (action, index) {
      if ((i < positionInActionString) ||
        ((i === positionInActionString) && (index < player))) {
        var bettingActions = null;
        switch (bettingRound) {
          case PREFLOP:
            bettingActions = action[4];
            break;
          case FLOP:
            bettingActions = action[5];
            break;
          case TURN:
            bettingActions = action[6];
            break;
          case RIVER:
            bettingActions = action[7];
            break;
        }
        if (i < bettingActions.length) {
          newBettingActionFound = true;
          context.bettingHistory.push(index + ": " + bettingActions[i]);
        }
        else {
          context.bettingHistory.push(index + ": <none>");
        }
      }
    });
    i++;
  } while (newBettingActionFound && (i <= positionInActionString));
  return(context);
}

// Write poker actions in the form (action, context)
function printBettingAction(timeStamp, player, bettingAction, context) {
  console.log(timeStamp + '\t' + player.substring(0, 5) + '\t' + JSON.stringify(bettingAction) + JSON.stringify(context, null, 2));
}

function replayBettingRound(timeStamp, pot, bettingRound) {
  numberOfBettingRounds++;
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});

  // Set the betting amount according to betting round
  switch (bettingRound) {
    case PREFLOP:
      currentBettingAmount = smallBlind;
      raiseAmount = bigBlind;
      break;
    case FLOP:
      currentBettingAmount = bigBlind;
      raiseAmount = bigBlind;
      break;
    case TURN:
    case RIVER:
      currentBettingAmount = 2 * bigBlind;
      raiseAmount = 2 * bigBlind;
  }
  var smallBlindPlayed = false;
  var playerBets = new Array(hand[3]);
  for (var i = 0; i < hand[3]; i++) {
    playerBets[i] = 0;
  }
  var activePlayers = [];
  for (i = 0; i < hand[3]; i++) {
    activePlayers[i] = true;
  }
  // Action string is max. 3 characters long
  // for (i = 0; i < 3; i++) {
  i = 0;
  var newBettingActionFound;
  do {
    newBettingActionFound = false;
    playerActions.forEach(function (action, index) {
      // action has the form:
      // player             #play prflop    turn         bankroll    winnings
      //           timestamp    pos   flop       river          action     cards
      // Marzon    766303976  8  1 Bc  bc    kc    kf      12653  300    0
      var bettingActions = null;
      switch (bettingRound) {
        case PREFLOP:
          bettingActions = action[4];
          break;
        case FLOP:
          bettingActions = action[5];
          break;
        case TURN:
          bettingActions = action[6];
          break;
        case RIVER:
          bettingActions = action[7];
          break;
      }
      if (i < bettingActions.length) {
        newBettingActionFound = true;
        var player = action[0];
        var bettingAction = {};
        bettingAction.action = bettingActions[i];
        bettingAction.amount = 0;
        switch (bettingAction.action) {
          case '-': // no action; player is no longer contesting pot
            activePlayers[index] = false;
            break;
          case 'B': // blind bet (either small or big blind)
            if (smallBlindPlayed) { // this is big blind
              bettingAction.amount = bigBlind;
              currentBettingAmount = bigBlind;
            }
            else { // this is small blind
              bettingAction.amount = smallBlind;
              smallBlindPlayed = true;
            }
            break;
          case 'f': // fold
            activePlayers[index] = false;
            break;
          case 'k': // check
            break;
          case 'b': // bet
            bettingAction.amount = currentBettingAmount;
            break;
          case 'c': // call
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'r': // raise
            currentBettingAmount += raiseAmount;
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.amount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            activePlayers[index] = false;
            break;
          case 'K': // kicked from game
            activePlayers[index] = false;
            break;
        }
        playerBets[index] += bettingAction.amount;
        pot += bettingAction.amount;
        var context = createContext(hand, playerActions, bettingRound, pot, index, i);
        printBettingAction(timeStamp, player, bettingAction, context);
      }
    });
    i++;
  } while (newBettingActionFound);
  // Calculate number of players that see the end of the betting round, i.e.
  // did not fold, quit, etc.
  var numberOfActivePlayers = 0;
  for (var i = 0; i < hand[3]; i++) {
    if (activePlayers[i]) {
      numberOfActivePlayers++;
    }
  }
  if (numberOfActivePlayers < 2) {
    pot = 0;
  }
  switch (bettingRound) {
    case PREFLOP:
      console.log('Preflop pot calculated: ' + pot);
      potAccordingToDB = hand[4].split('/')[1];
      console.log('Preflop pot according to database: ' + hand[4]);
      break;
    case FLOP:
      console.log('Flop pot calculated: ' + pot);
      potAccordingToDB = hand[5].split('/')[1];
      console.log('Flop pot according to database: ' + hand[5]);
      break;
    case TURN:
      console.log('Turn pot calculated: ' + pot);
      potAccordingToDB = hand[6].split('/')[1];
      console.log('Turn pot according to database: ' + hand[6]);
      break;
    case RIVER:
      console.log('River pot calculated: ' + pot);
      potAccordingToDB = hand[7].split('/')[1];
      console.log('River pot according to database: ' + hand[7]);
      break;
  }
  if (pot !== parseInt(potAccordingToDB)) {
    console.log('Calculated pot ' + pot + ' is not equal to pot' +
      ' according to database ' + potAccordingToDB);
    numberOfWrongCalculatedPots ++;
  }
  return(pot);
}

function replayHands() {
  Object.keys(hands).forEach(function (timeStamp) {
    var pot = 0;
    pot = replayBettingRound(timeStamp, pot, PREFLOP);
    pot = replayBettingRound(timeStamp, pot, FLOP);
    pot = replayBettingRound(timeStamp, pot, TURN);
    pot = replayBettingRound(timeStamp, pot, RIVER);
  });
}


readPokerDB();
replayHands();

console.log('Number of betting rounds: ' + numberOfBettingRounds);
console.log('Wrong calculated pots (each betting round): ' + numberOfWrongCalculatedPots);