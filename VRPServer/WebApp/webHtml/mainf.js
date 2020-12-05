
var objMain =
{
    indexKey: '',
    state: '',
    receivedState: '',
    scene: null,
    renderer: null,
    labelRenderer: null,
    centerPosition: { lon: 112.573463, lat: 37.891474 },
    roadGroup: null,
    basePoint: null,
    playerGroup: null,
    carGroup: null,
    robotModel: null,
    cars: {},
    light1: null,
    controls: null,
    carsNames: null,
    PromoteState: -1,
    PromotePositions:
    {
        mile: null,
        yewu: null,
        volume: null,
        speed: null
    },
    diamondGeometry: null,
    mirrorCubeCamera: null,
    promoteDiamond: null,
    mainF:
    {
        drawLineOfFpToRoad: function (fp, group, color) {
            {
                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
                var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));
                var lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(start);
                lineGeometry.vertices.push(end);
                var lineMaterial = new THREE.LineBasicMaterial({ color: color });
                var line = new THREE.Line(lineGeometry, lineMaterial);
                group.add(line);
            }
        },
        lookAtPosition: function (fp) {

            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));

            var cc = new Complex(end.x - start.x, end.z - start.z);
            cc.toOne();


            //  cc.multiply(6);
            // object.rotateY(-cc.toAngle() + Math.PI / 2);

            //var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
            //var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
            //var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
            //var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
            //var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

            //var positons = [positon1, positon2, positon3, positon4, positon5];
            //var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
            //console.log('positons', positons);
            //var percentOfPosition = 0.25;
            //for (var i = 0; i < positons.length; i++) {
            //    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            //    var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
            //    var lineGeometry = new THREE.Geometry();
            //    lineGeometry.vertices.push(start);
            //    lineGeometry.vertices.push(end);
            //    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
            //    var line = new THREE.Line(lineGeometry, lineMaterial);
            //    objMain.scene.add(line);

            //    var model = objMain.cars[names[i]].clone();
            //    model.position.set(end.x, 0, end.z);
            //    model.scale.set(0.002, 0.002, 0.002);
            //    model.rotateY(-positons[i].toAngle());
            //    objMain.roadGroup.add(model);
            //}
            var minDistance = objMain.controls.minDistance * 1.1;
            var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
            {
                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

                objMain.controls.target.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
                objMain.camera.lookAt(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            }
        },
        initilizeCars: function (fp, color, key) {
            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
            var cc = new Complex(end.x - start.x, end.z - start.z);
            cc.toOne();

            var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
            var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
            var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
            var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
            var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

            var positons = [positon1, positon2, positon3, positon4, positon5];

            var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
            //   console.log('positons', positons);
            var percentOfPosition = 0.25;
            for (var i = 0; i < positons.length; i++) {
                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
                var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
                var lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(start);
                lineGeometry.vertices.push(end);
                var lineMaterial = new THREE.LineBasicMaterial({ color: color });
                var line = new THREE.Line(lineGeometry, lineMaterial);
                line.name = 'carRoad_' + key;
                line.userData = { objectType: 'carRoad', parent: key, index: (i + 0) };
                objMain.carGroup.add(line);

                var model = objMain.cars[names[i]].clone();
                model.name = names[i] + '_' + key;
                model.position.set(end.x, 0, end.z);
                model.scale.set(0.002, 0.002, 0.002);
                model.rotateY(-positons[i].toAngle());
                model.userData = { objectType: 'car', parent: key, index: names[i] };
                objMain.carGroup.add(model);
            }
        },
        lookTwoPositionCenter: function (p1, p2) {

            var start = p1;
            var end = p2;
            var lengthTwoPoint = objMain.mainF.getLength(start, end);
            if (lengthTwoPoint > 0.2) {
                var cc = new Complex(end.x - start.x, end.z - start.z);
                cc.toOne();
                var x1 = lengthTwoPoint / (1 / Math.tan(Math.PI / 6) - 1 / Math.tan(Math.PI * 42 / 180));
                var x2 = x1 / Math.tan(Math.PI * 42 / 180);
                var x3 = x2 + lengthTwoPoint / 2;
                var minDistance = x3 / Math.cos(Math.PI * 36 / 180);
            }
            //var minDistance = objMain.controls.minDistance * 1.1;
            var maxPolarAngle = Math.PI * 54 / 180;
            {
                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

                objMain.controls.target.set((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
                objMain.camera.lookAt((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
            }
        },
        getLength: function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
        },
        drawPanelOfPromotion: function (type) {

            var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
            for (var i = lengthOfObjs - 1; i >= 0; i--) {
                objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
            }
            var element = document.createElement('div');
            element.style.width = '10em';
            //element.style.marginLeft = 'calc(5em + 20px)';
            element.style.marginTop = '3em';
            element.style.border = '2px solid #ff0000';
            element.style.borderTopLeftRadius = '0.5em';
            element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            element.style.color = '#1504f6';

            var div2 = document.createElement('div');

            var b = document.createElement('b');
            b.innerHTML = '到[<span style="color:#05ffba">' + objMain.PromotePositions[type].Fp.FastenPositionName + '</span>]花费<span style="color:#05ffba">' + objMain.PromotePositions[type].Price.toFixed(2) + '</span>现金或汇兑购买红宝石。';
            div2.appendChild(b);

            var div3 = document.createElement('div');
            div3.style.textAlign = 'center';
            div3.style.width = '3em';
            div3.style.border = '2px inset #ffc403';
            div3.style.borderRadius = '0.3em';
            div3.style.marginTop = '4px';
            div3.style.marginBottom = '4px';
            div3.style.position = 'relative';
            div3.style.left = 'calc(100% - 3em - 4px)';

            var span = document.createElement('span');
            span.innerText = '执行';

            div3.onclick = function () {
                if (objMain.Task.state == '') {
                    throw 'task not select';
                }
                else if (objMain.Task.carSelect == '') {
                    alert('请选择要执行此任务的车辆');
                }
                else {
                    objMain.ws.send(JSON.stringify({ 'c': 'Promote', 'pType': objMain.Task.state, 'car': objMain.Task.carSelect }));
                    objMain.Task.state = '';
                    objMain.Task.carSelect = '';
                    objMain.mainF.removeF.removePanle('carsSelectionPanel');

                    objMain.mainF.removeF.clearGroup(objMain.promoteDiamond);
                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);

                }
            }

            div3.appendChild(span);

            element.appendChild(div2);
            element.appendChild(div3);

            var object = new THREE.CSS2DObject(element);
            var fp = objMain.PromotePositions[type].Fp;
            object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

            objMain.groupOfOperatePanle.add(object);


        },
        removeF:
        {
            removePanle: function (id) {
                //carsSelectionPanel
                while (document.getElementById(id) != null) {
                    document.getElementById(id).remove();
                }
            },
            clearGroup: function (group) {
                var startIndex = group.children.length - 1;
                for (var i = startIndex; i >= 0; i--) {
                    group.remove(group.children[i]);
                }
            }
        }
    },
    Task:
    {
        state: '',
        carSelect: ''
    },
    animation:
    {
        animateCameraByCarAndTask: function () {
            if (objMain.Task.state == 'mile') {
                if (objMain.Task.carSelect != '') {
                    var p1 = objMain.promoteDiamond.children[0].position;
                    var p2 = objMain.carGroup.getObjectByName(objMain.Task.carSelect).position;

                }
            }
        }
    },
    groupOfOperatePanle: null
};
var startA = function () {
    var connected = false;
    var wsConnect = 'ws://127.0.0.1:11001/websocket';
    var ws = new WebSocket(wsConnect);
    ws.onopen = function () {
        // Web Socket 已连接上，使用 send() 方法发送数据
        // ws.send("发送数据");
        {
            var mapRoadAndCrossMd5 = '';
            if (sessionStorage['maproadandcrossmd5'] == undefined) {

            }
            else {

                mapRoadAndCrossMd5 = sessionStorage['maproadandcrossmd5'];
            }
            ws.send(JSON.stringify({ c: 'MapRoadAndCrossMd5', mapRoadAndCrossMd5: mapRoadAndCrossMd5 }));
        }
        {
            var session = '';
            if (sessionStorage['session'] == undefined) {

            }
            else {

                session = sessionStorage['session'];
            }

            ws.send(JSON.stringify({ c: 'CheckSession', session: session }));
        }
        //   alert("数据发送中...");
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        // console.log(evt.data);
        var received_obj = JSON.parse(evt.data);
        switch (received_obj.c) {
            case 'setState':
                {
                    objMain.receivedState = received_obj.state;
                    switch (objMain.receivedState) {
                        case 'selectSingleTeamJoin':
                            {
                                selectSingleTeamJoinHtml();
                            }; break;
                        case 'OnLine':
                            {
                                set3DHtml();

                            }; break;
                        case 'WaitingToStart':
                            {
                                setWaitingToStart();
                            }; break;
                        case 'WaitingToGetTeam':
                            {
                                setWaitingToGetTeam();
                            }; break;
                    }
                }; break;
            case 'setSession':
                {
                    sessionStorage['session'] = received_obj.session;
                }; break;
            case 'TeamCreateFinish':
                {
                    //  alert();
                    console.log('提示', '队伍创建成功');
                    if (objMain.receivedState == 'WaitingToStart') {
                        //{"CommandStart":"182be0c5cdcd5072bb1864cdee4d3d6e","WebSocketID":3,"TeamNum":0,"c":"TeamCreateFinish"}
                        token.CommandStart = received_obj.CommandStart;
                        createTeam(received_obj)
                    }
                    //  sessionStorage['session'] = received_obj.session;
                }; break;
            case 'TeamJoinFinish':
                {
                    console.log('提示', '加入队伍成功');
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        joinTeamDetail(received_obj);
                    }
                }; break;
            case 'Alert':
                {
                    alert(received_obj.msg);
                }; break;
            case 'TeamJoinBroadInfo':
                {
                    //  broadTeamJoin(received_obj);
                    if (objMain.receivedState == 'WaitingToGetTeam' || objMain.receivedState == 'WaitingToStart') {
                        broadTeamJoin(received_obj);
                    }
                }; break;
            case 'TeamNumWithSecret':
                {
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        objMain.ws.send(received_msg);
                    }
                }; break;
            case 'GetPositionNotify':
                {
                    /*
                     * 此命令的获取比在objMain.state="OnLine" 之下发生
                     */
                    if (objMain.state == "OnLine") {

                    }
                    else {
                        var msg = 'GetPositionNotify出入时，状态为' + objMain.state;
                        throw (msg);
                        return;
                    }
                    console.log(evt.data);
                    var objInput = JSON.parse(evt.data);
                    objMain.basePoint = objInput.fp;
                    objMain.carsNames = objInput.carsNames;
                    objMain.indexKey = objInput.key;

                    //if (objMain.receivedState == 'WaitingToGetTeam') {
                    //    objMain.ws.send(received_msg);
                    //}
                    //小车用 https://threejs.org/examples/#webgl_animation_skinning_morph
                    //小车用 基地用 https://threejs.org/examples/#webgl_animation_cloth
                    // drawFlag(); 
                    drawPoint('green', objMain.basePoint, objMain.indexKey);
                    objMain.mainF.drawLineOfFpToRoad(objMain.basePoint, objMain.playerGroup, 'green');
                    objMain.mainF.lookAtPosition(objMain.basePoint);
                    objMain.mainF.initilizeCars(objMain.basePoint, 'green', objMain.indexKey);
                    drawCarBtns(objMain.carsNames);
                    //var model = objMain.robotModel.clone();
                    //model.position.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
                    //objMain.roadGroup.add(model);
                }; break;
            case 'MapRoadAndCrossJson':
                {
                    switch (received_obj.action) {
                        case 'start':
                            {
                                Map.roadAndCrossJson = '';
                            }; break;
                        case 'mid':
                            {
                                Map.roadAndCrossJson += received_obj.passStr;
                            }; break;
                        case 'end':
                            {
                                Map.roadAndCross = JSON.parse(Map.roadAndCrossJson);

                                Map.roadAndCrossJson = '';
                            }; break;
                    }
                }; break;
            case 'SetRobot':
                {
                    console.log(evt.data);
                    var f = function (received_obj, mIndex, field) {
                        var manager = new THREE.LoadingManager();
                        new THREE.MTLLoader(manager)
                            .loadTextOnly(received_obj.modelBase64[1], 'data:image/png;base64,' + received_obj.modelBase64[mIndex], function (materials) {
                                materials.preload();
                                // materials.depthTest = false;
                                new THREE.OBJLoader(manager)
                                    .setMaterials(materials)
                                    //.setPath('/Pic/')
                                    .loadTextOnly(received_obj.modelBase64[0], function (object) {
                                        console.log('o', object);
                                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                            if (object.children[iOfO].isMesh) {
                                                for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                                    //object.children[iOfO].material[mi].depthTest = false;
                                                    object.children[iOfO].material[mi].transparent = true;
                                                    object.children[iOfO].material[mi].opacity = 1;
                                                    object.children[iOfO].material[mi].side = THREE.FrontSide;
                                                    // console.log('color', object.children[iOfO].material[mi].color);
                                                    //switch (level) {
                                                    //    case 'high':
                                                    //        {
                                                    //            //FR-2HZB-033
                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1.5, 1, 1);
                                                    //        }; break;
                                                    //    case 'mid':
                                                    //        {
                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1, 1.5, 1);
                                                    //        }; break;
                                                    //    case 'low':
                                                    //        {
                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1, 1, 1.5);
                                                    //        }; break;
                                                    //}
                                                    //object.children[iOfO].material[mi].color = new THREE.Color(1, 1, 1);
                                                }
                                            }
                                        }
                                        console.log('o', object);
                                        objMain.cars[field] = object;
                                        //var model = objMain.car1.clone();
                                        //model.position.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
                                        //model.scale.set(0.002, 0.002, 0.002);
                                        //objMain.roadGroup.add(model);

                                    }, function () { }, function () { });
                            });
                    };
                    f(received_obj, 2, 'carA');
                    f(received_obj, 3, 'carB');
                    f(received_obj, 4, 'carC');
                    f(received_obj, 5, 'carD');
                    f(received_obj, 6, 'carE');
                }; break;
            case 'BradCastPromoteInfoNotify':
                {
                    throw (received_obj.c + '已作废');
                    // console.log(evt.data);
                    //if (received_obj.PromoteState == objMain.PromoteState) { }
                    //else {
                    //    objMain.PromoteState = received_obj.PromoteState;
                    //    objMain.ws.send(JSON.stringify({ c: 'PromoteMiles' }));
                    //}
                    /*
                     * 之前这里需要广播，前台验证。这里采用服务器session机制，在服务器进行判断。
                     * 
                     */
                }; break;
            case 'BradCastPromoteInfoDetail':
                {
                    //  switch (received_obj.
                    objMain.PromotePositions[received_obj.resultType] = received_obj;
                }; break;
            case 'SetDiamond':
                {
                    var manager = new THREE.LoadingManager();
                    new THREE.OBJLoader(manager)
                        .loadTextOnly(received_obj.DiamondObj, function (object) {
                            console.log('SetDiamond', object.children[0].geometry);
                            var geometry = object.children[0].geometry;
                            objMain.diamondGeometry = geometry;
                        }, function () { }, function () { });
                }; break;
        }
    };
    ws.onclose = function () {
        // 关闭 websocket
        alert("连接已关闭...");
    };
    objMain.ws = ws;
}
startA();

