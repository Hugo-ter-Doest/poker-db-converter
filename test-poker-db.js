
var classContextPairs = require('./data/holdem.json');

var holeCard1 = 'Jd';
var holeCard2 = '7h';

var nr = 0;
classContextPairs.forEach(function(pair) {
  //console.log(pair);
  if ((pair.context.holeCards.indexOf(holeCard1) > -1) && (pair.context.holeCards.indexOf(holeCard2) > -1)){
    console.log(JSON.stringify(pair, null, 2));
    nr++;
  }
});
console.log(nr);

