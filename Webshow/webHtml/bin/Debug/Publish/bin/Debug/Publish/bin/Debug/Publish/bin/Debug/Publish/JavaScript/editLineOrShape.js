var editedLine = { points: [], state: '', currentPoint: null, isClosed: false, currentIndex: -1 };
var editedShape = { points: [], state: '', currentPoint: null, isClosed: false, currentIndex: -1 };
function begainEditLine() {
    clickState = 'addPolyLine';
    editedLine.points = [];
    editedLine.state = 'addPointToEnd';
}
function begainEditShape() {
    clickState = 'addShape';
    editedShape.points = [];
    editedShape.state = 'addPointToEnd';
}
var drawEditLine = function () {
    if (editedLine.points.length > 0) {
        if (editedLine.state == "addPointToEnd") {
            //if (editedLine.isClosed) { }
            //else
            {
                var vertices = [];
                for (var i = 0; i < editedLine.points.length; i++) {
                    vertices.push(editedLine.points[i].x, 0.01, editedLine.points[i].z);
                }
                // editedLine.currentPoint
                vertices.push(editedLine.currentPoint.x, 0.01, editedLine.currentPoint.z);

                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                var material = new THREE.LineBasicMaterial({
                    color: 'blue',
                    linewidth: 5,
                });
                if (polyLineGroup.children.length == 0) {
                    var line = new THREE.Line(geometry, material);
                    polyLineGroup.add(line);

                }
                else {
                    polyLineGroup.children[0].geometry = geometry;
                }
            }
        }

        else if (editedLine.state == "addPointToMid") {
            //if (editedLine.isClosed) { }
            //else

            {
                var getMinV = function (vertices) {
                    var result = [];
                    minCircumference = 10000000;
                    {

                        for (var i = 0; i <= vertices.length; i++) {
                            var verticesNew = [];
                            for (var j = 0; j < vertices.length; j++) {
                                verticesNew.push(vertices[j]);
                            }

                            if (editedLine.currentPoint != null) {
                                verticesNew.splice(i, 0, editedLine.currentPoint);
                            }
                            Circumference = 0;
                            for (var k = 1; k < verticesNew.length; k++) {
                                var previous = verticesNew[k - 1];
                                var current = verticesNew[k];
                                Circumference += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
                            }
                            if (Circumference < minCircumference) {
                                result = verticesNew;
                                minCircumference = Circumference;
                                editedLine.currentIndex = i + 0;
                            }
                            //  c += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
                        }
                    }
                    return result;
                }
                var r = getMinV(editedLine.points);
                if (r == null) {
                    return;
                }

                var vertices = [];
                for (var i = 0; i < r.length; i++) {
                    vertices.push(r[i].x, 0.01, r[i].z);
                }
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                var material = new THREE.LineBasicMaterial({
                    color: 'blue',
                    linewidth: 5,
                });
                if (polyLineGroup.children.length == 0) {
                    var line = new THREE.Line(geometry, material);
                    polyLineGroup.add(line);

                }
                else {
                    polyLineGroup.children[0].geometry = geometry;
                }
            }

        }

    }
}

