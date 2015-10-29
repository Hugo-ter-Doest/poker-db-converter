/*
  Card class
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

var suites = ['Clubs', 'Spades', 'Diamonds', 'Hearts'];
var suitesAbbrev = ['c', 's', 'd', 'h'];

var TWO = 0;
var THREE = 1;
var FOUR = 2;
var FIVE = 3;
var SIX = 4;
var NINE= 7;
var TEN = 8;
var JACK = 9;
var QUEEN = 10;
var KING = 11;
var ACE = 12;
var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen',
  'King', 'Ace'];
var ranksAbbrev = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q',
  'K', 'A'];

function Card(suite, rank) {
  if (rank !== undefined) {
    this.suite = suites.indexOf(suite);
    this.rank = ranks.indexOf(rank);
  }
  else {
    this.suite = suitesAbbrev.indexOf(suite[1]);
    this.rank = ranksAbbrev.indexOf(suite[0]);
  }
}

Card.prototype.prettyPrint = function() {
  return(suites[this.suite] + ' ' + ranks[this.rank]);
};

module.exports = {
  TWO: TWO,
  THREE: THREE,
  FOUR: FOUR,
  FIVE: FIVE,
  SIX: SIX,
  NINE: NINE,
  TEN: TEN,
  JACK: JACK,
  QUEEN: QUEEN,
  KING: KING,
  ACE: ACE,
  ranks: ranks,
  suites: suites,
  Card: Card
};