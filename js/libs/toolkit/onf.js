/*
 * Copyright (C) 2013 Raphael Beer
 *
 * This file is part of Aussagenlogik.
 *
 * Aussagenlogik is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Aussagenlogik is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Aussagenlogik (GPL3.txt).
 * If not, see <http://www.gnu.org/licenses/>.
 *
 * ! HOWEVER !
 * These are code-snippets I picked up or created (see @author notation)
 * over the years, so I consider all of this to be public property;
 * therefore I can and will not take credit for them ;).
 *
 */

/*
 * onf.js
 * Often needed functions.
 *
 * by
 * the greater whole ;D
 *
 */

/*
 * standard library extensions
 * ---------------------------------------
 * Number()
 */

/**
 * Checks a number whether to be of type Integer or not.
 * @return {Boolean} true if Number is an Integer, false on any decimal value.
 */
Number.prototype.isInteger = function() {
       return (this.toString().search(/^-?[0-9]+$/) === 0);
 };

/**
 * Converts any Integer to its binary representative.
 * Stored in an Boolean Array.
 * @return {Array.Boolean} Numbers binary representative.
 */
Number.prototype.toBinArray = function() {
  // Number (this.valueOf()) must be between -2147483648 and 2147483647
  if (this.valueOf() > 0x7fffffff || this.valueOf() < -0x80000000) {
      throw new TypeError('toBinArray: ' + this.valueOf() + ' is out of range');
  }
  for (var nShifted = this.valueOf(), aFromMask = [];
        nShifted;
        aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
  return aFromMask;
};

/*
 * String()
 */

/**
 * Repeat given String num times. Like pythons string*num operator.
 * @param {Number} num Multiplier for string.
 * @return {String} Given string repeated num times.
 */
String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
};

/**
 * Trims every space within a string.
 * (Beginning and end, as well.)
 * @return {String} Globally trimmed String.
 * @author Raphael Beer
 */
String.prototype.globalTrim = function() {
    var r = new String();
    for (var i = 0; i <= this.length - 1; i++) {
        if (this[i] != ' ') r = r + this[i];
    }
    return r;
};

if(!('contains' in String.prototype))
  String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };

/*
 * Boolean()
 */

/**
 * Repeat Binary value. Stored in Array.
 * @param {Number} _num Multiplier for Boolean value.
 * @return {Array.Boolean} Array with _num repetitions of Boolean value.
 * @author Raphael Beer
 */
Boolean.prototype.repeat = function(_num) {

    var _bolArray = new Array();
    var _inVal = this.valueOf();
    var i = 0;

    for (i = 0; i < _num; i++) {
        _bolArray[i] = _inVal;
    }

    return _bolArray;
};
