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

/*
 * buttonHandler.js
 * description goes here...
*/
var menuOpen = false;
var keepOpen = false;
var sticky = false;

function async(fn, callback) {
    setTimeout(function() {
        var id = fn($('#spin_tVars').spinner("value"));
        callback(id);
    }, 0);
}



$('document').ready(function() {
    
    sticky = document.getElementById('menu_sticky').checked;
    if (sticky) $('#menuOpener').addClass('menuCloser');
    
    $('#menu_sticky').click(function() {
        sticky = $(this).is(':checked');
        console.log(sticky);
    });

    $('#menuOpener').click(function() {
        if (sticky) return;

        var mtabs = $('#menu_tabs');
        var menu = $('#menu');
        if (menuOpen) {
            menu.animate({ left: '-325px'});
            mtabs.animate({left: '-20px'});
            $(this).removeClass('menuCloser');
        } else {
            menu.animate({ left: '0px'});
            mtabs.animate({left: '0px'});
            $(this).addClass('menuCloser');
        }
        menuOpen = !menuOpen;
    });

    $('#menu').mouseleave(function() {
        if (sticky) return;
        if (!keepOpen) {
            $(this).animate({ left: '-325px'});
            $('#menu_tabs').animate({left: '-20px'});
            $('#menuOpener').removeClass('menuCloser');
            menuOpen = !menuOpen;
        }
    });

    $('#menu').mouseenter(function() {
        if (sticky) return;
        keepOpen = keepOpen ? !keepOpen : keepOpen;
    });

    $('#btn_addTable').click(function() {

        var tVars = $('#spin_tVars').spinner("value");
        if (tVars === null) {
            // request keepOpen for menu
            keepOpen = true;
            // show dialog
            $('#dialog_spin_tVars').dialog('open');
            // skip the rest
            return;
        }

        var cb = function(id) {
            // draw new table to workspace
            console.log('callback: ' + id);
            PropLogic.drawTable(id);
        };

        // add new table, receive its ID
        async(PropLogic.addTable, cb);
    });

    $('#btn_AND').click(function() {
        var ID = PropLogic.getActiveId();
        PropLogic.negate(ID);
    });

});

/*
 * by
 * IQ69 - We'll show you crazy!
 * http://www.iq6t9.de/
 * Raphael Beer <raphael.beer at gmx.de>
 * http://www.workofprogress.org/
 * 
 */