function animate() {
    {
        requestAnimationFrame(animate);
        if (objMain.state != objMain.receivedState) {
            objMain.state = objMain.receivedState;
        }
        if (objMain.state == 'OnLine') {

            //if (clothForRender.cloth != null) {

            //    clothForRender.simulate(Date.now());
            //    const p = clothForRender.cloth.particles;
            //    for (let i = 0, il = p.length; i < il; i++) {

            //        const v = p[i].position;

            //        clothForRender.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

            //    }
            //    clothForRender.clothGeometry.attributes.position.needsUpdate = true;
            //    clothForRender.clothGeometry.computeVertexNormals();
            //}
            for (var i = 0; i < objMain.playerGroup.children.length; i++) {
                if (objMain.playerGroup.children[i].isMesh) {
                    objMain.playerGroup.children[i].userData.animateDataYrq.simulate(Date.now());
                    objMain.playerGroup.children[i].userData.animateDataYrq.refresh(Date.now());
                }
            }
            for (var i = 0; i < objMain.carGroup.children.length; i++) {
                /*
                 * 初始化汽车的大小
                 */
                if (objMain.carGroup.children[i].isGroup) {
                    objMain.carGroup.children[i].scale.set(0.002, 0.002, 0.002);

                }
            }
            for (var i = 0; i < objMain.promoteDiamond.children.length; i++) {
                /*
                 * 初始化 砖石的大小
                 */
                if (objMain.promoteDiamond.children[i].isMesh) {
                    objMain.promoteDiamond.children[i].scale.set(0.2, 0.22, 0.2);

                }
            }


            var lengthOfPAndC = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);


            {
                /*放大选中的汽车*/
                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) * 0.001;
                if (scale < 0.002) {
                    scale = 0.002;
                }
                if (objMain.Task.carSelect != '') {
                    if (objMain.carGroup.getObjectByName(objMain.Task.carSelect) != undefined) {
                        objMain.carGroup.getObjectByName(objMain.Task.carSelect).scale.set(scale, scale, scale);
                    }
                }

            }
            {
                /*放大选中的砖石*/
                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 35;
                if (scale < 0.2) {
                    scale = 0.2;
                }
                if (objMain.Task.state == 'mile') {
                    objMain.promoteDiamond.children[0].scale.set(scale, scale * 1.1, scale);
                }
            }
            objMain.animation.animateCameraByCarAndTask();

            objMain.renderer.render(objMain.scene, objMain.camera);
            // render();
            objMain.labelRenderer.render(objMain.scene, objMain.camera);
            objMain.light1.position.set(objMain.camera.position.x, objMain.camera.position.y, objMain.camera.position.z);
        }
    }
}

