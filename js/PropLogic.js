var PropLogic = function() { 'use strict'; return new PropLogic.init(); };
var TruthTable = function(tVars) { 'use strict'; return new TruthTable.init(tVars); };
var JQGridFeed = function() { 'use strict'; return new JQGridFeed(); };

PropLogic = PropLogic.prototype = {

    tableData: new Array(),
    promises: new Array(),
    debug: true,

    //constructor
    init: function() {
        'use strict';

        // setting up menu
        var spinner = $('#spin_tVars').spinner({min: 1});
        spinner.spinner("value", 2);

        // dialogs
        $( "#dialog_spin_tVars" ).dialog({
            autoOpen: false,
            resizable: false,
            height:170,
            width: 290,
            modal: true,
            closeOnEscape: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    },

    addTable: function(tVars) {
        'use strict';
        PropLogic.tableData.push(TruthTable.init(tVars));
        return PropLogic.tableData.length - 1;
    },

    /*
     * Draws table 
     * 
     * @depends this.gridObject
     * @returns {Boolean}
     */
    drawTable: function(id) {
        "use strict";

        //create Dom Object
        this.createDomTable(id);

        // get table element
        // this.tables[id] = $("#tTable-" + id);
        var grid = $("#tTable-" + id);
        
        // unload possible present data
        // TODO: - check if there is any data
        //             - somehow this prevents a directly following
        //               init of new gridObject!
        //               works on 2nd click (when first object has been cleared!?)
        // grid.jqGrid('GridUnload');

        // adding real close button
        /*var temp = $("")
         .addClass('ui-jqgrid-titlebar-close HeaderButton')
         .click (function () {
               $(this).parents ('.ui-jqgrid').remove ();
         })
         .hover(
           function() {$(this).addClass('ui-state-hover');},
               function() {$(this).removeClass('ui-state-hover');}
             ).append (" ");
         var dingens = $('#gbox_tTable-'+ id + '.ui-jqgrid-titlebar-close');
         dingens.before (temp);*/

        // assign new data to grid
        grid.jqGrid(this.tableData[id]);

        // set up pager (navigation bar at bottom)
        grid.jqGrid('navGrid',
                            '#tTablePager-' + id,
                            {edit:false,add:false,del:false});

        // make new table draggable
        PropLogic.makeDraggable(id);

        // set new table immediately active
        PropLogic.setActiveId(id);
    },

    redrawTable: function(id) {
        var grid = $("#tTable-" + id);
        console.log(grid);
        grid.jqGrid('GridDestroy');
        PropLogic.drawTable(id);
    },

    createDomTable: function(id) {
        var ws = document.getElementById("tTableWorkspace");
        var container = document.createElement('div');
        container.id = "tTableContainer-" + id;

        /*
        <table id="tTable-0"></table>
         */
        var table = document.createElement('table');
        table.id = "tTable-" + id;
        container.appendChild(table);

        /*
        <div id="tTablePager"></div>
         */
        var pager = document.createElement('div');
        pager.id = "tTablePager-" + id;
        container.appendChild(pager);

        ws.appendChild(container);
    },

    makeDraggable: function(id) {
        //
        // Make the window draggable.
        //
        $('#gbox_tTable-' + id).draggable ({
            handle:"div.ui-jqgrid-titlebar",
            start: function () {
                $(".ui-jqgrid").removeClass ('ui-jqgrid-active');
                $(this).addClass ('ui-jqgrid-active');
                console.log(PropLogic.getActiveId());
            }
        }).click (function () {
                $(".ui-jqgrid").removeClass ('ui-jqgrid-active');
                $(this).addClass ('ui-jqgrid-active');
        }).css ('position', 'absolute');
    },

    makeResizable: function(id) {
        //
        // Make the grid resizable.
        //
        var node = $('#gbox_tTable-'+ id);
        //node.jqGrid('gridResize');
        node.jqGrid('gridResize', {minWidth:   350,
    minHeight:  150,
    stop:
        function (grid, ev, ui) {
            //
            // There seems to be an issue with resizing the grid so I added
            // this code to remove the "height" style.
            //
            $(grid.srcElement).parent ().css ("height", null);
        }}
      );
    },

    getActiveId: function() {
        var nodeID = $('.ui-jqgrid-active').attr('id');
        return nodeID.slice(nodeID.search('-') + 1);
    },

    setActiveId: function(id) {
        console.log('setting id: ' + id);
        $(".ui-jqgrid").removeClass ('ui-jqgrid-active');
        $('#gbox_tTable-' + id).addClass ('ui-jqgrid-active');
    },

    negate: function(id) {
        var rows = PropLogic.tableData[id].datastr.rows,
              colNames = PropLogic.tableData[id].datastr.colNames,
              colModel = PropLogic.tableData[id].datastr.colModel,
              tmpModel = null,
              cell = null,
              cellen = 0;

        for (var i = 0; i < rows.length; i++) {
            cell = rows[i].cell;
            cellen = cell.length;
            for (var j = 0; j < cellen; j++) {
                if (i === 0) {
                    tmpModel = colModel[j];
                    tmpModel.index = '!' + colNames[j];
                    tmpModel.name = '!' + colNames[j];

                    colModel.push(tmpModel);
                    colNames.push('!' + colNames[j]);
                }
                cell.push(!cell[j]);
            }
        }

        // redraw updated table
        PropLogic.redrawTable(id);
    }
};

var JQGridFeed = {
    varNum: 0,
    colNames: null,
    colModel: null,
    rowsArray: null,
    contentObject: null,
    gridObject: null,
    jsonObject: null,
    id: 0
};

TruthTable = TruthTable.prototype = {

    gridFeed: null,

    //constructor
    init: function(tVars) {

        // get new JQGridFeed object,
        // that's passed to jqGrid()
        this.gridFeed = Object.create(JQGridFeed);
        console.log(this.gridFeed);
        // create ID
        // (simply next index in PropLogic.tableData)
        this.gridFeed.id = PropLogic.tableData.length;

        // if tVars is an array:
        // values of that array are
        // handled as variables names
        if (tVars instanceof Array) {
            this.gridFeed.varNum = tVars.length;
            this.gridFeed.colNames = tVars;
        }
        // if tVars is an integer:
        // it's assumed, that tVars\d variables are requested;
        // their names are generated
        else if (typeof tVars === 'number') {
            this.gridFeed.varNum = tVars;
            this.gridFeed.colNames = [];
            for (i = 0; i < this.gridFeed.varNum; i++) {
                this.gridFeed.colNames[i] = String.fromCharCode(97 + i);
            }
        }
        else
            return;

        this.gridFeed.colModel = this.getColModel();
        this.gridFeed.rowsArray = this.getRowsArray();
        this.gridFeed.contentObject = this.getContentObject();
        this.gridFeed.gridObject = this.getGridObject('', '#tTablePager-' + this.gridFeed.id);

        this.gridFeed.jsonObject = this.getJSObject();

        console.log(this.gridFeed.varNum);
        console.log(this.gridFeed.colNames);
        console.log(this.gridFeed.colModel);
        console.log(this.gridFeed.rowsArray);
        console.log(this.gridFeed.contentObject);
        console.log(this.gridFeed.gridObject);
        console.log(this.gridFeed.jsonObject);

        return this.gridFeed.gridObject;
    },

     /* Creates Array for colModel
     *
     * @depends this.gridFeed.colNames, this.gridFeed.varNum
     * @returns {Array}
     */
    getColModel: function() {
        var _colArray = new Array();
        var _colObject;

        for (i = 0; i < this.gridFeed.varNum; i++) {
            _colObject = new Object();
            _colObject.name = _colObject.index = this.gridFeed.colNames[i];
            _colObject.editable = false;
            _colObject.hidden = false;
            _colObject.resizable = true;
            _colObject.sortable = true;
            _colObject.width = 40;

            _colArray.push(_colObject);
        }
        return _colArray;
    },

    /*
     * Creates Array for rows in this.gridFeed.jsonObject
     *
     * @depends this.gridFeed.varNum
     * @returns {Array}
     */
    getRowsArray: function() {
        var _jsObjRows = new Array();
        var _jsRowObj;
        var _row, _fillNum;
        var _forEnd = Math.pow(2, this.gridFeed.varNum) - 1;

        for (var i = 0; i <= _forEnd; i++) {

            _row = i.toBinArray();
            _jsRowObj = new Object;

            _fillNum = this.gridFeed.varNum - _row.length;
            if (_fillNum > 0) {
                _row = _row.concat(false.repeat(_fillNum));
            }

            _jsRowObj.id = i;
            _jsRowObj.cell = _row;
            _jsObjRows.push(_jsRowObj);
        }

        return _jsObjRows;
    },

    /*
     * Creates Object for jqGrid init
     *
     * @depends this.gridFeed.colModel, this.gridFeed.colNames
     * @returns {Object}
     */
    getGridObject: function(_url, _pager) {

        var _gridObj = new Object();

        // switch loading the json data
        // - from Object (_url is empty)
        // - from File (_url has value)
        if (!_url) {
            _gridObj.datatype = 'jsonstring';
            _gridObj.datastr = this.gridFeed.contentObject;
        } else {
            _gridObj.url = _url;
            _gridObj.datatype = 'json';
        }

        _gridObj.mtype = 'GET';
        _gridObj.colNames = this.gridFeed.colNames;
        _gridObj.colModel = this.gridFeed.colModel;
        _gridObj.pager = _pager;
        _gridObj.rowNum = 64;
        _gridObj.rowList = [4, 64, 128, 2048];
        _gridObj.sortname = this.gridFeed.colNames[0];
        _gridObj.sortorder = 'desc';
        _gridObj.viewrecords = true;
        _gridObj.width = 550;
        _gridObj.height = 500;
        _gridObj.caption = 'TruthTable 2x' + this.gridFeed.varNum.toString();

        return _gridObj;
    },

     /*
     * Creates the contentObject.
     * Its 'JSON.stringify'ed version will be fed to jqGrid.
     *
     * @depends this.gridFeed.rowsArray, this.gridFeed.colNames, this.gridFeed.colModel
     * @returns {Object}
     */
    getContentObject: function() {

        var _contentObj = new Object();
        _contentObj.total = 1;
        _contentObj.page = 1;
        _contentObj.records = this.gridFeed.rowsArray.length;
        _contentObj.colNames = this.gridFeed.colNames;
        _contentObj.colModel = this.gridFeed.colModel;
        _contentObj.rows = this.gridFeed.rowsArray;

        return _contentObj;
    },

    /*
     * Creates the jsonObject.
     *
     * @depends this.gridFeed.rowsArray, this.gridFeed.gridObject, this.gridFeed.colNames, this.gridFeed.colModel
     * @returns {Object}
     */
    getJSObject: function() {

        var _jsObj = new Object();
        _jsObj.total = 1;
        _jsObj.page = 1;
        _jsObj.records = this.gridFeed.rowsArray.length;
        _jsObj.gridObject = this.gridFeed.gridObject;
        _jsObj.colNames = this.gridFeed.colNames;
        _jsObj.colModel = this.gridFeed.colModel;
        _jsObj.rows = this.gridFeed.rowsArray;

        return _jsObj;
    },
};

PropLogic.init();
