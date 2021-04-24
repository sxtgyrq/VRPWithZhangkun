//function TaskClass(s, c) {
//    this._state = s;
//    this._carSelect = c;
//}
//TaskClass.prototype.__defineGetter__("state", function () {
//    //ShowGetInfo("Age"); 
//    return this._state;
//});

//TaskClass.prototype.__defineSetter__("state", function (val) {
//    if (this._state == 'getTax' && val != 'getTax') {
//        Tax.trunOffAnimate();
//    }
//    else if (this._state != 'getTax' && val == 'getTax') {
//        Tax.trunOnAnimate();
//    }
//    this._state = val;

//    //ShowSetInfo("Age");
//});

//TaskClass.prototype.__defineGetter__("carSelect", function () {
//    //ShowGetInfo("Age"); 
//    return this._carSelect;
//});

//TaskClass.prototype.__defineSetter__("carSelect", function (val) {
//    this._carSelect = val;
//    //ShowSetInfo("Age");
//});

//var objMain =
//{
//    debug: true,
//    indexKey: '',
//    displayName: '',
//    MoneyForSave: 0,
//    Money: 0,
//    state: '',
//    receivedState: '',
//    scene: null,
//    renderer: null,
//    labelRenderer: null,
//    centerPosition: { lon: 112.573463, lat: 37.891474 },
//    roadGroup: null,
//    basePoint: null,
//    othersBasePoint: {},
//    playerGroup: null,
//    carGroup: null,
//    collectGroup: null,
//    getOutGroup: null,
//    robotModel: null,
//    cars: {},
//    rmbModel: {},
//    leaveGameModel: null,
//    profileModel: null,
//    light1: null,
//    controls: null,
//    raycaster: null,
//    mouse: null,
//    carsNames: null,
//    carsAnimateData: {},
//    PromoteState: -1,
//    PromotePositions:
//    {
//        mile: null,
//        business: null,
//        volume: null,
//        speed: null
//    },
//    PromoteList: ['mile', 'business', 'volume', 'speed'],
//    PromoteDiamondCount:
//    {
//        mile: 0,
//        business: 0,
//        volume: 0,
//        speed: 0
//    },
//    CollectPosition: null,
//    diamondGeometry: null,
//    mirrorCubeCamera: null,
//    promoteDiamond: null,
//    columnGroup: null,
//    mainF:
//    {
//        drawLineOfFpToRoad: function (fp, group, color, lineName) {
//            {
//                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//                var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));
//                var lineGeometry = new THREE.Geometry();
//                lineGeometry.vertices.push(start);
//                lineGeometry.vertices.push(end);
//                var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//                var line = new THREE.Line(lineGeometry, lineMaterial);
//                line.name = 'approach_' + lineName;
//                group.add(line);
//            }
//        },
//        lookAtPosition: function (fp) {

//            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));

//            var cc = new Complex(end.x - start.x, end.z - start.z);
//            cc.toOne();


//            //  cc.multiply(6);
//            // object.rotateY(-cc.toAngle() + Math.PI / 2);

//            //var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
//            //var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
//            //var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
//            //var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
//            //var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

//            //var positons = [positon1, positon2, positon3, positon4, positon5];
//            //var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
//            //console.log('positons', positons);
//            //var percentOfPosition = 0.25;
//            //for (var i = 0; i < positons.length; i++) {
//            //    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//            //    var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
//            //    var lineGeometry = new THREE.Geometry();
//            //    lineGeometry.vertices.push(start);
//            //    lineGeometry.vertices.push(end);
//            //    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//            //    var line = new THREE.Line(lineGeometry, lineMaterial);
//            //    objMain.scene.add(line);

//            //    var model = objMain.cars[names[i]].clone();
//            //    model.position.set(end.x, 0, end.z);
//            //    model.scale.set(0.002, 0.002, 0.002);
//            //    model.rotateY(-positons[i].toAngle());
//            //    objMain.roadGroup.add(model);
//            //}
//            var minDistance = objMain.controls.minDistance * 1.1;
//            var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
//            {
//                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
//                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

//                objMain.controls.target.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//                objMain.camera.lookAt(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//            }
//        },
//        initilizeCars: function (fp, color, key, isSelf) {
//            if (isSelf == undefined) {
//                isSelf = true;
//            }
//            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
//            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
//            var cc = new Complex(end.x - start.x, end.z - start.z);
//            cc.toOne();

//            var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
//            var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
//            var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
//            var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
//            var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

//            var positons = [positon1, positon2, positon3, positon4, positon5];

//            var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
//            //   console.log('positons', positons);
//            var percentOfPosition = 0.25;
//            for (var i = 0; i < positons.length; i++) {
//                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//                var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
//                var lineGeometry = new THREE.Geometry();
//                lineGeometry.vertices.push(start);
//                lineGeometry.vertices.push(end);
//                var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//                var line = new THREE.Line(lineGeometry, lineMaterial);
//                line.name = 'carRoad' + 'ABCDE'[i] + '_' + key;
//                if (key === objMain.indexKey) {
//                    isSelf = true;
//                }

//                line.userData = { objectType: 'carRoad', parent: key, index: (i + 0) };
//                objMain.carGroup.add(line);
//                var model = null;
//                if (isSelf) {
//                    model = objMain.cars[names[i]].clone();
//                }
//                else {
//                    model = objMain.cars['carO'].clone();
//                }
//                model.name = names[i] + '_' + key;
//                model.position.set(end.x, 0, end.z);
//                model.scale.set(0.002, 0.002, 0.002);
//                model.rotateY(-positons[i].toAngle());
//                model.userData = { objectType: 'car', parent: key, index: names[i] };
//                objMain.carGroup.add(model);

//            }
//        },
//        lookTwoPositionCenter: function (p1, p2) {

//            var start = p1;
//            var end = p2;
//            var lengthTwoPoint = objMain.mainF.getLength(start, end);
//            if (lengthTwoPoint > 0.2) {
//                var cc = new Complex(end.x - start.x, end.z - start.z);
//                cc.toOne();
//                var x1 = lengthTwoPoint / (1 / Math.tan(Math.PI / 6) - 1 / Math.tan(Math.PI * 42 / 180));
//                var x2 = x1 / Math.tan(Math.PI * 42 / 180);
//                var x3 = x2 + lengthTwoPoint / 2;
//                var minDistance = x3 / Math.cos(Math.PI * 36 / 180);
//            }
//            //var minDistance = objMain.controls.minDistance * 1.1;
//            var maxPolarAngle = Math.PI * 54 / 180;
//            {
//                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
//                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

//                objMain.controls.target.set((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
//                objMain.camera.lookAt((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
//            }
//        },
//        getLength: function (p1, p2) {
//            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
//        },
//        drawPanelOfPromotion: function (type, endF) {

//            var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
//            for (var i = lengthOfObjs - 1; i >= 0; i--) {
//                objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
//            }
//            var element = document.createElement('div');
//            element.style.width = '10em';
//            //element.style.marginLeft = 'calc(5em + 20px)';
//            element.style.marginTop = '3em';
//            var color = '#ff0000';
//            var colorName = '红';
//            switch (type) {
//                case 'mile':
//                    {
//                        color = '#ff0000';
//                        colorName = '红';
//                    }; break;
//                case 'business': {
//                    color = '#00ff00';
//                    colorName = '绿';
//                }; break;
//                case 'volume': {

//                    color = '#0000ff';
//                    colorName = '蓝';
//                }; break;
//                case 'speed': {

//                    color = '#000000';
//                    colorName = '黑';
//                }; break;
//            }
//            element.style.border = '2px solid ' + color;
//            element.style.borderTopLeftRadius = '0.5em';
//            element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//            element.style.color = '#1504f6';

//            var div2 = document.createElement('div');

//            var b = document.createElement('b');
//            b.innerHTML = '到[<span style="color:#05ffba">' + objMain.PromotePositions[type].Fp.FastenPositionName + '</span>]花费<span style="color:#05ffba">' + (objMain.PromotePositions[type].Price / 100).toFixed(2) + '</span>现金或汇兑购买' + colorName + '宝石。';
//            div2.appendChild(b);

//            var div3 = document.createElement('div');
//            div3.style.textAlign = 'center';
//            div3.style.width = '3em';
//            div3.style.border = '2px inset #ffc403';
//            div3.style.borderRadius = '0.3em';
//            div3.style.marginTop = '4px';
//            div3.style.marginBottom = '4px';
//            div3.style.position = 'relative';
//            div3.style.left = 'calc(100% - 3em - 4px)';

//            var span = document.createElement('span');
//            span.innerText = '执行';

//            //div3.onclick = function () {
//            //    if (objMain.Task.state == '') {
//            //        throw 'task not select';
//            //    }
//            //    else if (objMain.Task.carSelect == '') {
//            //        alert('请选择要执行此任务的车辆');
//            //    }
//            //    else {
//            //        objMain.ws.send(JSON.stringify({ 'c': 'Promote', 'pType': objMain.Task.state, 'car': objMain.Task.carSelect }));
//            //        objMain.Task.state = '';
//            //        objMain.Task.carSelect = '';
//            //        objMain.mainF.removeF.removePanle('carsSelectionPanel');
//            //        carAbility.clear();

//            //        objMain.mainF.removeF.clearGroup(objMain.promoteDiamond);
//            //        objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            //        endF();
//            //    }
//            //}
//            //div3.addEventListener("click", function () {
//            //    if (objMain.Task.state == '') {
//            //        throw 'task not select';
//            //    }
//            //    else if (objMain.Task.carSelect == '') {
//            //        alert('请选择要执行此任务的车辆');
//            //    }
//            //    else {
//            //        objMain.ws.send(JSON.stringify({ 'c': 'Promote', 'pType': objMain.Task.state, 'car': objMain.Task.carSelect }));
//            //        objMain.Task.state = '';
//            //        objMain.Task.carSelect = '';
//            //        objMain.mainF.removeF.removePanle('carsSelectionPanel');
//            //        carAbility.clear();

//            //        objMain.mainF.removeF.clearGroup(objMain.promoteDiamond);
//            //        objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            //        endF();
//            //    }
//            //}, false);
//            // div3.addEventListener('',
//            //['click', 'touchmove'].forEach(function (e) {
//            //    div3.addEventListener(e, mouseMoveHandler);
//            //});

//            //div3.appendChild(span);

//            element.appendChild(div2);
//            element.appendChild(div3);

//            var object = new THREE.CSS2DObject(element);
//            var fp = objMain.PromotePositions[type].Fp;
//            object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//            objMain.groupOfOperatePanle.add(object);


//        },
//        removeF:
//        {
//            removePanle: function (id) {
//                //carsSelectionPanel
//                while (document.getElementById(id) != null) {
//                    document.getElementById(id).remove();
//                }
//            },
//            clearGroup: function (group) {
//                var startIndex = group.children.length - 1;
//                for (var i = startIndex; i >= 0; i--) {
//                    group.remove(group.children[i]);
//                }
//            }
//        },
//        refreshPromotionDiamondAndPanle: function (received_obj, endF) {
//            if (received_obj.resultType == objMain.Task.state) {
//                /*
//                 * 这里进行了Task的状态验证，确保3D资源没有加载前，不会调用此方法
//                 */
//                if (objMain.state == "OnLine") {
//                    var startIndex = objMain.promoteDiamond.children.length - 1;
//                    for (var i = startIndex; i >= 0; i--) {
//                        objMain.promoteDiamond.remove(objMain.promoteDiamond.children[i]);
//                    }
//                    var color = 0x000000;
//                    switch (received_obj.resultType) {
//                        case 'mile':
//                            {
//                                color = 0xff0000;
//                            }; break;
//                        case 'business':
//                            {
//                                color = 0x00ff00;
//                            }; break;
//                        case 'volume':
//                            {
//                                color = 0x0000ff;
//                            }; break;
//                        case 'speed':
//                            {
//                                color = 0x000000;
//                            }; break;
//                    }
//                    //var mirrorCubeCamera = new THREE.CubeCamera(0.1, 5000, 512);
//                    //objMain.scene.add(mirrorCubeCamera);
//                    var geometry = objMain.diamondGeometry;
//                    var material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5, depthWrite: true });

//                    var diamond = new THREE.Mesh(geometry, material);
//                    diamond.userData.endF = endF;
//                    diamond.name = 'diamond' + '_' + received_obj.resultType;
//                    diamond.scale.set(0.2, 0.22, 0.2);
//                    diamond.position.set(MercatorGetXbyLongitude(objMain.PromotePositions[received_obj.resultType].Fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.PromotePositions[received_obj.resultType].Fp.Latitde));

//                    objMain.promoteDiamond.add(diamond);


//                    objMain.mainF.drawLineOfFpToRoad(objMain.PromotePositions[received_obj.resultType].Fp, objMain.promoteDiamond, color);
//                    if (objMain.Task.carSelect == '') {
//                        objMain.mainF.lookAtPosition(objMain.PromotePositions[received_obj.resultType].Fp);
//                    }
//                    else {
//                        objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
//                    }
//                    objMain.mainF.drawPanelOfPromotion(objMain.Task.state, endF);
//                }
//            }
//        },
//        refreshCollectAndPanle: function (endF) {
//            if (objMain.state == "OnLine") {
//                var startIndex = objMain.collectGroup.children.length - 1;
//                for (var i = startIndex; i >= 0; i--) {
//                    objMain.collectGroup.remove(objMain.collectGroup.children[i]);
//                }
//                var model;

//                switch (objMain.CollectPosition.collectMoney / 100) {
//                    case 5:
//                        {
//                            model = objMain.rmbModel['rmb5'].clone();
//                        }; break;
//                    case 10:
//                        {
//                            model = objMain.rmbModel['rmb10'].clone();
//                        }; break;
//                    case 20:
//                        {
//                            model = objMain.rmbModel['rmb20'].clone();
//                        }; break;
//                    case 50:
//                        {
//                            model = objMain.rmbModel['rmb50'].clone();
//                        }; break;
//                    case 100:
//                        {
//                            model = objMain.rmbModel['rmb100'].clone();
//                        }; break;
//                }
//                // model.name = names[i] + '_' + key;
//                //model.position.set(end.x, 0, end.z);
//                // model.scale.set(0.002, 0.002, 0.002);
//                //model.rotateY(-positons[i].toAngle());
//                //model.userData = { objectType: 'car', parent: key, index: names[i] };
//                model.position.set(MercatorGetXbyLongitude(objMain.CollectPosition.Fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.CollectPosition.Fp.Latitde));
//                objMain.collectGroup.add(model);

//                var color = 0xFFD700;

//                objMain.mainF.drawLineOfFpToRoad(objMain.CollectPosition.Fp, objMain.collectGroup, color);
//                if (objMain.Task.state == 'collect') {
//                    if (objMain.Task.carSelect == '') {
//                        objMain.mainF.lookAtPosition(objMain.CollectPosition.Fp);
//                    }
//                    else {
//                        objMain.mainF.lookTwoPositionCenter(objMain.collectGroup.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
//                    }
//                }
//                if (objMain.Task.state == 'collect') {
//                    objMain.mainF.drawPanelOfCollect(endF);
//                }

//                //var startIndex = objMain.promoteDiamond.children.length - 1;
//                //for (var i = startIndex; i >= 0; i--) {
//                //    objMain.promoteDiamond.remove(objMain.promoteDiamond.children[i]);
//                //}
//                //var color = 0x000000;
//                //switch (received_obj.resultType) {
//                //    case 'mile':
//                //        {
//                //            color = 0xff0000;
//                //        }; break;
//                //    case 'business':
//                //        {
//                //            color = 0x00ff00;
//                //        }; break;
//                //    case 'volume':
//                //        {
//                //            color = 0x0000ff;
//                //        }; break;
//                //    case 'speed':
//                //        {
//                //            color = 0x000000;
//                //        }; break;
//                //}
//                ////var mirrorCubeCamera = new THREE.CubeCamera(0.1, 5000, 512);
//                ////objMain.scene.add(mirrorCubeCamera);
//                //var geometry = objMain.diamondGeometry;
//                //var material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5, depthWrite: true });

//                //var diamond = new THREE.Mesh(geometry, material);
//                //diamond.scale.set(0.2, 0.22, 0.2);
//                //diamond.position.set(MercatorGetXbyLongitude(objMain.PromotePositions[received_obj.resultType].Fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.PromotePositions[received_obj.resultType].Fp.Latitde));
//                //objMain.promoteDiamond.add(diamond);


//                //objMain.mainF.drawLineOfFpToRoad(objMain.PromotePositions[received_obj.resultType].Fp, objMain.promoteDiamond, color);
//                //if (objMain.Task.carSelect == '') {
//                //    objMain.mainF.lookAtPosition(objMain.PromotePositions[received_obj.resultType].Fp);
//                //}
//                //else {
//                //    objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
//                //}
//                //objMain.mainF.drawPanelOfPromotion(objMain.Task.state);
//            }
//        },
//        drawPanelOfCollect: function (endF) {

//            var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
//            for (var i = lengthOfObjs - 1; i >= 0; i--) {
//                objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
//            }
//            var element = document.createElement('div');
//            element.style.width = '10em';
//            //element.style.marginLeft = 'calc(5em + 20px)';
//            element.style.marginTop = '3em';
//            var color = '#ff0000';
//            //var colorName = '红';
//            //switch (type) {
//            //    case 'mile':
//            //        {
//            //            color = '#ff0000';
//            //            colorName = '红';
//            //        }; break;
//            //    case 'business': {
//            //        color = '#00ff00';
//            //        colorName = '绿';
//            //    }; break;
//            //    case 'volume': {

//            //        color = '#0000ff';
//            //        colorName = '蓝';
//            //    }; break;
//            //    case 'speed': {

//            //        color = '#000000';
//            //        colorName = '黑';
//            //    }; break;

//            //}
//            element.style.border = '2px solid ' + color;
//            element.style.borderTopLeftRadius = '0.5em';
//            element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//            element.style.color = '#1504f6';

//            var div2 = document.createElement('div');

//            var b = document.createElement('b');
//            b.innerHTML = '到[<span style="color:#05ffba">' + objMain.CollectPosition.Fp.FastenPositionName + '</span>]回收<span style="color:#05ffba">' + (objMain.CollectPosition.collectMoney / 100).toFixed(2) + '×' + (objMain.FrequencyOfCollectReward / 100).toFixed(2) + '元</span>现金。';
//            div2.appendChild(b);

//            var div3 = document.createElement('div');
//            div3.style.textAlign = 'center';
//            div3.style.width = '3em';
//            div3.style.border = '2px inset #ffc403';
//            div3.style.borderRadius = '0.3em';
//            div3.style.marginTop = '4px';
//            div3.style.marginBottom = '4px';
//            div3.style.position = 'relative';
//            div3.style.left = 'calc(100% - 3em - 4px)';

