/*
  A priori probabilities of hands
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

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 2 card probabilities
// Total number of combinations is C(52, 2) = 1,326
//Pair                                        78/1326 = 0.0588
//Suited cards                                312/1326 = 0.2353
//Unsuited cards non paired                   936/1325 = 0.7059
//Suited connectors                           (13 x 4) / 1326 = 0.0392
//Connected cards                             (13 x 4 x 4) / 1326 = 0.156

//AKs (or any specific suited cards) 	        0.00302 	331 : 1
//AA (or any specific pair) 	                0.00452 	221 : 1
//AKs, KQs, QJs, or JTs (suited cards) 	      0.0121 	  81.9 : 1
//AK (or any specific non-pair incl. suited) 	0.0121 	  81.9 : 1
//AA, KK, or QQ 	                            0.0136 	  72.7 : 1
//AA, KK, QQ or JJ 	                          0.0181 	  54.3 : 1
//Suited cards, jack or better 	              0.0181 	  54.3 : 1
//AA, KK, QQ, JJ, or TT 	                    0.0226 	  43.2 : 1
//Suited cards, 10 or better 	                0.0302 	  32.2 : 1
//Suited connectors 	                        0.0392 	  24.5 : 1
//Connected cards, 10 or better 	            0.0483 	  19.7 : 1
//Any 2 cards with rank at least queen 	      0.0498 	  19.1 : 1
//Any 2 cards with rank at least jack 	      0.0905 	  10.1 : 1
//Any 2 cards with rank at least 10 	        0.143 	  5.98 : 1
//Connected cards (cards of consecutive rank) 0.157 	  5.38 : 1
//Any 2 cards with rank at least 9 	          0.208 	  3.81 : 1
//Not connected nor suited, at least one 2-9 	0.534 	  0.873 : 1
var twoCardHandTotalCombinations = 1326;
var twoCardHandFreq = [
  // HIGHCARD
  // Unsuited cards non paired - CONNECTED - CONNECTEDANDSUITED
  936 - 208 - 52,
  // PAIR
  78,
  // SUITEDCARDS
  312,
  // CONNECTEDCARDS
  208,
  // CONNECTEDANDSUITED
  52
];

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 5 card probabilities
// Total number of combinations is C(52, 5) = 2,598,960
// hand 	        number 	    Probability
// Royal flush    4 	        0.00000154
// Straight flush 36 	        0.0000139
// 4-of-a-kind 	  624 	      0.000240
// Full house 	  3,744 	    0.001441
// Flush 	        5,108 	    0.001965
// Straight 	    10,200 	    0.003925
// 3-of-a-kind 	  54,912 	    0.021128
// Two pairs 	    123,552 	  0.047539
// Pair 	        1,098,240 	0.422569
// High card 	    1,302,540 	0.501177
var fiveCardHandTotalCombinations = 2598960;
var fiveCardHandFreq = [
  // HIGHCARD
  1302540,
  // PAIR
  1098240,
  // TWOPAIR
  123552,
  // THREEOFAKIND
  54912,
  // STRAIGHT
  10200,
  // FLUSH
  5108,
  // FULLHOUSE
  3744,
  // FOUROFAKIND
  624,
  // STRAIGHTFLUSH
  36,
  // ROYALFLUSH
  4
];

// Based on http://people.math.sfu.ca/~alspach/comp19/
// 20358520
var sixCardHandTotalCombinations = C(52, 6);
var sixCardHandFreq = [
  // HIGHCARD
  6612900,
  // PAIR
  // Possible pairs, 5 cards are freely chosen, minus three of a kind and four of a kind
  9730740,
  // TWOPAIR
  2532816,
  // THREEOFAKIND
  732160,
  // STRAIGHT
  361620,
  // FLUSH
  205792,
  // FULLHOUSE
  165984,
  // FOUROFAKIND
  14664,
  // STRAIGHTFLUSH
  1844 - 4 * 47,
  // ROYALFLUSH
  // There are four Royal Flushes, sixth card is free 52 - 5
  4 * 47
];

// Based on: https://en.wikipedia.org/wiki/Poker_probability
// 7 card probabilities
// Total number of combinations is 133,784,560
// hand 	        number 	    Probability
// Royal flush    4,324 	    .000032
// Straight flush 37,260 	    .000279
// 4-of-a-kind 	  224,848 	  .0017
// Full house 	  3,473,184 	.026
// Flush 	        4,047,644 	.030
// Straight 	    6,180,020 	.046
// 3-of-a-kind 	  6,461,620 	.048
// Two pairs 	    31,433,400 	.235
// Pair 	        58,627,800 	.438
// High card 	    23,294,460 	.174
var sevenCardHandTotalCombinations = 133784560;
var sevenCardHandFreq = [
  // HIGHCARD
  23294460,
  // PAIR:
  58627800,
  // TWOPAIR
  31433400,
  // THREEOFAKIND
  6461620,
  // STRAIGHT
  6180020,
  // FLUSH
  4047644,
  // FULLHOUSE
  3473184,
  // FOUROFAKIND
  224848,
  // STRAIGHTFLUSH
  37260,
  // ROYALFLUSH
  4324
];

// Binomial coefficient
function C(n, k) {
  var coeff = 1;
  for (var x = n - k + 1; x <= n; x++) {
    coeff *= x;
  }
  for (x = 1; x <= k; x++) {
    coeff /= x;
  }
  return coeff;
}

exports.rankFrequency = function(nrCards, rank) {
  switch (nrCards) {
    case 2:
      return twoCardHandFreq[rank];
      break;
    case 5:
      return fiveCardHandFreq[rank];
      break;
    case 6:
      return sixCardHandFreq[rank];
      break;
    case 7:
      return sevenCardHandFreq[rank];
      break;
  }
};

exports.totalCombinations = function(nrCards) {
  switch (nrCards) {
    case 2:
      return twoCardHandTotalCombinations;
      break;
    case 5:
      return fiveCardHandTotalCombinations;
      break;
    case 6:
      return sixCardHandTotalCombinations;
      break;
    case 7:
      return sevenCardHandTotalCombinations;
      break;
  }
};

exports.rankProbability = function(nrCards, rank) {
  switch (nrCards) {
    case 2:
      return twoCardHandFreq[rank] / twoCardHandTotalCombinations;
      break;
    case 5:
      return fiveCardHandFreq[rank] / fiveCardHandTotalCombinations;
      break;
    case 6:
      return sixCardHandFreq[rank] / sixCardHandTotalCombinations;
      break;
    case 7:
      return sevenCardHandFreq[rank] / sevenCardHandTotalCombinations;
      break;
  }
};