/*
  Module for converting data from http://poker.cs.ualberta.ca/IRCdata/ to
  pairs of (class, context)
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
var underscore = require('underscore');

// Poker hands database
var workspace = '/home/hugo/Workspace/';
//var workspace = '/Workspace/';
var base = workspace + 'poker-db/';
var output_base = workspace + 'poker-db-converter/data/';

var hands = {};
var actions = {};

var smallBlind = 5;
var bigBlind = 10;

var numberOfBettingRounds = 0;
var numberOfWrongCalculatedPots = 0;
var numberOfBettingActions = 0;

var classContextPairs = [];

var PREFLOP = 0;
var FLOP = 1;
var TURN = 2;
var RIVER = 3;

channels = [
  '7stud',
  '7studhi',
  'botsonly',
  'h1-nobots',
  'holdem',
  'holdemii',
  'holdem1',
  'holdem2',
  'holdem3',
  'holdempot',
  'nolimit',
  'ohlpot',
  'omaha',
  'omahahi',
  'omahapot',
  'ptourney',
  'tourney'
];

gameConfigurations = {
  '7stud':          ['7-card stud stud high/low (8 or better)'],
  '7studhi':        ['7-card stud high'],
  'botsonly':       ['10-20 Holdem (reserved for bots)', 5, 10],
  'h1-nobots':      ['10-20 Holdem (reserved for humans)', 5, 10],
  'holdem':         ['10-20 holdem (the original channel)', 5 , 10],
  'holdemii':       ['10-20 holdem', 5, 10],
  'holdem1':        ['10-20 holdem', 5, 10],
  'holdem2':        ['20-40 holdem ($2k minimum buyin)', 10, 20],
  'holdem3':        ['50-100 holdem ($5k minimum buyin)', 25, 50],
  'holdempot':      ['Pot-limit holdem'],
  'nolimit':        ['No-limit Holdem'],
  'ohlpot':         ['Pot-limit omaha high/low (8 or better)'],
  'omaha':          ['10-20 Omaha high/low (8 or better)', 5, 10],
  'omahahi':        ['Omaha high only'],
  'omahapot':       ['Pot-limit omaha high only'],
  'ptourney':       ['Pot-limit omaha tournaments'],
  'tourney':        ['No-limit holdem tournaments']
};

channelToFiles = {
  '7stud': ['199504'],
  '7studhi': [],
  'botsonly': [],
  'h1-nobots': [],
  'holdem': ['199504'],
  'holdemii': [],
  'holdem1': ['199808'],
  'holdem2': [],
  'holdem3': ['199505'],
  'holdempot': [],
  'nolimit': [],
  'ohlpot': [],
  'omaha': [],
  'omahahi': [],
  'omahapot': [],
  'ptourney': [],
  'tourney': []
};

// Read database files
function readPokerDB(channel) {
  var pokerDatabases = channelToFiles[channel];
  pokerDatabases.forEach(function(database) {
    var hdb_file = base + channel + '/' + database + '/hdb';
    // Read and process hands database
    var hdbLines = fs.readFileSync(hdb_file, 'utf8').match(/[^\r\n]+/g);
    hdbLines.forEach(function (hand) {
      var handCols = hand.split(/\s+/);
      var timeStamp = handCols[0];
      hands[timeStamp] = handCols;
    });

    // Read and process user databases
    var pdb_path = base + channel + '/' + database +'/pdb/';
    var playerFiles = fs.readdirSync(pdb_path);
    playerFiles.forEach(function (playerFile) {
      var pdbLines = fs.readFileSync(pdb_path + playerFile, 'utf8').match(/[^\r\n]+/g);
      pdbLines.forEach(function (pdbLine) {
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
  });
}

function gameConfiguration(channel) {
  smallBlind = gameConfigurations[channel][1];
  bigBlind = gameConfigurations[channel][2];
  smallBet = bigBlind;
  bigBet = 2 * bigBlind;
}

// Build a context of information that can be used for deciding on the next
// betting action
function createContext(hand, actionHistory, currentAction, bettingRound, potBeforeBettingAction, player) {
  var context = {};
  context.numberOfPlayers = hand[3];
  context.playerPosition = player;
  context.potBeforeBettingAction = potBeforeBettingAction;
  // Cards that are know in this bettingRound
  context.communityCards = [];
  switch (bettingRound) {
    case PREFLOP:
      context.bettingRound = 'preflop';
      break;
    case FLOP:
      context.bettingRound = 'flop';
      if (hand.length === 11) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
      }
      context.flop = {};
      context.flop.numberOfPlayers = hand[4].split('/')[0];
      context.flop.pot = hand[4].split('/')[1];
      break;
    case TURN:
      context.bettingRound = 'turn';
      if (hand.length === 12) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
        context.communityCards.push(hand[11]);
        context.flop = {};
        context.flop.numberOfPlayers = hand[4].split('/')[0];
        context.flop.pot = hand[4].split('/')[1];
        context.turn = {};
        context.turn.numberOfPlayers = hand[5].split('/')[0];
        context.turn.pot = hand[5].split('/')[1];
      }
      break;
    case RIVER:
      context.bettingRound = 'river';
      if (hand.length === 13) {
        context.communityCards.push(hand[8]);
        context.communityCards.push(hand[9]);
        context.communityCards.push(hand[10]);
        context.communityCards.push(hand[11]);
        context.communityCards.push(hand[12]);
        context.flop = {};
        context.flop.numberOfPlayers = hand[4].split('/')[0];
        context.flop.pot = hand[4].split('/')[1];
        context.turn = {};
        context.turn.numberOfPlayers = hand[5].split('/')[0];
        context.turn.pot = hand[5].split('/')[1];
        context.river = {};
        context.river.numberOfPlayers = hand[6].split('/')[0];
        context.river.pot = hand[6].split('/')[1];
      }
  }
  // Hole cards (if known)
  if (currentAction.length === 13) {
    context.holeCards = [currentAction[11], currentAction[12]];
  }
  // A shallow copy of the betting history is created because
  // the history will grow as we further process the hand
  context.bettingHistory = underscore.clone(actionHistory);
  return(context);
}

// Write poker actions in the form (action, context)
function createBettingAction(timeStamp, player, bettingAction, context) {
  // We are only interested in betting actions for which the hole cards are
  // known
  if (context.holeCards) {
    var entry = {};
    // db values refer to the original database files (keys in fact)
    entry.db = {};
    entry.db.timeStamp = timeStamp;
    entry.db.player = player;
    // class is the future we want to predict
    entry.class = bettingAction;
    // context is the history
    entry.context = context;
    // Store the entry
    classContextPairs.push(entry);
    console.log(JSON.stringify(entry, null, 2));
    numberOfBettingActions++;
  }
}

function replayBettingRound(timeStamp, pot, bettingRound) {
  numberOfBettingRounds++;
  var numberOfActivePlayers = 0;
  //timestamp      hand #     #players/starting potsize
  //          dealer    #play flop    turn    river  showdn     board
  //766303976   1   455  8  6/600   6/1200  6/1800  3/2400  3s Jc Qd 5c Ah
  var hand = hands[timeStamp];
  // Get the player actions of this hand and sort by player position
  var playerActions = actions[timeStamp].
    sort(function(a, b) {return (a[3] - b[3]);});

  // Set the betting amount according to betting round
  switch (bettingRound) {
    case PREFLOP:
    case FLOP:
      currentBettingAmount = smallBet;
      raiseAmount = smallBet;
      break;
    case TURN:
    case RIVER:
      currentBettingAmount = bigBet;
      raiseAmount = bigBet;
  }
  var actionHistory = [];
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
    potBeforeBettingAction = pot;
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
        bettingAction.playerPosition = index + 1;
        bettingAction.bettingAction = bettingActions[i];
        bettingAction.bettingAmount = 0;
        switch (bettingAction.bettingAction) {
          case '-': // no action; player is no longer contesting pot
            activePlayers[index] = false;
            break;
          case 'B': // blind bet (either small or big blind)
            if (smallBlindPlayed) { // this is big blind
              bettingAction.bettingAction = 'bigBlind';
              bettingAction.bettingAmount = bigBlind;
              currentBettingAmount = bigBlind;
            }
            else { // this is small blind
              bettingAction.bettingAction = 'smallBlind';
              bettingAction.bettingAmount = smallBlind;
              smallBlindPlayed = true;
            }
            break;
          case 'f': // fold
            bettingAction.bettingAction = 'fold';
            activePlayers[index] = false;
            break;
          case 'k': // check
            bettingAction.bettingAction = 'check';
            break;
          case 'b': // bet
            bettingAction.bettingAction = 'bet';
            bettingAction.bettingAmount = currentBettingAmount;
            break;
          case 'c': // call
            bettingAction.bettingAction = 'call';
            bettingAction.bettingAmount = currentBettingAmount - playerBets[index];
            break;
          case 'r': // raise
            bettingAction.bettingAction = 'raise';
            currentBettingAmount += raiseAmount;
            bettingAction.bettingAmount = currentBettingAmount - playerBets[index];
            break;
          case 'A': // all-in
            bettingAction.bettingAction = 'all-in';
            bettingAction.bettingAmount = action[8] - playerBets[index];
            break;
          case 'Q': // quits game
            bettingAction.bettingAction = 'quitGame';
            activePlayers[index] = false;
            break;
          case 'K': // kicked from game
            bettingAction.bettingAction = 'kickedFromGame';
            activePlayers[index] = false;
            break;
        }
        playerBets[index] += bettingAction.bettingAmount;
        pot += bettingAction.bettingAmount;
        var context = createContext(hand, actionHistory, action, bettingRound,
          potBeforeBettingAction, index + 1);
        createBettingAction(timeStamp, player, bettingAction, context);
        actionHistory.push(bettingAction);
      }
    });
    // Calculate number of players that see the end of the betting round, i.e.
    // did not fold, quit, etc.
    numberOfActivePlayers = 0;
    for (var j = 0; j < hand[3]; j++) {
      if (activePlayers[j]) {
        numberOfActivePlayers++;
      }
    }
    i++;
  } while (newBettingActionFound && (numberOfActivePlayers > 1));

  switch (bettingRound) {
    case PREFLOP:
      console.log('Preflop pot calculated: ' + numberOfActivePlayers + '/' + pot);
      potAccordingToDB = hand[4].split('/')[1];
      console.log('Preflop pot according to database: ' + hand[4]);
      break;
    case FLOP:
      console.log('Flop pot calculated: ' + numberOfActivePlayers + '/'+ pot);
      potAccordingToDB = hand[5].split('/')[1];
      console.log('Flop pot according to database: ' + hand[5]);
      break;
    case TURN:
      console.log('Turn pot calculated: ' + numberOfActivePlayers + '/' + pot);
      potAccordingToDB = hand[6].split('/')[1];
      console.log('Turn pot according to database: ' + hand[6]);
      break;
    case RIVER:
      console.log('River pot calculated: ' + numberOfActivePlayers + '/' + pot);
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
    replayBettingRound(timeStamp, pot, RIVER);
  });
}

function writeClassContextPairs(channel) {
  fs.writeFileSync(output_base + channel + '.json',
    JSON.stringify(classContextPairs, null, 2), 'utf8');
  console.log('writeClassContextPairs: wrote ' +
    classContextPairs.length + ' class context pairs');
}

gameConfiguration('holdem');
readPokerDB('holdem');
replayHands();
writeClassContextPairs('holdem');

console.log('Number of betting rounds: ' + numberOfBettingRounds);
console.log('Wrong calculated pots (each betting round): ' +
  numberOfWrongCalculatedPots);