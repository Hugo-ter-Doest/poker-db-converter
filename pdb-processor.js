

/**
 * Created by hugo.terdoest on 6-8-2015.
 */

var fs = require('fs');

var hdb_file = '';
var pdb_path = '';
var actionsFile = '';

var hands = {};
var actions = {};

// Read database files
function readPokerDB() {
  // Read and process hands database
  var hdbLines = readFileSync(hdb_file).match(/[^\r\n]+/g);
  hdbLines.forEach(function(hand) {
    var handCols = hand.split(/\s+/);
    var timeStamp = handCols.splice(0, 1);
    hands[timeStamp[0]] = handCols;
  });

  // Read and process user databases
  var playerFiles = fs.readdirSync(pdb_path);
  playerFiles.forEach(function(playerFile) {
    var pdbLines = readFileSync(playerFile).match(/[^\r\n]+/g);
    pdbLines.forEach(function(pdbLine) {
      var playerCols = pdbLine.split(/\s+/);
      timeStamp = playercols.splice(1,1);
      if (actions[timeStamp]) {
        actions.timeStamp.push(playerCols);
      }
      else {
        actions[timeStamp[0]] = playerCols;
      }
    });
  });
}

// Write poker actions in the form (action, context)
function printAction(timeStamp, player, action, context) {
  var action = {timeStamp: timeStamp,
    player: player,
    action: action,
    context: context
  };
  console.log(JSON.stringify(action));
}

function replayPreflop(timeStamp, actions) {
  // Points to the next player action to be executed
  actionPointer = new Array(actions.length);
  actionPointer.forEach(function(ptr, index) {
    actionPointer[index] = 0;
  });
  actions.forEach(function(a) {
    var playerActions = a[4];
    if (a[4]) {
      
    }
  });
}

// Replays the hand and writes player actions
function replayHand(timeStamp, hand) {
  var actions = actions[timeStamp];
  replayPreflop(timeStamp, actions);
  replayFlop(timeStamp, actions);
  replayTurn(timeStamp, actions);
  replayRivertimeStamp, actions);
}

function writeHands() {
  Object.keys(hands).forEach(function(timeStamp) {
    replayHand(timeStamp, hands[timeStamp]);
  });
}

readPokerDB();
writeHands();