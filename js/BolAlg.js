console.log('BolAlg.js');
// parsing statementss of propositional logic

/*
charCodes for special characters
 ! 33
 ∧63
 ¬ 65533
 */

// translate those, the rest is grouping

/* Basic operations

// Negation
//   ¬a
// = !a
// = 1 - a

// Conjunction
//   a ∧ b
// = a & b
// = a * b

// Disjunction
//   a ∨ b
// = a | b
// = a + b - (a * b)
*/

/* Derived operations

// Material conditional
//   a → b
// = (¬a ∨ b)
// = (!a | b)
// = ((1 - a) + b) - ((1 - a) * b)

// Exclusive OR
//   a ⊕ b
// = (a ∨ b) ∧ ¬(a ∧ b)
// = (a | b) & !(a & b)
// = (a + b - a * b) * (1 - (a * b))

// Biconditional (Equivalence)
//   a ↔ b
// = ¬(a ⊕ b) = ¬(a ∨ b) ∧ ¬(a ∧ b)
// = !(!(a | b) & !(a & b)
// = 1 - (1 - (a
*/

var BolAlg = function() { 'use strict'; return new BolAlg.init(); };

BolAlg = BolAlg.prototype = {

    statements: new Array(),

    /**
     * constructor
     * @return {void}
     */
    init: function() {},

/**
* Basic operations.
* Built in boolean/binary operations ()
*/

    /**
     * Negates given bool.
     * @param  {boolean} val A boolean value, thats being negated.
     * @return {boolean} negated value of {val} or null,if {val} is not boolean.
     */
    negate: function(val) { return (typeof val === 'boolean') ? !val : null; },

    /**
     * Conjunct two or more values.
     * @param  {Array.<boolean>} values Array with at least
     * two values that are being conjuncted.
     * @return {boolean} conjunction of all values[i] or null on any errors.
     */
    conjunct: function(values) {
        // return null if values is no Array
        //                   or values holds only one item
        if (!(values instanceof Array) | values.length < 1) { return null; }

        // return conjunction of both if values holds only two items
        if (values.length == 1) { return (values[0] & values[1]); }

        // otherwise initialize returnValue and loop the rest of values
        else { var retVal = values[0]; }
        for (var i = 1; i < values.length; i++) {
            retVal = retVal & values[i];
        }
        return Boolean(retVal);
    },

    /**
     * Disjunct two or more values.
     * @param  {Array.<boolean>} values Array with at least
     * two values that are being disjuncted.
     * @return {boolean} disjunction of all values[i] or null on any errors.
     */
    disjunct: function(values) {
        // return null if values is no Array
        //                   or values holds only one item
        if (!(values instanceof Array) | values.length < 1) { return null; }

        // return disjunction of both if values holds only two items
        if (values.length == 1) { return (values[0] | values[1]); }

        // otherwise initialize returnValue and loop the rest of values
        else { var retVal = values[0]; }
        for (var i = 1; i < values.length; i++) {
            retVal = retVal | values[i];
        }
        return Boolean(retVal);
    },

/**
 * Derived operations
 */

    /**
     * Calculates the material conditional of two or more values.
     * @param  {Array.<boolean>} values Array with at least two values.
     * @return {boolean} result of material condition over vales or null
     * on any errors.
     */
    matcond: function(values) {
        // return null if values is no Array
        //                   or values holds only one item
        if (!(values instanceof Array) | values.length < 1) { return null; }

        // return disjunction of both if values holds only two items
        if (values.length == 1) { return (!values[0] | values[1]); }

        // otherwise initialize returnValue and loop the rest of values
        else { var retVal = values[0]; }
        for (var i = 1; i < values.length; i++) {
            retVal = retVal & values[i];
        }
        return retVal;
    },

/**
 * Parsing
 */

    /**
     * String literals for logical operators.
     * @type {Object}
     */
    Operators: {
        CONJUNCT: '∧',
        DISJUNCT: '∨',
        NEGATE: '¬',

        isOperator: function(o) {
            for (var op in this)  {
                if (o === this[op])
                    return true;
            }
            return false;
        }
    },

 /**
  * Represents a broken down (by brackets) single statement.
  * @param  {String} expr Expression to evaluate.
  * @constructor
  */
    piece: function(expr) {
        this.expr = expr;
        this.evaluated = null;
        this.showInTable = true;
        this.rows = [
            {'id': 0, 'cell': [true, true]}/*,
            {'id': 1, 'cell': [false, true]},
            {'id': 2, 'cell': [true, false]},
            {'id': 3, 'cell': [false, false]}*/
        ];
        this.vars = {
            a: 0,
            b: 1,
            getValue: function(v, row) {
                return row.cell[this[v]];
            }
        };

        this.operator = '',
        // position of last operator in expression
        this.lop = -1;
        // next operator
        // this.no = 0;
        // value of last evaluation
        this.lasteval = null;

        // regular expression to search for operators
        // this.re = new RegExp('[∧∨]?(.*)([∧]+)(.*(?!\\())[∧∨]?');
        // Iterating over this to NOT use regular expressions.

        this.evaluate = function() {

            var matches = new Array();
            var stmts = BolAlg.statements;

            this.rows.forEach(function(row, idx, arr) {

                if (stmts.length > 0) {
                    var srch = '(' +
                        stmts[stmts.length - 1].expr +
                    ')';
                    var rplc = stmts[stmts.length - 1].evaluated;
                    this.expr = this.expr.replace(srch, rplc);
                
                console.log(this.expr);
            } else {

                    /*matches = this.re.exec(this.expr);
                    console.log(matches);

                    var opArray = new Array();
                    matches.shift();
                    while (matches.length > 0) {
                        if (this.vars.hasOwnProperty(matches[0])) {
                            opArray.push(this.vars.getValue(matches.shift(), row));
                        } else if (BolAlg.Operators.isOperator(matches[0])) {
                            this.operator = matches.shift();
                        } else {}
                    }
                    switch (this.operator) {
                        case BolAlg.Operators.CONJUNCT:
                            this.evaluated = Boolean(BolAlg.conjunct(opArray));
                            break;
                        case BolAlg.Operators.DISJUNCT:
                            this.evaluated = Boolean(BolAlg.disjunct(opArray));
                            break;
                        case BolAlg.Operators.NEGATE:
                            this.evaluated = Boolean(BolAlg.conjunct(opArray));
                            break;
                        default:
                            break;
                        }*/

                        // go through every character of current expression
                        this.expr = 'a∧b∧a∨a'; // DEBUG
                        for (var i = 0; i <= this.expr.length - 1; i++) {
                            switch (this.expr[i]) {
                                case BolAlg.Operators.CONJUNCT:

                                    // left side, 1st var in array
                                    var between = this.expr.slice(this.lop + 1, i);

                                    // update position of this operator
                                    // as last found operator
                                    this.lop = i;
                                    
                                    // ... are determined by the positions
                                    // of the last preceding (this.lop) or
                                    // next following operator
                                    var nop = this.getNOP();

                                    // right side, 2nd var in array
                                    this.expr.slice(i + 1, nop);

                                    console.log('expr: ' + this.expr);
                                    console.log('i: ' + i);
                                    console.log('nop:' + nop);
                                    console.log('between: ' + between);

                                    // reset i to position of next operator
                                    // leaving out the variable ('s characters)
                                    // inbetween.
                                    i = nop - 1;

                                    break;
                                case BolAlg.Operators.DISJUNCT:
                                    break;
                            }
                        }
                        throw 'expected stop';

                }
                console.log(this);
            }, this);
        };

        this.getNOP = function() {
            var r = this.expr.length - 1;
            var op = -1;
            for(operator in BolAlg.Operators) {
               if (typeof BolAlg.Operators[operator] === 'string') {
                    op = this.expr.indexOf(BolAlg.Operators[operator], this.lop +1);
                    r = (op < r && op != -1) ? op : r;
               }
            }
            return r;
        }
    },

    /**
     * Parse text input for boolean algebra.
     * @param  {String} text Text to parse for boolean algebra statementss.
     * @return {void}
     * @this BolAlg
     */
    parse: function(text) {

        // delete all whitespaces before, after and in text
        text = text.globalTrim();

        // as parts is inverted hirarchically filled,
        // meaning the last entry is the most inner, therefore
        // very first evaluated chain of operations and the first
        // entry being all operations, therefore the whole statements
        // we can initialize it now.
        var parts = [text];
        var openPos = new Array();
        var closePos = new Array();
        var btc = 0;
        var fob = -1;
        var lob = new Array();
        var lcb = 0;

        // get positions of every '(' and ')'
        for (var i = 0; i <= text.length - 1; i++) {
            console.log(i + ': ' + text[i]);
            switch (text[i]) {
                case '(':
                    openPos.push(i);
                    lob.push(i);
                    if (btc == 0) {
                        fob = i;
                        var lcbSlice = (lcb > 0) ? lcb + 1 : 0;
                        parts.push(text.slice(lcbSlice, fob));
                        console.log(text.slice(lcbSlice, fob));
                    }
                    btc = btc + 1;
                    break;
                case ')':
                    closePos.push(i);
                    var newPiece = new this.piece(text.slice(lob.pop() + 1, i));
                    newPiece.evaluate();
                    this.statements.push(newPiece);

                    btc = btc - 1;
                    lcb = i;
                    // reaching an outer bracket
                    // save inner statements
                    if (btc == 0) {
                        parts.push(this.statements);
                        this.statements = new Array();
                    }
                    break;
                default:
                    break;
            }
        }
        if (lcb != text.length - 1) {
            parts.push(text.slice(lcb + 1, text.length));
        }

        console.log(parts);
        console.log(this.statements);

        // throw a SyntaxError and exit, if
        // - more closing than opening brackets
        // - more opening than closing brackets
        if (openPos.length < closePos.length) {
            throw new SyntaxError("You're missing an opening bracket.");
        } else if (openPos.length > closePos.length) {
            throw new SyntaxError("You're missing a closing bracket.");
        }
        console.log('length: ' + openPos.length + ' | ' + closePos.length);
        closePos.reverse();
        for (var j = 0; j <= openPos.length - 1; j++) {
            console.log(openPos[j] + ' | ' + closePos[j]);
        }
    }

};
