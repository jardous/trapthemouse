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

HexField {
    
    signal clicked
    
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
}
