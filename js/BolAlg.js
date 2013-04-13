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

var BolAlg = function(tt) { 'use strict'; return new BolAlg.init(tt); };

BolAlg = BolAlg.prototype = {

    statements: new Array(),
    ttObject: null,
    ttId: null,

    /**
     * Constructor
     * @param {TruthTable} tt TruthTable Object to work with.
     * @return {void}
     * @constructor
     */
    init: function(tt) {
        this.ttObject = tt;
        this.ttId = tt.pager.match('[0-9]+$')[0];
        return;
    },

    updateTableData: function() {
        var rows = this.ttObject.datastr.rows,
              colNames = this.ttObject.datastr.colNames,
              colModel = this.ttObject.datastr.colModel,
              tmpModel = null,
              cell = null,
              cellen = 0;

    },
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
        if (!(values instanceof Array) || values.length == 1) { return null; }

        // return conjunction of both if values holds only two items
        if (values.length == 2) { return Boolean(values[0] & values[1]); }

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
        if (!(values instanceof Array) || values.length == 1) { return null; }

        // return disjunction of both if values holds only two items
        if (values.length == 2) { return Boolean(values[0] | values[1]); }

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
        if (!(values instanceof Array) || values.length == 1) { return null; }

        //    a → b
        // = (¬a ∨ b)
        return Boolean(!values[0] | values[1]);
    },

    eor: function(values) {
        // return null if values is no Array
        //                   or values holds only one item
        if (!(values instanceof Array) || values.length == 1) { return null; }

        //   a ⊕ b
        // = (a ∨ b) ∧ ¬(a ∧ b)
        return Boolean((values[0] | values[1]) & !(values[0] & values[1]));
    },

    bicond: function (values) {
        // return null if values is no Array
        //                   or values holds only one item
        if (!(values instanceof Array) || values.length == 1) { return null; }

        //   a ↔ b
        // = ¬(a ⊕ b)
        // = ¬((a ∨ b) ∧ ¬(a ∧ b))
        return Boolean(!((values[0] | values[1]) & !(values[0] & values[1])));
    },

