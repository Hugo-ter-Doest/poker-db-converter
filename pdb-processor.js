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

// Write poker actions in the form (action, context)
function printBettingAction(timeStamp, player, bettingAction, context) {
  console.log(timeStamp + '\t' + player.substring(0, 5) + '\t' + JSON.stringify(bettingAction));
}

function replayPreflop(timeStamp) {
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});
  console.log(playerActions);

  var pot = 0;
  var currentBettingAmount = smallBlind;
  var smallBlindPlayed = false;
  var playerBets = new Array(hand[3]);
  for (var i = 0; i < hand[3]; i++) {
    playerBets[i] = 0;
  }
  // Action string is max. 3 characters long
  for (i = 0; i < 3; i++) {
    playerActions.forEach(function(action, index) {
      // action has the form:
      // player             #play prflop    turn         bankroll    winnings
      //           timestamp    pos   flop       river          action     cards
      // Marzon    766303976  8  1 Bc  bc    kc    kf      12653  300    0
      var preflopActions = action[4];
      if (i < preflopActions.length) {
        var player = action[0];
        var bettingAction = {};
        bettingAction.action = preflopActions[i];
        bettingAction.amount = 0;
        switch (bettingAction.action) {
          case '-': // no action; player is no longer contesting pot
            bettingAction.amount = 0;
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
            break;
          case 'k': // check
            break;
          case 'b': // bet
            currentBettingAmount += bigBlind;
            bettingAction.amount = bigBlind;
            break;
          case 'c': // call
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'r': // raise
            currentBettingAmount += bigBlind;
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.amount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            break;
          case 'K': // kicked from game
            break;
        }
        playerBets[index] += bettingAction.amount;
        pot += bettingAction.amount;
        var context = {};
        printBettingAction(timeStamp, player, bettingAction, context);
      }
    });
  }
  console.log('Preflop pot calculated: ' + pot);
  console.log('Preflop pot according to database: ' + hand[4]);
  return(pot);
}

function replayFlop(timeStamp, pot) {
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});
  console.log(playerActions);

  var currentBettingAmount = bigBlind;
  var playerBets = new Array(hand[3]);
  for (var i = 0; i < hand[3]; i++) {
    playerBets[i] = 0;
  }
  // Action string is max. 3 characters long
  for (i = 0; i < 3; i++) {
    playerActions.forEach(function(action, index) {
      // action has the form:
      // player             #play prflop    turn         bankroll    winnings
      //           timestamp    pos   flop       river          action     cards
      // Marzon    766303976  8  1 Bc  bc    kc    kf      12653  300    0
      var flopActions = action[5];
      if (i < flopActions.length) {
        var player = action[0];
        var bettingAction = {};
        bettingAction.action = flopActions[i];
        bettingAction.amount = 0;
        switch (bettingAction.action) {
          case '-': // no action; player is no longer contesting pot
            break;
          case 'f': // fold
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
            currentBettingAmount += bigBlind;
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.amount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            break;
          case 'K': // kicked from game
            break;
        }
        playerBets[index] += bettingAction.amount;
        pot += bettingAction.amount;
        var context = {};
        printBettingAction(timeStamp, player, bettingAction, context);
      }
    });
  }
  console.log('Flop pot calculated: ' + pot);
  console.log('Flop pot according to database: ' + hand[5]);
  return(pot);
}
function replayTurn(timeStamp, pot) {
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});
  console.log(playerActions);

  var currentBettingAmount = bigBlind * 2;
  var playerBets = new Array(hand[3]);
  for (var i = 0; i < hand[3]; i++) {
    playerBets[i] = 0;
  }
  // Action string is max. 3 characters long
  for (i = 0; i < 3; i++) {
    playerActions.forEach(function(action, index) {
      // action has the form:
      // player             #play prflop    turn         bankroll    winnings
      //           timestamp    pos   flop       river          action     cards
      // Marzon    766303976  8  1 Bc  bc    kc    kf      12653  300    0
      var turnActions = action[6];
      if (i < turnActions.length) {
        var player = action[0];
        var bettingAction = {};
        bettingAction.action = turnActions[i];
        bettingAction.amount = 0;
        switch (bettingAction.action) {
          case '-': // no action; player is no longer contesting pot
            break;
          case 'f': // fold
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
            currentBettingAmount += bigBlind;
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.amount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            break;
          case 'K': // kicked from game
            break;
        }
        playerBets[index] += bettingAction.amount;
        pot += bettingAction.amount;
        var context = {};
        printBettingAction(timeStamp, player, bettingAction, context);
      }
    });
  }
  console.log('Turn pot calculated: ' + pot);
  console.log('Turn pot according to database: ' + hand[6]);
  return(pot);
}

function replayRiver(timeStamp, pot) {
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});
  console.log(playerActions);

  var currentBettingAmount = bigBlind * 2;
  var playerBets = new Array(hand[3]);
  for (var i = 0; i < hand[3]; i++) {
    playerBets[i] = 0;
  }
  // Action string is max. 3 characters long
  for (i = 0; i < 3; i++) {
    playerActions.forEach(function(action, index) {
      // action has the form:
      // player             #play prflop    turn         bankroll    winnings
      //           timestamp    pos   flop       river          action     cards
      // Marzon    766303976  8  1 Bc  bc    kc    kf      12653  300    0
      var riverActions = action[7];
      if (i < riverActions.length) {
        var player = action[0];
        var bettingAction = {};
        bettingAction.action = riverActions[i];
        bettingAction.amount = 0;
        switch (bettingAction.action) {
          case '-': // no action; player is no longer contesting pot
            break;
          case 'f': // fold
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
            currentBettingAmount += bigBlind;
            bettingAction.amount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.amount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            break;
          case 'K': // kicked from game
            break;
        }
        playerBets[index] += bettingAction.amount;
        pot += bettingAction.amount;
        var context = {};
        printBettingAction(timeStamp, player, bettingAction, context);
      }
    });
  }
  console.log('River pot calculated: ' + pot);
  console.log('River pot according to database: ' + hand[7]);
  return(pot);
}

// Replays the hand and writes player actions
function replayHand(timeStamp, hand) {
  var handActions = actions[timeStamp];
  replayPreflop(timeStamp, hand, handActions);
  //replayFlop(timeStamp, hand, handActions);
  //replayTurn(timeStamp, hand, handActions);
  //replayRiver(timeStamp, hand, handActions);
}

function replayHands() {
  Object.keys(hands).forEach(function (timeStamp) {
    var pot = 0;
    pot = replayPreflop(timeStamp);
    pot = replayFlop(timeStamp, pot);
    pot = replayTurn(timeStamp, pot);
    pot = replayRiver(timeStamp, pot);
  });
}


readPokerDB();
replayHands();