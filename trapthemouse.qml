/*
Copyright [2014] Jiri Popek

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

import QtQuick 2.0
import "logic.js" as Logic

Rectangle {
    id: gameCanvas
    width: 700 //480
    height: 420 //410
    color: "#bbee89"
    
    SystemPalette { id: activePalette }
    
    Rectangle {
        id: boardCanvas
        color: "#bbee89"
        
        width: (Math.sqrt(3) * 24) * Logic.maxColumns + Math.sqrt(3) * 24/2
        height: (24 * 3/2) * Logic.maxRows + 24/2
        
        anchors { centerIn: parent }
        
        //property int fieldRadius: 24 //height / Logic.maxRows;
        
        property bool gameOver: false
        
        Component.onCompleted: { Logic.resizeBoard(); Logic.initGame(); }
    }
    
    function fieldClicked(field) { Logic.fieldClicked(field) }
    function newButtonClicked(field) { Logic.initGame() }
}
