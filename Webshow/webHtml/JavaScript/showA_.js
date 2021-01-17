//var ImageBitmap = function () { };
var runFromNginx = true;
var aa = function () {
    return "showA Page:hello world!";
}
var setMap = function (t) {
    setIntensity(0.5);
    if (t == 'e') {
        mercatoCenter.zoom = -10;
        constMapt = 'e';
        updateMap();
    }
    else if (t == 'm') {
        mercatoCenter.zoom = -10;
        constMapt = 'm';
        updateMap();
    }
    else if (t == 'r') {
        // setIntensity(0.5);
        mercatoCenter.zoom = -10;
        constMapt = 'r';
        updateMap();
    }
    else if (t == 'y2017') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2017';
        updateMap();
    }
    else if (t == 'y2014') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2014';
        updateMap();
    }
    else if (t == 'y2011') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2011';
        updateMap();
    }
    else if (t == 'y2003') {
        mercatoCenter.zoom = -10;
        constMapt = 'y2003';
        updateMap();
    }
}

var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var centerPosition = { lon: 112.573463, lat: 37.891474 };
var mercatoCenter = { x: 0, zValue: 0, zoom: 0 };
if (WEBGL.isWebGLAvailable() === false) {

    document.body.appendChild(WEBGL.getWebGLErrorMessage());

}

var camera, controls, scene, renderer, labelRenderer, cssLabelRenderer, scene1, scene2;
//sceneMap mapRendersceneMap
var axesHelper;
var mesh;
var mapGroup, boundryGroup, peibianGroup, tongxin5GMapGroup, regionBlockGroup,
    lineGroup, lineLabelGroup,
    biandiansuoGroup, buildingsGroups, measureLengthGroup, measureAreaGroup, guangouGroup, chaoliufenxiGroup, chaoliufenxiGroup2, chaoliufenxiGroup3, chaoliufenxiGroup4, chaoliufenxiGroup5,
    songdianquGroup, xingquDianGroup;
var chaoliufenxiGroupCount = 10;
var chaoliuFenxiData = [];
var mapGroupData = {};
var light1, light2, light3, light4;
var constMapt = 'e';
//init();
////render(); // remove when using next line for animation loop (requestAnimationFrame)
//animate();
var raycaster;
var mouse;

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
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7c9dd4);
    scene.fog = new THREE.FogExp2(0x7c9dd4, 0.002);

    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('Pic/');
    var cubeTexture = cubeTextureLoader.load([
					"px.jpg", "nx.jpg",
					"py.jpg", "ny.jpg",
					"pz.jpg", "nz.jpg"
    ]);
    scene.background = cubeTexture;
    //scene1 = new THREE.Scene();
    //scene1.background = new THREE.Color(0x7c9dd4);
    //scene1.fog = new THREE.FogExp2(0x7c9dd4, 0.002);

    //scene2 = new THREE.Scene();
    //scene2.background = new THREE.Color(0x7c9dd4);
    //scene2.fog = new THREE.FogExp2(0x7c9dd4, 0.002);

    //mapRender = new THREE.WebGLRenderer({ antialias: true });
    //mapRender.setPixelRatio(window.devicePixelRatio);
    //mapRender.setSize(window.innerWidth, window.innerHeight);
    //mapRender.domElement.className = 'renderMap';
    //document.getElementById('mainC').appendChild(mapRender.domElement);

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

    cssLabelRenderer = new THREE.CSS3DRenderer();
    cssLabelRenderer.setSize(window.innerWidth, window.innerHeight);
    cssLabelRenderer.domElement.className = 'labelRenderer';
    document.getElementById('mainC').appendChild(cssLabelRenderer.domElement);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.0001, 1000);
    camera.position.set(4000, 2000, 0);
    camera.position.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));

    // controls

    controls = new THREE.OrbitControls(camera, cssLabelRenderer.domElement);
    controls.center.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));


    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    axesHelper = new THREE.AxesHelper(265);
    axesHelper.position.set(MercatorGetXbyLongitude(centerPosition.lon), 0, -MercatorGetYbyLatitude(centerPosition.lat));
    //scene.add(axesHelper);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;

    controls.minDistance = 6;
    controls.maxDistance = 96;


    controls.maxPolarAngle = Math.PI / 2 - Math.PI / 6;
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

    lineGroup = new THREE.Group();
    scene.add(lineGroup);

    lineLabelGroup = new THREE.Group();
    scene.add(lineLabelGroup);

    biandiansuoGroup = new THREE.Group();
    scene.add(biandiansuoGroup);

    buildingsGroups = new THREE.Group();
    scene.add(buildingsGroups);
    //buildingsGroups.onBeforeRender = function () { renderer.clearDepth(); }

    measureLengthGroup = new THREE.Group();
    scene.add(measureLengthGroup);

    measureAreaGroup = new THREE.Group();
    scene.add(measureAreaGroup);

    guangouGroup = new THREE.Group();
    scene.add(guangouGroup);

    chaoliufenxiGroup = [];

    for (var i = 0; i < chaoliufenxiGroupCount; i++) {
        var g = new THREE.Group();
        chaoliufenxiGroup.push(g);
        chaoliuFenxiData.push([]);
        scene.add(g);
    }
    songdianquGroup = new THREE.Group();
    scene.add(songdianquGroup);


    //var schoolGroup = new THREE.Group();
    //var hosipitalGroup = new THREE.Group();
    xingquDianGroup = {
        school: new THREE.Group(),
        hosipital: new THREE.Group(),
        shop: new THREE.Group(),
        unit: { school: null, hosipital: null }
    };

    scene.add(xingquDianGroup.school);
    scene.add(xingquDianGroup.hosipital);
    scene.add(xingquDianGroup.shop);

    

    {
        var measureGeometry = new THREE.Geometry();
        measureGeometry.vertices.push(new THREE.Vector3(0, 0.01, 0));
        measureGeometry.vertices.push(new THREE.Vector3(1, 0.01, 0));
        var measurematerial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 10,
            side: THREE.DoubleSide,
        });
        var measureLine = new THREE.Line(measureGeometry, measurematerial);
        measureLengthGroup.add(measureLine);


        measureLengthObj.measureLineDiv = document.createElement('div');
        measureLengthObj.measureLineDiv.className = 'label';
        measureLengthObj.measureLineDiv.textContent = 'Earth';
        measureLengthObj.measureLineDiv.style.marginTop = '-1em';
        measureLengthObj.measureLineDivLabel = new THREE.CSS2DObject(measureLengthObj.measureLineDiv);
        measureLengthObj.measureLineDivLabel.position.set(0, 0, 0);
        measureLengthGroup.add(measureLengthObj.measureLineDivLabel);
    }
    {
        measureAreaObj.measureAreaDiv = document.createElement('div');
        measureAreaObj.measureAreaDiv.className = 'label';
        measureAreaObj.measureAreaDiv.textContent = 'Earth';
        measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
        measureAreaObj.measureAreaDivLabel = new THREE.CSS2DObject(measureAreaObj.measureAreaDiv);
        measureAreaObj.measureAreaDivLabel.position.set(0, 0, 0);
        measureAreaGroup.add(measureAreaObj.measureAreaDivLabel);
    }
    var geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    for (var i = 0; i < 500; i++) { 

    }

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
    raycaster.linePrecision = 10;

    mouse = new THREE.Vector2();
    //window.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onDocumentClick);
    //document.addEventListener('contextmenu', onDocumentRightClick);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
     
 
     

    mapGroup.renderOrder = 0;
    boundryGroup.renderOrder = 9;
    lineGroup.renderOrder = 9;
    biandiansuoGroup.renderOrder = 9;
    peibianGroup.renderOrder = 9;
    tongxin5GMapGroup.renderOrder = 9;
    regionBlockGroup.renderOrder = 9;
    buildingsGroups.renderer = 10;

    var ws = new WebSocket('ws://127.0.0.1:9760/websocket');
    ws.onopen = function (event) {
         
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log("数据已接收...", received_msg);
    };
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
}