//            var span = document.createElement('span');
//            span.innerText = '执行';

//            div3.onclick = function () {
//                if (objMain.Task.state == '') {
//                    throw 'task not select';
//                }
//                else if (objMain.Task.carSelect == '') {
//                    alert('请选择要执行此任务的车辆');
//                }
//                else {
//                    objMain.ws.send(JSON.stringify({ 'c': 'Collect', 'cType': 'findWork', 'car': objMain.Task.carSelect }));
//                    objMain.Task.state = '';
//                    objMain.Task.carSelect = '';
//                    carBtns.clearBtnInFrame();
//                    // objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                    carAbility.clear();
//                    // objMain.mainF.removeF.clearGroup(objMain.collectGroup);
//                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                    endF();

//                }
//            }

//            div3.appendChild(span);

//            element.appendChild(div2);
//            element.appendChild(div3);

//            var object = new THREE.CSS2DObject(element);
//            var fp = objMain.CollectPosition.Fp;
//            object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//            objMain.groupOfOperatePanle.add(object);


//        },
//        refreshAttackPanel: function () {
//            if (objMain.state == "OnLine") {
//                objMain.mainF.drawPanelOfAttackPanel();
//            }
//        },
//        drawPanelOfAttackPanel: function () {
//            var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
//            for (var i = lengthOfObjs - 1; i >= 0; i--) {
//                objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
//            }
//            for (var key in objMain.othersBasePoint) {
//                console.log(key, objMain.othersBasePoint[key]);
//                //Websitelogo = Websitelogo + '&' + '' + Key + '=' + Statistics_Website_logo[Key] + '';

//                var element = document.createElement('div');
//                element.style.width = '10em';
//                element.style.marginTop = '3em';
//                var color = '#ff0000';

//                element.style.border = '2px solid ' + color;
//                element.style.borderTopLeftRadius = '0.5em';
//                element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                element.style.color = '#1504f6';

//                var div2 = document.createElement('div');

//                var b = document.createElement('b');
//                b.innerHTML = '到[<span style="color:#05ffba">' + objMain.othersBasePoint[key].basePoint.FastenPositionName + '</span>]打压<span style="color:#05ffba">' + objMain.othersBasePoint[key].playerName + '</span>。';
//                div2.appendChild(b);

//                var div3 = document.createElement('div');
//                div3.style.textAlign = 'center';
//                div3.style.width = '3em';
//                div3.style.border = '2px inset #ffc403';
//                div3.style.borderRadius = '0.3em';
//                div3.style.marginTop = '4px';
//                div3.style.marginBottom = '4px';
//                div3.style.position = 'relative';
//                div3.style.left = 'calc(100% - 3em - 4px)';

//                var span = document.createElement('span');
//                span.innerText = '打压';
//                div3.CustomTag = objMain.othersBasePoint[key];
//                div3.onclick = function () {
//                    if (objMain.Task.state == '') {
//                        throw 'task not select';
//                    }
//                    else if (objMain.Task.carSelect == '') {
//                        alert('请选择要执行此任务的车辆');
//                    }
//                    else {
//                        objMain.ws.send(JSON.stringify({ 'c': 'Attack', 'car': objMain.Task.carSelect, 'TargetOwner': this.CustomTag.indexKey, 'Target': this.CustomTag.fPIndex }));
//                        objMain.Task.state = '';
//                        objMain.Task.carSelect = '';
//                        carBtns.clearBtnInFrame();
//                        //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                        carAbility.clear();
//                        // objMain.mainF.removeF.clearGroup(objMain.collectGroup);
//                        objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);

//                    }
//                }

//                div3.appendChild(span);

//                element.appendChild(div2);
//                element.appendChild(div3);

//                if (theLagestHoderKey.data[key] != undefined && theLagestHoderKey.data[key].ChangeTo == objMain.indexKey) {
//                    var div4 = document.createElement('div');
//                    div4.style.textAlign = 'center';
//                    div4.style.width = '5em';
//                    div4.style.border = '2px inset #ffc403';
//                    div4.style.borderRadius = '0.3em';
//                    div4.style.marginTop = '4px';
//                    div4.style.marginBottom = '4px';
//                    div4.style.position = 'relative';
//                    div4.style.left = 'calc(100% - 5em - 4px)';
//                    var spanText = document.createElement('span');
//                    spanText.innerText = '令其出场';
//                    div4.CustomTag = objMain.othersBasePoint[key];
//                    div4.onclick = function () {
//                        if (objMain.Task.state == '') {
//                            throw 'task not select';
//                        }
//                        else if (objMain.Task.carSelect == '') {
//                            alert('请选择要执行此任务的车辆');
//                        }
//                        else {
//                            objMain.ws.send(JSON.stringify({ 'c': 'Bust', 'car': objMain.Task.carSelect, 'TargetOwner': this.CustomTag.indexKey, 'Target': this.CustomTag.fPIndex }));
//                            // objMain.ws.send(JSON.stringify({ 'c': 'Donate', 'car': objMain.Task.carSelect, 'TargetOwner': this.CustomTag.indexKey, 'Target': this.CustomTag.fPIndex }));
//                            objMain.Task.state = '';
//                            objMain.Task.carSelect = '';
//                            carBtns.clearBtnInFrame();
//                            //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                            carAbility.clear();
//                            // objMain.mainF.removeF.clearGroup(objMain.collectGroup);
//                            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);

//                        }
//                    }
//                    div4.appendChild(spanText);
//                    element.appendChild(div4);
//                }
//                var object = new THREE.CSS2DObject(element);
//                var fp = objMain.othersBasePoint[key].basePoint;
//                object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                objMain.groupOfOperatePanle.add(object);
//            }
//        },
//        refreshTaxPanel: function () {
//            if (objMain.state == "OnLine") {
//                objMain.mainF.drawPanelOfTaxPanel();
//            }
//        },
//        drawPanelOfTaxPanel: function () {
//            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            // return;
//            for (var key in objMain.Tax) {
//                console.log(key, objMain.Tax[key]);
//                //Websitelogo = Websitelogo + '&' + '' + Key + '=' + Statistics_Website_logo[Key] + '';

//                var element = document.createElement('div');
//                element.style.width = '10em';
//                element.style.marginTop = '3em';
//                var color = '#ff0000';
//                //var colorName = '红';
//                //switch (type) {
//                //    case 'mile':
//                //        {
//                //            color = '#ff0000';
//                //            colorName = '红';
//                //        }; break;
//                //    case 'business': {
//                //        color = '#00ff00';
//                //        colorName = '绿';
//                //    }; break;
//                //    case 'volume': { 
//                //        color = '#0000ff';
//                //        colorName = '蓝';
//                //    }; break;
//                //    case 'speed': { 
//                //        color = '#000000';
//                //        colorName = '黑';
//                //    }; break; 
//                //}
//                element.style.border = '2px solid ' + color;
//                element.style.borderTopLeftRadius = '0.5em';
//                element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                element.style.color = '#1504f6';

//                var div2 = document.createElement('div');

//                var b = document.createElement('b');
//                b.innerHTML = '到[<span style="color:#05ffba">' + objMain.Tax[key].fp.FastenPositionName + '</span>]收取<span style="color:#05ffba">' + objMain.Tax[key].tax + '保护费！</span>。';
//                div2.appendChild(b);

//                var div3 = document.createElement('div');
//                div3.style.textAlign = 'center';
//                div3.style.width = '3em';
//                div3.style.border = '2px inset #ffc403';
//                div3.style.borderRadius = '0.3em';
//                div3.style.marginTop = '4px';
//                div3.style.marginBottom = '4px';
//                div3.style.position = 'relative';
//                div3.style.left = 'calc(100% - 3em - 4px)';

//                var span = document.createElement('span');
//                span.innerText = '收取';
//                div3.CustomTag = objMain.Tax[key];
//                div3.onclick = function () {
//                    if (objMain.Task.state == '') {
//                        throw 'task not select';
//                    }
//                    else if (objMain.Task.carSelect == '') {
//                        alert('请选择要执行此任务的车辆');
//                    }
//                    else {
//                        objMain.ws.send(JSON.stringify({ 'c': 'Tax', 'car': objMain.Task.carSelect, 'Target': this.CustomTag.target }));
//                        objMain.Task.state = '';
//                        objMain.Task.carSelect = '';
//                        carBtns.clearBtnInFrame();
//                        // objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                        carAbility.clear();

//                        objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                    }
//                }

//                div3.appendChild(span);

//                element.appendChild(div2);
//                element.appendChild(div3);

//                var object = new THREE.CSS2DObject(element);
//                var fp = objMain.Tax[key].fp;
//                object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                objMain.groupOfOperatePanle.add(object);
//            }

//        },
//        refreshPromotePanel: function () {
//            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            //for (var key in objMain.PromoteDiamondCount)
//            {
//                //var AddBtnOfCommandReturn = function (element) {
//                //    var div3 = document.createElement('div');
//                //    div3.style.textAlign = 'center';
//                //    div3.style.width = 'calc(100% - 4px)';
//                //    div3.style.border = '2px inset #ffc403';
//                //    div3.style.borderRadius = '0.3em';
//                //    div3.style.marginTop = '4px';
//                //    div3.style.marginBottom = '4px';
//                //    div3.style.position = 'relative';
//                //    div3.style.left = 'calc(0%)';

//                //    var span = document.createElement('span');
//                //    span.innerText = '召回';
//                //    // div3.CustomTag = 'mile';
//                //    div3.onclick = function () {
//                //        if (objMain.Task.state == '') {
//                //            throw 'task not select';
//                //        }
//                //        else if (objMain.Task.carSelect == '') {
//                //            alert('请选择要执行此任务的车辆');
//                //        }
//                //        else {
//                //            objMain.ws.send(JSON.stringify({ 'c': 'SetCarReturn', 'car': objMain.Task.carSelect }));
//                //            objMain.Task.state = '';
//                //            objMain.Task.carSelect = '';
//                //            objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                //            carAbility.clear();
//                //            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                //        }
//                //    }

//                //    div3.appendChild(span);
//                //    element.appendChild(div3);
//                //}

//                if (objMain.PromoteDiamondCount.mile + objMain.PromoteDiamondCount.business + objMain.PromoteDiamondCount.volume + objMain.PromoteDiamondCount.speed < 0.5) {
//                    var element = document.createElement('div');

//                    element.style.width = '10em';
//                    element.style.marginTop = '3em';
//                    var color = '#ff0000';
//                    //var colorName = '红';
//                    //switch (type) {
//                    //    case 'mile':
//                    //        {
//                    //            color = '#ff0000';
//                    //            colorName = '红';
//                    //        }; break;
//                    //    case 'business': {
//                    //        color = '#00ff00';
//                    //        colorName = '绿';
//                    //    }; break;
//                    //    case 'volume': { 
//                    //        color = '#0000ff';
//                    //        colorName = '蓝';
//                    //    }; break;
//                    //    case 'speed': { 
//                    //        color = '#000000';
//                    //        colorName = '黑';
//                    //    }; break; 
//                    //}
//                    element.style.border = '2px solid ' + color;
//                    element.style.borderTopLeftRadius = '0.5em';
//                    element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                    element.style.color = '#1504f6';

//                    var div2 = document.createElement('div');

//                    var b = document.createElement('b');
//                    b.innerHTML = '你没有宝石';
//                    div2.appendChild(b);



//                    element.appendChild(div2);
//                    // element.appendChild(div3);
//                    //  AddBtnOfCommandReturn(element);

//                    var object = new THREE.CSS2DObject(element);
//                    var fp = objMain.basePoint;
//                    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                    objMain.groupOfOperatePanle.add(object);
//                }
//                else {
//                    var element = document.createElement('div');

//                    element.style.width = '10em';
//                    element.style.marginTop = '3em';
//                    var color = '#ff0000';
//                    //var colorName = '红';
//                    //switch (type) {
//                    //    case 'mile':
//                    //        {
//                    //            color = '#ff0000';
//                    //            colorName = '红';
//                    //        }; break;
//                    //    case 'business': {
//                    //        color = '#00ff00';
//                    //        colorName = '绿';
//                    //    }; break;
//                    //    case 'volume': { 
//                    //        color = '#0000ff';
//                    //        colorName = '蓝';
//                    //    }; break;
//                    //    case 'speed': { 
//                    //        color = '#000000';
//                    //        colorName = '黑';
//                    //    }; break; 
//                    //}
//                    element.style.border = '2px solid ' + color;
//                    element.style.borderTopLeftRadius = '0.5em';
//                    element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                    element.style.color = '#1504f6';

//                    var div2 = document.createElement('div');

//                    var b = document.createElement('b');
//                    b.innerHTML = '你现在有xx红石，xx蓝宝石，xx蓝宝石，xx黑宝石！点击柱状仓库，提升能力！';
//                    div2.appendChild(b);



//                    element.appendChild(div2);
//                    // element.appendChild(div3);
//                    if (false) {
//                        var clickBtn = function (that) {
//                            if (objMain.Task.state == '') {
//                                throw 'task not select';
//                            }
//                            else if (objMain.Task.carSelect == '') {
//                                alert('请选择要执行此任务的车辆');
//                            }
//                            else {
//                                objMain.ws.send(JSON.stringify({ 'c': 'Ability', 'car': objMain.Task.carSelect, 'pType': that.CustomTag }));
//                                objMain.Task.state = '';
//                                objMain.Task.carSelect = '';
//                                carBtns.clearBtnInFrame();
//                                //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                carAbility.clear();
//                                objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                            }
//                        }

//                        if (objMain.PromoteDiamondCount.mile > 0) {
//                            var div3 = document.createElement('div');
//                            div3.style.textAlign = 'center';
//                            div3.style.width = 'calc(100% - 4px)';
//                            div3.style.border = '2px inset #ffc403';
//                            div3.style.borderRadius = '0.3em';
//                            div3.style.marginTop = '4px';
//                            div3.style.marginBottom = '4px';
//                            div3.style.position = 'relative';
//                            div3.style.left = 'calc(0%)';

//                            var span = document.createElement('span');
//                            span.innerText = '提升续航';
//                            div3.CustomTag = 'mile';
//                            div3.onclick = function () {
//                                clickBtn(this);
//                            }

//                            div3.appendChild(span);
//                            element.appendChild(div3);
//                        }
//                        if (objMain.PromoteDiamondCount.business > 0) {
//                            var div3 = document.createElement('div');
//                            div3.style.textAlign = 'center';
//                            div3.style.width = 'calc(100% - 4px)';
//                            div3.style.border = '2px inset #ffc403';
//                            div3.style.borderRadius = '0.3em';
//                            div3.style.marginTop = '4px';
//                            div3.style.marginBottom = '4px';
//                            div3.style.position = 'relative';
//                            div3.style.left = 'calc(0%)';

//                            var span = document.createElement('span');
//                            span.innerText = '提升业务';
//                            div3.CustomTag = 'business';
//                            div3.onclick = function () {
//                                clickBtn(this);
//                            }

//                            div3.appendChild(span);
//                            element.appendChild(div3);
//                        }
//                        if (objMain.PromoteDiamondCount.volume > 0) {
//                            var div3 = document.createElement('div');
//                            div3.style.textAlign = 'center';
//                            div3.style.width = 'calc(100% - 4px)';
//                            div3.style.border = '2px inset #ffc403';
//                            div3.style.borderRadius = '0.3em';
//                            div3.style.marginTop = '4px';
//                            div3.style.marginBottom = '4px';
//                            div3.style.position = 'relative';
//                            div3.style.left = 'calc(0%)';

//                            var span = document.createElement('span');
//                            span.innerText = '提升容量';
//                            div3.CustomTag = 'volume';
//                            div3.onclick = function () {
//                                clickBtn(this);
//                            }

//                            div3.appendChild(span);
//                            element.appendChild(div3);
//                        }
//                        if (objMain.PromoteDiamondCount.speed > 0) {
//                            var div3 = document.createElement('div');
//                            div3.style.textAlign = 'center';
//                            div3.style.width = 'calc(100% - 4px)';
//                            div3.style.border = '2px inset #ffc403';
//                            div3.style.borderRadius = '0.3em';
//                            div3.style.marginTop = '4px';
//                            div3.style.marginBottom = '4px';
//                            div3.style.position = 'relative';
//                            div3.style.left = 'calc(0%)';

//                            var span = document.createElement('span');
//                            span.innerText = '提升速度';
//                            div3.CustomTag = 'speed';
//                            div3.onclick = function () {
//                                clickBtn(this);
//                            }

//                            div3.appendChild(span);
//                            element.appendChild(div3);
//                        }
//                    }
//                    //   AddBtnOfCommandReturn(element);

//                    var object = new THREE.CSS2DObject(element);
//                    var fp = objMain.basePoint;
//                    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                    objMain.groupOfOperatePanle.add(object);
//                }


//            }
//        },
//        refreshSetReturnPanel: function () {
//            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            //for (var key in objMain.PromoteDiamondCount)
//            {
//                var AddBtnOfCommandReturn = function (element) {
//                    var div3 = document.createElement('div');
//                    div3.style.textAlign = 'center';
//                    div3.style.width = 'calc(100% - 4px)';
//                    div3.style.border = '2px inset #ffc403';
//                    div3.style.borderRadius = '0.3em';
//                    div3.style.marginTop = '4px';
//                    div3.style.marginBottom = '4px';
//                    div3.style.position = 'relative';
//                    div3.style.left = 'calc(0%)';

//                    var span = document.createElement('span');
//                    span.innerText = '召回';
//                    // div3.CustomTag = 'mile';
//                    div3.onclick = function () {
//                        if (objMain.Task.state == '') {
//                            throw 'task not select';
//                        }
//                        else if (objMain.Task.carSelect == '') {
//                            alert('请选择要执行此任务的车辆');
//                        }
//                        else {
//                            objMain.ws.send(JSON.stringify({ 'c': 'SetCarReturn', 'car': objMain.Task.carSelect }));
//                            objMain.Task.state = '';
//                            objMain.Task.carSelect = '';
//                            carBtns.clearBtnInFrame();
//                            //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                            carAbility.clear();
//                            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                        }
//                    }

//                    div3.appendChild(span);
//                    element.appendChild(div3);
//                }

//                {
//                    var element = document.createElement('div');

//                    element.style.width = '10em';
//                    element.style.marginTop = '3em';
//                    var color = '#ff0000';
//                    //var colorName = '红';
//                    //switch (type) {
//                    //    case 'mile':
//                    //        {
//                    //            color = '#ff0000';
//                    //            colorName = '红';
//                    //        }; break;
//                    //    case 'business': {
//                    //        color = '#00ff00';
//                    //        colorName = '绿';
//                    //    }; break;
//                    //    case 'volume': { 
//                    //        color = '#0000ff';
//                    //        colorName = '蓝';
//                    //    }; break;
//                    //    case 'speed': { 
//                    //        color = '#000000';
//                    //        colorName = '黑';
//                    //    }; break; 
//                    //}
//                    element.style.border = '2px solid ' + color;
//                    element.style.borderTopLeftRadius = '0.5em';
//                    element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                    element.style.color = '#1504f6';