var selectSingleTeamJoinHtml = function () {
    var text = "";
    text += "   <div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:20px;position:absolute;\" onclick=\"buttonClick('single')\">开始</div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:calc((100% + 40px)/3);position:absolute;\" onclick=\"buttonClick('team')\">组队</div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:calc((100% + 10px)/3 * 2);position:absolute;\" onclick=\"buttonClick('join')\">加入</div>";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}
var set3DHtml = function () {
    //var text = "";
    //text += "  <div>";
    //text += "            3D界面";
    //text += "        </div>";
    //document.getElementById('rootContainer').innerHTML = text;
    document.getElementById('rootContainer').innerHTML = '';

    //<div id="mainC" class="container" onclick="testTop();">
    //    <!--<img />-->
    //    <!--<a href="DAL/MapImage.ashx">DAL/MapImage.ashx</a>-->
    //    <img src="Pic/11.png" />
    //</div>
    var mainC = document.createElement('div');
    mainC.id = 'mainC';

    mainC.className = 'container';
    document.getElementById('rootContainer').appendChild(mainC);

    objMain.scene = new THREE.Scene();
    //objMain.scene.background = new THREE.Color(0x7c9dd4);
    //objMain.scene.fog = new THREE.FogExp2(0x7c9dd4, 0.2);

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

    objMain.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 30000);
    objMain.camera.position.set(4000, 2000, 0);
    objMain.camera.position.set(MercatorGetXbyLongitude(objMain.centerPosition.lon), 20, -MercatorGetYbyLatitude(objMain.centerPosition.lat));

    objMain.controls = new THREE.OrbitControls(objMain.camera, objMain.labelRenderer.domElement);
    objMain.controls.center.set(MercatorGetXbyLongitude(objMain.centerPosition.lon), 0, -MercatorGetYbyLatitude(objMain.centerPosition.lat));

    objMain.roadGroup = new THREE.Group();
    objMain.scene.add(objMain.roadGroup);

    objMain.playerGroup = new THREE.Group();
    objMain.scene.add(objMain.playerGroup);

    objMain.promoteDiamond = new THREE.Group();
    objMain.scene.add(objMain.promoteDiamond);

    objMain.carGroup = new THREE.Group();
    objMain.scene.add(objMain.carGroup);

    objMain.groupOfOperatePanle = new THREE.Group();
    objMain.scene.add(objMain.groupOfOperatePanle);

    {
        objMain.light1 = new THREE.PointLight(0xffffff);
        objMain.light1.position.set(-100, 300, -100);
        objMain.light1.intensity = 2;
        objMain.scene.add(objMain.light1);
    }

    {
        objMain.controls.minDistance = 3;
        objMain.controls.maxPolarAngle = Math.PI / 3;
    }

    var drawRoadInfomation = function (obj) {
        var obj = Map.roadAndCross.meshPoints;

        var positions = [];
        var colors = [];
        for (var i = 0; i < obj.length; i++) {
            positions.push(
                MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),
                MercatorGetXbyLongitude(obj[i][2]), 0, -MercatorGetYbyLatitude(obj[i][3]),
                MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
                MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
                MercatorGetXbyLongitude(obj[i][6]), 0, -MercatorGetYbyLatitude(obj[i][7]),
                MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),

            );

            {
                //var points = [];
                //points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1])));
                //points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][2]), 0, -MercatorGetYbyLatitude(obj[i][3])));
                //points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5])));
                //points.push(new THREE.Vector3(MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1])));
                //var geometryl = new THREE.BufferGeometry().setFromPoints(points);
                //var materiall = new THREE.LineBasicMaterial({ color: 0x0000ff });
                //var line = new THREE.Line(geometryl, materiall);
                //objMain.roadGroup.add(line);
            }
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

            this.array = null;

        }
        //  console.log('p', positions);
        //var vertices = new Float32Array(positions);
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
        //geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).onUpload(disposeArray));
        geometry.computeBoundingSphere();
        //var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var mesh = new THREE.Mesh(geometry, material);

        objMain.roadGroup.add(mesh);


        var edges = new THREE.EdgesGeometry(geometry);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0000FF }));
        objMain.roadGroup.add(line);
    };
    drawRoadInfomation(Map.roadAndCross.meshPoints);
}

