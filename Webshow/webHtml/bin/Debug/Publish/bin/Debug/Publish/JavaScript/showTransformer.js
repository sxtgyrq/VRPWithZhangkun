var objMain =
{
    scene: null,
    renderer: null,
    labelRenderer: null,
    raycaster: null,
    mouse: null,
    light1: null,
    light2: null,
    light3: null,
    light4: null,
    setIntensity: function (v) {
        objMain.light1.intensity = v;
        objMain.light2.intensity = v;
        objMain.light3.intensity = v;
        objMain.light4.intensity = v;
    },


    onWindowResize: function () {

        objMain.camera.aspect = window.innerWidth / window.innerHeight;
        objMain.camera.updateProjectionMatrix();

        //  mapRender.setSize(window.innerWidth, window.innerHeight);

        objMain.renderer.setSize(window.innerWidth, window.innerHeight);

        objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        //cssLabelRenderer.setSize(window.innerWidth, window.innerHeight);
    },
    render: function () {

        var that = objMain;
        that.renderer.clear();
        that.renderer.render(that.scene, that.camera);

    },
    t: 0,
    onDocumentClick: function () {
        var t = Date.now();
        if (t - objMain.t < 300) {
            var that = baozhatu;

            if (that.group.visible) {
                that.group.visible = false;
            }
            else {
                that.group.visible = true;
            }
            that.group2.visible = !that.group.visible;
        }
        else {

        }
        objMain.t = t;

    }
};

function init() {
    objMain.scene = new THREE.Scene();
    objMain.scene.background = new THREE.Color(0x7c9dd4);
    objMain.scene.fog = new THREE.FogExp2(0x7c9dd4, 0.002);

    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('Pic/');
    var cubeTexture = cubeTextureLoader.load([
        "px.jpg", "nx.jpg",
        "py.jpg", "ny.jpg",
        "pz.jpg", "nz.jpg"
    ]);
    objMain.scene.background = cubeTexture;

    objMain.renderer = new THREE.WebGLRenderer({ alpha: true });
    objMain.renderer.setClearColor(0x000000, 0); // the default
    objMain.renderer.setPixelRatio(window.devicePixelRatio);
    objMain.renderer.setSize(window.innerWidth, window.innerHeight);
    objMain.renderer.domElement.className = 'renderDom';
    document.getElementById('mainC').appendChild(objMain.renderer.domElement);
    //  document.body

    objMain.labelRenderer = new THREE.CSS2DRenderer();
    objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    objMain.labelRenderer.domElement.className = 'labelRenderer';
    document.getElementById('mainC').appendChild(objMain.labelRenderer.domElement);

    //label2Renderer = new THREE.CSS2DRenderer();
    //label2Renderer.setSize(window.innerWidth, window.innerHeight);
    //label2Renderer.domElement.className = 'label2Renderer';
    //document.getElementById('mainC').appendChild(label2Renderer.domElement);

    //cssLabelRenderer = new THREE.CSS3DRenderer();
    //cssLabelRenderer.setSize(window.innerWidth, window.innerHeight);
    //cssLabelRenderer.domElement.className = 'labelRenderer';
    //document.getElementById('mainC').appendChild(cssLabelRenderer.domElement);

    objMain.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 2, 200);
    objMain.camera.position.set(4000, 2000, 0);
    //objMain.camera.position.set(0, 0, 0);

    // controls

    objMain.controls = new THREE.OrbitControls(objMain.camera, objMain.labelRenderer.domElement);
    //objMain.controls.center.set(0, 0, 0);


    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    objMain.axesHelper = new THREE.AxesHelper(265);
    objMain.axesHelper.position.set(0, 0, 0);
    //scene.add(axesHelper);

    objMain.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    objMain.controls.dampingFactor = 0.25;

    objMain.controls.screenSpacePanning = false;

    objMain.controls.minDistance = 0.6;
    objMain.controls.maxDistance = 960;


    objMain.controls.maxPolarAngle = Math.PI / 2 - Math.PI / 6;
    //controls.maxPolarAngle = Math.PI / 2 + Math.PI / 6;
    objMain.controls.minPolarAngle = 0;
    var distance = 50;
    objMain.camera.position.set(1, Math.sin(0.4) * distance, Math.cos(0.4) * distance - 1);

    baozhatu.group = new THREE.Group();
    objMain.scene.add(baozhatu.group);

    baozhatu.group2 = new THREE.Group();
    objMain.scene.add(baozhatu.group2);

    baozhatu.group2.visible = false;

    // lights
    {
        objMain.light1 = new THREE.PointLight(0xffffff);
        objMain.light1.position.set(0, 90000, 0);
        objMain.light1.intensity = 0.5;
        objMain.scene.add(objMain.light1);
    }
    {
        objMain.light2 = new THREE.PointLight(0xffffff);
        objMain.light2.position.set(0, 90000, -180000);
        objMain.light2.intensity = 0.5;
        objMain.scene.add(objMain.light2);
    }
    {
        objMain.light3 = new THREE.PointLight(0xffffff);
        objMain.light3.position.set(180000, 90000, -180000);
        objMain.light3.intensity = 0.5;
        objMain.scene.add(objMain.light3);
    }
    {
        objMain.light4 = new THREE.PointLight(0xffffff);
        objMain.light4.position.set(180000, 90000, 180000);
        objMain.light4.intensity = 0.5;
        objMain.scene.add(objMain.light4);
    }
    objMain.setIntensity(0.5);
    //var light = new THREE.DirectionalLight(0x002288);
    //light.position.set(-1, -1, -1);
    //scene.add(light);

    //var light = new THREE.AmbientLight(0x222222);
    //scene.add(light);

    //
    objMain.raycaster = new THREE.Raycaster();
    objMain.raycaster.linePrecision = 0.2;

    objMain.mouse = new THREE.Vector2();

    document.addEventListener('click', objMain.onDocumentClick);

    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', objMain.onWindowResize, false);

    baozhatu.group.renderOrder = 0;
    // infoStream.loader();

    objMain.controls.rotateSpeed = 0.06;
    objMain.controls.panSpeed = 0.2;

    baozhatu.show();
    baozhatu.show2();
    //document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function animate() {
    if (true) {

        requestAnimationFrame(animate);
        objMain.render();
        objMain.labelRenderer.render(objMain.scene, objMain.camera);
    }
}

