var runFromNginx = true;
var aa = function () {
    return "showA Page:hello world!";
}
var mapDelta = { deltaX: 0, deltaZ: 0 };
var setMap = function (t) {
    setIntensity(0.5);
    mapDelta.deltaX = 0;
    mapDelta.deltaZ = 0;

    if (t == 'e') {
        mercatoCenter.zoom = -10;
        constMapt = 'e';
        updateMap();
        electricLine.recordT = Date.parse('2050-03-01');
        //electricLine.UpdateRunDate();
    }
    else if (t == 'm') {
        mercatoCenter.zoom = -10;
        constMapt = 'm';
        updateMap();
        electricLine.recordT = Date.parse('2050-03-01');

        mapDelta.deltaZ = -0.8;
    }
    else if (t == 'r') {
        // setIntensity(0.5);
        //表示路网
        mercatoCenter.zoom = -10;
        constMapt = 'r';
        updateMap();
        electricLine.recordT = Date.parse('2050-03-01');

        mapDelta.deltaX = 0;
        mapDelta.deltaZ = -1;
    }
    else if (t == 'y2017') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2017';
        updateMap();
        electricLine.recordT = Date.parse('2017-03-01');
    }
    else if (t == 'y2014') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2014';
        updateMap();
        // electricLine.UpdateRunDate(Date.parse('2014-03-01'));
        electricLine.recordT = Date.parse('2014-03-01');
    }
    else if (t == 'y2011') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2011';
        updateMap();
        //electricLine.UpdateRunDate(Date.parse('2011-03-01'));
        electricLine.recordT = Date.parse('2011-03-01');
    }
    else if (t == 'y2003') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2003';
        updateMap();
        // electricLine.UpdateRunDate(Date.parse('2003-03-01'));
        electricLine.recordT = Date.parse('2003-03-01');
    }
    else if (t == 'showMapOfResource') {
        constMapt = 'showMapOfResource';
        resource.drawMapF();
    }

}

var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var centerPosition = { lon: 112.573463, lat: 37.891474 };
var mercatoCenter = { x: 0, zValue: 0, zoom: 0 };

var mousePosition = { x: 0, y: 0 };

if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

var camera, controls, scene, renderer, labelRenderer, label2Renderer, cssLabelRenderer, scene1, scene2;
//sceneMap mapRendersceneMap
var axesHelper;
var mesh;
var mapGroup, boundryGroup, peibianGroup, tongxin5GMapGroup, regionBlockGroup, lineLabelGroup,
    buildingsGroups, courtGroup,
    measureLengthGroup, measureAreaGroup, polyLineGroup, guangouGroup, chaoliufenxiGroup, chaoliufenxiGroup2, chaoliufenxiGroup3, chaoliufenxiGroup4, chaoliufenxiGroup5,
    songdianquGroup, xingquDianGroup, environmentInfoGroup;
//biandiansuoGroup

var chaoliufenxiGroupCount = 10;
var chaoliuFenxiData = [];
var mapGroupData = {};
var light1, light2, light3, light4;
var constMapt = 'e';
//init();
////render(); // remove when using next line for animation loop (requestAnimationFrame)
//animate();
var raycaster;
//var mouse = {};

//var canvas;
var mapMesh;
//var mapScale = 256;
var ctx;
var mapCanvas;
var clickState = 'objClick';
var measureLengthObj = {
    start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, state: 0, getAngleF: function (x1, y1, x2, y2) {
        var l = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        if (l > 0) {

            if (x2 - x1 > 0) {
                return Math.asin((y2 - y1) / l);
            }
            else
                return Math.PI - Math.asin((y2 - y1) / l);
        }
        else {
            return 0;
        }
    },
    result: 0,
    measureLineDiv: null,
    measureLineDivLabel: null
};

var measureAreaObj = { points: [], measureAreaDiv: null, measureAreaDivLabel: null };

var editedShape = { points: [], state: '', currentPoint: null, isClosed: false, currentIndex: -1 };
function init() {

    document.onmousemove = function (event) {
        if (clickState == 'addPolyLine') {
            if (editedLine.state == 'addPointToEnd') {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);

                //console.log('raycaster', raycaster);
                if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

                    var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                    var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

                    editedLine.currentPoint = mousePosition;

                }
            }
            else if (editedLine.state == 'addPointToMid') {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);

                //console.log('raycaster', raycaster);
                if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

                    var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                    var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

                    editedLine.currentPoint = mousePosition;

                }
            }
        }
        else if (clickState == 'addShape') {
            addShape.onmousemove(event);
        }
        else if (clickState == 'editingPanorama') {
            panorama.onmousemove(event);
        }
        else if (clickState == 'addLineControlPoint') {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            //console.log('raycaster', raycaster);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
                drawTowerOfPowerLines.currentPoint = mousePosition;

            }
        }

    }

    document.onkeydown = function (e) {
        //keyCommand(e);
        keyCommand(e.keyCode);

    }


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7c9dd4);
    scene.fog = new THREE.FogExp2(0x7c9dd4, 0.2);

    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('Pic/');
    var cubeTexture = cubeTextureLoader.load([
        "px.jpg", "nx.jpg",
        "py.jpg", "ny.jpg",
        "pz.jpg", "nz.jpg"
    ]);
    scene.background = cubeTexture;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'renderDom';
    document.getElementById('mainC').appendChild(renderer.domElement);
    //  document.body

    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.className = 'labelRenderer';
    document.getElementById('mainC').appendChild(labelRenderer.domElement);

    //  camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.001, 300);
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 30000);
    camera.position.set(4000, 2000, 0);
    camera.position.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));

    // controls

    controls = new THREE.OrbitControls(camera, labelRenderer.domElement);
    controls.center.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));

    axesHelper = new THREE.AxesHelper(265);
    axesHelper.position.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));
    //scene.add(axesHelper);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;

    controls.minDistance = 0.6;
    controls.maxDistance = 9600;


    controls.maxPolarAngle = Math.PI / 2 - Math.PI / 10;
    //controls.maxPolarAngle = Math.PI / 2 + Math.PI / 6;
    controls.minPolarAngle = 0;
    var distance = 50;
    camera.position.set(MercatorGetXbyLongitude(centerPosition.lon), Math.sin(0.4) * distance, Math.cos(0.4) * distance - MercatorGetYbyLatitude(centerPosition.lat));

    mapGroup = new THREE.Group();
    scene.add(mapGroup);
    // world

    boundryGroup = new THREE.Group();
    scene.add(boundryGroup);

    peibianGroup = new THREE.Group();
    scene.add(peibianGroup);

    tongxin5GMapGroup = new THREE.Group();
    scene.add(tongxin5GMapGroup);

    regionBlockGroup = new THREE.Group();
    scene.add(regionBlockGroup);

    biandiansuo.group = new THREE.Group();
    scene.add(biandiansuo.group);

    biandiansuo.groupStl = new THREE.Group();
    scene.add(biandiansuo.groupStl);

    biandiansuo.groupObj = new THREE.Group();
    scene.add(biandiansuo.groupObj);
    //biandiansuoGroup = new THREE.Group();
    //scene.add(biandiansuoGroup);

    buildingsGroups = new THREE.Group();
    scene.add(buildingsGroups);

    courtGroup = new THREE.Group();
    scene.add(courtGroup);
    //buildingsGroups.onBeforeRender = function () {renderer.clearDepth();}

    measureLengthGroup = new THREE.Group();
    scene.add(measureLengthGroup);

    measureAreaGroup = new THREE.Group();
    scene.add(measureAreaGroup);

    polyLineGroup = new THREE.Group();
    scene.add(polyLineGroup);

    guangouGroup = new THREE.Group();
    scene.add(guangouGroup);

    pipe.lableGroup = new THREE.Group();
    scene.add(pipe.lableGroup);

    chaoliufenxiGroup = [];

    for (var i = 0; i < chaoliufenxiGroupCount; i++) {
        var g = new THREE.Group();
        chaoliufenxiGroup.push(g);
        chaoliuFenxiData.push([]);
        scene.add(g);
    }
    songdianquGroup = new THREE.Group();
    scene.add(songdianquGroup);

    environmentInfoGroup = new THREE.Group();
    scene.add(environmentInfoGroup);

    xingquDianGroup = {
        school: new THREE.Group(),
        hosipital: new THREE.Group(),
        shop: new THREE.Group(),
        factory: new THREE.Group(),
        environment: new THREE.Group(),
        government: new THREE.Group(),
        bank: new THREE.Group(),
        microStation: new THREE.Group()
        //unit: { school: null, hosipital: null }
    };

    scene.add(xingquDianGroup.school);
    scene.add(xingquDianGroup.hosipital);
    scene.add(xingquDianGroup.shop);
    scene.add(xingquDianGroup.factory);
    scene.add(xingquDianGroup.environment);
    scene.add(xingquDianGroup.government);
    scene.add(xingquDianGroup.bank);
    scene.add(xingquDianGroup.microStation);

    panorama.group = new THREE.Group();
    scene.add(panorama.group);

    drawTowerOfPowerLines.group = new THREE.Group();
    scene.add(drawTowerOfPowerLines.group);

    drawTowerOfPowerLines.lineGroup = new THREE.Group();
    scene.add(drawTowerOfPowerLines.lineGroup);

    drawTowerOfPowerLines.labelGroup = new THREE.Group();
    scene.add(drawTowerOfPowerLines.labelGroup);

    infoStream.group = new THREE.Group();
    scene.add(infoStream.group);
    infoStream.stationGroup = new THREE.Group();
    scene.add(infoStream.stationGroup);

    infoStream2.group = new THREE.Group();
    scene.add(infoStream2.group);
    infoStream2.stationGroup = new THREE.Group();
    scene.add(infoStream2.stationGroup);

    resource.mineralResourcesGroup = new THREE.Group();
    scene.add(resource.mineralResourcesGroup);

    workStream2.group = new THREE.Group();
    scene.add(workStream2.group);

    workStream2.lineGroup = new THREE.Group();
    scene.add(workStream2.lineGroup);

    workStream2.objGroup = new THREE.Group();
    scene.add(workStream2.objGroup);

    enegyStream2.initialize();

    enegyStream3.initialize();

    yingjiWeiwen.initialize();

    wangjia.initialize();

    taiqu.initialize();

    walkerIndexController.initialize();

    groupOfRoadDetail.initialize();

    {
        var measureGeometry = new THREE.PlaneGeometry(1, 1, 2);
        var measurematerial = new THREE.MeshBasicMaterial({
            color: 0x489dfb,
            //linewidth: 10,
            side: THREE.DoubleSide,
        });
        var measureLine = new THREE.Mesh(measureGeometry, measurematerial); //new THREE.Line(measureGeometry, measurematerial);
        //measureLine.rotateX(-Math.PI / 2);
        measureLengthGroup.add(measureLine);

        measureLengthObj.measureLineDiv = document.createElement('div');
        measureLengthObj.measureLineDiv.className = 'label_MeasureLine';
        measureLengthObj.measureLineDiv.textContent = 'Earth';
        measureLengthObj.measureLineDiv.style.marginTop = '-1em';
        measureLengthObj.measureLineDivLabel = new THREE.CSS2DObject(measureLengthObj.measureLineDiv);
        measureLengthObj.measureLineDivLabel.position.set(0, 0, 0);
        measureLengthGroup.add(measureLengthObj.measureLineDivLabel);
    }
    {
        measureAreaObj.measureAreaDiv = document.createElement('div');
        measureAreaObj.measureAreaDiv.className = 'label_MeasureLine';
        measureAreaObj.measureAreaDiv.textContent = 'Earth';
        measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
        measureAreaObj.measureAreaDivLabel = new THREE.CSS2DObject(measureAreaObj.measureAreaDiv);
        measureAreaObj.measureAreaDivLabel.position.set(0, 0, 0);
        measureAreaGroup.add(measureAreaObj.measureAreaDivLabel);
    }
    var geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });



    // lights
    {
        light1 = new THREE.PointLight(0xffffff);
        light1.position.set(0, 90000, 0);
        light1.intensity = 0.5;
        scene.add(light1);
    }
    {
        light2 = new THREE.PointLight(0xffffff);
        light2.position.set(0, 90000, -180000);
        light2.intensity = 0.5;
        scene.add(light2);
    }
    {
        light3 = new THREE.PointLight(0xffffff);
        light3.position.set(180000, 90000, -180000);
        light3.intensity = 0.5;
        scene.add(light3);
    }
    {
        light4 = new THREE.PointLight(0xffffff);
        light4.position.set(180000, 90000, 180000);
        light4.intensity = 0.5;
        scene.add(light4);
    }
    setIntensity(0.5);
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.2;

    mouse = new THREE.Vector2();
    //window.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onDocumentClick);
    //document.addEventListener('contextmenu', onDocumentRightClick);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);



    mapGroup.renderOrder = 0;
    boundryGroup.renderOrder = 9;

    biandiansuo.group.renderOrder = 9;
    peibianGroup.renderOrder = 9;
    tongxin5GMapGroup.renderOrder = 9;
    regionBlockGroup.renderOrder = 9;
    buildingsGroups.renderer = 10;


    controls.rotateSpeed = 0.06;
    controls.panSpeed = 0.2;

    //document.addEventListener('mousemove', onDocumentMouseMove, false);

    var ws = new WebSocket('ws://127.0.0.1:9760/websocket');
    ws.onopen = function (event) {
        ws.send('allMap');
        groupOfRoadDetail.started = true;
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log("数据已接收...", received_msg);
        var obj = JSON.parse(received_msg);
        if (obj.reqMsg == 'allMap' && obj.t == 'road') {
            drawRoadInfomation(obj.obj, obj.colors);
        }
        else if (obj.reqMsg == 'allMap' && obj.t == 'cross') {
            // drawRoadInfomation(obj.obj);
            drawCrosses(obj.obj);
        }
    };
}
var drawCrosses = function (obj) {
    for (var i = 0; i < obj.length; i++) {
        var x = MercatorGetXbyLongitude(obj[i]['lon']);
        var z = -MercatorGetYbyLatitude(obj[i]['lat']);
        var geometry = new THREE.RingGeometry(0.03, 0.05, 24);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI / 2);
        mesh.position.set(x, 0.05, z);

        scene.add(mesh);
    }
}

var materialOfRoad = new THREE.LineMaterial({
    color: 'yellow',
    linewidth: 0.003, // in pixels
    //vertexColors: 0x12f43d,
    ////resolution:  // to be set by renderer, eventually
    //dashed: false
});
var drawRoadInfomation = function (obj, colors) {
    var positions = [];

    for (var i = 0; i < obj.length; i++) {
        positions.push(
            MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),
            MercatorGetXbyLongitude(obj[i][2]), 0, -MercatorGetYbyLatitude(obj[i][3]),
            MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
            MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
            MercatorGetXbyLongitude(obj[i][6]), 0, -MercatorGetYbyLatitude(obj[i][7]),
            MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),

        );
        //{
        //    var points = [];
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][2]), 0, -MercatorGetYbyLatitude(obj[i][3])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1])));
        //    var geometryl = new THREE.BufferGeometry().setFromPoints(points);
        //    var materiall = new THREE.LineBasicMaterial({ color: 0x0000ff });
        //    var line = new THREE.Line(geometryl, materiall);
        //    guangouGroup.add(line);
        //}
        //{
        //    var points = [];
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][4]), 0.1, -MercatorGetYbyLatitude(obj[i][5])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][6]), 0.1, -MercatorGetYbyLatitude(obj[i][7])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][0]), 0.1, -MercatorGetYbyLatitude(obj[i][1])));
        //    points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][4]), 0.1, -MercatorGetYbyLatitude(obj[i][5])));
        //    var geometryl = new THREE.BufferGeometry().setFromPoints(points);
        //    var materiall = new THREE.LineBasicMaterial({ color: 0xff0000 });
        //    var line = new THREE.Line(geometryl, materiall);
        //    guangouGroup.add(line);
        //}
    }
    function disposeArray() {

      //  this.array = null;

    }
    console.log('p', positions);
    //var vertices = new Float32Array(positions);
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
    // geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).onUpload(disposeArray));
    geometry.computeBoundingSphere();
    //   var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
    var material = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending });
    var mesh = new THREE.Mesh(geometry, material);

    guangouGroup.add(mesh);

}

var groupOfRoadDetail =
{
    geometryLine: new THREE.BufferGeometry(),
    positons: [],
    group: null,
    started: false,
    ended: false,
    initialize: function () {
        this.group = new THREE.Group();
        scene.add(this.group);
    },
};

var startWalkFunction = function () {

}


var keyCommand = function (keyCode) {
    if (keyCode == 65) { // left
        console.log('点击', 'A');

        if (clickState == 'addPolyLine') {
            if (editedLine.state == 'addPointToEnd') {
                if (editedLine.currentPoint != null) {
                    var mousePosition = { x: editedLine.currentPoint.x, z: editedLine.currentPoint.z };
                    editedLine.points.push(mousePosition);
                }
            }
            else if (editedLine.state == 'addPointToMid') {
                if (editedLine.currentPoint != null) {
                    var mousePosition = { x: editedLine.currentPoint.x, z: editedLine.currentPoint.z };
                    if (editedLine.points.length == 0) {
                        editedLine.points.splice(0, 0.01, editedLine.currentPoint);
                    }
                    else if (editedLine.currentIndex >= 0) {
                        editedLine.points.splice(editedLine.currentIndex, 0.01, editedLine.currentPoint);
                    }
                }
            }
            else { }
        }
        else if (clickState == 'addShape') {
            setShapeAddPoint();
        }
        else if (clickState == 'editingPanorama') {
            panorama.addPoint();
        }
        else if (clickState == 'positionDxf') {
            ImporfDxf.left();
        }
        else if (clickState == 'addLineControlPoint') {
            var mousePosition = { x: drawTowerOfPowerLines.currentPoint.x, z: drawTowerOfPowerLines.currentPoint.z };
            drawTowerOfPowerLines.controlPoint.push(mousePosition);
        }
    }
    else if (keyCode == 66) { // left
        console.log('点击', 'B');
        //点击B，新增
        //for (var i; i < walkManager.data.length; i += 7) {
        //    walkManager.data[i + 6] -= walkManager.start;
        //}
        if (walkManager.data.length > 0) {
            walkerIndexController.init(walkManager.data.length / 6);
            walkerIndexController.show();
        }

        //walkManager.start = Date.now();
        //walkManager.end = Date.now(); 
        //结束，以html进行显示
    }
    else if (keyCode == 67) { // left
        console.log('点击', 'C');
        walkManager.start = Date.now();
        walkManager.data = [];

    }
    else if (keyCode == 86) { // left
        console.log('点击', 'V');
        walkManager.data.push(camera.position.x);
        walkManager.data.push(camera.position.y);
        walkManager.data.push(camera.position.z);
        walkManager.data.push(controls.target.x);
        walkManager.data.push(controls.target.y);
        walkManager.data.push(controls.target.z);
        //walkManager.data.push(Date.now());

    }
    else if (keyCode == 83) { // right
        console.log('点击', 'S');
        if (clickState == 'addPolyLine' && editedLine.points.length >= 2) {
            if (editedLine.state == 'addPointToEnd' || editedLine.state == 'addPointToMid') {
                editedLine.state = 'addPointToSave';
            }
            var geometry = [];
            for (var i = 0; i < editedLine.points.length; i++) {
                geometry.push(getBaiduPositionLon(editedLine.points[i].x));
                geometry.push(getBaiduPositionLat(-editedLine.points[i].z));
            }
            var sendMsg = JSON.stringify({ command: 'showDialog', selectType: 'polyline', geometry: geometry });
            top.postMessage(sendMsg, '*');
            console.log('iframe外发送信息', sendMsg);
        }
        else if (clickState == "addShape" && editedShape.points.length >= 2) {
            addShape.clickKeyS();

        }
        else if (clickState == 'positionDxf') {
            ImporfDxf.down();
        }
        else {
            //var sendMsg = JSON.stringify({ command: 'showDialog', selectType: 'no' });
            //top.postMessage(sendMsg, '*');
            //console.log('iframe外发送信息', sendMsg);
        }
    }
    else if (keyCode == 68) {
        // right
        //console.log('点击', 'D');
        if (clickState == 'addPolyLine')
            delPointLine();
        else if (clickState == 'addShape') {
            addShape.clickKeyD();
        }
        else if (clickState == 'positionDxf') {
            ImporfDxf.right();
        }
    }
    else if (keyCode == 69) { // right
        console.log('点击', 'E');
        if (clickState == 'addPolyLine') {
            if (editedLine.state == 'addPointToEnd') {
                editedLine.state = 'addPointToMid'
            }
            else if (editedLine.state == 'addPointToMid') {
                editedLine.currentIndex = -1;
                editedLine.state = 'addPointToEnd'
            }
            else {
                //throw Error('editedLine.state:' + editedLine.state);
            }
        }

        addShape.clickKeyE();
    }
    else if (keyCode == 87) { // right
        console.log('点击', 'W');
        if (clickState == 'positionDxf') {
            ImporfDxf.up();
        }
    }
    else if (keyCode == 81) { // right
        console.log('点击', 'Q');
        if (clickState == 'addPolyLine') {
            measureCancle();
        }
        else if (clickState == 'addShape') {
            measureCancle();
        }
    }
    else if (keyCode == 38) {
        console.log('点击', '↑');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.up();
        //}
    }
    else if (keyCode == 39) {
        console.log('点击', '→');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.right();
        //}
    }
    else if (keyCode == 40) {
        console.log('点击', '↓');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.down();
        //}
    }
    else if (keyCode == 37) {
        console.log('点击', '←');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.left();
        //}
    }
    else if (keyCode == 160) {
        console.log('点击', 'LShiftKey');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.zoom(1);
        //}
    }
    else if (keyCode == 162) {
        console.log('点击', 'LControlKey');
        //if (clickState == 'positionDxf') {
        //    ImporfDxf.zoom(-1);
        //}
    }
    else if (keyCode == 73) {
        console.log('点击', 'I');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoomX(1);
        }
    }
    else if (keyCode == 79) {
        console.log('点击', 'O');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoomX(-1);
        }
    }
    else if (keyCode == 74) {
        console.log('点击', 'J');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoomY(1);
        }
    }
    else if (keyCode == 75) {
        console.log('点击', 'K');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoomY(-1);
        }
    }
    else if (keyCode == 90) {
        console.log('点击', 'Z');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoom(1);
        }
    }
    else if (keyCode == 88) {
        console.log('点击', 'X');
        if (clickState == 'positionDxf') {
            ImporfDxf.zoom(-1);
        }
    }


}

function onDocumentRightClick(event) {
    if (clickState == 'areaMeasure') {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
            var minLength = 100000000;
            var removeIndex = -1;
            for (var i = 0; i < measureAreaObj.points.length; i++) {
                var lCal = Math.sqrt((mousePosition.x - measureAreaObj.points[i].x) * (mousePosition.x - measureAreaObj.points[i].x) + (mousePosition.z - measureAreaObj.points[i].z) * (mousePosition.z - measureAreaObj.points[i].z));
                if (lCal < minLength) {
                    minLength = lCal;
                    removeIndex = i;
                }
            }
            if (removeIndex >= 0) {
                measureAreaObj.points.splice(removeIndex, 1);
            }
            drawMeasuredArea();
        }
    }
}

var setRegionType = true;
var mouseClickInterviewState = {
    i: [0, 100000], step: 0, click: function () {
        this.i[this.step] = Date.now();
        this.step++;
        this.step = this.step % 2;
        if (Math.abs(this.i[1] - this.i[0]) < 320) {
            console.log('双击时间', Math.abs(this.i[1] - this.i[0]));
            return true;
        }
        else {
            console.log('双击时间', Math.abs(this.i[1] - this.i[0]));
            return false;
        }
    },
    init: function () { this.i[0] = 0; this.i[1] = 100000; this.step = 0; }
};
function onDocumentClick(event) {
    if (mouseClickInterviewState.click()) {
        mouseClickInterviewState.init()
    }
    else {
        return;
    }

    if (clickState == 'objClick') {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //alert(mouse.x + ',' + mouse.y);
        raycaster.setFromCamera(mouse, camera);
        var minLength = 100000000;
        var selectObj = null;
        var selectType = '';
        if (false)//
            if (peibianGroup.visible) {
                var intersects = raycaster.intersectObjects(peibianGroup.children);
                if (intersects.length > 0) {
                    for (var i = 0; i < intersects.length; i++) {
                        if (intersects[i].distance < minLength) {
                            selectObj = intersects[i].object;
                            selectType = 'peibian';
                            minLength = intersects[i].distance;
                        }
                    }
                }
                //
            }

        if (tongxin5GMapGroup.visible) {
            var intersects = raycaster.intersectObjects(tongxin5GMapGroup.children);
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < minLength) {
                        selectObj = intersects[i].object;
                        selectType = 'tongxin5G';
                        minLength = intersects[i].distance;
                    }
                }
            }
        }

        if (regionBlockGroup.visible) {
            var intersects = raycaster.intersectObjects(regionBlockGroup.children);
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < minLength) {
                        selectObj = intersects[i].object;
                        selectType = 'regionBlock';
                        minLength = intersects[i].distance;
                    }
                }
            }
        }
        if (electricLine.group.visible) {
            var checkObjs = [];
            for (var i = 0; i < electricLine.group.children.length; i++) {
                if (electricLine.group.children[i].type == 'Line') {
                    checkObjs.push(electricLine.group.children[i]);
                }
            }
            var intersects = raycaster.intersectObjects(checkObjs);
            if (intersects.length > 0) {

                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < minLength) {
                        selectObj = intersects[i].object;
                        selectType = 'line';
                        minLength = intersects[i].distance;
                    }
                }
            }
        }
        if (biandiansuo.group.visible) {
            var intersects = raycaster.intersectObjects(biandiansuo.group.children);
            if (intersects.length > 0) {

                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < minLength) {
                        selectObj = intersects[i].object;
                        selectType = 'line';
                        minLength = intersects[i].distance;
                    }
                }
            }
        }

        if (xingquDianGroup.factory.visible) {
            var intersects = raycaster.intersectObjects(xingquDianGroup.factory.children);
            if (intersects.length > 0) {

                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < minLength) {
                        selectObj = intersects[i].object;
                        selectType = 'line';
                        minLength = intersects[i].distance;
                    }
                }
            }
        }

        if (buildingsGroups.visible) {
            for (var i = 0; i < buildingsGroups.children.length; i++) {
                var intersects = raycaster.intersectObjects(buildingsGroups.children[i].children);
                if (intersects.length > 0) {

                    for (var j = 0; j < intersects.length; j++) {
                        if (intersects[j].distance < minLength) {
                            selectObj = intersects[j].object.parent;
                            selectType = 'building';
                            minLength = intersects[j].distance;
                        }
                    }
                }

            }
        }

        if (biandiansuo.groupStl.visible) {
            for (var i = 0; i < biandiansuo.groupStl.children.length; i++) {
                var intersects = raycaster.intersectObjects(biandiansuo.groupStl.children);
                if (intersects.length > 0) {

                    for (var j = 0; j < intersects.length; j++) {
                        if (intersects[j].distance < minLength) {
                            selectObj = intersects[j].object;
                            selectType = 'biandiansuo';
                            minLength = intersects[j].distance;
                        }
                    }
                }

            }
        }

        if (biandiansuo.groupObj.visible) {
            for (var i = 0; i < biandiansuo.groupObj.children.length; i++) {
                var intersects = raycaster.intersectObjects(biandiansuo.groupObj.children[i].children);
                if (intersects.length > 0) {

                    for (var j = 0; j < intersects.length; j++) {
                        if (intersects[j].distance < minLength) {
                            selectObj = intersects[j].object.parent;
                            selectType = 'transformer';
                            minLength = intersects[j].distance;
                        }
                    }
                }

            }
        }

        if (selectObj != null) {
            //{command:'showInformation', selectType: 'peibian', Tag: selectObj.Tag }
            var sendMsg = JSON.stringify({ command: 'showInformation', selectType: selectType, Tag: selectObj.Tag })
            top.postMessage(sendMsg, '*');
            console.log('iframe外发送信息', sendMsg);

            if (setRegionType) {
                if (selectType == "regionBlock") {
                    //var msgPromt =
                    //    "9	河道\r 10	公园绿地 \r 11	居住用地  \r 12	教育科研用地 \r 13	商业服务业设施用地  \r 14	行政办公用地 \r 15	医疗用地 \r其他用地属性请在表area_wise_type 中添加";
                    //var regionTypeID = prompt(msgPromt, 9);
                    //var dg = new DataGet();
                    //dg.setTypeIDOfRegionID(selectObj.Tag.code, regionTypeID);
                }
            }
        }
    }
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    else if (clickState == 'lengthMeasure') {
        //var intersects = raycaster.intersectObjects(mapGroup.children);
        //console.r
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        //console.log('raycaster', raycaster);
        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
            if (measureLengthObj.state == 0) {
                measureLengthObj.start.x = mousePosition.x;
                measureLengthObj.start.y = -mousePosition.z;
                measureLengthObj.end.x = mousePosition.x + 0.001;
                measureLengthObj.end.y = -mousePosition.z - 0.001;
                measureLengthObj.state = 1;

            }
            else if (measureLengthObj.state == 1) {
                if (Math.abs(mousePosition.x - measureLengthObj.end.x) > 0.002)
                    measureLengthObj.end.x = mousePosition.x;
                if (Math.abs(measureLengthObj.end.y + mousePosition.z) > 0.002)
                    measureLengthObj.end.y = -mousePosition.z;
                measureLengthObj.state = 2;

            }
        }
    }
    else if (clickState == 'areaMeasure') {
        randomV = Math.random() * 2 + 0.8;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
            measureAreaObj.points.push(mousePosition);
            drawMeasuredArea();
        }


        //if (measureLengthObj.state == 0) {
        //    measureLengthObj.start.x = mousePosition.x;
        //    measureLengthObj.start.y = -mousePosition.z;
        //    measureLengthObj.end.x = mousePosition.x + 0.001;
        //    measureLengthObj.end.y = -mousePosition.z - 0.001;
        //    measureLengthObj.state = 1;

        //}
        //else if (measureLengthObj.state == 1) {
        //    if (Math.abs(mousePosition.x - measureLengthObj.end.x) > 0.002)
        //        measureLengthObj.end.x = mousePosition.x;
        //    if (Math.abs(measureLengthObj.end.y + mousePosition.z) > 0.002)
        //        measureLengthObj.end.y = -mousePosition.z;
        //    measureLengthObj.state = 2;

        //}
    }
    else if (clickState == 'addPolyLine') {
        if (editedLine.state == 'addPointToEnd' || editedLine.state == 'addPointToMid') {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            //console.log('raycaster', raycaster);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

                // editedLine.points.push(mousePosition);
            }
        }
    }
    else if (clickState == 'addLineControlPoint') {

    }
}


var mouseClickElementInterviewState = {
    i: [0, 100000], step: 0, click: function () {
        this.i[this.step] = Date.now();
        this.step++;
        this.step = this.step % 2;
        if (Math.abs(this.i[1] - this.i[0]) < 320) {
            console.log('双击时间', Math.abs(this.i[1] - this.i[0]));
            return true;
        }
        else {
            console.log('双击时间', Math.abs(this.i[1] - this.i[0]));
            return false;
        }
    },
    init: function () { this.i[0] = 0; this.i[1] = 100000; this.step = 0; }
};

var mouse = new THREE.Vector2();
function onDocumentMouseMove(event) {


    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


    if (clickState == 'lengthMeasure') {
        //   event.preventDefault();
        //if (measureLengthGroup.visible) { }
        //else
        //{
        //    measureLengthGroup.visible = true;
        //}

        raycaster.setFromCamera(mouse, camera);
        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
            if (measureLengthObj.state == 0) {
                measureLengthObj.start.x = mousePosition.x;
                measureLengthObj.start.y = -mousePosition.z;
                measureLengthObj.end.x = mousePosition.x;
                measureLengthObj.end.y = -mousePosition.z;
                //measureLengthObj.state = 1;
                //alert('设置了起点');
            }
            else if (measureLengthObj.state == 1) {
                measureLengthObj.end.x = mousePosition.x;
                measureLengthObj.end.y = -mousePosition.z;
                // measureLengthObj.state = 2;
                //alert('设置了2点');

                // measureLengthObj.result=
            }
        }
    }
    else if (clickState == 'objClick') {
        raycaster.setFromCamera(mouse, camera);
        drawTowerOfPowerLines.select(raycaster);
        pipe.select(raycaster);
    }
    else {

    }
}

var randomV = Math.random() * 2 + 0.8;
var updateLineMeasure = function () {
    if (clickState == 'lengthMeasure') {
        if (measureLengthObj.state == 1 || measureLengthObj.state == 2) {
            //measureLengthGroup.children[0].geometry.vertices = [];
            var vertices = [];
            {

                //var xfloat = MercatorGetXbyLongitude(measureLengthObj.start.lon);
                //var yfloat = MercatorGetYbyLatitude(measureLengthObj.start.lat);
                //vertices.push(xfloat, 1, -yfloat);


                //measureLengthGroup.children[0].geometry.vertices[0].x = xfloat;
                //measureLengthGroup.children[0].geometry.vertices[0].y = 1;
                //measureLengthGroup.children[0].geometry.vertices[0].z = -yfloat;
                // measureLengthGroup.children[0].start = new THREE.Vector3(xfloat, 0, -);
            }
            {
                var scale = Math.sqrt((measureLengthObj.start.x - measureLengthObj.end.x) * (measureLengthObj.start.x - measureLengthObj.end.x) + (measureLengthObj.start.y - measureLengthObj.end.y) * (measureLengthObj.start.y - measureLengthObj.end.y));
                //var xfloat = MercatorGetXbyLongitude(measureLengthObj.end.lon);
                //var yfloat = MercatorGetYbyLatitude(measureLengthObj.end.lat);
                measureLengthGroup.children[0].position.set((measureLengthObj.start.x + measureLengthObj.end.x) / 2, scale / 50, (-measureLengthObj.start.y - measureLengthObj.end.y) / 2);
                measureLengthGroup.children[0].scale.set(scale / 50, scale, 1);
                // vertices.push(xfloat, 0, -yfloat);

                if (scale > 0) {
                    var deltaY = measureLengthObj.start.y - measureLengthObj.end.y;
                    var angleY = measureLengthObj.getAngleF(measureLengthObj.start.x, measureLengthObj.start.y, measureLengthObj.end.x, measureLengthObj.end.y);
                    //measureLengthGroup.children[0].rotateY(angleY);
                    measureLengthGroup.children[0].rotation.set(Math.PI / 2, 0, -angleY + Math.PI / 2);
                    // measureLengthGroup.children[0].rotation.y = angleY;
                    //measureLengthGroup.children[0].rotation.set(0, angleY, 0);
                }
                //measureLengthGroup.children[0].geometry.vertices[1].x = xfloat;
                //measureLengthGroup.children[0].geometry.vertices[1].y = 1;
                //measureLengthGroup.children[0].geometry.vertices[1].z = -yfloat;
            }
            {
                //var angleRotateY=Math
            }
            {
                measureLengthObj.result = getLengthOfTwoPoint(getBaiduPositionLon(measureLengthObj.start.x), getBaiduPositionLat(measureLengthObj.start.y), getBaiduPositionLon(measureLengthObj.end.x), getBaiduPositionLat(measureLengthObj.end.y));
            }
            //measureLengthObj.measureLineDiv.textContent = 'Earth';

            measureLengthObj.measureLineDivLabel.position.set((measureLengthObj.start.x + measureLengthObj.end.x) / 2, 0.1, -(measureLengthObj.start.y + measureLengthObj.end.y) / 2);
            var msg = '';
            if (measureLengthObj.result >= 1000) {
                msg = Math.round(measureLengthObj.result / 10) * 10 / 1000 + 'km';
            }
            else {
                msg = Math.round(measureLengthObj.result) + 'm';
            }
            measureLengthObj.measureLineDiv.textContent = msg;
        }
    }
    else if (clickState == 'areaMeasure') {
        var max_x = -1000000;
        var min_x = 1000000;

        var max_z = -1000000;
        var min_z = 1000000

        var x_v = 0;
        var z_v = 0;
        var area = 0;
        var k = 1;
        var c = 0;
        for (var i = 0; i < measureAreaObj.points.length; i++) {
            if (measureAreaObj.points[i].x > max_x) {
                max_x = measureAreaObj.points[i].x;
            }
            if (measureAreaObj.points[i].x < min_x) {
                min_x = measureAreaObj.points[i].x;
            }
            if (measureAreaObj.points[i].z > max_z) {
                max_z = measureAreaObj.points[i].z;
            }
            if (measureAreaObj.points[i].z < min_z) {
                min_z = measureAreaObj.points[i].z;
            }

            var previous = measureAreaObj.points[(i - 1 + measureAreaObj.points.length) % measureAreaObj.points.length];
            var current = measureAreaObj.points[i];

            area += previous.x * current.z - previous.z * current.x;
            c += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
        }
        if (measureAreaObj.points.length > 1) {
            area = area / 2;
            var areaRealWidth = getLengthOfTwoPoint(getBaiduPositionLon(min_x), getBaiduPositionLat((-min_z - max_z) / 2), getBaiduPositionLon(max_x), getBaiduPositionLat((-min_z - max_z) / 2));
            var areaRealHeight = getLengthOfTwoPoint(getBaiduPositionLon((min_x + max_x) / 2), getBaiduPositionLat(-min_z), getBaiduPositionLon((min_x + max_x) / 2), getBaiduPositionLat(-max_z));


            var length1 = getLengthOfTwoPoint(getBaiduPositionLon(min_x), getBaiduPositionLat(-min_z), getBaiduPositionLon(max_x), getBaiduPositionLat(-max_z));
            var areaProjection = Math.abs((max_x - min_x) * (max_z - min_z));
            if (areaProjection > 1e-5) {
                area = area / areaProjection * (areaRealWidth * areaRealHeight);
                var cStr = c > 1000 ? ((Math.round(c / 10) / 100) + '千米') : ((Math.round(c)) + '米');
                var areaStr = Math.abs((Math.round(area))) + '平米';
                measureAreaObj.measureAreaDiv.textContent = '周长：' + cStr + ',面积：' + areaStr + ',负荷密度：' + Math.round((c / 100 * randomV), 2) + '兆瓦/平方公里';
            }
            else {
                measureAreaObj.measureAreaDiv.textContent = ' ';
            }
        }
        else {
            measureAreaObj.measureAreaDiv.textContent = ' ';
        }
        //if (measureAreaObj.points.length > 0) {
        //    x_v = x_v / measureAreaObj.points.length;
        //    z_v = z_v / measureAreaObj.points.length;
        //}
        measureAreaObj.measureAreaDivLabel.position.set((min_x + max_x) / 2, 0.1, (min_z + max_z) / 2);
    }
    else if (clickState == 'addPolyLine') {
        drawEditLine();
    }
    else if (clickState == 'addShape') {
        drawEditShape();
        addShape.updateLineMeasure();
    }
    else if (clickState == 'addLineControlPoint') {
        //  drawEditShape();
        //addShape.updateLineMeasure();
        drawTowerOfPowerLines.updatePosition();
    }
}



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //  mapRender.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);

    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    //cssLabelRenderer.setSize(window.innerWidth, window.innerHeight);
}

var doC = true;
function animate() {
    if (doC) {
        requestAnimationFrame(animate);

        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        //   updateNearAndFar();

        updatePlaneLineScale();
        //  updateMap();

        updateScale();

        updateCursor();
        //updateTransformer();
        //updateBoundryLine();
        updateLineMeasure();
        electricLine.UpdateRunDate();
        infoStream2.update();
        workStream2.update();

        enegyStream2.update();
        enegyStream3.update();

        animateChaoliuFenxi();
        //mapRender.render(sceneMap, camera);

        walkManager.walk();
        //  infomationHtml.animate();
        render();
        labelRenderer.render(scene, camera);
        //label2Renderer.render(scene, camera);
        //cssLabelRenderer.render(scene, camera);
        //updateMap();
    }
}

function updateNearAndFar() {
    var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
        (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
        (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
    //https://stackoverflow.com/questions/50572421/three-js-i-cant-change-far-and-near-plan-of-camera-why
    camera.near = l / 3;
    camera.far = l / 3 * 100;
    camera.updateProjectionMatrix();
}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
}

var updateMapContinue = true;

var timeRocord = 0;

var loadMap = function () {
    var loader = new THREE.TextureLoader();
    loader.load('Pic/eall19.jpg',
        function (texture) {
            //texture.minFilter = THREE.LinearFilter;
            var material = new THREE.MeshLambertMaterial({
                map: texture
            });
            var geometry = new THREE.PlaneGeometry(91, 80, 1, 1);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                97856 + 91 / 2,
                0,
                0 - (35414 + 80 / 2)
            );
            mesh.name = 'eall19';
            mapGroup.add(mesh);
        }, undefined, function (err) {
        });
}

var namesShouldShow = [];
function updateMap() {

    switch (constMapt) {
        case 'showMapOfResource':
            {
                mapGroup.visible = false;
                resource.mineralResourcesGroup.visible = true;
            }; break;

        default:
            {
                if (Math.abs(timeRocord - Date.now()) >= 0) {
                    resource.mineralResourcesGroup.visible = false;
                    { mapGroup.visible = true; }
                    timeRocord = Date.now();
                    if (updateMapContinue) {
                        if (true) {

                            mapGroup.position.setX(mapDelta.deltaX);
                            mapGroup.position.setZ(mapDelta.deltaZ);
                            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));


                            var zoom = Math.round(22 - Math.log2(l));
                            if (zoom > 19) {
                                zoom = 19;
                            }
                            else if (zoom < 10) {
                                zoom = 10;
                            }
                            //camera.near = l / 20;
                            //camera.far = l * 5;

                            updateXingquDianGroup(l);
                            updatePeibianGroup(l);
                            update5GGroup(l);
                            //console.log('zoom', zoom);
                            var x = controls.target.x / Math.pow(2, 19 - zoom);;
                            var zValue = controls.target.z / Math.pow(2, 19 - zoom);

                            electricLine.group.scale.set(1, l / 50, 1);
                            biandiansuo.group.scale.set(1, l / 50, 1);

                            if ((mercatoCenter.zoom - zoom) * (mercatoCenter.zoom - zoom) + (mercatoCenter.zValue - zValue) * (mercatoCenter.zValue - zValue) + (mercatoCenter.x - x) * (mercatoCenter.x - x) > 1) {
                                mercatoCenter.x = x;
                                mercatoCenter.zValue = zValue;
                                mercatoCenter.zoom = zoom;
                                var idsShouldShow = [];
                                var y = zValue;
                                var z = zoom;
                                namesShouldShow = [];
                                x = Math.round(Math.floor(x));
                                y = -Math.round(Math.floor(y));
                                for (var i = x - 7; i < x + 7; i++) {
                                    for (var j = y - 7; j < y + 7; j++) {
                                        idsShouldShow.push({ x: i, y: j, z: z, t: constMapt });
                                        namesShouldShow.push(constMapt + '_' + i + '_' + j + '_' + z);
                                    }
                                }

                                var drawMapF = function (data, setSession) {
                                    if (data == 'no') { return false };
                                    var objGet;
                                    try {
                                        if (setSession) objGet = JSON.parse(data);
                                        else objGet = data;
                                    }
                                    catch (e) {
                                        throw e;
                                    }
                                    if (mapGroup.getObjectByName(objGet.n)) { }
                                    else {
                                        var loader = new THREE.TextureLoader();
                                        loader.load(
                                            objGet.img,
                                            function (texture) {
                                                var material = new THREE.MeshLambertMaterial({
                                                    map: texture
                                                });
                                                //  material.depthTest = false;
                                                material.renderOrder = 0;
                                                var geometry = new THREE.PlaneGeometry(1, 1);
                                                mesh = new THREE.Mesh(geometry, material);
                                                mesh.position.set(
                                                    (objGet.x + 0.5) * Math.pow(2, 19 - objGet.z),
                                                    0,
                                                    0 - (objGet.y + 0.5) * Math.pow(2, 19 - objGet.z)
                                                );

                                                mesh.rotateX(-Math.PI / 2);
                                                mesh.scale.set(Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z));
                                                mesh.name = objGet.n;
                                                mesh.renderOrder = 0;
                                                mesh.visible = objGet.exit;
                                                mesh.receiveShadow = true;
                                                if (!mapGroup.getObjectByName(objGet.n))
                                                    mapGroup.add(mesh);
                                            }, undefined, function (err) {
                                            })



                                        //position是正方体中心的坐标，所以要加0.5


                                        if (setSession) {
                                            if (!mapGroupData[objGet.n])
                                                mapGroupData[objGet.n] = objGet;
                                        }
                                    }
                                    return true;
                                    //localStorage[] = data;
                                }
                                for (var i = 0; i < idsShouldShow.length; i++) {
                                    var name = idsShouldShow[i].t + '_' + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z;
                                    var xValue = idsShouldShow[i].x;
                                    var yValue = idsShouldShow[i].y;
                                    var zValue = idsShouldShow[i].z;
                                    var tValue = idsShouldShow[i].t;
                                    if (mapGroupData[name]) {
                                        drawMapF(mapGroupData[name], false);
                                    }
                                    else

                                        if (runFromNginx) {

                                            if (idsShouldShow[i].t == 'e' || idsShouldShow[i].t == 'm') {
                                                $.get('MapPathText/' + idsShouldShow[i].t + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z + '.txt', idsShouldShow[i], function (data, status) {
                                                    //alert("Data: " + data + "nStatus: " + status);
                                                    if (drawMapF(data, true)) { }
                                                    else {
                                                        mapGroupData[name] = JSON.stringify({ "img": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAASdFESAAQAAAABAAASdAAAAAAAAYagAACxj//bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APf6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z", "x": xValue, "y": yValue, "z": zValue, "t": tValue, "n": name, "exit": false });
                                                    }
                                                });
                                            }
                                            if (idsShouldShow[i].t == 'y2003' || idsShouldShow[i].t == 'y2011' || idsShouldShow[i].t == 'y2014' || idsShouldShow[i].t == 'y2017' || idsShouldShow[i].t == 'r') {
                                                //y201797957_35474_19
                                                $.get('MapPathText/' + idsShouldShow[i].t + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z + '.txt', idsShouldShow[i], function (data, status) {
                                                    //alert("Data: " + data + "nStatus: " + status);
                                                    if (drawMapF(data, true)) { }
                                                    else {
                                                        mapGroupData[name] = JSON.stringify({ "img": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAASdFESAAQAAAABAAASdAAAAAAAAYagAACxj//bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APf6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z", "x": xValue, "y": yValue, "z": zValue, "t": tValue, "n": name, "exit": false });
                                                    }
                                                });
                                            }

                                        }
                                        else
                                            $.get("DAL/MapImage.ashx", idsShouldShow[i], function (data, status) {
                                                //alert("Data: " + data + "nStatus: " + status);
                                                drawMapF(data, true);
                                            });
                                }
                                for (var i = mapGroup.children.length - 1; i >= 0; i--) {
                                    if (namesShouldShow.indexOf(mapGroup.children[i].name) < 0) {

                                        setTimeout(function (removeName) {
                                            if (namesShouldShow.indexOf(removeName) < 0)
                                                mapGroup.remove(mapGroup.getObjectByName(removeName));
                                        }, 500, mapGroup.children[i].name)
                                    }
                                }

                                if (zoom >= 16) {
                                    electricLine.updateLabelOfLine();
                                }
                                else {
                                    electricLine.clearLabelOfLine();
                                }
                                // 

                            }
                            else {
                                //console.log('计算值', (mercatoCenter.zoom - zoom) * (mercatoCenter.zoom - zoom) + (mercatoCenter.zValue - zValue) * (mercatoCenter.zValue - zValue) + (mercatoCenter.x - x) * (mercatoCenter.x - x));
                            }
                        }
                    }
                }

            }; break;
    }

}

var testUpdateMap = function () {
    var loader = new THREE.TextureLoader();
    //loader.wrapS = 1;
    //loader.wrapT = 1;
    //loader.repeat.set(256, 256);

    loader.load(
        'Pic/e10_3_6.jpg',
        function (texture) {
            var index = Number.parseInt(prompt('输入', 0));
            //texture.repeat.set(1, 1);
            //texture.wrapS = 256; 
            //texture.wrapT = 256;
            texture.repeat.set(1, 1);

            mapMesh.material[index] = new THREE.MeshBasicMaterial({
                map: texture
            });

        });
}

function test() {

    $.get("http://localhost:2023/DAL/MapImage.ashx?x=10&y=3&z=6", function (data, status) {
        alert("Data: " + data + "nStatus: " + status);
    });

}
function receiveMessage(event) {
    var obj = JSON.parse(event.data);
    //clickState = 'objClick';
    //var xx= {data:JSON.stringify( { 'command': 'search', t: 'peibian', 'selectType': 'errorType','exceptionName':'overload','exceptionState':'2' })} 
    //receiveMessage(xx)
    switch (obj.command) {
        case 'setMap':
            {
                //{'command': 'setMap', t:'showMapOfResource'}
                setMap(obj.t);
                return;
            }; break;
        case 'drawBoundry':
            {
                drawBoundry(obj.t);
                return;
            }; break;
        case 'drawPeibian':
            {
                //  { 'command': 'drawPeibian', t: 'show'/'hide',abnormalTypeOrOverload:'overload'/'abnormalType'/'black'}  调用最新的配变数据
                drawPeibian_Icon(obj.t, obj.abnormalTypeOrOverload);
                return;
            }; break;
        case 'drawPeibianWithDate':
            {
                //  { 'command': 'drawPeibianWithDate', t: 'show'/'hide', 'date': '2020-06-03',abnormalTypeOrOverload:'overload'/'abnormalType'}  调用指定日期的配变数据
                drawPeibian_IconWithDate(obj.t, obj.date, obj.abnormalTypeOrOverload);
                return;
            }; break;
        case 'drawTongxin5G':
            {
                drawTongxin5G_newData(obj.t);
                //  drawTongxin5G(obj.t);
                return;
            }; break;
        case 'drawRegionBlock':
            {
                drawRegionBlock(obj.t);
                return;
            }; break;
        case 'drawLine':
            {
                electricLine.draw(obj.t);
                //drawLine();
                return;
            }; break;
        case 'drawBiandiansuo':
            {
                drawBiandiansuo(obj.t);
                return;
            }; break;
        case 'drawBiandiansuo2':
            {
                biandiansuo.loadStl(obj.t);
                //    drawBiandiansuo(obj.t);
                return;
            }; break;
        case 'drawBuildings':
            {
                drawBuildings(obj.t);
                return;
            }; break;
        case 'drawCommunity':
            {
                drawCommunity(obj.t);
                return;
            }; break;
        case 'drawGuangou':
            {
                drawLine2(obj.t);
                return;
            }; break;
        case 'drawChaoliufenxi':
            {
                drawChaoliufenxi(obj.t);
                return;
            }; break;
        case 'drawSongdianquyu':
            {
                drawSongdianquyu(obj.t);
                return;
            }; break;
        case 'search':
            {
                switch (obj.t) {
                    case 'peibian':
                        {
                            //alert('开始搜索：' + obj.keyWords);
                            //var keyWords = obj.keyWords;
                            //searchCondition.peibianObj.name = keyWords;
                            //searchPeibian(keyWords);
                            switch (obj.selectType) {
                                case 'name':
                                    {
                                        //   { 'command': 'search', t: 'peibian', 'selectType': 'name','keyWords':'万达' }  用名字进行搜索
                                        var keyWords = obj.keyWords;
                                        searchCondition.peibianObj.name = keyWords;
                                        searchCondition.peibianObj.State.name = 'xxxxxxxx';
                                        searchCondition.peibianObj.State.state = '-1';
                                    }; break;
                                case 'errorType':
                                    {
                                        //   { 'command': 'search', t: 'peibian', 'selectType': 'errorType','exceptionName':'abnormalType','exceptionState':'0' }  用名字进行搜索
                                        searchCondition.peibianObj.name = null;
                                        var exceptionName = obj.exceptionName + '';
                                        var exceptionState = obj.exceptionState + '';
                                        searchCondition.peibianObj.State.name = exceptionName;
                                        searchCondition.peibianObj.State.state = exceptionState;
                                    }; break;
                            }
                            return;
                        }; break;
                    case 'tongxin5G':
                        {
                            //alert('开始搜索：' + obj.keyWords);
                            var keyWords = obj.keyWords;
                            searchTongxin5G(keyWords);
                            return;
                        }; break;
                    case 'regionBlock':
                        {
                            var keyWords = obj.keyWords;
                            searchRegionBlock(keyWords);
                            return;
                        }; break;
                    case 'line':
                        {

                            //显示变电站下的线路
                            //{ 'command': 'search', 't': 'line', 'keyWords': [0, 1, 2, 3, 4, 5] }
                            var keyWords = obj.keyWords;

                            searchCondition.eLObj.lineShowIndex = keyWords;


                            // searchLineByIndex(keyWords);
                            return;
                            // searchLine(keyWords);
                        }; break;
                    case 'lineName':
                        {
                            //显示变电站下的线路
                            //{ 'command': 'search', 't': 'line', 'keyWords': [0, 1, 2, 3, 4, 5] }
                            ////用异常搜索线路
                            //{ 'command': 'search', 't': 'lineException', 'exceptionType': 'abnormalType', 'exceptionState': '2' }
                            ////用名字搜索线路
                            //{ 'command': 'search', 't': 'lineName', 'keyWords': '育英线814' }
                            var keyWords = obj.keyWords;
                            searchCondition.eLObj.initial();
                            searchCondition.eLObj.name = keyWords;
                            //searchCondition.eLObj.
                            //searchLineByName(keyWords);
                            // searchLine(keyWords);
                            return;
                        }; break;
                    case 'lineException':
                        {
                            //用异常搜索线路
                            //{ 'command': 'search', 't': 'lineException', 'exceptionType': 'abnormalType', 'exceptionState': '2' }
                            var exceptionType = obj.exceptionType + '';
                            var exceptionState = obj.exceptionState + '';
                            searchCondition.eLObj.initial();
                            searchCondition.eLObj.State.name = exceptionType;
                            searchCondition.eLObj.State.state = exceptionState;
                            //searchCondition.eLObj.
                            //searchLineByName(keyWords);
                            // searchLine(keyWords);
                            return;
                        }; break;

                    case 'lineExceptionByTime':
                        {
                            // { 'command': 'search', 't': 'lineExceptionByTime', 'date': '2020-01-01'}
                            searchCondition.eLObj.initial();
                            var dt = obj.date + '';
                            (new DataGet()).getLineExceptionInfo(dt, function (dt) { });
                            return;
                        }; break;
                    case 'biandiansuo':
                        {
                            var keyWords = obj.keyWords;
                            searchBiandiansuo(keyWords);
                            return;
                        }; break;
                    case 'buildings':
                        {
                            var keyWords = obj.keyWords;
                            searchBuildings(keyWords);
                            return;
                        }; break;
                    default:
                        {
                            throw '没法处理：' + event.data;
                            return;
                        }
                };
                return;
            }; break;
        case 'measureLine':
            {
                begainMeasureLength();
                //clickState = 'lengthMeasure';
                //measureLengthObj.state = 0;
                //measureLengthObj.result = 0;
                return;
            }; break;
        case 'drawXingquDian': {
            //t=show/hide;a=shop/school/hospital
            // //  { 'command': 'drawXingquDian', t: 'show'/'hide', 'a': 'microStation'}  显示微站
            drawXingquDian_2(obj.t, obj.a);
            return;
        }; break;
        case 'houmen1': {
            //t=show/hide;a=shop/school/hospital
            //houmen1();
            //return;
        }; break;
        case 'keyInput': { keyCommand(obj.t); return; }; break;
        case 'measureArea': { begainMeasureArea(); return; }; break;
        case 'measureCancle': { measureCancle(); return; }; break;
        case 'polygon': { begainEditShape(); return; }; break;
        case 'polyLine': { begainEditLine(); return; }; break;
        case 'panorama':
            {
                panorama.draw(obj.t);
                ; return;
            }; break;
        case 'positionDxf':
            {
                begainPositionDxf();
            }; break;
        case 'uploadDxf':
            {
                //obj.t为文件名 如xxxxx.dxf
                // alert('文件名为：' + obj.t);
                console.log('obj.t', obj.t);
                ImporfDxf.imporf(obj.t);
            }; break;
        case 'setWalker':
            {
                //alert('开始执行setWalker');
                //alert(`code:${obj.Code}`);
                walkerIndexController.action(obj.Code);
            }; break;
        case 'drawTower':
            {
                //  { 'command': 'drawTower', t: 'show'/'hide'}
                drawTowerOfPowerLines.drawLines(obj.t)
            }; break;
        case 'infoStream':
            {
                infoStream2.draw(obj.t);
            }; break;
        case 'workStream':
            {
                //{ 'command': 'workStream', t: 'show'/'hide'}
                workStream2.draw(obj.t);
                // infoStream.draw(obj.t);
            }; break;
        case 'duozhanronghe':
            {
                //{ 'command': 'duozhanronghe', t: 'show'/'hide'}
                enegyStream2.draw(obj.t);
                //    infoStream2.draw(obj.t);
            }; break;

        case 'showAllTaiqu':
            {
                //{ 'command': 'showAllTaiqu', t: 'show'/'hide'}
                taiqu.draw(obj.t);
                // infoStream.draw(obj.t);
            }; break;
        case 'showAllWangjia':
            {
                //{ 'command': 'showAllWangjia', t: 'show'/'hide'}
                wangjia.draw(obj.t);
            }; break;
        case 'showYingjiweiwen':
            {
                //{ 'command': 'showYingjiweiwen', t: 'show'/'hide'}
                yingjiWeiwen.show(obj.t);
                //wangjia.draw(obj.t);
            }; break;

    }
    // ...
}
window.addEventListener("message", receiveMessage, false);

function measureCancle() {
    clickState = 'objClick'
    {
        measureLengthGroup.children[0].position.set(0, 0.01, 0);
        var scale = 1;
        measureLengthGroup.children[0].scale.set(scale, scale, scale);
        measureLengthGroup.children[0].rotation.set(0, 0, 0);

        measureLengthObj.result = 0;
        measureLengthObj.measureLineDivLabel.position.set(0, 0.1, 0);
        measureLengthObj.measureLineDiv.textContent = '';
    }
    {
        for (var i = measureAreaGroup.children.length - 1; i >= 1; i--) {
            measureAreaGroup.remove(measureAreaGroup.children[i]);
        }
        measureAreaObj.points = [];
        measureAreaObj.measureAreaDiv.textContent = ' ';
        measureAreaObj.measureAreaDivLabel.position.set(0, 0.1, 0);
    }
    {
        editedLine = { points: [], state: '', currentPoint: null, isClosed: false, currentIndex: -1 };
        for (var i = polyLineGroup.children.length - 1; i >= 0; i--) {
            polyLineGroup.remove(polyLineGroup.children[i]);
        }
    }
    {
        editedShape = { points: [], state: '', currentPoint: null, isClosed: false, currentIndex: -1 };
        if (scene.getObjectByName('editedShape')) scene.remove(scene.getObjectByName('editedShape'));

    }
}

function begainMeasureLength() {
    clickState = 'lengthMeasure';
    measureLengthObj.state = 0;
    measureLengthObj.result = 0;
}

function begainMeasureArea() {
    //alert('开始测量面积');
    clickState = 'areaMeasure';
    for (var i = measureAreaGroup.children.length - 1; i >= 1; i--) {
        measureAreaGroup.remove(measureAreaGroup.children[i]);
    }
    measureAreaObj.points = [];
    //measureLengthObj.state = 0;
    //measureLengthObj.result = 0;
}

function begainPositionDxf() {
    clickState = 'positionDxf';
}


function editLineSetState(state) {
    if (clickState == 'addPolyLine') {
        editedLine.state = state;
    }

}

var drawMeasuredArea = function () {
    if (measureAreaObj.points.length > 0) {
        var vertices = [];
        for (var i = 0; i < measureAreaObj.points.length; i++) {
            vertices.push(measureAreaObj.points[i].x, 0.01, measureAreaObj.points[i].z);
        }
        vertices.push(measureAreaObj.points[0].x, 0.01, measureAreaObj.points[0].z);
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        var material = new THREE.LineBasicMaterial({
            color: 'blue',
            linewidth: 5,
        });
        var line = new THREE.Line(geometry, material);


        if (measureAreaGroup.children.length == 1)
            measureAreaGroup.add(line);
        else {
            measureAreaGroup.children[1].geometry = geometry;
        }
        var geometry_2 = new THREE.LineGeometry();
        geometry_2.setPositions(vertices);

        var material_2 = new THREE.LineMaterial({
            color: showAConfig.boundry.color,
            linewidth: showAConfig.boundry.width,
        });

        if (measureAreaGroup.getObjectByName('boundryLine2')) {
            measureAreaGroup.getObjectByName('boundryLine2').geometry = geometry_2;
            // measureAreaGroup.getObjectByName('boundryLine2').geometry.groupsNeedUpdate
        }
        else {
            material_2.renderOrder = 9;
            material_2.depthTest = false;
            var line_2 = new THREE.Line2(geometry_2, material_2);
            line_2.computeLineDistances();
            line_2.renderOrder = 0;
            line_2.scale.set(1, 1, 1);
            line_2.renderOrder = 9;
            line_2.name = 'boundryLine2'
            measureAreaGroup.add(line_2);
        }
    }
}

//var drawEditLineCurrent = null;


var delPointLine = function () {
    if (clickState == 'addPolyLine') {
        //if (editedLine.isClosed) { }
        //else

        {
            var getClosedIndex = function (vertices) {
                var result = -1;
                minLenght = 10000000;
                {

                    for (var i = 0; i < vertices.length; i++) {
                        if (editedLine.currentPoint == null) {
                            return -1;
                        }
                        else {
                            var current = vertices[i];
                            var itemLength = getLengthOfTwoPoint(getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z), getBaiduPositionLon(editedLine.currentPoint.x), getBaiduPositionLat(-editedLine.currentPoint.z));
                            if (itemLength < minLenght) {
                                minLenght = itemLength;
                                result = i + 0;
                            }
                        }
                    }
                }
                return result;
            }
            var r = getClosedIndex(editedLine.points);
            if (r == -1) {
                return;
            }
            else {
                editedLine.points.splice(r, 1);
            }
        }

    }
}

var drawEditLine_Key_A = function () {

}


var drawBoundry = function (operateType) {
    if (runFromNginx) {
        if (operateType == 'show') {
            boundryGroup.visible = true;
            if (boundryGroup.children.length == 0) {
                if (true) {
                    var dg = new DataGet();
                    dg.getBoundyData(dataGet.areaCode);
                }
            }

        }
        else if (operateType == 'hide') {
            boundryGroup.visible = false
        }
    }
    else {
        if (operateType == 'show') {
            boundryGroup.visible = true;
            if (boundryGroup.children.length == 0) {
                if (false) {
                    var vertices = [];
                    var data = boundryData;
                    for (var i = 0; i < data.length; i += 2) {
                        var lon = data[i];
                        var lat = data[i + 1];
                        vertices.push(MercatorGetXbyLongitude(lon), 0.01, -MercatorGetYbyLatitude(lat));
                    }
                    {
                        var i = 0;
                        var lon = data[i];
                        var lat = data[i + 1];
                        vertices.push(MercatorGetXbyLongitude(lon), 0.02, -MercatorGetYbyLatitude(lat));
                    }
                    var geometry = new THREE.BufferGeometry();
                    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

                    var material = new THREE.LineBasicMaterial({
                        color: 'blue',
                        linewidth: 10000,
                    });
                    var line = new THREE.Line(geometry, material);
                    boundryGroup.add(line);

                }
                if (true) {
                    //var geometryLine = new THREE.BufferGeometry();
                    var vertices = [];
                    var data = boundryData;
                    for (var i = 0; i < data.length; i += 2) {
                        var lon = data[i];
                        var lat = data[i + 1];
                        vertices.push(MercatorGetXbyLongitude(lon), 0, -MercatorGetYbyLatitude(lat));


                    }
                    {
                        var i = 0;
                        var lon = data[i];
                        var lat = data[i + 1];
                        vertices.push(MercatorGetXbyLongitude(lon), 0, -MercatorGetYbyLatitude(lat));
                    }
                    // var geometry = new THREE.Geometry();
                    var geometry = new THREE.LineGeometry();
                    //var color = 0x66ff00;
                    geometry.setPositions(vertices);
                    var material = new THREE.LineMaterial({
                        color: showAConfig.boundry.color,
                        linewidth: showAConfig.boundry.width, // in pixels
                        //vertexColors: 0x12f43d,
                        ////resolution:  // to be set by renderer, eventually
                        //dashed: false
                    });
                    material.renderOrder = 9;
                    material.depthTest = false;
                    var line = new THREE.Line2(geometry, material);
                    line.computeLineDistances();
                    //line.Tag = { name: '', voltage: '' }
                    line.renderOrder = 0;
                    line.scale.set(1, 1, 1);
                    line.renderOrder = 9;
                    //line.rotateX(-Math.PI / 2);
                    boundryGroup.add(line);


                    //var line = new THREE.Line2(geometry, material);
                    //line.computeLineDistances();
                    //line.Tag = { name: '', voltage: '' }
                    //line.renderOrder = 99;
                    //line.scale.set(1, 1, 1);
                    ////line.rotateX(-Math.PI / 2);
                    //lineGroup.add(line_ForSelect);
                    //lineGroup.add(line);
                }
                //            var data = boundryData;

                //            var regionPts = [];
                //            for (var i = 0; i < data.length; i += 2) {
                //                var lon = data[i];
                //                var lat = data[i + 1];
                //              regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                //            }
                //            var regionShape = new THREE.Shape(regionPts);
                //            var shapes = regionShape;
                //            var geometry = new THREE.ShapeBufferGeometry(shapes);
                //            geometry.computeBoundingBox();

                //            var matLite = new THREE.MeshBasicMaterial({
                //                color: 'red',
                //                transparent: true,
                //                opacity: 0.4,
                //                side: THREE.DoubleSide
                //            });


                //            var meshm = new THREE.Mesh(geometry, matLite);
                //meshm.position.set(0, 0 + 0.02, 0);
                //            meshm.rotateX(-Math.PI / 2);
                //            boundryGroup.add(meshm);


                //regionPts.push[regionPts[0]];
                //var points = regionPts;
                //var geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

                //var line = new THREE.LineSegments(geometryPoints, new THREE.LineBasicMaterial({ color: 'red', linewidth: 100, side: THREE.DoubleSide }));

                //line.position.set(0, 0+0.02, 0  );
                //line.rotateX(-Math.PI / 2);
                ////line.scale.set(s, s, s);
                ////var extrudeSettings = { depth: 1, bevelEnabled: false };
                ////var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                ////var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x00BFFF, wireframe: false, transparent: true, opacity: 0.7 }));
                ////mesh.position.set(0, 0, 0);
                ////mesh.rotateX(-Math.PI / 2);
                ////mesh.scale.set(1, 1, 1);

                //boundryGroup.add(line);
                //render();
                //boundryGroup.renderOrder = 10;
            }

        }
        else if (operateType == 'hide') {
            boundryGroup.visible = false
        }
    }

}

var drawPeibian2 = function (operateType) {
    if (operateType == 'show') {
        peibianGroup.visible = true;
        if (peibianGroup.children.length == 0) {
            var data = peibianData;
            var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);
            //var regionPts = [];
            //function gcj02tobd09(lng, lat) {
            //    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
            //    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
            //    var bd_lng = z * Math.cos(theta) + 0.0065;
            //    var bd_lat = z * Math.sin(theta) + 0.006;
            //    return [bd_lng, bd_lat]
            //}
            //112.542647,37.878309
            //112.549236,37.879061

            //112.536353  37.882311  谷歌地图
            //112.5492,37.889121 百度地图

            var deltaLon = 112.5492 - 112.536353;
            var deltaLat = 37.889121 - 37.882311;
            for (var i = 0; i < data.length; i++) { //data.length
                var lon = data[i].lon + deltaLon;
                var lat = data[i].lat + deltaLat + 0.0001;
                //var bdPosition = gcj02tobd09(lon, lat);
                //lon = bdPosition[0] + deltaLon;
                //lat = bdPosition[1] + deltaLat;
                // var material=
                var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: showAConfig.peiBian.color, transparent: true, opacity: showAConfig.peiBian.opacity }));
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);

                //object.position.x = x_m;
                //object.position.y = 0;
                //object.position.z = 0 - z_m;

                //object.Tag = data[i];

                //object.rotateX(-Math.PI / 2);
                //object.scale.set(1, 1, 1);
                //peibianGroup.add(object);

                var geometry = new THREE.RingGeometry(0.4, 0.2, 12);
                var material = new THREE.MeshBasicMaterial({ color: showAConfig.peiBian.color, side: THREE.DoubleSide, transparent: true, opacity: showAConfig.peiBian.opacity });
                material.depthTest = false;
                var plane = new THREE.Mesh(geometry, material);
                //plane.name = data[i].name;
                data[i].name = data[i].detail;
                plane.Tag = data[i];
                //measureAreaObj.measureAreaDiv.className = 'label';
                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                //var label = new THREE.CSS2DObject(divC);
                plane.renderOrder = 98;

                plane.position.set(x_m, 0, -z_m);
                plane.rotateX(Math.PI / 2);
                peibianGroup.add(plane);

            }

        }
        else {
            searchPeibian('BB');
        }
    }
    else if (operateType == 'hide') {
        peibianGroup.visible = false;
    }
}

var drawPeibian = function (operateType) {
    if (operateType == 'show') {
        peibianGroup.visible = true;
        if (peibianGroup.children.length == 0) {
            if (runFromNginx) {
                var dg = new DataGet();
                dg.drawPeibian_Icon(dataGet.areaCode);
                // dg.drawPeibian(dataGet.areaCode);
            }
            else {
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = peibianData;
                var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

                var deltaLon = 112.5492 - 112.536353;
                var deltaLat = 37.889121 - 37.882311;
                //for (var i = 0; i < data.length; i++) { //data.length
                //    var lon = data[i].lon + deltaLon;
                //    var lat = data[i].lat + deltaLat + 0.0001;
                var sumSql = '';
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].lon + deltaLon;
                    var lat = data[i].lat + deltaLat + 0.0001;
                    //var bdPosition = gcj02tobd09(lon, lat);
                    //lon = bdPosition[0] + deltaLon;
                    //lat = bdPosition[1] + deltaLat;
                    // var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);

                    var s = l / 100.0;
                    var geometry1 = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);

                    var geometry2 = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
                    var material1 = new THREE.MeshPhongMaterial({ color: 0x33CCFF, transparent: false, opacity: 1.0 });
                    var material2 = new THREE.MeshPhongMaterial({ color: 0x33CCFF, transparent: true, opacity: 0.45 });

                    var child1 = new THREE.Mesh(geometry1, material1);
                    var child2 = new THREE.Mesh(geometry2, material2);

                    //tongxin5GMapGroup.add(child1);
                    //tongxin5GMapGroup.add(child2);

                    // t3.position.set(x_m, 1 * s, -z_m);
                    child1.position.set(x_m, s * 0.5, -z_m);
                    child2.position.set(x_m, 0.65 * s, -z_m);
                    child1.scale.set(s, s, s);
                    child2.scale.set(1.3 * s, 1.3 * s, 1.3 * s);
                    data[i].name = data[i].detail;

                    child1.Tag = { part: '1', detail: data[i].detail, select: false };
                    child2.Tag = { part: '2', detail: data[i].detail, select: false };
                    data[i].name = data[i].detail;
                    peibianGroup.add(child1);
                    peibianGroup.add(child2);

                    var sqlItem = 'INSERT INTO transformer (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                    sumSql += sqlItem;

                }
                console.log('sumSql', sumSql);
            }


        }
        else {
            searchPeibian('BB');
        }
    }
    else if (operateType == 'hide') {
        peibianGroup.visible = false;
    }
}

var peibianStateObj = {
    /*
     * abnormalType 和overload 异常
     * 显示线损异常和重过载异常，默认值为
     */
    showType: 'abnormalType'
};
var drawPeibian_Icon = function (operateType, showType) {
    if (peibianStateObj.showType != showType) {
        searchCondition.peibianObj.initial();
    }
    if (showType == 'overload') {
        peibianStateObj.showType = 'overload';
    }
    else if (showType == 'all') {
        peibianStateObj.showType = 'all';
    }
    else if (showType == 'black') {
        peibianStateObj.showType = 'black';
    }
    else {
        peibianStateObj.showType = 'abnormalType';
    }
    if (PeiBianState == '') {
        if (operateType == 'show') {
            peibianGroup.visible = true;
            if (peibianGroup.children.length == 0) {
                {
                    var dg = new DataGet();
                    dg.drawPeibian_Icon(dataGet.areaCode);
                }
            }
            else { }
            //else {
            //    searchPeibian('BB');
            //}
        }
        else if (operateType == 'hide') {
            var opreateGroup = peibianGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        updateTransformer();
    }
    else {
        (new DataGet()).getTransformerData(function () {
            PeiBianState = '';
            var opreateGroup = peibianGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
            drawPeibian_Icon('show');
            searchCondition.peibianObj.initial();
        });
    }
    updateTransformer();
}

var PeiBianState = '';
var drawPeibian_IconWithDate = function (operateType, date, showType) {
    if (peibianStateObj.showType != showType) {
        searchCondition.peibianObj.initial();
    }
    if (showType == 'overload') {
        peibianStateObj.showType = 'overload';
    }
    else if (showType == 'all') {
        peibianStateObj.showType = 'all';
    }
    else {
        peibianStateObj.showType = 'abnormalType';
    }
    if (PeiBianState == date) {
        if (operateType == 'show') {
            peibianGroup.visible = true;
            if (peibianGroup.children.length == 0) {
                {
                    var dg = new DataGet();
                    dg.drawPeibian_Icon(dataGet.areaCode, peibianStateObj.showType);
                }
            }
            else { }
            //else {
            //    searchPeibian('BB');
            //}
        }
        else if (operateType == 'hide') {
            var opreateGroup = peibianGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        updateTransformer();
    }
    else {
        var dg = new DataGet();
        dg.getTransformerDataAtDate(date,
            function (dateGet) {
                PeiBianState = dateGet;
                var opreateGroup = peibianGroup;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
                drawPeibian_IconWithDate('show', dateGet);
                searchCondition.peibianObj.initial();
            });
    }
}

var drawTongxin5G_Icon = function (operateType) {

    if (operateType == 'show') {
        tongxin5GMapGroup.visible = true;
        if (tongxin5GMapGroup.children.length == 0) {
            {
                var dg = new DataGet();
                dg.drawTongxin5G_Icon(dataGet.areaCode);
            }



        }
        else {
            // searchPeibian('BB');
        }
    }
    else if (operateType == 'hide') {
        var opreateGroup = tongxin5GMapGroup;
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }
    }
}
var drawTongxin5G_newData = function (operateType) {

    if (operateType == 'show') {
        tongxin5GMapGroup.visible = true;
        if (tongxin5GMapGroup.children.length == 0) {
            {
                var dg = new DataGet();
                dg.drawTongxin5G_newData(dataGet.areaCode);
            }



        }
        else {
            // searchPeibian('BB');
        }
    }
    else if (operateType == 'hide') {
        var opreateGroup = tongxin5GMapGroup;
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }

        console.log('状态', '进入');
        console.log('状态', this);
        document.getElementById('notifyMsgOf5G').style.zIndex = '-99999';
        document.getElementById('notifyMsgOf5G').innerHTML = ''
    }
}

var searchPeibian = function (keyWords) {
    //for (var i = 0; i < peibianGroup.children.length; i++) {
    //    if (peibianGroup.children[i].Tag.detail.search(keyWords) >= 0) {
    //        peibianGroup.children[i].material.color.set(0xFFFF00);
    //        peibianGroup.children[i].material.opacity = 0.5;
    //    }
    //    else {
    //        peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
    //        peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
    //    }
    //}
    //if (keyWords == '') {
    //    for (var i = 0; i < peibianGroup.children.length; i++) {

    //        peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
    //        peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
    //    }
    //}
    for (var i = 0; i < peibianGroup.children.length; i++) {
        if (peibianGroup.children[i].Tag.detail.search(keyWords) >= 0) {
            //tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
            //tongxin5GMapGroup.children[i].material.opacity = 0.9;
            peibianGroup.children[i].Tag.select = true;
        }
        else {
            peibianGroup.children[i].Tag.select = false;
        }
    }
    if (keyWords == '' || keyWords == 'BB') {
        for (var i = 0; i < peibianGroup.children.length; i++) {
            peibianGroup.children[i].Tag.select = false;
        }
    }
}
var searchPeibian_Icon = function (keyWords) {
    //for (var i = 0; i < peibianGroup.children.length; i++) {
    //    if (peibianGroup.children[i].Tag.detail.search(keyWords) >= 0) {
    //        peibianGroup.children[i].material.color.set(0xFFFF00);
    //        peibianGroup.children[i].material.opacity = 0.5;
    //    }
    //    else {
    //        peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
    //        peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
    //    }
    //}
    //if (keyWords == '') {
    //    for (var i = 0; i < peibianGroup.children.length; i++) {

    //        peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
    //        peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
    //    }
    //}
    for (var i = 0; i < peibianGroup.children.length; i++) {
        if (peibianGroup.children[i].Tag.detail.search(keyWords) >= 0) {
            //tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
            //tongxin5GMapGroup.children[i].material.opacity = 0.9;
            peibianGroup.children[i].Tag.select = true;
        }
        else {
            peibianGroup.children[i].Tag.select = false;
        }
    }
    if (keyWords == '' || keyWords == 'BB') {
        for (var i = 0; i < peibianGroup.children.length; i++) {
            peibianGroup.children[i].Tag.select = false;
        }
    }
}
var searchTongxin5G = function (keyWords) {

    //child1.Tag = { part: '1', detail: data[i].detail, select: false };
    //child2.Tag = { part: '2', detail: data[i].detail, select: false };
    for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {
        if (tongxin5GMapGroup.children[i].Tag.detail.search(keyWords) >= 0) {
            //tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
            //tongxin5GMapGroup.children[i].material.opacity = 0.9;
            tongxin5GMapGroup.children[i].Tag.select = true;
        }
        else {
            tongxin5GMapGroup.children[i].Tag.select = false;
        }
    }
    if (keyWords == '' || keyWords == 'BB') {
        for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {
            tongxin5GMapGroup.children[i].Tag.select = false;
        }
    }
}


var drawTongxin5G = function (operateType) {
    if (operateType == 'show') {
        //tongxin5GMapGroup
        tongxin5GMapGroup.visible = true;
        if (tongxin5GMapGroup.children.length == 0) {

            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

            var data = peibianData;
            var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

            var deltaLon = 112.5492 - 112.536353;
            var deltaLat = 37.889121 - 37.882311;
            //for (var i = 0; i < data.length; i++) { //data.length
            //    var lon = data[i].lon + deltaLon;
            //    var lat = data[i].lat + deltaLat + 0.0001;
            var sumSql = '';
            for (var i = 0; i < data.length; i++) { //data.length

                var lon = data[i].lon + deltaLon + Math.cos(i) * 0.001;
                var lat = data[i].lat + deltaLat + 0.0001 + Math.sin(i) * 0.001;
                //var bdPosition = gcj02tobd09(lon, lat);
                //lon = bdPosition[0] + deltaLon;
                //lat = bdPosition[1] + deltaLat;
                // var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);

                var s = l / 100.0;
                var geometry1 = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);

                var geometry2 = new THREE.BoxBufferGeometry(1, 3, 1, 1, 1, 1);
                var material1 = new THREE.MeshPhongMaterial({ color: 0x61889, shininess: 50, transparent: false, opacity: 1.0 });
                var material2 = new THREE.MeshPhongMaterial({ color: 0x61889, shininess: 50, transparent: true, opacity: 0.45 });

                var child1 = new THREE.Mesh(geometry1, material1);
                var child2 = new THREE.Mesh(geometry2, material2);


                //var geometry3 = new THREE.TorusBufferGeometry(2, 0.2, 2, 16, Math.PI * 2);
                //var material3 = new THREE.MeshPhongMaterial({ color: 0x61889, shininess: 50, transparent: true, opacity: 0.45 });
                //var child3 = new THREE.Mesh(geometry3, material3);
                //child3.rotateX(-Math.PI / 2);
                //tongxin5GMapGroup.add(child1);
                //tongxin5GMapGroup.add(child2);

                // t3.position.set(x_m, 1 * s, -z_m);

                //var geometry = new THREE.RingGeometry(1, 5, 32);
                //var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                //var child3 = new THREE.Mesh(geometry, material);
                //scene.add(mesh);

                var geometry3 = new THREE.RingGeometry(4, 5, 16, 1);
                var material3 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                //var child3 = new THREE.Mesh(geometry3, material3);
                //child3.rotateX(Math.PI / 2); 




                child1.position.set(x_m, s * 4, -z_m);
                child2.position.set(x_m, 1.5 * s, -z_m);
                //child3.position.set(x_m, s * 4, -z_m);
                child1.scale.set(s, s, s);
                child2.scale.set(s, s, s);
                //child3.scale.set(s, s, s);
                data[i].name = data[i].detail;

                child1.Tag = { part: '1', detail: data[i].detail, select: false };
                child2.Tag = { part: '2', detail: data[i].detail, select: false };
                data[i].name = data[i].detail;
                tongxin5GMapGroup.add(child1);
                tongxin5GMapGroup.add(child2);
                //tongxin5GMapGroup.add(child3);

                //return;
                // var sqlItem = 'INSERT INTO space_based (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                // sumSql += sqlItem;
            }
            //console.log('sumSql', sumSql);
        }
        else {
            searchTongxin5G('BB');
        }
    }
    else if (operateType == 'hide') {
        tongxin5GMapGroup.visible = false;
    }
}

var recordL = 0;
var updateScale = function () {
    var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
        (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
        (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
    if (Math.abs(recordL - l) >= 0.01) {
        recordL = l;
        raycaster.linePrecision = recordL * 0.01;
    }

    if (false)
        if (tongxin5GMapGroup.visible) {

            var updateTongxin5GMapGroup = function (length) {



                var operateGroups = [tongxin5GMapGroup];

                if (length <= 12) {
                    for (var i = 0; i < operateGroups.length; i++) {
                        if (operateGroups[i].visible) {
                            for (var j = 0; j < operateGroups[i].children.length; j++)
                                operateGroups[i].children[j].visible = true;
                        }
                    }
                }
                else {
                    var positions = [];
                    var maxV = function (operateGroups) {
                        var maxVResult = 0;
                        for (var i = 0; i < operateGroups.length; i++) {
                            if (operateGroups[i].children.length > maxVResult) {
                                maxVResult = operateGroups[i].children.length;
                            }
                        }
                        return maxVResult;
                    }(operateGroups);


                    for (var j = 0; j < maxV; j += 2) {
                        for (var i = 0; i < operateGroups.length; i++) {
                            if (operateGroups[i].visible)
                                if (j < operateGroups[i].children.length) {
                                    if (operateGroups[i].children[j].Tag.select) {
                                        operateGroups[i].children[j].visible = true;
                                        operateGroups[i].children[j].material.color.set(0xFFFF00);
                                        operateGroups[i].children[j].material.opacity = 0.9;

                                        operateGroups[i].children[j + 1].visible = true;
                                        operateGroups[i].children[j + 1].material.color.set(0xFFFF00);
                                        operateGroups[i].children[j + 1].material.opacity = 0.9;
                                        continue;
                                    }
                                    //if (tongxin5GMapGroup.children[i].Tag.detail.search(keyWords) >= 0) {
                                    //    //tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
                                    //    //tongxin5GMapGroup.children[i].material.opacity = 0.9;
                                    //    tongxin5GMapGroup.children[i].Tag.select = true;
                                    //}
                                    var positionOfObj = operateGroups[i].children[j].position;
                                    if (function (positionItems, positionItem, lengthInput) {
                                        // positionItems = [];
                                        for (var k = 0; k < positionItems.length; k++) {
                                            var a = positionItems[k];
                                            var b = positionItem;
                                            var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                            if (lengthCal > lengthInput / 15) continue;
                                            else return false;
                                        }
                                        return true;
                                    }(positions, positionOfObj, length)) {
                                        positions.push(positionOfObj);
                                        operateGroups[i].children[j].visible = true;
                                        operateGroups[i].children[j + 1].visible = true;
                                    }
                                    else {
                                        operateGroups[i].children[j].visible = false;
                                        operateGroups[i].children[j + 1].visible = false;
                                    }
                                    operateGroups[i].children[j].material.color.set(0x61889);
                                    operateGroups[i].children[j].material.opacity = 1;
                                    operateGroups[i].children[j].material.transparent = false;

                                    operateGroups[i].children[j + 1].material.color.set(0x61889);
                                    operateGroups[i].children[j + 1].material.opacity = 0.45;
                                    operateGroups[i].children[j + 1].material.transparent = true;
                                    //var material1 = new THREE.MeshPhongMaterial({ color: 0x61889, shininess: 50, transparent: false, opacity: 1.0 });
                                    //var material2 = new THREE.MeshPhongMaterial({ color: 0x61889, shininess: 50, transparent: true, opacity: 0.45 });
                                }
                        }
                    }

                }
            }
            if (tongxin5GMapGroup.children.length > 0) {
                var positions = [];

                for (var i = 0; i < tongxin5GMapGroup.children.length; i += 2) {
                    //var x_m = MercatorGetXbyLongitude(lon);
                    //var z_m = MercatorGetYbyLatitude(lat);

                    var s = l / 100.0;
                    var operateObj1 = tongxin5GMapGroup.children[i];
                    {
                        operateObj1.scale.set(s, s, s);
                        operateObj1.position.y = 4 * s;
                        operateObj1.rotation.y = (Date.now() / 200) % (Math.PI * 2);
                    }
                    var operateObj2 = tongxin5GMapGroup.children[i + 1];
                    {
                        operateObj2.scale.set(s, s, s);
                        operateObj2.position.y = 1.5 * s;
                        operateObj2.rotation.y = (Date.now() / 1500) % (Math.PI * 2);
                    }
                    //var operateObj3 = tongxin5GMapGroup.children[i + 2];
                    //{
                    //    operateObj3.scale.set(s, s, s);
                    //    operateObj3.position.y = 4 * s;

                    //    if (operateObj1.visible) {
                    //        ////child3.position.set(x_m, s * 4, -z_m);
                    //        ////operateObj2.position.y = 1.5 * s;
                    //        ////operateObj2.rotation.y = (Date.now() / 1500) % (Math.PI * 2);
                    //        var t = (Date.now()) % (6000);
                    //        var geometry3;
                    //        if (t < 1200) {
                    //            //geometry3 = new THREE.RingGeometry(2, 2, 32);
                    //            operateObj3.visible = false;
                    //        }
                    //        else {
                    //            //operateObj3.visible = true;
                    //            //var innerR = 2 + 6 * (t - 1200) / 4800;
                    //            //geometry3 = new THREE.RingGeometry(innerR, innerR + 0.8 / innerR, 16,1);
                    //            operateObj3.scale.set(s * (1 + 3 * (t - 1200) / 4800), s, s * (1 + 3 * (t - 1200) / 4800));
                    //        }
                    //        operateObj3.geometry = geometry3;
                    //    }
                    //    else {
                    //        operateObj3.visible = false;
                    //    }

                    //}

                    //child1.Tag = { part: '1' };
                    //child2.Tag = { part: '2' };

                    //tongxin5GMapGroup.add(child1);
                    //tongxin5GMapGroup.add(child2);
                    // tongxin5GMapGroup.children[i].scale.set(recordL / 50, recordL / 50, recordL / 50);
                }

                updateTongxin5GMapGroup(l);
            }
        }
    if (false) {
        //原来的3D动画，遇上2B，居然让用图标？CTM的SB。
        if (peibianGroup.visible) {

            var updateTongxin5GMapGroup = function (length) {



                var operateGroups = [peibianGroup];

                if (length <= 12) {
                    for (var i = 0; i < operateGroups.length; i++) {
                        if (operateGroups[i].visible) {
                            for (var j = 0; j < operateGroups[i].children.length; j++)
                                operateGroups[i].children[j].visible = true;
                        }
                    }
                }
                else {
                    var positions = [];
                    var maxV = function (operateGroups) {
                        var maxVResult = 0;
                        for (var i = 0; i < operateGroups.length; i++) {
                            if (operateGroups[i].children.length > maxVResult) {
                                maxVResult = operateGroups[i].children.length;
                            }
                        }
                        return maxVResult;
                    }(operateGroups);


                    for (var j = 0; j < maxV; j += 2) {
                        for (var i = 0; i < operateGroups.length; i++) {
                            if (operateGroups[i].visible)
                                if (j < operateGroups[i].children.length) {
                                    if (operateGroups[i].children[j].Tag.select) {
                                        operateGroups[i].children[j].visible = true;
                                        operateGroups[i].children[j].material.color.set(0xFFFF00);
                                        operateGroups[i].children[j].material.opacity = 0.9;

                                        operateGroups[i].children[j + 1].visible = true;
                                        operateGroups[i].children[j + 1].material.color.set(0xFFFF00);
                                        operateGroups[i].children[j + 1].material.opacity = 0.9;
                                        continue;
                                    }
                                    //if (tongxin5GMapGroup.children[i].Tag.detail.search(keyWords) >= 0) {
                                    //    //tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
                                    //    //tongxin5GMapGroup.children[i].material.opacity = 0.9;
                                    //    tongxin5GMapGroup.children[i].Tag.select = true;
                                    //}
                                    var positionOfObj = operateGroups[i].children[j].position;
                                    if (function (positionItems, positionItem, lengthInput) {
                                        // positionItems = [];
                                        for (var k = 0; k < positionItems.length; k++) {
                                            var a = positionItems[k];
                                            var b = positionItem;
                                            var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                            if (lengthCal > lengthInput / 15) continue;
                                            else return false;
                                        }
                                        return true;
                                    }(positions, positionOfObj, length)) {
                                        positions.push(positionOfObj);
                                        operateGroups[i].children[j].visible = true;
                                        operateGroups[i].children[j + 1].visible = true;
                                    }
                                    else {
                                        operateGroups[i].children[j].visible = false;
                                        operateGroups[i].children[j + 1].visible = false;
                                    }
                                    operateGroups[i].children[j].material.color.set(0x33CCFF);
                                    operateGroups[i].children[j].material.opacity = 1;
                                    operateGroups[i].children[j].material.transparent = false;

                                    operateGroups[i].children[j + 1].material.color.set(0x33CCFF);
                                    operateGroups[i].children[j + 1].material.opacity = 0.45;
                                    operateGroups[i].children[j + 1].material.transparent = true;
                                    //#FFFF00   #FF0000
                                    if (operateGroups[i].children[j].Tag.state == '1') {
                                        var t = Date.now() % 2000;
                                        operateGroups[i].children[j].material.color.set(Math.round(0xFF0000 + (0xFFFF00 - 0xFF0000) * t / 2000));
                                        operateGroups[i].children[j].material.opacity = 1;
                                        operateGroups[i].children[j].material.transparent = false;

                                        operateGroups[i].children[j + 1].material.color.set(Math.round(0xFFFF00 - (0xFFFF00 - 0xFF0000) * t / 2000));
                                        operateGroups[i].children[j + 1].material.opacity = 0.45;
                                        operateGroups[i].children[j + 1].material.transparent = true;
                                        operateGroups[i].children[j].visible = true;
                                        operateGroups[i].children[j + 1].visible = true;
                                    }
                                }
                        }
                    }

                }

            }
            if (peibianGroup.children.length > 0) {
                var positions = [];

                for (var i = 0; i < peibianGroup.children.length; i += 2) {
                    //var x_m = MercatorGetXbyLongitude(lon);
                    //var z_m = MercatorGetYbyLatitude(lat);

                    var s = l / 100.0;
                    var operateObj1 = peibianGroup.children[i];
                    {
                        operateObj1.scale.set(s, s, s);
                        operateObj1.position.y = 0.5 * s;
                        operateObj1.rotation.y = (Date.now() / 1500) % (Math.PI * 2);
                    }
                    var operateObj2 = peibianGroup.children[i + 1];
                    {
                        operateObj2.scale.set(1.3 * s, 1.3 * s, 1.3 * s);
                        operateObj2.position.y = 0.65 * s;
                        operateObj2.rotation.y = (Date.now() / 1500) % (Math.PI * 2);
                    }

                    //child1.Tag = { part: '1' };
                    //child2.Tag = { part: '2' };

                    //tongxin5GMapGroup.add(child1);
                    //tongxin5GMapGroup.add(child2);
                    // tongxin5GMapGroup.children[i].scale.set(recordL / 50, recordL / 50, recordL / 50);
                }

                updateTongxin5GMapGroup(l);
            }
        }
    }
    else {
        // if (peibianGroup.visible) { updatePeibianAnd5GGroup(l); }
    }
}


var updatePeibianGroup = function (length) {

    updatePeibianGroup2(length);
    return;

    var operateGroups = [peibianGroup];

    if (length <= 12) {
        for (var i = 0; i < operateGroups.length; i++) {
            if (operateGroups[i].visible) {
                for (var j = 0; j < operateGroups[i].children.length; j++) operateGroups[i].children[j].element.classList.remove('displayNone');
            }
        }
    }
    else {
        var positions = [];
        var maxV = function (operateGroups) {
            var maxVResult = 0;
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].children.length > maxVResult) {

                    maxVResult = operateGroups[i].children.length;
                }
            }
            return maxVResult;
        }(operateGroups);

        if (peibianGroup.visible)
            for (var j = 0; j < maxV; j++) {
                for (var i = 0; i < operateGroups.length; i++) {
                    if (operateGroups[i].visible)
                        if (j < operateGroups[i].children.length) {
                            var positionOfObj = operateGroups[i].children[j].position;
                            //if (operateGroups[i].children[j].Tag.select) {
                            //    operateGroups[i].children[j].element.classList.remove('displayNone');
                            //    operateGroups[i].children[j].element.children[0].src = "Pic/bd_1.png";
                            //}
                            //else
                            //  operateGroups[i].children[j].element.error

                            // operateGroups[i].children[j].element.Tag.error = true;
                            if (operateGroups[i].children[j].element.Tag.error) {
                                operateGroups[i].children[j].element.classList.remove('displayNone');
                                // operateGroups[i].children[j].element.children[0].src = "Pic/bd_1.png";
                            }
                            else if (function (positionItems, positionItem, lengthInput) {
                                // positionItems = [];
                                for (var k = 0; k < positionItems.length; k++) {
                                    var a = positionItems[k];
                                    var b = positionItem;
                                    var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                    if (lengthCal > lengthInput / 15) continue;
                                    else return false;
                                }
                                return true;
                            }(positions, positionOfObj, length)) {
                                positions.push(positionOfObj);
                                //operateGroups[i].children[j].visible = true;
                                // operateGroups[i].children[j].element.hidden = false;
                                operateGroups[i].children[j].element.classList.remove('displayNone');
                                //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                            }
                            else {
                                operateGroups[i].children[j].element.classList.add('displayNone');
                                //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                                // operateGroups[i].children[j].element.hidden = true;
                            }
                        }
                }
            }

    }

}

var updatePeibianGroup2 = function (length) {

    var checkM = function (Tag) {

        var result = [false, false, false, false];
        if (Tag.error) {
            result[0] = true;
            result[1] = true;
        }
        if (function (Tag) {
            var index = Tag.index;
            var nameSelect = searchCondition.peibianObj.name;
            if (dataGet.apitransformer[index].name.indexOf(nameSelect) >= 0) {
                return true;
            }
            else {
                return false;
            }
        }(Tag)) {
            result[0] = true;
            result[2] = true;
        }
        if (function (Tag) {
            var index = Tag.index;

            if (dataGet.apitransformer[index][searchCondition.peibianObj.State.name] && dataGet.apitransformer[index][searchCondition.peibianObj.State.name] == searchCondition.peibianObj.State.state) {
                var name = searchCondition.peibianObj.State.name;
                if (searchCondition.peibianObj.CheckException(searchCondition.peibianObj.State.name, searchCondition.peibianObj.State.state + '')) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }(Tag)) {
            result[0] = true;
            result[3] = true;
        }
        return result;
    }
    var operateGroups = [peibianGroup];

    if (length <= 12) {
        for (var i = 0; i < operateGroups.length; i++) {
            if (operateGroups[i].visible) {
                for (var j = 0; j < operateGroups[i].children.length; j++) {
                    var index = operateGroups[i].children[j].element.Tag.index;
                    //statDate: "2020-04-19"
                    //runDate: "2017-11-24"  
                    var date = Date.parse(dataGet.apitransformer[index].runDate);
                    if (date < electricLine.recordT) {
                        operateGroups[i].children[j].element.classList.remove('displayNone');

                        var nameSelect = searchCondition.peibianObj.name;
                        if (dataGet.apitransformer[index].name.indexOf(nameSelect) >= 0) {
                            operateGroups[i].children[j].element.classList.add('findByName');
                        }
                        else {
                            operateGroups[i].children[j].element.classList.remove('findByName');
                        }

                        if (dataGet.apitransformer[index][searchCondition.peibianObj.State.name] && dataGet.apitransformer[index][searchCondition.peibianObj.State.name] == searchCondition.peibianObj.State.state) {
                            operateGroups[i].children[j].element.classList.add('findByError');
                        }
                        else {
                            operateGroups[i].children[j].element.classList.remove('findByError');
                        }
                    }
                    else {
                        operateGroups[i].children[j].element.classList.add('displayNone');
                    }
                    //operateGroups[i].children[j].element.classList.remove('displayNone');
                    //  if
                }

            }
        }
    }
    else {
        var positions = [];
        var maxV = function (operateGroups) {
            var maxVResult = 0;
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].children.length > maxVResult) {

                    maxVResult = operateGroups[i].children.length;
                }
            }
            return maxVResult;
        }(operateGroups);

        if (peibianGroup.visible)
            for (var j = 0; j < maxV; j++) {
                for (var i = 0; i < operateGroups.length; i++) {
                    if (operateGroups[i].visible) {
                        operateGroups[i].children[j].element.classList.remove('findByName');
                        operateGroups[i].children[j].element.classList.remove('findByError');
                        var index = operateGroups[i].children[j].element.Tag.index;
                        //statDate: "2020-04-19"
                        //runDate: "2017-11-24"  


                        var date = Date.parse(dataGet.apitransformer[index].runDate);
                        if (date < electricLine.recordT) {
                            if (j < operateGroups[i].children.length) {
                                var positionOfObj = operateGroups[i].children[j].position;
                                var checkObj = checkM(operateGroups[i].children[j].element.Tag);
                                if (checkObj[0]) {
                                    operateGroups[i].children[j].element.classList.remove('displayNone');
                                    if (checkObj[2]) {
                                        operateGroups[i].children[j].element.classList.add('findByName');
                                    }
                                    if (checkObj[3]) {
                                        operateGroups[i].children[j].element.classList.add('findByError');
                                    }
                                }
                                else if (
                                    function (positionItems, positionItem, lengthInput) {
                                        // positionItems = [];
                                        for (var k = 0; k < positionItems.length; k++) {
                                            var a = positionItems[k];
                                            var b = positionItem;
                                            var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                            if (lengthCal > lengthInput / 15) continue;
                                            else return false;
                                        }
                                        return true;
                                    }(positions, positionOfObj, length)) {

                                    positions.push(positionOfObj);
                                    //operateGroups[i].children[j].visible = true;
                                    // operateGroups[i].children[j].element.hidden = false;
                                    operateGroups[i].children[j].element.classList.remove('displayNone');


                                    if (function (Tag) {
                                        var index = Tag.index;
                                        var nameSelect = searchCondition.peibianObj.name;
                                        if (dataGet.apitransformer[index].name.indexOf(nameSelect) >= 0) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }(operateGroups[i].children[j].element.Tag)) {
                                        operateGroups[i].children[j].element.classList.remove('displayNone');
                                        positions.push(positionOfObj);
                                        operateGroups[i].children[j].element.classList.add('findByName');
                                    }
                                    if (function (Tag) {
                                        var index = Tag.index;

                                        if (dataGet.apitransformer[index][searchCondition.peibianObj.State.name] && dataGet.apitransformer[index][searchCondition.peibianObj.State.name] == searchCondition.peibianObj.State.state) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }(operateGroups[i].children[j].element.Tag)) {
                                        operateGroups[i].children[j].element.classList.remove('displayNone');
                                        positions.push(positionOfObj);
                                        operateGroups[i].children[j].element.classList.add('findByError');
                                    }
                                    //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                                }
                                else {
                                    operateGroups[i].children[j].element.classList.add('displayNone');
                                    //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                                    // operateGroups[i].children[j].element.hidden = true;
                                }
                            }
                        }
                        else {
                            operateGroups[i].children[j].element.classList.add('displayNone');
                        }

                    }
                }
            }

    }
}
var update5GGroup = function (length) {
    var operateGroups = [tongxin5GMapGroup];

    if (length <= 12) {
        for (var i = 0; i < operateGroups.length; i++) {
            if (operateGroups[i].visible) {
                for (var j = 0; j < operateGroups[i].children.length; j++) operateGroups[i].children[j].element.classList.remove('displayNone');
            }
        }
    }
    else {
        var positions = [];
        var maxV = function (operateGroups) {
            var maxVResult = 0;
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].children.length > maxVResult) {
                    maxVResult = operateGroups[i].children.length;
                }
            }
            return maxVResult;
        }(operateGroups);


        for (var j = 0; j < maxV; j++) {
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].visible)
                    if (j < operateGroups[i].children.length) {
                        var positionOfObj = operateGroups[i].children[j].position;

                        if (function (positionItems, positionItem, lengthInput) {
                            // positionItems = [];
                            for (var k = 0; k < positionItems.length; k++) {
                                var a = positionItems[k];
                                var b = positionItem;
                                var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                if (lengthCal > lengthInput / 15) continue;
                                else return false;
                            }
                            return true;
                        }(positions, positionOfObj, length)) {
                            positions.push(positionOfObj);
                            //operateGroups[i].children[j].visible = true;
                            // operateGroups[i].children[j].element.hidden = false;
                            operateGroups[i].children[j].element.classList.remove('displayNone');
                            //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                        }
                        else {
                            operateGroups[i].children[j].element.classList.add('displayNone');
                            //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                            // operateGroups[i].children[j].element.hidden = true;
                        }
                    }
            }
        }

    }

}

var updatePlaneLineScale = function () {

}

var drawRegionBlock = function (operateType) {

    if (runFromNginx) {
        if (operateType == 'show') {
            regionBlockGroup.visible = true;
            if (regionBlockGroup.children.length == 0) {
                if (true) {
                    var dg = new DataGet();
                    dg.drawRegionBlock(dataGet.areaCode);
                }
            }

        }
        else if (operateType == 'hide') {
            regionBlockGroup.visible = false
        }
    }
    else {
        if (operateType == 'show') {
            //tongxin5GMapGroup
            // regionBlockGroup
            regionBlockGroup.visible = true;
            if (regionBlockGroup.children.length == 0) {
                var data = regionBlock3.features;
                //var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);
                var drawRegionBlockItem = function (itemData) {
                    if (true) {
                        var polygonData = itemData.polygon;

                        var regionPts = [];
                        for (var i = 0; i < polygonData.length; i++) {
                            var lon = polygonData[i][0];
                            var lat = polygonData[i][1];
                            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                        }
                        var regionShape = new THREE.Shape(regionPts);
                        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                        var color = 0x666600;
                        switch (itemData.regionTypeSimple) {
                            case 'R': { color = 0x666600; }; break;
                            case 'A': { color = 0xCC6666; }; break;
                            case 'B': { color = 0x9966CC; }; break;
                            case 'M': { color = 0xFF3300; }; break;
                            case 'W': { color = 0x993366; }; break;
                            case 'S': { color = 0xFF33CC; }; break;
                            case 'U': { color = 0x990000; }; break;
                            case 'G': { color = 0xFF0066; }; break;
                        }

                        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 }));
                        mesh.position.set(0, 0, 0);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(1, 1, 1);
                        mesh.Tag =
                        {
                            regionType: itemData.regionType,
                            regionTypeSimple: itemData.regionTypeSimple,
                            rongjilv: itemData.rongjilv
                        };
                        regionBlockGroup.add(mesh);
                    }
                    else {
                        var polygonData = itemData.polygon;

                        var regionPts = [];
                        for (var i = 0; i < polygonData.length; i++) {
                            var lon = polygonData[i][0];
                            var lat = polygonData[i][1];
                            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                        }
                        var regionShape = new THREE.Shape(regionPts);
                        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                        var color = 0x666600;
                        switch (itemData.regionTypeSimple) {
                            case 'R': { color = 0x666600; }; break;
                            case 'A': { color = 0xCC6666; }; break;
                            case 'B': { color = 0x9966CC; }; break;
                            case 'M': { color = 0xFF3300; }; break;
                            case 'W': { color = 0x993366; }; break;
                            case 'S': { color = 0xFF33CC; }; break;
                            case 'U': { color = 0x990000; }; break;
                            case 'G': { color = 0xFF0066; }; break;
                        }
                        var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 });
                        material.depthTest = false;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(0, 0, 0);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(1, 1, 1);
                        mesh.Tag =
                        {
                            regionType: itemData.regionType,
                            regionTypeSimple: itemData.regionTypeSimple,
                            rongjilv: itemData.rongjilv
                        };
                        regionBlockGroup.add(mesh);
                    }
                }
                var drawRegionBlockItem2 = function (itemData, itemIndex) {


                    var cadLeftTop = { x: 16369.1554, y: 67202.5534 };
                    var cadRightBottom = { x: 20907.227, y: 62778.341 };

                    var baiduMapLeftTop = { x: 112.540805, y: 37.906085 };//112.540805,37.906085
                    var baiduMapRightBottom = { x: 112.592103, y: 37.866438 };//112.592103,37.866538 865538
                    var polygonData = itemData.geometry.coordinates;

                    var regionPts = [];
                    var sumSql = '';
                    for (var i = 0; i < polygonData.length; i++) {

                        //var x = polygonData[i][0];

                        var lon = polygonData[i][0];
                        var lat = polygonData[i][1];

                        var lon = baiduMapLeftTop.x + (polygonData[i][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                        var lat = baiduMapRightBottom.y + (polygonData[i][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat) + 0.3;
                        // positions.push(x_m, 1, 0 - z_m);
                        var sql = 'update area_wise_pos set lon=' + lon + ',lat=' + lat + ' where aw_id=' + (itemIndex + 2) + ' and sort=' + i + ';';//(aw_id,,lat,sort)VALUES(' + (itemIndex + 2) + ',' + lon + ',' + lat + ',' + i + ');';
                        sumSql += sql;
                        regionPts.push(new THREE.Vector2(x_m, z_m));
                    }
                    var regionShape = new THREE.Shape(regionPts);
                    var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                    var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                    var color = 0x666600;
                    //regionTypeSimples

                    var regionTypes = ['居住用地', '公共管理与公共服务设施用地', '商业服务业设施用地', '工业用地', '物流仓储用地', '道路与交通设施用地', '公用设施用地', '绿地与广场用地'];
                    var regionTypeSimples = ['R', 'A', 'B', 'M', 'W', 'S', 'U', 'G'];
                    switch (regionTypeSimples[itemIndex % 8]) {
                        case 'R': { color = 0x666600; }; break;
                        case 'A': { color = 0xCC6666; }; break;
                        case 'B': { color = 0x9966CC; }; break;
                        case 'M': { color = 0xFF3300; }; break;
                        case 'W': { color = 0x993366; }; break;
                        case 'S': { color = 0xFF33CC; }; break;
                        case 'U': { color = 0x990000; }; break;
                        case 'G': { color = 0xFF0066; }; break;
                    }
                    var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.8 });
                    material.depthTest = false;
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, 0);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.scale.set(1, 1, 1);
                    mesh.Tag =
                    {
                        regionType: regionTypes[itemIndex % 8],
                        regionTypeSimple: regionTypeSimples[itemIndex % 8],
                        rongjilv: 99
                    };
                    mesh.renderOrder = 97;
                    regionBlockGroup.add(mesh);
                    return sumSql;
                }
                var sumSqlss = '';
                for (var i = 0; i < data.length; i++) {
                    sumSqlss += drawRegionBlockItem2(data[i], i);
                    //'INSERT INTO area_wise (`name`,at_id,p_id)VALUES (\'' + '区块' + i + '\',' + (i + 2) + ',1);';
                }
                console.log('sumSqlss', sumSqlss);

            }
            else {
                searchRegionBlock('BB');
            }
        }
        else if (operateType == 'hide') {
            regionBlockGroup.visible = false;
        }
    }
}

var drawSongdianquyu = function (operateType) {
    if (runFromNginx) {
        if (operateType == 'show') {
            //tongxin5GMapGroup
            // regionBlockGroup
            songdianquGroup.visible = true;

            var drawRegionBlockItem2 = function (itemData, itemIndex) {


                var polygonData = itemData.coordinates;

                var regionPts = [];
                for (var i = 0; i < polygonData.length; i++) {

                    //var x = polygonData[i][0];

                    var lon = polygonData[i]['Lon'];
                    var lat = polygonData[i]['Lat'];


                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);
                    // positions.push(x_m, 1, 0 - z_m);

                    regionPts.push(new THREE.Vector2(x_m, z_m));

                    //sumSql += 'INSERT INTO transmission_area_pos(t_id,lon,lat,sort)VALUE(' + itemIndex + ',' + getBaiduPositionLon(x_m) + ',' + getBaiduPositionLat(z_m) + ',' + i + ');';
                }
                if (regionPts.length < 3) {
                    return;
                }
                else {
                    var regionShape = new THREE.Shape(regionPts);
                    var extrudeSettings = { depth: 0.5 + 0.4 * (itemIndex * 0.01), bevelEnabled: false };
                    var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                    var color = itemData.Color % 16777216;
                    //regionTypeSimples

                    //var regionTypes = ['居住用地', '公共管理与公共服务设施用地', '商业服务业设施用地', '工业用地', '物流仓储用地', '道路与交通设施用地', '公用设施用地', '绿地与广场用地'];
                    //var regionTypeSimples = ['R', 'A', 'B', 'M', 'W', 'S', 'U', 'G'];
                    //switch (regionTypeSimples[itemIndex % 8]) {
                    //    case 'R': { color = 0x666600; }; break;
                    //    case 'A': { color = 0xCC6666; }; break;
                    //    case 'B': { color = 0x9966CC; }; break;
                    //    case 'M': { color = 0xFF3300; }; break;
                    //    case 'W': { color = 0x993366; }; break;
                    //    case 'S': { color = 0xFF33CC; }; break;
                    //    case 'U': { color = 0x990000; }; break;
                    //    case 'G': { color = 0xFF0066; }; break;
                    //}
                    var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.8 });
                    material.depthTest = false;
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, 0);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.scale.set(1, 1, 1);
                    mesh.Tag =
                    {
                        Name: itemData.Name,
                        Code: itemData.Code,
                        AreaCode: itemData.AreaCode
                    };
                    mesh.renderOrder = 97;
                    songdianquGroup.add(mesh);
                }
            }
            var successF = function (inputData) {
                if (songdianquGroup.children.length == 0) {
                    var data = JSON.parse(inputData);
                    for (var i = 0; i < data.length; i++) {
                        ssSumSql += drawRegionBlockItem2(data[i], i);
                    }
                }
            }


            if (songdianquGroup.children.length == 0) {
                $.ajax({
                    type: "POST",
                    url: '~/data.apitransmissionarea',
                    crossDomain: true,
                    data: { 'Type': 'read', 'AreaCode': 1 },
                    success: successF,
                    error: function (err) {
                        console.log('~/data.apiregionpoint', err);
                    }
                });
                //var data = songdianquyu.features;
                ////var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);
                //var drawRegionBlockItem = function (itemData) {
                //    if (true) {
                //        var polygonData = itemData.polygon;

                //        var regionPts = [];
                //        for (var i = 0; i < polygonData.length; i++) {
                //            var lon = polygonData[i][0];
                //            var lat = polygonData[i][1];
                //            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                //        }
                //        var regionShape = new THREE.Shape(regionPts);
                //        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                //        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                //        var color = 0x666600;
                //        switch (itemData.regionTypeSimple) {
                //            case 'R': { color = 0x666600; }; break;
                //            case 'A': { color = 0xCC6666; }; break;
                //            case 'B': { color = 0x9966CC; }; break;
                //            case 'M': { color = 0xFF3300; }; break;
                //            case 'W': { color = 0x993366; }; break;
                //            case 'S': { color = 0xFF33CC; }; break;
                //            case 'U': { color = 0x990000; }; break;
                //            case 'G': { color = 0xFF0066; }; break;
                //        }

                //        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 }));
                //        mesh.position.set(0, 0, 0);
                //        mesh.rotateX(-Math.PI / 2);
                //        mesh.scale.set(1, 1, 1);
                //        mesh.Tag =
                //            {
                //                regionType: itemData.regionType,
                //                regionTypeSimple: itemData.regionTypeSimple,
                //                rongjilv: itemData.rongjilv
                //            };
                //        regionBlockGroup.add(mesh);
                //    }
                //    else {
                //        var polygonData = itemData.polygon;

                //        var regionPts = [];
                //        for (var i = 0; i < polygonData.length; i++) {
                //            var lon = polygonData[i][0];
                //            var lat = polygonData[i][1];
                //            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                //        }
                //        var regionShape = new THREE.Shape(regionPts);
                //        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                //        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                //        var color = 0x666600;
                //        switch (itemData.regionTypeSimple) {
                //            case 'R': { color = 0x666600; }; break;
                //            case 'A': { color = 0xCC6666; }; break;
                //            case 'B': { color = 0x9966CC; }; break;
                //            case 'M': { color = 0xFF3300; }; break;
                //            case 'W': { color = 0x993366; }; break;
                //            case 'S': { color = 0xFF33CC; }; break;
                //            case 'U': { color = 0x990000; }; break;
                //            case 'G': { color = 0xFF0066; }; break;
                //        }
                //        var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 });
                //        material.depthTest = false;
                //        var mesh = new THREE.Mesh(geometry, material);
                //        mesh.position.set(0, 0, 0);
                //        mesh.rotateX(-Math.PI / 2);
                //        mesh.scale.set(1, 1, 1);
                //        mesh.Tag =
                //            {
                //                regionType: itemData.regionType,
                //                regionTypeSimple: itemData.regionTypeSimple,
                //                rongjilv: itemData.rongjilv
                //            };
                //        songdianquGroup.add(mesh);
                //    }
                //}
                //var drawRegionBlockItem2 = function (itemData, itemIndex) {

                //    var sumSql = '';
                //    var cadLeftTop = { x: 16369.1554, y: 67202.5534 };
                //    var cadRightBottom = { x: 20907.227, y: 62778.341 };

                //    var baiduMapLeftTop = { x: 112.540805, y: 37.906085 };//112.540805,37.906085
                //    var baiduMapRightBottom = { x: 112.592103, y: 37.866438 };//112.592103,37.866538 865538
                //    var polygonData = itemData.geometry.coordinates;

                //    var regionPts = [];
                //    for (var i = 0; i < polygonData.length; i++) {

                //        //var x = polygonData[i][0];

                //        var lon = polygonData[i][0];
                //        var lat = polygonData[i][1];

                //        var lon = baiduMapLeftTop.x + (polygonData[i][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                //        var lat = baiduMapRightBottom.y + (polygonData[i][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                //        var x_m = MercatorGetXbyLongitude(lon);
                //        var z_m = MercatorGetYbyLatitude(lat) + 0.3;
                //        // positions.push(x_m, 1, 0 - z_m);

                //        regionPts.push(new THREE.Vector2(x_m, z_m));

                //        sumSql += 'INSERT INTO transmission_area_pos(t_id,lon,lat,sort)VALUE(' + itemIndex + ',' + getBaiduPositionLon(x_m) + ',' + getBaiduPositionLat(z_m) + ',' + i + ');';
                //    }
                //    var regionShape = new THREE.Shape(regionPts);
                //    var extrudeSettings = { depth: 0.4 * (itemIndex * 0.01), bevelEnabled: false };
                //    var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                //    var color = 0x666600;
                //    //regionTypeSimples

                //    var regionTypes = ['居住用地', '公共管理与公共服务设施用地', '商业服务业设施用地', '工业用地', '物流仓储用地', '道路与交通设施用地', '公用设施用地', '绿地与广场用地'];
                //    var regionTypeSimples = ['R', 'A', 'B', 'M', 'W', 'S', 'U', 'G'];
                //    switch (regionTypeSimples[itemIndex % 8]) {
                //        case 'R': { color = 0x666600; }; break;
                //        case 'A': { color = 0xCC6666; }; break;
                //        case 'B': { color = 0x9966CC; }; break;
                //        case 'M': { color = 0xFF3300; }; break;
                //        case 'W': { color = 0x993366; }; break;
                //        case 'S': { color = 0xFF33CC; }; break;
                //        case 'U': { color = 0x990000; }; break;
                //        case 'G': { color = 0xFF0066; }; break;
                //    }
                //    var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.8 });
                //    material.depthTest = false;
                //    var mesh = new THREE.Mesh(geometry, material);
                //    mesh.position.set(0, 0, 0);
                //    mesh.rotateX(-Math.PI / 2);
                //    mesh.scale.set(1, 1, 1);
                //    mesh.Tag =
                //        {
                //            regionType: regionTypes[itemIndex % 8],
                //            regionTypeSimple: regionTypeSimples[itemIndex % 8],
                //            rongjilv: 99
                //        };
                //    mesh.renderOrder = 97;
                //    songdianquGroup.add(mesh);
                //    return sumSql;
                //}
                //var ssSumSql = '';
                //for (var i = 0; i < data.length; i++) {
                //    ssSumSql += drawRegionBlockItem2(data[i], i);
                //}
                //console.log('ssSumSql', ssSumSql);
                //songdianquGroup.position.set(-25.32999999999998, 0, 11.699999999999986);
                //[object Object]: {x: , y: 0, z: }
            }
            else {
                //searchRegionBlock('BB');
            }
        }
        else {
            songdianquGroup.visible = false;
        }
    }
    else {
        if (operateType == 'show') {
            //tongxin5GMapGroup
            // regionBlockGroup
            songdianquGroup.visible = true;
            if (songdianquGroup.children.length == 0) {
                var data = songdianquyu.features;
                //var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);
                var drawRegionBlockItem = function (itemData) {
                    if (true) {
                        var polygonData = itemData.polygon;

                        var regionPts = [];
                        for (var i = 0; i < polygonData.length; i++) {
                            var lon = polygonData[i][0];
                            var lat = polygonData[i][1];
                            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                        }
                        var regionShape = new THREE.Shape(regionPts);
                        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                        var color = 0x666600;
                        switch (itemData.regionTypeSimple) {
                            case 'R': { color = 0x666600; }; break;
                            case 'A': { color = 0xCC6666; }; break;
                            case 'B': { color = 0x9966CC; }; break;
                            case 'M': { color = 0xFF3300; }; break;
                            case 'W': { color = 0x993366; }; break;
                            case 'S': { color = 0xFF33CC; }; break;
                            case 'U': { color = 0x990000; }; break;
                            case 'G': { color = 0xFF0066; }; break;
                        }

                        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 }));
                        mesh.position.set(0, 0, 0);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(1, 1, 1);
                        mesh.Tag =
                        {
                            regionType: itemData.regionType,
                            regionTypeSimple: itemData.regionTypeSimple,
                            rongjilv: itemData.rongjilv
                        };
                        regionBlockGroup.add(mesh);
                    }
                    else {
                        var polygonData = itemData.polygon;

                        var regionPts = [];
                        for (var i = 0; i < polygonData.length; i++) {
                            var lon = polygonData[i][0];
                            var lat = polygonData[i][1];
                            regionPts.push(new THREE.Vector2(MercatorGetXbyLongitude(lon), MercatorGetYbyLatitude(lat)));
                        }
                        var regionShape = new THREE.Shape(regionPts);
                        var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                        var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                        var color = 0x666600;
                        switch (itemData.regionTypeSimple) {
                            case 'R': { color = 0x666600; }; break;
                            case 'A': { color = 0xCC6666; }; break;
                            case 'B': { color = 0x9966CC; }; break;
                            case 'M': { color = 0xFF3300; }; break;
                            case 'W': { color = 0x993366; }; break;
                            case 'S': { color = 0xFF33CC; }; break;
                            case 'U': { color = 0x990000; }; break;
                            case 'G': { color = 0xFF0066; }; break;
                        }
                        var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.5 });
                        material.depthTest = false;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(0, 0, 0);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(1, 1, 1);
                        mesh.Tag =
                        {
                            regionType: itemData.regionType,
                            regionTypeSimple: itemData.regionTypeSimple,
                            rongjilv: itemData.rongjilv
                        };
                        songdianquGroup.add(mesh);
                    }
                }
                var drawRegionBlockItem2 = function (itemData, itemIndex) {

                    var sumSql = '';
                    var cadLeftTop = { x: 16369.1554, y: 67202.5534 };
                    var cadRightBottom = { x: 20907.227, y: 62778.341 };

                    var baiduMapLeftTop = { x: 112.540805, y: 37.906085 };//112.540805,37.906085
                    var baiduMapRightBottom = { x: 112.592103, y: 37.866438 };//112.592103,37.866538 865538
                    var polygonData = itemData.geometry.coordinates;

                    var regionPts = [];
                    for (var i = 0; i < polygonData.length; i++) {

                        //var x = polygonData[i][0];

                        var lon = polygonData[i][0];
                        var lat = polygonData[i][1];

                        var lon = baiduMapLeftTop.x + (polygonData[i][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                        var lat = baiduMapRightBottom.y + (polygonData[i][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                        var x_m = MercatorGetXbyLongitude(lon) - 25.32999999999998;
                        var z_m = MercatorGetYbyLatitude(lat) + 0.3 - 11.699999999999986;
                        // positions.push(x_m, 1, 0 - z_m);

                        regionPts.push(new THREE.Vector2(x_m, z_m));
                        // songdianquGroup.position.set(-25.32999999999998, 0, 11.699999999999986);
                        sumSql += 'INSERT INTO transmission_area_pos(t_id,lon,lat,sort)VALUE(' + itemIndex + ',' + getBaiduPositionLon(x_m) + ',' + getBaiduPositionLat(z_m) + ',' + i + ');';
                    }
                    var regionShape = new THREE.Shape(regionPts);
                    var extrudeSettings = { depth: 0.4 * (itemIndex * 0.01), bevelEnabled: false };
                    var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                    var color = 0x666600;
                    //regionTypeSimples

                    var regionTypes = ['居住用地', '公共管理与公共服务设施用地', '商业服务业设施用地', '工业用地', '物流仓储用地', '道路与交通设施用地', '公用设施用地', '绿地与广场用地'];
                    var regionTypeSimples = ['R', 'A', 'B', 'M', 'W', 'S', 'U', 'G'];
                    switch (regionTypeSimples[itemIndex % 8]) {
                        case 'R': { color = 0x666600; }; break;
                        case 'A': { color = 0xCC6666; }; break;
                        case 'B': { color = 0x9966CC; }; break;
                        case 'M': { color = 0xFF3300; }; break;
                        case 'W': { color = 0x993366; }; break;
                        case 'S': { color = 0xFF33CC; }; break;
                        case 'U': { color = 0x990000; }; break;
                        case 'G': { color = 0xFF0066; }; break;
                    }
                    var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: 0.8 });
                    material.depthTest = false;
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, 0);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.scale.set(1, 1, 1);
                    mesh.Tag =
                    {
                        regionType: regionTypes[itemIndex % 8],
                        regionTypeSimple: regionTypeSimples[itemIndex % 8],
                        rongjilv: 99
                    };
                    mesh.renderOrder = 97;
                    songdianquGroup.add(mesh);
                    return sumSql;
                }
                var ssSumSql = '';
                for (var i = 0; i < data.length; i++) {
                    ssSumSql += drawRegionBlockItem2(data[i], i);
                }
                console.log('ssSumSql', ssSumSql);
                //    songdianquGroup.position.set(-25.32999999999998, 0, 11.699999999999986);
                //[object Object]: {x: , y: 0, z: }
            }
            else {
                //searchRegionBlock('BB');
            }
        }
        else if (operateType == 'hide') {
            songdianquGroup.visible = false;
        }
    }
}
var searchRegionBlock = function (keyWords) {
    for (var i = 0; i < regionBlockGroup.children.length; i++) {
        if (regionBlockGroup.children[i].Tag.regionType.search(keyWords) >= 0) {
            regionBlockGroup.children[i].material.color.set(0xFFFF00);
            regionBlockGroup.children[i].material.opacity = 0.9;
        }
        else {
            var color = 0x666600;
            switch (regionBlockGroup.children[i].Tag.regionTypeSimple) {
                case 'R': { color = 0x666600; }; break;
                case 'A': { color = 0xCC6666; }; break;
                case 'B': { color = 0x9966CC; }; break;
                case 'M': { color = 0xFF3300; }; break;
                case 'W': { color = 0x993366; }; break;
                case 'S': { color = 0xFF33CC; }; break;
                case 'U': { color = 0x990000; }; break;
                case 'G': { color = 0xFF0066; }; break;

            }
            regionBlockGroup.children[i].material.color.set(color);
            regionBlockGroup.children[i].material.opacity = 0.7;
        }
    }
}

var lineShowIndex = [0, 1, 2, 3, 4, 5, 6];
var chaoliuData = { geometry: null, vertices: [] };
var drawLine = function (operateType) {


    //var found = false;
    //if (operateType == 'show') {

    //    var cadLeftTop = { x: 17545.309, y: 65811.8395 };
    //    var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

    //    var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
    //    var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };
    //    //tongxin5GMapGroup
    //    lineGroup.visible = true;
    //    if (true) {
    //        chaoliuData.geometry = new THREE.BufferGeometry();

    //        var sumSql = '';
    //        if (lineGroup.children.length == 0) {
    //            var data = shudianxian3;
    //            for (var i = 0; i < data.features.length; i++) {

    //                if (data.features[i].geometry.type == "LineString") { }
    //                else { continue; }

    //                var layer = data.features[i].properties.Layer;
    //                var geometryLine = new THREE.BufferGeometry();
    //                var positions = [];
    //                // var geometry = new THREE.Geometry();
    //                var geometry = new THREE.LineGeometry();
    //                var geometryFromData = data.features[i].geometry.coordinates;
    //                var color = 'orange';

    //                var entityHandle = data.features[i].properties.EntityHandle;
    //                var colorAndName = getNameAndColorOfLine(layer);
    //                color = colorAndName[0];
    //                var nameV = colorAndName[1];
    //                var stationName = (colorAndName.length == 3 ? colorAndName[2] : '未知');

    //                if (colorAndName.length == 3 && colorAndName[2] == '方案') {
    //                    continue;
    //                }
    //                if (found) {
    //                    color = 'orange';
    //                }
    //                color = getColorByStation(stationName);
    //                var show = getShowByStation(stationName);
    //                if (!show) {
    //                    continue;
    //                }

    //                var indexV = getIndexByStation(stationName);
    //                //switch (data.features[i].properties.ExtendedEntity) {
    //                //    case '5.0 电缆|10|中压线路|255|0|255|':
    //                //        {
    //                //            color = 'orange';
    //                //        }; break;
    //                //    case '5.0 电缆|10|中压线路|0|128|0|':
    //                //        {
    //                //            color = 'purple';
    //                //        }; break;
    //                //    case '5.0 电缆|10|中压线路|255|0|0|':
    //                //        {
    //                //            color = 'red';
    //                //        }; break;
    //                //    case '5.0 架空|10|中压线路|255|0|0|':
    //                //        {
    //                //            color = 'white';
    //                //        }; break;
    //                //    case '5.0 架空|10|中压线路|255|0|255|':
    //                //        {
    //                //            color = 'blue';
    //                //        }; break;
    //                //    case '5.0 架空|10|中压线路|255|165|0|':
    //                //        {
    //                //            color = 0x45f24a;
    //                //        }; break;
    //                //    case '5.0 架空|10|中压线路|0|128|0|':
    //                //        {
    //                //            color = 'purple';
    //                //        }; break;
    //                //    default:
    //                //        {
    //                //            console.log('提示', data.features[i].properties.ExtendedEntity + '没有设置');
    //                //        }; break;
    //                //}

    //                var midPoints = [];
    //                for (var j = 0; j < geometryFromData.length; j++) {
    //                    var lon = baiduMapLeftTop.x + (geometryFromData[j][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
    //                    var lat = baiduMapRightBottom.y + (geometryFromData[j][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
    //                    var x_m = MercatorGetXbyLongitude(lon);
    //                    var z_m = MercatorGetYbyLatitude(lat);
    //                    positions.push(x_m, 0, 0 - z_m);

    //                    //geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    //                    // geometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));

    //                    if (j > 0) {
    //                        var lonLast = baiduMapLeftTop.x + (geometryFromData[j - 1][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
    //                        var latLast = baiduMapRightBottom.y + (geometryFromData[j - 1][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
    //                        var x_mLast = MercatorGetXbyLongitude(lonLast);
    //                        var z_mLast = MercatorGetYbyLatitude(latLast);

    //                        midPoints.push();
    //                        midPoints.push();

    //                        dataOfLineLabel.push({ x: (x_m + x_mLast) / 2, z: -(z_m + z_mLast) / 2, nameV: nameV, colorR: color, indexV: indexV })

    //                        var lengthOfTwoPoint = Math.sqrt((x_m - x_mLast) * (x_m - x_mLast) + (z_m - z_mLast) * (z_m - z_mLast));
    //                        if (lengthOfTwoPoint > 0.5) {
    //                            //  var
    //                            var n = Math.ceil(lengthOfTwoPoint / 0.5);

    //                            var p = function (nInput, x1, y1, x2, y2) {
    //                                var points = [];
    //                                for (var i = 0; i < nInput; i++) {

    //                                    for (var j = 0; j < chaoliufenxiGroupCount; j++) {
    //                                        chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (x2 - x1) + x1);
    //                                        chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (y2 - y1) + y1);
    //                                    }


    //                                    //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (y2 - y1) + y1);
    //                                }
    //                                return points;
    //                            }(n, x_mLast, z_mLast, x_m, z_m);

    //                            var xx = p;
    //                        }
    //                        else {
    //                            var n = 1;

    //                            var p = function (nInput, x1, y1, x2, y2) {
    //                                var points = [];
    //                                for (var i = 0; i < nInput; i++) {

    //                                    for (var j = 0; j < chaoliufenxiGroupCount; j++) {
    //                                        chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (x2 - x1) + x1);
    //                                        chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (y2 - y1) + y1);
    //                                    }


    //                                    //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (y2 - y1) + y1);
    //                                    //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (x2 - x1) + x1);
    //                                    //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (y2 - y1) + y1);
    //                                }
    //                                return points;
    //                            }(n, x_mLast, z_mLast, x_m, z_m);

    //                            var xx = p;
    //                        }
    //                    }

    //                    //console.log('位置', lon, lat);

    //                    var sqlItem = 'INSERT INTO line_pos(l_id,lon,lat,sort) VALUES(' + i + ',' + lon + ',' + lat + ',' + j + ');';
    //                    //console.log('sqlItem', sqlItem);
    //                    sumSql += sqlItem;
    //                }
    //                geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    //                geometry.setPositions(positions);
    //                //geometry.computeBoundingSphere();

    //                var material_ForSelect = new THREE.LineBasicMaterial({ color: color, linewidth: 1, transparent: true, opacity: 0 });//ignored by WebGLRenderer});

    //                var material = new THREE.LineMaterial({
    //                    color: color,
    //                    linewidth: 0.003, // in pixels
    //                    //vertexColors: 0x12f43d,
    //                    ////resolution:  // to be set by renderer, eventually
    //                    //dashed: false
    //                });
    //                material.depthTest = false;
    //                var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
    //                line_ForSelect.Tag = { name: nameV, station: stationName };
    //                //line.Tag = { name: data[i].name, voltage: data[i].voltage }

    //                var sqlOfLine = "INSERT INTO line (id,sub_id,`name`,p_id,sub_Name)VALUES(" + i + ",1,'" + nameV + "',1,'" + stationName + "');";
    //                sumSql += sqlOfLine;
    //                console.log('vv', nameV, stationName);

    //                var line = new THREE.Line2(geometry, material);
    //                line.computeLineDistances();
    //                line.Tag = { name: nameV, voltage: '', indexV: indexV, colorR: color };
    //                line.renderOrder = 99;
    //                line.scale.set(1, 1, 1);
    //                //line.rotateX(-Math.PI / 2);
    //                lineGroup.add(line_ForSelect);
    //                lineGroup.add(line);

    //                //for (var k = 0; k < midPoints.length; k += 2) {
    //                //    var x_m = midPoints[k];
    //                //    var z_m = midPoints[k + 1];

    //                //    var labelDiv = document.createElement('div');
    //                //    labelDiv.className = 'labelline';
    //                //    labelDiv.textContent = nameV;
    //                //    labelDiv.style.marginTop = '-1em';

    //                //    labelDiv.style.color = Number.isInteger(color) ? get16(color) : color;
    //                //    var divLabel = new THREE.CSS2DObject(labelDiv);
    //                //    divLabel.position.set(x_m, 0, -z_m);
    //                //    divLabel.positionTag = [x_m, 0, -z_m];
    //                //    lineGroup.add(divLabel);
    //                //}


    //                if (nameV == '') {
    //                    if (!found) {

    //                        var showxx = 'case \'' + layer + '\':\r{\r{ return [\'green\', \'\', \'\'] };}; break;';
    //                        console.log('EntityHandle', showxx);
    //                    }
    //                    found = true;
    //                }
    //            }
    //        }
    //        else { lineGroup.visible = true; }
    //        console.log('sumSql', sumSql);
    //    }

    //    if (false) {
    //        if (lineGroup.children.length == 0) {
    //            var data = shudianxian;
    //            //var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);

    //            //var hilbertPoints = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
    //            for (var i = 0; i < data.length; i++) {

    //                var geometry = new THREE.BufferGeometry();
    //                var positions = [];

    //                //var lineGeometry = new THREE.Geometry();
    //                var path = data[i].path;
    //                var points = [];
    //                var widths = [];
    //                for (var j = 0; j < path.length; j++) {
    //                    var lon = path[j][0];
    //                    var lat = path[j][1];
    //                    var x_m = MercatorGetXbyLongitude(lon);
    //                    var z_m = MercatorGetYbyLatitude(lat);
    //                    //lineGeometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));
    //                    positions.push(x_m, 0.01, 0 - z_m);
    //                    widths.push(0.001);

    //                    if (j > 0) {
    //                        var lonLast = path[j - 1][0];
    //                        var latLast = path[j - 1][1];
    //                        var x_mLast = MercatorGetXbyLongitude(lonLast);
    //                        var z_mLast = MercatorGetYbyLatitude(latLast);


    //                        var labelDiv = document.createElement('div');
    //                        labelDiv.className = 'labelbiandianzhan';
    //                        labelDiv.textContent = data[i].name;
    //                        labelDiv.style.marginTop = '-1em';

    //                        labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
    //                        var divLabel = new THREE.CSS2DObject(labelDiv);
    //                        divLabel.position.set(x_m, 0, -z_m);
    //                        divLabel.positionTag = [x_m, 0, -z_m];
    //                        biandiansuoGroup.add(divLabel);
    //                    }

    //                }
    //                //   geometry.attributes[]

    //                geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    //                geometry.computeBoundingSphere();

    //                var color = 'orange';
    //                switch (data[i].voltage) {
    //                    case '380V':
    //                        {
    //                            color = 'orange';
    //                        }; break;
    //                    case '10KV':
    //                        {
    //                            color = 'purple';
    //                        }; break;
    //                    case '35KV':
    //                        {
    //                            color = 'red';
    //                        }; break;
    //                }
    //                var material = new THREE.LineBasicMaterial({ color: color, linewidth: 500 });
    //                var line = new THREE.Line(geometry, material);
    //                line.Tag = { name: data[i].name, voltage: data[i].voltage }
    //                line.scale.set(1, 1, 1);
    //                //line.rotateX(-Math.PI / 2);
    //                lineGroup.add(line);
    //            }

    //        }
    //        else {
    //            throw '这里的代码没写-要瑞卿  201912160928';
    //            //searchTongxin5G('BB');
    //        }
    //    }


    //}
    //else if (operateType == 'hide') {
    //    lineGroup.visible = false;

    //}
    electricLine.updateLabelOfLine();
}

var drawChaoliufenxi = function (operateType) {
    if (operateType == 'show') {
        animateChaoliuFenxi = function () {
            var sum = 900;
            var t = Date.now() % sum;

            for (var i = 0; i < chaoliuFenxiData.length; i++) {
                if (t < sum / chaoliuFenxiData.length * i && t > sum / chaoliuFenxiData.length * (i - 1)) {
                    chaoliufenxiGroup[i].visible = true;
                }
                else
                    chaoliufenxiGroup[i].visible = false;
            }
        }
    }
    else if (operateType == 'hide') {
        for (var i = 0; i < chaoliuFenxiData.length; i++) {
            chaoliufenxiGroup[i].visible = false;
        }
        animateChaoliuFenxi = function () { }
    }
    var f = function (data, addGroup) {
        var geometry = new THREE.BufferGeometry();
        var numPoints = data.length / 2;
        var positions = new Float32Array(numPoints * 3);
        var colors = new Float32Array(numPoints * 3);
        var k = 0;
        for (var i = 0; i < numPoints; i++) {
            positions[3 * i] = data[i * 2 + 0];
            positions[3 * i + 1] = 0.04;
            positions[3 * i + 2] = -data[i * 2 + 1];
            //for (var j = 0; j < length; j++) {
            //    var u = i / width;
            //    var v = j / length;
            //    var x = u - 0.5;
            //    var y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
            //    var z = v - 0.5;
            //    positions[3 * k] = x;
            //    positions[3 * k + 1] = y;
            //    positions[3 * k + 2] = z;
            //    var intensity = (y + 0.1) * 5;
            colors[3 * i] = 0;
            colors[3 * i + 1] = 0;
            colors[3 * i + 2] = 255;
            //    k++;
            //}
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeBoundingBox();
        var pointSize = 0.08;
        var material = new THREE.PointsMaterial({ size: pointSize, vertexColors: THREE.VertexColors });
        var p = new THREE.Points(geometry, material);

        addGroup.add(p);
    };

    for (var i = 0; i < chaoliuFenxiData.length; i++) {
        f(chaoliuFenxiData[i], chaoliufenxiGroup[i]);
    }

    //f(chaoliuFenxiData.data2, chaoliufenxiGroup2);
    //f(chaoliuFenxiData.data3, chaoliufenxiGroup3);
    //f(chaoliuFenxiData.data4, chaoliufenxiGroup4);
    //f(chaoliuFenxiData.data5, chaoliufenxiGroup5);
}
var animateChaoliuFenxi = function () {
    var sum = 900;
    var t = Date.now() % sum;

    for (var i = 0; i < chaoliuFenxiData.length; i++) {
        if (t < sum / chaoliuFenxiData.length * i && t > sum / chaoliuFenxiData.length * (i - 1)) {
            chaoliufenxiGroup[i].visible = true;
        }
        else
            chaoliufenxiGroup[i].visible = false;
    }
}

var searchLineByIndex = function (keyWords) {
    lineShowIndex = keyWords;
    searchCondition.eLObj.lineShowIndex = keyWords + '';
    if (electricLine.group.visible) {
        for (var i = 0; i < electricLine.group.children.length; i++) {
            if (electricLine.group.children[i].type == "Line2") {
                if (keyWords.indexOf(electricLine.group.children[i].Tag.indexV) >= 0) {
                    electricLine.group.children[i].visible = true;
                }
                else {
                    electricLine.group.children[i].visible = false;
                }
            }
        }
    }
    electricLine.updateLabelOfLine();
}

var searchLineByName = function (keyWords) {
    if (electricLine.group.visible) {
        for (var i = 0; i < electricLine.group.children.length; i++) {
            if (electricLine.group.children[i].type == "Line2") {
                if (electricLine.group.children[i].Tag.name.search(keyWords) >= 0) {
                    electricLine.group.children[i].material.color.set(0xFFFF00);
                    electricLine.group.children[i].material.opacity = 0.6;
                    electricLine.group.children[i].material.transparent = true;
                    // transparent: true, opacity: 0 
                }
                else {
                    electricLine.group.children[i].material.color.set(electricLine.group.children[i].Tag.colorR);
                    //lineGroup.children[i].material.opacity = 0;
                    electricLine.group.children[i].material.transparent = false;
                }
            }
        }
        if (keyWords == '') {

            for (var i = 0; i < electricLine.group.children.length; i++) {
                if (electricLine.group.children[i].type == "Line2") {
                    electricLine.group.children[i].material.color.set(electricLine.group.children[i].Tag.colorR);
                    electricLine.group.children[i].material.transparent = false;
                }
            }
        }
    }
}

var guanGouObj = {
    matLineDashed: new THREE.LineDashedMaterial({ vertexColors: THREE.VertexColors, scale: 2, dashSize: 1, gapSize: 1 }),
    matLine: new THREE.LineMaterial({

        color: 'orange',
        linewidth: 0.01, // in pixels
        vertexColors: THREE.VertexColors,
        //resolution:  // to be set by renderer, eventually
        dashed: false

    })
};
var drawLine2 = function (operateType) {

    if (runFromNginx = true) {
        if (operateType == 'show') {
            guangouGroup.visible = true;
            if (guangouGroup.children.length == 0) {
                if (true) {
                    var dg = new DataGet();
                    dg.drawGuangou(dataGet.areaCode);
                }
            }
        }
        else {
            //   guangouGroup.visible = false;
            pipe.clear();
        }
    }
    else {
        if (operateType == 'show') {

            var cadLeftTop = { x: 17545.309, y: 65811.8395 };
            var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

            var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
            var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };
            //tongxin5GMapGroup
            guangouGroup.visible = true;
            if (true) {
                if (guangouGroup.children.length == 0) {
                    var data = guangouData;
                    for (var i = 0; i < data.features.length; i++) {

                        if (data.features[i].geometry.type == "LineString") { }
                        else { continue; }

                        var layer = data.features[i].properties.Layer;
                        //var geometryLine = new THREE.BufferGeometry();
                        var positions = [];
                        // var geometry = new THREE.Geometry();
                        var geometry = new THREE.LineGeometry();
                        var geometryFromData = data.features[i].geometry.coordinates;
                        var color = 'blue';
                        if (layer == 'a01') {
                            color = 'skyblue';
                        }
                        //var entityHandle = data.features[i].properties.EntityHandle;
                        //var colorAndName = getNameAndColorOfLine(layer);
                        //color = colorAndName[0];
                        //var nameV = colorAndName[1];
                        //var stationName = (colorAndName.length == 3 ? colorAndName[2] : '未知');

                        //if (colorAndName.length == 3 && colorAndName[2] == '方案') {
                        //    continue;
                        //}
                        //if (found) {
                        //    color = 'orange';
                        //}
                        //color = getColorByStation(stationName);
                        //var show = getShowByStation(stationName);
                        //if (!show) {
                        //    continue;
                        //}

                        //var indexV = getIndexByStation(stationName);
                        //switch (data.features[i].properties.ExtendedEntity) {
                        //    case '5.0 电缆|10|中压线路|255|0|255|':
                        //        {
                        //            color = 'orange';
                        //        }; break;
                        //    case '5.0 电缆|10|中压线路|0|128|0|':
                        //        {
                        //            color = 'purple';
                        //        }; break;
                        //    case '5.0 电缆|10|中压线路|255|0|0|':
                        //        {
                        //            color = 'red';
                        //        }; break;
                        //    case '5.0 架空|10|中压线路|255|0|0|':
                        //        {
                        //            color = 'white';
                        //        }; break;
                        //    case '5.0 架空|10|中压线路|255|0|255|':
                        //        {
                        //            color = 'blue';
                        //        }; break;
                        //    case '5.0 架空|10|中压线路|255|165|0|':
                        //        {
                        //            color = 0x45f24a;
                        //        }; break;
                        //    case '5.0 架空|10|中压线路|0|128|0|':
                        //        {
                        //            color = 'purple';
                        //        }; break;
                        //    default:
                        //        {
                        //            console.log('提示', data.features[i].properties.ExtendedEntity + '没有设置');
                        //        }; break;
                        //}
                        for (var j = 0; j < geometryFromData.length; j++) {
                            var lon = baiduMapLeftTop.x + (geometryFromData[j][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                            var lat = baiduMapRightBottom.y + (geometryFromData[j][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);
                            positions.push(x_m, 0, 0 - z_m);

                            //geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                            // geometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));



                        }
                        // geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                        geometry.setPositions(positions);
                        //geometry.computeBoundingSphere();

                        //var material_ForSelect = new THREE.LineBasicMaterial({ color: color, linewidth: 1, transparent: true, opacity: 0 });//ignored by WebGLRenderer});

                        var material = new THREE.LineMaterial({
                            color: color,
                            linewidth: 0.003, // in pixels
                            //vertexColors: 0x12f43d,
                            ////resolution:  // to be set by renderer, eventually
                            //dashed: false
                        });
                        material.depthTest = false;
                        //var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
                        //line_ForSelect.Tag = { name: nameV, station: stationName };
                        //line.Tag = { name: data[i].name, voltage: data[i].voltage }

                        var line = new THREE.Line2(geometry, material);
                        line.computeLineDistances();
                        line.Tag = { name: '', voltage: '', indexV: '', colorR: color };
                        line.renderOrder = 99;
                        line.scale.set(1, 1, 1);
                        //line.rotateX(-Math.PI / 2);
                        //lineGroup.add(line_ForSelect);
                        guangouGroup.add(line);


                    }
                    //var data = guangouData;
                    //for (var i = 0; i < data.features.length; i++)
                    //{
                    //    var geometryLine = new THREE.BufferGeometry();
                    //    var positions = [];
                    //    // var geometry = new THREE.Geometry();
                    //    var geometry = new THREE.LineGeometry();
                    //    //var geometryFromData = data.features[i].geometry.coordinates;
                    //    var lines1 = [[112.548149, 37.894436], [112.589956, 37.894827]];
                    //    var color = 'black';

                    //    for (var j = 0; j < lines1.length; j++) {
                    //        var lon = lines1[j][0];
                    //        var lat = lines1[j][1];
                    //        var x_m = MercatorGetXbyLongitude(lon);
                    //        var z_m = MercatorGetYbyLatitude(lat);
                    //        positions.push(x_m, 0, 0 - z_m);

                    //        //geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    //        // geometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));



                    //    }
                    //    geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    //    geometry.setPositions(positions);
                    //    //geometry.computeBoundingSphere();

                    //    var material_ForSelect = new THREE.LineBasicMaterial({ color: color, linewidth: 1, transparent: true, opacity: 0 });//ignored by WebGLRenderer});

                    //    var material = new THREE.LineMaterial({
                    //        color: color,
                    //        linewidth: 0.01, // in pixels
                    //        vertexColors: 0x12f43d,
                    //        //resolution:  // to be set by renderer, eventually
                    //        dashed: true
                    //    });
                    //    //var material = new THREE.LineMaterial({

                    //    //    color: color,
                    //    //    linewidth: 0.01, // in pixels
                    //    //    vertexColors: THREE.VertexColors,
                    //    //    //resolution:  // to be set by renderer, eventually
                    //    //    dashed: false

                    //    //});
                    //    //var material =  new THREE.LineDashedMaterial( {
                    //    //    color: color,
                    //    //    scale: 1, dashSize: 1, gapSize: 1
                    //    //} );
                    //    guanGouObj.matLine.depthTest = false;
                    //    guanGouObj.matLineDashed.depthTest = false;
                    //    material.depthTest = false;
                    //    // var matLineDashed = new THREE.LineDashedMaterial({ vertexColors: THREE.VertexColors, scale: 2, dashSize: 1, gapSize: 1 });
                    //    var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
                    //    //line.Tag = { name: data[i].name, voltage: data[i].voltage }
                    //    // geometry.computeLineDistances();
                    //    var line = new THREE.Line2(geometry, material);

                    //    line.computeLineDistances();
                    //    line.Tag = { name: '', voltage: '' }
                    //    line.renderOrder = 99;
                    //    line.scale.set(1, 1, 1);
                    //    //line.rotateX(-Math.PI / 2);
                    //    guangouGroup.add(line_ForSelect);
                    //    guangouGroup.add(line);
                    //}

                    //{
                    //    var geometryLine = new THREE.BufferGeometry();
                    //    var positions = [];
                    //    // var geometry = new THREE.Geometry();
                    //    var geometry = new THREE.LineGeometry();
                    //    //var geometryFromData = data.features[i].geometry.coordinates;
                    //    var lines1 = [[112.580056, 37.906558], [112.57941, 37.900152], [112.580847, 37.878566]];
                    //    var color = 0x00ff00;
                    //    var colors = [];
                    //    var color = new THREE.Color();
                    //    for (var j = 0; j < lines1.length; j++) {
                    //        var lon = lines1[j][0];
                    //        var lat = lines1[j][1];
                    //        var x_m = MercatorGetXbyLongitude(lon);
                    //        var z_m = MercatorGetYbyLatitude(lat);
                    //        positions.push(x_m, 0, 0 - z_m);

                    //        //geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    //        // geometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));

                    //        color.setHSL(0.8, 1.0, 0.5);
                    //        colors.push(color.r, color.g, color.b);

                    //    }
                    //    geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    //    geometry.setPositions(positions);
                    //    geometry.setColors(colors);
                    //    //geometry.computeBoundingSphere();

                    //    var material_ForSelect = new THREE.LineBasicMaterial({ color: color, linewidth: 1, transparent: true, opacity: 0 });//ignored by WebGLRenderer});

                    //    var material = new THREE.LineMaterial({
                    //        color: color,
                    //        linewidth: 0.008, // in pixels
                    //        vertexColors: 'orange',
                    //        //resolution:  // to be set by renderer, eventually
                    //        dashed: false
                    //    });
                    //    //var material = new THREE.LineMaterial({

                    //    //    color: color,
                    //    //    linewidth: 0.01, // in pixels
                    //    //    vertexColors: THREE.VertexColors,
                    //    //    //resolution:  // to be set by renderer, eventually
                    //    //    dashed: false

                    //    //});
                    //    //var material =  new THREE.LineDashedMaterial( {
                    //    //    color: color,
                    //    //    scale: 1, dashSize: 1, gapSize: 1
                    //    //} );
                    //    guanGouObj.matLine.depthTest = false;
                    //    guanGouObj.matLineDashed.depthTest = false;
                    //    material.depthTest = false;
                    //    // var matLineDashed = new THREE.LineDashedMaterial({ vertexColors: THREE.VertexColors, scale: 2, dashSize: 1, gapSize: 1 });
                    //    var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
                    //    //line.Tag = { name: data[i].name, voltage: data[i].voltage }
                    //    // geometry.computeLineDistances();
                    //    var line = new THREE.Line2(geometry, material);

                    //    line.computeLineDistances();
                    //    line.Tag = { name: '', voltage: '' }
                    //    line.renderOrder = 99;
                    //    line.scale.set(1, 1, 1);
                    //    //line.rotateX(-Math.PI / 2);
                    //    guangouGroup.add(line_ForSelect);
                    //    guangouGroup.add(line);
                    //}
                }
                else { guangouGroup.visible = true; }
            }
        }
        else if (operateType == 'hide') {
            guangouGroup.visible = false;
        }
    }
}

var drawBiandiansuo = function (operateType) {
    //throw '不用了';

    if (operateType == 'show') {
        biandiansuo.group.visible = true;
        if (biandiansuo.group.children.length == 0) {
            var bg = new DataGet();
            bg.drawSubstation(1);
            //var sumSql = '';
            //var cadLeftTop = { x: 17545.309, y: 65811.8395 };
            //var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

            //var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
            //var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };

            //var data = biandiansuo2;
            //for (var i = 0; i < data.length; i++) {

            //    var divC = document.createElement('div');
            //    var imgC = document.createElement('img');
            //    imgC.src = 'Pic/biandianzhan110kv.png';
            //    divC.appendChild(imgC);
            //    divC.className = 'biandianzhanTuPian';

            //    var colorOfCircle = '0xffff00';
            //    switch (data[i].name) {
            //        case '东大变':
            //            {
            //                colorOfCircle = 'red';
            //            }; break;
            //        case '杏花岭变':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //        case '柳溪变电站':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '城西站':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //        case '铜锣湾变':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '城北站':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '解放变':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //    };

            //    colorOfCircle = getColorByStation(data[i].name);
            //    switch (data[i].v) {
            //        case '110kv':
            //            {
            //                var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //                var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //                var x_m = MercatorGetXbyLongitude(lon);
            //                var z_m = MercatorGetYbyLatitude(lat);

            //                var radius = showAConfig.biandianzhan.l110kv.radius;
            //                var color = colorOfCircle;
            //                var geometry = new THREE.RingGeometry(radius, radius * 0.75, 18);
            //                var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            //                material.depthTest = false;
            //                var plane = new THREE.Mesh(geometry, material);
            //                // plane.name = data[i].name;

            //                sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

            //                var position = { x: x_m, y: 0, z: -z_m };
            //                plane.Tag = { name: data[i].name, position: position }
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane.renderOrder = 98;

            //                plane.position.set(x_m, 0, -z_m);
            //                plane.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane);



            //                var labelDiv = document.createElement('div');
            //                labelDiv.className = 'labelbiandianzhan';
            //                labelDiv.textContent = data[i].name;
            //                labelDiv.style.marginTop = '-1em';
            //                labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            //                //labelDiv.style.color = color;
            //                var divLabel = new THREE.CSS2DObject(labelDiv);
            //                divLabel.position.set(x_m, 0, -z_m);
            //                divLabel.positionTag = [x_m, 0, -z_m];
            //                biandiansuoGroup.add(divLabel);

            //            }; break;
            //        case '220kv':
            //            {

            //                var radius = showAConfig.biandianzhan.l220kv.radius;
            //                var color = colorOfCircle;
            //                var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //                var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //                var x_m = MercatorGetXbyLongitude(lon);
            //                var z_m = MercatorGetYbyLatitude(lat);

            //                var geometry1 = new THREE.RingGeometry(radius, radius * 0.75, 18);
            //                var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            //                material.depthTest = false;
            //                var plane1 = new THREE.Mesh(geometry1, material);
            //                plane1.name = data[i].name;

            //                sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

            //                var position = { x: x_m, y: 0, z: -z_m };
            //                plane1.Tag = { name: data[i].name, position: position };
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane1.renderOrder = 98;

            //                plane1.position.set(x_m, 0, -z_m);
            //                plane1.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane1);



            //                var geometry2 = new THREE.RingGeometry(radius * 0.5, radius * 0.25, 18);
            //                var plane2 = new THREE.Mesh(geometry2, material);
            //                //  plane2.name = data[i].name;

            //                //var position = { x: x_m, y: 0, z: -z_m };
            //                plane2.Tag = { name: data[i].name, position: position }
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane2.renderOrder = 98;

            //                plane2.position.set(x_m, 0, -z_m);
            //                plane2.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane2);

            //                var labelDiv = document.createElement('div');
            //                labelDiv.className = 'labelbiandianzhan';
            //                labelDiv.textContent = data[i].name;
            //                labelDiv.style.marginTop = '-1em';

            //                labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            //                var divLabel = new THREE.CSS2DObject(labelDiv);
            //                divLabel.position.set(x_m, 0, -z_m);
            //                divLabel.positionTag = [x_m, 0, -z_m];
            //                biandiansuoGroup.add(divLabel);
            //            }; break;
            //    }



            //    //var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //    //var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //    //var x_m = MercatorGetXbyLongitude(lon);
            //    //var z_m = MercatorGetYbyLatitude(lat);

            //    //var geometry = new THREE.RingGeometry(0.8, 0.6, 24);
            //    //var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
            //    //material.depthTest = false;
            //    //var plane = new THREE.Mesh(geometry, material);
            //    //plane.name = data[i].name;

            //    //var position = { x: x_m, y: 0, z: -z_m };
            //    //plane.Tag = { name: data[i].name, position: position }
            //    ////measureAreaObj.measureAreaDiv.className = 'label';
            //    ////measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //    ////measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //    ////var label = new THREE.CSS2DObject(divC);
            //    //plane.renderOrder = 98;

            //    //plane.position.set(x_m, 0, -z_m);
            //    //plane.rotateX(Math.PI / 2);
            //    //biandiansuoGroup.add(plane);
            //    // measureAreaGroup.add(measureAreaObj.measureAreaDivLabel);
            //    //var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
            //    //var mesh = new THREE.Mesh(geometry, material);
            //    //mesh.rotateX(-Math.PI / 2);
            //    //mesh.rotateZ(i / data.length * 2 * Math.PI);
            //    //var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            //    //mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
            //    ////mesh.position.set(0, 0, 0 );
            //    //// mesh.rotation.set(-Math.PI / 2, 0, 0);
            //    ////mesh.rotateX(-Math.PI / 2);
            //    //mesh.scale.set(0.3, 0.3, 0.3);

            //    //mesh.castShadow = true;
            //    //mesh.receiveShadow = true;
            //    //mesh.name = data[i].name;
            //    //mesh.Tag = { name: data[i].name, position: position }
            //    // biandiansuoGroup.add(mesh);
            //}

            //console.log('sumSql', sumSql);
            //loader.load('Stl/peidianzhan.stl', function (geometry) {

            //    var data = biandiansuo;
            //    for (var i = 0; i < data.length; i++) {
            //        var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
            //        var mesh = new THREE.Mesh(geometry, material);
            //        mesh.rotateX(-Math.PI / 2);
            //        mesh.rotateZ(i / data.length * 2 * Math.PI);
            //        var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            //        mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
            //        //mesh.position.set(0, 0, 0 );
            //        // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //        //mesh.rotateX(-Math.PI / 2);
            //        mesh.scale.set(0.3, 0.3, 0.3);

            //        mesh.castShadow = true;
            //        mesh.receiveShadow = true;
            //        mesh.name = data[i].name;
            //        mesh.Tag = { name: data[i].name, position: position }
            //        biandiansuoGroup.add(mesh);
            //    }


            //});
        }
        else {

            searchBiandiansuo('BB');
            //searchTongxin5G('BB');
            for (var i = 0; i < biandiansuo.group.children.length; i++) {
                if (biandiansuo.group.children[i].positionTag) {
                    biandiansuo.group.children[i].position.set(biandiansuo.group.children[i].positionTag[0], biandiansuo.group.children[i].positionTag[1], biandiansuo.group.children[i].positionTag[2]);
                }
            }
        }
    }
    else if (operateType == 'hide') {
        var biandiansuoGroup = biandiansuo.group;
        biandiansuoGroup.visible = false;
        for (var i = 0; i < biandiansuoGroup.children.length; i++) {
            if (biandiansuoGroup.children[i].positionTag) {
                biandiansuoGroup.children[i].position.set(0, 0, 0);
            }
        }

    }
}


var drawBiandiansuoStl = function (operateType) {
    //throw '不用了';

    if (operateType == 'show') {
        biandiansuo.groupStl.visible = true;
        if (biandiansuo.groupStl.children.length == 0) {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                var bg = new DataGet();
                bg.drawBiandiansuoStl(1, function () {

                });
            });
            var bg = new DataGet();
            bg.drawBiandiansuoStl(1, function () {
                //loader.load('Stl/peidianzhan.stl', function (geometry) {

                //    var data = biandiansuo;
                //    for (var i = 0; i < data.length; i++) {
                //        var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
                //        var mesh = new THREE.Mesh(geometry, material);
                //        mesh.rotateX(-Math.PI / 2);
                //        mesh.rotateZ(i / data.length * 2 * Math.PI);
                //        var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
                //        mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
                //        //mesh.position.set(0, 0, 0 );
                //        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                //        //mesh.rotateX(-Math.PI / 2);
                //        mesh.scale.set(0.3, 0.3, 0.3);

                //        mesh.castShadow = true;
                //        mesh.receiveShadow = true;
                //        mesh.name = data[i].name;
                //        mesh.Tag = { name: data[i].name, position: position }
                //        biandiansuoGroup.add(mesh);
                //    }


                //});
            });
            //var sumSql = '';
            //var cadLeftTop = { x: 17545.309, y: 65811.8395 };
            //var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

            //var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
            //var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };

            //var data = biandiansuo2;
            //for (var i = 0; i < data.length; i++) {

            //    var divC = document.createElement('div');
            //    var imgC = document.createElement('img');
            //    imgC.src = 'Pic/biandianzhan110kv.png';
            //    divC.appendChild(imgC);
            //    divC.className = 'biandianzhanTuPian';

            //    var colorOfCircle = '0xffff00';
            //    switch (data[i].name) {
            //        case '东大变':
            //            {
            //                colorOfCircle = 'red';
            //            }; break;
            //        case '杏花岭变':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //        case '柳溪变电站':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '城西站':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //        case '铜锣湾变':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '城北站':
            //            {
            //                colorOfCircle = 'orange';
            //            }; break;
            //        case '解放变':
            //            {
            //                colorOfCircle = 'purple';
            //            }; break;
            //    };

            //    colorOfCircle = getColorByStation(data[i].name);
            //    switch (data[i].v) {
            //        case '110kv':
            //            {
            //                var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //                var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //                var x_m = MercatorGetXbyLongitude(lon);
            //                var z_m = MercatorGetYbyLatitude(lat);

            //                var radius = showAConfig.biandianzhan.l110kv.radius;
            //                var color = colorOfCircle;
            //                var geometry = new THREE.RingGeometry(radius, radius * 0.75, 18);
            //                var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            //                material.depthTest = false;
            //                var plane = new THREE.Mesh(geometry, material);
            //                // plane.name = data[i].name;

            //                sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

            //                var position = { x: x_m, y: 0, z: -z_m };
            //                plane.Tag = { name: data[i].name, position: position }
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane.renderOrder = 98;

            //                plane.position.set(x_m, 0, -z_m);
            //                plane.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane);



            //                var labelDiv = document.createElement('div');
            //                labelDiv.className = 'labelbiandianzhan';
            //                labelDiv.textContent = data[i].name;
            //                labelDiv.style.marginTop = '-1em';
            //                labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            //                //labelDiv.style.color = color;
            //                var divLabel = new THREE.CSS2DObject(labelDiv);
            //                divLabel.position.set(x_m, 0, -z_m);
            //                divLabel.positionTag = [x_m, 0, -z_m];
            //                biandiansuoGroup.add(divLabel);

            //            }; break;
            //        case '220kv':
            //            {

            //                var radius = showAConfig.biandianzhan.l220kv.radius;
            //                var color = colorOfCircle;
            //                var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //                var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //                var x_m = MercatorGetXbyLongitude(lon);
            //                var z_m = MercatorGetYbyLatitude(lat);

            //                var geometry1 = new THREE.RingGeometry(radius, radius * 0.75, 18);
            //                var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            //                material.depthTest = false;
            //                var plane1 = new THREE.Mesh(geometry1, material);
            //                plane1.name = data[i].name;

            //                sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

            //                var position = { x: x_m, y: 0, z: -z_m };
            //                plane1.Tag = { name: data[i].name, position: position };
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane1.renderOrder = 98;

            //                plane1.position.set(x_m, 0, -z_m);
            //                plane1.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane1);



            //                var geometry2 = new THREE.RingGeometry(radius * 0.5, radius * 0.25, 18);
            //                var plane2 = new THREE.Mesh(geometry2, material);
            //                //  plane2.name = data[i].name;

            //                //var position = { x: x_m, y: 0, z: -z_m };
            //                plane2.Tag = { name: data[i].name, position: position }
            //                //measureAreaObj.measureAreaDiv.className = 'label';
            //                //measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //                //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //                //var label = new THREE.CSS2DObject(divC);
            //                plane2.renderOrder = 98;

            //                plane2.position.set(x_m, 0, -z_m);
            //                plane2.rotateX(Math.PI / 2);
            //                biandiansuoGroup.add(plane2);

            //                var labelDiv = document.createElement('div');
            //                labelDiv.className = 'labelbiandianzhan';
            //                labelDiv.textContent = data[i].name;
            //                labelDiv.style.marginTop = '-1em';

            //                labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            //                var divLabel = new THREE.CSS2DObject(labelDiv);
            //                divLabel.position.set(x_m, 0, -z_m);
            //                divLabel.positionTag = [x_m, 0, -z_m];
            //                biandiansuoGroup.add(divLabel);
            //            }; break;
            //    }



            //    //var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
            //    //var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
            //    //var x_m = MercatorGetXbyLongitude(lon);
            //    //var z_m = MercatorGetYbyLatitude(lat);

            //    //var geometry = new THREE.RingGeometry(0.8, 0.6, 24);
            //    //var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
            //    //material.depthTest = false;
            //    //var plane = new THREE.Mesh(geometry, material);
            //    //plane.name = data[i].name;

            //    //var position = { x: x_m, y: 0, z: -z_m };
            //    //plane.Tag = { name: data[i].name, position: position }
            //    ////measureAreaObj.measureAreaDiv.className = 'label';
            //    ////measureAreaObj.measureAreaDiv.textContent = 'Earth';
            //    ////measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
            //    ////var label = new THREE.CSS2DObject(divC);
            //    //plane.renderOrder = 98;

            //    //plane.position.set(x_m, 0, -z_m);
            //    //plane.rotateX(Math.PI / 2);
            //    //biandiansuoGroup.add(plane);
            //    // measureAreaGroup.add(measureAreaObj.measureAreaDivLabel);
            //    //var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
            //    //var mesh = new THREE.Mesh(geometry, material);
            //    //mesh.rotateX(-Math.PI / 2);
            //    //mesh.rotateZ(i / data.length * 2 * Math.PI);
            //    //var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            //    //mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
            //    ////mesh.position.set(0, 0, 0 );
            //    //// mesh.rotation.set(-Math.PI / 2, 0, 0);
            //    ////mesh.rotateX(-Math.PI / 2);
            //    //mesh.scale.set(0.3, 0.3, 0.3);

            //    //mesh.castShadow = true;
            //    //mesh.receiveShadow = true;
            //    //mesh.name = data[i].name;
            //    //mesh.Tag = { name: data[i].name, position: position }
            //    // biandiansuoGroup.add(mesh);
            //}

            //console.log('sumSql', sumSql);
            //loader.load('Stl/peidianzhan.stl', function (geometry) {

            //    var data = biandiansuo;
            //    for (var i = 0; i < data.length; i++) {
            //        var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
            //        var mesh = new THREE.Mesh(geometry, material);
            //        mesh.rotateX(-Math.PI / 2);
            //        mesh.rotateZ(i / data.length * 2 * Math.PI);
            //        var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            //        mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
            //        //mesh.position.set(0, 0, 0 );
            //        // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //        //mesh.rotateX(-Math.PI / 2);
            //        mesh.scale.set(0.3, 0.3, 0.3);

            //        mesh.castShadow = true;
            //        mesh.receiveShadow = true;
            //        mesh.name = data[i].name;
            //        mesh.Tag = { name: data[i].name, position: position }
            //        biandiansuoGroup.add(mesh);
            //    }


            //});
        }
        else {

            searchBiandiansuo('BB');
            //searchTongxin5G('BB');
            for (var i = 0; i < biandiansuo.group.children.length; i++) {
                if (biandiansuo.group.children[i].positionTag) {
                    biandiansuo.group.children[i].position.set(biandiansuo.group.children[i].positionTag[0], biandiansuo.group.children[i].positionTag[1], biandiansuo.group.children[i].positionTag[2]);
                }
            }
        }
    }
    else if (operateType == 'hide') {
        var biandiansuoGroup = biandiansuo.group;
        biandiansuoGroup.visible = false;
        for (var i = 0; i < biandiansuoGroup.children.length; i++) {
            if (biandiansuoGroup.children[i].positionTag) {
                biandiansuoGroup.children[i].position.set(0, 0, 0);
            }
        }

    }
}

var searchBiandiansuo = function (keyWords) {
    {
        for (var i = 0; i < biandiansuo.group.children.length; i++) {
            if (biandiansuo.group.children[i].type == 'Mesh')
                if (biandiansuo.group.children[i].Tag.name == keyWords) {
                    controls.target.set(biandiansuo.group.children[i].Tag.position.x, biandiansuo.group.children[i].Tag.position.y, biandiansuo.group.children[i].Tag.position.z);

                }
                else {
                    //   biandiansuoGroup.children[i].material.color.set('green');
                }
        }
    }
}

var drawBuildings = function (operateType) {

    var drawCityF = function (object, index, x, z, r, g, b, scaleX, scaleY, scaleZ) {
        index = index % object.children.length
        var itemObj = object.children[index].clone();

        var m = object.children[index].material.clone();
        itemObj.material = m;

        itemObj.material.side = THREE.DoubleSide;
        itemObj.material.color = new THREE.Color(r, g, b);
        itemObj.position.y = 0;
        // scene.add(object);



        var position = { x: x, y: 0.001, z: z };
        itemObj.position.set(x, 0.001, z);
        itemObj.scale.set(scaleX, scaleY, scaleZ);
        itemObj.castShadow = true;
        //object.receiveShadow = true;
        itemObj.name = 'city';
        itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
        buildingsGroups.add(itemObj);
    }
    if (operateType == 'show') {
        buildingsGroups.visible = true;
        if (buildingsGroups.children.length == 0) {


            buildingsGroups.position.x = 0.4;
            buildingsGroups.position.z = -0.65;
            if (false) {
                var loader = new THREE.FBXLoader();
                loader.load('ObjTag/build.fbx', function (object) {

                    //mixer = new THREE.AnimationMixer(object);

                    //var action = mixer.clipAction(object.animations[0]);
                    //action.play();
                    var groupOfFbx = new THREE.Group();
                    object.traverse(function (child) {

                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            groupOfFbx.add(child);
                        }

                    });
                    buildingsGroups.add(groupOfFbx);
                    //scene.add(object);

                });
            }
            if (true) {
                var manager = new THREE.LoadingManager();
                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/shenggongsi/')
                    .load('build1.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/shenggongsi/')
                            .load('build1.obj', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                            object.children[iOfO].material[mi].color = new THREE.Color(1.5, 1.5, 2);
                                        }
                                    }
                                }
                                object.position.y = 0;
                                scene.add(object);
                                object.rotateX(-Math.PI / 2);
                                object.rotateZ(-0.07);
                                var position = { x: MercatorGetXbyLongitude(112.5782425), y: 0, z: -MercatorGetYbyLatitude(37.87923660278321) };
                                object.position.set(MercatorGetXbyLongitude(112.5782425), 0, -MercatorGetYbyLatitude(37.87923660278321));
                                object.scale.set(0.015, 0.015, 0.015);
                                //object.scale.set(1, 1, 1);
                                //object.castShadow = true;
                                //object.receiveShadow = true;
                                object.name = 'build1';
                                object.Tag = { name: '省公司', position: position, id: 'sgs' };
                                object.rotateX(Math.PI / 2);
                                buildingsGroups.add(object);
                            }, function () { }, function () { });
                    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/shimao/')
                    .load('build2.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/shimao/')
                            .load('build2.obj', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        //var ms = object.children[iOfO].material;
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //  object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                            object.children[iOfO].material[mi].color = new THREE.Color(2, 2, 2);
                                        }
                                        //object.children[iOfO].material.depthTest = false;
                                    }
                                }
                                object.position.y = 0;
                                scene.add(object);
                                object.rotateX(-Math.PI / 2);
                                object.rotateZ(-0.03);

                                var position = { x: MercatorGetXbyLongitude(112.56329469612448), y: 0, z: -MercatorGetYbyLatitude(37.88009395599366) };
                                object.position.set(MercatorGetXbyLongitude(112.56329469612448), 0, -MercatorGetYbyLatitude(37.88009395599366));
                                object.scale.set(0.095, 0.095, 0.095);
                                //object.castShadow = true;
                                //object.receiveShadow = true;
                                object.name = 'build2';
                                // object.Tag = { name: '世贸', position: position };
                                object.Tag = { name: '世贸', position: position, id: 'sm' };
                                object.rotateX(Math.PI / 2);
                                buildingsGroups.add(object);
                            }, function () { }, function () { });
                    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/build4/')
                    .load('build4fujia.mtl?xx=23', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/build4/')
                            .load('build4fujia.obj?xx=23', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        //var ms = object.children[iOfO].material;
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //  object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = 2;
                                            object.children[iOfO].material[mi].color = new THREE.Color(2, 2, 2);
                                        }
                                    }
                                }
                                //alert('aa');
                                {
                                    object.position.y = 0;
                                    //scene.add(object);
                                    object.rotateX(-Math.PI / 2);
                                    object.rotateZ(-0.03);
                                    var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8927) };
                                    object.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8927));
                                    object.scale.set(0.020, 0.035, 0.025);
                                    //object.castShadow = true;
                                    //object.receiveShadow = true;
                                    object.name = 'mj1';
                                    //object.Tag = { name: '民居1', position: position };
                                    object.Tag = { name: '万达公馆一号楼', position: position, id: 'mj1' };
                                    object.rotateX(Math.PI / 2);
                                    buildingsGroups.add(object);
                                }
                                {
                                    var a2 = object.clone();
                                    var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8917) };
                                    //  112.557307, 37.892976
                                    a2.name = 'mj2';
                                    //a2.Tag = { name: '民居2', position: position };
                                    a2.Tag = { name: '万达公馆二号楼', position: position, id: 'mj2' };
                                    a2.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8917));
                                    buildingsGroups.add(a2);

                                }
                                {
                                    var a3 = object.clone();
                                    var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8907) };
                                    //  112.557307, 37.892976
                                    a3.name = 'mj3';
                                    a3.Tag = { name: '万达公馆三号楼', position: position, id: 'mj3' };
                                    a3.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8907));
                                    buildingsGroups.add(a3);
                                }

                                {
                                    var a4 = object.clone();
                                    var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8897) };
                                    //  112.557307, 37.892976
                                    a4.name = 'mj4';
                                    a4.Tag = { name: '万达公馆四号楼', position: position, id: 'mj4' };
                                    a4.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8897));
                                    buildingsGroups.add(a4);
                                }

                                {
                                    var a5 = object.clone();
                                    var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8875) };
                                    //  112.557307, 37.892976
                                    a5.name = 'mj5';
                                    a5.Tag = { name: '万达公馆五号楼', position: position, id: 'mj5' };
                                    a5.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8875));
                                    buildingsGroups.add(a5);
                                }

                                {
                                    var a6 = object.clone();
                                    a6.Tag = { name: '万达公馆六号楼', position: position, id: 'mj6' };
                                    a6.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8868));
                                    buildingsGroups.add(a6);
                                }

                                {
                                    var a7 = object.clone();
                                    a7.Tag = { name: '万达公馆七号楼', position: position, id: 'mj7' };
                                    a7.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88601));
                                    buildingsGroups.add(a7);
                                }

                                {
                                    var a8 = object.clone();
                                    a8.Tag = { name: '万达公馆八号楼', position: position, id: 'mj8' };
                                    a8.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88521));
                                    buildingsGroups.add(a8);

                                }

                                {
                                    var a9 = object.clone();
                                    a9.Tag = { name: '柳溪花园', position: position, id: 'lxhy' };
                                    a9.position.set(MercatorGetXbyLongitude(112.55572577536023), 0, -MercatorGetYbyLatitude(37.89329719543458));
                                    buildingsGroups.add(a9);

                                }
                                if (false) {
                                    {
                                        for (var i = 0; i < 10; i++) {
                                            for (var j = 0; j < 4; j++) {
                                                var a_10 = object.clone();
                                                a_10.scale.set(0.015 + 0.01 * Math.random(), 0.03 + 0.01 * Math.random(), 0.02 + 0.01 * Math.random());
                                                a_10.Tag = { name: '柳溪花园', position: position, id: 'lxhy' + i + '_' + j };
                                                a_10.position.set(MercatorGetXbyLongitude(112.57502881614798 + j * 0.003 + 0.0006 * Math.random()), 0, -MercatorGetYbyLatitude(37.89329719543458 - i * 0.001 + 0.0006 * Math.random()));
                                                buildingsGroups.add(a_10);
                                            }
                                        }
                                        //var a_10 = object.clone();
                                        //a_10.Tag = { name: '柳溪花园', position: position, id: 'lxhy' };
                                        //a_10.position.set(MercatorGetXbyLongitude(112.59572577536023), 0, -MercatorGetYbyLatitude(37.89329719543458));
                                        //buildingsGroups.add(a_10);

                                    }
                                    {
                                        for (var i = 0; i < 10; i++) {
                                            for (var j = 0; j < 4; j++) {
                                                var a_10 = object.clone();
                                                a_10.Tag = { name: '柳溪花园', position: position, id: 'xxlxhy' + i + '_' + j };
                                                a_10.scale.set(0.015 + 0.01 * Math.random(), 0.03 + 0.01 * Math.random(), 0.02 + 0.05 * Math.random());
                                                a_10.position.set(MercatorGetXbyLongitude(112.57502881614798 - j * 0.002 - 0.0006 * Math.random()), 0, -MercatorGetYbyLatitude(37.89429719543458 + i * 0.001 + 0.0006 * Math.random()));
                                                buildingsGroups.add(a_10);
                                            }
                                        }
                                        //var a_10 = object.clone();
                                        //a_10.Tag = { name: '柳溪花园', position: position, id: 'lxhy' };
                                        //a_10.position.set(MercatorGetXbyLongitude(112.59572577536023), 0, -MercatorGetYbyLatitude(37.89329719543458));
                                        //buildingsGroups.add(a_10);

                                    }
                                }
                            }, function () { }, function () { });
                    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/wandaxiugai2/')
                    .load('wandagcxiugai.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/wandaxiugai2/')
                            .load('wandagcxiugai.obj', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        //var ms = object.children[iOfO].material;
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //  object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                            object.children[iOfO].material[mi].color = new THREE.Color(1.2, 1.2, 1.2);
                                        }
                                        //object.children[iOfO].material.depthTest = false;
                                    }
                                }
                                object.position.y = 0;
                                scene.add(object);
                                object.rotateX(-Math.PI / 2);
                                object.rotateZ(Math.PI / 2);
                                var position = { x: 97897.87989700126, y: 1.7409999999999997, z: -35446.877806694465 };
                                object.position.set(position.x, position.y, position.z);
                                object.scale.set(0.09, 0.09, 0.09);
                                object.castShadow = true;
                                //object.receiveShadow = true;
                                object.name = 'wd';
                                object.Tag = { name: '万达广场', position: position, id: 'wdgc' };
                                object.rotateX(Math.PI / 2);
                                buildingsGroups.add(object);


                            }, function () { }, function () { });
                    });

                //new THREE.MTLLoader(manager)
                //    .setPath('ObjTag/wandaxiugai/')
                //    .load('wandagcxiugai.mtl', function (materials) {
                //        materials.preload();
                //        // materials.depthTest = false;
                //        new THREE.OBJLoader(manager)
                //            .setMaterials(materials)
                //            .setPath('ObjTag/wandaxiugai/')
                //            .load('wandagcxiugai.obj', function (object) {
                //                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                //                    if (object.children[iOfO].isMesh) {
                //                        //var ms = object.children[iOfO].material;
                //                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                //                            //  object.children[iOfO].material[mi].depthTest = false;
                //                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                //                            object.children[iOfO].material[mi].color = new THREE.Color(1.2, 1.2, 1.2);
                //                        }
                //                        //object.children[iOfO].material.depthTest = false;
                //                    }
                //                }
                //                object.position.y = 0;
                //                scene.add(object);
                //                object.rotateX(-Math.PI / 2);
                //                object.rotateZ(Math.PI / 2);
                //                var position = { x: MercatorGetXbyLongitude(112.56774847960612), y: 0.001, z: -MercatorGetYbyLatitude(37.88849601745606) };
                //                object.position.set(MercatorGetXbyLongitude(112.56774847960612), 0.001, -MercatorGetYbyLatitude(37.88849601745606));
                //                object.scale.set(0.09, 0.09, 0.09);
                //                object.castShadow = true;
                //                //object.receiveShadow = true;
                //                object.name = 'wd';
                //                object.Tag = { name: '万达广场', position: position, id: 'wdgc' };
                //                object.rotateX(Math.PI / 2);
                //                buildingsGroups.add(object);


                //            }, function () { }, function () { });
                //    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/two/')
                    .load('two.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/two/')
                            .load('two.obj', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        //var ms = object.children[iOfO].material;
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //  object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                            object.children[iOfO].material[mi].color = new THREE.Color(2, 1.5, 1.5);
                                        }
                                        //object.children[iOfO].material.depthTest = false;
                                    }
                                }
                                object.position.y = 0;
                                scene.add(object);
                                object.rotateX(-Math.PI / 2);
                                object.rotateZ(Math.PI / 2);

                                var position = { x: MercatorGetXbyLongitude(112.57757953523192), y: 0.001, z: -MercatorGetYbyLatitude(37.890039253234875) };
                                object.position.set(MercatorGetXbyLongitude(112.57757953523192), 0.001, -MercatorGetYbyLatitude(37.890039253234875));
                                object.scale.set(0.09, 0.15, 0.09);
                                object.castShadow = true;
                                //object.receiveShadow = true;
                                object.name = 'wdxx';
                                object.Tag = { name: '', position: position, id: 'mj-0x01' };
                                object.rotateX(Math.PI / 2);
                                object.rotateY(Math.PI / 2);
                                buildingsGroups.add(object);


                            }, function () { }, function () { });
                    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/five/')
                    .load('five.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/five/')
                            .load('five.obj', function (object) {
                                for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                    if (object.children[iOfO].isMesh) {
                                        //var ms = object.children[iOfO].material;
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            //  object.children[iOfO].material[mi].depthTest = false;
                                            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                            object.children[iOfO].material[mi].color = new THREE.Color(2, 1.5, 1.5);
                                        }
                                        //object.children[iOfO].material.depthTest = false;
                                    }
                                }
                                {
                                    object.position.y = 0;
                                    // scene.add(object);
                                    object.rotateX(-Math.PI / 2);
                                    object.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    object.position.set(MercatorGetXbyLongitude(112.57774051158127), 0.001, -MercatorGetYbyLatitude(37.89021072387696));
                                    object.scale.set(0.09, 0.09, 0.03);
                                    object.castShadow = true;
                                    //object.receiveShadow = true;
                                    object.name = 'wdxx';
                                    object.Tag = { name: '', position: position, id: 'mj-0x01' };
                                    object.rotateX(Math.PI / 2);
                                    object.rotateY(Math.PI / 2);
                                    buildingsGroups.add(object);
                                }
                                {
                                    var a2 = object.clone();
                                    var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8917) };
                                    //  112.557307, 37.892976
                                    a2.name = 'mj2';
                                    //a2.Tag = { name: '民居2', position: position };
                                    a2.Tag = { name: '万达公馆二号楼', position: position, id: 'mj-0x02' };
                                    a2.position.set(MercatorGetXbyLongitude(112.57774051158127 - 0.001), 0, -MercatorGetYbyLatitude(37.89021072387696));
                                    buildingsGroups.add(a2);

                                }

                            }, function () { }, function () { });
                    });

                new THREE.MTLLoader(manager)
                    .setPath('ObjTag/buildcity/')
                    .load('b2.mtl', function (materials) {
                        materials.preload();
                        // materials.depthTest = false;
                        new THREE.OBJLoader(manager)
                            .setMaterials(materials)
                            .setPath('ObjTag/buildcity/')
                            .load('b2.obj', function (object) {
                                //for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                //    if (object.children[iOfO].isMesh) {
                                //        //var ms = object.children[iOfO].material;
                                //        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                //            //  object.children[iOfO].material[mi].depthTest = false;
                                //            object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                //            object.children[iOfO].material[mi].color = new THREE.Color(2, 1.5, 1.5);
                                //        }
                                //        //object.children[iOfO].material.depthTest = false;
                                //    }
                                //}

                                {
                                    var itemObj = object.children[0].clone();
                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);

                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97919.5698970012, 0.001, -35447.8594192008);
                                    itemObj.scale.set(0.002, 0.002, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[0].clone();
                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97920.0798970012, 0.001, -35447.8594192008);
                                    itemObj.scale.set(0.002, 0.002, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[0].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97919.5698970012, 0.001, -35447.15941920081);
                                    itemObj.scale.set(0.002, 0.002, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[0].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(2, 1.5, 1.5);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97920.0798970012, 0.001, -35447.15941920081);
                                    itemObj.scale.set(0.002, 0.002, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[2].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.4, 2, 1.2);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.4, 2, 1.2);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97923.67989700119, 0.001, -35444.759419200804);
                                    itemObj.scale.set(0.004, 0.0015, 0.004);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }

                                {
                                    var itemObj = object.children[1].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.4, 2, 1.2);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.3, 1, 1.2);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97894.67989700119, 0.001, -35442.05941920081);
                                    itemObj.scale.set(0.002, 0.002, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);

                                    buildingsGroups.add(itemObj);
                                }

                                {
                                    var itemObj = object.children[3].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;
                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.4, 2, 1.2);

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.3, 1, 1.2);
                                    itemObj.position.y = 0;
                                    // scene.add(object);
                                    itemObj.rotateX(-Math.PI / 2);
                                    itemObj.rotateZ(Math.PI / 2);

                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127), y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97887.9798970012, 0.001, -35444.6594192008);
                                    itemObj.scale.set(0.002, 0.0015, 0.002);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    itemObj.rotateX(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);
                                    itemObj.rotateY(Math.PI / 2);
                                    buildingsGroups.add(itemObj);
                                }

                                {
                                    var itemObj = object.children[5].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1.2, 1, 1);
                                    itemObj.position.y = 0;
                                    // scene.add(object);



                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127) + 1, y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97888.67989700119, 0.001, -35445.05941920079);
                                    itemObj.scale.set(0.001, 0.001, 0.001);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[10].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(0.9, 1.2, 0.4);
                                    itemObj.position.y = 0;
                                    // scene.add(object);



                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127) + 1, y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97898.8798970012, 0.001, -35443.85941920081);
                                    itemObj.scale.set(0.0018, 0.0018, 0.0018);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    buildingsGroups.add(itemObj);
                                }
                                {
                                    var itemObj = object.children[11].clone();

                                    var m = object.children[0].material.clone();
                                    itemObj.material = m;

                                    itemObj.material.side = THREE.DoubleSide;
                                    itemObj.material.color = new THREE.Color(1, 1.2, 1);
                                    itemObj.position.y = 0;
                                    // scene.add(object);



                                    var position = { x: MercatorGetXbyLongitude(112.57774051158127) + 1, y: 0.001, z: -MercatorGetYbyLatitude(37.89021072387696) };
                                    itemObj.position.set(97908.57989700118, 0.001, -35437.05941920081);
                                    itemObj.scale.set(0.0018, 0.0018, 0.0018);
                                    itemObj.castShadow = true;
                                    //object.receiveShadow = true;
                                    itemObj.name = 'city';
                                    itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
                                    buildingsGroups.add(itemObj);
                                }
                                drawCityF(object, 18, 97905.37989700117, -35442.05941920081, 1, 1.2, 1.2, 0.0012, 0.0012, 0.0012);
                                drawCityF(object, 15, 97911.97989700115, -35440.859419200824, 1, 1.2, 1.2, 0.002, 0.002, 0.002);
                                drawCityF(object, 6, 97914.1398970011, -35441.09941920084, 1.6, 1.2, 1.2, 0.005415, 0.001137600184552919, 0.001);
                                drawCityF(object, 7, 97909.28989700138, -35445.79941920084, 1.6, 1.2, 1.2, 0.004132149999999998, 0.002, 0.0006999999999999999);
                                drawCityF(object, 7, 97909.28989700138, -35445.47941920088, 1.6, 1.2, 1.2, 0.004132149999999998, 0.002, 0.0006999999999999999);

                                //  drawCityF(object, 9, 97909.44897001376, -35425.79941920087, 1.6, 1.4, 1.8, 0.004132149999999998, 0.002, 0.0006999999999999999);
                                //  drawCityF(object, 10, 97903.59897001377, -35423.249419200874, 2, 0.7, 1, 0.004132149999999998, 0.002, 0.0006999999999999999);

                                //  drawCityF(object, 12, 97921.89897001379, -35423.54941920087, 2, 0.7, 1, 0.003, 0.002, 0.002);

                                // drawCityF(object, 15, 97911.69897001372, -35430.44941920086, 2, 0.7, 1, 0.002, 0.0015, 0.002);

                                //  drawCityF(object, 18, 97911.59897001371, -35433.03941920086, 1, 1.7, 1, 0.002, 0.0015, 0.002);
                                //  drawCityF(object, 13, 97901.59897001377, -35423.249419200874, 2, 0.7, 1, 0.004132149999999998, 0.002, 0.0006999999999999999);
                            }, function () { }, function () { });
                    });
            }
            var loader = new THREE.STLLoader();
            if (false)
                loader.load('Stl/shenggongsi3.stl', function (geometry) {

                    //  var data = biandiansuo;
                    //for (var i = 0; i < data.length; i++)
                    {

                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.05);
                        var position = { x: MercatorGetXbyLongitude(112.578615) - 0.33, y: 0, z: -MercatorGetYbyLatitude(37.879032) - 0.22 };
                        mesh.position.set(MercatorGetXbyLongitude(112.578615) - 0.33, 0, -MercatorGetYbyLatitude(37.879032) - 0.22);
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0093, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'build1';
                        mesh.Tag = { name: '省公司', position: position }
                        buildingsGroups.add(mesh);
                    }


                });
            if (false)
                loader.load('Stl/shenggongsi3.stl', function (geometry) {

                    //  var data = biandiansuo;
                    //for (var i = 0; i < data.length; i++)
                    {
                        var texture = new THREE.TextureLoader().load();

                        var loader = new THREE.TextureLoader();
                        loader.load('Pic/UV_Grid_Sm.jpg', function (texture) {
                            // in this example we create the material when the texture is loaded
                            var material = new THREE.MeshBasicMaterial({ map: texture });
                            var mesh = new THREE.Mesh(geometry, material);
                            mesh.rotateX(-Math.PI / 2);
                            mesh.rotateZ(-0.05);
                            var position = { x: MercatorGetXbyLongitude(112.578615) - 0.33, y: 0, z: -MercatorGetYbyLatitude(37.879032) - 0.22 };
                            mesh.position.set(MercatorGetXbyLongitude(112.578615) - 0.33, 0, -MercatorGetYbyLatitude(37.879032) - 0.22);
                            //mesh.position.set(0, 0, 0 );
                            // mesh.rotation.set(-Math.PI / 2, 0, 0);
                            //mesh.rotateX(-Math.PI / 2);
                            mesh.scale.set(0.0093, 0.0093, 0.0093);

                            mesh.castShadow = true;
                            mesh.receiveShadow = true;
                            mesh.name = 'build1';
                            mesh.Tag = { name: '省公司', position: position }
                            buildingsGroups.add(mesh);
                        },
                            undefined,
                            function (err) {
                                console.error('An error happened.');
                            })

                    }


                });
            if (false) {
                loader.load('Stl/shenggongsi2.stl', function (geometry) {

                    //  var data = biandiansuo;
                    //for (var i = 0; i < data.length; i++)
                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: false, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.05);
                        var position = { x: MercatorGetXbyLongitude(112.57905), y: 0, z: -MercatorGetYbyLatitude(37.8794) };
                        mesh.position.set(MercatorGetXbyLongitude(112.57905), 0, -MercatorGetYbyLatitude(37.8794));
                        mesh.scale.set(0.20, 0.20, 0.20);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'build1';
                        mesh.Tag = { name: '省公司', position: position }
                        mesh.rotateX(Math.PI / 2);
                        buildingsGroups.add(mesh);



                    }


                });
            }
            if (false)
                loader.load('Stl/wd.stl', function (geometry) {

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.05);
                        var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8927) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8927));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0093, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd1';
                        mesh.Tag = { name: '万达1', position: position }
                        buildingsGroups.add(mesh);
                    }
                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8917) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8917));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0093, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd2';
                        mesh.Tag = { name: '万达2', position: position }
                        buildingsGroups.add(mesh);
                    }
                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8907) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8907));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0093, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd3';
                        mesh.Tag = { name: '万达3', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8897) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8897));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0093, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd4';
                        mesh.Tag = { name: '万达4', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8875) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8875));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0088, 0.0093, 0.0093);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd5';
                        mesh.Tag = { name: '万达5', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8868) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8868));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0078, 0.0093, 0.0078);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd6';
                        mesh.Tag = { name: '万达6', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5576), y: 0, z: -MercatorGetYbyLatitude(37.88601) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88601));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0078, 0.008, 0.0078);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd7';
                        mesh.Tag = { name: '万达7', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        var position = { x: MercatorGetXbyLongitude(112.5576), y: 0, z: -MercatorGetYbyLatitude(37.88521) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88521));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0078, 0.008, 0.0078);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd8';
                        mesh.Tag = { name: '万达8', position: position }
                        buildingsGroups.add(mesh);
                    }

                    {
                        var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.rotateX(-Math.PI / 2);
                        mesh.rotateZ(-0.01);
                        //  var position = { x: MercatorGetXbyLongitude(112.5576), y: 0, z: -MercatorGetYbyLatitude(37.88521) };
                        //  112.557307, 37.892976
                        mesh.position.set(MercatorGetXbyLongitude(112.5876), 0, -MercatorGetYbyLatitude(37.88521));
                        //mesh.position.set(0, 0, 0 );
                        // mesh.rotation.set(-Math.PI / 2, 0, 0);
                        //mesh.rotateX(-Math.PI / 2);
                        mesh.scale.set(0.0078, 0.008, 0.0078);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.name = 'buildwd9';
                        mesh.Tag = { name: '万达9', position: position }
                        buildingsGroups.add(mesh);
                    }

                });

            if (false) {
                var loader = new THREE.FBXLoader();
                loader.load('ObjTag/build2fuzhi.fbx', function (object) {

                    //mixer = new THREE.AnimationMixer(object);

                    //var action = mixer.clipAction(object.animations[0]);
                    //action.play();
                    var groupOfFbx = new THREE.Group();
                    object.traverse(function (child) {

                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            groupOfFbx.add(child);
                        }

                    });
                    buildingsGroups.add(groupOfFbx);
                    //scene.add(object);

                });
            }
        }
        else {
        }
    }
    else if (operateType == 'hide') {
        buildingsGroups.visible = false;
    }
}

var drawCommunity = function (operateType) {
    if (operateType == 'show') {
        if (courtGroup.children.length == 0) {
            if (operateType == 'show') {
                opreateGroup = courtGroup;
                opreateGroup.visible = true;
                if (opreateGroup.children.length == 0) {
                    if (dataGet.courtData)
                        for (var i = 0; i < dataGet.courtData.length; i++) {
                            var PlotId = dataGet.courtData[i].PlotId;
                            var PlotName = dataGet.courtData[i].PlotName;
                            var CountyId = dataGet.courtData[i].CountyId;
                            var CountyName = dataGet.courtData[i].CountyName;
                            var Address = dataGet.courtData[i].Address;
                            var Longitude = parseFloat(dataGet.courtData[i].Longitude);
                            var Latitude = parseFloat(dataGet.courtData[i].Latitude);
                            var Year = dataGet.courtData[i].Year;

                            console.log('s', dataGet.courtData[i]);
                            var element = document.createElement('div');
                            element.className = 'pointLabelElement cursor';

                            var img = document.createElement('img');
                            img.src = "Pic/community.png";
                            var element2 = document.createElement('div');

                            var elementb = document.createElement('b');
                            elementb.innerText = PlotName;

                            element2.appendChild(elementb);

                            element.appendChild(img);
                            element.appendChild(element2);
                            element.Tag = dataGet.courtData[i];
                            //element.onclick = function () { alert('A'); }

                            var object = new THREE.CSS2DObject(element);



                            // objects.push(object);

                            // var schoolModel = xingquDianGroup.unit.school.clone();
                            // console.log('itemData' + i, data[i]);

                            //var objGroup = xingquDianGroup.unit.hosipital.clone();
                            var radius = 0.5;
                            var color = 'red';
                            //var coordinates = data[i].Point.coordinates.split(',');
                            //if (coordinates.length != 2) {
                            //    continue;
                            //}
                            var lon = Longitude;
                            var lat = Latitude;
                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);

                            // var itemSql = 'insert into taste(p_id,tt_id,lon,lat,t_name) values (1,' + ttid + ',' + lon + ',' + lat + ',"' + data[i].name + '");\r';
                            //sumSql += itemSql;
                            //if (objType == "factory") {
                            //    //var xx = new THREE.Object3D();
                            //    //xx.position.set(x_m, 0, -z_m);
                            //    //xx.Tag = {};
                            element.addEventListener('click', function () {

                                if (mouseClickElementInterviewState.click()) {
                                    mouseClickElementInterviewState.init();
                                }
                                else {
                                    return;
                                }
                                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "court", Tag: this.Tag })
                                top.postMessage(sendMsg, '*');
                                console.log('iframe外发送信息', sendMsg);
                            });
                            //}
                            //else if (objType == "environment") {
                            //    //var xx = new THREE.Object3D();
                            //    //xx.position.set(x_m, 0, -z_m);
                            //    //xx.Tag = {};
                            //    element.addEventListener('click', function () {
                            //        if (mouseClickElementInterviewState.click()) {
                            //            mouseClickElementInterviewState.init();
                            //        }
                            //        else {
                            //            return;
                            //        }
                            //        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                            //        top.postMessage(sendMsg, '*');
                            //        console.log('iframe外发送信息', sendMsg);
                            //    });
                            //}

                            object.position.set(x_m, 0, -z_m);
                            opreateGroup.add(object);

                        }
                }
                else {

                }
            }
        }
    }
    else if (operateType == 'hide') {

        opreateGroup = courtGroup;
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }

    }
}

var searchBuildings = function (keyWords) {
    {
        for (var i = 0; i < buildingsGroups.children.length; i++) {
            if (buildingsGroups.children[i].Tag.name == keyWords) {
                controls.target.set(buildingsGroups.children[i].Tag.position.x, buildingsGroups.children[i].Tag.position.y, buildingsGroups.children[i].Tag.position.z);

            }
            else {
                //   biandiansuoGroup.children[i].material.color.set('green');
            }
        }
    }
}

var setupCanvasDrawing = function () {
    // mapGroup.child[0]
    mapTexture = new THREE.CanvasTexture(ctx.canvas);
    mapTexture.needsUpdate = true;
    mapGroup.children[0].material.map = mapTexture;
}

var get16 = function (n) {
    var result = '';
    for (var i = 0; i < 6; i++) {
        var a = n % 16;
        switch (a) {
            case 0: { result = '0' + result; }; break;
            case 1: { result = '1' + result; }; break;
            case 2: { result = '2' + result; }; break;
            case 3: { result = '3' + result; }; break;
            case 4: { result = '4' + result; }; break;
            case 5: { result = '5' + result; }; break;
            case 6: { result = '6' + result; }; break;
            case 7: { result = '7' + result; }; break;
            case 8: { result = '8' + result; }; break;
            case 9: { result = '9' + result; }; break;
            case 10: { result = 'a' + result; }; break;
            case 11: { result = 'b' + result; }; break;
            case 12: { result = 'c' + result; }; break;
            case 13: { result = 'd' + result; }; break;
            case 14: { result = 'e' + result; }; break;
            case 15: { result = 'f' + result; }; break;
        }
        n = n >> 4;
    }
    result = '#' + result;
    return result;
}

var visibleOfLabelOfLine = false;




var chineseToNumStr = function (c) {
    var val = "";
    for (var i = 0; i < c.length; i++) {
        if (val == "")
            val = c.charCodeAt(i).toString(16);
        else
            val += "_" + c.charCodeAt(i).toString(16);
    }
    return val;
}

var setIntensity = function (v) {
    light1.intensity = v;
    light2.intensity = v;
    light3.intensity = v;
    light4.intensity = v;
}

var initSvgLoader = function (url, setUnitGroup) {

    var loader = new THREE.SVGLoader();
    loader.load(url, function (paths) {

        var unitGroup = new THREE.Object3D();
        unitGroup.scale.multiplyScalar(0.0025);
        unitGroup.position.x = 0;
        unitGroup.position.y = 0;
        unitGroup.rotateZ(Math.PI);
        unitGroup.scale.set
        // unitGroup.scale.y *= -1;

        for (var i = 0; i < paths.length; i++) {

            var path = paths[i];

            var material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            var shapes = path.toShapes(true);

            for (var j = 0; j < shapes.length; j++) {

                var shape = shapes[j];

                var geometry = new THREE.ShapeBufferGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);

                unitGroup.add(mesh);

            }

        }
        //unitGroup.scale.set(0.1);
        setUnitGroup(unitGroup);
        //  scene.add(group);

    });
}

var drawXingquDian = function (operateType, objType) {
    var opreateGroup;

    if (objType == "hospital") {
        opreateGroup = xingquDianGroup.hosipital;
    }
    else if (objType == "school") {
        opreateGroup = xingquDianGroup.school;
    }
    else if (objType == "shop") {
        opreateGroup = xingquDianGroup.shop;
    }
    else if (objType == "factory") {
        opreateGroup = xingquDianGroup.factory;
    }
    else if (objType == "environment") {
        opreateGroup = xingquDianGroup.environment;
    }
    //environment
    else {
        return;
    }
    if (operateType == 'show') {
        opreateGroup.visible = true;
        if (opreateGroup.children.length == 0) {
            var cadLeftTop = { x: 17545.309, y: 65811.8395 };
            var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

            var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
            var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };
            var kx = 1;
            var ky = 1;
            var dx = 0.0128;
            var dy = 0.0065;
            var data;

            if (objType == "hospital") {
                data = hospitalInfo.Document.Folder.Placemark;
            }
            else if (objType == "school") {
                data = schoolInfo.Document.Folder.Placemark;
            }
            else if (objType == "shop") {
                data = shopInfo.Document.Folder.Placemark;
            }
            else if (objType == "factory") {
                data = factoryInfo.Document.Folder.Placemark;
            }
            else if (objType == "environment") {
                data = environmentInfo.Document.Folder.Placemark;
            }
            else {
                return;
            }
            //  var ttid = prompt('输入ttid');
            //var sumSql = '';
            for (var i = 0; i < data.length; i++) {



                //              <div class="pointLabelElement">
                //    <img src="Pic/hospital.svg" />
                //    <div>
                //        <b>某某某某某某某某某某某某医院</b>
                //    </div>
                //</div>

                var element = document.createElement('div');
                element.className = 'pointLabelElement';

                var img = document.createElement('img');
                if (objType == "hospital") {
                    img.src = "Pic/hospital.png";
                }
                else if (objType == "school") {
                    img.src = "Pic/school.png";
                }
                else if (objType == "shop") {
                    img.src = "Pic/shop.png";
                }
                else if (objType == "factory") {
                    img.src = "Pic/factory.png";
                }
                else if (objType == "environment") {
                    img.src = "Pic/cgq.svg";
                }
                else {
                    return;
                }
                var element2 = document.createElement('div');

                var elementb = document.createElement('b');
                elementb.innerText = data[i].name;

                element2.appendChild(elementb);

                element.appendChild(img);
                element.appendChild(element2);
                element.Tag = data[i];
                //element.onclick = function () { alert('A'); }

                var object = new THREE.CSS2DObject(element);



                // objects.push(object);

                // var schoolModel = xingquDianGroup.unit.school.clone();
                // console.log('itemData' + i, data[i]);

                //var objGroup = xingquDianGroup.unit.hosipital.clone();
                var radius = 0.5;
                var color = 'red';
                var coordinates = data[i].Point.coordinates.split(',');
                if (coordinates.length != 2) {
                    continue;
                }
                var lon = Number.parseFloat(coordinates[0]) * kx + dx;
                var lat = Number.parseFloat(coordinates[1]) * ky + dy;
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);

                // var itemSql = 'insert into taste(p_id,tt_id,lon,lat,t_name) values (1,' + ttid + ',' + lon + ',' + lat + ',"' + data[i].name + '");\r';
                //sumSql += itemSql;
                if (objType == "factory") {
                    //var xx = new THREE.Object3D();
                    //xx.position.set(x_m, 0, -z_m);
                    //xx.Tag = {};
                    element.addEventListener('click', function () {

                        if (mouseClickElementInterviewState.click()) {
                            mouseClickElementInterviewState.init();
                        }
                        else {
                            return;
                        }
                        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
                        top.postMessage(sendMsg, '*');
                        console.log('iframe外发送信息', sendMsg);
                    });
                }
                else if (objType == "environment") {
                    //var xx = new THREE.Object3D();
                    //xx.position.set(x_m, 0, -z_m);
                    //xx.Tag = {};
                    element.addEventListener('click', function () {
                        if (mouseClickElementInterviewState.click()) {
                            mouseClickElementInterviewState.init();
                        }
                        else {
                            return;
                        }
                        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                        top.postMessage(sendMsg, '*');
                        console.log('iframe外发送信息', sendMsg);
                    });
                }

                object.position.set(x_m, 0, -z_m);
                opreateGroup.add(object);

            }

            console.log('sumSql', sumSql);
        }
        else {

        }
    }
    else if (operateType == 'hide') {
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }

    }

}

var drawXingquDian_2 = function (operateType, objType) {
    var opreateGroup;

    if (objType == "hospital") {
        opreateGroup = xingquDianGroup.hosipital;
    }
    else if (objType == "school") {
        opreateGroup = xingquDianGroup.school;
    }
    else if (objType == "shop") {
        opreateGroup = xingquDianGroup.shop;
    }
    else if (objType == "factory") {
        drawFactory(operateType, objType);
        return;
        //opreateGroup = xingquDianGroup.factory;
    }
    else if (objType == "environment") {
        drawEnvironment(operateType, objType);
        return;
        //opreateGroup = xingquDianGroup.environment;
    }
    else if (objType == "government") {
        opreateGroup = xingquDianGroup.government;
        //opreateGroup = xingquDianGroup.environment;
    }
    else if (objType == "bank") {
        opreateGroup = xingquDianGroup.bank;
        //opreateGroup = xingquDianGroup.environment;
    }
    else if (objType == "microStation") {
        drawMicroStation(operateType, objType);
        return;
        //opreateGroup = xingquDianGroup.environment;
    }
    //environment
    else {
        return;
    }
    if (operateType == 'show') {

        opreateGroup.visible = true;
        if (opreateGroup.children.length == 0) {
            if (dataGet.interestpoint)
                for (var i = 0; i < dataGet.interestpoint.length; i++) {
                    var Code = dataGet.interestpoint[i].Code;
                    var Name = dataGet.interestpoint[i].Name;
                    var AreaCode = dataGet.interestpoint[i].AreaCode;
                    var Longitude = dataGet.interestpoint[i].Longitude;
                    var Latitude = dataGet.interestpoint[i].Latitude;
                    var InterestPointType = dataGet.interestpoint[i].InterestPointType;
                    var Icon = dataGet.interestpoint[i].Icon;
                    if (objType == InterestPointType) {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';
                        element.Tag = dataGet.interestpoint[i];
                        var img = document.createElement('img');
                        if (objType == "hospital") {
                            img.src = "Pic/hospital.png";
                        }
                        else if (objType == "school") {
                            img.src = "Pic/school.png";
                        }
                        else if (objType == "shop") {
                            img.src = "Pic/shop.png";
                        }
                        else if (objType == "government") {
                            img.src = Icon;
                        }
                        else if (objType == "bank") {
                            img.src = Icon;
                        }
                        else {
                            return;
                        }

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = Name;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.interestpoint[i];
                        //element.onclick = function () { alert('A'); }

                        element.addEventListener('click', function () {

                            if (mouseClickElementInterviewState.click()) {
                                mouseClickElementInterviewState.init();
                            }
                            else {
                                return;
                            }
                            var sendMsg = JSON.stringify({ command: 'showInformation', selectType: objType, Tag: this.Tag })
                            top.postMessage(sendMsg, '*');
                            console.log('iframe外发送信息', sendMsg);
                        });

                        var object = new THREE.CSS2DObject(element);



                        // objects.push(object);

                        // var schoolModel = xingquDianGroup.unit.school.clone();
                        // console.log('itemData' + i, data[i]);

                        //var objGroup = xingquDianGroup.unit.hosipital.clone();
                        var radius = 0.5;
                        var color = 'red';
                        //var coordinates = data[i].Point.coordinates.split(',');
                        //if (coordinates.length != 2) {
                        //    continue;
                        //}
                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);



                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }
                    else {
                        continue;
                    }

                }

        }
        else {

        }
    }
    else if (operateType == 'hide') {
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }

    }

}

var drawEnvironment = function (operateType, objType) {
    var opreateGroup = xingquDianGroup.environment;
    opreateGroup.visible = true;
    if (opreateGroup.children.length == 0) {
        if (dataGet.controlpoint)
            for (var i = 0; i < dataGet.controlpoint.length; i++) {
                var Code = dataGet.controlpoint[i].Code;
                var Name = dataGet.controlpoint[i].Name;
                var AreaCode = dataGet.controlpoint[i].AreaCode;
                var Longitude = dataGet.controlpoint[i].Longitude;
                var Latitude = dataGet.controlpoint[i].Latitude;
                {
                    //data = hospitalInfo.Document.Folder.Placemark;
                    var element = document.createElement('div');
                    element.className = 'pointLabelElement cursor';

                    var img = document.createElement('img');
                    if (objType == "environment") {
                        img.src = "Pic/cgq.svg";
                    }
                    else {
                        return;
                    }

                    var element2 = document.createElement('div');

                    var elementb = document.createElement('b');
                    elementb.innerText = Name;

                    element2.appendChild(elementb);

                    element.appendChild(img);
                    element.appendChild(element2);
                    element.Tag = dataGet.controlpoint[i];
                    img.Tag = dataGet.controlpoint[i];
                    //element.onclick = function () { alert('A'); }

                    var object = new THREE.CSS2DObject(element);
                    var radius = 0.5;
                    var color = 'red';
                    var lon = Number.parseFloat(Longitude);
                    var lat = Number.parseFloat(Latitude);
                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);
                    if (objType == "factory") {
                        element.addEventListener('click', function () {

                            if (mouseClickElementInterviewState.click()) {
                                mouseClickElementInterviewState.init();
                            }
                            else {
                                return;
                            }
                            var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
                            top.postMessage(sendMsg, '*');
                            console.log('iframe外发送信息', sendMsg);
                        });
                    }
                    else if (objType == "environment") {
                        element.addEventListener('click', function () {

                            //alert('aa');
                            if (mouseClickElementInterviewState.click()) {
                                mouseClickElementInterviewState.init();
                                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                                top.postMessage(sendMsg, '*');
                                console.log('iframe外发送信息', sendMsg);
                            }
                            else {
                                return;
                            }

                        }, false);
                        img.addEventListener('mouseenter', function () {
                            var tag = this.Tag;
                            var Code = tag.Code;

                            var Longitude = Number.parseFloat(tag.Longitude);
                            var Latitude = Number.parseFloat(tag.Latitude);
                            //console.log('tag', tag);
                            ////e = e || window.event;
                            ////if (fixedMouse(e, target)) {
                            ////    //do something
                            ////}
                            for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
                                environmentInfoGroup.remove(environmentInfoGroup.children[i]);
                            }

                            {
                                //http://pojo.sodhanalibrary.com/ConvertToVariable
                                var myvar = '<div>' +
                                    '        <img src="Pic/airqualityindexframe_03.png" style="top:0px;position:absolute;width:383px;" />' +
                                    '        <table style="top:15px;left:35px;position:absolute;" border="0">' +
                                    '            <tr style="padding-bottom:200px;">' +
                                    '                <th style="width: 120px; height: 19px; font-family: MicrosoftYaHei; font-size: 18px; font-weight: bold; font-stretch: normal; letter-spacing: 2px; color: #24e2ff;width:170px;padding-bottom:15px;">' +
                                    '                    <span>' + dataGet.ControlPointDataday[Code].name + '</span>' +
                                    '' +
                                    '                    基本情况' +
                                    '                </th>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:160px;">' +
                                    '                    国控点名称:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].name + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr style="padding-top:200px;">' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    空气质量情况:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].level + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    时间:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].date + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    一氧化碳:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].CO + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    PM2.5:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].PM2_5 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    二氧化氮:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].NO2 + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    PM10:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].PM10 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    臭氧:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].O3 + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    二氧化硫:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].SO2 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    空气质量指数:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].aqi + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    主要污染物:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.ControlPointDataday[Code].mainPollutant + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '        </table>' +
                                    '    </div>';

                                infomationHtml.show(myvar);

                                var lon = Number.parseFloat(Longitude);
                                var lat = Number.parseFloat(Latitude);
                                var x_m = MercatorGetXbyLongitude(lon);
                                var z_m = MercatorGetYbyLatitude(lat);

                                var position = new THREE.Vector3(x_m, 0.2, -z_m)

                                infomationHtml.target = position;
                                infomationHtml.animate();
                                //object.position.set(x_m, 0.2, -z_m);
                                //var element2 = document.createElement('div');
                                //element2.Tag = tag;
                                //element2.innerHTML = myvar;
                                ////element.onclick = function () { alert('A'); }

                                //element2.addEventListener('click', function () {
                                //    if (mouseClickElementInterviewState.click()) {
                                //        mouseClickElementInterviewState.init();
                                //    }
                                //    else {
                                //        return;
                                //    }
                                //    var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                                //    top.postMessage(sendMsg, '*');
                                //    console.log('iframe外发送信息', sendMsg);
                                //    for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
                                //        environmentInfoGroup.remove(environmentInfoGroup.children[i]);
                                //    }
                                //});

                                //var object = new THREE.CSS2DObject(element2);
                                //var radius = 0.5;
                                //var color = 'red';
                                //var lon = Number.parseFloat(Longitude);
                                //var lat = Number.parseFloat(Latitude);
                                //var x_m = MercatorGetXbyLongitude(lon);
                                //var z_m = MercatorGetYbyLatitude(lat);


                                //object.position.set(x_m, 0.2, -z_m);
                                //environmentInfoGroup.add(object);

                            }


                        }, false);
                        img.addEventListener('mouseout', function () {
                            var tag = this.Tag;
                            console.log('tag', tag);
                            infomationHtml.hide();
                            //e = e || window.event;
                            //if (fixedMouse(e, target)) {
                            //    //do something
                            //}
                        }, false);
                    }

                    object.position.set(x_m, 0, -z_m);
                    opreateGroup.add(object);
                }


            }

    }
    else {
        for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
            environmentInfoGroup.remove(environmentInfoGroup.children[i]);
        }
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }
    }
}

var drawMicroStation = function (operateType, objType) {
    var opreateGroup = xingquDianGroup.microStation;
    opreateGroup.visible = true;
    if (opreateGroup.children.length == 0) {
        if (dataGet.controlpoint)
            for (var i = 0; i < dataGet.micoroStation.length; i++) {
                var Code = dataGet.micoroStation[i].Code;
                var Name = dataGet.micoroStation[i].Name;
                var Longitude = dataGet.micoroStation[i].Longitude;
                var Latitude = dataGet.micoroStation[i].Latitude;

                {
                    //data = hospitalInfo.Document.Folder.Placemark;
                    var element = document.createElement('div');
                    element.className = 'pointLabelMicroStationElement';

                    var img = document.createElement('img');
                    img.src = "Pic/cgq.png";
                    //if (objType == "environment") {
                    //    img.src = "Pic/cgq.svg";
                    //}
                    //else {
                    //    return;
                    //}

                    var element2 = document.createElement('div');

                    var elementb = document.createElement('b');
                    elementb.innerText = Name;

                    element2.appendChild(elementb);

                    element.appendChild(img);
                    element.appendChild(element2);
                    img.Tag = dataGet.micoroStation[i];
                    element.Tag = dataGet.micoroStation[i];
                    //element.onclick = function () { alert('A'); }

                    var object = new THREE.CSS2DObject(element);
                    var radius = 0.5;
                    var color = 'red';
                    var lon = Number.parseFloat(Longitude);
                    if (lon <= 112.5412) { continue; }
                    else if (lon >= 112.6207) { continue; }
                    var lat = Number.parseFloat(Latitude);
                    if (lat >= 37.9107) {
                        continue;
                    }
                    else if (lat <= 37.8783) {
                        continue;
                    }
                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);
                    if (objType == "microStation") {
                        img.addEventListener('mouseenter', function () {
                            var tag = this.Tag;
                            var Code = tag.Code;

                            var Longitude = Number.parseFloat(tag.Longitude);
                            var Latitude = Number.parseFloat(tag.Latitude);
                            //console.log('tag', tag);
                            ////e = e || window.event;
                            ////if (fixedMouse(e, target)) {
                            ////    //do something
                            ////}
                            for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
                                environmentInfoGroup.remove(environmentInfoGroup.children[i]);
                            }

                            {
                                //http://pojo.sodhanalibrary.com/ConvertToVariable
                                var myvar = '<div>' +
                                    '        <img src="Pic/airqualityindexframe_03.png" style="top:0px;position:absolute;width:383px;" />' +
                                    '        <table style="top:15px;left:35px;position:absolute;" border="0">' +
                                    '            <tr style="padding-bottom:200px;">' +
                                    //'                <th style="width: 120px; height: 19px; font-family: MicrosoftYaHei; font-size: 18px; font-weight: bold; font-stretch: normal; letter-spacing: 2px; color: #24e2ff;width:170px;padding-bottom:15px;">' +
                                    //'                    <span>' + dataGet.micoroStationPointDataday[Code].name + '</span>' +
                                    //'' +
                                    //'                    基本情况' +
                                    //'                </th>' +
                                    '                <td  colspan="2" style="width: 21px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:160px;">' +
                                    '                    国控点名称:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].name + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr style="padding-top:200px;">' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    CIEQ:' +
                                    '                    <span style="color: #24e2ff;">' + parseFloat(dataGet.micoroStationPointDataday[Code].cieq).toFixed(2) + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    时间:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].statDate + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    一氧化碳:' +
                                    '                    <span style="color: #24e2ff;">' + parseFloat(dataGet.micoroStationPointDataday[Code].CO).toFixed(2) + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    PM2.5:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].PM2_5 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    二氧化氮:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].NO2 + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    PM10:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].PM10 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    臭氧:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].O3 + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    二氧化硫:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].SO2 + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '            <tr>' +
                                    '                <td style="        width: 121px;' +
                                    '        height: 15px;' +
                                    '        font-family: MicrosoftYaHei;' +
                                    '        font-size: 14px;' +
                                    '        font-weight: normal;' +
                                    '        font-stretch: normal;' +
                                    '        letter-spacing: 1px;' +
                                    '        color: #ffffff;' +
                                    '        width: 170px;' +
                                    '        padding-bottom: 5px;">' +
                                    '                    空气质量指数:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].aqi + '</span>' +
                                    '                </td>' +
                                    '                <td style="width: 121px; height: 15px; font-family: MicrosoftYaHei; font-size: 14px; font-weight: normal; font-stretch: normal; letter-spacing: 1px; color: #ffffff;width:170px;">' +
                                    '                    主要污染物:' +
                                    '                    <span style="color: #24e2ff;">' + dataGet.micoroStationPointDataday[Code].mainPollutant + '</span>' +
                                    '                </td>' +
                                    '            </tr>' +
                                    '        </table>' +
                                    '    </div>';

                                infomationHtml.show(myvar);

                                var lon = Number.parseFloat(Longitude);
                                var lat = Number.parseFloat(Latitude);
                                var x_m = MercatorGetXbyLongitude(lon);
                                var z_m = MercatorGetYbyLatitude(lat);

                                var position = new THREE.Vector3(x_m, 0.2, -z_m)

                                infomationHtml.target = position;
                                infomationHtml.animate();


                                //var position = new THREE.Vector3(x_m, 0.2, -z_m)

                                //infomationHtml.target = position;
                                //infomationHtml.animate();
                                //var element2 = document.createElement('div');
                                //element2.Tag = tag;
                                //element2.innerHTML = myvar;
                                ////element.onclick = function () { alert('A'); }

                                //element2.addEventListener('click', function () {
                                //    if (mouseClickElementInterviewState.click()) {
                                //        mouseClickElementInterviewState.init();
                                //    }
                                //    else {
                                //        return;
                                //    }
                                //    var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                                //    top.postMessage(sendMsg, '*');
                                //    console.log('iframe外发送信息', sendMsg);
                                //    for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
                                //        environmentInfoGroup.remove(environmentInfoGroup.children[i]);
                                //    }
                                //});

                                //var object = new THREE.CSS2DObject(element2);
                                //var radius = 0.5;
                                //var color = 'red';
                                //var lon = Number.parseFloat(Longitude);
                                //var lat = Number.parseFloat(Latitude);
                                //var x_m = MercatorGetXbyLongitude(lon);
                                //var z_m = MercatorGetYbyLatitude(lat);


                                //object.position.set(x_m, 0, -z_m);
                                //environmentInfoGroup.add(object);

                            }


                        }, false);
                        img.addEventListener('mouseout', function () {
                            var tag = this.Tag;
                            console.log('tag', tag);
                            infomationHtml.hide();
                            //e = e || window.event;
                            //if (fixedMouse(e, target)) {
                            //    //do something
                            //}
                        }, false);
                    }

                    object.position.set(x_m, 0, -z_m);
                    opreateGroup.add(object);
                }


            }

    }
    else {
        for (var i = environmentInfoGroup.children.length - 1; i >= 0; i--) {
            environmentInfoGroup.remove(environmentInfoGroup.children[i]);
        }
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }
    }
}

var drawFactory = function (operateType, objType) {

    var opreateGroup;
    if (objType == "factory") {

        opreateGroup = xingquDianGroup.factory;
    }
    else {
        return;
    }
    if (operateType == 'show') {

        opreateGroup.visible = true;
        if (opreateGroup.children.length == 0) {
            if (dataGet.polluteenterprise)
                for (var i = 0; i < dataGet.polluteenterprise.length; i++) {
                    var Code = dataGet.polluteenterprise[i].ConsTgId;
                    var Name = dataGet.polluteenterprise[i].ConsTgName;
                    var AreaCode = dataGet.polluteenterprise[i].AreaCode;
                    var Longitude = parseFloat(dataGet.polluteenterprise[i].Longitude);
                    var Latitude = parseFloat(dataGet.polluteenterprise[i].Latitude);
                    var Details = dataGet.polluteenterprise[i].Latitude;
                    // var InterestPointType = dataGet.polluteenterprise[i].InterestPointType;
                    //var Icon = dataGet.polluteenterprise[i].Icon;
                    //if (objType == InterestPointType)
                    {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';

                        var img = document.createElement('img');
                        if (objType == "factory") {
                            img.src = "Pic/factory.png";
                        }
                        else {
                            return;
                        }

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = Name;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.polluteenterprise[i];
                        //element.onclick = function () { alert('A'); }

                        var object = new THREE.CSS2DObject(element);



                        // objects.push(object);

                        // var schoolModel = xingquDianGroup.unit.school.clone();
                        // console.log('itemData' + i, data[i]);

                        //var objGroup = xingquDianGroup.unit.hosipital.clone();
                        var radius = 0.5;
                        var color = 'red';
                        //var coordinates = data[i].Point.coordinates.split(',');
                        //if (coordinates.length != 2) {
                        //    continue;
                        //}
                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);

                        // var itemSql = 'insert into taste(p_id,tt_id,lon,lat,t_name) values (1,' + ttid + ',' + lon + ',' + lat + ',"' + data[i].name + '");\r';
                        //sumSql += itemSql;
                        if (objType == "factory") {
                            //var xx = new THREE.Object3D();
                            //xx.position.set(x_m, 0, -z_m);
                            //xx.Tag = {};
                            element.addEventListener('click', function () {

                                if (mouseClickElementInterviewState.click()) {
                                    mouseClickElementInterviewState.init();
                                }
                                else {
                                    return;
                                }
                                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
                                top.postMessage(sendMsg, '*');
                                console.log('iframe外发送信息', sendMsg);
                            });
                        }
                        else if (objType == "environment") {
                            //var xx = new THREE.Object3D();
                            //xx.position.set(x_m, 0, -z_m);
                            //xx.Tag = {};
                            element.addEventListener('click', function () {
                                if (mouseClickElementInterviewState.click()) {
                                    mouseClickElementInterviewState.init();
                                }
                                else {
                                    return;
                                }
                                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                                top.postMessage(sendMsg, '*');
                                console.log('iframe外发送信息', sendMsg);
                            });
                        }

                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }
                    //else {
                    //    continue;
                    //}

                }

        }
        else {

        }
    }
    else if (operateType == 'hide') {
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }

    }
}

var updateXingquDianGroup = function (length) {



    var operateGroups = [xingquDianGroup.school, xingquDianGroup.hosipital, xingquDianGroup.shop, xingquDianGroup.microStation];

    if (length <= 12) {
        for (var i = 0; i < operateGroups.length; i++) {
            if (operateGroups[i].visible) {
                for (var j = 0; j < operateGroups[i].children.length; j++) operateGroups[i].children[j].element.classList.remove('displayNone');
            }
        }
    }
    else {
        var positions = [];
        var maxV = function (operateGroups) {
            var maxVResult = 0;
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].children.length > maxVResult) {
                    maxVResult = operateGroups[i].children.length;
                }
            }
            return maxVResult;
        }(operateGroups);


        for (var j = 0; j < maxV; j++) {
            for (var i = 0; i < operateGroups.length; i++) {
                if (operateGroups[i].visible)
                    if (j < operateGroups[i].children.length) {
                        var positionOfObj = operateGroups[i].children[j].position;
                        if (function (positionItems, positionItem, lengthInput) {
                            // positionItems = [];
                            for (var k = 0; k < positionItems.length; k++) {
                                var a = positionItems[k];
                                var b = positionItem;
                                var lengthCal = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
                                if (lengthCal > lengthInput / 15) continue;
                                else return false;
                            }
                            return true;
                        }(positions, positionOfObj, length)) {
                            positions.push(positionOfObj);
                            //operateGroups[i].children[j].visible = true;
                            // operateGroups[i].children[j].element.hidden = false;
                            operateGroups[i].children[j].element.classList.remove('displayNone');
                        }
                        else {
                            operateGroups[i].children[j].element.classList.add('displayNone');
                            // operateGroups[i].children[j].element.hidden = true;
                        }
                    }
            }
        }

    }

}

var xmlDoc = null;


var operateIndex = 1;
var houmen1 = function () {
    if (peibianGroup.visible) {
        if (operateIndex % 2 == 1) {

            peibianGroup.children[0].material.color.b = 0;
            peibianGroup.children[0].material.color.g = 200;
            peibianGroup.children[0].material.color.r = 128;

        }
        else {
            peibianGroup.children[0].material.color.b = 0;
            peibianGroup.children[0].material.color.g = 0;
            peibianGroup.children[0].material.color.r = 0;
        }
        operateIndex++;
    }
}
document.onkeydown = function (event) {
    var e = event;
    if (e && e.keyCode == 32) { //下
        houmen1();
    }
}



/**
代码区
**/
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
    editedShape.state = 'addPointToMid';
}
var drawEditLine = function () {

    var addLine = function (vertices, polyLineGroup) {
        var geometry_2 = new THREE.LineGeometry();
        geometry_2.setPositions(vertices);
        var material_2 = new THREE.LineMaterial({
            color: showAConfig.boundry.color,
            linewidth: showAConfig.boundry.width,
        });

        if (polyLineGroup.getObjectByName('addPointToEnd_Copy')) {
            polyLineGroup.getObjectByName('addPointToEnd_Copy').geometry = geometry_2;
            // measureAreaGroup.getObjectByName('boundryLine2').geometry.groupsNeedUpdate
        }
        else {
            material_2.renderOrder = 9;
            material_2.depthTest = false;
            var line_2 = new THREE.Line2(geometry_2, material_2);
            line_2.computeLineDistances();
            line_2.renderOrder = 0;
            line_2.scale.set(1, 1, 1);
            line_2.renderOrder = 9;
            line_2.name = 'addPointToEnd_Copy'
            polyLineGroup.add(line_2);
        }
    }
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
                addLine(vertices, polyLineGroup);
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

                addLine(vertices, polyLineGroup);
            }

        }

    }
}
var drawEditShape = function () {

}

var setShapeAddPoint = function () {
    if (editedShape.state == 'addPointToEnd') {
        if (editedShape.currentPoint != null) {
            var mousePosition = { x: editedShape.currentPoint.x, z: editedShape.currentPoint.z };
            editedShape.points.push(mousePosition);
        }
    }
    else if (editedShape.state == 'addPointToMid') {
        if (editedShape.currentPoint != null) {
            if (editedShape.currentIndex >= 0) {
                editedShape.points.splice(editedShape.currentIndex, 0.01, editedShape.currentPoint);
            }
            else {
                editedShape.points.push(editedShape.currentPoint);
            }
        }
    }
    //else { }
}

var addShape = {
    onmousemove: function () {
        if (editedShape.state == 'addPointToEnd') {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            //console.log('raycaster', raycaster);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

                editedShape.currentPoint = mousePosition;

            }
        }
        else if (editedShape.state == 'addPointToMid') {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            //console.log('raycaster', raycaster);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

                editedShape.currentPoint = mousePosition;

            }
        }
        else if (drawEditShape == 'addPointToSave') {

        }
        //else if (editedLine.state == 'addPointToMid') {
        //    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //    raycaster.setFromCamera(mouse, camera);

        //    //console.log('raycaster', raycaster);
        //    if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

        //        var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
        //        var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

        //        editedLine.currentPoint = mousePosition;

        //    }
        //}
    },
    clickKeyE: function () {
        if (clickState == 'addShape') {
            if (editedShape.state == 'addPointToEnd') {
                editedShape.state = 'addPointToMid'
            }
            else if (editedShape.state == 'addPointToMid') {
                editedShape.currentIndex = -1;
                editedShape.state = 'addPointToEnd'
            }
            else {
                //throw Error('editedLine.state:' + editedLine.state);
            }
        }
    },
    updateLineMeasure: function () {
        if (editedShape.points.length >= 3) {
            if (editedShape.state == "addPointToEnd") {
                var vertices = [];

                var showShape = new THREE.Shape();
                showShape.moveTo(editedShape.points[0].x, -editedShape.points[0].z);
                for (var i = 1; i < editedShape.points.length; i++) {
                    showShape.lineTo(editedShape.points[i].x, -editedShape.points[i].z);
                }
                if (editedShape.currentPoint) {
                    showShape.lineTo(editedShape.currentPoint.x, -editedShape.currentPoint.z);
                }
                var geometry = new THREE.ShapeGeometry(showShape);


                var operateObj = scene.getObjectByName('editedShape');
                if (operateObj) {
                    operateObj.geometry = geometry;
                }
                else {
                    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.FrontSide, transparent: true, opacity: 0.4 });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.position.y = 0.01;
                    mesh.name = 'editedShape';
                    scene.add(mesh);
                }
                //if()
                //if (polyLineGroup.children.length == 0) {

                //    var mesh = new THREE.Mesh(geometry, material);

                //    polyLineGroup.add(mesh);

                //}
                //else {
                //    polyLineGroup.children[0].geometry = geometry;
                //}
            }
            else if (editedShape.state == 'addPointToMid') {
                var getMinV = function (vertices) {
                    var result = [];
                    minCircumference = 10000000;
                    {

                        for (var i = 0; i < vertices.length; i++) {
                            var verticesNew = [];
                            for (var j = 0; j < vertices.length; j++) {
                                verticesNew.push(vertices[j]);
                            }
                            if (editedShape.currentPoint != null) {
                                verticesNew.splice(i, 0, editedShape.currentPoint);
                            }
                            Circumference = 0;
                            for (var k = 0; k < verticesNew.length; k++) {

                                var previous = (k > 0 ? verticesNew[k - 1] : verticesNew[verticesNew.length - 1]);
                                var current = verticesNew[k];
                                Circumference += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
                            }
                            if (Circumference < minCircumference) {
                                result = verticesNew;
                                minCircumference = Circumference;
                                editedShape.currentIndex = i + 0;
                            }
                            //  c += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
                        }
                    }
                    return result;
                }
                var r = getMinV(editedShape.points);
                if (r == null) {
                    return;
                }
                var showShape = new THREE.Shape();
                showShape.moveTo(r[0].x, -r[0].z);
                for (var i = 1; i < r.length; i++) {
                    showShape.lineTo(r[i].x, -r[i].z);
                }
                showShape.lineTo(r[0].x, -r[0].z);
                var geometry = new THREE.ShapeGeometry(showShape);
                var operateObj = scene.getObjectByName('editedShape');
                if (operateObj) {
                    operateObj.geometry = geometry;
                }
                else {
                    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.FrontSide, transparent: true, opacity: 0.4 });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.position.y = 0.01;
                    mesh.name = 'editedShape';
                    scene.add(mesh);
                }
            }
            else {
                var vertices = [];

                var showShape = new THREE.Shape();
                showShape.moveTo(editedShape.points[0].x, -editedShape.points[0].z);
                for (var i = 1; i < editedShape.points.length; i++) {
                    showShape.lineTo(editedShape.points[i].x, -editedShape.points[i].z);
                }
                //if (editedShape.currentPoint) {
                //    showShape.lineTo(editedShape.currentPoint.x, -editedShape.currentPoint.z);
                //}
                var geometry = new THREE.ShapeGeometry(showShape);


                var operateObj = scene.getObjectByName('editedShape');
                if (operateObj) {
                    operateObj.geometry = geometry;
                }
                else {
                    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.FrontSide, transparent: true, opacity: 0.4 });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.position.y = 0.01;
                    mesh.name = 'editedShape';
                    scene.add(mesh);
                }
            }

        }
        else {
            if (scene.getObjectByName('editedShape')) scene.remove(scene.getObjectByName('editedShape'));
        }
    },
    clickKeyD: function () {
        if (clickState == 'addShape') {
            //if (editedLine.isClosed) { }
            //else

            {
                var getClosedIndex = function (vertices) {
                    var result = -1;
                    minLenght = 10000000;
                    {

                        for (var i = 0; i < vertices.length; i++) {
                            if (editedShape.currentPoint == null) {
                                return -1;
                            }
                            else {
                                var current = vertices[i];
                                var itemLength = getLengthOfTwoPoint(getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z), getBaiduPositionLon(editedShape.currentPoint.x), getBaiduPositionLat(-editedShape.currentPoint.z));
                                if (itemLength < minLenght) {
                                    minLenght = itemLength;
                                    result = i + 0;
                                }
                            }
                        }
                    }
                    return result;
                }
                var r = getClosedIndex(editedShape.points);
                if (r == -1) {
                    return;
                }
                else {
                    editedShape.points.splice(r, 1);
                }
            }

        }
    },
    clickKeyS: function () {
        if (editedShape.state == 'addPointToEnd' || editedShape.state == 'addPointToMid') {
            editedShape.state = 'addPointToSave';
            editedShape.currentPoint = null;
            editedShape.currentIndex = -1;
        }
        var geometry = [];
        for (var i = 0; i < editedShape.points.length; i++) {
            geometry.push(getBaiduPositionLon(editedShape.points[i].x));
            geometry.push(getBaiduPositionLat(-editedShape.points[i].z));
        }
        var sendMsg = JSON.stringify({ command: 'showDialog', selectType: 'polygon', geometry: geometry });
        top.postMessage(sendMsg, '*');
        console.log('iframe外发送信息', sendMsg);
    },
};

var panorama = {
    currentPoint: null,
    addPoint: function () {
        if (clickState == panorama.state) {
            var sendMsg = JSON.stringify({ command: 'showDialogAddPanorama', selectType: 'point', point: panorama.currentPoint, areaCode: dataGet.areaCode });
            top.postMessage(sendMsg, '*');
            if (common.console) console.log('iframe外发送信息', sendMsg);
        }
    },
    onmousemove: function (event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        //console.log('raycaster', raycaster);
        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

            panorama.currentPoint = mousePosition;

        }
    },
    begainEditPanorama: function () {
        clickState = panorama.state;
    },
    state: 'editingPanorama',
    group: null,
    draw: function (operateType) {
        if (operateType == 'show') {
            panorama.group.visible = true;
            if (panorama.group.children.length == 0) {

                var dg = new DataGet();
                dg.drawPanorama(dataGet.areaCode);
            }

        }
        else {
            for (var i = panorama.group.children.length - 1; i >= 0; i--) {
                panorama.group.remove(panorama.group.children[i]);
            }
        }
    }
};



var electricLine =
{
    draw: function (operateType) {
        if (operateType == 'show') {
            this.group.visible = true;
            if (this.group.children.length == 0) {

                var dg = new DataGet();
                dg.drawLine(dataGet.areaCode);
            }
        }
        else {
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                this.group.remove(this.group.children[i]);
            }
            for (var i = this.labelGroup.children.length - 1; i >= 0; i--) {
                this.labelGroup.remove(this.labelGroup.children[i]);
            }
            for (var i = electricLine.peibianGroup2.children.length - 1; i >= 0; i--) {
                electricLine.peibianGroup2.remove(electricLine.peibianGroup2.children[i]);
            }
            this.dataOfLineLabel = [];
            document.getElementById('labelOperarateButtons').style.zIndex = -1;
        }
    },
    group: null,
    labelGroup: null,
    peibianGroup2: null,
    dataOfLineLabel: [],
    showLabel: false,
    updateLabelOfLine: function () {
        return;
        if (arguments.length == 0) {
            if (this.dataOfLineLabel.length > 0) {

                if (this.group.visible) {
                    var xMin = (mercatoCenter.x - 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                    var xMax = (mercatoCenter.x + 7) * Math.pow(2, 19 - mercatoCenter.zoom);

                    var zValueMin = (mercatoCenter.zValue - 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                    var zValueMax = (mercatoCenter.zValue + 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                    var usedKey = [];
                    this.clearLabelOfLine();
                    //clearLabelOfLine();
                    if (this.showLabel)
                        for (var i = 0; i < this.dataOfLineLabel.length; i++) {
                            var x_m = this.dataOfLineLabel[i].x;
                            var z_m = this.dataOfLineLabel[i].z;


                            var key = ((x_m >> (19 - mercatoCenter.zoom + 1)) + '') + '_' + ((z_m >> (19 - mercatoCenter.zoom + 1)) + '') + '_' + chineseToNumStr(this.dataOfLineLabel[i].nameV);
                            if (x_m >= xMin && x_m <= xMax && z_m >= zValueMin && z_m <= zValueMax && lineShowIndex.indexOf(this.dataOfLineLabel[i].indexV) >= 0) {
                                if (this.labelGroup.getObjectByName(key)) { }
                                else {
                                    var xianShunV = this.getXianShunByName(this.dataOfLineLabel[i].nameV);
                                    if (dataGet.exceptionLine[this.dataOfLineLabel[i].LineId]) {
                                        var labelDiv = document.createElement('div');
                                        labelDiv.className = 'labelline';
                                        //var a = 0.1111;
                                        //a.toFixed(2);
                                        labelDiv.textContent = this.dataOfLineLabel[i].nameV + '(线损' + parseFloat(dataGet.exceptionLine[this.dataOfLineLabel[i].LineId]).toFixed(1) + '%)';
                                        labelDiv.style.marginTop = '-1em';
                                        var colorOfCircle = this.dataOfLineLabel[i].colorR;
                                        labelDiv.style.borderColor = 'red';
                                        labelDiv.style.color = 'red';
                                        var divLabel = new THREE.CSS2DObject(labelDiv);
                                        divLabel.position.set(x_m, 0, z_m);
                                        divLabel.positionTag = [x_m, 0, z_m];
                                        divLabel.name = key;
                                        this.labelGroup.add(divLabel);
                                    }
                                    else {
                                        var labelDiv = document.createElement('div');
                                        labelDiv.className = 'labelline';
                                        labelDiv.textContent = this.dataOfLineLabel[i].nameV;
                                        labelDiv.style.marginTop = '-1em';
                                        var colorOfCircle = this.dataOfLineLabel[i].colorR;
                                        labelDiv.style.borderColor = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                                        var divLabel = new THREE.CSS2DObject(labelDiv);
                                        divLabel.position.set(x_m, 0, z_m);
                                        divLabel.positionTag = [x_m, 0, z_m];
                                        divLabel.name = key;
                                        this.labelGroup.add(divLabel);
                                    }
                                }
                            }
                            else {
                                //if (lineLabelGroup.getObjectByName(key)) {
                                //    lineLabelGroup.remove(lineLabelGroup.getObjectByName(key));
                                //}
                            }
                        }
                }
                else {
                    electricLine.clearLabelOfLine();
                }

            }
        }
        else if (arguments.length == 1) {
            console.log('a', arguments[0]);
        }
    },
    clearLabelOfLine: function () {
        for (var i = this.labelGroup.children.length - 1; i >= 0; i--) {
            this.labelGroup.remove(this.labelGroup.children[i]);
        }

        //searchCondition.
    },
    getXianShunByName: function (name) {
        var chineseToNum = function (c) {
            var val = 0;
            for (var i = 0; i < c.length; i++) {
                if (val == 0)
                    val = c.charCodeAt(i);
                else
                    val += val * c.charCodeAt(i) + c.charCodeAt(i);
            }
            return val;
        }
        return chineseToNum(name) % 59;
    },
    updateOperationOfLabels: function () {

    },
    UpdateRunDate: function () {
    },
    recordT: 2682374400000,
    checkExceptionState: function (index) {
        var LineId = dataGet.lineData[index].LineId;
        var MergeId = dataGet.lineData[index].MergeId;
        if (dataGet.lineExceptionInfo == null) {
            return false;
        }
        else {
            //var data = null;
            if (dataGet.lineExceptionInfo[LineId] != undefined) {
                if (dataGet.lineExceptionInfo[LineId][searchCondition.eLObj.State.name] != undefined) {
                    var name = searchCondition.eLObj.State.name;
                    var state = dataGet.lineExceptionInfo[LineId][searchCondition.eLObj.State.name];
                    return searchCondition.eLObj.CheckException(name, state);
                }
                else {
                    return false;
                }
            }
            else if (dataGet.lineExceptionInfo[MergeId] != undefined) {
                if (dataGet.lineExceptionInfo[MergeId][searchCondition.eLObj.State.name] != undefined) {
                    var name = searchCondition.eLObj.State.name;
                    var state = dataGet.lineExceptionInfo[MergeId][searchCondition.eLObj.State.name];
                    return searchCondition.eLObj.CheckException(name, state);
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    },
    checkIsInSearchStr: function (index) {
        if (searchCondition.eLObj.name == null || searchCondition.eLObj.name == '') {
            return false;
        }
        else {
            var name = dataGet.lineData[index].Name;
            if (name.indexOf(searchCondition.eLObj.name) >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    addLabelOfLine: function (selectObj) {
        this.showPeibian = false;
        if (selectObj == null) {
            for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                this.peibianGroup2.remove(this.peibianGroup2.children[i]);
            }
            return;
        }
        else {
            raycaster.setFromCamera(mouse, camera);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
                var labelDiv = document.createElement('div');
                labelDiv.className = 'labelline';
                //var a = 0.1111;
                //a.toFixed(2);


                labelDiv.textContent = selectObj.Tag.name;
                labelDiv.style.marginTop = '-1em';
                //   var colorOfCircle = this.dataOfLineLabel[i].colorR;
                labelDiv.style.borderColor = dataGet.lineData[selectObj.Tag.index].Color;
                labelDiv.style.color = dataGet.lineData[selectObj.Tag.index].Color;


                var divLabel = new THREE.CSS2DObject(labelDiv);
                divLabel.position.set(mousePosition.x, 0, mousePosition.z);
                divLabel.positionTag = [mousePosition.x, 0, mousePosition.z];
                //divLabel.name = key;
                this.labelGroup.add(divLabel);
                //for (var i = electricLine.peibianGroup2.children.length - 1; i >= 0; i--) {
                //    electricLine.peibianGroup2.remove(electricLine.peibianGroup2.children[i]);
                //}
                this.showPeibian = true;
                //electricLine.addPeibianBelongToLine(selectObj);
                if (this.selectObj == null) {
                    this.selectObj = selectObj;
                    for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                        this.peibianGroup2.remove(this.peibianGroup2.children[i]);
                    }
                    var dg = new DataGet();

                    dg.drawPeibianBelongToLine(selectObj.Tag.index);
                }
                if (this.selectObj.uuid != selectObj.uuid) {
                    this.selectObj = selectObj;
                    for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                        this.peibianGroup2.remove(this.peibianGroup2.children[i]);
                    }
                    var dg = new DataGet();

                    dg.drawPeibianBelongToLine(selectObj.Tag.index);
                }

            }
            else {
                //for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                //    this.peibianGroup2.remove(this.peibianGroup2.children[i]);
                //}
            }

        }
    },

    addPeibianBelongToLine: function (selectObj) {
        var dg = new DataGet();

        dg.drawPeibianBelongToLine(selectObj.Tag.index);
    },
    showPeibian: false,
    selectObj: null
}

var biandiansuo =
{
    draw: function (operateType) {

        if (operateType == 'show') {
            this.group.visible = true;
            if (this.group.children.length == 0) {
                var dg = new DataGet();
                dg.drawSubstation(dataGet.areaCode);
            }
            else {
                this.searchBiandiansuo('BB');
                //searchTongxin5G('BB');
                for (var i = 0; i < this.group.children.length; i++) {
                    if (this.group.children[i].positionTag) {
                        this.group.children[i].position.set(biandiansuoGroup.children[i].positionTag[0], biandiansuoGroup.children[i].positionTag[1], biandiansuoGroup.children[i].positionTag[2]);
                    }
                }
            }
        }
        else if (operateType == 'hide') {
            this.group.visible = false;
            for (var i = 0; i < this.group.children.length; i++) {
                if (this.group.children[i].positionTag) {
                    this.group.children[i].position.set(0, 0, 0);
                }
            }

        }
    },
    group: null,
    groupStl: null,
    groupObj: null,
    loadStl: function (operateType) {
        if (operateType == 'show') {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                biandiansuo.geometry = geometry;
                var bg = new DataGet();
                bg.drawSubstationStl(1, biandiansuo.drawStl);
            });

            var manager = new THREE.LoadingManager();
            new THREE.MTLLoader(manager)
                .setPath('ObjTag/cbb/')
                .load('cbz.mtl', function (materials) {
                    materials.preload();
                    // materials.depthTest = false;
                    new THREE.OBJLoader(manager)
                        .setMaterials(materials)
                        .setPath('ObjTag/cbb/')
                        .load('cbz.obj', function (object) {
                            for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                if (object.children[iOfO].isMesh) {
                                    //var ms = object.children[iOfO].material;
                                    for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                        //  object.children[iOfO].material[mi].depthTest = false;
                                        object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                        object.children[iOfO].material[mi].color = new THREE.Color(2, 2, 2);
                                    }
                                    //object.children[iOfO].material.depthTest = false;
                                }
                            }
                            object.position.y = 0;
                            scene.add(object);
                            object.rotateX(-Math.PI / 2);
                            object.rotateZ(-0.03);

                            var position = { x: 97903.35419140823, y: 0, z: -35461.793750170385 };
                            object.position.set(97903.35419140823, 0, -35461.793750170385);
                            object.scale.set(0.25, 0.25, 0.25);
                            //object.castShadow = true;
                            //object.receiveShadow = true;
                            object.name = 'build2';
                            // object.Tag = { name: '世贸', position: position };
                            object.Tag = { name: '城北站', position: position, id: 'sm' };
                            object.rotateX(Math.PI / 2);
                            object.rotateY(0.03);
                            biandiansuo.groupObj.add(object);
                        }, function () { }, function () { });
                });
        }
        else {
            {
                var opreateGroup = this.groupStl;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
            }
            {
                var opreateGroup = this.groupObj;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
            }
        }
    },
    geometry: null,
    drawStl: function (data) {
        console.log('data', data);
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                continue;
            }
            var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(biandiansuo.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(i / data.length * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(MercatorGetXbyLongitude(parseFloat(data[i].Longitude)), 0, -MercatorGetYbyLatitude(parseFloat(data[i].Latitude)));
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            mesh.Tag = { name: data[i] };
            biandiansuo.groupStl.add(mesh);
        }
    }
};

var testF = function () {
    var showShape = new THREE.Shape();
    showShape.moveTo(10, 10);
    showShape.lineTo(10, 90);
    showShape.lineTo(90, 90);
    var geometry = new THREE.ShapeGeometry(showShape);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'test1z';
    scene.add(mesh);
}

var common =
{
    onmousemove: function () { },
    console: true
};

var lastCursorTimeState = 0;
var updateCursor = function () {

}

var walkManager = {
    start: 0, data: [], end: 0, animateData: null,
    walk: function () {
        if (walkManager.animateData != null) {
            var operateObj = document.getElementById('walkerIndexInputValue');
            var now = Date.now();
            var sumTime = 0;
            var sumTimes = [];
            for (var i = 0; i < walkManager.animateData.timeArray.length; i++) {
                sumTime += walkManager.animateData.timeArray[i] * 1000;
                var item = sumTime + 0;
                sumTimes.push(item);
            }
            if (sumTimes.length > 0) {
                var lastT = sumTimes[sumTimes.length - 1];
                if (walkManager.animateData.t + lastT < now) {
                    walkManager.animateData = null;
                    return;
                }
                else {

                    for (var i = 1; i < sumTimes.length; i++) {
                        var previewPoint = sumTimes[i - 1];
                        var currentPoint = sumTimes[i];

                        if (now >= walkManager.animateData.t + previewPoint && now < walkManager.animateData.t + currentPoint) {
                            var percent = (now - (walkManager.animateData.t + previewPoint)) / ((walkManager.animateData.t + currentPoint) - (walkManager.animateData.t + previewPoint));
                            operateObj.setSelectionRange(0, i * 2);
                            var data =
                                [
                                    walkManager.animateData.data[(i - 1) * 6 + 0] + percent * (walkManager.animateData.data[i * 6 + 0] - walkManager.animateData.data[(i - 1) * 6 + 0]),
                                    walkManager.animateData.data[(i - 1) * 6 + 1] + percent * (walkManager.animateData.data[i * 6 + 1] - walkManager.animateData.data[(i - 1) * 6 + 1]),
                                    walkManager.animateData.data[(i - 1) * 6 + 2] + percent * (walkManager.animateData.data[i * 6 + 2] - walkManager.animateData.data[(i - 1) * 6 + 2]),
                                    walkManager.animateData.data[(i - 1) * 6 + 3] + percent * (walkManager.animateData.data[i * 6 + 3] - walkManager.animateData.data[(i - 1) * 6 + 3]),
                                    walkManager.animateData.data[(i - 1) * 6 + 4] + percent * (walkManager.animateData.data[i * 6 + 4] - walkManager.animateData.data[(i - 1) * 6 + 4]),
                                    walkManager.animateData.data[(i - 1) * 6 + 5] + percent * (walkManager.animateData.data[i * 6 + 5] - walkManager.animateData.data[(i - 1) * 6 + 5])
                                ];
                            camera.position.x = data[0];
                            camera.position.y = data[1];
                            camera.position.z = data[2];

                            controls.target.x = data[3];
                            controls.target.y = data[4];
                            controls.target.z = data[5];

                            //walkManager.data.push(camera.position.x);
                            //walkManager.data.push(camera.position.y);
                            //walkManager.data.push(camera.position.z);
                            //walkManager.data.push(controls.target.x);
                            //walkManager.data.push(controls.target.y);
                            //walkManager.data.push(controls.target.z);
                            //console.log('data', data);
                        }

                    }
                }
                //  var lastT = timeArray[walkManager.animateData.timeArray.length - 1];
                //if (walkManager.animateData.t + lastT > Date.now()))
                //{
                //    walkManager.animateData = null;
                //}
                //    else {

                //}
            }
        }
    }
}
var walkerIndexController =
{
    show: function () {
        //document.getElementById('walkerIndexInput');
        controls.enableKeys = false;
        document.getElementById('walkerIndexInput').classList.remove('top');
        document.getElementById('walkerIndexInput').classList.remove('below');
        if (document.getElementById('walkerIndexInput').classList.contains('top')) {

        }
        else {
            document.getElementById('walkerIndexInput').classList.add('top');
        }
    },
    hide: function () {
        controls.enableKeys = true;
        document.getElementById('walkerIndexInput').classList.remove('top');
        document.getElementById('walkerIndexInput').classList.remove('below');
        if (document.getElementById('walkerIndexInput').classList.contains('below')) {

        }
        else {
            document.getElementById('walkerIndexInput').classList.add('below');
        }
    },
    init: function (count) {
        document.getElementById('walkerIndexInputValue').value = '';
        for (var i = 1; i < count; i++)
            document.getElementById('walkerIndexInputValue').value += ',';

    },
    focused: function () {
        if (document.getElementById('walkerIndexInput').classList.contains('top')) {
            return true;
        }
        else {
            return false;
        }
    },
    simulate: function () {
        var timeValue = document.getElementById('walkerIndexInputValue').value;
        var ss = timeValue.split(',');
        var timeArray = [];
        if (ss.length == walkManager.data.length / 6) { }
        else {
            alert('漫游控制点和时间控制点数量不一致！！！');
            return;
        }
        for (var i = 0; i < ss.length; i++) {
            var item = ss[i];
            var posPattern = /^\d*\.?\d+$/;

            if (posPattern.test(item)) {
                timeArray.push(parseFloat(item));
            }
            else {
                alert(`第${i + 1}个时间点不是正数！`);
                return;
            }
        }

        walkManager.animateData =
        {
            t: Date.now(),
            timeArray: timeArray,
            data: walkManager.data
        };

    },
    submit: function () {
        var timeValue = document.getElementById('walkerIndexInputValue').value;
        var ss = timeValue.split(',');
        var timeArray = [];
        if (ss.length == walkManager.data.length / 6) { }
        else {
            alert('漫游控制点和时间控制点数量不一致！！！');
            return;
        }
        for (var i = 0; i < ss.length; i++) {
            var item = ss[i];
            var posPattern = /^\d*\.?\d+$/;

            if (posPattern.test(item)) {
                timeArray.push(parseFloat(item));
            }
            else {
                alert(`第${i + 1}个时间点不是正数！`);
                return;
            }
        }

        var str = JSON.stringify(
            {
                t: Date.now(),
                timeArray: timeArray,
                data: walkManager.data
            });
        new DataGet().AddWalkerData(prompt('输入名称', '漫游线路'), str, function () { });
        walkerIndexController.hide();
        walkManager.start = Date.now();
        walkManager.data = [];
    },
    action: function (id) {
        if (dataGet.walkerData == null) { }
        else {
            if (this.group.children.length == 0) {
                this.draw();
            }
            for (var i = 0; i < dataGet.walkerData.length; i++) {
                if (dataGet.walkerData[i].Code == id) {
                    var jsonValue = dataGet.walkerData[i].Content;
                    var obj = JSON.parse(jsonValue);
                    obj.t = Date.now();
                    walkManager.animateData = obj;
                    return;
                }
            }
        }
    },

    data1: [
        { x: 97900.18260738632, z: -35449.95011900967 },
        { x: 97900.21623998032, z: -35450.40430862435 },
        { x: 97899.77868934265, z: -35450.41011212636 },
        { x: 97899.7933250984, z: -35450.780522806825 },

    ],
    group: null,
    initialize: function () {
        this.group = new THREE.Group();
        scene.add(this.group);
    },
    draw: function () {

        var operateGroup = this.group;
        var positions = [];
        var geometryLine = new THREE.BufferGeometry();
        for (var i = 0; i < this.data1.length; i++) {
            var x_m = this.data1[i].x;
            var z_m = this.data1[i].z;
            positions.push(x_m, 0, z_m);
        }
        {
            var x_m = this.data1[this.data1.length - 1].x;
            var z_m = this.data1[this.data1.length - 1].z;
            positions.push(x_m, 2, z_m);
        }
        geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        var material_ForSelect = new THREE.LineBasicMaterial({ color: 'green', linewidth: 0.01, transparent: false });//ignored by WebGLRenderer});

        var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
        operateGroup.add(line_ForSelect);
    }
};

var infomationHtml =
{
    target: null,
    animate: function () {
        if (infomationHtml.target != null) {
            var width = window.innerWidth, height = window.innerHeight;
            var widthHalf = width / 2, heightHalf = height / 2;

            var pos = infomationHtml.target;
            pos.project(camera);
            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = - (pos.y * heightHalf) + heightHalf;

            document.getElementById('pointInfomationNotiry').style.top = `${pos.y}px`;
            document.getElementById('pointInfomationNotiry').style.left = `${pos.x}px`;
            //console.log('位置', pos);
        }

    },
    show: function (html) {
        if (document.getElementById('pointInfomationNotiry').classList.contains('top')) {

        }
        else {
            document.getElementById('pointInfomationNotiry').classList.add('top');
            document.getElementById('pointInfomationNotiry').classList.remove('below');
        }
        document.getElementById('pointInfomationNotiry').innerHTML = html;
        document.getElementById('pointInfomationNotiry').onclick = function () {
            if (mouseClickElementInterviewState.click()) {
                mouseClickElementInterviewState.init();
            }
            else {
                return;
            }
            infomationHtml.hide();
            infomationHtml.target = null;
        }

    },
    hide: function () {
        document.getElementById('pointInfomationNotiry').classList.remove('top');
        document.getElementById('pointInfomationNotiry').classList.remove('below');
        if (document.getElementById('pointInfomationNotiry').classList.contains('below')) {

        }
        else {
            document.getElementById('pointInfomationNotiry').classList.add('below');
        }
    }
};

var saveLine = function () {

    var coordinates = [];
    for (var i = 0; i < editedLine.points.length; i++) {
        coordinates.push({ "Lon": `${getBaiduPositionLon(editedLine.points[i].x)}`, "Lat": `${getBaiduPositionLatWithAccuracy(-editedLine.points[i].z, 0.000001)}` });
    }
    console.log('result', JSON.stringify(coordinates));
    var name = prompt('输入线路名称', '');
    (new DataGet()).addLine(name, JSON.stringify(coordinates));

}


var drawTowerOfPowerLines =
{
    /*
     * 实现了两个功能，
     * 功能A.线路的绘制
     * 功能B.读取绘画
     */

    group: null,
    lineGroup: null,
    tower: null,
    drawLineModel: function () {
        $.getJSON('Javascript/tower.json', '', function (data) {
            console.log('lineData', data);
            drawTowerOfPowerLines.tower = new THREE.Object3D();
            for (var i = 0; i < data.features.length; i++) {
                console.log('lineData', data.features[i].geometry.coordinates[0]);
                console.log('lineData', data.features[i].geometry.coordinates[1]);
                var points = [];
                points.push(new THREE.Vector3(data.features[i].geometry.coordinates[0][0], data.features[i].geometry.coordinates[0][1], data.features[i].geometry.coordinates[0][2]));
                points.push(new THREE.Vector3(data.features[i].geometry.coordinates[1][0], data.features[i].geometry.coordinates[1][1], data.features[i].geometry.coordinates[1][2]));
                var geometry = new THREE.BufferGeometry().setFromPoints(points);
                var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                var line = new THREE.Line(geometry, material);
                drawTowerOfPowerLines.tower.add(line);



            }
            var geometry = new THREE.TorusGeometry(0.018 / 3, 3 * 0.018 / 3, 4, 32);
            //#e07b39
            var material = new THREE.MeshBasicMaterial({ color: 0xe07b39 });
            var material2 = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
            for (var j = 0; j < 10; j++) {
                var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
                torus.position.setX(0.4747);
                torus.position.setY(0);
                torus.position.setZ(3.2943 - 0.018 / 1 * j);
                drawTowerOfPowerLines.tower.add(torus);
            }

            for (var j = 0; j < 10; j++) {
                var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
                torus.position.setX(-0.4747);
                torus.position.setY(0);
                torus.position.setZ(3.2943 - 0.018 / 1 * j);
                drawTowerOfPowerLines.tower.add(torus);
            }
            for (var j = 0; j < 10; j++) {
                var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
                torus.position.setX(0.3298);
                torus.position.setY(0);
                torus.position.setZ(3.2943 + 0.7419 - 0.018 / 1 * j);
                drawTowerOfPowerLines.tower.add(torus);
            }
            for (var j = 0; j < 10; j++) {
                var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
                torus.position.setX(-0.3298);
                torus.position.setY(0);
                torus.position.setZ(3.2943 + 0.7419 - 0.018 / 1 * j);
                drawTowerOfPowerLines.tower.add(torus);
            }
        });
    },
    labelGroup: null,
    cloneTower: function (target, index) {
        var position = [{}, {}, {}, {}, {}, {}, {}, {}];
        var xx = drawTowerOfPowerLines.tower.clone();
        xx.rotateX(-Math.PI / 2);
        xx.rotateZ(Math.PI / 2);
        xx.position.setX(target.x);
        xx.position.setY(0);
        xx.position.setZ(target.z);
        xx.scale.set(0.2, 0.2, 0.2);
        target.index = index;
        xx.customTag = 'point';
        xx.Tag = { 'obj': 'Tower', 'tag': target };
        drawTowerOfPowerLines.group.add(xx);

    },
    startPoint: null,
    drawStartP: function () {
        drawTowerOfPowerLines.startPoint = new THREE.Object3D();
        var geometry = new THREE.TorusGeometry(0.018 / 3, 3 * 0.018 / 3, 4, 32);
        //#e07b39
        var material = new THREE.MeshBasicMaterial({ color: 0xe07b39 });
        var material2 = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        for (var j = 0; j < 10; j++) {
            var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
            torus.position.setX(0.3);
            torus.position.setY(0.3);
            torus.position.setZ(0.018 / 1 * j);
            drawTowerOfPowerLines.startPoint.add(torus);
        }

        for (var j = 0; j < 10; j++) {
            var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
            torus.position.setX(-0.3);
            torus.position.setY(0.3);
            torus.position.setZ(0.018 / 1 * j);
            drawTowerOfPowerLines.startPoint.add(torus);
        }
        for (var j = 0; j < 10; j++) {
            var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
            torus.position.setX(-0.3);
            torus.position.setY(-0.3);
            torus.position.setZ(0.018 / 1 * j);
            drawTowerOfPowerLines.startPoint.add(torus);
        }
        for (var j = 0; j < 10; j++) {
            var torus = new THREE.Mesh(geometry, j == 9 ? material2 : material);
            torus.position.setX(0.3);
            torus.position.setY(-0.3);
            torus.position.setZ(0.018 / 1 * j);
            drawTowerOfPowerLines.startPoint.add(torus);
        }
    },
    cloneStartPoint: function (target) {
        var xx = drawTowerOfPowerLines.startPoint.clone();
        xx.rotateX(-Math.PI / 2);
        xx.position.setX(target.x);
        xx.position.setY(0);
        xx.position.setZ(target.z);
        xx.scale.set(0.2, 0.2, 0.2);
        xx.customTag = 'start';

        drawTowerOfPowerLines.group.add(xx);

    },
    controlPoint: [],
    currentPoint: { x: 0, z: 0 },
    updatePosition: function () {
        var controlPoint = drawTowerOfPowerLines.controlPoint;
        var group = drawTowerOfPowerLines.group;
        var lineGroup = drawTowerOfPowerLines.lineGroup;
        for (var i = 0; i < controlPoint.length; i++) {
            if (i >= group.children.length) {
                if (i == 0) {
                    drawTowerOfPowerLines.cloneStartPoint(controlPoint[i]);
                }
                else {
                    drawTowerOfPowerLines.cloneTower(controlPoint[i]);
                }
            }
        }

        var angles = [];
        var points1 = [];
        if (controlPoint.length > 1) {
            angles.push([controlPoint[1].x - controlPoint[0].x, -controlPoint[1].z + controlPoint[0].z]);
            for (var i = 0; i < controlPoint.length - 1; i++) {
                //var last = [controlPoint[i].x - controlPoint[i - 1].x, -controlPoint[i].z + controlPoint[i - 1].z];
                var current = [controlPoint[i + 1].x - controlPoint[i].x, -controlPoint[i + 1].z + controlPoint[i].z];
                angles.push(current);
            }

            for (var i = 0; i < group.children.length; i++) {
                if (angles[i][0] > 1e-6) {
                    group.children[i].rotation.z = Math.PI / 2 + Math.atan(angles[i][1] / angles[i][0]);
                }
                else if (Math.abs(angles[i][0]) <= 1e-6) {
                    group.children[i].rotation.z = Math.PI / 2 + Math.PI / 2;
                }
                else {
                    group.children[i].rotation.z = Math.PI * 3 / 2 + Math.atan(angles[i][1] / angles[i][0]);
                }
                // group.children[i].rotation.z = (Math.PI / 2 + (angles[i][0] > 0 ? Math.asin(angles[i][1] / angles[i][0]) : (Math.PI + Math.asin(angles[i][1] / angles[i][0]))))%(Math.PI);
                //  group.children[i].(angles[i][0] > 0 ? Math.asin(angles[i][1] / angles[i][0]) : (Math.PI + Math.asin(angles[i][1] / angles[i][0])));
            }



            //angles.push(current); 
        }

        //while (controlPoint.length > group.children.length) {
        //    if (
        //}
        //for (var i = 0; i < controlPoint.length; i++) {

        //}
        //if (drawTowerOfPowerLines.controlPoint.length >= 1) { }
    },
    updateLine: function () {

        var getPointsByTwo = function (vec1, vec2) {
            var points = [];
            points.push(vec1);
            for (var i = 0; i < 32; i++) {
                var vix = vec1.x + (i + 1) * (vec2.x - vec1.x) / 33;
                var viz = vec1.z + (i + 1) * (vec2.z - vec1.z) / 33;
                var delta = 1 - Math.pow(Math.abs(i - 15.5), 2.4) / Math.pow(Math.abs(-1 - 15.5), 2.4);
                var viy = vec1.y - delta * 0.4 * vec1.y;
                points.push(new THREE.Vector3(vix, viy, viz));
            }
            points.push(vec2);
            return points;
        };

        var controlPoint = drawTowerOfPowerLines.controlPoint;
        var group = drawTowerOfPowerLines.group;
        var lineGroup = drawTowerOfPowerLines.lineGroup;

        var angles = [];
        var points1 = [];
        if (controlPoint.length > 1) {
            angles.push([controlPoint[1].x - controlPoint[0].x, -controlPoint[1].z + controlPoint[0].z]);


            for (var i = 1; i < group.children.length; i++) {
                if (lineGroup.children.length < i * 4) {
                    if (i == 1) {
                        var v1 = drawTowerOfPowerLines.group.children[i].children[294].getWorldPosition();
                        var v2 = drawTowerOfPowerLines.group.children[i].children[284].getWorldPosition();
                        var v3 = drawTowerOfPowerLines.group.children[i].children[274].getWorldPosition();
                        var v4 = drawTowerOfPowerLines.group.children[i].children[264].getWorldPosition();

                        var v5 = drawTowerOfPowerLines.group.children[0].children[39].getWorldPosition();
                        var v6 = drawTowerOfPowerLines.group.children[0].children[29].getWorldPosition();
                        var v7 = drawTowerOfPowerLines.group.children[0].children[19].getWorldPosition();
                        var v8 = drawTowerOfPowerLines.group.children[0].children[9].getWorldPosition();

                        {
                            var points = [];
                            points.push(v1);
                            points.push(v5);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v2);
                            points.push(v6);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v3);
                            points.push(v7);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v4);
                            points.push(v8);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                    }
                    else {
                        var v1 = drawTowerOfPowerLines.group.children[i].children[294].getWorldPosition();
                        var v2 = drawTowerOfPowerLines.group.children[i].children[284].getWorldPosition();
                        var v3 = drawTowerOfPowerLines.group.children[i].children[274].getWorldPosition();
                        var v4 = drawTowerOfPowerLines.group.children[i].children[264].getWorldPosition();

                        var v5 = drawTowerOfPowerLines.group.children[i - 1].children[294].getWorldPosition();
                        var v6 = drawTowerOfPowerLines.group.children[i - 1].children[284].getWorldPosition();
                        var v7 = drawTowerOfPowerLines.group.children[i - 1].children[274].getWorldPosition();
                        var v8 = drawTowerOfPowerLines.group.children[i - 1].children[264].getWorldPosition();

                        {
                            var points = [];
                            points = getPointsByTwo(v1, v5);
                            //points.push(v1);
                            //points.push(v5);



                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v2, v6);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v3, v7);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v4, v8);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0xC0C0C0, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                    }
                }
            }

            //angles.push(current); 
        }
    },
    drawLines: function (operateType) {
        //alert('a');
        var that = this;
        var group = drawTowerOfPowerLines.group;
        if (group.children.length == 0) {
            if (operateType == 'show') {
                $.getJSON('Javascript/lineGeometry.json', '', function (data) {
                    //  alert('b');
                    // console.log('获取', data);
                    var group = drawTowerOfPowerLines.group;
                    if (group.children.length == 0) {
                        for (var kk = 0; kk < data.length; kk++) {
                            var controlPoint = data[kk].data;
                            var lineGroup = drawTowerOfPowerLines.lineGroup;
                            var startIndex = group.children.length;
                            for (var i = 0; i < controlPoint.length; i++) {
                                // if (i >= group.children.length)
                                //{
                                if (i == 0) {
                                    that.cloneStartPoint(controlPoint[i]);
                                }
                                else {
                                    that.cloneTower(controlPoint[i], i);
                                }
                                //}
                            }

                            var angles = [];
                            var points1 = [];
                            if (controlPoint.length > 1) {
                                angles.push([controlPoint[1].x - controlPoint[0].x, -controlPoint[1].z + controlPoint[0].z]);
                                for (var i = 0; i < controlPoint.length - 1; i++) {
                                    //var last = [controlPoint[i].x - controlPoint[i - 1].x, -controlPoint[i].z + controlPoint[i - 1].z];
                                    var current = [controlPoint[i + 1].x - controlPoint[i].x, -controlPoint[i + 1].z + controlPoint[i].z];
                                    angles.push(current);
                                }

                                for (var i = startIndex; i < group.children.length; i++) {
                                    if (angles[i - startIndex][0] > 1e-6) {
                                        group.children[i].rotation.z = Math.PI / 2 + Math.atan(angles[i - startIndex][1] / angles[i - startIndex][0]);
                                    }
                                    else if (Math.abs(angles[i - startIndex][0]) <= 1e-6) {
                                        group.children[i].rotation.z = Math.PI / 2 + Math.PI / 2;
                                    }
                                    else {
                                        group.children[i].rotation.z = Math.PI * 3 / 2 + Math.atan(angles[i - startIndex][1] / angles[i - startIndex][0]);
                                    }
                                }



                                //angles.push(current); 
                            }

                            //while (controlPoint.length > group.children.length) {
                            //    if (
                            //}
                            //for (var i = 0; i < controlPoint.length; i++) {

                            //}
                            //if (drawTowerOfPowerLines.controlPoint.length >= 1) { }
                        }
                    }

                    render();
                    drawTowerOfPowerLines.updateLineF2();
                });
            }

        }
        else {
            if (operateType == 'hide') {
                {
                    var opreateGroup = drawTowerOfPowerLines.group;
                    for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                        opreateGroup.remove(opreateGroup.children[i]);
                    }
                }
                {
                    var opreateGroup = drawTowerOfPowerLines.lineGroup;
                    for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                        opreateGroup.remove(opreateGroup.children[i]);
                    }
                }
                {
                    var opreateGroup = this.labelGroup;
                    for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                        opreateGroup.remove(opreateGroup.children[i]);
                    }
                }
            }
        }

    },
    updateLineF2: function () {

        var getPointsByTwo = function (vec1, vec2) {
            var points = [];
            points.push(vec1);
            for (var i = 0; i < 32; i++) {
                var vix = vec1.x + (i + 1) * (vec2.x - vec1.x) / 33;
                var viz = vec1.z + (i + 1) * (vec2.z - vec1.z) / 33;
                var delta = 1 - Math.pow(Math.abs(i - 15.5), 2.4) / Math.pow(Math.abs(-1 - 15.5), 2.4);
                var viy = vec1.y - delta * 0.4 * vec1.y;
                points.push(new THREE.Vector3(vix, viy, viz));
            }
            points.push(vec2);
            return points;
        };

        //var controlPoint = drawTowerOfPowerLines.controlPoint;
        var group = drawTowerOfPowerLines.group;
        var lineGroup = drawTowerOfPowerLines.lineGroup;

        //var angles = [];
        //var points1 = [];
        //if (controlPoint.length > 1)
        {
            //    angles.push([controlPoint[1].x - controlPoint[0].x, -controlPoint[1].z + controlPoint[0].z]);


            for (var i = 1; i < group.children.length; i++) {
                //if (lineGroup.children.length < i * 4)
                {
                    if (drawTowerOfPowerLines.group.children[i - 1].customTag == 'start' && drawTowerOfPowerLines.group.children[i].customTag == 'point') {
                        var v1 = drawTowerOfPowerLines.group.children[i].children[294].getWorldPosition();
                        var v2 = drawTowerOfPowerLines.group.children[i].children[284].getWorldPosition();
                        var v3 = drawTowerOfPowerLines.group.children[i].children[274].getWorldPosition();
                        var v4 = drawTowerOfPowerLines.group.children[i].children[264].getWorldPosition();

                        var v5 = drawTowerOfPowerLines.group.children[i - 1].children[39].getWorldPosition();
                        var v6 = drawTowerOfPowerLines.group.children[i - 1].children[29].getWorldPosition();
                        var v7 = drawTowerOfPowerLines.group.children[i - 1].children[19].getWorldPosition();
                        var v8 = drawTowerOfPowerLines.group.children[i - 1].children[9].getWorldPosition();

                        {
                            var points = [];
                            points.push(v1);
                            points.push(v5);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v2);
                            points.push(v6);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v3);
                            points.push(v7);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points.push(v4);
                            points.push(v8);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                    }
                    else if (drawTowerOfPowerLines.group.children[i - 1].customTag == 'point' && drawTowerOfPowerLines.group.children[i].customTag == 'point') {
                        var v1 = drawTowerOfPowerLines.group.children[i].children[294].getWorldPosition();
                        var v2 = drawTowerOfPowerLines.group.children[i].children[284].getWorldPosition();
                        var v3 = drawTowerOfPowerLines.group.children[i].children[274].getWorldPosition();
                        var v4 = drawTowerOfPowerLines.group.children[i].children[264].getWorldPosition();

                        var v5 = drawTowerOfPowerLines.group.children[i - 1].children[294].getWorldPosition();
                        var v6 = drawTowerOfPowerLines.group.children[i - 1].children[284].getWorldPosition();
                        var v7 = drawTowerOfPowerLines.group.children[i - 1].children[274].getWorldPosition();
                        var v8 = drawTowerOfPowerLines.group.children[i - 1].children[264].getWorldPosition();

                        {
                            var points = [];
                            points = getPointsByTwo(v1, v5);
                            //points.push(v1);
                            //points.push(v5);



                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v2, v6);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v3, v7);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                        {
                            var points = [];
                            points = getPointsByTwo(v4, v8);

                            var geometry = new THREE.BufferGeometry().setFromPoints(points);
                            var material = new THREE.LineBasicMaterial({ color: 0x26229F, linewidth: 4, });
                            var line = new THREE.Line(geometry, material);
                            drawTowerOfPowerLines.lineGroup.add(line);
                        }
                    }
                }
            }

            //angles.push(current); 
        }
    },
    select: function (raycaster) {
        var that = this;
        var minLength = 100000000;
        var selectObj = null;
        var selectType = '';
        if (that.group.children.length > 0) {
            for (var jj = 0; jj < that.group.children.length; jj++) {
                var intersects = raycaster.intersectObjects(that.group.children[jj].children);
                for (var i = 0; i < intersects.length; i++) {


                    if (intersects[i].distance < minLength) {
                        if (intersects[i].object.parent.Tag) {
                            if (intersects[i].object.parent.Tag.obj == 'Tower') {
                                selectObj = intersects[i].object.parent;
                                minLength = intersects[i].distance;
                            }
                        }
                    }
                }
            }

        }
        if (selectObj != null) {
            console.log('selectObj', selectObj);
            this.showLabel(selectObj.Tag.tag);
        }
        else {
            this.clearLabel();
        }
    },
    showLabel: function (tag) {
        var that = this;
        if (that.labelGroup.children.length == 0) {
            var labelDiv = document.createElement('div');
            labelDiv.className = 'labelline';
            var name = tag.index + '#杆塔';
            var heightStr = tag.height + 'm';
            var voltage = tag.voltage;
            labelDiv.innerHTML = `<h3>${name}</h3><div>高度:${heightStr}</div><div>电压:${voltage}</div>`;
            labelDiv.style.marginTop = '-1em';
            // var colorOfCircle = this.dataOfLineLabel[i].colorR;
            //labelDiv.style.borderColor = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            var divLabel = new THREE.CSS2DObject(labelDiv);
            divLabel.position.set(tag.x, 0, tag.z);
            // divLabel.positionTag = [x_m, 0, z_m];
            //divLabel.name = key;
            this.labelGroup.add(divLabel);
        }
        else {
            this.labelGroup.children[0].position.set(tag.x, 0, tag.z);
            var name = tag.index + '#杆塔';
            var heightStr = tag.height + 'm';
            var voltage = tag.voltage;
            drawTowerOfPowerLines.labelGroup.children[0].element.innerHTML = `<h3>${name}</h3><div>高度:${heightStr}</div><div>电压:${voltage}</div>`;
        }
    },
    clearLabel: function () {
        {
            //var opreateGroup = this.labelGroup;
            //for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            //    opreateGroup.remove(opreateGroup.children[i]);
            //}
        }
    }
};
var infoStream =
{
    /*
     * 旺平（旺旺）依据客户文档提出的信息流
     * 旺平要显示数据流
     * 旺平还要显示数据站
     */
    group: null,
    stationGroup: null,
    font: null,
    loader: function () {
        var loader = new THREE.FontLoader();
        loader.load('Javascript/number1or0.json', function (font) {
            var that = infoStream;
            that.font = font;
            that.geometry1 = new THREE.TextGeometry('1', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
            that.geometry0 = new THREE.TextGeometry('0', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
        });
        infoStream.loadStl();
    },
    getData: function () {
        var that = infoStream;
        (new DataGet()).drawInfomationStream(that.show);
    },
    geometry1: null,
    geometry0: null,
    materials: [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ],
    show: function (data) {
        var that = infoStream;
        console.log('数据流', data);

        if (that.group.children.length == 0) {
            for (var i = 0; i < data.length; i++) { //data.length

                var lon = data[i].Longitude;
                var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);

                var textMesh1 = new THREE.Mesh((Math.random() > 0.5 ? that.geometry0 : that.geometry1), that.material);

                textMesh1.position.x = x_m;
                textMesh1.position.y = 0;
                textMesh1.position.z = -z_m;

                textMesh1.rotation.x = 0;
                textMesh1.rotation.y = Math.PI * 2;
                textMesh1.Tag = { x: x_m, z: -z_m };
                that.group.add(textMesh1);
                /*--分割线--*/

            }
        }
        if (that.stationGroup.children.length == 0)
            that.drawStl();
    },
    target: { x: MercatorGetXbyLongitude(112.578703), z: -MercatorGetYbyLatitude(37.868236) },
    update: function () {
        var that = infoStream;
        //var t = Date.now() % 1

        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                var item = opreateGroup.children[i];
                var position = item.Tag;
                var l = Math.sqrt((position.x - that.target.x) * (position.x - that.target.x) + (position.z - that.target.z) * (position.z - that.target.z));
                var timeInterview = l * 500;
                var percent = (Date.now() % timeInterview) / timeInterview;
                item.position.x = position.x + percent * (that.target.x - position.x);
                item.position.z = position.z + percent * (that.target.z - position.z);
                item.position.y = Math.sin((i * 255 + Date.now()) % 2000 / 2000 * Math.PI * 2) / 4 + 0.25;
                //   opreateGroup.remove(opreateGroup.children[i]);
            }
        }
    },
    loadStl: function () {
        {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                infoStream.geometry = geometry;
            });
        }
    },
    geometry: null,
    drawStl: function () {
        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        {
            var material = new THREE.MeshPhongMaterial({ color: 'yellow', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(infoStream.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(4 / 3 * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(infoStream.target.x, 0, infoStream.target.z);
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            //mesh.Tag = { name: data[i] };
            infoStream.stationGroup.add(mesh);
        }
    },
    draw: function (operateType) {
        var that = infoStream;
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = that.stationGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        if (operateType == 'show') {
            that.getData();
        }
    }
}
var resource =
{
    mineralResourcesGroup: null,
    update: function () {
        var loader = new THREE.TextureLoader();
        loader.load(
            objGet.img,
            function (texture) {
                var material = new THREE.MeshLambertMaterial({
                    map: texture
                });
                //  material.depthTest = false;
                material.renderOrder = 0;
                var geometry = new THREE.PlaneGeometry(1, 1);
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(
                    (objGet.x + 0.5) * Math.pow(2, 19 - objGet.z),
                    0,
                    0 - (objGet.y + 0.5) * Math.pow(2, 19 - objGet.z)
                );

                mesh.rotateX(-Math.PI / 2);
                mesh.scale.set(Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z));
                mesh.name = objGet.n;
                mesh.renderOrder = 0;
                mesh.visible = objGet.exit;
                mesh.receiveShadow = true;
                //Math.PI / 2
                if (!mapGroup.getObjectByName(objGet.n))
                    mapGroup.add(mesh);
            }, undefined, function (err) {
                //  console.error('An error happened.');
            })
    },
    isOperating: 0,
    drawMapF: function () {
        var loader = new THREE.TextureLoader();
        this.mineralResourcesGroup.position.set(-6, 0, 62);
        //"Pic/resourceMap.jpg"
        loader.load(
            "Pic/resourceMap.jpg",
            function (texture) {
                var material = new THREE.MeshLambertMaterial({
                    map: texture
                });
                //  material.depthTest = false;
                material.renderOrder = 0;
                var geometry = new THREE.PlaneGeometry(1, 1);
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(
                    0,
                    0,
                    0
                );
                mesh.rotateX(-Math.PI / 2);

                mesh.scale.set(1, 1, 1);
                mesh.position.set(97891.34977523483, 0, -35450.145688);
                mesh.position.set(97891.34977523483, 0, -35450.145688);
                mesh.scale.set(280, 280, 300);
                mesh.renderOrder = 0;
                //   mesh.visible = objGet.exit;
                mesh.receiveShadow = true;
                //Math.PI / 2
                if (resource.mineralResourcesGroup.children.length == 0) {
                    resource.mineralResourcesGroup.add(mesh);
                }

            }, undefined, function (err) {
                //  console.error('An error happened.');
            });
        //localStorage[] = data;
    }
};

var workStream =
{
    /*
     * 杨工提出了工作流
     * 
     * 
     */
    group: null,
    stationGroup: null,
    lineGroup: null,
    objGroup: null,
    font: null,
    loader: function () {
        var loader = new THREE.FontLoader();
        loader.load('Javascript/fuhaoright.json', function (font) {
            var that = workStream;
            that.font = font;
            that.geometry1 = new THREE.TextGeometry('→', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
        });
        //  infoStream.loadStl();
    },
    getData: function () {
        var that = workStream;
        (new DataGet()).drawInfomationStream(that.show);
    },
    geometry1: null,
    //geometry0: null,
    materials: [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ],
    show: function (data) {
        var that = workStream;
        console.log('数据流', data);

        if (that.group.children.length == 0) {
            for (var i = 0; i < data.length; i += 5) { //data.length

                var lon = data[i].Longitude;
                var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);

                var textMesh1 = new THREE.Mesh(that.geometry1);

                textMesh1.position.x = x_m;
                textMesh1.position.y = 0;
                textMesh1.position.z = -z_m;

                //textMesh1.rotation.x = Math.PI / 2;
                //textMesh1.rotation.y = Math.PI / 2;
                // textMesh1.rotation.z = Math.PI / 2;
                var tt = that.target;
                var angle = conmonF.getAgle(textMesh1.position.x - tt.x, -tt.z + textMesh1.position.z, 1, 0);

                textMesh1.rotateX(Math.PI / 2);
                textMesh1.rotateZ(angle);
                textMesh1.Tag = { x: x_m, z: -z_m };
                that.group.add(textMesh1);
                /*--分割线--*/
                var positions = [];
                positions.push(x_m, 0, 0 - z_m);
                positions.push(tt.x, 0, tt.z);
                var geometry = new THREE.LineGeometry();
                geometry.setPositions(positions);
                var material = new THREE.LineMaterial({
                    color: 'yellow',
                    linewidth: 0.003, // in pixels
                    //vertexColors: 0x12f43d,
                    ////resolution:  // to be set by renderer, eventually
                    //dashed: false
                    transparent: true,
                    opacity: 0.4
                });
                var line = new THREE.Line2(geometry, material);
                line.computeLineDistances();
                //  line.Tag = { name: Name, voltage: Voltage, indexV: Code, colorR: color, LineId: LineId, runDate: runDate, index: i };
                line.renderOrder = 99;
                line.scale.set(1, 1, 1);
                //line.rotateX(-Math.PI / 2);
                //that.lineGroup           .add(line_ForSelect);
                that.lineGroup.add(line);
            }
        }

        //if (that.lineGroup.children.length == 0) {
        //    var geometry = new THREE.LineGeometry();
        //    var geometryFromData = coordinates;
        //    var material = new THREE.LineMaterial({
        //        color: color,
        //        linewidth: 0.003, // in pixels
        //        //vertexColors: 0x12f43d,
        //        ////resolution:  // to be set by renderer, eventually
        //        //dashed: false
        //    });

        //}
        //if (that.stationGroup.children.length == 0) { }
        //that.drawStl();
    },
    //112.580038,37.890406
    target: { x: MercatorGetXbyLongitude(112.580038), z: -MercatorGetYbyLatitude(37.890406) },
    update: function () {
        var that = workStream;
        //var t = Date.now() % 1

        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                var item = opreateGroup.children[i];
                var position = item.Tag;
                var l = Math.sqrt((position.x - that.target.x) * (position.x - that.target.x) + (position.z - that.target.z) * (position.z - that.target.z));
                var timeInterview = l * 500;
                var percent = (Date.now() % timeInterview) / timeInterview;

                item.position.x = that.target.x + percent * (position.x - that.target.x);
                item.position.z = that.target.z + percent * (position.z - that.target.z);
                //item.position.y = Math.sin((i * 255 + Date.now()) % 2000 / 2000 * Math.PI * 2) / 4 + 0.25;
                //   opreateGroup.remove(opreateGroup.children[i]);
            }
        }
    },
    loadStl: function () {
        {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                infoStream.geometry = geometry;
            });
        }
    },
    geometry: null,
    drawStl: function () {

        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        {
            var material = new THREE.MeshPhongMaterial({ color: 'yellow', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(infoStream.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(4 / 3 * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(infoStream.target.x, 0, infoStream.target.z);
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            //mesh.Tag = { name: data[i] };
            infoStream.stationGroup.add(mesh);
        }
    },
    draw: function (operateType) {
        var that = workStream;
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = that.objGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = that.lineGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        //{
        //    var opreateGroup = that.stationGroup;
        //    for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
        //        opreateGroup.remove(opreateGroup.children[i]);
        //    }
        //}
        if (operateType == 'show') {
            that.getData();
            that.loadObj();
        }
    },
    loadObj: function () {
        var that = workStream;
        var manager = new THREE.LoadingManager();
        new THREE.MTLLoader(manager)
            .setPath('ObjTag/station/')
            .load('10082_Police Station_V1_L3.mtl', function (materials) {
                materials.preload();
                // materials.depthTest = false;
                new THREE.OBJLoader(manager)
                    .setMaterials(materials)
                    .setPath('ObjTag/station/')
                    .load('10082_Police Station_V1_L3.obj', function (object) {
                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                            if (object.children[iOfO].isMesh) {

                                object.children[iOfO].material.color.r *= 3;
                                object.children[iOfO].material.color.g *= 3;
                                object.children[iOfO].material.color.b *= 3;
                                //for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                //    //  object.children[iOfO].material[mi].depthTest = false;
                                //    object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                //    object.children[iOfO].material[mi].color = new THREE.Color(0, 0,0);
                                //}
                                //object.children[iOfO].material.depthTest = false;
                            }
                        }
                        object.position.y = 0;
                        scene.add(object);
                        object.rotateX(-Math.PI / 2);
                        object.rotateZ(-0.03);

                        var position = { x: that.target.x, y: 0, z: that.target.z };
                        object.position.set(that.target.x, 0, that.target.z);
                        object.scale.set(0.0002, 0.0002, 0.0002);
                        //object.castShadow = true;
                        //object.receiveShadow = true;
                        object.name = 'build2';
                        // object.Tag = { name: '世贸', position: position };
                        object.Tag = { name: '世贸', position: position, id: 'sm' };
                        // object.rotateX(Math.PI / 2);
                        //object.scale.set
                        that.objGroup.add(object);
                    }, function () { }, function () { });
            });
    }
}

var yingjiWeiwen =
{
    group: null,
    initialize: function () {
        this.group = new THREE.Group();
        scene.add(this.group);
    },
    show: function (operateType) {

        var opreateGroup = this.group;
        if (operateType == 'show') {

            if (dataGet.yingjiweiwenData == null) {
                return;
            }
            opreateGroup.visible = true;
            if (opreateGroup.children.length == 0) {
                for (var i = 0; i < dataGet.yingjiweiwenData.gongan.length; i++) {
                    var Longitude = dataGet.yingjiweiwenData.gongan[i].lon;
                    var Latitude = dataGet.yingjiweiwenData.gongan[i].lat;

                    {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';

                        var img = document.createElement('img');
                        img.src = "Pic/iconGongan.png";

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = dataGet.yingjiweiwenData.gongan[i].labelName;;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.polluteenterprise[i];
                        //element.onclick = function () { alert('A'); }

                        var object = new THREE.CSS2DObject(element);


                        var radius = 0.5;
                        var color = 'red';

                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);

                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }

                }
                for (var i = 0; i < dataGet.yingjiweiwenData.shoudianbu.length; i++) {
                    var Longitude = dataGet.yingjiweiwenData.shoudianbu[i].lon;
                    var Latitude = dataGet.yingjiweiwenData.shoudianbu[i].lat;

                    {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';

                        var img = document.createElement('img');
                        img.src = "Pic/iconShoudian.png";

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = dataGet.yingjiweiwenData.shoudianbu[i].labelName;;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.polluteenterprise[i];
                        //element.onclick = function () { alert('A'); }

                        var object = new THREE.CSS2DObject(element);


                        var radius = 0.5;
                        var color = 'red';

                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);

                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }

                }
                for (var i = 0; i < dataGet.yingjiweiwenData.xiaofang.length; i++) {
                    var Longitude = dataGet.yingjiweiwenData.xiaofang[i].lon;
                    var Latitude = dataGet.yingjiweiwenData.xiaofang[i].lat;

                    {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';

                        var img = document.createElement('img');
                        img.src = "Pic/iconXiaofang.png";

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = dataGet.yingjiweiwenData.xiaofang[i].labelName;;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.polluteenterprise[i];
                        //element.onclick = function () { alert('A'); }

                        var object = new THREE.CSS2DObject(element);


                        var radius = 0.5;
                        var color = 'red';

                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);

                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }

                }
                for (var i = 0; i < dataGet.yingjiweiwenData.yingjipinandian.length; i++) {
                    var Longitude = dataGet.yingjiweiwenData.yingjipinandian[i].lon;
                    var Latitude = dataGet.yingjiweiwenData.yingjipinandian[i].lat;

                    {
                        //data = hospitalInfo.Document.Folder.Placemark;
                        var element = document.createElement('div');
                        element.className = 'pointLabelElement cursor';

                        var img = document.createElement('img');
                        img.src = "Pic/yjww.png";

                        var element2 = document.createElement('div');

                        var elementb = document.createElement('b');
                        elementb.innerText = dataGet.yingjiweiwenData.yingjipinandian[i].labelName;;

                        element2.appendChild(elementb);

                        element.appendChild(img);
                        element.appendChild(element2);
                        element.Tag = dataGet.polluteenterprise[i];
                        //element.onclick = function () { alert('A'); }

                        var object = new THREE.CSS2DObject(element);


                        var radius = 0.5;
                        var color = 'red';

                        var lon = Number.parseFloat(Longitude);
                        var lat = Number.parseFloat(Latitude);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);

                        object.position.set(x_m, 0, -z_m);
                        opreateGroup.add(object);
                    }

                }
                //for (var i = 0; i < dataGet.yingjiweiwenData.shoudianbu.length; i += 2) {
                //    var Code = dataGet.polluteenterprise[i].ConsTgId;
                //    var Name = dataGet.polluteenterprise[i].ConsTgName;
                //    var AreaCode = dataGet.polluteenterprise[i].AreaCode;
                //    var Longitude = parseFloat(dataGet.polluteenterprise[i].Longitude);
                //    var Latitude = parseFloat(dataGet.polluteenterprise[i].Latitude);
                //    var Details = dataGet.polluteenterprise[i].Latitude;
                //    // var InterestPointType = dataGet.polluteenterprise[i].InterestPointType;
                //    //var Icon = dataGet.polluteenterprise[i].Icon;
                //    //if (objType == InterestPointType)
                //    {
                //        //data = hospitalInfo.Document.Folder.Placemark;
                //        var element = document.createElement('div');
                //        element.className = 'pointLabelElement cursor';

                //        var img = document.createElement('img');
                //        if (objType == "factory") {
                //            img.src = "Pic/factory.png";
                //        }
                //        else {
                //            return;
                //        }

                //        var element2 = document.createElement('div');

                //        var elementb = document.createElement('b');
                //        elementb.innerText = Name;

                //        element2.appendChild(elementb);

                //        element.appendChild(img);
                //        element.appendChild(element2);
                //        element.Tag = dataGet.polluteenterprise[i];
                //        //element.onclick = function () { alert('A'); }

                //        var object = new THREE.CSS2DObject(element);



                //        // objects.push(object);

                //        // var schoolModel = xingquDianGroup.unit.school.clone();
                //        // console.log('itemData' + i, data[i]);

                //        //var objGroup = xingquDianGroup.unit.hosipital.clone();
                //        var radius = 0.5;
                //        var color = 'red';
                //        //var coordinates = data[i].Point.coordinates.split(',');
                //        //if (coordinates.length != 2) {
                //        //    continue;
                //        //}
                //        var lon = Number.parseFloat(Longitude);
                //        var lat = Number.parseFloat(Latitude);
                //        var x_m = MercatorGetXbyLongitude(lon);
                //        var z_m = MercatorGetYbyLatitude(lat);

                //        // var itemSql = 'insert into taste(p_id,tt_id,lon,lat,t_name) values (1,' + ttid + ',' + lon + ',' + lat + ',"' + data[i].name + '");\r';
                //        //sumSql += itemSql;
                //        if (objType == "factory") {
                //            //var xx = new THREE.Object3D();
                //            //xx.position.set(x_m, 0, -z_m);
                //            //xx.Tag = {};
                //            element.addEventListener('click', function () {

                //                if (mouseClickElementInterviewState.click()) {
                //                    mouseClickElementInterviewState.init();
                //                }
                //                else {
                //                    return;
                //                }
                //                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
                //                top.postMessage(sendMsg, '*');
                //                console.log('iframe外发送信息', sendMsg);
                //            });
                //        }
                //        else if (objType == "environment") {
                //            //var xx = new THREE.Object3D();
                //            //xx.position.set(x_m, 0, -z_m);
                //            //xx.Tag = {};
                //            element.addEventListener('click', function () {
                //                if (mouseClickElementInterviewState.click()) {
                //                    mouseClickElementInterviewState.init();
                //                }
                //                else {
                //                    return;
                //                }
                //                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                //                top.postMessage(sendMsg, '*');
                //                console.log('iframe外发送信息', sendMsg);
                //            });
                //        }

                //        object.position.set(x_m, 0, -z_m);
                //        opreateGroup.add(object);
                //    }
                //    //else {
                //    //    continue;
                //    //}

                //}
                //for (var i = 0; i < dataGet.yingjiweiwenData.xiaofang.length; i += 2) {
                //    var Code = dataGet.polluteenterprise[i].ConsTgId;
                //    var Name = dataGet.polluteenterprise[i].ConsTgName;
                //    var AreaCode = dataGet.polluteenterprise[i].AreaCode;
                //    var Longitude = parseFloat(dataGet.polluteenterprise[i].Longitude);
                //    var Latitude = parseFloat(dataGet.polluteenterprise[i].Latitude);
                //    var Details = dataGet.polluteenterprise[i].Latitude;
                //    // var InterestPointType = dataGet.polluteenterprise[i].InterestPointType;
                //    //var Icon = dataGet.polluteenterprise[i].Icon;
                //    //if (objType == InterestPointType)
                //    {
                //        //data = hospitalInfo.Document.Folder.Placemark;
                //        var element = document.createElement('div');
                //        element.className = 'pointLabelElement cursor';

                //        var img = document.createElement('img');
                //        if (objType == "factory") {
                //            img.src = "Pic/factory.png";
                //        }
                //        else {
                //            return;
                //        }

                //        var element2 = document.createElement('div');

                //        var elementb = document.createElement('b');
                //        elementb.innerText = Name;

                //        element2.appendChild(elementb);

                //        element.appendChild(img);
                //        element.appendChild(element2);
                //        element.Tag = dataGet.polluteenterprise[i];
                //        //element.onclick = function () { alert('A'); }

                //        var object = new THREE.CSS2DObject(element);



                //        // objects.push(object);

                //        // var schoolModel = xingquDianGroup.unit.school.clone();
                //        // console.log('itemData' + i, data[i]);

                //        //var objGroup = xingquDianGroup.unit.hosipital.clone();
                //        var radius = 0.5;
                //        var color = 'red';
                //        //var coordinates = data[i].Point.coordinates.split(',');
                //        //if (coordinates.length != 2) {
                //        //    continue;
                //        //}
                //        var lon = Number.parseFloat(Longitude);
                //        var lat = Number.parseFloat(Latitude);
                //        var x_m = MercatorGetXbyLongitude(lon);
                //        var z_m = MercatorGetYbyLatitude(lat);

                //        // var itemSql = 'insert into taste(p_id,tt_id,lon,lat,t_name) values (1,' + ttid + ',' + lon + ',' + lat + ',"' + data[i].name + '");\r';
                //        //sumSql += itemSql;
                //        if (objType == "factory") {
                //            //var xx = new THREE.Object3D();
                //            //xx.position.set(x_m, 0, -z_m);
                //            //xx.Tag = {};
                //            element.addEventListener('click', function () {

                //                if (mouseClickElementInterviewState.click()) {
                //                    mouseClickElementInterviewState.init();
                //                }
                //                else {
                //                    return;
                //                }
                //                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
                //                top.postMessage(sendMsg, '*');
                //                console.log('iframe外发送信息', sendMsg);
                //            });
                //        }
                //        else if (objType == "environment") {
                //            //var xx = new THREE.Object3D();
                //            //xx.position.set(x_m, 0, -z_m);
                //            //xx.Tag = {};
                //            element.addEventListener('click', function () {
                //                if (mouseClickElementInterviewState.click()) {
                //                    mouseClickElementInterviewState.init();
                //                }
                //                else {
                //                    return;
                //                }
                //                var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
                //                top.postMessage(sendMsg, '*');
                //                console.log('iframe外发送信息', sendMsg);
                //            });
                //        }

                //        object.position.set(x_m, 0, -z_m);
                //        opreateGroup.add(object);
                //    }
                //    //else {
                //    //    continue;
                //    //}

                //}

            }
            else {

            }
        }
        else if (operateType == 'hide') {
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }

        }
    }
}

var pipe =
{
    lableGroup: null,
    select: function (raycaster) {
        var that = this;
        var minLength = 100000000;
        var selectObj = null;
        var selectType = '';
        if (guangouGroup.children.length > 0) {
            var intersects = raycaster.intersectObjects(guangouGroup.children);
            for (var i = 0; i < intersects.length; i++) {


                if (intersects[i].distance < minLength) {
                    selectObj = intersects[i].object;
                    minLength = intersects[i].distance;
                }
            }

        }
        if (selectObj != null) {
            if (raycaster.ray.origin.y > 0.0001) {
                var k = raycaster.ray.origin.y / raycaster.ray.direction.y;
                var newX = raycaster.ray.origin.x - k * raycaster.ray.direction.x;
                var newZ = raycaster.ray.origin.z - k * raycaster.ray.direction.z;
                selectObj.x = newX;
                selectObj.z = newZ;

                console.log('selectObj', selectObj);
                console.log('raycaster', raycaster);
                this.showLabel(selectObj);
            }

        }
        else {
            //
        }
    },
    showLabel: function (selectObj) {
        var that = this;
        if (that.lableGroup.children.length == 0) {
            var labelDiv = document.createElement('div');
            labelDiv.className = 'labelline';
            var name = selectObj.Tag.data.Name;
            var PipeTrenchDiam = selectObj.Tag.data.PipeTrenchDiam.replace('*', '×');
            PipeTrenchType = selectObj.Tag.data.PipeTrenchType == 1 ? "电缆沟" : "隧道";

            labelDiv.innerHTML = `<h3>${name}</h3><div>规格:${PipeTrenchDiam}</div><div>类型:${PipeTrenchType}</div>`;
            labelDiv.style.marginTop = '-1em';
            // var colorOfCircle = this.dataOfLineLabel[i].colorR;
            //labelDiv.style.borderColor = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
            var divLabel = new THREE.CSS2DObject(labelDiv);
            divLabel.position.set(selectObj.x, 0, selectObj.z);
            // divLabel.positionTag = [x_m, 0, z_m];
            //divLabel.name = key;
            pipe.lableGroup.add(divLabel);
        }
        else {
            pipe.lableGroup.children[0].position.set(selectObj.x, 0, selectObj.z);
            var name = selectObj.Tag.data.Name;
            var PipeTrenchDiam = selectObj.Tag.data.PipeTrenchDiam.replace('*', '×');
            PipeTrenchType = selectObj.Tag.data.PipeTrenchType == 1 ? "电缆沟" : "隧道";
            pipe.lableGroup.children[0].element.innerHTML = `<h3>${name}</h3><div>规格:${PipeTrenchDiam}</div><div>类型:${PipeTrenchType}</div>`;
        }
    },
    clear: function () {
        {
            var opreateGroup = guangouGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = pipe.lableGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
    }
}

var wangjia =
{
    group: null,
    labelGroup: null,
    dataOfLineLabel: null,
    initialize: function () {
        this.group = new THREE.Group();
        this.labelGroup = new THREE.Group();
        scene.add(this.group);
        scene.add(this.labelGroup);
        this.dataOfLineLabel = [];
    },
    draw: function (operateType) {
        if (operateType == "show") {
            (new DataGet()).drawLineForWangjia(1);
        }
        else {
            var opreateGroup = this.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
    },
    dataOfLineLabel: null,
    addLabelOfLine: function (selectObj) {
        this.showPeibian = false;
        if (selectObj == null) {
            for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                this.peibianGroup2.remove(this.peibianGroup2.children[i]);
            }
            return;
        }
        else {
            raycaster.setFromCamera(mouse, camera);
            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {
                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
                var labelDiv = document.createElement('div');
                labelDiv.className = 'labelline';
                //var a = 0.1111;
                //a.toFixed(2);
                labelDiv.innerHTML = `<div>${selectObj.Tag.name}</div><div>长度:${selectObj.Tag.LineLength}</div><div>电压:${selectObj.Tag.Voltage}</div>`;

                //  labelDiv. = selectObj.Tag.name;
                labelDiv.style.marginTop = '-1em';
                //   var colorOfCircle = this.dataOfLineLabel[i].colorR;
                labelDiv.style.borderColor = dataGet.lineData[selectObj.Tag.index].Color;
                labelDiv.style.color = dataGet.lineData[selectObj.Tag.index].Color;


                var divLabel = new THREE.CSS2DObject(labelDiv);
                divLabel.position.set(mousePosition.x, 0, mousePosition.z);
                divLabel.positionTag = [mousePosition.x, 0, mousePosition.z];
                //divLabel.name = key;
                this.labelGroup.add(divLabel);


            }
            else {
                //for (var i = this.peibianGroup2.children.length - 1; i >= 0; i--) {
                //    this.peibianGroup2.remove(this.peibianGroup2.children[i]);
                //}
            }

        }
    },
    clearLabelOfLine: function () {
        for (var i = this.labelGroup.children.length - 1; i >= 0; i--) {
            this.labelGroup.remove(this.labelGroup.children[i]);
        }

        //searchCondition.
    },
};


var taiqu =
{
    group: null,
    initialize: function () {
        this.group = new THREE.Group();
        scene.add(this.group);

        this.labelGroup = new THREE.Group();
        scene.add(this.labelGroup);
    },
    draw: function (operateType) {
        if (operateType == "show") {
            (new DataGet()).drawPeibian_IconForwangjia(1);
        }
        else {
            {
                var opreateGroup = this.group;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
            }
            {
                var opreateGroup = this.labelGroup;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
            }
        }
    },
    labelGroup: null,
    drawInfoLabel: function (dataItem) {
        if (this.labelGroup.children.length == 0) {
            var labelDiv = document.createElement('div');
            labelDiv.className = 'labelline';
            //var a = 0.1111;
            //a.toFixed(2);
            labelDiv.innerHTML = `<div style="left:calc(50%);">${dataItem.name}</div><div>倍率:${dataItem.tFactor}</div><div>容量:${dataItem.tgCap}KW</div><div>装电线模式:${dataItem.wiringModeName}</div><div>消息模式:${dataItem.measModeName}</div>`;

            //  labelDiv. = selectObj.Tag.name;
            // labelDiv.style.marginTop = '-1em';
            //   var colorOfCircle = this.dataOfLineLabel[i].colorR;
            //labelDiv.style.borderColor = dataGet.lineData[selectObj.Tag.index].Color;
            //labelDiv.style.color = dataGet.lineData[selectObj.Tag.index].Color;


            var divLabel = new THREE.CSS2DObject(labelDiv);
            divLabel.position.set(MercatorGetXbyLongitude(dataItem.Longitude), 0, -MercatorGetYbyLatitude(dataItem.Latitude));
            // divLabel.positionTag = [mousePosition.x, 0, mousePosition.z];
            //divLabel.name = key;
            this.labelGroup.add(divLabel);
        }
        else {
            this.labelGroup.children[0].position.set(MercatorGetXbyLongitude(dataItem.Longitude), 0, -MercatorGetYbyLatitude(dataItem.Latitude));
        }

    },
    cancleInfoLabel: function () {
        var opreateGroup = this.labelGroup;
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            opreateGroup.remove(opreateGroup.children[i]);
        }
    }
    //var dg = new DataGet();
    //dg.drawPeibian_Icon(dataGet.areaCode);
}

var conmonF = {
    /*
     * x1,y1为目标角，x2，y2位起始角
     */
    getAgle: function (x1, y1, x2, y2) {
        var x = x1 * x2 + y1 * y2;
        var y = x2 * y1 - x1 * y2;
        if (x == 0) {
            if (y > 0) {
                return Math.PI / 2;
            }
            else {
                return -Math.PI / 2;
            }
        }
        else if (x > 0) {
            return (Math.atan(y / x) + Math.PI * 2) % (Math.PI * 2);
        }
        else if (x < 0) {
            return (Math.atan(y / x) + Math.PI * 3) % (Math.PI * 2);
        }
    }
}


var infoStream2 =
{
    /*
     * 旺平（旺旺）依据客户文档提出的信息流
     * 旺平要显示数据流
     * 旺平还要显示数据站
     * 销售要改，他娘的！销售只能是老板的狗？
     */
    group: null,
    stationGroup: null,
    font: null,
    loader: function () {
        //var loader = new THREE.FontLoader();
        //loader.load('Javascript/number1or0.json', function (font) {
        //    var that = infoStream;
        //    that.font = font;
        //    that.geometry1 = new THREE.TextGeometry('1', {
        //        font: that.font,
        //        size: 0.5,
        //        height: 0.01,
        //        curveSegments: 2,
        //        bevelEnabled: true,
        //        bevelThickness: 0.01,
        //        bevelSize: 0,
        //        bevelOffset: 0,
        //        bevelSegments: 1
        //    });
        //    that.geometry0 = new THREE.TextGeometry('0', {
        //        font: that.font,
        //        size: 0.5,
        //        height: 0.01,
        //        curveSegments: 2,
        //        bevelEnabled: true,
        //        bevelThickness: 0.01,
        //        bevelSize: 0,
        //        bevelOffset: 0,
        //        bevelSegments: 1
        //    });
        //});
        infoStream2.loadStl();
    },
    getData: function () {
        var that = infoStream2;
        (new DataGet()).drawInfomationStream(that.show);
    },
    geometry1: new THREE.TorusBufferGeometry(length / 2 / Math.sin(Math.PI / 5), 0.02, 16, 32, Math.PI / 2.5 / 6),
    geometry0: null,
    materialInput: new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 }),
    materialOut: new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 0.7 }),
    show: function (data) {
        var that = infoStream2;
        console.log('数据流', data);

        if (that.group.children.length == 0) {
            for (var i = 0; i < data.length; i++) { //data.length

                var lon = data[i].Longitude;
                var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = -MercatorGetYbyLatitude(lat);

                //var center = { x: (that.target.x + x_m) / 2, z: (z_m + that.target.z) / 2 };

                var length = Math.sqrt((that.target.x - x_m) * (that.target.x - x_m) + (that.target.z - z_m) * (that.target.z - z_m));

                //new THREE.TorusBufferGeometry( 0.2, 0.04, 64, 32 )
                if (length > 0.1) { }
                else {
                    continue;
                }
                var center = { x: (that.target.x + x_m) / 2, y: length / 2 / Math.tan(Math.PI / 5), z: (z_m + that.target.z) / 2 };

                var geometry = new THREE.TorusBufferGeometry(length / 2 / Math.sin(Math.PI / 5), 0.02, 16, 32, Math.PI / 2.5 / 6);
                //     var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 });
                var torus = new THREE.Mesh(geometry, (i % 3 > 1 ? that.materialInput : that.materialOut));
                torus.position.set(center.x, -center.y, center.z);

                var rotate;
                if (x_m == that.target.x) {
                    rotate = Math.PI / 2;
                }
                else {
                    rotate = Math.atan((z_m - that.target.z) / (x_m - that.target.x));
                }
                torus.rotateY(-rotate);

                var vec = new THREE.Vector3(-(z_m - that.target.z), 0, (x_m - that.target.x));

                torus.axixVec = vec.normalize();

                torus.arc = Math.PI / 3 + Math.PI;

                //var obj3D = new THREE.Object3D();
                //obj3D.add(torus);
                //obj3D.position.set(center.x, -center.y, center.z);
                //obj3D.rotateY(-rotate);

                that.group.add(torus);


                // break;

                //that.group.add(textMesh1);
                /*--分割线--*/

            }
        }
        if (that.stationGroup.children.length == 0)
            that.drawStl();
    },
    target: { x: MercatorGetXbyLongitude(112.578703), z: -MercatorGetYbyLatitude(37.868236) },
    update: function () {
        var that = infoStream2;
        //var t = Date.now() % 1

        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                var item = opreateGroup.children[i];
                //var position = item.Tag;
                if (infoStream2.group.children[i].axixVec.z > 0) {

                    infoStream2.group.children[i].rotation.z = (i % 3 > 1 ? 1 : -1) * (Date.now() + i * 1000) % 48000 / 48000 * Math.PI * 2 % (Math.PI * 2);
                    //   infoStream2.group.children[i].rotation.z = Math.PI * 2 - (Date.now() % 6000) / 6000 * Math.PI * 2;
                }
                else {
                    infoStream2.group.children[i].rotation.z = (i % 3 > 1 ? 1 : -1) * (Math.PI * 2 - (Date.now() + i * 1000) % 48000 / 48000 * Math.PI * 2);
                    //  infoStream2.group.children[i].rotation.z = (Date.now() % 6000) / 6000 * Math.PI * 2;
                }
            }
        }
    },
    loadStl: function () {
        {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                infoStream2.geometry = geometry;
            });
        }
    },
    geometry: null,
    drawStl: function () {
        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        {
            var material = new THREE.MeshPhongMaterial({ color: 'yellow', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(infoStream2.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(4 / 3 * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(infoStream2.target.x, 0, infoStream2.target.z);
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            //mesh.Tag = { name: data[i] };
            infoStream2.stationGroup.add(mesh);
        }
    },
    draw: function (operateType) {
        var that = infoStream2;
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = that.stationGroup;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        if (operateType == 'show') {
            that.getData();
        }
    }
}

function rotateAroundWorldAxis(object, axis, radians) {

    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    rotationMatrix.multiplySelf(object.matrix);                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix);
}

var workStream2 =
{
    /*
     * 杨工提出了工作流
     * 
     * 
     */
    data: [
        [{ "x": 97908.67200105808, "z": -35424.44469153676 }, { "x": 97908.57326655518, "z": -35423.70410771765 }, { "x": 97904.40595841168, "z": -35423.63864307712 }, { "x": 97898.47269906064, "z": -35423.196639513415 }, { "x": 97897.37322545682, "z": -35423.007275546785 }, { "x": 97894.88368806159, "z": -35422.78521404336 }, { "x": 97881.81680167314, "z": -35421.750879714964 }, { "x": 97881.51845411678, "z": -35421.88933066291 }, { "x": 97881.51300825091, "z": -35423.528009176356 }, { "x": 97881.50949843254, "z": -35423.71012896466 }, { "x": 97880.3512428424, "z": -35423.70213633407 }, { "x": 97880.28887523829, "z": -35427.82937884403 }, { "x": 97880.56823583593, "z": -35432.3078806018 }, { "x": 97880.69884783804, "z": -35434.54534207598 }, { "x": 97880.74269706268, "z": -35435.80409179242 }, { "x": 97881.13496073049, "z": -35437.791463020796 }, { "x": 97881.28871552489, "z": -35442.11273621808 }, { "x": 97881.56455667937, "z": -35445.9151200805 }, { "x": 97881.72446375612, "z": -35447.8548198903 }, { "x": 97881.90599489088, "z": -35448.1790576401 }, { "x": 97884.18578981137, "z": -35448.22352274432 }, { "x": 97884.24026860856, "z": -35446.8542720645 }],
        [{ "x": 97908.69452754936, "z": -35424.546213819376 }, { "x": 97908.7450065279, "z": -35425.27294210115 }, { "x": 97906.63489738779, "z": -35424.81595591583 }, { "x": 97904.43047575316, "z": -35424.688376391096 }, { "x": 97904.52157371369, "z": -35426.23500649414 }, { "x": 97905.23149215471, "z": -35432.2955482559 }, { "x": 97905.46589910817, "z": -35436.88445749232 }, { "x": 97905.7688901916, "z": -35444.20283776574 }, { "x": 97906.1553343681, "z": -35454.207220810735 }]
    ],
    lengths: [],
    group: null,
    stationGroup: null,
    lineGroup: null,
    objGroup: null,
    font: null,
    loader: function () {
        var loader = new THREE.FontLoader();
        loader.load('Javascript/fuhaoright.json', function (font) {
            var that = workStream;
            that.font = font;
            that.geometry1 = new THREE.TextGeometry('→', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
        });
        //  infoStream.loadStl();
    },
    getData: function () {
        var that = workStream2;
        //(new DataGet()).drawInfomationStream(that.show);
        that.show();
    },
    geometry1: null,
    //geometry0: null,
    materials: [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ],
    startT: 0,
    geometries: [],
    show: function () {
        var that = workStream2;
        //console.log('数据流', data);

        {

            var lengths = [];

            for (var i = 0; i < that.data.length; i++) {
                var points = [];
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);



                var sumLength = 0;
                var divLengths = [];
                for (var j = 1; j < that.data[i].length; j++) {
                    var divLength = Math.sqrt((that.data[i][j].x - that.data[i][j - 1].x) * (that.data[i][j].x - that.data[i][j - 1].x) + (that.data[i][j].z - that.data[i][j - 1].z) * (that.data[i][j].z - that.data[i][j - 1].z));
                    // length +=
                    sumLength += divLength;
                    divLengths.push(divLength);
                }
                lengths.push({ 'sumLength': sumLength, 'divLengths': divLengths });
            }
            that.lengths = lengths;
            that.startT = Date.now();
        }

        //if (that.lineGroup.children.length == 0) {
        //    var geometry = new THREE.LineGeometry();
        //    var geometryFromData = coordinates;
        //    var material = new THREE.LineMaterial({
        //        color: color,
        //        linewidth: 0.003, // in pixels
        //        //vertexColors: 0x12f43d,
        //        ////resolution:  // to be set by renderer, eventually
        //        //dashed: false
        //    });

        //}
        //if (that.stationGroup.children.length == 0) { }
        //that.drawStl();
    },
    //112.580038,37.890406
    target: { x: MercatorGetXbyLongitude(112.580038), z: -MercatorGetYbyLatitude(37.890406) },
    update: function () {

        var that = workStream2;
        if (that.lengths < 1) {
            return;
        }
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.children[i].geometry.dispose();;
                opreateGroup.children[i].material.dispose();;
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        var material = new THREE.LineMaterial({
            color: 'red',
            linewidth: 0.003, // in pixels
            //vertexColors: 0x12f43d,
            ////resolution:  // to be set by renderer, eventually
            //dashed: false
        });

        var opreateGroup = that.group;

        for (var i = 0; i < that.data.length; i++) {
            var inteview = that.lengths[i].sumLength * 500;
            var sumPercent = (Date.now() - that.startT) % inteview / inteview;
            var points = [];
            points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
            var itemLength = 0;
            for (var j = 0; j < that.lengths[i].divLengths.length; j++) {
                var itemPercent = itemLength / that.lengths[i].sumLength;
                var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                if (sumPercent > itemPercentNext) {
                    points.push(that.data[i][j + 1].x, 0.02, that.data[i][j + 1].z);
                }

                else if (sumPercent > itemPercent) {
                    // var itemPercent = itemLength / that.lengths[i].sumLength;
                    // var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                    var percent = (sumPercent - itemPercent) / (itemPercentNext - itemPercent);

                    if (percent <= 1) {
                        // console.log('percent', percent);
                        if (points.length == (j + 1) * 3)
                            points.push(
                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x),
                                0.02,
                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z));
                        else if (points.length == (j + 2) * 3) {
                            points[3 * j + 3] =
                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x);
                            points[3 * j + 5] =
                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z);
                        }
                        else { throw '错误的点数'; }
                    }
                    else continue
                }
                else {
                    continue;
                }
                itemLength += that.lengths[i].divLengths[j];
            }


            var geometry = new THREE.LineGeometry();
            geometry.setPositions(points);

            that.group.add(new THREE.Line2(geometry, material));
            // that.group.children[i].geometry.computeBoundingSphere();
            // that.geometries[i].dispose(); 
            //var geometry = new THREE.LineGeometry();
            //geometry.setPositions(points);
            //that.geometries[i] = geometry;
            //workStream2.group.children[i].geometry = geometry;
            //that.group.children[i].computeLineDistances();
            // enegyStream2.group.children[i] = new THREE.Line2(geometry, material);
            //    enegyStream2.group.children[i].geometry.computeLineDistances();
            //geometry.setPositions(points);
            ////workStream2.group.children[i] = null;
            ////workStream2.group.children[i] = new THREE.Line2(geometry, material);
            //workStream2.group.children[i].computeLineDistances();
        }

        //var operateInteview = Date.now()
        //var opreateGroup = that.group;

        return;
    },
    loadStl: function () {
        {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                infoStream.geometry = geometry;
            });
        }
    },
    geometry: null,
    drawStl: function () {

        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        {
            var material = new THREE.MeshPhongMaterial({ color: 'yellow', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(infoStream.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(4 / 3 * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(infoStream.target.x, 0, infoStream.target.z);
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            //mesh.Tag = { name: data[i] };
            infoStream.stationGroup.add(mesh);
        }
    },
    draw: function (operateType) {
        var that = workStream2;
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.children[i].geometry.dispose();;
                opreateGroup.children[i].material.dispose();;
                opreateGroup.remove(opreateGroup.children[i]);
            }
            that.lengths = [];
            if (operateType == 'show') {
                that.getData();
                //  that.loadObj();
            }
        }
    },
    loadObj: function () {
        var that = workStream2;
        var manager = new THREE.LoadingManager();
        new THREE.MTLLoader(manager)
            .setPath('ObjTag/station/')
            .load('10082_Police Station_V1_L3.mtl', function (materials) {
                materials.preload();
                // materials.depthTest = false;
                new THREE.OBJLoader(manager)
                    .setMaterials(materials)
                    .setPath('ObjTag/station/')
                    .load('10082_Police Station_V1_L3.obj', function (object) {
                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                            if (object.children[iOfO].isMesh) {

                                object.children[iOfO].material.color.r *= 3;
                                object.children[iOfO].material.color.g *= 3;
                                object.children[iOfO].material.color.b *= 3;
                                //for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                //    //  object.children[iOfO].material[mi].depthTest = false;
                                //    object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                //    object.children[iOfO].material[mi].color = new THREE.Color(0, 0,0);
                                //}
                                //object.children[iOfO].material.depthTest = false;
                            }
                        }
                        object.position.y = 0;
                        scene.add(object);
                        object.rotateX(-Math.PI / 2);
                        object.rotateZ(-0.03);

                        var position = { x: that.target.x, y: 0, z: that.target.z };
                        object.position.set(that.target.x, 0, that.target.z);
                        object.scale.set(0.0002, 0.0002, 0.0002);
                        //object.castShadow = true;
                        //object.receiveShadow = true;
                        object.name = 'build2';
                        // object.Tag = { name: '世贸', position: position };
                        object.Tag = { name: '世贸', position: position, id: 'sm' };
                        // object.rotateX(Math.PI / 2);
                        //object.scale.set
                        that.objGroup.add(object);
                    }, function () { }, function () { });
            });
    }
}


var enegyStream2 =
{
    /*
     * 杨工提出了工作流
     * 
     * 
     */
    data: [
        [{ "x": 97863.18195469803, "z": -35565.00966089212 }, { "x": 97863.47464839014, "z": -35562.364466323306 }, { "x": 97880.44564561479, "z": -35556.37931038779 }, { "x": 97899.3275664049, "z": -35556.74759556214 }, { "x": 97914.27937575264, "z": -35550.7639639446 }, { "x": 97924.42346113773, "z": -35545.30944309348 }, { "x": 97922.1560630327, "z": -35532.197602606415 }, { "x": 97928.75165851439, "z": -35512.781263760844 }, { "x": 97932.6530515264, "z": -35502.94862513102 }, { "x": 97939.25438938786, "z": -35480.85016439091 }, { "x": 97944.06354924005, "z": -35469.089455734065 }, { "x": 97943.92299114751, "z": -35454.84327635035 }, { "x": 97951.50579550523, "z": -35445.48723667726 }, { "x": 97950.87494438961, "z": -35437.52593088414 }, { "x": 97937.03327585585, "z": -35436.40384478295 }, { "x": 97919.90268108645, "z": -35435.79577772462 }, { "x": 97920.41037866761, "z": -35424.70599420871 }, { "x": 97919.94069944108, "z": -35424.10565943967 }, { "x": 97911.40538458542, "z": -35423.694136448765 }, { "x": 97909.35568971075, "z": -35424.24475832273 }, { "x": 97908.26747412483, "z": -35424.71637555628 }]
    ],
    initialize: function () {
        this.group = new THREE.Group();
        this.stationGroup = new THREE.Group();
        scene.add(this.group);
        scene.add(this.stationGroup);
    },
    stateOfUpdate: 0,
    lengths: [],
    group: null,
    stationGroup: null,
    lineGroup: null,
    objGroup: null,
    font: null,
    loader: function () {
        var loader = new THREE.FontLoader();
        loader.load('Javascript/fuhaoright.json', function (font) {
            var that = enegyStream2;
            that.font = font;
            that.geometry1 = new THREE.TextGeometry('→', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
        });
        //  infoStream.loadStl();
    },

    geometry1: null,
    //geometry0: null,
    materials: [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ],
    startT: 0,
    show: function () {
        var that = enegyStream2;
        //console.log('数据流', data);

        {

            var lengths = [];

            for (var i = 0; i < that.data.length; i++) {
                var points = [];
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);



                var sumLength = 0;
                var divLengths = [];
                for (var j = 1; j < that.data[i].length; j++) {
                    var divLength = Math.sqrt((that.data[i][j].x - that.data[i][j - 1].x) * (that.data[i][j].x - that.data[i][j - 1].x) + (that.data[i][j].z - that.data[i][j - 1].z) * (that.data[i][j].z - that.data[i][j - 1].z));
                    // length +=
                    sumLength += divLength;
                    divLengths.push(divLength);
                }
                lengths.push({ 'sumLength': sumLength, 'divLengths': divLengths });
            }
            that.lengths = lengths;
            that.startT = Date.now();
        }

        //if (that.lineGroup.children.length == 0) {
        //    var geometry = new THREE.LineGeometry();
        //    var geometryFromData = coordinates;
        //    var material = new THREE.LineMaterial({
        //        color: color,
        //        linewidth: 0.003, // in pixels
        //        //vertexColors: 0x12f43d,
        //        ////resolution:  // to be set by renderer, eventually
        //        //dashed: false
        //    });

        //}
        //if (that.stationGroup.children.length == 0) { }
        //that.drawStl();
    },
    //112.580038,37.890406
    target: { x: MercatorGetXbyLongitude(112.580038), z: -MercatorGetYbyLatitude(37.890406) },
    update: function () {
        switch (this.stateOfUpdate) {
            case 0: { }; break;
            case 1:
                {
                    var material = new THREE.LineMaterial({
                        color: 'white',
                        linewidth: 0.0025, // in pixels
                        //vertexColors: 0x12f43d,
                        ////resolution:  // to be set by renderer, eventually
                        //dashed: false
                    });
                    var that = enegyStream2;
                    var opreateGroup = that.group;
                    {

                        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                            opreateGroup.children[i].geometry.dispose();;
                            opreateGroup.children[i].material.dispose();;
                            opreateGroup.remove(opreateGroup.children[i]);
                        }
                    }


                    {
                        for (var i = 0; i < that.data.length; i++) {
                            var inteview = that.lengths[i].sumLength * 50;
                            if (Date.now() - that.startT > inteview) {
                                that.stateOfUpdate = 2;
                                return;
                            }
                            var sumPercent = (Date.now() - that.startT) % inteview / inteview;
                            var points = [];
                            points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
                            var itemLength = 0;
                            for (var j = 0; j < that.lengths[i].divLengths.length; j++) {
                                var itemPercent = itemLength / that.lengths[i].sumLength;
                                var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                                if (sumPercent > itemPercentNext) {
                                    points.push(that.data[i][j + 1].x, 0.02, that.data[i][j + 1].z);
                                }

                                else if (sumPercent > itemPercent) {
                                    // var itemPercent = itemLength / that.lengths[i].sumLength;
                                    // var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                                    var percent = (sumPercent - itemPercent) / (itemPercentNext - itemPercent);

                                    if (percent <= 1) {
                                        // console.log('percent', percent);
                                        if (points.length == (j + 1) * 3)
                                            points.push(
                                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x),
                                                0.02,
                                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z));
                                        else if (points.length == (j + 2) * 3) {
                                            points[3 * j + 3] =
                                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x);
                                            points[3 * j + 5] =
                                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z);
                                        }
                                        else { throw '错误的点数'; }
                                    }
                                    else continue
                                }
                                else {
                                    continue;
                                }
                                itemLength += that.lengths[i].divLengths[j];
                            }


                            var geometry = new THREE.LineGeometry();
                            geometry.setPositions(points);

                            that.group.add(new THREE.Line2(geometry, material));
                        }

                        return;
                    }
                }; break;
            case 2:
                {
                    var material = new THREE.LineMaterial({
                        color: 'white',
                        linewidth: 0.0025, // in pixels
                        //vertexColors: 0x12f43d,
                        ////resolution:  // to be set by renderer, eventually
                        //dashed: false
                    });
                    var that = enegyStream2;
                    var operateGroup = that.group;
                    if (operateGroup.children.length == 0) {
                        for (var i = 0; i < that.data.length; i++) {
                            var points = [];
                            for (var j = 0; j < that.data[i].length; j++) {
                                points.push(that.data[i][j].x, 0.02, that.data[i][j].z);
                            }
                            var geometry = new THREE.LineGeometry();
                            geometry.setPositions(points);

                            that.group.add(new THREE.Line2(geometry, material));

                        }
                        infoStream2.draw('show');
                        enegyStream3.draw('show');
                        workStream2.draw('show');
                        // that.stateOfUpdate = 3;
                    }
                }; break;
        }
    },
    loadObj: function () {
        {
            var manager = new THREE.LoadingManager();
            new THREE.MTLLoader(manager)
                .setPath('ObjTag/NuclearPower/')
                .load('10078_Nuclear_Power_Plant_v1_L3.mtl', function (materials) {
                    materials.preload();
                    // materials.depthTest = false;
                    new THREE.OBJLoader(manager)
                        .setMaterials(materials)
                        .setPath('ObjTag/NuclearPower/')
                        .load('10078_Nuclear_Power_Plant_v1_L3.obj', function (object) {
                            for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                if (object.children[iOfO].isMesh) {
                                    object.children[iOfO].material
                                    for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                        //object.children[iOfO].material[mi].depthTest = false;
                                        object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                        object.children[iOfO].material[mi].color = new THREE.Color(4, 4, 6);
                                    }
                                }
                            }
                            enegyStream2.geometry1 = object;

                            return;
                            //object.position.y = 0;
                            //scene.add(object);
                            //object.rotateX(-Math.PI / 2);
                            //object.rotateZ(-0.07);
                            //var position = { x: MercatorGetXbyLongitude(112.5782425), y: 0, z: -MercatorGetYbyLatitude(37.87923660278321) };
                            //object.position.set(MercatorGetXbyLongitude(112.5782425), 0, -MercatorGetYbyLatitude(37.87923660278321));
                            //object.scale.set(0.015, 0.015, 0.015);
                            ////object.scale.set(1, 1, 1);
                            ////object.castShadow = true;
                            ////object.receiveShadow = true;
                            //object.name = 'build1';
                            //object.Tag = { name: '省公司', position: position, id: 'sgs' };
                            //object.rotateX(Math.PI / 2);
                            //buildingsGroups.add(object);
                        }, function () { }, function () { });
                });
        }
    },
    geometry: null,
    drawObj: function () {

        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        if (this.stationGroup.children.length == 0) {
            var object = this.geometry1;
            object.position.y = 0;
            //scene.add(object);
            object.rotateX(-Math.PI / 2);
            object.rotateZ(0.9777183079671345 * Math.PI);
            //var position = { x: MercatorGetXbyLongitude(112.5782425), y: 0, z: -MercatorGetYbyLatitude(37.87923660278321) };
            object.position.set(97865.50647280175, 0, -35567.71786265208);
            object.scale.set(0.01, 0.01, 0.01);

            this.stationGroup.add(object);
            enegyStream2.stationGroup.children[0].children[0].material.color = new THREE.Color(1.3, 1.3, 1.3);
        }
    },
    draw: function (operateType) {
        var that = this;
        if (operateType == 'show') {
            that.stateOfUpdate = 1;
            that.show();
            that.drawObj();
        }
        else {
            {
                that.stateOfUpdate = 4;
                var opreateGroup = that.group;
                {

                    for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                        opreateGroup.children[i].geometry.dispose();;
                        opreateGroup.children[i].material.dispose();;
                        opreateGroup.remove(opreateGroup.children[i]);
                    }
                }
            }
            {
                var opreateGroup = that.stationGroup;
                for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                    opreateGroup.remove(opreateGroup.children[i]);
                }
            }
            infoStream2.draw('hide');
            enegyStream3.draw('hide');
            workStream2.draw('hide');
        }
    },
}

var enegyStream3 =
{
    /*
     * 杨工提出了工作流
     * 
     * 
     */
    data: [
        [{ "x": 97908.19045221388, "z": -35425.243548192906 }, { "x": 97909.39764050361, "z": -35425.000167934864 }, { "x": 97909.56541208882, "z": -35426.24201934941 }, { "x": 97910.79248935245, "z": -35426.33038442607 }, { "x": 97911.21769104777, "z": -35426.26543453293 }, { "x": 97911.27340251804, "z": -35425.040674202435 }, { "x": 97916.15154513478, "z": -35425.15545797896 }, { "x": 97915.92233474231, "z": -35424.347973673146 }],
        [{ "x": 97908.19045221388, "z": -35425.243548192906 }, { "x": 97909.31996043306, "z": -35424.93751679204 }, { "x": 97909.54162586457, "z": -35424.85306969143 }, { "x": 97909.49250885619, "z": -35423.94533486322 }, { "x": 97912.78712773138, "z": -35423.86421327997 }],
        [{ "x": 97908.19045221388, "z": -35425.243548192906 }, { "x": 97908.76053467256, "z": -35425.464417459894 }, { "x": 97908.81457548289, "z": -35427.01596992099 }, { "x": 97911.06724047095, "z": -35426.71742302896 }],
        [{ "x": 97908.19045221388, "z": -35425.243548192906 }, { "x": 97909.5222900075, "z": -35425.26246876835 }, { "x": 97909.44413079204, "z": -35426.46052507437 }, { "x": 97909.03559922245, "z": -35430.49549933066 }, { "x": 97910.00890979184, "z": -35431.088903495176 }, { "x": 97910.029513092, "z": -35434.08620398936 }, { "x": 97911.1429512231, "z": -35433.67168785454 }]
    ],
    initialize: function () {
        this.group = new THREE.Group();
        this.buildingGroup = new THREE.Group();
        //  this.buildingGroup
        scene.add(this.group);
        scene.add(this.buildingGroup);
    },
    lengths: [],
    group: null,
    buildingGroup: null,
    font: null,
    loader: function () {
        var loader = new THREE.FontLoader();
        loader.load('Javascript/fuhaoright.json', function (font) {
            var that = workStream;
            that.font = font;
            that.geometry1 = new THREE.TextGeometry('→', {
                font: that.font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 1
            });
        });
        //  infoStream.loadStl();
    },
    getData: function () {
        var that = workStream2;
        //(new DataGet()).drawInfomationStream(that.show);
        that.show();
    },
    geometry1: null,
    //geometry0: null,
    materials: [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ],
    startT: 0,
    geometries: [],
    show: function () {
        var that = enegyStream3;
        //console.log('数据流', data);

        {

            var lengths = [];

            for (var i = 0; i < that.data.length; i++) {
                var points = [];
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
                points.push(that.data[i][0].x, 0.02, that.data[i][0].z);



                var sumLength = 0;
                var divLengths = [];
                for (var j = 1; j < that.data[i].length; j++) {
                    var divLength = Math.sqrt((that.data[i][j].x - that.data[i][j - 1].x) * (that.data[i][j].x - that.data[i][j - 1].x) + (that.data[i][j].z - that.data[i][j - 1].z) * (that.data[i][j].z - that.data[i][j - 1].z));
                    // length +=
                    sumLength += divLength;
                    divLengths.push(divLength);
                }
                lengths.push({ 'sumLength': sumLength, 'divLengths': divLengths });
            }
            that.lengths = lengths;
            that.startT = Date.now();
        }

        //if (that.lineGroup.children.length == 0) {
        //    var geometry = new THREE.LineGeometry();
        //    var geometryFromData = coordinates;
        //    var material = new THREE.LineMaterial({
        //        color: color,
        //        linewidth: 0.003, // in pixels
        //        //vertexColors: 0x12f43d,
        //        ////resolution:  // to be set by renderer, eventually
        //        //dashed: false
        //    });

        //}
        //if (that.stationGroup.children.length == 0) { }
        //that.drawStl();
    },
    //112.580038,37.890406

    update: function () {

        var that = enegyStream3;
        if (that.lengths < 1) {
            return;
        }
        {
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.children[i].geometry.dispose();;
                opreateGroup.children[i].material.dispose();;
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        var material = new THREE.LineMaterial({
            color: 'white',
            linewidth: 0.002, // in pixels
            //vertexColors: 0x12f43d,
            ////resolution:  // to be set by renderer, eventually
            //dashed: false
        });

        var opreateGroup = that.group;

        for (var i = 0; i < that.data.length; i++) {
            var inteview = that.lengths[i].sumLength * 500;
            var sumPercent = (Date.now() - that.startT) % inteview / inteview;
            var points = [];
            points.push(that.data[i][0].x, 0.02, that.data[i][0].z);
            var itemLength = 0;
            for (var j = 0; j < that.lengths[i].divLengths.length; j++) {
                var itemPercent = itemLength / that.lengths[i].sumLength;
                var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                if (sumPercent > itemPercentNext) {
                    points.push(that.data[i][j + 1].x, 0.02, that.data[i][j + 1].z);
                }

                else if (sumPercent > itemPercent) {
                    // var itemPercent = itemLength / that.lengths[i].sumLength;
                    // var itemPercentNext = itemPercent + that.lengths[i].divLengths[j] / that.lengths[i].sumLength;
                    var percent = (sumPercent - itemPercent) / (itemPercentNext - itemPercent);

                    if (percent <= 1) {
                        // console.log('percent', percent);
                        if (points.length == (j + 1) * 3)
                            points.push(
                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x),
                                0.02,
                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z));
                        else if (points.length == (j + 2) * 3) {
                            points[3 * j + 3] =
                                that.data[i][j].x + percent * (that.data[i][j + 1].x - that.data[i][j].x);
                            points[3 * j + 5] =
                                that.data[i][j].z + percent * (that.data[i][j + 1].z - that.data[i][j].z);
                        }
                        else { throw '错误的点数'; }
                    }
                    else continue
                }
                else {
                    continue;
                }
                itemLength += that.lengths[i].divLengths[j];
            }


            var geometry = new THREE.LineGeometry();
            geometry.setPositions(points);

            that.group.add(new THREE.Line2(geometry, material));
            // that.group.children[i].geometry.computeBoundingSphere();
            // that.geometries[i].dispose(); 
            //var geometry = new THREE.LineGeometry();
            //geometry.setPositions(points);
            //that.geometries[i] = geometry;
            //workStream2.group.children[i].geometry = geometry;
            //that.group.children[i].computeLineDistances();
            // enegyStream2.group.children[i] = new THREE.Line2(geometry, material);
            //    enegyStream2.group.children[i].geometry.computeLineDistances();
            //geometry.setPositions(points);
            ////workStream2.group.children[i] = null;
            ////workStream2.group.children[i] = new THREE.Line2(geometry, material);
            //workStream2.group.children[i].computeLineDistances();
        }

        //var operateInteview = Date.now()
        //var opreateGroup = that.group;

        return;
    },
    loadStl: function () {
        {
            var loader = new THREE.STLLoader();
            loader.load('Stl/peidianzhan.stl', function (geometry) {
                infoStream.geometry = geometry;
            });
        }
    },
    geometry: null,
    drawStl: function () {

        //  console.log('data', data);
        //  var data
        //for (var i = 0; i < data.length; i++)
        {
            var material = new THREE.MeshPhongMaterial({ color: 'yellow', specular: 'red', shininess: 200 });
            var mesh = new THREE.Mesh(infoStream.geometry, material);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(4 / 3 * 2 * Math.PI);
            // var position = { x: MercatorGetXbyLongitude(data[i].Longitude), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
            mesh.position.set(infoStream.target.x, 0, infoStream.target.z);
            //mesh.position.set(0, 0, 0 );
            // mesh.rotation.set(-Math.PI / 2, 0, 0);
            //mesh.rotateX(-Math.PI / 2);
            mesh.scale.set(0.9, 0.9, 0.9);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.name = data[i].name;
            //mesh.Tag = { name: data[i] };
            infoStream.stationGroup.add(mesh);
        }
    },
    draw: function (operateType) {
        var that = enegyStream3;
        {
            that.lengths = [];
            var opreateGroup = that.group;
            for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
                opreateGroup.children[i].geometry.dispose();;
                opreateGroup.children[i].material.dispose();;
                opreateGroup.remove(opreateGroup.children[i]);
            }
        }
        {
            var opreateGroup = that.buildingGroup;

            opreateGroup.visible = false;
        }
        if (operateType == 'show') {
            that.show();
            that.loadObj();
        }
    },
    loadObj: function () {
        var that = this;
        var drawCityF = function (object, index, x, z, r, g, b, scaleX, scaleY, scaleZ) {
            index = index % object.children.length
            var itemObj = object.children[index].clone();

            var m = object.children[index].material.clone();
            itemObj.material = m;

            itemObj.material.side = THREE.DoubleSide;
            itemObj.material.color = new THREE.Color(r, g, b);
            itemObj.position.y = 0;
            // scene.add(object);



            var position = { x: x, y: 0.001, z: z };
            itemObj.position.set(x, 0.001, z);
            itemObj.scale.set(scaleX, scaleY, scaleZ);
            itemObj.castShadow = true;
            //object.receiveShadow = true;
            itemObj.name = 'city';
            itemObj.Tag = { name: '', position: position, id: 'citybuilding' };
            that.buildingGroup.add(itemObj);
        }

        {
            that.buildingGroup.visible = true;
            if (that.buildingGroup.children.length == 0) {


                that.buildingGroup.position.x = 0.4;
                that.buildingGroup.position.z = -0.65;

                {
                    var manager = new THREE.LoadingManager();


                    new THREE.MTLLoader(manager)
                        .setPath('ObjTag/buildcity/')
                        .load('b2.mtl', function (materials) {
                            materials.preload();
                            // materials.depthTest = false;
                            new THREE.OBJLoader(manager)
                                .setMaterials(materials)
                                .setPath('ObjTag/buildcity/')
                                .load('b2.obj', function (object) {
                                    drawCityF(object, 9, 97909.44897001376, -35425.79941920087, 1.6, 1.4, 1.8, 0.004132149999999998, 0.002, 0.0006999999999999999);
                                    drawCityF(object, 10, 97903.59897001377, -35423.249419200874, 2, 0.7, 1, 0.004132149999999998, 0.002, 0.0006999999999999999);

                                    drawCityF(object, 12, 97921.89897001379, -35423.54941920087, 2, 0.7, 1, 0.003, 0.002, 0.002);

                                    drawCityF(object, 15, 97911.69897001372, -35430.44941920086, 2, 0.7, 1, 0.002, 0.0015, 0.002);

                                    drawCityF(object, 18, 97911.59897001371, -35433.03941920086, 1, 1.7, 1, 0.002, 0.0015, 0.002);
                                    //  drawCityF(object, 13, 97901.59897001377, -35423.249419200874, 2, 0.7, 1, 0.004132149999999998, 0.002, 0.0006999999999999999);
                                }, function () { }, function () { });
                        });
                }




            }
            else {
            }
        }
    }
}