function onDocumentClick(event) {
    if (clickState == 'objClick') {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //alert(mouse.x + ',' + mouse.y);
        raycaster.setFromCamera(mouse, camera);
        var minLength = 100000000;
        var selectObj = null;
        var selectType = '';
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
        if (lineGroup.visible) {
            var checkObjs = [];
            for (var i = 0; i < lineGroup.children.length; i++) {
                if (lineGroup.children[i].type == 'Line') {
                    checkObjs.push(lineGroup.children[i]);
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
        if (biandiansuoGroup.visible) {
            var intersects = raycaster.intersectObjects(biandiansuoGroup.children);
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

        if (selectObj != null) {
            //{command:'showInformation', selectType: 'peibian', Tag: selectObj.Tag }
            var sendMsg = JSON.stringify({ command: 'showInformation', selectType: selectType, Tag: selectObj.Tag })
            top.postMessage(sendMsg, '*');
            console.log('iframe外发送信息', sendMsg);
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
}

var mouse = new THREE.Vector2();
function onDocumentMouseMove(event) {
    if (clickState == 'lengthMeasure') {
        //   event.preventDefault();
        //if (measureLengthGroup.visible) { }
        //else
        //{
        //    measureLengthGroup.visible = true;
        //}
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
    else {
        //if (measureLengthGroup.visible) {
        //    measureLengthGroup.visible = false;
        //}
        //else {

        //}
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
                measureLengthGroup.children[0].position.set(measureLengthObj.start.x, 0.01, -measureLengthObj.start.y);

                //measureLengthGroup.children[0].geometry.vertices[0].x = xfloat;
                //measureLengthGroup.children[0].geometry.vertices[0].y = 1;
                //measureLengthGroup.children[0].geometry.vertices[0].z = -yfloat;
                // measureLengthGroup.children[0].start = new THREE.Vector3(xfloat, 0, -);
            }
            {
                var scale = Math.sqrt((measureLengthObj.start.x - measureLengthObj.end.x) * (measureLengthObj.start.x - measureLengthObj.end.x) + (measureLengthObj.start.y - measureLengthObj.end.y) * (measureLengthObj.start.y - measureLengthObj.end.y));
                //var xfloat = MercatorGetXbyLongitude(measureLengthObj.end.lon);
                //var yfloat = MercatorGetYbyLatitude(measureLengthObj.end.lat);
                measureLengthGroup.children[0].scale.set(scale, scale, scale);
                // vertices.push(xfloat, 0, -yfloat);

                if (scale > 0) {
                    var deltaY = measureLengthObj.start.y - measureLengthObj.end.y;
                    var angleY = measureLengthObj.getAngleF(measureLengthObj.start.x, measureLengthObj.start.y, measureLengthObj.end.x, measureLengthObj.end.y);
                    //measureLengthGroup.children[0].rotateY(angleY);
                    measureLengthGroup.children[0].rotation.set(0, angleY, 0);
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
                var areaStr = Math.abs((Math.round(area / 1000) / 10)) + '公顷';
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
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //  mapRender.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);

    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    cssLabelRenderer.setSize(window.innerWidth, window.innerHeight);
}

var doC = true;
function animate() {
    if (doC) {
        requestAnimationFrame(animate);

        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
        updatePlaneLineScale();
        updateMap();

        updateScale();

        //updateBoundryLine();
        updateLineMeasure();

        animateChaoliuFenxi();
        //mapRender.render(sceneMap, camera);
        render();
        labelRenderer.render(scene, camera);
        cssLabelRenderer.render(scene, camera);
        //updateMap();
    }
}

function render() {
    //renderer.render(sceneMap, camera);
    //mapRender.render(sceneMap, camera);
    //renderer.clear();
    //renderer.clearDepth();
    renderer.clear();
    renderer.render(scene, camera);
    //renderer.clearDepth();
    //renderer.render(scene2, camera);

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

            //  mesh.rotateX(-Math.PI / 2);
            //mesh.scale.set(Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z), Math.pow(2, 19 - objGet.z));

            mesh.name = 'eall19';
            mapGroup.add(mesh);
            //Math.PI / 2
            //if (!mapGroup.getObjectByName(objGet.n))
            //    mapGroup.add(mesh);
        }, undefined, function (err) {
            console.error('An error happened.');
        });
}
var namesShouldShow = [];
function updateMap() {
    if (Math.abs(timeRocord - Date.now()) >= 0) {
        timeRocord = Date.now();
        if (updateMapContinue) {
            if (true) {
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
                camera.near = l / 20;
                camera.far = l * 5;

                updateXingquDianGroup(l);
                //console.log('zoom', zoom);
                var x = controls.target.x / Math.pow(2, 19 - zoom);;
                var zValue = controls.target.z / Math.pow(2, 19 - zoom);
                lineGroup.scale.set(1, l / 50, 1);
                biandiansuoGroup.scale.set(1, l / 50, 1);

                //light1.target.position.set(controls.target.x, controls.target.y, controls.target.z);
                //light2.target.position.set(controls.target.x, controls.target.y, controls.target.z);
                //light3.target.position.set(controls.target.x, controls.target.y, controls.target.z);
                //light4.target.position.set(controls.target.x, controls.target.y, controls.target.z);

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
                            //$.get("http://localhost:2023/DAL/MapImage.ashx?x=10&y=3&z=6", function (data, status) {
                            //    alert("Data: " + data + "nStatus: " + status);
                            //});
                            //var id = 'm' + i + '_' + j + '_' + z;
                            idsShouldShow.push({ x: i, y: j, z: z, t: constMapt });
                            namesShouldShow.push(constMapt + '_' + i + '_' + j + '_' + z);
                        }
                    }
                    //console.log('idsShouldShow', idsShouldShow);

                    var drawMapF = function (data, setSession) {
                        if (data == 'no') { return false };
                        var objGet;
                        if (setSession) objGet = JSON.parse(data);
                        else objGet = data;

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
                                    //Math.PI / 2
                                    if (!mapGroup.getObjectByName(objGet.n))
                                        mapGroup.add(mesh);
                                }, undefined, function (err) {
                                    console.error('An error happened.');
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
                        //var x = idsShouldShow[i].x;
                        //var y = idsShouldShow[i].y;
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
                                        else
                                        {
                                            mapGroupData[name] = JSON.stringify({ "img": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAASdFESAAQAAAABAAASdAAAAAAAAYagAACxj//bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APf6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z", "x": xValue, "y": yValue, "z": zValue, "t": tValue, "n": name, "exit": false });
                                        }
                                    });
                                }
                                if (idsShouldShow[i].t == 'y2003' || idsShouldShow[i].t == 'y2011' || idsShouldShow[i].t == 'y2014' || idsShouldShow[i].t == 'y2017' || idsShouldShow[i].t == 'r') {
                                    //y201797957_35474_19
                                    $.get('MapPathText/' + idsShouldShow[i].t + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z + '.txt', idsShouldShow[i], function (data, status) {
                                        //alert("Data: " + data + "nStatus: " + status);
                                        if (drawMapF(data, true)) { }
                                        else
                                        {
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
                        updateLabelOfLine();
                    }
                    else {
                        clearLabelOfLine();
                    }
                    // 

                }
                else {
                    //console.log('计算值', (mercatoCenter.zoom - zoom) * (mercatoCenter.zoom - zoom) + (mercatoCenter.zValue - zValue) * (mercatoCenter.zValue - zValue) + (mercatoCenter.x - x) * (mercatoCenter.x - x));
                }
            }
            if (false) {
                //mapTexture.needsUpdate = true;
                var lOld = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));


                var zoomOld = Math.round(21.5 - Math.log2(lOld));
                if (zoomOld > 19) {
                    zoomOld = 19;
                }
                else if (zoomOld < 10) {
                    zoomOld = 10;
                }
                var x = controls.target.x / Math.pow(2, 19 - zoomOld);;
                var zValue = controls.target.z / Math.pow(2, 19 - zoomOld);
                if ((mercatoCenter.zoom - zoomOld) * (mercatoCenter.zoom - zoomOld) + (mercatoCenter.zValue - zValue) * (mercatoCenter.zValue - zValue) + (mercatoCenter.x - x) * (mercatoCenter.x - x) > 1) {
                    mercatoCenter.x = x;
                    mercatoCenter.zValue = zValue;
                    mercatoCenter.zoom = zoomOld;
                    var planePositonXOld = (Math.round(controls.target.x) >> (19 - zoomOld)) * Math.pow(2, 19 - zoomOld);
                    var planePositonZOld = -(Math.round(-controls.target.z) >> (19 - zoomOld)) * Math.pow(2, 19 - zoomOld);

                    var indexXOld = (Math.round(controls.target.x) >> (19 - zoomOld));
                    var indexZOld = (Math.round(-controls.target.z) >> (19 - zoomOld));


                    //console.log('zoom', zoom);
                    //var x = controls.target.x / Math.pow(2, 19 - zoom);;
                    //var zValue = controls.target.z / Math.pow(2, 19 - zoom);
                    mapMesh.position.set(planePositonXOld, 0, planePositonZOld);
                    mapMesh.scale.set(Math.pow(2, 19 - zoomOld) / mapScale, Math.pow(2, 19 - zoomOld) / mapScale, Math.pow(2, 19 - zoomOld) / mapScale);

                    var idsShouldShow = [];
                    var namesShouldShow = [];
                    for (var i = indexXOld - 7; i < indexXOld + 7; i++) {
                        for (var j = indexZOld - 7; j < indexZOld + 7; j++) {
                            idsShouldShow.push({ x: i, y: j, z: zoomOld, t: constMapt });
                            namesShouldShow.push(constMapt + '_' + i + '_' + j + '_' + zoomOld);
                        }
                    }

                    var drawMapF = function (data, setSession) {

                        //var objGet;
                        //if (setSession) objGet = JSON.parse(data);
                        //else objGet = data;
                        //var loader = new THREE.TextureLoader();
                        //loader.load(
                        //    objGet.img,
                        //    function (texture) {
                        //        var lNew = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                        //                     (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                        //                     (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
                        //        //texture.center.set(API.centerX, API.centerY);
                        //        //texture.matrix.scale(256, 256);
                        //        var zoomNew = Math.round(21.5 - Math.log2(lNew));
                        //        if (zoomNew > 19) {
                        //            zoomNew = 19;
                        //        }
                        //        else if (zoomNew < 10) {
                        //            zoomNew = 10;
                        //        }
                        //        var planePositonXNew = (Math.round(controls.target.x) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);
                        //        var planePositonZNew = -(Math.round(-controls.target.z) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);



                        //        var indexXNew = (Math.round(controls.target.x) >> (19 - zoomNew));
                        //        var indexZNew = (Math.round(-controls.target.z) >> (19 - zoomNew));

                        //        if (objGet.x < indexXNew + 5 && objGet.x >= indexXNew - 5 &&
                        //              objGet.y < indexZNew + 5 && objGet.y >= indexZNew - 5 &&
                        //            objGet.z == zoomNew
                        //            ) {
                        //            var index = indexXNew - objGet.x + 5 + (4 +7 indexZNew - objGet.y) * 10;
                        //            mapMesh.material[index] = new THREE.MeshLambertMaterial({
                        //                map: texture
                        //            });
                        //            console.log('index', index);
                        //        }

                        //    });
                        //if (setSession) {
                        //    if (!mapGroupData[objGet.n])
                        //        mapGroupData[objGet.n] = objGet;
                        //}
                    }

                    for (var i = 0; i < idsShouldShow.length; i++) {
                        //var x = idsShouldShow[i].x;
                        //var y = idsShouldShow[i].y;
                        var name = idsShouldShow[i].t + '_' + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z;
                        if (mapGroupData[name]) {
                            drawMapF(mapGroupData[name], false);
                        }
                        else
                            $.get("DAL/MapImage.ashx", idsShouldShow[i], function (data, status) {
                                //alert("Data: " + data + "nStatus: " + status);
                                drawMapF(data, true);
                            });
                    }
                }


            }
            if (false) {
                var lOld = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));


                var zoomOld = Math.round(21.5 - Math.log2(lOld));
                if (zoomOld > 19) {
                    zoomOld = 19;
                }
                else if (zoomOld < 10) {
                    zoomOld = 10;
                }
                var x = controls.target.x / Math.pow(2, 19 - zoomOld);;
                var zValue = controls.target.z / Math.pow(2, 19 - zoomOld);
                if ((mercatoCenter.zoom - zoomOld) * (mercatoCenter.zoom - zoomOld) + (mercatoCenter.zValue - zValue) * (mercatoCenter.zValue - zValue) + (mercatoCenter.x - x) * (mercatoCenter.x - x) > 0.001) {
                    mercatoCenter.x = x;
                    mercatoCenter.zValue = zValue;
                    mercatoCenter.zoom = zoomOld;
                    var planePositonXOld = (Math.round(controls.target.x) >> (19 - zoomOld)) * Math.pow(2, 19 - zoomOld);
                    var planePositonZOld = -(Math.round(-controls.target.z) >> (19 - zoomOld)) * Math.pow(2, 19 - zoomOld);

                    var indexXOld = (Math.round(controls.target.x) >> (19 - zoomOld));
                    var indexZOld = (Math.round(-controls.target.z) >> (19 - zoomOld));


                    //console.log('zoom', zoom);
                    //var x = controls.target.x / Math.pow(2, 19 - zoom);;
                    //var zValue = controls.target.z / Math.pow(2, 19 - zoom);
                    mapMesh.position.set(planePositonXOld, 0, planePositonZOld);
                    mapMesh.scale.set(Math.pow(2, 19 - zoomOld) / 1, Math.pow(2, 19 - zoomOld) / 1, Math.pow(2, 19 - zoomOld) / 1);

                    var idsShouldShow = [];
                    var namesShouldShow = [];
                    for (var i = indexXOld - 7; i < indexXOld + 7; i++) {
                        for (var j = indexZOld - 7; j < indexZOld + 7; j++) {
                            idsShouldShow.push({ x: i, y: j, z: zoomOld, t: constMapt });
                            namesShouldShow.push(constMapt + '_' + i + '_' + j + '_' + zoomOld);
                        }
                    }

                    var drawMapF = function (data, setSession) {

                        var objGet;
                        if (setSession) objGet = JSON.parse(data);
                        else objGet = data;

                        {
                            var lNew = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
                            //texture.center.set(API.centerX, API.centerY);
                            //texture.matrix.scale(256, 256);
                            var zoomNew = Math.round(21.5 - Math.log2(lNew));
                            if (zoomNew > 19) {
                                zoomNew = 19;
                            }
                            else if (zoomNew < 10) {
                                zoomNew = 10;
                            }
                            var centerXNew = (Math.round(controls.target.x) / Math.pow(2, 19 - zoomNew));
                            var centerYNew = (Math.round(-controls.target.z) / Math.pow(2, 19 - zoomNew));
                            //var planePositonXNew = (Math.round(controls.target.x) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);
                            //var planePositonZNew = (Math.round(-controls.target.z) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);


                            //var positionX=
                            //var indexXNew = (Math.round(objGet.x) >> (19 - objGet.z));
                            //var indexZNew = (Math.round(objGet.y) >> (19 - objGet.z));

                            if (objGet.z == zoomNew) {
                                var positionOnCanvas =
                                {
                                    x: (objGet.x - centerXNew) * 256 + 5 * 256,
                                    y: (centerYNew - objGet.y - 1) * 256 + 5 * 256
                                };
                                var img = new Image(256, 256);
                                img.src = objGet.img;
                                ctx.drawImage(img, positionOnCanvas.x, positionOnCanvas.y);
                                mapMesh.material.map.needsUpdate = true;
                            }
                        }
                        if (setSession) {
                            if (!mapGroupData[objGet.n])
                                mapGroupData[objGet.n] = objGet;
                        }
                    }

                    for (var i = 0; i < idsShouldShow.length; i++) {
                        var name = idsShouldShow[i].t + '_' + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z;
                        if (mapGroupData[name]) {
                            drawMapF(mapGroupData[name], false);
                        }
                        else
                            $.get("DAL/MapImage.ashx", idsShouldShow[i], function (data, status) {
                                //alert("Data: " + data + "nStatus: " + status);
                                drawMapF(data, true);
                            });
                        //$.get('MapPathText/' + idsShouldShow[i].t + idsShouldShow[i].x + '_' + idsShouldShow[i].y + '_' + idsShouldShow[i].z + '.txt', idsShouldShow[i], function (data, status) {
                        //    //alert("Data: " + data + "nStatus: " + status);
                        //    drawMapF(data, true);
                        //});
                    }
                }

            }
        }
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
            //var lNew = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
            //             (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
            //             (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            ////texture.center.set(API.centerX, API.centerY);
            ////texture.matrix.scale(256, 256);
            //var zoomNew = Math.round(21.5 - Math.log2(lNew));
            //if (zoomNew > 19) {
            //    zoomNew = 19;
            //}
            //else if (zoomNew < 10) {
            //    zoomNew = 10;
            //}
            //var planePositonXNew = (Math.round(controls.target.x) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);
            //var planePositonZNew = -(Math.round(-controls.target.z) >> (19 - zoomNew)) * Math.pow(2, 19 - zoomNew);



            //var indexXNew = (Math.round(controls.target.x) >> (19 - zoomNew));
            //var indexZNew = (Math.round(-controls.target.z) >> (19 - zoomNew));

            //if (objGet.x < indexXNew + 5 && objGet.x >= indexXNew - 5 &&
            //      objGet.y < indexZNew + 5 && objGet.y >= indexZNew - 5 &&
            //    objGet.z == zoomNew
            //    ) {
            //    var index = indexXNew - objGet.x + 5 + (4 +7 indexZNew - objGet.y) * 10;
            //    mapMesh.material[index] = new THREE.MeshLambertMaterial({
            //        map: texture
            //    });
            //    console.log('index', index);
            //}

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

    switch (obj.command) {
        case 'setMap':
            {
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
                drawPeibian(obj.t);
                return;
            }; break;
        case 'drawTongxin5G':
            {
                drawTongxin5G(obj.t);
                return;
            }; break;
        case 'drawRegionBlock':
            {
                drawRegionBlock(obj.t);
                return;
            }; break;
        case 'drawLine':
            {
                drawLine(obj.t);
                return;
            }; break;
        case 'drawBiandiansuo':
            {
                drawBiandiansuo(obj.t);
                return;
            }; break;
        case 'drawBuildings':
            {
                drawBuildings(obj.t);
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
                            var keyWords = obj.keyWords;
                            searchPeibian(keyWords);
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
                            var keyWords = obj.keyWords;
                            searchLineByIndex(keyWords);
                            return;
                            // searchLine(keyWords);
                        }; break;
                    case 'lineName':
                        {
                            var keyWords = obj.keyWords;
                            searchLineByName(keyWords);
                            // searchLine(keyWords);
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
        case 'measureArea':
            {
                begainMeasureArea();
                return;
            }; break;
        case 'measureCancle': { measureCancle(); return; }; break;

        case 'drawXingquDian': {
            //t=show/hide;a=shop/school/hospital
            drawXingquDian(obj.t, obj.a);
            return;
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


    }





}

var drawBoundry = function (operateType) {
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

var drawPeibian = function (operateType) {
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

var searchPeibian = function (keyWords) {
    for (var i = 0; i < peibianGroup.children.length; i++) {
        if (peibianGroup.children[i].Tag.detail.search(keyWords) >= 0) {
            peibianGroup.children[i].material.color.set(0xFFFF00);
            peibianGroup.children[i].material.opacity = 0.5;
        }
        else {
            peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
            peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
        }
    }
    if (keyWords == '') {
        for (var i = 0; i < peibianGroup.children.length; i++) {

            peibianGroup.children[i].material.color.set(showAConfig.peiBian.color);
            peibianGroup.children[i].material.opacity = showAConfig.peiBian.opacity;
        }
    }
}
var searchTongxin5G = function (keyWords) {
    for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {
        if (tongxin5GMapGroup.children[i].Tag.detail.search(keyWords) >= 0) {
            tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
            tongxin5GMapGroup.children[i].material.opacity = 0.9;
        }
        else {
            tongxin5GMapGroup.children[i].material.color.set(0xFF00FF);
            tongxin5GMapGroup.children[i].material.opacity = 0.6;
        }
    }
    if (keyWords == '') {
        for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {

            tongxin5GMapGroup.children[i].material.color.set(0xFF00FF);
            tongxin5GMapGroup.children[i].material.opacity = 0.6;
        }
    }
}
//var searchTongxin5G = function (keyWords) {
//    for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {
//        if (tongxin5GMapGroup.children[i].Tag.jizhanLeixing.search(keyWords) >= 0 || tongxin5GMapGroup.children[i].Tag.position.search(keyWords) >= 0 || tongxin5GMapGroup.children[i].Tag.name.search(keyWords) >= 0) {
//            tongxin5GMapGroup.children[i].material.color.set(0xFFFF00);
//            tongxin5GMapGroup.children[i].material.opacity = 0.9;
//        }
//        else {
//            tongxin5GMapGroup.children[i].material.color.set(0xFF00FF);
//            tongxin5GMapGroup.children[i].material.opacity = 0.6;
//        }
//    }
//}

var drawTongxin5G = function (operateType) {
    if (operateType == 'show') {
        //tongxin5GMapGroup
        tongxin5GMapGroup.visible = true;
        if (tongxin5GMapGroup.children.length == 0) {
            var data = peibianData;
            //var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);
            var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);
            //var deltaLon = 112.5492 - 112.536353;
            //var deltaLat = 37.889121 - 37.882311;

            var deltaLon = 112.5492 - 112.536353;
            var deltaLat = 37.889121 - 37.882311;
            //for (var i = 0; i < data.length; i++) { //data.length
            //    var lon = data[i].lon + deltaLon;
            //    var lat = data[i].lat + deltaLat + 0.0001;
            for (var i = 0; i < data.length; i++) { //data.length
                //var lon = data[i].lon;
                //var lat = data[i].lat;
                ////var bdPosition = gcj02tobd09(lon, lat);
                ////lon = bdPosition[0] + deltaLon;
                ////lat = bdPosition[1] + deltaLat;
                //var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                //var x_m = MercatorGetXbyLongitude(lon);
                //var z_m = MercatorGetYbyLatitude(lat);

                //object.position.x = x_m;
                //object.position.y = 0.001;
                //object.position.z = 0 - z_m;

                //object.Tag = data[i];
                ////object.rotateX(-Math.PI);
                //object.scale.set(1, 1, 1);
                //tongxin5GMapGroup.add(object);

                //
                var lon = data[i].lon + deltaLon + Math.cos(i) * 0.001;
                var lat = data[i].lat + deltaLat + 0.0001 + Math.sin(i) * 0.001;
                //var bdPosition = gcj02tobd09(lon, lat);
                //lon = bdPosition[0] + deltaLon;
                //lat = bdPosition[1] + deltaLat;
                // var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);
                var geometry = new THREE.RingGeometry(0.8, 0.3, 3);
                var material = new THREE.MeshBasicMaterial({ color: 0xFF00FF, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
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
                plane.rotateZ(Math.PI / 6);
                tongxin5GMapGroup.add(plane);
            }

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
        raycaster.linePrecision = recordL * 0.02;

        if (peibianGroup.visible) {
            if (peibianGroup.children.length > 0) {
                for (var i = 0; i < peibianGroup.children.length; i++) {
                    peibianGroup.children[i].scale.set(recordL / 50, recordL / 50, recordL / 50);
                }

            }
        }
        if (tongxin5GMapGroup.visible) {
            if (tongxin5GMapGroup.children.length > 0) {
                for (var i = 0; i < tongxin5GMapGroup.children.length; i++) {
                    tongxin5GMapGroup.children[i].scale.set(recordL / 50, recordL / 50, recordL / 50);
                }

            }
        }
        //if (boundryGroup.visible) {
        //    if (boundryGroup.children.length > 0) {
        //        boundryGroup.scale.set(1, 0, 1);

        //        //for (var i = 0; i < boundryGroup.children.length; i++) {
        //        //    boundryGroup.children[i].scale.set(1, recordL, 1);
        //        //}

        //    }
        //}
    }
}
var updatePlaneLineScale = function () {
    //var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
    //(camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
    //(camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
    //if (boundryGroup.visible) {
    //    if (boundryGroup.children.length > 0) {
    //        for (var i = 0; i < boundryGroup.children.length; i++) {
    //            boundryGroup.children[i].scale.set(1, recordL, 1);
    //        }

    //    }
    //}
}

var drawRegionBlock = function (operateType) {
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
                for (var i = 0; i < polygonData.length; i++) {

                    //var x = polygonData[i][0];

                    var lon = polygonData[i][0];
                    var lat = polygonData[i][1];

                    var lon = baiduMapLeftTop.x + (polygonData[i][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                    var lat = baiduMapRightBottom.y + (polygonData[i][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat) + 0.3;
                    // positions.push(x_m, 1, 0 - z_m);

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
            }
            for (var i = 0; i < data.length; i++) {
                drawRegionBlockItem2(data[i], i);
            }

        }
        else {
            searchRegionBlock('BB');
        }
    }
    else if (operateType == 'hide') {
        regionBlockGroup.visible = false;
    }
}

var drawSongdianquyu = function (operateType) {
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
                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat) + 0.3;
                    // positions.push(x_m, 1, 0 - z_m);

                    regionPts.push(new THREE.Vector2(x_m, z_m));
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
            }
            for (var i = 0; i < data.length; i++) {
                drawRegionBlockItem2(data[i], i);
            }
            songdianquGroup.position.set(-25.32999999999998, 0, 11.699999999999986);
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

var dataOfLineLabel = [];
var lineShowIndex = [0, 1, 2, 3, 4, 5, 6];
var chaoliuData = { geometry: null, vertices: [] };
var drawLine = function (operateType) {
    var found = false;
    if (operateType == 'show') {

        var cadLeftTop = { x: 17545.309, y: 65811.8395 };
        var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

        var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
        var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };
        //tongxin5GMapGroup
        lineGroup.visible = true;
        if (true) {
            chaoliuData.geometry = new THREE.BufferGeometry();
            if (lineGroup.children.length == 0) {
                var data = shudianxian3;
                for (var i = 0; i < data.features.length; i++) {

                    if (data.features[i].geometry.type == "LineString") { }
                    else { continue; }

                    var layer = data.features[i].properties.Layer;
                    var geometryLine = new THREE.BufferGeometry();
                    var positions = [];
                    // var geometry = new THREE.Geometry();
                    var geometry = new THREE.LineGeometry();
                    var geometryFromData = data.features[i].geometry.coordinates;
                    var color = 'orange';

                    var entityHandle = data.features[i].properties.EntityHandle;
                    var colorAndName = getNameAndColorOfLine(layer);
                    color = colorAndName[0];
                    var nameV = colorAndName[1];
                    var stationName = (colorAndName.length == 3 ? colorAndName[2] : '未知');

                    if (colorAndName.length == 3 && colorAndName[2] == '方案') {
                        continue;
                    }
                    if (found) {
                        color = 'orange';
                    }
                    color = getColorByStation(stationName);
                    var show = getShowByStation(stationName);
                    if (!show) {
                        continue;
                    }

                    var indexV = getIndexByStation(stationName);
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

                    var midPoints = [];
                    for (var j = 0; j < geometryFromData.length; j++) {
                        var lon = baiduMapLeftTop.x + (geometryFromData[j][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                        var lat = baiduMapRightBottom.y + (geometryFromData[j][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);
                        positions.push(x_m, 0, 0 - z_m);

                        //geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                        // geometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));

                        if (j > 0) {
                            var lonLast = baiduMapLeftTop.x + (geometryFromData[j - 1][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                            var latLast = baiduMapRightBottom.y + (geometryFromData[j - 1][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                            var x_mLast = MercatorGetXbyLongitude(lonLast);
                            var z_mLast = MercatorGetYbyLatitude(latLast);

                            midPoints.push();
                            midPoints.push();

                            dataOfLineLabel.push({ x: (x_m + x_mLast) / 2, z: -(z_m + z_mLast) / 2, nameV: nameV, colorR: color, indexV: indexV })

                            var lengthOfTwoPoint = Math.sqrt((x_m - x_mLast) * (x_m - x_mLast) + (z_m - z_mLast) * (z_m - z_mLast));
                            if (lengthOfTwoPoint > 0.5) {
                                //  var
                                var n = Math.ceil(lengthOfTwoPoint / 0.5);

                                var p = function (nInput, x1, y1, x2, y2) {
                                    var points = [];
                                    for (var i = 0; i < nInput; i++) {

                                        for (var j = 0; j < chaoliufenxiGroupCount; j++) {
                                            chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (x2 - x1) + x1);
                                            chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (y2 - y1) + y1);
                                        }


                                        //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (y2 - y1) + y1);
                                    }
                                    return points;
                                }(n, x_mLast, z_mLast, x_m, z_m);

                                var xx = p;
                            }
                            else {
                                var n = 1;

                                var p = function (nInput, x1, y1, x2, y2) {
                                    var points = [];
                                    for (var i = 0; i < nInput; i++) {

                                        for (var j = 0; j < chaoliufenxiGroupCount; j++) {
                                            chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (x2 - x1) + x1);
                                            chaoliuFenxiData[j].push((chaoliufenxiGroupCount * i + j) / (chaoliufenxiGroupCount * nInput) * (y2 - y1) + y1);
                                        }


                                        //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data2.push((5 * i + 1) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data3.push((5 * i + 2) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data4.push((5 * i + 3) / (5 * nInput) * (y2 - y1) + y1);
                                        //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (x2 - x1) + x1);
                                        //chaoliuFenxiData.data5.push((5 * i + 4) / (5 * nInput) * (y2 - y1) + y1);
                                    }
                                    return points;
                                }(n, x_mLast, z_mLast, x_m, z_m);

                                var xx = p;
                            }
                        }

                    }
                    geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    geometry.setPositions(positions);
                    //geometry.computeBoundingSphere();

                    var material_ForSelect = new THREE.LineBasicMaterial({ color: color, linewidth: 1, transparent: true, opacity: 0 });//ignored by WebGLRenderer});

                    var material = new THREE.LineMaterial({
                        color: color,
                        linewidth: 0.003, // in pixels
                        //vertexColors: 0x12f43d,
                        ////resolution:  // to be set by renderer, eventually
                        //dashed: false
                    });
                    material.depthTest = false;
                    var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
                    line_ForSelect.Tag = { name: nameV, station: stationName };
                    //line.Tag = { name: data[i].name, voltage: data[i].voltage }

                    var line = new THREE.Line2(geometry, material);
                    line.computeLineDistances();
                    line.Tag = { name: nameV, voltage: '', indexV: indexV, colorR: color };
                    line.renderOrder = 99;
                    line.scale.set(1, 1, 1);
                    //line.rotateX(-Math.PI / 2);
                    lineGroup.add(line_ForSelect);
                    lineGroup.add(line);

                    //for (var k = 0; k < midPoints.length; k += 2) {
                    //    var x_m = midPoints[k];
                    //    var z_m = midPoints[k + 1];

                    //    var labelDiv = document.createElement('div');
                    //    labelDiv.className = 'labelline';
                    //    labelDiv.textContent = nameV;
                    //    labelDiv.style.marginTop = '-1em';

                    //    labelDiv.style.color = Number.isInteger(color) ? get16(color) : color;
                    //    var divLabel = new THREE.CSS2DObject(labelDiv);
                    //    divLabel.position.set(x_m, 0, -z_m);
                    //    divLabel.positionTag = [x_m, 0, -z_m];
                    //    lineGroup.add(divLabel);
                    //}


                    if (nameV == '') {
                        if (!found) {

                            var showxx = 'case \'' + layer + '\':\r{\r{ return [\'green\', \'\', \'\'] };}; break;';
                            console.log('EntityHandle', showxx);
                        }
                        found = true;
                    }
                }
            }
            else { lineGroup.visible = true; }
        }

        if (false) {
            if (lineGroup.children.length == 0) {
                var data = shudianxian;
                //var geometry = new THREE.BoxBufferGeometry(0.05, 0.05, 0.3);

                //var hilbertPoints = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
                for (var i = 0; i < data.length; i++) {

                    var geometry = new THREE.BufferGeometry();
                    var positions = [];

                    //var lineGeometry = new THREE.Geometry();
                    var path = data[i].path;
                    var points = [];
                    var widths = [];
                    for (var j = 0; j < path.length; j++) {
                        var lon = path[j][0];
                        var lat = path[j][1];
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);
                        //lineGeometry.vertices.push(new THREE.Vector3(x_m, 0.01, 0 - z_m));
                        positions.push(x_m, 0.01, 0 - z_m);
                        widths.push(0.001);

                        if (j > 0) {
                            var lonLast = path[j - 1][0];
                            var latLast = path[j - 1][1];
                            var x_mLast = MercatorGetXbyLongitude(lonLast);
                            var z_mLast = MercatorGetYbyLatitude(latLast);


                            var labelDiv = document.createElement('div');
                            labelDiv.className = 'labelbiandianzhan';
                            labelDiv.textContent = data[i].name;
                            labelDiv.style.marginTop = '-1em';

                            labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                            var divLabel = new THREE.CSS2DObject(labelDiv);
                            divLabel.position.set(x_m, 0, -z_m);
                            divLabel.positionTag = [x_m, 0, -z_m];
                            biandiansuoGroup.add(divLabel);
                        }

                    }
                    //   geometry.attributes[]

                    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

                    geometry.computeBoundingSphere();

                    var color = 'orange';
                    switch (data[i].voltage) {
                        case '380V':
                            {
                                color = 'orange';
                            }; break;
                        case '10KV':
                            {
                                color = 'purple';
                            }; break;
                        case '35KV':
                            {
                                color = 'red';
                            }; break;
                    }
                    var material = new THREE.LineBasicMaterial({ color: color, linewidth: 500 });
                    var line = new THREE.Line(geometry, material);
                    line.Tag = { name: data[i].name, voltage: data[i].voltage }
                    line.scale.set(1, 1, 1);
                    //line.rotateX(-Math.PI / 2);
                    lineGroup.add(line);
                }

            }
            else {
                throw '这里的代码没写-要瑞卿  201912160928';
                //searchTongxin5G('BB');
            }
        }


    }
    else if (operateType == 'hide') {
        lineGroup.visible = false;

    }
    updateLabelOfLine();
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
    if (lineGroup.visible) {
        for (var i = 0; i < lineGroup.children.length; i++) {
            if (lineGroup.children[i].type == "Line2") {
                if (keyWords.indexOf(lineGroup.children[i].Tag.indexV) >= 0) {
                    lineGroup.children[i].visible = true;
                }
                else {
                    lineGroup.children[i].visible = false;
                }
            }
        }
    }
    updateLabelOfLine();
}

var searchLineByName = function (keyWords) {
    if (lineGroup.visible) {
        for (var i = 0; i < lineGroup.children.length; i++) {
            if (lineGroup.children[i].type == "Line2") {
                if (lineGroup.children[i].Tag.name.search(keyWords) >= 0) {
                    lineGroup.children[i].material.color.set(0xFFFF00);
                    lineGroup.children[i].material.opacity = 0.6;
                    lineGroup.children[i].material.transparent = true;
                    // transparent: true, opacity: 0 
                }
                else {
                    lineGroup.children[i].material.color.set(lineGroup.children[i].Tag.colorR);
                    //lineGroup.children[i].material.opacity = 0;
                    lineGroup.children[i].material.transparent = false;
                }
            }
        }
        if (keyWords == '') {

            for (var i = 0; i < lineGroup.children.length; i++) {
                if (lineGroup.children[i].type == "Line2") {
                    lineGroup.children[i].material.color.set(lineGroup.children[i].Tag.colorR);
                    lineGroup.children[i].material.transparent = false;
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

var drawBiandiansuo = function (operateType) {


    if (operateType == 'show') {
        biandiansuoGroup.visible = true;
        if (biandiansuoGroup.children.length == 0) {

            var cadLeftTop = { x: 17545.309, y: 65811.8395 };
            var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

            var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
            var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };

            var data = biandiansuo2;
            for (var i = 0; i < data.length; i++) {

                var divC = document.createElement('div');
                var imgC = document.createElement('img');
                imgC.src = 'Pic/biandianzhan110kv.png';
                divC.appendChild(imgC);
                divC.className = 'biandianzhanTuPian';

                var colorOfCircle = '0xffff00';
                switch (data[i].name) {
                    case '东大变':
                        {
                            colorOfCircle = 'red';
                        }; break;
                    case '杏花岭变':
                        {
                            colorOfCircle = 'purple';
                        }; break;
                    case '柳溪变电站':
                        {
                            colorOfCircle = 'orange';
                        }; break;
                    case '城西站':
                        {
                            colorOfCircle = 'purple';
                        }; break;
                    case '铜锣湾变':
                        {
                            colorOfCircle = 'orange';
                        }; break;
                    case '城北站':
                        {
                            colorOfCircle = 'orange';
                        }; break;
                    case '解放变':
                        {
                            colorOfCircle = 'purple';
                        }; break;
                };

                colorOfCircle = getColorByStation(data[i].name);
                switch (data[i].v) {
                    case '110kv':
                        {
                            var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                            var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);

                            var radius = showAConfig.biandianzhan.l110kv.radius;
                            var color = colorOfCircle;
                            var geometry = new THREE.RingGeometry(radius, radius * 0.75, 18);
                            var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
                            material.depthTest = false;
                            var plane = new THREE.Mesh(geometry, material);
                            // plane.name = data[i].name;

                            var position = { x: x_m, y: 0, z: -z_m };
                            plane.Tag = { name: data[i].name, position: position }
                            //measureAreaObj.measureAreaDiv.className = 'label';
                            //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                            //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                            //var label = new THREE.CSS2DObject(divC);
                            plane.renderOrder = 98;

                            plane.position.set(x_m, 0, -z_m);
                            plane.rotateX(Math.PI / 2);
                            biandiansuoGroup.add(plane);



                            var labelDiv = document.createElement('div');
                            labelDiv.className = 'labelbiandianzhan';
                            labelDiv.textContent = data[i].name;
                            labelDiv.style.marginTop = '-1em';
                            labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                            //labelDiv.style.color = color;
                            var divLabel = new THREE.CSS2DObject(labelDiv);
                            divLabel.position.set(x_m, 0, -z_m);
                            divLabel.positionTag = [x_m, 0, -z_m];
                            biandiansuoGroup.add(divLabel);

                        }; break;
                    case '220kv':
                        {

                            var radius = showAConfig.biandianzhan.l220kv.radius;
                            var color = colorOfCircle;
                            var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                            var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);

                            var geometry1 = new THREE.RingGeometry(radius, radius * 0.75, 18);
                            var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
                            material.depthTest = false;
                            var plane1 = new THREE.Mesh(geometry1, material);
                            plane1.name = data[i].name;

                            var position = { x: x_m, y: 0, z: -z_m };
                            plane1.Tag = { name: data[i].name, position: position };
                            //measureAreaObj.measureAreaDiv.className = 'label';
                            //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                            //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                            //var label = new THREE.CSS2DObject(divC);
                            plane1.renderOrder = 98;

                            plane1.position.set(x_m, 0, -z_m);
                            plane1.rotateX(Math.PI / 2);
                            biandiansuoGroup.add(plane1);



                            var geometry2 = new THREE.RingGeometry(radius * 0.5, radius * 0.25, 18);
                            var plane2 = new THREE.Mesh(geometry2, material);
                            //  plane2.name = data[i].name;

                            //var position = { x: x_m, y: 0, z: -z_m };
                            plane2.Tag = { name: data[i].name, position: position }
                            //measureAreaObj.measureAreaDiv.className = 'label';
                            //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                            //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                            //var label = new THREE.CSS2DObject(divC);
                            plane2.renderOrder = 98;

                            plane2.position.set(x_m, 0, -z_m);
                            plane2.rotateX(Math.PI / 2);
                            biandiansuoGroup.add(plane2);

                            var labelDiv = document.createElement('div');
                            labelDiv.className = 'labelbiandianzhan';
                            labelDiv.textContent = data[i].name;
                            labelDiv.style.marginTop = '-1em';

                            labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                            var divLabel = new THREE.CSS2DObject(labelDiv);
                            divLabel.position.set(x_m, 0, -z_m);
                            divLabel.positionTag = [x_m, 0, -z_m];
                            biandiansuoGroup.add(divLabel);
                        }; break;
                }



                //var lon = baiduMapLeftTop.x + (data[i].position[0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                //var lat = baiduMapRightBottom.y + (data[i].position[1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                //var x_m = MercatorGetXbyLongitude(lon);
                //var z_m = MercatorGetYbyLatitude(lat);

                //var geometry = new THREE.RingGeometry(0.8, 0.6, 24);
                //var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                //material.depthTest = false;
                //var plane = new THREE.Mesh(geometry, material);
                //plane.name = data[i].name;

                //var position = { x: x_m, y: 0, z: -z_m };
                //plane.Tag = { name: data[i].name, position: position }
                ////measureAreaObj.measureAreaDiv.className = 'label';
                ////measureAreaObj.measureAreaDiv.textContent = 'Earth';
                ////measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                ////var label = new THREE.CSS2DObject(divC);
                //plane.renderOrder = 98;

                //plane.position.set(x_m, 0, -z_m);
                //plane.rotateX(Math.PI / 2);
                //biandiansuoGroup.add(plane);
                // measureAreaGroup.add(measureAreaObj.measureAreaDivLabel);
                //var material = new THREE.MeshPhongMaterial({ color: 'green', specular: 'red', shininess: 200 });
                //var mesh = new THREE.Mesh(geometry, material);
                //mesh.rotateX(-Math.PI / 2);
                //mesh.rotateZ(i / data.length * 2 * Math.PI);
                //var position = { x: MercatorGetXbyLongitude(data[i].position[0]), y: 0, z: -MercatorGetYbyLatitude(data[i].position[1]) };
                //mesh.position.set(MercatorGetXbyLongitude(data[i].position[0]), 0, -MercatorGetYbyLatitude(data[i].position[1]));
                ////mesh.position.set(0, 0, 0 );
                //// mesh.rotation.set(-Math.PI / 2, 0, 0);
                ////mesh.rotateX(-Math.PI / 2);
                //mesh.scale.set(0.3, 0.3, 0.3);

                //mesh.castShadow = true;
                //mesh.receiveShadow = true;
                //mesh.name = data[i].name;
                //mesh.Tag = { name: data[i].name, position: position }
                // biandiansuoGroup.add(mesh);
            }

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
            for (var i = 0; i < biandiansuoGroup.children.length; i++) {
                if (biandiansuoGroup.children[i].positionTag) {
                    biandiansuoGroup.children[i].position.set(biandiansuoGroup.children[i].positionTag[0], biandiansuoGroup.children[i].positionTag[1], biandiansuoGroup.children[i].positionTag[2]);
                }
            }
        }
    }
    else if (operateType == 'hide') {
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
        for (var i = 0; i < biandiansuoGroup.children.length; i++) {
            if (biandiansuoGroup.children[i].type == 'Mesh')
                if (biandiansuoGroup.children[i].Tag.name == keyWords) {
                    controls.target.set(biandiansuoGroup.children[i].Tag.position.x, biandiansuoGroup.children[i].Tag.position.y, biandiansuoGroup.children[i].Tag.position.z);

                }
                else {
                    //   biandiansuoGroup.children[i].material.color.set('green');
                }
        }
    }
}

var drawBuildings = function (operateType) {
    if (operateType == 'show') {
        buildingsGroups.visible = true;
        if (buildingsGroups.children.length == 0) {



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
                //var material = new THREE.MeshPhongMaterial({ color: 0x3300CC, specular: 'blue', shininess: 200, transparent: true, opacity: 0.5 });
                //new THREE.OBJLoader()
                //    //.setMaterials(material)
                //    .setPath('ObjTag/shenggongsi/')
                //    .load('build1.mtl', function (object) {


                //        //object.traverse(function (child) {
                //        //    if (child.isMesh) child.material.map = texture;
                //        //});
                //        object.position.y = -95;

                //        object.rotateX(-Math.PI / 2);
                //        object.rotateZ(-0.05);
                //        var position = { x: MercatorGetXbyLongitude(112.57905), y: 0, z: -MercatorGetYbyLatitude(37.8794) };
                //        object.position.set(MercatorGetXbyLongitude(112.57905), 0, -MercatorGetYbyLatitude(37.8794));
                //        object.scale.set(0.20, 0.20, 0.20);
                //        object.castShadow = true;
                //        object.receiveShadow = true;
                //        object.name = 'build1';
                //        object.Tag = { name: '省公司', position: position };
                //        object.rotateX(Math.PI / 2);
                //        buildingsGroups.add(object);
                //    }, function () { }, function () { });

                var manager = new THREE.LoadingManager();
                //manager.addHandler(/\.dds$/i, new DDSLoader());
                // comment in the following line and import TGALoader if your asset uses TGA textures
                // manager.addHandler( /\.tga$/i, new TGALoader() );
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
                                object.castShadow = true;
                                object.receiveShadow = true;
                                object.name = 'build1';
                                object.Tag = { name: '省公司', position: position };
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
                              object.castShadow = true;
                              object.receiveShadow = true;
                              object.name = 'build2';
                              object.Tag = { name: '世贸', position: position };
                              object.rotateX(Math.PI / 2);
                              buildingsGroups.add(object);
                          }, function () { }, function () { });
                  });

                new THREE.MTLLoader(manager)
               .setPath('ObjTag/build4/')
               .load('build4fujia.mtl', function (materials) {
                   materials.preload();
                   // materials.depthTest = false;
                   new THREE.OBJLoader(manager)
                       .setMaterials(materials)
                       .setPath('ObjTag/build4/')
                       .load('build4fujia.obj', function (object) {
                           for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                               if (object.children[iOfO].isMesh) {
                                   //var ms = object.children[iOfO].material;
                                   for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                       //  object.children[iOfO].material[mi].depthTest = false;
                                       object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                   }
                                   //object.children[iOfO].material.depthTest = false;
                               }
                           }
                           {
                               object.position.y = 0;
                               scene.add(object);
                               object.rotateX(-Math.PI / 2);
                               object.rotateZ(-0.03);
                               var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8927) };
                               object.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8927));
                               object.scale.set(0.020, 0.035, 0.025);
                               object.castShadow = true;
                               object.receiveShadow = true;
                               object.name = 'mj1';
                               object.Tag = { name: '民居1', position: position };
                               object.rotateX(Math.PI / 2);
                               buildingsGroups.add(object);
                           }
                           //{
                           //    var a1 = object.clone();
                           //    a1.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8927));
                           //    //buildingsGroups.add(a1);
                           //}
                           {
                               var a2 = object.clone();
                               var position = { x: MercatorGetXbyLongitude(112.5574), y: 0, z: -MercatorGetYbyLatitude(37.8917) };
                               //  112.557307, 37.892976
                               a2.name = 'mj2';
                               a2.Tag = { name: '民居2', position: position };
                               a2.position.set(MercatorGetXbyLongitude(112.5574), 0, -MercatorGetYbyLatitude(37.8917));
                               buildingsGroups.add(a2);

                           }
                           {
                               var a3 = object.clone();
                               var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8907) };
                               //  112.557307, 37.892976
                               a3.name = 'mj3';
                               a3.Tag = { name: '民居3', position: position };
                               a3.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8907));
                               buildingsGroups.add(a3);
                           }

                           {
                               var a4 = object.clone();
                               var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8897) };
                               //  112.557307, 37.892976
                               a4.name = 'mj4';
                               a3.Tag = { name: '民居4', position: position };
                               a4.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8897));
                               buildingsGroups.add(a4);
                           }

                           {
                               var a5 = object.clone();
                               var position = { x: MercatorGetXbyLongitude(112.5575), y: 0, z: -MercatorGetYbyLatitude(37.8875) };
                               //  112.557307, 37.892976
                               a5.name = 'mj5';
                               a5.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8875));
                               buildingsGroups.add(a5);
                           }

                           {
                               var a6 = object.clone();
                               a6.position.set(MercatorGetXbyLongitude(112.5575), 0, -MercatorGetYbyLatitude(37.8868));
                               buildingsGroups.add(a6);
                           }

                           {
                               var a7 = object.clone();
                               a7.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88601));
                               buildingsGroups.add(a7);
                           }

                           {
                               var a8 = object.clone();
                               a8.position.set(MercatorGetXbyLongitude(112.5576), 0, -MercatorGetYbyLatitude(37.88521));
                               buildingsGroups.add(a8);

                           }
                       }, function () { }, function () { });
               });

                new THREE.MTLLoader(manager)
             .setPath('ObjTag/wandaxiugai/')
             .load('wandagcxiugai.mtl', function (materials) {
                 materials.preload();
                 // materials.depthTest = false;
                 new THREE.OBJLoader(manager)
                     .setMaterials(materials)
                     .setPath('ObjTag/wandaxiugai/')
                     .load('wandagcxiugai.obj', function (object) {
                         for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                             if (object.children[iOfO].isMesh) {
                                 //var ms = object.children[iOfO].material;
                                 for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                     //  object.children[iOfO].material[mi].depthTest = false;
                                     object.children[iOfO].material[mi].side = THREE.DoubleSide;
                                 }
                                 //object.children[iOfO].material.depthTest = false;
                             }
                         }
                         object.position.y = 0;
                         scene.add(object);
                         object.rotateX(-Math.PI / 2);
                         object.rotateZ(Math.PI / 2);
                         var position = { x: MercatorGetXbyLongitude(112.56774847960612), y: 0.001, z: -MercatorGetYbyLatitude(37.88849601745606) };
                         object.position.set(MercatorGetXbyLongitude(112.56774847960612), 0.001, -MercatorGetYbyLatitude(37.88849601745606));
                         object.scale.set(0.09, 0.09, 0.09);
                         object.castShadow = true;
                         object.receiveShadow = true;
                         object.name = 'wd';
                         object.Tag = { name: '万达广场', position: position };
                         object.rotateX(Math.PI / 2);
                         buildingsGroups.add(object);


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
var showLabelOfLine = function () {

    for (var i = 0; i < dataOfLineLabel.length; i++) {
        var x_m = dataOfLineLabel[i].x;
        var z_m = dataOfLineLabel[i].z;
        var labelDiv = document.createElement('div');
        labelDiv.className = 'labelline';
        labelDiv.textContent = dataOfLineLabel[i].nameV;
        labelDiv.style.marginTop = '-1em';
        var colorOfCircle = dataOfLineLabel[i].colorR;
        labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
        var divLabel = new THREE.CSS2DObject(labelDiv);
        divLabel.position.set(x_m, 0, z_m);
        divLabel.positionTag = [x_m, 0, z_m];
        lineLabelGroup.add(divLabel);
    }

}
var clearLabelOfLine = function () {
    for (var i = lineLabelGroup.children.length - 1; i >= 0; i--) {
        lineLabelGroup.remove(lineLabelGroup.children[i]);
    }
}

var updateLabelOfLine = function () {

    if (arguments.length == 0) {
        if (dataOfLineLabel.length > 0) {

            if (lineGroup.visible) {
                var xMin = (mercatoCenter.x - 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                var xMax = (mercatoCenter.x + 7) * Math.pow(2, 19 - mercatoCenter.zoom);

                var zValueMin = (mercatoCenter.zValue - 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                var zValueMax = (mercatoCenter.zValue + 7) * Math.pow(2, 19 - mercatoCenter.zoom);
                var usedKey = [];
                clearLabelOfLine();
                for (var i = 0; i < dataOfLineLabel.length; i++) {
                    var x_m = dataOfLineLabel[i].x;
                    var z_m = dataOfLineLabel[i].z;


                    var key = ((x_m >> (19 - mercatoCenter.zoom + 1)) + '') + '_' + ((z_m >> (19 - mercatoCenter.zoom + 1)) + '') + '_' + chineseToNumStr(dataOfLineLabel[i].nameV);
                    if (x_m >= xMin && x_m <= xMax && z_m >= zValueMin && z_m <= zValueMax && lineShowIndex.indexOf(dataOfLineLabel[i].indexV) >= 0) {
                        if (lineLabelGroup.getObjectByName(key)) { }
                        else
                        {
                            var xianShunV = getXianShunByName(dataOfLineLabel[i].nameV);

                            if (xianShunV >= 50) {
                                var labelDiv = document.createElement('div');
                                labelDiv.className = 'labelline';
                                labelDiv.textContent = dataOfLineLabel[i].nameV + '(线损' + (xianShunV / 10) + '%)';
                                labelDiv.style.marginTop = '-1em';
                                var colorOfCircle = dataOfLineLabel[i].colorR;
                                labelDiv.style.borderColor = 'red';
                                labelDiv.style.color = 'red';
                                var divLabel = new THREE.CSS2DObject(labelDiv);
                                divLabel.position.set(x_m, 0, z_m);
                                divLabel.positionTag = [x_m, 0, z_m];
                                divLabel.name = key;
                                lineLabelGroup.add(divLabel);
                            }
                            else {
                                var labelDiv = document.createElement('div');
                                labelDiv.className = 'labelline';
                                labelDiv.textContent = dataOfLineLabel[i].nameV;
                                labelDiv.style.marginTop = '-1em';
                                var colorOfCircle = dataOfLineLabel[i].colorR;
                                labelDiv.style.borderColor = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                                var divLabel = new THREE.CSS2DObject(labelDiv);
                                divLabel.position.set(x_m, 0, z_m);
                                divLabel.positionTag = [x_m, 0, z_m];
                                divLabel.name = key;
                                lineLabelGroup.add(divLabel);
                            }
                        }
                    }
                    else {
                        //if (lineLabelGroup.getObjectByName(key)) {
                        //    lineLabelGroup.remove(lineLabelGroup.getObjectByName(key));
                        //}
                    }
                    //if (usedKey.indexOf(key) >= 0) { }
                    //else {
                    //    usedKey.push(key);

                    //}
                }
            }
            else {
                clearLabelOfLine();
            }
            // var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
            //(camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
            //(camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));
            // var zoom = Math.round(22 - Math.log2(l));
            // if (zoom > 19) {
            //     zoom = 19;
            // }
            // else if (zoom < 10) {
            //     zoom = 10;
            // }

        }
    }
    else if (arguments.length == 1) {
        console.log('a', arguments[0]);
    }
}

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
    //'Pic/school.svg', xingquDianGroup.unit.school
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
            else {
                return;
            }
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
                    img.src = "Pic/hospital.svg";
                }
                else if (objType == "school") {
                    img.src = "Pic/school.svg";
                }
                else if (objType == "shop") {
                    img.src = "Pic/shop.svg";
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
                object.position.set(x_m, 0, -z_m);
                opreateGroup.add(object);

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



    var operateGroups = [xingquDianGroup.school, xingquDianGroup.hosipital, xingquDianGroup.shop];

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








