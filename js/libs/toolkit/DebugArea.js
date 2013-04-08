/* 
 * Copyright (C) 2013 Raphael Beer
 *
 * This file is part of project.name.
 *
 * project.name is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * project.name is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with project.name (GPL3.txt).  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * DebugArea.js
 * Basic functions extending the usability of <textarea>; like
 *      print, printl
 *      
 * Its main focus is on shorthand debuging and testing.
 * @deprecated Completely handled by browsers javascript console, now.
 */
function DebugArea() {}

/*
 * Appends _text to the <textarea>
 * @param {string} _text, {Boolean} _timeTag
 * @returns void
 */
DebugArea.prototype.print = function(_text, _nowTag) {
    var _oldVal = $("#DBA_out").text();
    if(_nowTag) {
        $("#DBA_out").text(this.getNowTag() + _oldVal + _text);
    } else {
        $("#DBA_out").text(_oldVal + _text);
    }
};

/*
 * Appends _text to the <textarea>, preceeded by a time tag
 * and followed by a \n.
 * @param {string} _text
 * @returns void
 */
DebugArea.prototype.println = function(_text) {
    this.print(this.getNowTag() + _text + "\n");
};

/*
 * Appends _text to the <textarea>, followed by a \n
 * and optional preceeding time tag.
 * @param {string} _text, {Boolean} _nowTag
 * @returns void
 */
DebugArea.prototype.println = function(_text, _nowTag) {
    if(_nowTag) {
        this.print(this.getNowTag() + _text + "\n");
    } else {
        this.print(_text + "\n");
    }
};

DebugArea.prototype.clear = function() {
    $("#DBA_out").text("");
};

/*
 * Returns 'now' as formatted string: [hh:mm:ss:msms]
 * 
 * @returns {String}
 */
DebugArea.prototype.getNowTag = function() {
    var _now = new Date();
    return '[' + _now.toTimeString().substr(0,8) + '.' + _now.getMilliseconds() + '] ';
};

/*
 * by
 * IQ69 - We'll show you crazy!
 * http://www.iq6t9.de/
 * Raphael Beer <raphael.beer at gmx.de>
 * http://www.workofprogress.org/
 * 
 */