var setWaitingToStart = function () {
    var text = "";
    text += "  <div>";
    text += "          请等待";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}

var createTeam = function (teamCreateFinish) {
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';

    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamCreateFinish.TeamNum));
    div1.appendChild(addDiv('队长：', teamCreateFinish.PlayerName));

    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '开始';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "1em";
    button.onclick = function () {
        // alert('开始事件还没有写写哦');
        //objMain.ws.se
        objMain.ws.send(token.CommandStart);
    };
    div2.appendChild(button);
    document.getElementById('rootContainer').appendChild(div2);
}

var joinTeamDetail = function (teamJoinFinish) {
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';

    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamJoinFinish.TeamNum));
    div1.appendChild(addDiv('队长：', teamJoinFinish.PlayerNames[0]));

    for (var i = 1; i < teamJoinFinish.PlayerNames.length; i++) {
        div1.appendChild(addDiv('队员：', teamJoinFinish.PlayerNames[i]));
    }

    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    document.getElementById('rootContainer').appendChild(div2);
}

var broadTeamJoin = function (teamJoinBroadInfo) {
    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    document.getElementById('rootContainer').children[0].appendChild(addDiv('队员：', teamJoinBroadInfo.PlayerName));
}

var setWaitingToGetTeam = function () {
    document.getElementById('rootContainer').innerHTML = '';
    //var roomNum = null;
    //do {
    //    roomNum = prompt('输入房间号', '0');
    //}
    //while (roomNum == null);
    //objMain.ws.send(roomNum);

    //<div style="text-align:center;margin-top:2em">
    //    <label >房间号</label><input id="roomNubInput" type="number" />
    //</div>
    //    <div style="text-align:center;">
    //        <button style="width: 5em;
    //    height: 3em;
    //    margin-top: 1em;">
    //            加入
    //        </button>
    //    </div>
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';
    div1.style.marginTop = '2em';
    var label = document.createElement('label');
    label.innerText = '房间号';
    var input = document.createElement('input');
    input.id = 'roomNumInput';
    input.type = 'number';
    div1.appendChild(label);
    div1.appendChild(input);
    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '加入';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "1em";
    button.onclick = function () {
        console.log('提示', '加入事件还没有写写哦');
        var roomNumInput = document.getElementById('roomNumInput').value;
        if (roomNumInput == '') {
            alert('不要输入空');
        }
        else {
            objMain.ws.send(roomNumInput);
            this.onclick = function () { };
        }
    };
    div2.appendChild(button);
    document.getElementById('rootContainer').appendChild(div2);
}

animate();

var buttonClick = function (v) {
    if (objMain.receivedState == 'selectSingleTeamJoin') {
        switch (v) {
            case 'single':
                {
                    objMain.ws.send(JSON.stringify({ c: 'JoinGameSingle' }));
                    //    objMain.ws = ws;
                }; break;
            case 'team':
                {
                    objMain.ws.send(JSON.stringify({ c: 'CreateTeam' }));
                }; break;
            case 'join':
                {
                    objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
                }; break;
        }
        objMain.receivedState = '';
    }
}

var token =
{
    CommandStart: '',

};
var Map =
{
    roadAndCrossJson: '',
    roadAndCross: null
};