//                    var div2 = document.createElement('div');

//                    var b = document.createElement('b');
//                    b.innerHTML = '你没有宝石';
//                    div2.appendChild(b);



//                    element.appendChild(div2);
//                    // element.appendChild(div3);
//                    AddBtnOfCommandReturn(element);

//                    var object = new THREE.CSS2DObject(element);
//                    var fp = objMain.basePoint;
//                    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                    objMain.groupOfOperatePanle.add(object);
//                }


//            }
//        },
//        removeRole: function (roleID) {
//            var carRoadA_ID = 'carRoadA_' + roleID;
//            var carRoadB_ID = 'carRoadB_' + roleID;
//            var carRoadC_ID = 'carRoadC_' + roleID;
//            var carRoadD_ID = 'carRoadD_' + roleID;
//            var carRoadE_ID = 'carRoadE_' + roleID;

//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoadA_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoadB_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoadC_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoadD_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoadE_ID));

//            var carA_ID = 'carA_' + roleID;
//            var carB_ID = 'carB_' + roleID;
//            var carC_ID = 'carC_' + roleID;
//            var carD_ID = 'carD_' + roleID;
//            var carE_ID = 'carE_' + roleID;

//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carA_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carB_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carC_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carD_ID));
//            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carE_ID));


//            var approachId = 'approach_' + roleID;//;216596b5fddf7bc24f05bfebb2b1f10d
//            objMain.playerGroup.remove(objMain.playerGroup.getObjectByName(approachId));

//            var flagId = 'flag_' + roleID;//;216596b5fddf7bc24f05bfebb2b1f10d
//            objMain.playerGroup.remove(objMain.playerGroup.getObjectByName(flagId));

//            delete objMain.othersBasePoint[roleID];
//        },
//        drawDiamondCollected: function () {
//            var fp = objMain.basePoint;
//            var key = objMain.indexKey;
//            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
//            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
//            var cc = new Complex(end.x - start.x, end.z - start.z);
//            cc.toOne();

//            var positon1 = cc.multiply(new Complex(0, 1));
//            var positon2 = positon1.multiply(new Complex(0.5, 0.86602));
//            var positon3 = positon2.multiply(new Complex(0.5, 0.86602));
//            var positon4 = positon3.multiply(new Complex(0.5, 0.86602));

//            var positons = [positon1, positon2, positon3, positon4];

//            var names = ['BatteryMile', 'BatteryBusiness', 'BatteryVolume', 'BatterySpeed'];
//            var index = ['mile', 'business', 'volume', 'speed'];
//            var colors = [0xff0000, 0x00ff00, 0x0000ff, 0x000000];
//            //   console.log('positons', positons);
//            var percentOfPosition = 0.5;
//            for (var i = 0; i < positons.length; i++) {
//                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//                var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
//                //var lineGeometry = new THREE.Geometry();
//                //lineGeometry.vertices.push(start);
//                //lineGeometry.vertices.push(end);
//                //var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//                //var line = new THREE.Line(lineGeometry, lineMaterial);
//                //line.name = 'carRoad11' + 'ABCDE'[i] + '_' + key;
//                //line.userData = { objectType: 'carRoad', parent: key, index: (i + 0) };
//                //objMain.carGroup.add(line);
//                var mesh;
//                if (objMain.columnGroup.getObjectByName(names[i]) == undefined) {
//                    var geometryCylinder = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
//                    var color = colors[i];
//                    var materialCylinder = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.6 });
//                    mesh = new THREE.Mesh(geometryCylinder, materialCylinder);
//                    mesh.castShadow = true;
//                    mesh.receiveShadow = true;
//                    mesh.name = names[i];
//                    mesh.scale.setY(0.01);
//                    mesh.position.set(end.x, end.y, end.z);
//                    mesh.userData.index = index[i];
//                    objMain.columnGroup.add(mesh);
//                }
//                else {
//                    mesh = objMain.columnGroup.getObjectByName(names[i]);
//                }

//                if (objMain.PromoteDiamondCount[index[i]] != undefined) {
//                    var scale = objMain.PromoteDiamondCount[index[i]];
//                    scale = Math.max(0.01, scale);
//                    mesh.scale.setY(scale);
//                }
//                //var model = objMain.cars[names[i]].clone();
//                //model.name = names[i] + '_' + key;
//                //model.position.set(end.x, 0, end.z);
//                //model.scale.set(0.002, 0.002, 0.002);
//                //model.rotateY(-positons[i].toAngle());
//                //model.userData = { objectType: 'car', parent: key, index: names[i] };
//                //objMain.carGroup.add(model);
//            }
//        },
//        updateCollectGroup: function () {
//            theLagestHoderKey.updateCollectGroup();
//        },
//        refreshBuyPanel: function () {
//            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            {
//                {
//                    var element = document.createElement('div');

//                    element.style.width = '10em';
//                    element.style.marginTop = '3em';
//                    var color = '#ff0000';
//                    //var colorName = '红';
//                    //switch (type) {
//                    //    case 'mile':
//                    //        {
//                    //            color = '#ff0000';
//                    //            colorName = '红';
//                    //        }; break;
//                    //    case 'business': {
//                    //        color = '#00ff00';
//                    //        colorName = '绿';
//                    //    }; break;
//                    //    case 'volume': { 
//                    //        color = '#0000ff';
//                    //        colorName = '蓝';
//                    //    }; break;
//                    //    case 'speed': { 
//                    //        color = '#000000';
//                    //        colorName = '黑';
//                    //    }; break; 
//                    //}
//                    element.style.border = '2px solid ' + color;
//                    element.style.borderTopLeftRadius = '0.5em';
//                    element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
//                    element.style.color = '#1504f6';

//                    var div2 = document.createElement('div');

//                    var b = document.createElement('b');
//                    b.innerHTML = '现在售价如下红宝石10.00，蓝宝石10.00，蓝宝石10.00，黑宝石10.00！点击柱状仓库，进行购买！';
//                    div2.appendChild(b);



//                    element.appendChild(div2);

//                    var object = new THREE.CSS2DObject(element);
//                    var fp = objMain.basePoint;
//                    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

//                    objMain.groupOfOperatePanle.add(object);
//                }


//            }
//        }
//    },
//    Task: new TaskClass('', ''),
//    //{
//    //    state: '',
//    //    carSelect: ''
//    //},
//    animation:
//    {
//        animateCameraByCarAndTask: function () {
//            if (objMain.Task.state == 'mile') {
//                if (objMain.Task.carSelect != '') {
//                    var p1 = objMain.promoteDiamond.children[0].position;
//                    var p2 = objMain.carGroup.getObjectByName(objMain.Task.carSelect).position;

//                }
//            }
//        }
//    },
//    groupOfOperatePanle: null,
//    GetPositionNotify: {
//        data: null, F: function (data) {
//            console.log(data);
//            var objInput = JSON.parse(data);
//            objMain.basePoint = objInput.fp;
//            objMain.carsNames = objInput.carsNames;
//            objMain.indexKey = objInput.key;
//            objMain.displayName = objInput.PlayerName;
//            //if (objMain.receivedState == 'WaitingToGetTeam') {
//            //    objMain.ws.send(received_msg);
//            //}
//            //小车用 https://threejs.org/examples/#webgl_animation_skinning_morph
//            //小车用 基地用 https://threejs.org/examples/#webgl_animation_cloth
//            // drawFlag(); 
//            drawPoint('green', objMain.basePoint, objMain.indexKey);
//            /*画引线*/
//            objMain.mainF.drawLineOfFpToRoad(objMain.basePoint, objMain.playerGroup, 'green', objMain.indexKey);
//            objMain.mainF.drawDiamondCollected();
//            objMain.mainF.lookAtPosition(objMain.basePoint);
//            objMain.mainF.initilizeCars(objMain.basePoint, 'green', objMain.indexKey);
//            drawCarBtns(objMain.carsNames);


//            objMain.GetPositionNotify.data = null;
//            SysOperatePanel.draw();
//            frequencyShow.show();
//            operateStateShow.show();
//        }
//    },
//    Tax: {},
//    taxGroup: null,
//    msg:
//    {

//    },
//    FrequencyOfCollectReward: 0,
//    panOrRotate: 'rotate',
//    carState: {}
//};



//var startA = function () {
//    var connected = false;
//    var wsConnect = '';
//    if (objMain.debug)
//        wsConnect = 'ws://127.0.0.1:11001/websocket';
//    else
//        wsConnect = 'wss://www.nyrq123.com/websocket' + window.location.pathname.split('/')[1] + '/';
//    var ws = new WebSocket(wsConnect);
//    ws.onopen = function () {
//        // Web Socket 已连接上，使用 send() 方法发送数据
//        // ws.send("发送数据");
//        {
//            var mapRoadAndCrossMd5 = '';
//            if (sessionStorage['maproadandcrossmd5'] == undefined) {

//            }
//            else {

//                mapRoadAndCrossMd5 = sessionStorage['maproadandcrossmd5'];
//            }
//            ws.send(JSON.stringify({ c: 'MapRoadAndCrossMd5', mapRoadAndCrossMd5: mapRoadAndCrossMd5 }));
//        }
//        {
//            var session = '';
//            if (sessionStorage['session'] == undefined) {

//            }
//            else {
//                session = sessionStorage['session'];
//            }

//            ws.send(JSON.stringify({ c: 'CheckSession', session: session }));
//        }
//        //   alert("数据发送中...");
//    };
//    ws.onmessage = function (evt) {
//        var received_msg = evt.data;
//        // console.log(evt.data);
//        var received_obj = JSON.parse(evt.data);
//        switch (received_obj.c) {
//            case 'setState':
//                {
//                    objMain.receivedState = received_obj.state;
//                    switch (objMain.receivedState) {
//                        case 'selectSingleTeamJoin':
//                            {
//                                selectSingleTeamJoinHtml();
//                            }; break;
//                        case 'OnLine':
//                            {
//                                set3DHtml();
//                                //  objMain.state = objMain.receivedState;
//                                objMain.ws.send('SetOnLine');
//                                for (var key in objMain.othersBasePoint) {
//                                    var indexKey = key;
//                                    var basePoint = objMain.othersBasePoint[key].basePoint;
//                                    drawPoint('orange', basePoint, indexKey);
//                                    objMain.mainF.drawLineOfFpToRoad(basePoint, objMain.playerGroup, 'green', indexKey);
//                                    objMain.mainF.initilizeCars(basePoint, 'orange', indexKey);
//                                    console.log('哦哦', '出现了预料的情况！！！');
//                                    //alert();
//                                }
//                                objMain.state = objMain.receivedState;
//                            }; break;
//                        case 'WaitingToStart':
//                            {
//                                setWaitingToStart();
//                            }; break;
//                        case 'WaitingToGetTeam':
//                            {
//                                setWaitingToGetTeam();
//                            }; break;
//                    }
//                }; break;
//            case 'setSession':
//                {
//                    sessionStorage['session'] = received_obj.session;
//                }; break;
//            case 'TeamCreateFinish':
//                {
//                    //  alert();
//                    console.log('提示', '队伍创建成功');
//                    if (objMain.receivedState == 'WaitingToStart') {
//                        //{"CommandStart":"182be0c5cdcd5072bb1864cdee4d3d6e","WebSocketID":3,"TeamNum":0,"c":"TeamCreateFinish"}
//                        token.CommandStart = received_obj.CommandStart;
//                        createTeam(received_obj)
//                    }
//                    //  sessionStorage['session'] = received_obj.session;
//                }; break;
//            case 'TeamJoinFinish':
//                {
//                    console.log('提示', '加入队伍成功');
//                    if (objMain.receivedState == 'WaitingToGetTeam') {
//                        joinTeamDetail(received_obj);
//                    }
//                }; break;
//            case 'Alert':
//                {
//                    alert(received_obj.msg);
//                }; break;
//            case 'TeamJoinBroadInfo':
//                {
//                    //  broadTeamJoin(received_obj);
//                    if (objMain.receivedState == 'WaitingToGetTeam' || objMain.receivedState == 'WaitingToStart') {
//                        broadTeamJoin(received_obj);
//                    }
//                }; break;
//            case 'TeamNumWithSecret':
//                {
//                    if (objMain.receivedState == 'WaitingToGetTeam') {
//                        objMain.ws.send(received_msg);
//                    }
//                }; break;
//            case 'GetOthersPositionNotify':
//                {
//                    /*
//                     * 其他玩家的状态刷新
//                     */
//                    console.log(evt.data);
//                    var objInput = JSON.parse(evt.data);
//                    var basePoint = objInput.fp;
//                    var carsNames = objInput.carsNames;
//                    var indexKey = objInput.key;
//                    var PlayerName = objInput.PlayerName;
//                    var fPIndex = objInput.fPIndex;
//                    objMain.othersBasePoint[indexKey] = { 'basePoint': basePoint, 'carsNames': carsNames, 'indexKey': indexKey, 'playerName': PlayerName, 'fPIndex': fPIndex };
//                    if (objMain.state == "OnLine") {
//                        drawPoint('orange', basePoint, indexKey);
//                        /*画引线*/
//                        objMain.mainF.drawLineOfFpToRoad(basePoint, objMain.playerGroup, 'green', indexKey);
//                        //  objMain.mainF.lookAtPosition(objMain.basePoint);
//                        objMain.mainF.initilizeCars(basePoint, 'orange', indexKey, false);
//                    }
//                    else {
//                        /*
//                         * 两个用户同时刷新，在update websocketID与 setOnline 这段时间可能出现这种情况。
//                         */
//                        //var msg = 'GetPositionNotify出入时，状态为' + objMain.state;
//                        //throw (msg);
//                        //return;
//                    }

//                    //    objMain.othersBasePoint[indexKey] = { 'basePoint': basePoint, 'carsNames': carsNames, 'indexKey': indexKey, 'playerName': PlayerName, 'fPIndex': fPIndex };
//                    //if (objMain.receivedState == 'WaitingToGetTeam') {
//                    //    objMain.ws.send(received_msg);
//                    //}
//                    //小车用 https://threejs.org/examples/#webgl_animation_skinning_morph
//                    //小车用 基地用 https://threejs.org/examples/#webgl_animation_cloth
//                    // drawFlag(); 

//                    // drawCarBtns(objMain.carsNames);
//                }; break;
//            case 'GetPositionNotify':
//                {
//                    /*
//                     * 命令GetPositionNotify 与setState objMain.state="OnLine"发生顺序不定。但是画数据，需要在3D初始化之后。
//                     */
//                    if (objMain.state == "OnLine") {
//                        var msg = '先执行了 OnLine命令';
//                        console.log('提示', msg);
//                        objMain.GetPositionNotify.F(evt.data);
//                    }
//                    else {
//                        /*
//                         * 
//                         */
//                        var msg = 'GetPositionNotify出入时，状态为' + objMain.state;
//                        console.log('提示', msg);
//                        throw (msg);
//                        //  objMain.GetPositionNotify.data = evt.data;
//                        return;
//                    }

//                    //var model = objMain.robotModel.clone();
//                    //model.position.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
//                    //objMain.roadGroup.add(model);
//                }; break;
//            case 'MapRoadAndCrossJson':
//                {
//                    switch (received_obj.action) {
//                        case 'start':
//                            {
//                                Map.roadAndCrossJson = '';
//                                objMain.ws.send('MapRoadAndCrossJson,start');
//                            }; break;
//                        case 'mid':
//                            {
//                                Map.roadAndCrossJson += received_obj.passStr;
//                                objMain.ws.send('MapRoadAndCrossJson,mid');
//                            }; break;
//                        case 'end':
//                            {
//                                Map.roadAndCross = JSON.parse(Map.roadAndCrossJson);
//                                Map.roadAndCrossJson = '';
//                                objMain.ws.send('MapRoadAndCrossJson,end');
//                            }; break;
//                    }
//                }; break;
//            case 'SetRobot':
//                {
//                    //  console.log(evt.data);
//                    var f = function (received_obj, mIndex, field) {
//                        var manager = new THREE.LoadingManager();
//                        new THREE.MTLLoader(manager)
//                            .loadTextOnly(received_obj.modelBase64[1], 'data:image/png;base64,' + received_obj.modelBase64[mIndex], function (materials) {
//                                materials.preload();
//                                // materials.depthTest = false;
//                                new THREE.OBJLoader(manager)
//                                    .setMaterials(materials)
//                                    //.setPath('/Pic/')
//                                    .loadTextOnly(received_obj.modelBase64[0], function (object) {
//                                        console.log('o', object);
//                                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
//                                            if (object.children[iOfO].isMesh) {
//                                                for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
//                                                    //object.children[iOfO].material[mi].depthTest = false;
//                                                    object.children[iOfO].material[mi].transparent = true;
//                                                    object.children[iOfO].material[mi].opacity = 1;
//                                                    object.children[iOfO].material[mi].side = THREE.FrontSide;
//                                                    // console.log('color', object.children[iOfO].material[mi].color);
//                                                    //switch (level) {
//                                                    //    case 'high':
//                                                    //        {
//                                                    //            //FR-2HZB-033
//                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1.5, 1, 1);
//                                                    //        }; break;
//                                                    //    case 'mid':
//                                                    //        {
//                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1, 1.5, 1);
//                                                    //        }; break;
//                                                    //    case 'low':
//                                                    //        {
//                                                    //            object.children[iOfO].material[mi].color = new THREE.Color(1, 1, 1.5);
//                                                    //        }; break;
//                                                    //}
//                                                    //object.children[iOfO].material[mi].color = new THREE.Color(1, 1, 1);
//                                                }
//                                            }
//                                        }
//                                        console.log('o', object);
//                                        objMain.cars[field] = object;
//                                        //var model = objMain.car1.clone();
//                                        //model.position.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
//                                        //model.scale.set(0.002, 0.002, 0.002);
//                                        //objMain.roadGroup.add(model);

