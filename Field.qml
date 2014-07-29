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

import QtQuick 2.0

Flipable {
    id: flipable
    
    signal clicked
    
    property int row
    property int column
    //property alias fieldRadius: boardCanvas.fieldRadius
    property int fieldRadius: 24
    property string source: "images/hex.svg"
    
    x: column * width + (row % 2) * Math.sqrt(3) * fieldRadius / 2
    y: row * height - row * fieldRadius / 2
    
    width: Math.sqrt(3) * fieldRadius
    height: 2 * fieldRadius
    
    front: HexField { source: parent.source; sourceSize.width: width; sourceSize.height: height }
    back : HexField { source: "images/trap.svg"; sourceSize.width: width; sourceSize.height: height }
    
    // animation
    property int angle: 0
    property bool flipped: false
    
    transform: Rotation {
        origin.x: flipable.width/2; origin.y: flipable.height/2
        axis.x: 0; axis.y: 1; axis.z: 0     // rotate around y-axis
        angle: flipable.angle
    }
    
    states: State {
        name: "back"
        PropertyChanges { target: flipable; angle: 180; marked: true; isEscape: false }
        when: flipable.flipped
    }
    
    transitions: Transition {
        NumberAnimation { properties: "angle"; duration: 100 }
    }
    
    MouseArea {
        anchors.fill: parent
        onClicked: { flipable.flipped = true; fieldClicked(this); }
    }
    
    /* show some info on the fields for debugging
    Text {
        anchors.fill: parent
        text: distance
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
    }
    Text {
        anchors.fill: parent
        color: "white"
        text: marked ? "x":""
        font.bold: true
        horizontalAlignment: Text.AlignHCenter
    }
    
    Text {
        anchors.fill: parent
        color: "yellow"
        text: visited ? "o":""
        font.bold: true
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignBottom
    }
    Text {
        anchors.fill: parent
        color: "red"
        text: isEscape ? "E":""
        font.bold: true
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignBottom
    }*/
    
    function resetAI() {
        visited = false
        distance = 1000;
        reachedFromRow = 0
        reachedFromCol = 0
        direction = 0
    }
    
    property int direction
    
    // shortest path properties
    property bool isEscape
    property bool marked
    property bool visited
    property int distance
    property int reachedFromRow
    property int reachedFromCol
}
