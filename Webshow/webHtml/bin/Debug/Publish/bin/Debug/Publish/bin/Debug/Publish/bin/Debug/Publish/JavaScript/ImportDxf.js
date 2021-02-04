var ImporfDxf =
{
    group: null,
    imporf: function (id) {

        //$.post("/dxf/20200416.dxf", function (result) {
        //    //$("span").html(result);
        //    console.log('dxf', result);
        //});
        $.ajax({
            async: false,
            type: "GET",
            url: '/dxf/' + id,
            dataType: "text",
            success: function (result) {
                // console.log('dxf', result);
                var parser = new window.DxfParser();
                var dxf = parser.parseSync(result);

                if (dxf) {
                      console.log('提示','画画了');
                    //dxfContentEl.innerHTML = JSON.stringify(dxf, null, 2);
                    ImporfDxf.view(dxf);
                } else {
                    // dxfContentEl.innerHTML = 'No data.';
                }
                //layer.open({
                //    type: 1,
                //    skin: 'layui-layer-rim', //加上边框
                //    area: ['1000px', '700px'], //宽高
                //    maxmin: true,
                //    content: rtn
                //});
            }
        });
        return;
        var errorHandler = function () {
            alert('上传错误！');
        }
        var onSuccess = function (evt) {
            var fileReader = evt.target;
            if (fileReader.error) return console.log("error onloadend!?");
            //progress.style.width = '100%';
            //progress.textContent = '100%';
            //setTimeout(function () { $progress.removeClass('loading'); }, 2000);
            var parser = new window.DxfParser();
            var dxf = parser.parseSync(fileReader.result);

            if (dxf) {
                // alert('画画了');
                //dxfContentEl.innerHTML = JSON.stringify(dxf, null, 2);
                ImporfDxf.view(dxf);
            } else {
                // dxfContentEl.innerHTML = 'No data.';
            }

            // Three.js changed the way fonts are loaded, and now we need to use FontLoader to load a font
            //  and enable TextGeometry. See this example http://threejs.org/examples/?q=text#webgl_geometry_text
            //  and this discussion https://github.com/mrdoob/three.js/issues/7398 
            //var font;
            //var loader = new THREE.FontLoader();
            //loader.load('fonts/helvetiker_regular.typeface.json', function (response) {
            //    font = response;
            //    cadCanvas = new window.ThreeDxf.Viewer(dxf, document.getElementById('cad-view'), 400, 400, font);
            //});
        }
        var selectedFile = window.top.document.getElementById("filePost");// window.parent.getElementById('filePost');
        // var selectedFile = document.getElementById('inputEle').files[0];
        if (selectedFile) {
            var reader = new FileReader();
            //  reader.onprogress = updateProgress;
            reader.onloadend = onSuccess;
            //reader.onabort = abortUpload;
            reader.onerror = errorHandler;
            reader.readAsText(selectedFile);
        }
        else {
            console.log('selectedFile', selectedFile);
            alert('提示', '跨域失败');
        }
    },
    limits: null,
    view: function (data) {
        var i, entity, obj, min_x, min_y, min_z, max_x, max_y, max_z;
        var dims = {
            min: { x: false, y: false, z: false },
            max: { x: false, y: false, z: false }
        };
        for (i = 0; i < data.entities.length; i++) {
            entity = data.entities[i];

            if (entity.type === 'DIMENSION') {
                if (entity.block) {
                    var block = data.blocks[entity.block];
                    if (!block) {
                        console.error('Missing referenced block "' + entity.block + '"');
                        continue;
                    }
                    for (var j = 0; j < block.entities.length; j++) {
                        obj = this.drawEntityToGetLimit(block.entities[j], data);
                    }
                } else {
                    console.log('WARNING: No block for DIMENSION entity');
                }
            } else {
                obj = this.drawEntityToGetLimit(entity, data);
            }

            if (obj) {
                var bbox = new THREE.Box3().setFromObject(obj);
                if (bbox.min.x && ((dims.min.x === false) || (dims.min.x > bbox.min.x))) dims.min.x = bbox.min.x;
                if (bbox.min.y && ((dims.min.y === false) || (dims.min.y > bbox.min.y))) dims.min.y = bbox.min.y;
                if (bbox.min.z && ((dims.min.z === false) || (dims.min.z > bbox.min.z))) dims.min.z = bbox.min.z;
                if (bbox.max.x && ((dims.max.x === false) || (dims.max.x < bbox.max.x))) dims.max.x = bbox.max.x;
                if (bbox.max.y && ((dims.max.y === false) || (dims.max.y < bbox.max.y))) dims.max.y = bbox.max.y;
                if (bbox.max.z && ((dims.max.z === false) || (dims.max.z < bbox.max.z))) dims.max.z = bbox.max.z;

                this.group.add(obj);
                // thi
                // scene.add(obj);
            }

            obj = null;
        }
        this.limits = dims;
        console.log('dims', dims);
        //console.

        var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
            (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
            (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
        var scaleV = l / (ImporfDxf.limits.max.x - ImporfDxf.limits.min.x);
        this.group.scale.set(scaleV, scaleV, scaleV)
        this.group.position.setX(controls.target.x);
        this.group.position.setY(controls.target.y);
        this.group.position.setZ(controls.target.z);
        this.group.rotateX(-Math.PI / 2);
    },
    drawEntityToGetLimit: function (entity, data) {
        function drawEllipse(entity, data) {
            var color = getColor(entity, data);

            var xrad = Math.sqrt(Math.pow(entity.majorAxisEndPoint.x, 2) + Math.pow(entity.majorAxisEndPoint.y, 2));
            var yrad = xrad * entity.axisRatio;
            var rotation = Math.atan2(entity.majorAxisEndPoint.y, entity.majorAxisEndPoint.x);

            var curve = new THREE.EllipseCurve(
                entity.center.x, entity.center.y,
                xrad, yrad,
                entity.startAngle, entity.endAngle,
                false, // Always counterclockwise
                rotation
            );

            var points = curve.getPoints(50);
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });

            // Create the final object to add to the scene
            var ellipse = new THREE.Line(geometry, material);
            return ellipse;
        }

        function drawMtext(entity, data) {
            var color = getColor(entity, data);

            var geometry = new THREE.TextGeometry(entity.text, {
                font: font,
                size: entity.height * (4 / 5),
                height: 1
            });
            var material = new THREE.MeshBasicMaterial({ color: color });
            var text = new THREE.Mesh(geometry, material);

            // Measure what we rendered.
            var measure = new THREE.Box3();
            measure.setFromObject(text);

            var textWidth = measure.max.x - measure.min.x;

            // If the text ends up being wider than the box, it's supposed
            // to be multiline. Doing that in threeJS is overkill.
            if (textWidth > entity.width) {
                console.log("Can't render this multipline MTEXT entity, sorry.", entity);
                return undefined;
            }

            text.position.z = 0;
            switch (entity.attachmentPoint) {
                case 1:
                    // Top Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y - entity.height;
                    break;
                case 2:
                    // Top Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y - entity.height;
                    break;
                case 3:
                    // Top Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y - entity.height;
                    break;

                case 4:
                    // Middle Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;
                case 5:
                    // Middle Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;
                case 6:
                    // Middle Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;

                case 7:
                    // Bottom Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y;
                    break;
                case 8:
                    // Bottom Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y;
                    break;
                case 9:
                    // Bottom Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y;
                    break;

                default:
                    return undefined;
            };

            return text;
        }

        function drawSpline(entity, data) {
            var color = getColor(entity, data);

            var points = entity.controlPoints.map(function (vec) {
                return new THREE.Vector2(vec.x, vec.y);
            });

            var interpolatedPoints = [];
            if (entity.degreeOfSplineCurve == 2) {
                for (var i = 0; i + 2 < points.length; i = i + 2) {
                    curve = new THREE.QuadraticBezierCurve(points[i], points[i + 1], points[i + 2]);
                    interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
                }
            } else {
                curve = new THREE.SplineCurve(points);
                interpolatedPoints = curve.getPoints(100);
            }

            var geometry = new THREE.BufferGeometry().setFromPoints(interpolatedPoints);
            var material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            var splineObject = new THREE.Line(geometry, material);

            return splineObject;
        }

        function drawLine(entity, data) {
            var geometry = new THREE.Geometry(),
                color = getColor(entity, data),
                material, lineType, vertex, startPoint, endPoint, bulgeGeometry,
                bulge, i, line;

            // create geometry
            for (i = 0; i < entity.vertices.length; i++) {

                if (entity.vertices[i].bulge) {
                    bulge = entity.vertices[i].bulge;
                    startPoint = entity.vertices[i];
                    endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : geometry.vertices[0];

                    bulgeGeometry = new THREE.BulgeGeometry(startPoint, endPoint, bulge);

                    geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
                } else {
                    vertex = entity.vertices[i];
                    geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
                }

            }
            if (entity.shape) geometry.vertices.push(geometry.vertices[0]);


            // set material
            if (entity.lineType) {
                lineType = data.tables.lineType.lineTypes[entity.lineType];
            }

            if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
                material = new THREE.LineDashedMaterial({ color: color, gapSize: 4, dashSize: 4 });
            } else {
                material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            }

            // if(lineType && lineType.pattern && lineType.pattern.length !== 0) {

            //           geometry.computeLineDistances();

            //           // Ugly hack to add diffuse to this. Maybe copy the uniforms object so we
            //           // don't add diffuse to a material.
            //           lineType.material.uniforms.diffuse = { type: 'c', value: new THREE.Color(color) };

            // 	material = new THREE.ShaderMaterial({
            // 		uniforms: lineType.material.uniforms,
            // 		vertexShader: lineType.material.vertexShader,
            // 		fragmentShader: lineType.material.fragmentShader
            // 	});
            // }else {
            // 	material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            // }

            line = new THREE.Line(geometry, material);
            return line;
        }

        function drawCircle(entity, data) {
            var geometry, material, circle;

            geometry = new THREE.CircleGeometry(entity.radius, 32, entity.startAngle, entity.angleLength);
            geometry.vertices.shift();

            material = new THREE.LineBasicMaterial({ color: getColor(entity, data) });

            circle = new THREE.Line(geometry, material);
            circle.position.x = entity.center.x;
            circle.position.y = entity.center.y;
            circle.position.z = entity.center.z;

            return circle;
        }

        function drawSolid(entity, data) {
            var material, mesh, verts,
                geometry = new THREE.Geometry();

            verts = geometry.vertices;
            verts.push(new THREE.Vector3(entity.points[0].x, entity.points[0].y, entity.points[0].z));
            verts.push(new THREE.Vector3(entity.points[1].x, entity.points[1].y, entity.points[1].z));
            verts.push(new THREE.Vector3(entity.points[2].x, entity.points[2].y, entity.points[2].z));
            verts.push(new THREE.Vector3(entity.points[3].x, entity.points[3].y, entity.points[3].z));

            // Calculate which direction the points are facing (clockwise or counter-clockwise)
            var vector1 = new THREE.Vector3();
            var vector2 = new THREE.Vector3();
            vector1.subVectors(verts[1], verts[0]);
            vector2.subVectors(verts[2], verts[0]);
            vector1.cross(vector2);

            // If z < 0 then we must draw these in reverse order
            if (vector1.z < 0) {
                geometry.faces.push(new THREE.Face3(2, 1, 0));
                geometry.faces.push(new THREE.Face3(2, 3, 1));
            } else {
                geometry.faces.push(new THREE.Face3(0, 1, 2));
                geometry.faces.push(new THREE.Face3(1, 3, 2));
            }


            material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

            return new THREE.Mesh(geometry, material);

        }

        function drawText(entity, data) {
            var geometry, material, text;

            if (!font)
                return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

            geometry = new THREE.TextGeometry(entity.text, { font: font, height: 0, size: entity.textHeight || 12 });

            material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

            text = new THREE.Mesh(geometry, material);
            text.position.x = entity.startPoint.x;
            text.position.y = entity.startPoint.y;
            text.position.z = entity.startPoint.z;

            return text;
        }

        function drawPoint(entity, data) {
            var geometry, material, point;

            geometry = new THREE.Geometry();

            geometry.vertices.push(new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z));

            // TODO: could be more efficient. PointCloud per layer?

            var numPoints = 1;

            var color = getColor(entity, data);
            var colors = new Float32Array(numPoints * 3);
            colors[0] = color.r;
            colors[1] = color.g;
            colors[2] = color.b;

            geometry.colors = colors;
            geometry.computeBoundingBox();

            material = new THREE.PointsMaterial({ size: 0.05, vertexColors: THREE.VertexColors });
            point = new THREE.Points(geometry, material);
            scene.add(point);
        }

        function drawBlock(entity, data) {
            var block = data.blocks[entity.name];

            if (!block.entities) return null;

            var group = new THREE.Object3D()

            if (entity.xScale) group.scale.x = entity.xScale;
            if (entity.yScale) group.scale.y = entity.yScale;

            if (entity.rotation) {
                group.rotation.z = entity.rotation * Math.PI / 180;
            }

            if (entity.position) {
                group.position.x = entity.position.x;
                group.position.y = entity.position.y;
                group.position.z = entity.position.z;
            }

            for (var i = 0; i < block.entities.length; i++) {
                var childEntity = drawEntity(block.entities[i], data, group);
                if (childEntity) group.add(childEntity);
            }

            return group;
        }

        function getColor(entity, data) {
            var color = 0x000000; //default
            if (entity.color) color = entity.color;
            else if (data.tables && data.tables.layer && data.tables.layer.layers[entity.layer])
                color = data.tables.layer.layers[entity.layer].color;

            if (color == null || color === 0xffffff) {
                color = 0x000000;
            }
            return color;
        }
        try {
            var mesh;
            if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                mesh = drawCircle(entity, data);
            } else if (entity.type === 'LWPOLYLINE' || entity.type === 'LINE' || entity.type === 'POLYLINE') {
                mesh = drawLine(entity, data);
            } else if (entity.type === 'TEXT') {
                mesh = drawText(entity, data);
            } else if (entity.type === 'SOLID') {
                mesh = drawSolid(entity, data);
            } else if (entity.type === 'POINT') {
                mesh = drawPoint(entity, data);
            } else if (entity.type === 'INSERT') {
                mesh = drawBlock(entity, data);
            } else if (entity.type === 'SPLINE') {
                mesh = drawSpline(entity, data);
            } else if (entity.type === 'MTEXT') {
                // mesh = drawMtext(entity, data);
            } else if (entity.type === 'ELLIPSE') {
                mesh = drawEllipse(entity, data);
            }
            else {
                console.log("Unsupported Entity Type: " + entity.type);
            }
            return mesh;
        }
        catch (e) {
            return null;
        }
    },
    drawEntityToGroup: function (entity, data) {
        function drawEllipse(entity, data) {
            var color = getColor(entity, data);

            var xrad = Math.sqrt(Math.pow(entity.majorAxisEndPoint.x, 2) + Math.pow(entity.majorAxisEndPoint.y, 2));
            var yrad = xrad * entity.axisRatio;
            var rotation = Math.atan2(entity.majorAxisEndPoint.y, entity.majorAxisEndPoint.x);

            var curve = new THREE.EllipseCurve(
                entity.center.x, entity.center.y,
                xrad, yrad,
                entity.startAngle, entity.endAngle,
                false, // Always counterclockwise
                rotation
            );

            var points = curve.getPoints(50);
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });

            // Create the final object to add to the scene
            var ellipse = new THREE.Line(geometry, material);
            return ellipse;
        }

        function drawMtext(entity, data) {
            var color = getColor(entity, data);

            var geometry = new THREE.TextGeometry(entity.text, {
                font: font,
                size: entity.height * (4 / 5),
                height: 1
            });
            var material = new THREE.MeshBasicMaterial({ color: color });
            var text = new THREE.Mesh(geometry, material);

            // Measure what we rendered.
            var measure = new THREE.Box3();
            measure.setFromObject(text);

            var textWidth = measure.max.x - measure.min.x;

            // If the text ends up being wider than the box, it's supposed
            // to be multiline. Doing that in threeJS is overkill.
            if (textWidth > entity.width) {
                console.log("Can't render this multipline MTEXT entity, sorry.", entity);
                return undefined;
            }

            text.position.z = 0;
            switch (entity.attachmentPoint) {
                case 1:
                    // Top Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y - entity.height;
                    break;
                case 2:
                    // Top Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y - entity.height;
                    break;
                case 3:
                    // Top Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y - entity.height;
                    break;

                case 4:
                    // Middle Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;
                case 5:
                    // Middle Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;
                case 6:
                    // Middle Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y - entity.height / 2;
                    break;

                case 7:
                    // Bottom Left
                    text.position.x = entity.position.x;
                    text.position.y = entity.position.y;
                    break;
                case 8:
                    // Bottom Center
                    text.position.x = entity.position.x - textWidth / 2;
                    text.position.y = entity.position.y;
                    break;
                case 9:
                    // Bottom Right
                    text.position.x = entity.position.x - textWidth;
                    text.position.y = entity.position.y;
                    break;

                default:
                    return undefined;
            };

            return text;
        }

        function drawSpline(entity, data) {
            var color = getColor(entity, data);

            var points = entity.controlPoints.map(function (vec) {
                return new THREE.Vector2(vec.x, vec.y);
            });

            var interpolatedPoints = [];
            if (entity.degreeOfSplineCurve == 2) {
                for (var i = 0; i + 2 < points.length; i = i + 2) {
                    curve = new THREE.QuadraticBezierCurve(points[i], points[i + 1], points[i + 2]);
                    interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
                }
            } else {
                curve = new THREE.SplineCurve(points);
                interpolatedPoints = curve.getPoints(100);
            }

            var geometry = new THREE.BufferGeometry().setFromPoints(interpolatedPoints);
            var material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            var splineObject = new THREE.Line(geometry, material);

            return splineObject;
        }

        function drawLine(entity, data) {
            var geometry = new THREE.Geometry(),
                color = getColor(entity, data),
                material, lineType, vertex, startPoint, endPoint, bulgeGeometry,
                bulge, i, line;

            // create geometry
            for (i = 0; i < entity.vertices.length; i++) {

                if (entity.vertices[i].bulge) {
                    bulge = entity.vertices[i].bulge;
                    startPoint = entity.vertices[i];
                    endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : geometry.vertices[0];

                    bulgeGeometry = new THREE.BulgeGeometry(startPoint, endPoint, bulge);

                    geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
                } else {
                    vertex = entity.vertices[i];
                    geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
                }

            }
            if (entity.shape) geometry.vertices.push(geometry.vertices[0]);


            // set material
            if (entity.lineType) {
                lineType = data.tables.lineType.lineTypes[entity.lineType];
            }

            if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
                material = new THREE.LineDashedMaterial({ color: color, gapSize: 4, dashSize: 4 });
            } else {
                material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            }

            // if(lineType && lineType.pattern && lineType.pattern.length !== 0) {

            //           geometry.computeLineDistances();

            //           // Ugly hack to add diffuse to this. Maybe copy the uniforms object so we
            //           // don't add diffuse to a material.
            //           lineType.material.uniforms.diffuse = { type: 'c', value: new THREE.Color(color) };

            // 	material = new THREE.ShaderMaterial({
            // 		uniforms: lineType.material.uniforms,
            // 		vertexShader: lineType.material.vertexShader,
            // 		fragmentShader: lineType.material.fragmentShader
            // 	});
            // }else {
            // 	material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
            // }

            line = new THREE.Line(geometry, material);
            return line;
        }

        function drawCircle(entity, data) {
            var geometry, material, circle;

            geometry = new THREE.CircleGeometry(entity.radius, 32, entity.startAngle, entity.angleLength);
            geometry.vertices.shift();

            material = new THREE.LineBasicMaterial({ color: getColor(entity, data) });

            circle = new THREE.Line(geometry, material);
            circle.position.x = entity.center.x;
            circle.position.y = entity.center.y;
            circle.position.z = entity.center.z;

            return circle;
        }

        function drawSolid(entity, data) {
            var material, mesh, verts,
                geometry = new THREE.Geometry();

            verts = geometry.vertices;
            verts.push(new THREE.Vector3(entity.points[0].x, entity.points[0].y, entity.points[0].z));
            verts.push(new THREE.Vector3(entity.points[1].x, entity.points[1].y, entity.points[1].z));
            verts.push(new THREE.Vector3(entity.points[2].x, entity.points[2].y, entity.points[2].z));
            verts.push(new THREE.Vector3(entity.points[3].x, entity.points[3].y, entity.points[3].z));

            // Calculate which direction the points are facing (clockwise or counter-clockwise)
            var vector1 = new THREE.Vector3();
            var vector2 = new THREE.Vector3();
            vector1.subVectors(verts[1], verts[0]);
            vector2.subVectors(verts[2], verts[0]);
            vector1.cross(vector2);

            // If z < 0 then we must draw these in reverse order
            if (vector1.z < 0) {
                geometry.faces.push(new THREE.Face3(2, 1, 0));
                geometry.faces.push(new THREE.Face3(2, 3, 1));
            } else {
                geometry.faces.push(new THREE.Face3(0, 1, 2));
                geometry.faces.push(new THREE.Face3(1, 3, 2));
            }


            material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

            return new THREE.Mesh(geometry, material);

        }

        function drawText(entity, data) {
            var geometry, material, text;

            if (!font)
                return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

            geometry = new THREE.TextGeometry(entity.text, { font: font, height: 0, size: entity.textHeight || 12 });

            material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

            text = new THREE.Mesh(geometry, material);
            text.position.x = entity.startPoint.x;
            text.position.y = entity.startPoint.y;
            text.position.z = entity.startPoint.z;

            return text;
        }

        function drawPoint(entity, data) {
            var geometry, material, point;

            geometry = new THREE.Geometry();

            geometry.vertices.push(new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z));

            // TODO: could be more efficient. PointCloud per layer?

            var numPoints = 1;

            var color = getColor(entity, data);
            var colors = new Float32Array(numPoints * 3);
            colors[0] = color.r;
            colors[1] = color.g;
            colors[2] = color.b;

            geometry.colors = colors;
            geometry.computeBoundingBox();

            material = new THREE.PointsMaterial({ size: 0.05, vertexColors: THREE.VertexColors });
            point = new THREE.Points(geometry, material);
            scene.add(point);
        }

        function drawBlock(entity, data) {
            var block = data.blocks[entity.name];

            if (!block.entities) return null;

            var group = new THREE.Object3D()

            if (entity.xScale) group.scale.x = entity.xScale;
            if (entity.yScale) group.scale.y = entity.yScale;

            if (entity.rotation) {
                group.rotation.z = entity.rotation * Math.PI / 180;
            }

            if (entity.position) {
                group.position.x = entity.position.x;
                group.position.y = entity.position.y;
                group.position.z = entity.position.z;
            }

            for (var i = 0; i < block.entities.length; i++) {
                var childEntity = drawEntity(block.entities[i], data, group);
                if (childEntity) group.add(childEntity);
            }

            return group;
        }

        function getColor(entity, data) {
            var color = 0x000000; //default
            if (entity.color) color = entity.color;
            else if (data.tables && data.tables.layer && data.tables.layer.layers[entity.layer])
                color = data.tables.layer.layers[entity.layer].color;

            if (color == null || color === 0xffffff) {
                color = 0x000000;
            }
            return color;
        }
        try {
            var mesh;
            if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                mesh = drawCircle(entity, data);
            } else if (entity.type === 'LWPOLYLINE' || entity.type === 'LINE' || entity.type === 'POLYLINE') {
                mesh = drawLine(entity, data);
            } else if (entity.type === 'TEXT') {
                mesh = drawText(entity, data);
            } else if (entity.type === 'SOLID') {
                mesh = drawSolid(entity, data);
            } else if (entity.type === 'POINT') {
                mesh = drawPoint(entity, data);
            } else if (entity.type === 'INSERT') {
                mesh = drawBlock(entity, data);
            } else if (entity.type === 'SPLINE') {
                mesh = drawSpline(entity, data);
            } else if (entity.type === 'MTEXT') {
                // mesh = drawMtext(entity, data);
            } else if (entity.type === 'ELLIPSE') {
                mesh = drawEllipse(entity, data);
            }
            else {
                console.log("Unsupported Entity Type: " + entity.type);
            }
            return mesh;
        }
        catch (e) {
            return null;
        }
    },
    initial: function () {
        //var inputElement = document.getElementById("inputEle");
        //inputElement.addEventListener("change", this.imporf, false);
        //document.getElementById("inputEle").click()
    },
    getCenter: function () {
        if (this.limits) {
            var thatObj = this;
            return { x: thatObj.limits.min.x + thatObj.limits.max.x, y: thatObj.limits.min.y + thatObj.limits.max.y, z: thatObj.limits.min.z + thatObj.limits.max.z };
        }
        else return null;
    },
    left: function () {
        if (this.group) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            this.group.position.x -= l / 10;
        }
    },
    right: function () {
        if (this.group) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            this.group.position.x += l / 10;
        }
    },
    up: function () {
        if (this.group) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            this.group.position.z -= l / 10;
        }
    },
    down: function () {
        if (this.group) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            this.group.position.z += l / 10;
        }
    },
    zoom: function (add) {
        if (this.group) {
            var v = 1;
            if (add >= 0) {
                v *= 1.02;
                //  v = Math.min(v, 100000);
            }
            else {
                v /= 1.02;
                //v = Math.max(v, 0.00001);
            }
            this.group.scale.setX(this.group.scale.x * v);
            this.group.scale.setY(this.group.scale.y * v);
            //this.group.scale.set(v, v, v);
        }
    },
    zoomX: function (add) {
        if (this.group) {
            var v = this.group.scale.x;
            if (add >= 0) {
                v *= 1.02;
            }
            else {
                v /= 1.02;
                v = Math.max(v, 0.00001);
            }
            this.group.scale.setX(v);
        }
    },
    zoomY: function (add) {
        if (this.group) {
            var v = this.group.scale.y;
            if (add >= 0) {
                v *= 1.02;
            }
            else {
                v /= 1.02;
                v = Math.max(v, 0.00001);
            }
            this.group.scale.setY(v);
        }
    },
    clear: function () {
        if (this.group) {
            var l = this.group.children.length;
            for (var i = l - 1; i >= 0; i--) {
                this.group.remove(this.group.children[0]);
            }
        }
    },
    call: function () {
        //var inputElement = document.getElementById("inputEle");
        //if (inputElement) {
        //    inputElement.click();
        //}
        this.imporf();
    },
    SetY: function (l) {
        if (this.group) {
            this.group.position.setY(l / 50);
        }
    }
};
var xx = 555;
//var ImportDxf = function (evt) {


