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

HexField {
    id: mouse
    
    source: "images/mouse.svg"
    
    states: [
        State { name: "direction_ul"; when: direction == 0; PropertyChanges { target: mouse; source: "images/mouse_dr.svg" } },
        State { name: "direction_ur"; when: direction == 1; PropertyChanges { target: mouse; source: "images/mouse_dl.svg" } },
        State { name: "direction_r"; when: direction == 2; PropertyChanges { target: mouse; source: "images/mouse_l.svg" } },
        State { name: "direction_dl"; when: direction == 3; PropertyChanges { target: mouse; source: "images/mouse_ur.svg" } },
        State { name: "direction_dr"; when: direction == 4; PropertyChanges { target: mouse; source: "images/mouse_ul.svg" } },
        State { name: "direction_l"; when: direction == 5; PropertyChanges { target: mouse; source: "images/mouse_r.svg" } }
    ]
    /*
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
    }*/
    
    function resetAI() {
        isEscape = false
        marked = true
        visited = true
        distance = 0
        reachedFromRow = 0
        reachedFromCol = 0
    }
    
    property int direction: 0
    
    // shortest path properties
    property bool isEscape
    property bool marked: true
    property bool visited: true

    property int distance
    property int reachedFromRow
    property int reachedFromCol
    
    // animated mouse
    property bool rotate: false
    NumberAnimation on direction {
        running: boardCanvas.gameOver
        from: 5; to: 0
        loops: Animation.Infinite
        duration: 700
    }
}