var baozhatu =
{
    group: null,
    show: function () {
        var manager = new THREE.LoadingManager();
        new THREE.MTLLoader(manager)
            .setPath('ObjTag/modezb/')
            .load('zhubian1.mtl', function (materials) {
                materials.preload();
                // materials.depthTest = false;
                new THREE.OBJLoader(manager)
                    .setMaterials(materials)
                    .setPath('ObjTag/modezb/')
                    .load('zhubian1.obj', function (object) {
                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                            if (object.children[iOfO].isMesh) {
                                for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                    //object.children[iOfO].material[mi].depthTest = false;
                                    object.children[iOfO].material[mi].side = THREE.FrontSide;
                                    //object.children[iOfO].material[mi].color = new THREE.Color(1.5, 1.5, 2);
                                }
                            }
                        }
                        object.position.y = 0;

                        object.rotateX(-Math.PI / 2);
                        object.rotateZ(-0.07);
                        // var position = { x: MercatorGetXbyLongitude(112.5782425), y: 0, z: -MercatorGetYbyLatitude(37.87923660278321) };
                        object.position.set(0, 0, 0);
                        object.scale.set(1.5, 1.5, 1.5);
                        //object.scale.set(1, 1, 1);
                        //object.castShadow = true;
                        //object.receiveShadow = true;
                        object.name = 'build1';
                        object.Tag = { name: '省公司', position: '', id: 'sgs' };
                        object.rotateX(Math.PI / 2);
                        baozhatu.group.add(object);
                    }, function () { }, function () { });
            });
    },
    group2: null,
    show2: function () {
        var manager = new THREE.LoadingManager();
        new THREE.MTLLoader(manager)
            .setPath('ObjTag/modelzbexplode/')
            .load('explode.mtl', function (materials) {
                materials.preload();
                // materials.depthTest = false;
                new THREE.OBJLoader(manager)
                    .setMaterials(materials)
                    .setPath('ObjTag/modelzbexplode/')
                    .load('explode.obj', function (object) {
                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                            if (object.children[iOfO].isMesh) {
                                for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                    //object.children[iOfO].material[mi].depthTest = false;
                                    object.children[iOfO].material[mi].side = THREE.FrontSide;
                                    //object.children[iOfO].material[mi].color = new THREE.Color(1.5, 1.5, 2);
                                }
                            }
                        }
                        object.position.y = 0;

                        object.rotateX(-Math.PI / 2);
                        object.rotateZ(-0.07);
                        // var position = { x: MercatorGetXbyLongitude(112.5782425), y: 0, z: -MercatorGetYbyLatitude(37.87923660278321) };
                        object.position.set(0, 0, 0);
                        object.scale.set(1.5, 1.5, 1.5);
                        //object.scale.set(1, 1, 1);
                        //object.castShadow = true;
                        //object.receiveShadow = true;
                        object.name = 'build1';
                        object.Tag = { name: '省公司', position: '', id: 'sgs' };
                        object.rotateX(Math.PI / 2);
                        baozhatu.group2.add(object);
                    }, function () { }, function () { });
            });
    }
};