//    var errorHandler = function () {
//        alert('上传错误！');
//    }
//    var onSuccess = function (evt) {
//        var fileReader = evt.target;
//        if (fileReader.error) return console.log("error onloadend!?");
//        //progress.style.width = '100%';
//        //progress.textContent = '100%';
//        //setTimeout(function () { $progress.removeClass('loading'); }, 2000);
//        var parser = new window.DxfParser();
//        var dxf = parser.parseSync(fileReader.result);

//        if (dxf) {
//            alert('画画了');
//            //dxfContentEl.innerHTML = JSON.stringify(dxf, null, 2);
//            new ThreeDxf.Viewer(dxf, document.getElementById('cad-view'), 400, 400);
//        } else {
//            // dxfContentEl.innerHTML = 'No data.';
//        }

//        // Three.js changed the way fonts are loaded, and now we need to use FontLoader to load a font
//        //  and enable TextGeometry. See this example http://threejs.org/examples/?q=text#webgl_geometry_text
//        //  and this discussion https://github.com/mrdoob/three.js/issues/7398 
//        //var font;
//        //var loader = new THREE.FontLoader();
//        //loader.load('fonts/helvetiker_regular.typeface.json', function (response) {
//        //    font = response;
//        //    cadCanvas = new window.ThreeDxf.Viewer(dxf, document.getElementById('cad-view'), 400, 400, font);
//        //});
//    }

//    var selectedFile = document.getElementById('inputEle').files[0];
//    var reader = new FileReader();
//    //  reader.onprogress = updateProgress;
//    reader.onloadend = onSuccess;
//    //reader.onabort = abortUpload;
//    reader.onerror = errorHandler;
//    reader.readAsText(selectedFile);
//}