/**
 * Parsing
 */

    /**
     * String literals for logical operators.
     * @type {Object}
     * @constructor
     */
    Operators: {
        CONJUNCT: '∧',
        DISJUNCT: '∨',
        EOR: '⊕',
        MATCOND: '→',
        BICOND: '↔',
        NEGATE: '¬',

        isOperator: function(o) {
            for (var op in this) {
                if (o === this[op])
                    return true;
            }
            return false;
        }
    },

 /**
  * Represents a broken down (by brackets) single statement.
  * Will be displayed as seperate column in truth-table (showInTable)
  * @param  {String} expr Expression to evaluate.
  * @constructor
  */
    piece: function(expr) {
        this.expr = this.wexpr = expr;
        this.evaluated = null;
        this.showInTable = true;
        /*this.rows = [
            {'id': 0, 'cell': [true, true]},
            {'id': 1, 'cell': [false, true]},
            {'id': 2, 'cell': [true, false]},
            {'id': 3, 'cell': [false, false]}
        ];*/
        this.rows = BolAlg.ttObject.datastr.rows;
        /*this.vars = {
            a: 0,
            b: 1,
            getValue: function(v, row) {
                return (v == 'false') ? false :
                            (v == 'true') ? true : row.cell[this[v]];
            }
        };*/
        this.vars = BolAlg.ttObject.datastr.colNames;
        this.getVarValue = function (v, row) {
            var idxInCell = this.vars.indexOf(v);
            return (v == 'false') ? false :
                        (v == 'true') ? true :
                        row.cell[idxInCell];
        };
        

        // position of last operator in expression
        this.lop = -1;
        // next operator
        // this.no = 0;
        // value of last evaluation
        this.lasteval = null;
        // operation (function) in use
        this.oiu = null;
        // number of (bracketed) patterns replaced
        this.bpr = 1;

        this.evaluate = function(wexpr) {

            var matches = new Array();
            var stmts = BolAlg.statements;

            this.rows.forEach(function(row, idx, arr) {
                if (typeof wexpr === 'string') {
                    this.wexpr = wexpr;
                } else if (stmts.length > 0) {
                    // (still) got some brackets in wexpr?
                    while (this.wexpr.indexOf('(') > -1) {
                        var srch = '(' +
                            stmts[stmts.length - this.bpr].expr +
                        ')';
                        var rplc = stmts[stmts.length - this.bpr].evaluated;
                        this.wexpr = this.wexpr.replace(srch, rplc);

                        // increment number of replaced
                        // bracketed statements
                        this.bpr += 1;
                        console.log(this.wexpr);
                    }
                }
                // go through every character of current expression
                for (var i = 0; i <= this.wexpr.length - 1; i++) {
                    switch (this.wexpr[i]) {
                        case BolAlg.Operators.CONJUNCT:
                            this.oiu = BolAlg.conjunct;
                            break;
                        case BolAlg.Operators.DISJUNCT:
                            this.oiu = BolAlg.disjunct;
                            break;
                        case BolAlg.Operators.EOR:
                            this.oiu - BolAlg.eor;
                            break;
                        case BolAlg.Operators.MATCOND:
                            this.oiu = BolAlg.matcond;
                            break;
                        case BolAlg.Operators.BICOND:
                            this.oiu = BolAlg.bicond;
                            break;
                        default:
                            continue;
                            break;
                    }
                    // left side, 1st var in array
                    if (this.lasteval == null) {
                        var left = this.wexpr.slice(this.lop + 1, i);
                        if (left[0] == BolAlg.Operators.NEGATE) {
                            left = left.slice(1, left.length);
                            var oArray = [!this.getVarValue(left, row)];
                        } else {
                            var oArray = [this.getVarValue(left, row)];
                        }
                    } else {
                        oArray.push(this.lasteval);
                    }

                    // update Position of this operator
                    // as Last found Operator
                    this.lop = i;

                    // Position of Next (following) Operator
                    var nop = this.getNOP();

                    // right side, 2nd var in array
                    var right = this.wexpr.slice(i + 1, nop);
                    if (right[0] == BolAlg.Operators.NEGATE) {
                        right = right.slice(1, right.length);
                        oArray.push(!this.getVarValue(right, row));
                    } else {
                        oArray.push(this.getVarValue(right, row));
                    }

                    this.lasteval = this.oiu(oArray);

                    // break out of for-loop
                    // if no new operator is found after current
                    if (nop == this.wexpr.length) {
                        // knowing, that this was the final operator
                        // we can be sure, there won't be another
                        // evaluation (for this 'piece'),
                        // so lasteval becomes our final result
                        this.evaluated = this.lasteval;
                        // reset lasteval so next row iteration gets
                        // a fresh start
                        this.lasteval = null;
                        // reset value Array
                        oArray.length = 0;
                        // reset Last Operator Position
                        this.lop = -1;
                        // reset Operation In Use
                        this.oiu = null;
                        break;
                    }

                    // reset value Array
                    oArray.length = 0;

                    // reset i to position of next operator
                    // leaving out the variable ('s characters)
                    // inbetween.
                    i = nop - 1;
                }
                row.cell.push(this.evaluated);
                console.log(this);
            }, this);
            //throw 'exp stop';
        };

        this.getNOP = function() {
            var r = this.wexpr.length;
            var op = -1;
            for (operator in BolAlg.Operators) {
               if (typeof BolAlg.Operators[operator] === 'string' &&
                    operator != 'NEGATE') {
                    op = this.wexpr.indexOf(
                        BolAlg.Operators[operator],
                        this.lop + 1
                    );
                    r = (op != -1 && op < r) ? op : r;
               }
            }
            return r;
        };
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
        /**
         * Brackets To Close
         * Gets updated, every time a bracket (open +1, close -1) is
         * found.
         * Initialized with -1, to determine, if there are no brackets, at all.
         * @type {Number}
         */
        var btc = -1;
        var fob = -1;
        var lob = new Array();
        var lcb = 0;

        // get positions of every '(' and ')'
        for (var i = 0; i <= text.length - 1; i++) {
            console.log(i + ': ' + text[i]);
            switch (text[i]) {
                case '(':
                    btc = (btc == -1) ? 0 : btc;
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
                    var stmt = text.slice(lob.pop() + 1, i);
                    var newPiece = new this.piece(stmt);
                    TruthTable.addColumn(this.ttObject, stmt);
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

        if (btc == -1) {
            parts[1] = parts[0];
            lcb = text.length - 1;
        }

        if (lcb != text.length - 1) {
            parts.push(text.slice(lcb + 1, text.length));
        }

        // phew, all that work; for?
        // exactly this:
        // concatenate all results and evaluate
        var finalStatement = new String();
        for (var i = 1; i < parts.length; i++) {
            if (typeof parts[i] === 'string') {
                finalStatement = finalStatement + parts[i];
            } else if (parts[i] instanceof Array) {
                var stmt = parts[i][parts[i].length - 1].evaluated;
                finalStatement = finalStatement + stmt;
            }
        }
        TruthTable.addColumn(this.ttObject, finalStatement);
        var finalPiece = new this.piece(parts[0]);
        finalPiece.evaluate(finalStatement);
        console.log(parts);
        console.log(finalStatement);
        console.log(finalPiece);

        // done and done...
        // update TruthTable
        PropLogic.redrawTable(this.ttId);

        // throw a SyntaxError and exit, if
        // - more closing than opening brackets
        // - more opening than closing brackets
        if (openPos.length < closePos.length) {
            throw new SyntaxError("You're missing an opening bracket.");
        } else if (openPos.length > closePos.length) {
            throw new SyntaxError("You're missing a closing bracket.");
        }
    }

};