//                                    }, function () { }, function () { });
//                            });
//                    };
//                    f(received_obj, 2, 'carA');
//                    f(received_obj, 3, 'carB');
//                    f(received_obj, 4, 'carC');
//                    f(received_obj, 5, 'carD');
//                    f(received_obj, 6, 'carE');
//                    f(received_obj, 7, 'carO');
//                    f(received_obj, 8, 'carO2');
//                    objMain.ws.send('SetRobot');
//                }; break;
//            case 'SetRMB':
//                {
//                    var f = function (received_obj, field) {
//                        var manager = new THREE.LoadingManager();
//                        new THREE.MTLLoader(manager)
//                            .loadTextOnly(received_obj.modelBase64[0], 'data:image/jpeg;base64,' + received_obj.modelBase64[1], function (materials) {
//                                materials.preload();
//                                // materials.depthTest = false;
//                                new THREE.OBJLoader(manager)
//                                    .setMaterials(materials)
//                                    //.setPath('/Pic/')
//                                    .loadTextOnly(objMain.rmbModel.geometry, function (object) {
//                                        console.log('o', object);
//                                        for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
//                                            if (object.children[iOfO].isMesh) {
//                                                for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
//                                                    object.children[iOfO].material[mi].transparent = true;
//                                                    object.children[iOfO].material[mi].opacity = 1;
//                                                    object.children[iOfO].material[mi].side = THREE.FrontSide;
//                                                    object.children[iOfO].material[mi].color = new THREE.Color(0.45, 0.45, 0.45);
//                                                }
//                                            }
//                                        }
//                                        console.log('o', object);
//                                        object.scale.set(0.003, 0.003, 0.003);
//                                        object.rotateX(-Math.PI / 2);
//                                        objMain.rmbModel[field] = object;

//                                    }, function () { }, function () { });
//                            });
//                    };
//                    //  f(received_obj, received_obj.faceValue);
//                    switch (received_obj.faceValue) {
//                        case 'model':
//                            {
//                                objMain.rmbModel.geometry = received_obj.modelBase64;
//                                objMain.ws.send('SetRMB');
//                            }; break;
//                        case 'rmb100':
//                        case 'rmb50':
//                        case 'rmb20':
//                        case 'rmb10':
//                            {
//                                f(received_obj, received_obj.faceValue);
//                                objMain.ws.send('SetRMB');
//                            }; break;
//                        case 'rmb5':
//                            {
//                                f(received_obj, received_obj.faceValue);
//                                objMain.rmbModel.geometry = undefined;
//                                objMain.ws.send('SetRMB');
//                            }; break;
//                    };
//                }; break;
//            case 'BradCastAnimateOfCar':
//                {
//                    //已作废,用BradCastAnimateOfSelfCar与BradCastAnimateOfOthersCar代替
//                    throw (received_obj.c + '已作废');
//                    return;
//                    console.log(evt.data);
//                    var passObj = JSON.parse(evt.data);
//                    var animateData = passObj.Animate;
//                    var carId = passObj.carID;

//                    var recordTime = Date.now() + 5000;
//                    //   animateData.recordTime = recordTime;
//                    objMain.carsAnimateData[carId] = { 'recordTime': recordTime, 'animateData': animateData };
//                    /*
//                     * 之前这里需要广播，前台验证。这里采用服务器session机制，在服务器进行判断。
//                     * 
//                     */
//                }; break;
//            case 'BradCastAnimateOfSelfCar':
//            case 'BradCastAnimateOfOthersCar':
//                {
//                    var passObj = JSON.parse(evt.data);
//                    var animateData = passObj.Animate.animateData;
//                    var deltaT = passObj.Animate.deltaT;
//                    var carId = passObj.carID;

//                    var recordTime = Date.now() - deltaT;
//                    //   animateData.recordTime = recordTime;
//                    objMain.carsAnimateData[carId] = { 'recordTime': recordTime, 'animateData': animateData };
//                }; break;
//            case 'BradCastPromoteInfoDetail':
//                {
//                    //alert('1');
//                    console.log('显示', received_obj);
//                    //  switch (received_obj.
//                    objMain.PromotePositions[received_obj.resultType] = received_obj;
//                    objMain.mainF.refreshPromotionDiamondAndPanle(received_obj);


//                }; break;
//            case 'BradCastCollectInfoDetail':
//                {
//                    console.log('显示', received_obj);
//                    //  switch (received_obj.
//                    objMain.CollectPosition = received_obj;
//                    objMain.mainF.refreshCollectAndPanle();
//                    //  objMain.mainF.refreshCollectPositionAndPanle(received_obj);
//                    // objMain.mainF.refreshPromotionDiamondAndPanle(received_obj);
//                }; break;
//            case 'SetDiamond':
//                {
//                    var manager = new THREE.LoadingManager();
//                    new THREE.OBJLoader(manager)
//                        .loadTextOnly(received_obj.DiamondObj, function (object) {
//                            console.log('SetDiamond', object.children[0].geometry);
//                            var geometry = object.children[0].geometry;
//                            objMain.diamondGeometry = geometry;
//                        }, function () { }, function () { });

//                    objMain.ws.send('SetDiamond');
//                }; break;
//            case 'TaxNotify':
//                {
//                    var fp = received_obj.fp;
//                    var tax = received_obj.tax;
//                    var target = received_obj.target;
//                    objMain.Tax[fp.FastenPositionID] = { 'tax': tax, 'fp': fp, 'target': target };
//                    if (tax === 0) {
//                        Tax.removeData(fp.FastenPositionID);
//                    }
//                    else {
//                        Tax.updateTaxGroup();
//                    }
//                }; break;
//            case 'DialogMsg':
//                {
//                    //  alert(received_obj.Msg);
//                    dialogSys.dealWithMsg(received_obj);
//                }; break;
//            case 'BradCastMoneyForSave':
//                {
//                    objMain.MoneyForSave = received_obj.Money;
//                }; break;
//            case 'BradCastPromoteDiamondCount':
//                {
//                    objMain.PromoteDiamondCount[received_obj.pType] = received_obj.count;
//                    objMain.mainF.drawDiamondCollected();
//                }; break;
//            case 'BradCastAbility':
//                {
//                    carAbility.setData(received_obj);
//                    carAbility.drawChanel(received_obj.carIndexStr);
//                    carAbility.updateNotify();
//                }; break;
//            case 'MoneyForSaveNotify':
//                {
//                    moneyOperator.MoneyForSave = received_obj.MoneyForSave;
//                    moneyOperator.updateMoneyForSave();
//                }; break;
//            case 'LeftMoneyInDB':
//                {
//                    subsidizeSys.LeftMoneyInDB[received_obj.address] = received_obj.Money;
//                    subsidizeSys.updateMoneyOfSumSubsidizing();
//                }; break;
//            case 'SupportNotify':
//                {
//                    subsidizeSys.SupportMoney = received_obj.Money;
//                    subsidizeSys.updateMoneyOfSumSubsidized();
//                }; break;
//            case 'TheLargestHolderChangedNotify':
//                {
//                    theLagestHoderKey.data[received_obj.operateKey] = received_obj;
//                    objMain.mainF.updateCollectGroup();
//                }; break;
//            case 'OthersRemove':
//                {
//                    objMain.mainF.removeRole(received_obj.othersKey);
//                    theLagestHoderKey.removeData(received_obj.othersKey);

//                    delete SocialResponsibility.data[received_obj.othersKey];
//                    // SocialResponsibility.data[received_obj.otherKey] = received_obj.socialResponsibility;
//                }; break;
//            case 'FrequencyNotify':
//                {
//                    //alert('接收到OthersRemove');
//                    // removeRole(received_obj.othersKey);
//                    //objMain.mainF.removeRole(received_obj.othersKey);
//                    objMain.FrequencyOfCollectReward = received_obj.frequency;
//                    frequencyShow.show();
//                }; break;
//            case 'SingleRoadPathData':
//                {
//                    // MapData.meshPoints.push(received_obj.meshPoints);
//                    for (var i = 0; i < received_obj.meshPoints.length; i++) {
//                        MapData.meshPoints.push(received_obj.meshPoints[i]);
//                    }
//                    var drawRoadInfomation = function () {

//                        objMain.mainF.removeF.clearGroup(objMain.roadGroup);
//                        //  objMain.F.clearGroup(
//                        var obj = MapData.meshPoints;

//                        var positions = [];
//                        var colors = [];
//                        for (var i = 0; i < obj.length; i++) {
//                            positions.push(
//                                MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),
//                                MercatorGetXbyLongitude(obj[i][2]), 0, -MercatorGetYbyLatitude(obj[i][3]),
//                                MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
//                                MercatorGetXbyLongitude(obj[i][4]), 0, -MercatorGetYbyLatitude(obj[i][5]),
//                                MercatorGetXbyLongitude(obj[i][6]), 0, -MercatorGetYbyLatitude(obj[i][7]),
//                                MercatorGetXbyLongitude(obj[i][0]), 0, -MercatorGetYbyLatitude(obj[i][1]),

//                            );
//                        }
//                        function disposeArray() {

//                            this.array = null;

//                        }
//                        //  console.log('p', positions);
//                        //var vertices = new Float32Array(positions);
//                        var geometry = new THREE.BufferGeometry();
//                        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
//                        //geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).onUpload(disposeArray));
//                        geometry.computeBoundingSphere();
//                        //var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
//                        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//                        var mesh = new THREE.Mesh(geometry, material);

//                        objMain.roadGroup.add(mesh);


//                        var edges = new THREE.EdgesGeometry(geometry);
//                        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0000FF }));
//                        objMain.roadGroup.add(line);
//                    };
//                    drawRoadInfomation();
//                }; break;
//            case 'SetLeaveGameIcon':
//                {
//                    objMain.ws.send('SetLeaveGameIcon');
//                    //alert('SetLeaveGameIcon');
//                    var obj = received_obj.data[0];
//                    var mtl = received_obj.data[1];
//                    var imageBase64s = {};
//                    for (var i = 2; i < received_obj.data.length; i += 2) {
//                        var index = received_obj.data[i];
//                        var data = received_obj.data[i + 1];
//                        imageBase64s[index] = 'data:image/jpeg;base64,' + data;
//                    }
//                    console.log('imageBase64s', imageBase64s);
//                    // objMain.leaveGameModel = received_obj.
//                    var f = function (obj, mtl, imageBase64s) {
//                        var manager = new THREE.LoadingManager();
//                        new THREE.MTLLoader(manager)
//                            .loadTextWithMulImg(mtl, imageBase64s, function (materials) {
//                                materials.preload();
//                                // materials.depthTest = false;
//                                new THREE.OBJLoader(manager)
//                                    .setMaterials(materials)
//                                    //.setPath('/Pic/')
//                                    .loadTextOnly(obj, function (object) {
//                                        console.log('o', object);
//                                        //for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
//                                        //    if (object.children[iOfO].isMesh) {
//                                        //        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
//                                        //            object.children[iOfO].material[mi].transparent = true;
//                                        //            object.children[iOfO].material[mi].opacity = 1;
//                                        //            object.children[iOfO].material[mi].side = THREE.FrontSide;
//                                        //            object.children[iOfO].material[mi].color = new THREE.Color(0.45, 0.45, 0.45);
//                                        //        }
//                                        //    }
//                                        //}
//                                        console.log('o', object);
//                                        object.scale.set(0.003, 0.003, 0.003);
//                                        object.rotateX(-Math.PI / 2);
//                                        objMain.leaveGameModel = object;
//                                        // objMain.rmbModel[field] = object;

//                                    }, function () { }, function () { });
//                            });
//                    };
//                    f(obj, mtl, imageBase64s);
//                }; break;
//            case 'SetProfileIcon':
//                {
//                    objMain.ws.send('ProfileIcon');
//                    //alert('SetLeaveGameIcon');
//                    var obj = received_obj.data[0];
//                    var mtl = received_obj.data[1];
//                    var imageBase64s = {};
//                    for (var i = 2; i < received_obj.data.length; i += 2) {
//                        var index = received_obj.data[i];
//                        var data = received_obj.data[i + 1];
//                        imageBase64s[index] = 'data:image/jpeg;base64,' + data;
//                    }
//                    console.log('imageBase64s', imageBase64s);
//                    // objMain.leaveGameModel = received_obj.
//                    var f = function (obj, mtl, imageBase64s) {
//                        var manager = new THREE.LoadingManager();
//                        new THREE.MTLLoader(manager)
//                            .loadTextWithMulImg(mtl, imageBase64s, function (materials) {
//                                materials.preload();
//                                // materials.depthTest = false;
//                                new THREE.OBJLoader(manager)
//                                    .setMaterials(materials)
//                                    //.setPath('/Pic/')
//                                    .loadTextOnly(obj, function (object) {
//                                        console.log('o', object);
//                                        //for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
//                                        //    if (object.children[iOfO].isMesh) {
//                                        //        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
//                                        //            object.children[iOfO].material[mi].transparent = true;
//                                        //            object.children[iOfO].material[mi].opacity = 1;
//                                        //            object.children[iOfO].material[mi].side = THREE.FrontSide;
//                                        //            object.children[iOfO].material[mi].color = new THREE.Color(0.45, 0.45, 0.45);
//                                        //        }
//                                        //    }
//                                        //}
//                                        console.log('o', object);
//                                        object.scale.set(0.003, 0.003, 0.003);
//                                        object.rotateX(-Math.PI / 2);
//                                        objMain.profileModel = object;
//                                        // objMain.rmbModel[field] = object;

//                                    }, function () { }, function () { });
//                            });
//                    };
//                    f(obj, mtl, imageBase64s);
//                }; break;
//            case 'MoneyNotify':
//                {
//                    objMain.Money = received_obj.Money;
//                    moneyShow.show();
//                }; break;
//            case 'BradCastSocialResponsibility':
//                {
//                    SocialResponsibility.data[received_obj.otherKey] = received_obj.socialResponsibility;
//                    //SocialResponsibility.data.add
//                    if (objMain.indexKey == received_obj.otherKey) {
//                        SocialResponsibility.show();
//                    }
//                }; break;
//            case 'GetName':
//                {
//                    if (document.getElementById('playerNameTextArea') != undefined) {
//                        document.getElementById('playerNameTextArea').value = received_obj.name;
//                    }
//                }; break;
//            case 'GetCarsName':
//                {
//                    for (var i = 0; i < 5; i++) {
//                        var iName = 'car' + (i + 1) + 'NameTextArea';
//                        if (document.getElementById(iName) != undefined) {
//                            document.getElementById(iName).value = received_obj.names[i];
//                        }
//                    }

//                }; break;
//            case 'BradCarState':
//                {
//                    objMain.carState[received_obj.carID] = received_obj.State;
//                    objNotify.notifyCar(received_obj.carID, received_obj.State);
//                }; break;

//        }
//    };
//    ws.onclose = function () {
//        // 关闭 websocket
//        alert("连接已关闭...");
//    };
//    objMain.ws = ws;
//}
//startA();

//function animate() {
//    {
//        requestAnimationFrame(animate);
//        if (objMain.state != objMain.receivedState) {
//            objMain.state = objMain.receivedState;
//        }
//        if (objMain.state == 'OnLine') {

//            var lengthOfCC = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);
//            //if (clothForRender.cloth != null) {

//            //    clothForRender.simulate(Date.now());
//            //    const p = clothForRender.cloth.particles;
//            //    for (let i = 0, il = p.length; i < il; i++) {

//            //        const v = p[i].position;

//            //        clothForRender.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

//            //    }
//            //    clothForRender.clothGeometry.attributes.position.needsUpdate = true;
//            //    clothForRender.clothGeometry.computeVertexNormals();
//            //}
//            for (var i = 0; i < objMain.playerGroup.children.length; i++) {
//                if (objMain.playerGroup.children[i].isMesh) {
//                    objMain.playerGroup.children[i].userData.animateDataYrq.simulate(Date.now());
//                    objMain.playerGroup.children[i].userData.animateDataYrq.refresh(Date.now());
//                }
//            }
//            for (var i = 0; i < objMain.carGroup.children.length; i++) {
//                /*
//                 * 初始化汽车的大小
//                 */
//                if (objMain.carGroup.children[i].isGroup) {
//                    objMain.carGroup.children[i].scale.set(0.002, 0.002, 0.002);

//                }
//            }
//            for (var i = 0; i < objMain.collectGroup.children.length; i++) {
//                /*
//                 * 初始化人民币的大小
//                 */

//                if (objMain.collectGroup.children[i].isGroup) {
//                    if (objMain.Task.state == 'collect') {
//                        var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 1226;
//                        objMain.collectGroup.children[i].scale.set(scale, scale, scale);
//                    }
//                    else {
//                        var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 1840;
//                        objMain.collectGroup.children[i].scale.set(scale, scale, scale);
//                    }
//                    objMain.collectGroup.children[i].rotation.set(-Math.PI / 2, 0, Date.now() % 3000 / 3000 * Math.PI * 2);
//                }
//            }
//            for (var i = 0; i < objMain.promoteDiamond.children.length; i++) {
//                /*
//                 * 初始化 砖石/人民币的大小
//                 */

//                if (objMain.promoteDiamond.children[i].isMesh) {
//                    objMain.promoteDiamond.children[i].scale.set(0.2, 0.22, 0.2);

//                }
//            }

//            for (var i = 0; i < objMain.playerGroup.children.length; i++) {
//                /*
//                 * 初始化 旗帜的大小
//                 */

//                if (objMain.playerGroup.children[i].isMesh) {
//                    if (objMain.Task.state == 'attack') {
//                        objMain.playerGroup.children[i].scale.set(0.0005 / 3 * lengthOfCC, 0.0005 / 3 * lengthOfCC, 0.0005 / 3 * lengthOfCC);
//                        objMain.playerGroup.children[i].position.y = lengthOfCC * 0.024 + 0.028;

//                    }
//                    else {
//                        objMain.playerGroup.children[i].scale.set(0.0005, 0.0005, 0.0005);
//                        objMain.playerGroup.children[i].position.y = 0.1;
//                    }
//                }
//            }

//            var lengthOfPAndC = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);


//            {
//                /*放大选中的汽车*/
//                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) * 0.001;
//                if (scale < 0.002) {
//                    scale = 0.002;
//                }
//                if (objMain.Task.carSelect != '') {
//                    if (objMain.carGroup.getObjectByName(objMain.Task.carSelect) != undefined) {
//                        objMain.carGroup.getObjectByName(objMain.Task.carSelect).scale.set(scale, scale, scale);
//                    }
//                }

//            }
//            {
//                /*放大选中的砖石*/
//                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 35;
//                if (scale < 0.2) {
//                    scale = 0.2;
//                }
//                if (objMain.PromoteList.indexOf(objMain.Task.state) >= 0) {
//                    objMain.promoteDiamond.children[0].scale.set(scale, scale * 1.1, scale);
//                }
//            }
//            {
//                /*放大选中的RMB*/

//            }
//            {

//            }

//            {
//                /*汽车的移动动画*/
//                for (let key of Object.keys(objMain.carsAnimateData)) {
//                    let animateData = objMain.carsAnimateData[key].animateData;
//                    let recordTime = objMain.carsAnimateData[key].recordTime;
//                    var now = Date.now();
//                    for (var i = 0; i < animateData.length; i++) {
//                        var percent = (now - recordTime - animateData[i].t0) / (animateData[i].t1 - animateData[i].t0);
//                        if (percent < 0) {
//                            continue;
//                        }
//                        else if (percent < 1) {
//                            var x = animateData[i].x0 + percent * (animateData[i].x1 - animateData[i].x0);
//                            var y = animateData[i].y0 + percent * (animateData[i].y1 - animateData[i].y0);
//                            if (objMain.carGroup.getObjectByName(key) != undefined) {
//                                objMain.carGroup.getObjectByName(key).position.set(x, 0, -y);