function init3D() {

    //document.onmousemove = function (event) {
    //    if (clickState == 'addPolyLine') {
    //        if (editedLine.state == 'addPointToEnd') {
    //            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //            raycaster.setFromCamera(mouse, camera);

    //            //console.log('raycaster', raycaster);
    //            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

    //                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
    //                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

    //                editedLine.currentPoint = mousePosition;

    //            }
    //        }
    //        else if (editedLine.state == 'addPointToMid') {
    //            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //            raycaster.setFromCamera(mouse, camera);

    //            //console.log('raycaster', raycaster);
    //            if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

    //                var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
    //                var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };

    //                editedLine.currentPoint = mousePosition;

    //            }
    //        }
    //    }
    //    else if (clickState == 'addShape') {
    //        addShape.onmousemove(event);
    //    }
    //    else if (clickState == 'editingPanorama') {
    //        panorama.onmousemove(event);
    //    }
    //    else if (clickState == 'addLineControlPoint') {
    //        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //        raycaster.setFromCamera(mouse, camera);

    //        //console.log('raycaster', raycaster);
    //        if (Math.abs(raycaster.ray.direction.y) > 1e-7) {

    //            var delata = -raycaster.ray.origin.y / raycaster.ray.direction.y;
    //            var mousePosition = { x: raycaster.ray.origin.x + delata * raycaster.ray.direction.x, z: raycaster.ray.origin.z + delata * raycaster.ray.direction.z };
    //            drawTowerOfPowerLines.currentPoint = mousePosition;

    //        }
    //    }

    //}

    //document.onkeydown = function (e) {
    //    //keyCommand(e);
    //    keyCommand(e.keyCode);

    //}


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
        //light2 = new THREE.PointLight(0xffffff);
        //light2.position.set(0, 90000, -180000);
        //light2.intensity = 0.5;
        //scene.add(light2);
    }
    {
        //light3 = new THREE.PointLight(0xffffff);
        //light3.position.set(180000, 90000, -180000);
        //light3.intensity = 0.5;
        //scene.add(light3);
    }
    {
        //light4 = new THREE.PointLight(0xffffff);
        //light4.position.set(180000, 90000, 180000);
        //light4.intensity = 0.5;
        //scene.add(light4);
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


var clothForRender = {
    cloth: null, clothGeometry: null,

    simulate: function (now) {

        const DAMPING = 0.03;
        const DRAG = 1 - DAMPING;
        const windStrength = Math.cos(now / 7000) * 20 + 4000;
        const windForce = new THREE.Vector3(0, 0, 0);
        //windForce.set(Math.sin(now / 2000) , Math.cos(now / 3000) , Math.sin(now / 1000) );
        windForce.set(Math.sin(now / 2000), 0, Math.sin(now / 1000));
        windForce.normalize();
        windForce.multiplyScalar(windStrength);
        const tmpForce = new THREE.Vector3();

        const GRAVITY = 981 * 1.4;
        const MASS = 0.1;
        const gravity = new THREE.Vector3(0, - GRAVITY, 0).multiplyScalar(MASS);
        // Aerodynamics forces
        const TIMESTEP = 18 / 1000;
        const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

        const particles = this.cloth.particles;
        var clothGeometry = this.clothGeometry;
        var cloth = this.cloth;
        if (true) {

            let indx;
            const normal = new THREE.Vector3();
            const indices = clothGeometry.index;
            const normals = clothGeometry.attributes.normal;

            for (let i = 0, il = indices.count; i < il; i += 3) {

                for (let j = 0; j < 3; j++) {

                    indx = indices.getX(i + j);
                    normal.fromBufferAttribute(normals, indx);
                    tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
                    particles[indx].addForce(tmpForce);

                }

            }

        }

        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            particle.addForce(gravity);

            particle.integrate(TIMESTEP_SQ);

        }

        // Start Constraints

        const constraints = cloth.constraints;
        const il = constraints.length;

        const diff = new THREE.Vector3();
        function satisfyConstraints(p1, p2, distance) {

            diff.subVectors(p2.position, p1.position);
            const currentDist = diff.length();
            if (currentDist === 0) return; // prevents division by 0
            const correction = diff.multiplyScalar(1 - distance / currentDist);
            const correctionHalf = correction.multiplyScalar(0.5);
            p1.position.add(correctionHalf);
            p2.position.sub(correctionHalf);

        }
        for (let i = 0; i < il; i++) {

            const constraint = constraints[i];
            satisfyConstraints(constraint[0], constraint[1], constraint[2]);

        }


        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            const pos = particle.position;
            if (pos.y < - 250) {

                pos.y = - 250;

            }

        }

        const pinsFormation = [];
        pins = [6];

        pinsFormation.push(pins);

        pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        pinsFormation.push(pins);

        pins = [0];
        pinsFormation.push(pins);

        pins = []; // cut the rope ;)
        pinsFormation.push(pins);

        pins = [0, cloth.w]; // classic 2 pins
        pinsFormation.push(pins);

        pins = pinsFormation[1];
        // Pin Constraints

        for (let i = 0, il = pins.length; i < il; i++) {

            const xy = pins[i];
            const p = particles[xy];
            p.position.copy(p.original);
            p.previous.copy(p.original);

        }


    }
};
var drawPoint = function (color, fp, indexKey) {
    var that = this;
    this.windStrengthDelta = 0;
    const DAMPING = 0.03;
    const DRAG = 1 - DAMPING;
    const MASS = 0.1;
    const restDistance = 25;
    const xSegs = 10;
    const ySegs = 10;

    const clothFunction = plane(restDistance * xSegs, restDistance * ySegs);
    const cloth = new Cloth(xSegs, ySegs);
    this.cloth = cloth;

    const GRAVITY = 981 * 1.4;
    const gravity = new THREE.Vector3(0, - GRAVITY, 0).multiplyScalar(MASS);


    const TIMESTEP = 18 / 1000;
    const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

    let pins = [];

    const windForce = new THREE.Vector3(0, 0, 0);

    const ballPosition = new THREE.Vector3(0, - 45, 0);
    const ballSize = 60; //40

    const tmpForce = new THREE.Vector3();

    function plane(width, height) {

        return function (u, v, target) {

            const x = (u - 0.5) * width;
            const y = (v + 0.5) * height;
            const z = 0;

            target.set(x, y, z);

        };

    }

    function Particle(x, y, z, mass) {

        this.position = new THREE.Vector3();
        this.previous = new THREE.Vector3();
        this.original = new THREE.Vector3();
        this.a = new THREE.Vector3(0, 0, 0); // acceleration
        this.mass = mass;
        this.invMass = 1 / mass;
        this.tmp = new THREE.Vector3();
        this.tmp2 = new THREE.Vector3();

        // init

        clothFunction(x, y, this.position); // position
        clothFunction(x, y, this.previous); // previous
        clothFunction(x, y, this.original);

    }

    // Force -> Acceleration

    Particle.prototype.addForce = function (force) {

        this.a.add(
            this.tmp2.copy(force).multiplyScalar(this.invMass)
        );

    };


    // Performs Verlet integration

    Particle.prototype.integrate = function (timesq) {

        const newPos = this.tmp.subVectors(this.position, this.previous);
        newPos.multiplyScalar(DRAG).add(this.position);
        newPos.add(this.a.multiplyScalar(timesq));

        this.tmp = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.a.set(0, 0, 0);

    };


    const diff = new THREE.Vector3();

    function satisfyConstraints(p1, p2, distance) {

        diff.subVectors(p2.position, p1.position);
        const currentDist = diff.length();
        if (currentDist === 0) return; // prevents division by 0
        const correction = diff.multiplyScalar(1 - distance / currentDist);
        const correctionHalf = correction.multiplyScalar(0.5);
        p1.position.add(correctionHalf);
        p2.position.sub(correctionHalf);

    }

    function Cloth(w, h) {

        w = w || 10;
        h = h || 10;
        this.w = w;
        this.h = h;

        const particles = [];
        const constraints = [];

        // Create particles
        for (let v = 0; v <= h; v++) {

            for (let u = 0; u <= w; u++) {

                particles.push(
                    new Particle(u / w, v / h, 0, MASS)
                );

            }

        }

        // Structural

        for (let v = 0; v < h; v++) {

            for (let u = 0; u < w; u++) {

                constraints.push([
                    particles[index(u, v)],
                    particles[index(u, v + 1)],
                    restDistance
                ]);

                constraints.push([
                    particles[index(u, v)],
                    particles[index(u + 1, v)],
                    restDistance
                ]);

            }

        }

        for (let u = w, v = 0; v < h; v++) {

            constraints.push([
                particles[index(u, v)],
                particles[index(u, v + 1)],
                restDistance

            ]);

        }

        for (let v = h, u = 0; u < w; u++) {

            constraints.push([
                particles[index(u, v)],
                particles[index(u + 1, v)],
                restDistance
            ]);

        }


        // While many systems use shear and bend springs,
        // the relaxed constraints model seems to be just fine
        // using structural springs.
        // Shear
        // const diagonalDist = Math.sqrt(restDistance * restDistance * 2);


        // for (v=0;v<h;v++) {
        // 	for (u=0;u<w;u++) {

        // 		constraints.push([
        // 			particles[index(u, v)],
        // 			particles[index(u+1, v+1)],
        // 			diagonalDist
        // 		]);

        // 		constraints.push([
        // 			particles[index(u+1, v)],
        // 			particles[index(u, v+1)],
        // 			diagonalDist
        // 		]);

        // 	}
        // }


        this.particles = particles;
        this.constraints = constraints;

        function index(u, v) {

            return u + v * (w + 1);

        }

        this.index = index;

    }
    this.simulate = function (now) {
        //这里进行动画
        const windStrength = Math.cos(now / 7000) * 20 + 40 + that.windStrengthDelta;

        windForce.set(Math.sin(now / 2000), Math.cos(now / 3000), Math.sin(now / 1000));
        windForce.normalize();
        windForce.multiplyScalar(windStrength);

        // Aerodynamics forces

        const particles = cloth.particles;

        {

            let indx;
            const normal = new THREE.Vector3();
            const indices = clothGeometry.index;
            const normals = clothGeometry.attributes.normal;

            for (let i = 0, il = indices.count; i < il; i += 3) {

                for (let j = 0; j < 3; j++) {

                    indx = indices.getX(i + j);
                    normal.fromBufferAttribute(normals, indx);
                    tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
                    particles[indx].addForce(tmpForce);

                }

            }

        }

        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            particle.addForce(gravity);

            particle.integrate(TIMESTEP_SQ);

        }

        // Start Constraints

        const constraints = cloth.constraints;
        const il = constraints.length;

        for (let i = 0; i < il; i++) {

            const constraint = constraints[i];
            satisfyConstraints(constraint[0], constraint[1], constraint[2]);

        }

        // Ball Constraints




        // Floor Constraints

        for (let i = 0, il = particles.length; i < il; i++) {

            const particle = particles[i];
            const pos = particle.position;
            if (pos.y < - 250) {

                pos.y = - 250;

            }

        }

        // Pin Constraints

        for (let i = 0, il = pins.length; i < il; i++) {

            const xy = pins[i];
            const p = particles[xy];
            p.position.copy(p.original);
            p.previous.copy(p.original);

        }


    }

    const pinsFormation = [];
    pins = [6];

    pinsFormation.push(pins);

    pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pinsFormation.push(pins);

    pins = [0];
    pinsFormation.push(pins);

    pins = []; // cut the rope ;)
    pinsFormation.push(pins);

    pins = [0, cloth.w]; // classic 2 pins
    pinsFormation.push(pins);

    pins = pinsFormation[1];

    function togglePins() {

        pins = pinsFormation[~ ~(Math.random() * pinsFormation.length)];

    }
    this.clothMaterial = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        alphaTest: 0.5,
        color: color,
        emissive: color
    });
    var clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, cloth.w, cloth.h);
    this.clothGeometry = clothGeometry;

    object = new THREE.Mesh(clothGeometry, clothMaterial);
    object.userData['animateDataYrq'] = this;
    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0.1, -MercatorGetYbyLatitude(fp.Latitde));
    object.scale.set(0.0005, 0.0005, 0.0005)
    objMain.playerGroup.add(object);

    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.basePoint.Latitde))
    var end = new THREE.Vector3(MercatorGetXbyLongitude(objMain.basePoint.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(objMain.basePoint.positionLatitudeOnRoad))
    var cc = new Complex(end.x - start.x, end.z - start.z);
    cc.toOne();
    object.rotateY(-cc.toAngle() + Math.PI / 2);
    //alert('1');
    object.name = 'flag_' + indexKey;
    this.refresh = function () {
        const p = that.cloth.particles;
        for (let i = 0, il = p.length; i < il; i++) {

            const v = p[i].position;

            that.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

        }
        that.clothGeometry.attributes.position.needsUpdate = true;
        that.clothGeometry.computeVertexNormals();
    };
    return;
    //{
    //    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
    //    var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));
    //    var lineGeometry = new THREE.Geometry();
    //    lineGeometry.vertices.push(start);
    //    lineGeometry.vertices.push(end);
    //    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
    //    var line = new THREE.Line(lineGeometry, lineMaterial);
    //    objMain.scene.add(line);
    //}


    // var enterroad = end - start;
    //console.log('enterroad', enterroad);
    var initializeCars = function (fp) {
        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.basePoint.Latitde))
        var end = new THREE.Vector3(MercatorGetXbyLongitude(objMain.basePoint.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(objMain.basePoint.positionLatitudeOnRoad))
        var cc = new Complex(end.x - start.x, end.z - start.z);
        cc.toOne();

        var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
        var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
        var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
        var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
        var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

        var positons = [positon1, positon2, positon3, positon4, positon5];

        var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
        console.log('positons', positons);
        var percentOfPosition = 0.25;
        for (var i = 0; i < positons.length; i++) {
            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(start);
            lineGeometry.vertices.push(end);
            var lineMaterial = new THREE.LineBasicMaterial({ color: color });
            var line = new THREE.Line(lineGeometry, lineMaterial);
            objMain.scene.add(line);

            var model = objMain.cars[names[i]].clone();
            model.position.set(end.x, 0, end.z);
            model.scale.set(0.002, 0.002, 0.002);
            model.rotateY(-positons[i].toAngle());
            objMain.roadGroup.add(model);
        }
        var minDistance = objMain.controls.minDistance * 1.1;
        var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
    }




    //  cc.multiply(6);


    var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
    var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
    var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
    var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
    var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

    var positons = [positon1, positon2, positon3, positon4, positon5];
    var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
    console.log('positons', positons);
    var percentOfPosition = 0.25;
    for (var i = 0; i < positons.length; i++) {
        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
        var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(start);
        lineGeometry.vertices.push(end);
        var lineMaterial = new THREE.LineBasicMaterial({ color: color });
        var line = new THREE.Line(lineGeometry, lineMaterial);
        objMain.scene.add(line);

        var model = objMain.cars[names[i]].clone();
        model.position.set(end.x, 0, end.z);
        model.scale.set(0.002, 0.002, 0.002);
        model.rotateY(-positons[i].toAngle());
        objMain.roadGroup.add(model);
    }
    var minDistance = objMain.controls.minDistance * 1.1;
    var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
    //var kValue = planeLength
    {
        var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
        objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

        objMain.controls.target.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
        objMain.camera.lookAt(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);

        // var polarAngle = objMain.controls.getPolarAngle();
        //   objMain.camera.position.set(objMain.basePoint.MacatuoX, 10, -objMain.basePoint.MacatuoY - Math.tan(Math.PI / 6) * 10);

        objMain.camera.lookAt(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
    }
}
var drawCarBtns = function () {
    {
        var ff = function () {
            while (document.getElementById('taskOperatingPanel') != null) {
                document.getElementById('taskOperatingPanel').remove();
            }
            var divTaskOperatingPanel = document.createElement('div');
            divTaskOperatingPanel.id = 'taskOperatingPanel';
            //position: absolute;
            //z - index: 7;
            //right: 20px; border: none; width: 5em; color: green; top: calc(50 % - 4em - 28px)
            divTaskOperatingPanel.style.position = 'absolute';
            divTaskOperatingPanel.style.zIndex = '7';
            divTaskOperatingPanel.style.right = '20px';
            divTaskOperatingPanel.style.border = 'none';
            divTaskOperatingPanel.style.width = '5em';
            divTaskOperatingPanel.style.color = 'green';
            divTaskOperatingPanel.style.top = 'calc(50% - 5em - 32px)';

            var addItemToTaskOperatingPanle = function (btnName, clickF) {
                var div = document.createElement('div');
                div.style.width = 'calc(5em - 4px)';
                div.style.textAlign = 'center';
                div.style.border = '2px inset #ffc403';
                div.style.borderRadius = '0.3em';
                div.style.marginTop = '4px';
                div.style.marginBottom = '4px';
                div.style.background = 'rgba(0, 191, 255, 0.6)';
                var span = document.createElement('span');
                span.innerText = btnName;
                div.appendChild(span);
                //  <span id="carASpan">提升续航</span>

                div.onclick = function () { clickF(); }
                divTaskOperatingPanel.appendChild(div);
            }
            var showBtnEvent = function (show) {
                while (document.getElementById('carsSelectionPanel') != null) {
                    document.getElementById('carsSelectionPanel').remove();
                }
                if (!show) {
                    return;
                }
                var carsNames = objMain.carsNames;
                var divCreate = document.createElement('div');
                divCreate.id = 'carsSelectionPanel';
                divCreate.style.position = 'absolute';
                divCreate.style.width = '8em';
                divCreate.style.height = 'calc(6em + 48px)';
                divCreate.style.zIndex = '6';
                divCreate.style.left = '1em';
                divCreate.style.top = 'calc(50% - 20px - 2px - 3em)';
                divCreate.style.fontSize = '20px';
                divCreate.style.color = 'blue';
                divCreate.style.textShadow = '1px 1px 1px #000000';
                divCreate.style.borderColor = 'deepskyblue';

                var addChildren = function (carsNames) {
                    for (var i = 0; i < carsNames.length; i++) {
                        //text += "        <div style=\"width: calc(100% - 2px);";
                        //text += "        text-align: center;";
                        //text += "        border: 1px solid deepskyblue;";
                        //text += "        border-radius: 0.3em;";
                        //text += "        margin-top: 4px;";
                        //text += "        margin-bottom: 4px;\">";
                        //text += "            <span id=\"carASpan\">啊啊啊啊啊啊啊</span>";
                        //text += "        </div>";
                        var divChildOfItem = document.createElement('div');
                        divChildOfItem.style.width = 'calc(100% - 2px)';
                        divChildOfItem.style.textAlign = 'center';
                        divChildOfItem.style.border = '1px solid deepskyblue';
                        divChildOfItem.style.borderRadius = '0.3em';
                        divChildOfItem.style.marginTop = '4px';
                        divChildOfItem.style.marginBottom = '4px';
                        divChildOfItem.yrqTagIndex = i + 0;
                        //divChildOfItem.parentNode
                        divChildOfItem.onclick = function () {
                            //   alert(this.yrqTagIndex);
                            //console.log('parentNode', this);
                            //console.log('parentNode', this.parentNode);

                            for (var i = 0; i < 5; i++) {
                                //  console.log(i, this.parentNode.children[i]);

                                if (i == this.yrqTagIndex) {
                                    this.parentNode.children[i].style.border = '2px inset #ffc403';
                                    // alert('');
                                    while (document.getElementById('itemNodes2') != null) {
                                        document.getElementById('itemNodes2').remove();
                                    }

                                    var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
                                    objMain.Task.carSelect = names[i] + '_' + objMain.indexKey;

                                    objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
                                    /*
                                     * 以下方法用户绘制二级菜单
                                     */
                                    if (false) {
                                        var divCreate2 = document.createElement('div');
                                        divCreate2.id = 'itemNodes2';
                                        divCreate2.style.position = 'absolute';
                                        divCreate2.style.width = '3em';
                                        divCreate2.style.height = 'calc(6em + 48px)';
                                        divCreate2.style.zIndex = '6';
                                        divCreate2.style.left = '11em';
                                        //calc(50% - 20px - 2px - 3em);
                                        var emV = i.toString() + 'em';
                                        var pxV = (i * 12).toString() + 'px'
                                        divCreate2.style.top = 'calc(50% - 20px - 2px - 3em + ' + emV + ' + ' + pxV + ')';
                                        divCreate2.style.fontSize = '20px';
                                        divCreate2.style.color = 'blue';
                                        divCreate2.style.textShadow = '1px 1px 1px #000000';
                                        divCreate2.style.borderColor = 'deepskyblue';
                                        /*这里要显示条目*/
                                        var displays = ['属性', '任务'];
                                        for (var jj = 0; jj < 2; jj++) {
                                            var divChildOfItem2 = document.createElement('div');
                                            divChildOfItem2.style.width = 'calc(100% - 2px)';
                                            divChildOfItem2.style.textAlign = 'center';
                                            divChildOfItem2.style.border = '1px solid #ffc403';
                                            divChildOfItem2.style.borderRadius = '0.3em';
                                            divChildOfItem2.style.marginTop = '4px';
                                            divChildOfItem2.style.marginBottom = '4px';
                                            // divChildOfItem2.innerText = '啊啊';
                                            divCreate2.appendChild(divChildOfItem2);
                                            divChildOfItem2.yrqTagIndex = jj + 0;

                                            var spanOfItem2 = document.createElement('span');
                                            spanOfItem2.innerText = displays[jj];
                                            divChildOfItem2.appendChild(spanOfItem2);
                                            switch (jj) {
                                                case 0:
                                                    {
                                                        divChildOfItem2.onclick = function () {
                                                            alert('获取属性');
                                                        }
                                                    }; break;
                                                case 1:
                                                    {
                                                        divChildOfItem2.onclick = function () {
                                                            alert('获取任务');

                                                        }
                                                    }; break;
                                            }
                                        }
                                        document.body.appendChild(divCreate2);
                                    }
                                }
                                else {
                                    this.parentNode.children[i].style.border = '1px solid deepskyblue';
                                }
                            }
                            //                this.parentNode
                        }

                        var spanOfItem = document.createElement('span');
                        spanOfItem.innerText = carsNames[i];
                        divChildOfItem.appendChild(spanOfItem);
                        divCreate.appendChild(divChildOfItem);
                    }
                    if (false) {
                        var divChildOfItem = document.createElement('div');
                        divChildOfItem.style.width = '3em';
                        divChildOfItem.style.textAlign = 'center';
                        divChildOfItem.style.border = '1px solid gray';
                        divChildOfItem.style.borderRadius = '0.3em';
                        divChildOfItem.style.marginTop = '4px';
                        divChildOfItem.style.marginBottom = '4px';
                        divChildOfItem.style.color = 'yellowgreen';

                        var spanOfItem = document.createElement('span');
                        spanOfItem.innerText = '隐藏';
                        divChildOfItem.appendChild(spanOfItem);

                        divChildOfItem.onclick = function () {
                            this.onclick = function () {
                                divCreate.innerHTML = '';
                                addChildren(carsNames);
                                this.style.width = '3em';
                                this.children[0].innerText = '隐藏';
                            }
                            while (divCreate.children.length > 1) {
                                divCreate.removeChild(divCreate.children[0]);
                            }
                            this.style.width = '5em';
                            this.children[0].innerText = '显示车辆';
                            while (document.getElementById('itemNodes2') != null) {
                                document.getElementById('itemNodes2').remove();
                            }
                        }
                        divCreate.appendChild(divChildOfItem);
                    }
                }
                addChildren(carsNames);

                document.body.appendChild(divCreate);
            }
            addItemToTaskOperatingPanle('收集金钱', function () { showBtnEvent(); alert('收集金钱'); });
            addItemToTaskOperatingPanle('使用物品', function () {
                showBtnEvent(false);
                objMain.mainF.lookAtPosition(objMain.basePoint);
            });
            addItemToTaskOperatingPanle('提升续航', function () {
                showBtnEvent(true);
                objMain.Task.state = 'mile'
                alert('提升续航');
                console.log('点击', '提升续航');
                var startIndex = objMain.promoteDiamond.children.length - 1;
                for (var i = startIndex; i >= 0; i--) {
                    objMain.promoteDiamond.remove(objMain.promoteDiamond.children[i]);
                }
                //var mirrorCubeCamera = new THREE.CubeCamera(0.1, 5000, 512);
                //objMain.scene.add(mirrorCubeCamera);
                var geometry = objMain.diamondGeometry;
                var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5, depthWrite: true });

                var diamond = new THREE.Mesh(geometry, material);
                diamond.scale.set(0.2, 0.22, 0.2);
                diamond.position.set(MercatorGetXbyLongitude(objMain.PromotePositions.mile.Fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.PromotePositions.mile.Fp.Latitde));
                objMain.promoteDiamond.add(diamond);


                objMain.mainF.drawLineOfFpToRoad(objMain.PromotePositions.mile.Fp, objMain.promoteDiamond, 0xff0000);
                objMain.mainF.lookAtPosition(objMain.PromotePositions.mile.Fp);

                objMain.mainF.drawPanelOfPromotion(objMain.Task.state);
            });
            addItemToTaskOperatingPanle('提升业务', function () { showBtnEvent(); alert('使用物品'); });
            addItemToTaskOperatingPanle('提升续航', function () { showBtnEvent(); alert('使用物品'); });
            addItemToTaskOperatingPanle('提升续航', function () { showBtnEvent(); alert('使用物品'); });
            addItemToTaskOperatingPanle('收取税金', function () { showBtnEvent(); alert('使用物品'); });
            addItemToTaskOperatingPanle('打压对手', function () { showBtnEvent(); alert('使用物品'); });
            document.body.appendChild(divTaskOperatingPanel);
        };
        ff();
    }

}


