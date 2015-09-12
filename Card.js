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

var ACE = 12;
var TWO = 0;
var THREE = 1;
var FOUR = 2;
var FIVE = 3;
var TEN = 8;
var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen',
  'King', 'Ace'];

function Card(suite, rank, isHoleCard) {
  this.suite = suites.indexOf(suite);
  this.rank = ranks.indexOf(rank);
  this.isHoleCard = isHoleCard;
}

Card.prototype.prettyPrint = function() {
  return(suites[this.suite] + ' ' + ranks[this.rank]);
};

module.exports = {
  ACE: ACE,
  TWO: TWO,
  THREE: THREE,
  FOUR: FOUR,
  FIVE: FIVE,
  TEN: TEN,
  ranks: ranks,
  suites: suites,
  Card: Card
};