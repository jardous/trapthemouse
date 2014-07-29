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

// http://blog.ruslans.com/2011/02/hexagonal-grid-math.html

Image {
    property int row
    property int column
    
    //property alias fieldRadius: parent.fieldRadius
    property int fieldRadius: 24
    
    x: column * width + (row % 2) * Math.sqrt(3) * fieldRadius / 2
    y: row * height - row * fieldRadius / 2
    
    width: Math.sqrt(3) * fieldRadius
    height: 2 * fieldRadius
    
    source: "images/hex.svg"
    sourceSize.width: width
    sourceSize.height: height
}