//                                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) * 0.001;
//                                if (scale < 0.002) {
//                                    scale = 0.002;
//                                }
//                                objMain.carGroup.getObjectByName(key).scale.set(scale, scale, scale);

//                                var complexV = new Complex(animateData[i].x1 - animateData[i].x0, -(animateData[i].y1 - animateData[i].y0));
//                                ;
//                                if (!complexV.isZero()) {
//                                    objMain.carGroup.getObjectByName(key).rotation.set(0, -complexV.toAngle() + Math.PI, 0);
//                                }
//                                break;
//                            }
//                        }
//                        else {
//                            var x = animateData[i].x0 + 1 * (animateData[i].x1 - animateData[i].x0);
//                            var y = animateData[i].y0 + 1 * (animateData[i].y1 - animateData[i].y0);
//                            if (objMain.carGroup.getObjectByName(key) != undefined) {
//                                objMain.carGroup.getObjectByName(key).position.set(x, 0, -y);

//                                var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) * 0.001;
//                                if (scale < 0.002) {
//                                    scale = 0.002;
//                                }
//                                objMain.carGroup.getObjectByName(key).scale.set(scale, scale, scale);

//                                var complexV = new Complex(animateData[i].x1 - animateData[i].x0, -(animateData[i].y1 - animateData[i].y0));
//                                ;
//                                if (!complexV.isZero()) {
//                                    objMain.carGroup.getObjectByName(key).rotation.set(0, -complexV.toAngle() + Math.PI, 0);
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//            objMain.animation.animateCameraByCarAndTask();

//            theLagestHoderKey.animate();
//            Tax.animate(lengthOfCC);
//            objMain.renderer.render(objMain.scene, objMain.camera);
//            objMain.labelRenderer.render(objMain.scene, objMain.camera);
//            objMain.light1.position.set(objMain.camera.position.x, objMain.camera.position.y, objMain.camera.position.z);
//        }
//    }
//}

//var selectSingleTeamJoinHtml = function () {
//    document.getElementById('rootContainer').innerHTML = selectSingleTeamJoinHtmlF.drawHtml();
//}
//var set3DHtml = function () {
//    //var text = "";
//    //text += "  <div>";
//    //text += "            3D界面";
//    //text += "        </div>";
//    //document.getElementById('rootContainer').innerHTML = text;
//    document.getElementById('rootContainer').innerHTML = '';

//    //<div id="mainC" class="container" onclick="testTop();">
//    //    <!--<img />-->
//    //    <!--<a href="DAL/MapImage.ashx">DAL/MapImage.ashx</a>-->
//    //    <img src="Pic/11.png" />
//    //</div>
//    var mainC = document.createElement('div');
//    mainC.id = 'mainC';

//    mainC.className = 'container';
//    document.getElementById('rootContainer').appendChild(mainC);

//    objMain.scene = new THREE.Scene();
//    //objMain.scene.background = new THREE.Color(0x7c9dd4);
//    //objMain.scene.fog = new THREE.FogExp2(0x7c9dd4, 0.2);

//    var cubeTextureLoader = new THREE.CubeTextureLoader();
//    cubeTextureLoader.setPath('Pic/');
//    var cubeTexture = cubeTextureLoader.load([
//        "px.jpg", "nx.jpg",
//        "py.jpg", "ny.jpg",
//        "pz.jpg", "nz.jpg"
//    ]);
//    objMain.scene.background = cubeTexture;

//    objMain.renderer = new THREE.WebGLRenderer({ alpha: true });
//    objMain.renderer.setClearColor(0x000000, 0); // the default
//    objMain.renderer.setPixelRatio(window.devicePixelRatio);
//    objMain.renderer.setSize(window.innerWidth, window.innerHeight);
//    objMain.renderer.domElement.className = 'renderDom';
//    document.getElementById('mainC').appendChild(objMain.renderer.domElement);
//    //  document.body

//    objMain.labelRenderer = new THREE.CSS2DRenderer();
//    objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
//    objMain.labelRenderer.domElement.className = 'labelRenderer';
//    //objMain.labelRenderer.domElement.style.curs
//    document.getElementById('mainC').appendChild(objMain.labelRenderer.domElement);

//    objMain.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 30000);
//    objMain.camera.position.set(4000, 2000, 0);
//    objMain.camera.position.set(MercatorGetXbyLongitude(objMain.centerPosition.lon), 20, -MercatorGetYbyLatitude(objMain.centerPosition.lat));

//    objMain.controls = new THREE.OrbitControls(objMain.camera, objMain.labelRenderer.domElement);
//    objMain.controls.center.set(MercatorGetXbyLongitude(objMain.centerPosition.lon), 0, -MercatorGetYbyLatitude(objMain.centerPosition.lat));

//    objMain.roadGroup = new THREE.Group();
//    objMain.scene.add(objMain.roadGroup);

//    objMain.playerGroup = new THREE.Group();
//    objMain.scene.add(objMain.playerGroup);

//    objMain.promoteDiamond = new THREE.Group();
//    objMain.scene.add(objMain.promoteDiamond);

//    objMain.columnGroup = new THREE.Group();
//    objMain.scene.add(objMain.columnGroup);

//    objMain.carGroup = new THREE.Group();
//    objMain.scene.add(objMain.carGroup);

//    objMain.groupOfOperatePanle = new THREE.Group();
//    objMain.scene.add(objMain.groupOfOperatePanle);

//    objMain.collectGroup = new THREE.Group();
//    objMain.scene.add(objMain.collectGroup);

//    objMain.getOutGroup = new THREE.Group();
//    objMain.scene.add(objMain.getOutGroup);

//    objMain.taxGroup = new THREE.Group();
//    objMain.scene.add(objMain.taxGroup);

//    {
//        objMain.light1 = new THREE.PointLight(0xffffff);
//        objMain.light1.position.set(-100, 300, -100);
//        objMain.light1.intensity = 2;
//        objMain.scene.add(objMain.light1);
//    }

//    {
//        objMain.controls.minDistance = 3;
//        objMain.controls.maxPolarAngle = Math.PI / 3;
//    }

//    objMain.raycaster = new THREE.Raycaster();
//    objMain.raycaster.linePrecision = 0.2;

//    objMain.mouse = new THREE.Vector2();

//    //objMain.labelRenderer.domElement.addEventListener
//    var fuckF = function (event) {
//        var bgm = document.getElementById('backGroudMusick');
//        if (bgm.currentTime === 0) {
//            bgm.load();
//            bgm.play();
//        }
//        //if (mouseClickInterviewState.click()) {
//        //    mouseClickInterviewState.init()
//        //}
//        //else {
//        //    return;
//        //}

//        // if(
//        //  alert('document点击！');
//        if (objMain.Task.state == '') {
//            // throw 'task not select';
//        }
//        //else if (objMain.Task.carSelect == '') {
//        //    alert('请选择要执行此任务的车辆');
//        //}
//        else {
//            switch (objMain.Task.state) {
//                case 'mile':
//                case 'business':
//                case 'volume':
//                case 'speed':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var intersects = objMain.raycaster.intersectObjects(objMain.promoteDiamond.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    var selectObj = intersects[i].object;
//                                    switch (selectObj.name) {
//                                        case 'diamond_mile':
//                                        case 'diamond_business':
//                                        case 'diamond_volume':
//                                        case 'diamond_speed':
//                                            {
//                                                //  alert('选择了红宝石');

//                                                if (objMain.Task.state == '') {
//                                                    throw 'task not select';
//                                                }
//                                                else if (objMain.Task.carSelect == '') {
//                                                    alert('请选择要执行此任务的车辆');
//                                                }
//                                                else {
//                                                    objMain.ws.send(JSON.stringify({ 'c': 'Promote', 'pType': objMain.Task.state, 'car': objMain.Task.carSelect }));
//                                                    objMain.Task.state = '';
//                                                    objMain.Task.carSelect = '';
//                                                    carBtns.clearBtnInFrame();
//                                                    //  objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                                    carAbility.clear();

//                                                    objMain.mainF.removeF.clearGroup(objMain.promoteDiamond);
//                                                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                                    selectObj.userData.endF();
//                                                }
//                                                return;
//                                            }; break;
//                                    }
//                                }
//                            }
//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                    }; break;
//                case 'ability':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            //  var names = ['BatteryMile', 'BatteryBusiness', 'BatteryVolume', 'BatterySpeed'];
//                            var intersects = objMain.raycaster.intersectObjects(objMain.columnGroup.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    var selectObj = intersects[i].object;
//                                    switch (selectObj.name) {
//                                        case 'BatteryMile':
//                                        case 'BatteryBusiness':
//                                        case 'BatteryVolume':
//                                        case 'BatterySpeed':
//                                            {
//                                                if (objMain.Task.state == '') {
//                                                    throw 'task not select';
//                                                }
//                                                else if (objMain.Task.carSelect == '') {
//                                                    alert('请选择要执行此任务的车辆');
//                                                }
//                                                else {
//                                                    if (objMain.PromoteDiamondCount[selectObj.userData.index] > 0) {
//                                                        objMain.ws.send(JSON.stringify({ 'c': 'Ability', 'car': objMain.Task.carSelect, 'pType': selectObj.userData.index }));
//                                                        //objMain.PromoteDiamondCount[selectObj.userData.index]--;
//                                                        //if (objMain.PromoteDiamondCount[selectObj.userData.index] == 0) {
//                                                        //    objMain.Task.state = '';
//                                                        //    objMain.Task.carSelect = '';
//                                                        //    carBtns.clearBtnInFrame();
//                                                        //    //  objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                                        //    carAbility.clear();
//                                                        //    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                                        //}
//                                                        //else {

//                                                        //}
//                                                    }
//                                                }
//                                                return;
//                                            }; break;
//                                    }
//                                }
//                            }
//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                    }; break;
//                case 'collect':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var intersects = objMain.raycaster.intersectObjects(objMain.collectGroup.children[0].children);
//                            if (intersects.length > 0) {
//                                if (objMain.Task.state == '') {
//                                    throw 'task not select';
//                                }
//                                else if (objMain.Task.carSelect == '') {
//                                    alert('请选择要执行此任务的车辆');
//                                }
//                                else {
//                                    objMain.ws.send(JSON.stringify({ 'c': 'Collect', 'cType': 'findWork', 'car': objMain.Task.carSelect }));
//                                    objMain.Task.state = '';
//                                    objMain.Task.carSelect = '';
//                                    carBtns.clearBtnInFrame();
//                                    //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                    carAbility.clear();
//                                    // objMain.mainF.removeF.clearGroup(objMain.collectGroup);
//                                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                    var endF = objMain.collectGroup.userData.endF;
//                                    endF();

//                                }
//                                return;
//                            }
//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                    }; break;
//                case 'setReturn':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var intersects = objMain.raycaster.intersectObjects(objMain.playerGroup.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    var selectObj = intersects[i].object;
//                                    if (selectObj.name == 'flag_' + objMain.indexKey) {
//                                        if (objMain.Task.state == '') {
//                                            throw 'task not select';
//                                        }
//                                        else if (objMain.Task.carSelect == '') {
//                                            alert('请选择要执行此任务的车辆');
//                                        }
//                                        else {
//                                            // alert('捕捉到了旗帜');
//                                            objMain.ws.send(JSON.stringify({ 'c': 'SetCarReturn', 'car': objMain.Task.carSelect }));
//                                            objMain.Task.state = '';
//                                            objMain.Task.carSelect = '';
//                                            carBtns.clearBtnInFrame();
//                                            //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                            carAbility.clear();
//                                            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                        }
//                                        return;
//                                    }
//                                }

//                            }

//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                        //objMain.playerGroup.getObjectByName('flag_'+objMain.indexKey)
//                    }; break;
//                case 'attack':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var selectObj = null;
//                            var minLength = 100000000;
//                            //var  for (var j = 0; j < intersects.length; j++) {
//                            //    if (intersects[j].distance < minLength) {
//                            //        selectObj = intersects[j].object.parent;
//                            //        selectType = 'transformer';
//                            //        minLength = intersects[j].distance;
//                            //    }
//                            //}
//                            var state = '';
//                            var intersects = objMain.raycaster.intersectObjects(objMain.playerGroup.children);
//                            var intersect_SetExit = objMain.raycaster.intersectObjects(objMain.getOutGroup.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    if (intersects[i].name != 'flag_' + objMain.indexKey) {
//                                        var r = /^flag_[a-f0-9]{32}$/;
//                                        if (r.test(intersects[i].object.name)) {
//                                            if (intersects[i].distance < minLength) {
//                                                selectObj = intersects[i].object;
//                                                minLength = intersects[i].distance;
//                                                state = 'selectFlag';
//                                            }
//                                        }
//                                    }
//                                }

//                            }

