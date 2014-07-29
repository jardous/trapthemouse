/*
Copyright 2014 Jiri Popek

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var maxRows = 11; // number of board rows
var maxColumns = 11; // number of board columns
var minTraps = 11; // initial number of traps

var MAX_DISTANCE = 1000;
var MAX_NEIGHBORS = 6;

var mouseInitialRow = Math.floor(maxRows / 2);
var mouseInitialColumn = Math.floor(maxColumns / 2);

var newGameComponent = Qt.createComponent("ButtonNew.qml");
var quitGameComponent = Qt.createComponent("ButtonQuit.qml");
var mouseComponent = Qt.createComponent("Mouse.qml");
var fieldComponent = Qt.createComponent("Field.qml");
var flashTextComponent = Qt.createComponent("FlashText.qml");
var flashText;

var mouse;
// 2D array of all fields [row][column] = [maxRows][maxColumns]
var fields;

function resizeBoard() {
    //TODO
}

function initGame() {
    if (flashText) flashText.destroy();
    boardCanvas.gameOver = false;
    // remove previously created fields
    if (fields) {
        for (var row = 0; row < fields.length; row++) {
            for (var column = 0; column < fields[row].length; column++) {
                fields[row][column].destroy();
            }
        }
    }
    
    // create fields
    fields = new Array(maxRows);
    for (var row = 0; row < maxRows; row++) {
        fields[row] = new Array(maxColumns);
        for (var column = 0; column < maxColumns; column++) {
            var field = fieldComponent.createObject(boardCanvas);
            field.row = row;
            field.column = column;
            
            if (row == 0 || column == 0 || row == (maxRows - 1) || column == (maxColumns - 1)) {
                field.source = "images/cheese.svg";
                field.isEscape = true;
            }
            
            fields[row][column] = field;
        }
    }
    
    // create New Game button
    var btn_new = newGameComponent.createObject(boardCanvas);//, {"row": 0, "column": 0});
    fields[0][0].destroy();
    fields[0][0] = btn_new;
    // create Quit button
    var btn_quit = quitGameComponent.createObject(boardCanvas);//, {"row": maxRows-1, "column": 0});
    btn_quit.row = maxRows - 1;
    fields[maxRows-1][0].destroy();
    fields[maxRows-1][0] = btn_quit;
    
    // create mouse
    mouse = mouseComponent.createObject(boardCanvas);
    mouse.row = mouseInitialRow;
    mouse.column = mouseInitialColumn;
    fields[mouseInitialRow][mouseInitialColumn].destroy();
    fields[mouseInitialRow][mouseInitialColumn] = mouse;
    
    // place the marked fields
    var markedFieldCount = minTraps;
    while (markedFieldCount > 0) {
        var row = Math.floor(Math.random() * maxRows);
        var column = Math.floor(Math.random() * maxColumns);
        if (fields[row][column].marked == true ) continue;
        // otherwise set the field as a trap
        fields[row][column].flipped = true;
        markedFieldCount--;
    }
    
    return true;
}

function fieldClicked(field) {
    if (!boardCanvas.gameOver) {
        mouseMove();
    }
}

// Mouse AI
function mouseMove() {
    
    var moveToRow;
    var moveToColumn;
    
    var shortestPaths = calcShortestPath();
    
    if (shortestPaths.length == 0) {
        // no escape reachable
        var neighbors = getNeighbors(mouse.row, mouse.column);
        var reachableNeighbors = new Array();
        
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!neighbor.marked) {
                reachableNeighbors.push(neighbor);
            }
        }
        
        if (reachableNeighbors.length == 0) { // All neighbors marked/filled
            flashText = flashTextComponent.createObject(gameCanvas);
            flashText.text = "You won!\nCongratulations";
            boardCanvas.gameOver = true;
            return true;
        }
        
        var randNeighbor = reachableNeighbors[Math.floor(Math.random() * reachableNeighbors.length)];
        moveToRow = randNeighbor.row;
        moveToColumn = randNeighbor.column;
        
    } else { // shortest path length > 0
        
        var rp = Math.floor(Math.random() * shortestPaths.length)
        var prevPlace = shortestPaths[rp];
        var reachedFromPlace = fields[prevPlace.reachedFromRow][prevPlace.reachedFromCol];
        
        // trace back the mouse
        while (reachedFromPlace.row != mouse.row || reachedFromPlace.column != mouse.column) {
            prevPlace = reachedFromPlace;
            reachedFromPlace = fields[prevPlace.reachedFromRow][prevPlace.reachedFromCol];
        }
        
        moveToRow = prevPlace.row;
        moveToColumn = prevPlace.column;
    }
    
    if (fields[moveToRow][moveToColumn].isEscape) {
        fields[moveToRow][moveToColumn].source = "images/hex.svg";
        swapImages(moveToRow, moveToColumn);
        
        flashText = flashTextComponent.createObject(gameCanvas);
        flashText.text = "You loose!";
        boardCanvas.gameOver = true;
        return true;
    }
    
    swapImages(moveToRow, moveToColumn);
    
    return false;
}


function swapImages(moveToRow, moveToColumn) {
    
    var direction = 5;
    for(var i = 0; i < MAX_NEIGHBORS; i++) {
        var neighbor = getNeighborForDirection(i, moveToRow, moveToColumn);
        if (neighbor == null) continue;
        if (neighbor.row == mouse.row && neighbor.column == mouse.column) {
            direction = i;
            break;
        }
    }
    
    mouse.direction = direction;
    
    // swap the coords
    var prevMouseRow = mouse.row;
    var prevMouseColumn = mouse.column
    var moveToField = fields[moveToRow][moveToColumn];
    mouse.row = moveToField.row;
    mouse.column = moveToField.column;
    moveToField.row = prevMouseRow;
    moveToField.column = prevMouseColumn;
    
    // swap the fields
    fields[moveToRow][moveToColumn] = mouse;
    fields[prevMouseRow][prevMouseColumn] = moveToField;
}



function calcShortestPath() {
    
    var shortestPaths = new Array();
    // reset AI for all fields
    for (var row = 0; row < maxRows; row++) {
       for (var col = 0; col < maxColumns; col++) {
           fields[row][col].resetAI();
       }
    }
    
    var queue = new Array();
    queue.push(mouse);
    
    var shortestEscape = MAX_DISTANCE;
    // dijkstra
    while (queue.length > 0) {
        var actPlace = queue.shift();
        
        var neighbors = getNeighbors(actPlace.row, actPlace.column);
        
        for (var i = 0; i < MAX_NEIGHBORS; i++) {
            var neighbor = neighbors[i];
            if (neighbor.marked) { // not accessible field
                continue;
            }
            
            var newDistance = actPlace.distance + 1;
            
            if (newDistance < neighbor.distance) { // Update neighbor's distance
                neighbor.distance = newDistance;
                neighbor.reachedFromRow = actPlace.row;
                neighbor.reachedFromCol = actPlace.column;
            }
            
            if (!neighbor.visited && !neighbor.isEscape) {
                neighbor.visited = true;
                queue.push(neighbor);
            }
            
            if (neighbor.isEscape) {
                if (neighbor.distance < shortestEscape) { // Shortest node
                    shortestEscape = neighbor.distance;
                    shortestPaths = new Array(); // clear the array
                    shortestPaths.push(neighbor);
                } else if (neighbor.distance == shortestEscape) { // Eqi-distance Shortest node
                    shortestPaths.push(neighbor);
               }
            }
        }
    }
    
    return shortestPaths;
}

function getNeighbors(aRow, aCol) {
    
    var neighbors = new Array();
    for (var i = 0; i < MAX_NEIGHBORS; i++) {
        var neib = getNeighborForDirection(i, aRow, aCol);
        if (neib) {
            neighbors.push(neib);
        }
    }
    
    return neighbors;
}

// Directions for Available Neighbors
function getNeighborForDirection(direction, row, col) {
    
    var neighbor = null;
    if (row % 2 == 0) {
        try {
            switch (direction) {
                case 0:
                    neighbor = fields[row - 1][col - 1]; // UL
                    break;
                case 1:
                    neighbor = fields[row - 1][col];  //UR
                    break;
                case 2:
                    neighbor = fields[row][col + 1]; //R
                    break;
                case 3:
                    neighbor = fields[row + 1][col - 1]; //DL
                    break;
                case 4:
                    neighbor = fields[row + 1][col];  //DR
                    break;
                case 5:
                    neighbor = fields[row][col - 1]; //L
                    break;
            }
        } catch(err) {}
    } else {
        try {
            switch (direction) {
                case 0:
                    neighbor = fields[row - 1][col]; // UL
                    break;
                case 1:
                    neighbor = fields[row - 1][col + 1]; //UR
                    break;
                case 2:
                    neighbor = fields[row][col + 1]; //R
                    break;
                case 3:
                    neighbor = fields[row + 1][col]; //DL
                    break;
                case 4:
                    neighbor = fields[row + 1][col + 1]; //DR
                    break;
                case 5:
                    neighbor = fields[row][col - 1]; //L
                    break;
            }
        } catch(err) {}
    }
    
    if (neighbor) {
        neighbor.direction = direction;
    }
    
    return neighbor;
}