var drawCarControlTable = function () {
    var divContainer = document.createElement('div');
    divContainer.style.position = '';
    divContainer.style.position = '';
}

/////////////
/*
 * 复数类
 */
function Complex(R, I) {
    if (isNaN(R) || isNaN(I)) { throw new TypeError('Complex params require Number'); }
    this.r = R;
    this.i = I;
}
// 加法
Complex.prototype.add = function (that) {
    return new Complex(this.r + that.r, this.i + that.i);
};
// 负运算
Complex.prototype.neg = function () {
    return new Complex(-this.r, -this.i);
};
// 乘法
Complex.prototype.multiply = function (that) {
    if (this.r === that.r && this.i + that.i === 0) {
        return this.r * this.r + this.i * this.i
    }
    return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
};
// 除法
Complex.prototype.divide = function (that) {
    var a = this.r;
    var b = this.i;
    var c = that.r;
    var d = that.i;
    return new Complex((a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d));
};
// 模长
Complex.prototype.mo = function () {
    return Math.sqrt(this.r * this.r + this.i * this.i);
};
//变为角度
Complex.prototype.toAngle = function () {

    if (this.r > 1e-6) {
        var angle = Math.atan(this.i / this.r);
        angle = (angle + Math.PI * 4) % (Math.PI * 2);
        return angle;
    }
    else if (this.r < -1e-6) {
        var angle = Math.atan(this.i / this.r);
        angle = (angle + Math.PI * 3) % (Math.PI * 2);
        return angle;
    }
    else if (this.i > 0) {
        return Math.PI / 2;
    }
    else if (this.i < 0) {
        return Math.PI * 3 / 2;
    }
    else {
        throw 'this Complex can not change to angle';
    }
    return Math.sqrt(this.r * this.r + this.i * this.i);
};
Complex.prototype.toOne = function () {
    var m = this.mo();
    this.r /= m, this.i /= m;
    //return Math.sqrt(this.r * this.r + this.i * this.i);
};
Complex.prototype.toString = function () {
    return "{" + this.r + "," + this.i + "}";
};
// 判断两个复数相等
Complex.prototype.equal = function (that) {
    return that !== null && that.constructor === Complex && this.r === that.r && this.i === that.i;
};
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
// 从普通字符串解析为复数
Complex.parse = function (s) {
    try {
        var execres = Complex.parseRegExp.exec(s);
        return new Complex(parseFloat(execres[1]), parseFloat(execres[2]));
    } catch (e) {
        throw new TypeError("Can't parse '" + s + "'to a complex");
    }
};
Complex.parseRegExp = /^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/;
// console.log(/^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/.exec('{2,3}'));
// 示例代码 

////////////