//                            if (intersect_SetExit.length > 0) {
//                                for (var i = 0; i < intersect_SetExit.length; i++) {
//                                    if (intersect_SetExit[i].name != 'collect_' + objMain.indexKey) {
//                                        var r = /^collect_[a-f0-9]{32}$/;
//                                        if (r.test(intersect_SetExit[i].object.name)) {
//                                            if (intersect_SetExit[i].distance < minLength) {
//                                                selectObj = intersect_SetExit[i].object;
//                                                minLength = intersect_SetExit[i].distance;
//                                                state = 'selectArrow';
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                            if (selectObj != null) {
//                                if (objMain.Task.state == '') {
//                                    throw 'task not select';
//                                }
//                                else if (objMain.Task.carSelect == '') {
//                                    alert('请选择要执行此任务的车辆');
//                                }
//                                else {
//                                    switch (state) {
//                                        case 'selectFlag':
//                                            {
//                                                var customTagIndexKey = selectObj.name.substring(5);
//                                                if (objMain.othersBasePoint[customTagIndexKey] != undefined) {
//                                                    var fPIndex = objMain.othersBasePoint[customTagIndexKey].fPIndex;
//                                                    objMain.ws.send(JSON.stringify({ 'c': 'Attack', 'car': objMain.Task.carSelect, 'TargetOwner': customTagIndexKey, 'Target': fPIndex }));
//                                                    objMain.Task.state = '';
//                                                    objMain.Task.carSelect = '';
//                                                    carBtns.clearBtnInFrame();
//                                                    // objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                                    carAbility.clear();
//                                                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                                    return;
//                                                }
//                                            }; break;
//                                        case 'selectArrow':
//                                            {
//                                                var indexKey = selectObj.userData['key'];
//                                                if (indexKey == undefined) {
//                                                    //return;
//                                                }
//                                                else {
//                                                    if (objMain.othersBasePoint[indexKey] != undefined) {
//                                                        objMain.ws.send(JSON.stringify({ 'c': 'Bust', 'car': objMain.Task.carSelect, 'TargetOwner': indexKey, 'Target': objMain.othersBasePoint[indexKey].fPIndex }));
//                                                    }
//                                                }
//                                                objMain.Task.state = '';
//                                                objMain.Task.carSelect = '';
//                                                carBtns.clearBtnInFrame();
//                                                // objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                                carAbility.clear();
//                                                objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                                return;
//                                            }; break;
//                                    }

//                                }
//                            }
//                        }


//                    }; break;
//                case 'getTax':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var selectObj = null;
//                            var minLength = 100000000;
//                            //var  for (var j = 0; j < intersects.length; j++) {
//                            //    if (intersects[j].distance < minLength) {
//                            //        selectObj = intersects[j].object.parent;
//                            //        selectType = 'transformer';
//                            //        minLength = intersects[j].distance;
//                            //    }
//                            //}
//                            var state = '';
//                            var intersects = objMain.raycaster.intersectObjects(objMain.taxGroup.children);

//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    //if (intersects[i].name != 'flag_' + objMain.indexKey)
//                                    {
//                                        var r = /^fp_[A-Z]{10}$/;
//                                        if (r.test(intersects[i].object.name)) {
//                                            if (intersects[i].distance < minLength) {
//                                                selectObj = intersects[i].object;
//                                                minLength = intersects[i].distance;
//                                            }
//                                        }
//                                    }
//                                }

//                            }
//                            if (selectObj != null) {
//                                if (objMain.Task.state == '') {
//                                    throw 'task not select';
//                                }
//                                else if (objMain.Task.carSelect == '') {
//                                    alert('请选择要执行此任务的车辆');
//                                }
//                                else {
//                                    var name = selectObj.name;
//                                    var fpCode = name.substring(3);
//                                    if (objMain.Tax[fpCode] != undefined) {
//                                        objMain.ws.send(JSON.stringify({ 'c': 'Tax', 'car': objMain.Task.carSelect, 'Target': objMain.Tax[fpCode].target }));
//                                        objMain.Task.state = '';
//                                        objMain.Task.carSelect = '';
//                                        carBtns.clearBtnInFrame();
//                                        //  objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                        carAbility.clear();
//                                        objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                        return;
//                                    }
//                                }
//                            }
//                        }
//                    }; break;
//                case 'buyDiamond':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            var intersects = objMain.raycaster.intersectObjects(objMain.columnGroup.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    var selectObj = intersects[i].object;
//                                    switch (selectObj.name) {
//                                        case 'BatteryMile':
//                                        case 'BatteryBusiness':
//                                        case 'BatteryVolume':
//                                        case 'BatterySpeed':
//                                            {
//                                                objMain.ws.send(JSON.stringify({ 'c': 'BuyDiamond', 'pType': selectObj.userData.index }));
//                                                return;
//                                            }; break;
//                                    }
//                                }
//                            }
//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                    }; break;
//                case 'sellDiamond':
//                    {
//                        objMain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//                        objMain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//                        //alert(mouse.x + ',' + mouse.y);
//                        objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);
//                        {
//                            //  var names = ['BatteryMile', 'BatteryBusiness', 'BatteryVolume', 'BatterySpeed'];
//                            var intersects = objMain.raycaster.intersectObjects(objMain.columnGroup.children);
//                            if (intersects.length > 0) {
//                                for (var i = 0; i < intersects.length; i++) {
//                                    var selectObj = intersects[i].object;
//                                    switch (selectObj.name) {
//                                        case 'BatteryMile':
//                                        case 'BatteryBusiness':
//                                        case 'BatteryVolume':
//                                        case 'BatterySpeed':
//                                            {
//                                                if (objMain.Task.state == '') {
//                                                    throw 'task not select';
//                                                }
//                                                else {
//                                                    if (objMain.PromoteDiamondCount[selectObj.userData.index] > 0) {
//                                                        objMain.ws.send(JSON.stringify({ 'c': 'SellDiamond', 'pType': selectObj.userData.index }));
//                                                        objMain.PromoteDiamondCount[selectObj.userData.index]--;
//                                                        //if (objMain.PromoteDiamondCount[selectObj.userData.index] == 0) {
//                                                        //    objMain.Task.state = '';
//                                                        //    objMain.Task.carSelect = '';
//                                                        //    carBtns.clearBtnInFrame();
//                                                        //    //  objMain.mainF.removeF.removePanle('carsSelectionPanel');
//                                                        //    carAbility.clear();
//                                                        //    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                                                        //}
//                                                        //else {

//                                                        //}
//                                                    }
//                                                }
//                                                return;
//                                            }; break;
//                                    }
//                                }
//                            }
//                            //name: "diamond_mile"
//                            //if (intersects.length > 0) {
//                            //    for (var i = 0; i < intersects.length; i++) {
//                            //        if (intersects[i].distance < minLength) {
//                            //            selectObj = intersects[i].object;
//                            //            selectType = 'peibian';
//                            //            minLength = intersects[i].distance;
//                            //        }
//                            //    }
//                            //}
//                            //
//                        }
//                    }; break;
//            }
//            //objMain.ws.send(JSON.stringify({ 'c': 'Attack', 'car': objMain.Task.carSelect, 'TargetOwner': this.CustomTag.indexKey, 'Target': this.CustomTag.fPIndex }));
//            //objMain.Task.state = '';
//            //objMain.Task.carSelect = '';
//            //objMain.mainF.removeF.removePanle('carsSelectionPanel');
//            //carAbility.clear();
//            //// objMain.mainF.removeF.clearGroup(objMain.collectGroup);
//            //objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);

//        }
//        return;
//    }

//    objMain.labelRenderer.domElement.addEventListener('mousedown', function (event) {
//        //  alert('鼠标弹起');
//        if (mouseClickInterviewState.click()) {
//            // alert('鼠标双击了');
//            if (objMain.panOrRotate == 'rotate') {
//                objMain.panOrRotate = 'pan';
//            }
//            else {
//                objMain.panOrRotate = 'rotate'
//            }
//            operateStateShow.show();
//        }
//        else {
//            fuckF(event);

//        }

//    }, false);
//    window.touchEndEventSelfRegester = function (event) {
//        switch (event.touches.length) {

//            case 1: // one-fingered touch: rotate
//                {
//                    //alert(event.touches[0].pageX);
//                    //alert('clientY:' + event.touches[0].clientY);
//                    //alert(JSON.stringify(event));
//                    if (mouseClickInterviewState.click()) {
//                        if (objMain.panOrRotate == 'rotate') {
//                            objMain.panOrRotate = 'pan';
//                        }
//                        else {
//                            objMain.panOrRotate = 'rotate'
//                        }
//                        operateStateShow.show();
//                    }
//                    else {
//                        fuckF(event.touches[0]);
//                    }
//                }

//                break;

//            default:



//        }
//    };
//    drawCarBtnsFrame();
//    objNotify.carNotifyShow();
//}

//var setWaitingToStart = function () {
//    var text = "";
//    text += "  <div>";
//    text += "          请等待";
//    text += "        </div>";
//    document.getElementById('rootContainer').innerHTML = text;
//}

//var createTeam = function (teamCreateFinish) {
//    document.getElementById('rootContainer').innerHTML = '';
//    var div1 = document.createElement('div');
//    div1.style.textAlign = 'center';
//    var addDiv = function (title, content) {
//        var div = document.createElement('div');
//        var label = document.createElement('label');
//        var b = document.createElement('b');
//        label.innerText = title;
//        b.innerText = content;
//        div.appendChild(label);
//        div.appendChild(b);
//        return div;
//    }
//    div1.appendChild(addDiv('房间号：', teamCreateFinish.TeamNum));
//    div1.appendChild(addDiv('队长：', teamCreateFinish.PlayerName));

//    document.getElementById('rootContainer').appendChild(div1);

//    var div2 = document.createElement('div');
//    div2.style.textAlign = 'center';

//    var button = document.createElement("button");
//    button.innerText = '开始';
//    button.style.width = "5em";
//    button.style.height = "3em";
//    button.style.marginTop = "1em";
//    button.onclick = function () {
//        objMain.ws.send(token.CommandStart);
//    };
//    div2.appendChild(button);
//    document.getElementById('rootContainer').appendChild(div2);
//}

//var joinTeamDetail = function (teamJoinFinish) {
//    document.getElementById('rootContainer').innerHTML = '';
//    var div1 = document.createElement('div');
//    div1.style.textAlign = 'center';

//    var addDiv = function (title, content) {
//        var div = document.createElement('div');
//        var label = document.createElement('label');
//        var b = document.createElement('b');
//        label.innerText = title;
//        b.innerText = content;
//        div.appendChild(label);
//        div.appendChild(b);
//        return div;
//    }
//    div1.appendChild(addDiv('房间号：', teamJoinFinish.TeamNum));
//    div1.appendChild(addDiv('队长：', teamJoinFinish.PlayerNames[0]));

//    for (var i = 1; i < teamJoinFinish.PlayerNames.length; i++) {
//        div1.appendChild(addDiv('队员：', teamJoinFinish.PlayerNames[i]));
//    }

//    document.getElementById('rootContainer').appendChild(div1);

//    var div2 = document.createElement('div');
//    div2.style.textAlign = 'center';

//    document.getElementById('rootContainer').appendChild(div2);
//}

//var broadTeamJoin = function (teamJoinBroadInfo) {
//    var addDiv = function (title, content) {
//        var div = document.createElement('div');
//        var label = document.createElement('label');
//        var b = document.createElement('b');
//        label.innerText = title;
//        b.innerText = content;
//        div.appendChild(label);
//        div.appendChild(b);
//        return div;
//    }
//    document.getElementById('rootContainer').children[0].appendChild(addDiv('队员：', teamJoinBroadInfo.PlayerName));
//}

//var setWaitingToGetTeam = function () {
//    document.getElementById('rootContainer').innerHTML = '';
//    var div1 = document.createElement('div');
//    div1.style.textAlign = 'center';
//    div1.style.marginTop = '2em';
//    var label = document.createElement('label');
//    label.innerText = '房间号';
//    var input = document.createElement('input');
//    input.id = 'roomNumInput';
//    input.type = 'number';
//    div1.appendChild(label);
//    div1.appendChild(input);
//    document.getElementById('rootContainer').appendChild(div1);

//    var div2 = document.createElement('div');
//    div2.style.textAlign = 'center';

//    var button = document.createElement("button");
//    button.innerText = '加入';
//    button.style.width = "5em";
//    button.style.height = "3em";
//    button.style.marginTop = "1em";
//    button.onclick = function () {
//        console.log('提示', '加入事件还没有写写哦');
//        var roomNumInput = document.getElementById('roomNumInput').value;
//        if (roomNumInput == '') {
//            alert('不要输入空');
//        }
//        else {
//            objMain.ws.send(roomNumInput);
//            this.onclick = function () { };
//        }
//    };
//    div2.appendChild(button);
//    document.getElementById('rootContainer').appendChild(div2);
//}

//animate();

//var buttonClick = function (v) {
//    if (objMain.receivedState == 'selectSingleTeamJoin') {
//        switch (v) {
//            case 'single':
//                {
//                    objMain.ws.send(JSON.stringify({ c: 'JoinGameSingle' }));
//                    objMain.receivedState = '';
//                }; break;
//            case 'team':
//                {
//                    objMain.ws.send(JSON.stringify({ c: 'CreateTeam' }));
//                    objMain.receivedState = '';
//                }; break;
//            case 'join':
//                {
//                    objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
//                    objMain.receivedState = '';
//                }; break;
//            case 'setName':
//                {
//                    // objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
//                    objMain.receivedState = 'setName';
//                    selectSingleTeamJoinHtmlF.setNameHtmlShow();
//                    objMain.ws.send(JSON.stringify({ c: 'GetName' }));
//                }; break;
//            case 'setCarsName':
//                {
//                    // objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
//                    objMain.receivedState = 'setCarsName';
//                    selectSingleTeamJoinHtmlF.setCarsNameHtmlShow();
//                    objMain.ws.send(JSON.stringify({ c: 'GetCarsName' }));
//                }; break;


//        }
//        // objMain.receivedState = '';
//    }

//}

//var token =
//{
//    CommandStart: '',

//};
//var MapData =
//{
//    roadAndCrossJson: '',
//    roadAndCross: null,
//    meshPoints: []
//};



//var clothForRender = {
//    cloth: null, clothGeometry: null,

//    simulate: function (now) {

//        const DAMPING = 0.03;
//        const DRAG = 1 - DAMPING;
//        const windStrength = Math.cos(now / 7000) * 20 + 4000;
//        const windForce = new THREE.Vector3(0, 0, 0);
//        windForce.set(Math.sin(now / 2000), 0, Math.sin(now / 1000));
//        windForce.normalize();
//        windForce.multiplyScalar(windStrength);
//        const tmpForce = new THREE.Vector3();

//        const GRAVITY = 981 * 1.4;
//        const MASS = 0.1;
//        const gravity = new THREE.Vector3(0, - GRAVITY, 0).multiplyScalar(MASS);
//        const TIMESTEP = 18 / 1000;
//        const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

//        const particles = this.cloth.particles;
//        var clothGeometry = this.clothGeometry;
//        var cloth = this.cloth;
//        if (true) {

//            let indx;
//            const normal = new THREE.Vector3();
//            const indices = clothGeometry.index;
//            const normals = clothGeometry.attributes.normal;

//            for (let i = 0, il = indices.count; i < il; i += 3) {
//                for (let j = 0; j < 3; j++) {
//                    indx = indices.getX(i + j);
//                    normal.fromBufferAttribute(normals, indx);
//                    tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
//                    particles[indx].addForce(tmpForce);
//                }
//            }
//        }

//        for (let i = 0, il = particles.length; i < il; i++) {

//            const particle = particles[i];
//            particle.addForce(gravity);
//            particle.integrate(TIMESTEP_SQ);
//        }

//        // Start Constraints

//        const constraints = cloth.constraints;
//        const il = constraints.length;

//        const diff = new THREE.Vector3();
//        function satisfyConstraints(p1, p2, distance) {

//            diff.subVectors(p2.position, p1.position);
//            const currentDist = diff.length();
//            if (currentDist === 0) return; // prevents division by 0
//            const correction = diff.multiplyScalar(1 - distance / currentDist);
//            const correctionHalf = correction.multiplyScalar(0.5);
//            p1.position.add(correctionHalf);
//            p2.position.sub(correctionHalf);

//        }
//        for (let i = 0; i < il; i++) {

//            const constraint = constraints[i];
//            satisfyConstraints(constraint[0], constraint[1], constraint[2]);
//        }


//        for (let i = 0, il = particles.length; i < il; i++) {
//            const particle = particles[i];
//            const pos = particle.position;
//            if (pos.y < - 250) {
//                pos.y = - 250;
//            }
//        }

//        const pinsFormation = [];
//        pins = [6];

//        pinsFormation.push(pins);

//        pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//        pinsFormation.push(pins);

//        pins = [0];
//        pinsFormation.push(pins);

//        pins = []; // cut the rope ;)
//        pinsFormation.push(pins);

//        pins = [0, cloth.w]; // classic 2 pins
//        pinsFormation.push(pins);

//        pins = pinsFormation[1];
//        // Pin Constraints

//        for (let i = 0, il = pins.length; i < il; i++) {
//            const xy = pins[i];
//            const p = particles[xy];
//            p.position.copy(p.original);
//            p.previous.copy(p.original);
//        }
//    }
//};
//var drawPoint = function (color, fp, indexKey) {
//    var createFlag = function (color) {
//        var that = this;
//        this.windStrengthDelta = 0;
//        this.DAMPING = 0.03;
//        this.DRAG = 1 - this.DAMPING;
//        this.MASS = 0.1;
//        this.restDistance = 25;
//        this.xSegs = 10;
//        this.ySegs = 10;
//        function plane(width, height) {

//            return function (u, v, target) {

//                var x = (u - 0.5) * width;
//                var y = (v + 0.5) * height;
//                var z = 0;

//                target.set(x, y, z);

//            };

//        }
//        var clothFunction = plane(this.restDistance * this.xSegs, this.restDistance * this.ySegs);
//        function Cloth(w, h) {

//            w = w || 10;
//            h = h || 10;
//            this.w = w;
//            this.h = h;

//            var particles = [];
//            var constraints = [];

//            // Create particles
//            for (let v = 0; v <= h; v++) {

//                for (let u = 0; u <= w; u++) {

//                    particles.push(
//                        new Particle(u / w, v / h, 0, that.MASS)
//                    );

//                }

//            }

//            // Structural

//            for (let v = 0; v < h; v++) {

//                for (let u = 0; u < w; u++) {

//                    constraints.push([
//                        particles[index(u, v)],
//                        particles[index(u, v + 1)],
//                        that.restDistance
//                    ]);

//                    constraints.push([
//                        particles[index(u, v)],
//                        particles[index(u + 1, v)],
//                        that.restDistance
//                    ]);

//                }

//            }

//            for (let u = w, v = 0; v < h; v++) {

//                constraints.push([
//                    particles[index(u, v)],
//                    particles[index(u, v + 1)],
//                    that.restDistance

//                ]);

//            }

//            for (let v = h, u = 0; u < w; u++) {

//                constraints.push([
//                    particles[index(u, v)],
//                    particles[index(u + 1, v)],
//                    that.restDistance
//                ]);

//            }
//            this.particles = particles;
//            this.constraints = constraints;

//            function index(u, v) {

//                return u + v * (w + 1);

//            }

//            this.index = index;

//        }
//        var cloth = new Cloth(this.xSegs, this.ySegs);
//        this.cloth = cloth;

//        this.GRAVITY = 981 * 1.4;
//        this.gravity = new THREE.Vector3(0, -  this.GRAVITY, 0).multiplyScalar(this.MASS);

//        this.TIMESTEP = 18 / 1000;
//        this.TIMESTEP_SQ = this.TIMESTEP * this.TIMESTEP;

//        this.pins = [];

//        this.windForce = new THREE.Vector3(0, 0, 0);

//        //this. ballPosition = new THREE.Vector3(0, - 45, 0);
//        //this. ballSize = 60; //40

//        this.tmpForce = new THREE.Vector3();

//        function Particle(x, y, z, mass) {

//            this.position = new THREE.Vector3();
//            this.previous = new THREE.Vector3();
//            this.original = new THREE.Vector3();
//            this.a = new THREE.Vector3(0, 0, 0); // acceleration
//            this.mass = mass;
//            this.invMass = 1 / mass;
//            this.tmp = new THREE.Vector3();
//            this.tmp2 = new THREE.Vector3();

//            // init

//            clothFunction(x, y, this.position); // position
//            clothFunction(x, y, this.previous); // previous
//            clothFunction(x, y, this.original);

//        }

//        // Force -> Acceleration

//        Particle.prototype.addForce = function (force) {

//            this.a.add(
//                this.tmp2.copy(force).multiplyScalar(this.invMass)
//            );

//        };


//        // Performs Verlet integration

//        Particle.prototype.integrate = function (timesq) {

//            var newPos = this.tmp.subVectors(this.position, this.previous);
//            newPos.multiplyScalar(that.DRAG).add(this.position);
//            newPos.add(this.a.multiplyScalar(timesq));

//            this.tmp = this.previous;
//            this.previous = this.position;
//            this.position = newPos;

//            this.a.set(0, 0, 0);

//        };

//        this.diff = new THREE.Vector3();
//        function satisfyConstraints(p1, p2, distance) {

//            that.diff.subVectors(p2.position, p1.position);
//            var currentDist = that.diff.length();
//            if (currentDist === 0) return; // prevents division by 0
//            var correction = that.diff.multiplyScalar(1 - distance / currentDist);
//            var correctionHalf = correction.multiplyScalar(0.5);
//            p1.position.add(correctionHalf);
//            p2.position.sub(correctionHalf);

//        }
//        this.simulate = function (now) {
//            //这里进行动画
//            var windStrength = Math.cos(now / 7000) * 20 + 40 + that.windStrengthDelta;

//            that.windForce.set(Math.sin(now / 2000), Math.cos(now / 3000), Math.sin(now / 1000));
//            that.windForce.normalize();
//            that.windForce.multiplyScalar(windStrength);

//            // Aerodynamics forces

//            var particles = cloth.particles;

//            {

//                let indx;
//                var normal = new THREE.Vector3();
//                var indices = clothGeometry.index;
//                var normals = clothGeometry.attributes.normal;

//                for (let i = 0, il = indices.count; i < il; i += 3) {

//                    for (let j = 0; j < 3; j++) {

//                        indx = indices.getX(i + j);
//                        normal.fromBufferAttribute(normals, indx);
//                        that.tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(that.windForce));
//                        particles[indx].addForce(that.tmpForce);

//                    }

//                }

//            }

//            for (let i = 0, il = particles.length; i < il; i++) {

//                var particle = particles[i];
//                particle.addForce(that.gravity);

//                particle.integrate(that.TIMESTEP_SQ);

//            }

//            // Start Constraints

//            var constraints = cloth.constraints;
//            var il = constraints.length;

//            for (let i = 0; i < il; i++) {

//                var constraint = constraints[i];
//                satisfyConstraints(constraint[0], constraint[1], constraint[2]);

//            }

//            // Ball Constraints




//            // Floor Constraints

//            for (let i = 0, il = particles.length; i < il; i++) {

//                var particle = particles[i];
//                var pos = particle.position;
//                if (pos.y < - 250) {

//                    pos.y = - 250;

//                }

//            }

//            // Pin Constraints

//            for (let i = 0, il = that.pins.length; i < il; i++) {

//                var xy = that.pins[i];
//                var p = particles[xy];
//                p.position.copy(p.original);
//                p.previous.copy(p.original);

//            }


//        }

//        this.pinsFormation = [];
//        this.pins = [6];

//        this.pinsFormation.push(this.pins);

//        this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//        this.pinsFormation.push(this.pins);

//        this.pins = [0];
//        this.pinsFormation.push(this.pins);

//        this.pins = []; // cut the rope ;)
//        this.pinsFormation.push(this.pins);

//        this.pins = [0, cloth.w]; // classic 2 pins
//        this.pinsFormation.push(this.pins);

//        this.pins = this.pinsFormation[1];

//        function togglePins() {

//            pins = pinsFormation[~ ~(Math.random() * pinsFormation.length)];

//        }
//        this.clothMaterial = new THREE.MeshLambertMaterial({
//            side: THREE.DoubleSide,
//            alphaTest: 0.5,
//            color: color,
//            emissive: color
//        });
//        var clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, cloth.w, cloth.h);
//        this.clothGeometry = clothGeometry;


//        this.refresh = function () {
//            var p = that.cloth.particles;
//            for (let i = 0, il = p.length; i < il; i++) {

//                var v = p[i].position;

//                that.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

//            }
//            that.clothGeometry.attributes.position.needsUpdate = true;
//            that.clothGeometry.computeVertexNormals();
//        };

//        return this;
//    }

//    var objToShow = new createFlag(color);
//    // return [clothGeometry,]
//    object = new THREE.Mesh(objToShow.clothGeometry, objToShow.clothMaterial);
//    object.userData['animateDataYrq'] = objToShow;
//    object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0.1, -MercatorGetYbyLatitude(fp.Latitde));
//    object.scale.set(0.0005, 0.0005, 0.0005);
//    objMain.playerGroup.add(object);

//    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
//    var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
//    var cc = new Complex(end.x - start.x, end.z - start.z);
//    cc.toOne();
//    object.rotateY(-cc.toAngle() + Math.PI / 2);
//    //alert('1');
//    object.name = 'flag_' + indexKey;

//    //object.userData['animateDataYrq']['refresh'] = this.refresh;
//    //object.userData['animateDataYrq']['simulate'] = this.simulate;
//    //var MASS = 0.1;
//    //var restDistance = 25;
//    //var xSegs = 10;
//    //var ySegs = 10;

//    //var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);
//    //var cloth = new Cloth(xSegs, ySegs);
//    //this.cloth = cloth;

















//    //function Cloth(w, h) {

//    //    w = w || 10;
//    //    h = h || 10;
//    //    this.w = w;
//    //    this.h = h;

//    //    var particles = [];
//    //    var constraints = [];

//    //    // Create particles
//    //    for (let v = 0; v <= h; v++) {

//    //        for (let u = 0; u <= w; u++) {

//    //            particles.push(
//    //                new Particle(u / w, v / h, 0, MASS)
//    //            );

//    //        }

//    //    }

//    //    // Structural

//    //    for (let v = 0; v < h; v++) {

//    //        for (let u = 0; u < w; u++) {

//    //            constraints.push([
//    //                particles[index(u, v)],
//    //                particles[index(u, v + 1)],
//    //                restDistance
//    //            ]);

//    //            constraints.push([
//    //                particles[index(u, v)],
//    //                particles[index(u + 1, v)],
//    //                restDistance
//    //            ]);

//    //        }

//    //    }

//    //    for (let u = w, v = 0; v < h; v++) {

//    //        constraints.push([
//    //            particles[index(u, v)],
//    //            particles[index(u, v + 1)],
//    //            restDistance

//    //        ]);

//    //    }

//    //    for (let v = h, u = 0; u < w; u++) {

//    //        constraints.push([
//    //            particles[index(u, v)],
//    //            particles[index(u + 1, v)],
//    //            restDistance
//    //        ]);

//    //    }


//    //    // While many systems use shear and bend springs,
//    //    // the relaxed constraints model seems to be just fine
//    //    // using structural springs.
//    //    // Shear
//    //    // const diagonalDist = Math.sqrt(restDistance * restDistance * 2);


//    //    // for (v=0;v<h;v++) {
//    //    // 	for (u=0;u<w;u++) {

//    //    // 		constraints.push([
//    //    // 			particles[index(u, v)],
//    //    // 			particles[index(u+1, v+1)],
//    //    // 			diagonalDist
//    //    // 		]);

//    //    // 		constraints.push([
//    //    // 			particles[index(u+1, v)],
//    //    // 			particles[index(u, v+1)],
//    //    // 			diagonalDist
//    //    // 		]);

//    //    // 	}
//    //    // }


//    //    this.particles = particles;
//    //    this.constraints = constraints;

//    //    function index(u, v) {

//    //        return u + v * (w + 1);

//    //    }

//    //    this.index = index;

//    //}





//    // this.simulate
//    return;
//    //{
//    //    var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//    //    var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));
//    //    var lineGeometry = new THREE.Geometry();
//    //    lineGeometry.vertices.push(start);
//    //    lineGeometry.vertices.push(end);
//    //    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//    //    var line = new THREE.Line(lineGeometry, lineMaterial);
//    //    objMain.scene.add(line);
//    //}


//    // var enterroad = end - start;
//    //console.log('enterroad', enterroad);
//    var initializeCars = function (fp) {
//        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(objMain.basePoint.Latitde))
//        var end = new THREE.Vector3(MercatorGetXbyLongitude(objMain.basePoint.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(objMain.basePoint.positionLatitudeOnRoad))
//        var cc = new Complex(end.x - start.x, end.z - start.z);
//        cc.toOne();

//        var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
//        var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
//        var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
//        var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
//        var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

//        var positons = [positon1, positon2, positon3, positon4, positon5];

//        var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
//        console.log('positons', positons);
//        var percentOfPosition = 0.25;
//        for (var i = 0; i < positons.length; i++) {
//            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//            var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
//            var lineGeometry = new THREE.Geometry();
//            lineGeometry.vertices.push(start);
//            lineGeometry.vertices.push(end);
//            var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//            var line = new THREE.Line(lineGeometry, lineMaterial);
//            objMain.scene.add(line);

//            var model = objMain.cars[names[i]].clone();
//            model.position.set(end.x, 0, end.z);
//            model.scale.set(0.002, 0.002, 0.002);
//            model.rotateY(-positons[i].toAngle());
//            objMain.roadGroup.add(model);
//        }
//        var minDistance = objMain.controls.minDistance * 1.1;
//        var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
//    }




//    //  cc.multiply(6);


//    var positon1 = cc.multiply(new Complex(-0.309016994, 0.951056516));
//    var positon2 = positon1.multiply(new Complex(0.809016994, 0.587785252));
//    var positon3 = positon2.multiply(new Complex(0.809016994, 0.587785252));
//    var positon4 = positon3.multiply(new Complex(0.809016994, 0.587785252));
//    var positon5 = positon4.multiply(new Complex(0.809016994, 0.587785252));

//    var positons = [positon1, positon2, positon3, positon4, positon5];
//    var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
//    console.log('positons', positons);
//    var percentOfPosition = 0.25;
//    for (var i = 0; i < positons.length; i++) {
//        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
//        var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, 0, start.z + positons[i].i * percentOfPosition);
//        var lineGeometry = new THREE.Geometry();
//        lineGeometry.vertices.push(start);
//        lineGeometry.vertices.push(end);
//        var lineMaterial = new THREE.LineBasicMaterial({ color: color });
//        var line = new THREE.Line(lineGeometry, lineMaterial);
//        objMain.scene.add(line);

//        var model = objMain.cars[names[i]].clone();
//        model.position.set(end.x, 0, end.z);
//        model.scale.set(0.002, 0.002, 0.002);
//        model.rotateY(-positons[i].toAngle());
//        objMain.roadGroup.add(model);
//    }
//    var minDistance = objMain.controls.minDistance * 1.1;
//    var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
//    //var kValue = planeLength
//    {
//        var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
//        objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

//        objMain.controls.target.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
//        objMain.camera.lookAt(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);

//        // var polarAngle = objMain.controls.getPolarAngle();
//        //   objMain.camera.position.set(objMain.basePoint.MacatuoX, 10, -objMain.basePoint.MacatuoY - Math.tan(Math.PI / 6) * 10);

//        objMain.camera.lookAt(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
//    }
//}
//var drawCarBtnsFrame = function () {
//    while (document.getElementById('carsPanelFrame') != null) {
//        document.getElementById('carsPanelFrame').remove();
//        //carAbility.clear();
//    }

//    //  var carsNames = objMain.carsNames;
//    var divCreate = document.createElement('div');
//    divCreate.id = 'carsPanelFrame';
//    divCreate.style.position = 'absolute';
//    divCreate.style.width = '9em';
//    divCreate.style.height = 'calc(6em + 48px)';
//    divCreate.style.zIndex = '6';
//    divCreate.style.left = '0em';

//    divCreate.style.top = 'calc(50% - 20px - 2px - 3em)';
//    divCreate.style.fontSize = '20px';
//    divCreate.style.color = 'blue';
//    divCreate.style.textShadow = '1px 1px 1px #000000';
//    divCreate.style.borderColor = 'deepskyblue';
//    var colors = ['yellow', 'red', 'green', 'blue', 'black'];
//    var addChildren = function (length) {
//        for (var i = 0; i < 5; i++) {
//            //text += "        <div style=\"width: calc(100% - 2px);";
//            //text += "        text-align: center;";
//            //text += "        border: 1px solid deepskyblue;";
//            //text += "        border-radius: 0.3em;";
//            //text += "        margin-top: 4px;";
//            //text += "        margin-bottom: 4px;\">";
//            //text += "            <span id=\"carASpan\">啊啊啊啊啊啊啊</span>";
//            //text += "        </div>";
//            var divChildOfItem = document.createElement('div');
//            var id = 'carsPanelFrame' + '_' + 'child' + i;
//            divChildOfItem.id = id;
//            divChildOfItem.style.width = 'calc(100%)';
//            divChildOfItem.style.height = 'calc(( 6em + 48px ) / 5)';
//            //  divChildOfItem.style.backgroundColor = colors[i]; //colors
//            //divChildOfItem.style.display = 'inline';

//            divCreate.appendChild(divChildOfItem);
//        }
//    }
//    addChildren(5);
//    //   divCreate.onabort

//    document.body.appendChild(divCreate);
//};
//var drawCarBtns = function () {
//    {
//        var ff = function () {
//            while (document.getElementById('taskOperatingPanel') != null) {
//                document.getElementById('taskOperatingPanel').remove();
//            }
//            var divTaskOperatingPanel = document.createElement('div');
//            divTaskOperatingPanel.id = 'taskOperatingPanel';
//            //position: absolute;
//            //z - index: 7;
//            //right: 20px; border: none; width: 5em; color: green; top: calc(50 % - 4em - 28px)
//            divTaskOperatingPanel.style.position = 'absolute';
//            divTaskOperatingPanel.style.zIndex = '7';
//            divTaskOperatingPanel.style.right = '20px';
//            divTaskOperatingPanel.style.border = 'none';
//            divTaskOperatingPanel.style.width = '5em';
//            divTaskOperatingPanel.style.color = 'green';
//            divTaskOperatingPanel.style.top = 'calc(50% - 5em - 32px)';

//            var addItemToTaskOperatingPanle = function (btnName, clickF) {
//                var div = document.createElement('div');
//                div.style.width = 'calc(5em - 4px)';
//                div.style.textAlign = 'center';
//                div.style.border = '2px inset #ffc403';
//                div.style.borderRadius = '0.3em';
//                div.style.marginTop = '4px';
//                div.style.marginBottom = '4px';
//                div.style.background = 'rgba(0, 191, 255, 0.6)';
//                var span = document.createElement('span');
//                span.innerText = btnName;
//                div.appendChild(span);
//                //  <span id="carASpan">提升续航</span>

//                div.onclick = function () { clickF(); }
//                divTaskOperatingPanel.appendChild(div);
//            }
//            var showBtnEvent = function (show) {
//                while (document.getElementById('carsSelectionPanel') != null) {
//                    document.getElementById('carsSelectionPanel').remove();
//                    carAbility.clear();
//                }
//                if (!show) {
//                    return;
//                }
//                var carsNames = objMain.carsNames;
//                var divCreate = document.createElement('div');
//                divCreate.id = 'carsSelectionPanel';
//                divCreate.style.position = 'absolute';
//                divCreate.style.width = '8em';
//                divCreate.style.height = 'calc(6em + 48px)';
//                divCreate.style.zIndex = '6';
//                divCreate.style.left = '1em';
//                divCreate.style.top = 'calc(50% - 20px - 2px - 3em)';
//                divCreate.style.fontSize = '20px';
//                divCreate.style.color = 'blue';
//                divCreate.style.textShadow = '1px 1px 1px #000000';
//                divCreate.style.borderColor = 'deepskyblue';

//                var addChildren = function (carsNames) {
//                    for (var i = 0; i < carsNames.length; i++) {
//                        //text += "        <div style=\"width: calc(100% - 2px);";
//                        //text += "        text-align: center;";
//                        //text += "        border: 1px solid deepskyblue;";
//                        //text += "        border-radius: 0.3em;";
//                        //text += "        margin-top: 4px;";
//                        //text += "        margin-bottom: 4px;\">";
//                        //text += "            <span id=\"carASpan\">啊啊啊啊啊啊啊</span>";
//                        //text += "        </div>";
//                        var divChildOfItem = document.createElement('div');
//                        divChildOfItem.style.width = 'calc(100% - 2px)';
//                        divChildOfItem.style.textAlign = 'center';
//                        divChildOfItem.style.border = '1px solid deepskyblue';
//                        divChildOfItem.style.borderRadius = '0.3em';
//                        divChildOfItem.style.marginTop = '4px';
//                        divChildOfItem.style.marginBottom = '4px';
//                        divChildOfItem.yrqTagIndex = i + 0;
//                        //divChildOfItem.parentNode
//                        divChildOfItem.onclick = function () {
//                            //   alert(this.yrqTagIndex);
//                            //console.log('parentNode', this);
//                            //console.log('parentNode', this.parentNode);

//                            for (var i = 0; i < 5; i++) {
//                                //  console.log(i, this.parentNode.children[i]);

//                                if (i == this.yrqTagIndex) {
//                                    this.parentNode.children[i].style.border = '2px inset #ffc403';
//                                    // alert('');
//                                    while (document.getElementById('itemNodes2') != null) {
//                                        document.getElementById('itemNodes2').remove();
//                                    }

//                                    var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
//                                    objMain.Task.carSelect = names[i] + '_' + objMain.indexKey;
//                                    carAbility.drawPanel(names[i]);
//                                    if (objMain.PromoteList.indexOf(objMain.Task.state) >= 0)
//                                        objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
//                                    else if (objMain.Task.state == 'collect')
//                                        objMain.mainF.lookTwoPositionCenter(objMain.collectGroup.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
//                                    /*
//                                     * 以下方法用户绘制二级菜单
//                                     */
//                                    if (false) {
//                                        var divCreate2 = document.createElement('div');
//                                        divCreate2.id = 'itemNodes2';
//                                        divCreate2.style.position = 'absolute';
//                                        divCreate2.style.width = '3em';
//                                        divCreate2.style.height = 'calc(6em + 48px)';
//                                        divCreate2.style.zIndex = '6';
//                                        divCreate2.style.left = '11em';
//                                        //calc(50% - 20px - 2px - 3em);
//                                        var emV = i.toString() + 'em';
//                                        var pxV = (i * 12).toString() + 'px'
//                                        divCreate2.style.top = 'calc(50% - 20px - 2px - 3em + ' + emV + ' + ' + pxV + ')';
//                                        divCreate2.style.fontSize = '20px';
//                                        divCreate2.style.color = 'blue';
//                                        divCreate2.style.textShadow = '1px 1px 1px #000000';
//                                        divCreate2.style.borderColor = 'deepskyblue';
//                                        /*这里要显示条目*/
//                                        var displays = ['属性', '任务'];
//                                        for (var jj = 0; jj < 2; jj++) {
//                                            var divChildOfItem2 = document.createElement('div');
//                                            divChildOfItem2.style.width = 'calc(100% - 2px)';
//                                            divChildOfItem2.style.textAlign = 'center';
//                                            divChildOfItem2.style.border = '1px solid #ffc403';
//                                            divChildOfItem2.style.borderRadius = '0.3em';
//                                            divChildOfItem2.style.marginTop = '4px';
//                                            divChildOfItem2.style.marginBottom = '4px';
//                                            // divChildOfItem2.innerText = '啊啊';
//                                            divCreate2.appendChild(divChildOfItem2);
//                                            divChildOfItem2.yrqTagIndex = jj + 0;

//                                            var spanOfItem2 = document.createElement('span');
//                                            spanOfItem2.innerText = displays[jj];
//                                            divChildOfItem2.appendChild(spanOfItem2);
//                                            switch (jj) {
//                                                case 0:
//                                                    {
//                                                        divChildOfItem2.onclick = function () {
//                                                            alert('获取属性');
//                                                        }
//                                                    }; break;
//                                                case 1:
//                                                    {
//                                                        divChildOfItem2.onclick = function () {
//                                                            alert('获取任务');
//                                                        }
//                                                    }; break;
//                                            }
//                                        }
//                                        document.body.appendChild(divCreate2);
//                                    }
//                                }
//                                else {
//                                    this.parentNode.children[i].style.border = '1px solid deepskyblue';
//                                }
//                            }
//                            //                this.parentNode
//                        }

//                        var spanOfItem = document.createElement('span');
//                        spanOfItem.innerText = carsNames[i];
//                        divChildOfItem.appendChild(spanOfItem);
//                        divCreate.appendChild(divChildOfItem);
//                    }
//                    if (false) {
//                        var divChildOfItem = document.createElement('div');
//                        divChildOfItem.style.width = '3em';
//                        divChildOfItem.style.textAlign = 'center';
//                        divChildOfItem.style.border = '1px solid gray';
//                        divChildOfItem.style.borderRadius = '0.3em';
//                        divChildOfItem.style.marginTop = '4px';
//                        divChildOfItem.style.marginBottom = '4px';
//                        divChildOfItem.style.color = 'yellowgreen';

//                        var spanOfItem = document.createElement('span');
//                        spanOfItem.innerText = '隐藏';
//                        divChildOfItem.appendChild(spanOfItem);

//                        divChildOfItem.onclick = function () {
//                            this.onclick = function () {
//                                divCreate.innerHTML = '';
//                                addChildren(carsNames);
//                                this.style.width = '3em';
//                                this.children[0].innerText = '隐藏';
//                            }
//                            while (divCreate.children.length > 1) {
//                                divCreate.removeChild(divCreate.children[0]);
//                            }
//                            this.style.width = '5em';
//                            this.children[0].innerText = '显示车辆';
//                            while (document.getElementById('itemNodes2') != null) {
//                                document.getElementById('itemNodes2').remove();
//                            }
//                        }
//                        divCreate.appendChild(divChildOfItem);
//                    }
//                }
//                addChildren(carsNames);

//                //   divCreate.onabort

//                document.body.appendChild(divCreate);
//            }
//            addItemToTaskOperatingPanle('收集金钱', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'collect';
//                objMain.Task.carSelect = '';
//                // alert('提升续航');
//                console.log('点击', '收集金钱');
//                objMain.mainF.refreshCollectAndPanle();
//            });
//            addItemToTaskOperatingPanle('使用物品', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'ability';
//                objMain.Task.carSelect = '';
//                objMain.mainF.lookAtPosition(objMain.basePoint);
//                objMain.mainF.refreshPromotePanel();
//            });
//            addItemToTaskOperatingPanle('提升续航', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'mile'
//                objMain.Task.carSelect = '';
//                // alert('提升续航');
//                console.log('点击', '提升续航');
//                objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state]);
//            });
//            addItemToTaskOperatingPanle('提升业务', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'business'
//                // alert('提升续航');
//                console.log('点击', '提升业务');
//                objMain.Task.carSelect = '';
//                objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state]);
//            });
//            addItemToTaskOperatingPanle('提升容量', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'volume'
//                // alert('提升续航');
//                console.log('点击', '提升容量');
//                objMain.Task.carSelect = '';
//                objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state]);
//            });
//            addItemToTaskOperatingPanle('提升速度', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'speed';
//                // alert('提升续航');
//                console.log('点击', '提升速度');
//                objMain.Task.carSelect = '';
//                objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state]);
//            });
//            addItemToTaskOperatingPanle('收取税金', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'getTax';
//                objMain.mainF.refreshTaxPanel();
//                alert('收取税金！');
//            });
//            addItemToTaskOperatingPanle('打压对手', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'attack';
//                objMain.mainF.refreshAttackPanel();

//            });
//            document.body.appendChild(divTaskOperatingPanel);
//        };
//        // ff();
//        var showTradeAndDialog = function () {


//        }

//        var clearBtnOfObj = function (id) {
//            if (document.getElementById(id) == null) { }
//            else {
//                var tp = document.getElementById(id);
//                while (tp.children.length > 0) {
//                    tp.children[0].remove();
//                }
//            }
//        }

//        var ff2 = function () {



//            while (document.getElementById('taskOperatingPanel') != null) {
//                document.getElementById('taskOperatingPanel').remove();
//            }
//            var divTaskOperatingPanel = document.createElement('div');
//            divTaskOperatingPanel.id = 'taskOperatingPanel';

//            divTaskOperatingPanel.style.position = 'absolute';
//            divTaskOperatingPanel.style.zIndex = '7';
//            divTaskOperatingPanel.style.right = '20px';
//            divTaskOperatingPanel.style.border = 'none';
//            divTaskOperatingPanel.style.width = '5em';
//            divTaskOperatingPanel.style.color = 'green';
//            //每个子对象1.3em 8px 共2.5个
//            divTaskOperatingPanel.style.top = 'calc(50% - 3.25em - 20px)';

//            var addItemToTaskOperatingPanle = function (btnName, id, clickF) {
//                var div = document.createElement('div');
//                div.style.width = 'calc(5em - 4px)';
//                div.style.textAlign = 'center';
//                div.style.border = '2px inset #ffc403';
//                div.style.borderRadius = '0.3em';
//                div.style.marginTop = '4px';
//                div.style.marginBottom = '4px';
//                div.style.background = 'rgba(0, 191, 255, 0.6)';
//                div.style.height = '1.3em';
//                div.id = id;

//                var span = document.createElement('span');
//                span.innerText = btnName;
//                div.appendChild(span);
//                //  <span id="carASpan">提升续航</span>

//                div.onclick = function () { clickF(); }
//                divTaskOperatingPanel.appendChild(div);
//            }
//            var showBtnEvent = function (show) {


//                carBtns.addBtnToFrame(objMain.carsNames, show);
//                return;
//            }
//            addItemToTaskOperatingPanle('收集', 'collectOrTaxBtn', function () {

//                var tmp = arguments;
//                clearBtnOfObj('taskOperatingPanel');
//                addItemToTaskOperatingPanle('收集金钱', 'collectMoneyBtn', function () {

//                    showBtnEvent(true);
//                    objMain.Task.state = 'collect';
//                    objMain.Task.carSelect = '';
//                    // alert('提升续航');
//                    console.log('点击', '收集金钱');
//                    var endF = ff2;
//                    objMain.mainF.refreshCollectAndPanle(endF);

//                    objMain.collectGroup.userData.endF = endF;
//                    clearBtnOfObj('taskOperatingPanel');

//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        tmp.callee();
//                    });
//                    //  ff2();
//                });
//                addItemToTaskOperatingPanle('收集分红', 'collectTaxBtn', function () {

//                    showBtnEvent(true);
//                    objMain.Task.state = 'getTax';
//                    objMain.mainF.refreshTaxPanel();
//                    objMain.Task.carSelect = '';
//                    //   alert('收取税金！');
//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //objMain.mainF.refreshCollectAndPanle();
//                    clearBtnOfObj('taskOperatingPanel');
//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        tmp.callee();
//                    });
//                });
//                addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                    showBtnEvent(false);
//                    objMain.Task.state = '';
//                    objMain.Task.carSelect = '';
//                    ff2();
//                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //objMain.mainF.refreshCollectAndPanle();
//                });

//                showBtnEvent(false);
//                objMain.Task.state = '';
//                objMain.Task.carSelect = '';
//                objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//            });
//            addItemToTaskOperatingPanle('使用', 'useObjBtn', function () {

//                var tmp = arguments;
//                clearBtnOfObj('taskOperatingPanel');
//                addItemToTaskOperatingPanle('提升', 'useObjToPromoteBtn', function () {
//                    clearBtnOfObj('taskOperatingPanel');
//                    showBtnEvent(true);
//                    objMain.Task.state = 'ability';
//                    objMain.Task.carSelect = '';
//                    objMain.mainF.lookAtPosition(objMain.basePoint);
//                    objMain.mainF.refreshPromotePanel();

//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //var endF = ff2;
//                    //objMain.mainF.refreshCollectAndPanle(endF);

//                    //objMain.collectGroup.userData.endF = endF;
//                    //clearBtnOfObj('taskOperatingPanel');

//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        tmp.callee();
//                    });
//                    //  ff2();
//                });
//                addItemToTaskOperatingPanle('出售', 'sellDiamondBtn', function () {

//                    clearBtnOfObj('taskOperatingPanel');
//                    showBtnEvent(false);
//                    objMain.Task.state = 'sellDiamond';
//                    objMain.Task.carSelect = '';
//                    objMain.mainF.lookAtPosition(objMain.basePoint);
//                    objMain.mainF.refreshPromotePanel();

//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //var endF = ff2;
//                    //objMain.mainF.refreshCollectAndPanle(endF);

//                    //objMain.collectGroup.userData.endF = endF;
//                    //clearBtnOfObj('taskOperatingPanel');

//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        tmp.callee();
//                    });
//                });
//                addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                    showBtnEvent(false);
//                    objMain.Task.state = '';
//                    objMain.Task.carSelect = '';
//                    ff2();
//                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //objMain.mainF.refreshCollectAndPanle();
//                });

//                showBtnEvent(false);
//                objMain.Task.state = '';
//                objMain.Task.carSelect = '';
//                objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                /*--新旧分割线--*/
//                return;
//                showBtnEvent(true);
//                objMain.Task.state = 'ability';
//                objMain.Task.carSelect = '';
//                objMain.mainF.lookAtPosition(objMain.basePoint);
//                objMain.mainF.refreshPromotePanel();
//            });
//            addItemToTaskOperatingPanle('宝石', 'useGetDiamondBtn', function () {


//                var tmp_S1 = arguments;
//                clearBtnOfObj('taskOperatingPanel');
//                addItemToTaskOperatingPanle('寻找', 'findDiamondBtn', function () {
//                    var tmp = arguments;
//                    clearBtnOfObj('taskOperatingPanel');
//                    addItemToTaskOperatingPanle('提升续航', 'getPromoteMileDiamondBtn', function () {
//                        showBtnEvent(true);
//                        objMain.Task.state = 'mile'
//                        objMain.Task.carSelect = '';
//                        // alert('提升续航');
//                        console.log('点击', '提升续航');
//                        var endF = ff2;
//                        objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state], endF);

//                        clearBtnOfObj('taskOperatingPanel');
//                        addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                            tmp.callee();
//                        });
//                    });
//                    addItemToTaskOperatingPanle('提升业务', 'getPromoteBusinessDiamondBtn', function () {
//                        showBtnEvent(true);
//                        objMain.Task.state = 'business'
//                        // alert('提升续航');
//                        console.log('点击', '提升业务');
//                        objMain.Task.carSelect = '';
//                        var endF = ff2;
//                        objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state], endF);

//                        clearBtnOfObj('taskOperatingPanel');
//                        addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                            tmp.callee();
//                        });
//                    });
//                    addItemToTaskOperatingPanle('提升容量', 'getPromoteVolumeDiamondBtn', function () {
//                        showBtnEvent(true);
//                        objMain.Task.state = 'volume'
//                        // alert('提升续航');
//                        console.log('点击', '提升容量');
//                        objMain.Task.carSelect = '';
//                        var endF = ff2;
//                        objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state], endF);

//                        clearBtnOfObj('taskOperatingPanel');
//                        addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                            tmp.callee();
//                        });
//                    });
//                    addItemToTaskOperatingPanle('提升速度', 'getPromoteSpeedDiamondBtn', function () {
//                        showBtnEvent(true);
//                        objMain.Task.state = 'speed';
//                        // alert('提升续航');
//                        console.log('点击', '提升速度');
//                        objMain.Task.carSelect = '';
//                        var endF = ff2;
//                        objMain.mainF.refreshPromotionDiamondAndPanle(objMain.PromotePositions[objMain.Task.state], endF);

//                        clearBtnOfObj('taskOperatingPanel');
//                        addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                            tmp.callee();
//                        });
//                    });
//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        //showBtnEvent(false);
//                        //objMain.Task.state = '';
//                        //objMain.Task.carSelect = '';
//                        //ff2();
//                        //objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                        tmp_S1.callee();
//                        //showBtnEvent(true);
//                        //objMain.Task.state = 'collect';
//                        //objMain.Task.carSelect = '';
//                        //// alert('提升续航');
//                        //console.log('点击', '收集金钱');
//                        //objMain.mainF.refreshCollectAndPanle();
//                    });

//                    showBtnEvent(false);
//                    objMain.Task.state = '';
//                    objMain.Task.carSelect = '';
//                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);

//                    //  ff2();
//                });
//                addItemToTaskOperatingPanle('购买', 'buyDiamondBtn', function () {
//                    // var tmp = arguments;
//                    showBtnEvent(false);
//                    objMain.Task.state = 'buyDiamond';
//                    objMain.mainF.refreshBuyPanel();
//                    objMain.Task.carSelect = '';
//                    objMain.mainF.lookAtPosition(objMain.basePoint);
//                    //   alert('收取税金！');
//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //objMain.mainF.refreshCollectAndPanle();
//                    clearBtnOfObj('taskOperatingPanel');
//                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                        tmp_S1.callee();
//                    });
//                });
//                addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
//                    showBtnEvent(false);
//                    objMain.Task.state = '';
//                    objMain.Task.carSelect = '';
//                    ff2();
//                    objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                    //showBtnEvent(true);
//                    //objMain.Task.state = 'collect';
//                    //objMain.Task.carSelect = '';
//                    //// alert('提升续航');
//                    //console.log('点击', '收集金钱');
//                    //objMain.mainF.refreshCollectAndPanle();
//                });

//                showBtnEvent(false);
//                objMain.Task.state = '';
//                objMain.Task.carSelect = '';
//                objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
//                /*------*/

//            });
//            addItemToTaskOperatingPanle('打压', 'attackOthersBtn', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'attack';
//                objMain.mainF.refreshAttackPanel();
//                objMain.Task.carSelect = '';
//            });
//            addItemToTaskOperatingPanle('召回', 'commandToReturnBtn', function () {
//                showBtnEvent(true);
//                objMain.Task.state = 'setReturn';
//                objMain.Task.carSelect = '';
//                objMain.mainF.lookAtPosition(objMain.basePoint);
//                objMain.mainF.refreshSetReturnPanel();
//            });
//            document.body.appendChild(divTaskOperatingPanel);
//        }

//        ff2();
//    }

//}

//var SysOperatePanel =
//{
//    draw: function () {
//        while (document.getElementById('sysOperatePanel') != null) {
//            document.getElementById('sysOperatePanel').remove();
//        }
//        var divSysOperatePanel = document.createElement('div');
//        divSysOperatePanel.id = 'sysOperatePanel';
//        divSysOperatePanel.style.position = 'absolute';
//        divSysOperatePanel.style.zIndex = '7';
//        divSysOperatePanel.style.top = 'calc(100% - 2.5em - 8px)';
//        divSysOperatePanel.style.left = '8px';
//        {
//            var img = document.createElement('img');
//            img.id = 'msgToNotify'
//            img.src = 'Pic/chatPng.png';
//            img.classList.add('chatdialog');
//            img.style.border = 'solid 1px yellowgreen';
//            img.style.borderRadius = '5px';
//            img.style.height = 'calc(2.5em - 2px)';
//            img.style.width = 'auto';

//            img.onclick = function () {
//                // alert('打开聊天框');
//                dialogSys.show();
//            };

//            divSysOperatePanel.appendChild(img);
//        }
//        {
//            var img = document.createElement('img');
//            img.id = 'moneyServe'
//            img.src = 'Pic/trade.png';
//            img.classList.add('chatdialog');
//            img.style.border = 'solid 1px yellowgreen';
//            img.style.borderRadius = '5px';
//            img.style.height = 'calc(2.5em - 2px)';
//            img.style.width = 'auto';
//            img.style.marginLeft = "0.5em";
//            img.onclick = function () {
//                // alert('打开聊天框');
//                //      dialogSys.show();
//                //alert('弹出对话框');
//                moneyOperator.add();
//            };

//            divSysOperatePanel.appendChild(img);
//        }
//        {
//            var img = document.createElement('img');
//            img.id = 'moneySubsidize'
//            img.src = 'Pic/subsidize.png';
//            img.classList.add('chatdialog');
//            img.style.border = 'solid 1px yellowgreen';
//            img.style.borderRadius = '5px';
//            img.style.height = 'calc(2.5em - 2px)';
//            img.style.width = 'auto';
//            img.style.marginLeft = "0.5em";
//            img.onclick = function () {
//                // alert('打开聊天框');
//                //      dialogSys.show();
//                //alert('弹出对话框');
//                subsidizeSys.add();
//                //moneyOperator.add();
//            };

//            divSysOperatePanel.appendChild(img);
//        }
//        {
//            var img = document.createElement('img');
//            img.id = 'moneySubsidize'
//            img.src = 'Pic/subsidize.png';
//            img.classList.add('chatdialog');
//            img.style.border = 'solid 1px yellowgreen';
//            img.style.borderRadius = '5px';
//            img.style.height = 'calc(2.5em - 2px)';
//            img.style.width = 'auto';
//            img.style.marginLeft = "0.5em";
//            img.onclick = function () {
//                alert('债务框！');
//                //      dialogSys.show();
//                //alert('弹出对话框');
//                //subsidizeSys.add();
//                //moneyOperator.add();
//            };

//            divSysOperatePanel.appendChild(img);
//        }
//        document.body.appendChild(divSysOperatePanel);
//    },
//    notifyMsg: function () {
//        var element = document.getElementById('msgToNotify');
//        element.classList.add('msg');
//    },
//    cancelNotifyMsg: function () {
//        var element = document.getElementById('msgToNotify');
//        element.classList.remove('msg');
//    }
//};
//var drawSysOperatePanel = function () {

//}




//var drawCarControlTable = function () {
//    var divContainer = document.createElement('div');
//    divContainer.style.position = '';
//    divContainer.style.position = '';
//}

//var mouseClickInterviewState = (function () {
//    this.i = [0, 100000];
//    this.step = 0;
//    var that = this;
//    this.click = function () {
//        that.i[that.step] = Date.now();
//        that.step++;
//        that.step = that.step % 2;
//        if (Math.abs(that.i[1] - that.i[0]) < 400) {
//            console.log('双击时间', Math.abs(that.i[1] - that.i[0]));
//            that.init();
//            return true;
//        }
//        else {
//            console.log('双击时间', Math.abs(that.i[1] - that.i[0]));
//            return false;
//        }
//    };
//    this.init = function () {
//        that.i[0] = 0; that.i[1] = 100000; that.step = 0;
//        return that;
//    }
//    return this;
//})().init();

///////////////
///*
// * 复数类
// */
//function Complex(R, I) {
//    if (isNaN(R) || isNaN(I)) { throw new TypeError('Complex params require Number'); }
//    this.r = R;
//    this.i = I;
//}
//// 加法
//Complex.prototype.add = function (that) {
//    return new Complex(this.r + that.r, this.i + that.i);
//};
//// 负运算
//Complex.prototype.neg = function () {
//    return new Complex(-this.r, -this.i);
//};
//// 乘法
//Complex.prototype.multiply = function (that) {
//    if (this.r === that.r && this.i + that.i === 0) {
//        return this.r * this.r + this.i * this.i
//    }
//    return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
//};
//// 除法
//Complex.prototype.divide = function (that) {
//    var a = this.r;
//    var b = this.i;
//    var c = that.r;
//    var d = that.i;
//    return new Complex((a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d));
//};
//// 模长
//Complex.prototype.mo = function () {
//    return Math.sqrt(this.r * this.r + this.i * this.i);
//};
////变为角度
//Complex.prototype.toAngle = function () {

//    if (this.r > 1e-6) {
//        var angle = Math.atan(this.i / this.r);
//        angle = (angle + Math.PI * 4) % (Math.PI * 2);
//        return angle;
//    }
//    else if (this.r < -1e-6) {
//        var angle = Math.atan(this.i / this.r);
//        angle = (angle + Math.PI * 3) % (Math.PI * 2);
//        return angle;
//    }
//    else if (this.i > 0) {
//        return Math.PI / 2;
//    }
//    else if (this.i < 0) {
//        return Math.PI * 3 / 2;
//    }
//    else {
//        throw 'this Complex can not change to angle';
//    }
//    return Math.sqrt(this.r * this.r + this.i * this.i);
//};
//Complex.prototype.toOne = function () {
//    var m = this.mo();
//    this.r /= m, this.i /= m;
//    //return Math.sqrt(this.r * this.r + this.i * this.i);
//};
//Complex.prototype.isZero = function () {
//    return this.mo() < 1e-4;
//}
//Complex.prototype.toString = function () {
//    return "{" + this.r + "," + this.i + "}";
//};
//// 判断两个复数相等
//Complex.prototype.equal = function (that) {
//    return that !== null && that.constructor === Complex && this.r === that.r && this.i === that.i;
//};
//Complex.ZERO = new Complex(0, 0);
//Complex.ONE = new Complex(1, 0);
//Complex.I = new Complex(0, 1);
//// 从普通字符串解析为复数
//Complex.parse = function (s) {
//    try {
//        var execres = Complex.parseRegExp.exec(s);
//        return new Complex(parseFloat(execres[1]), parseFloat(execres[2]));
//    } catch (e) {
//        throw new TypeError("Can't parse '" + s + "'to a complex");
//    }
//};
//Complex.parseRegExp = /^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/;
//// console.log(/^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/.exec('{2,3}'));
//// 示例代码 

//////////////