//import biandiansuo from 'showA.js';

var dataGet = {
    areaCode: 1, apiregionpoint: null, apislicearea: null, apitransformer: null,
    /*5G基站*/
    vgstation: null,
    /*管沟*/
    guangouData: null,
    interestpoint: null,
    exceptionArea: null,
    exceptionLine: null,
    controlpoint: null,
    getDateOfControl: function () { return '2020-03-15' },
    ControlPointDataday: {},
    polluteenterprise: null,
    lineData: null,
    lineExceptionInfo: null,
    courtData: null,
    micoroStation: null,
    micoroStationPointDataday: {},
    walkerData: null,
    blackOfTq: null,
    yingjiweiwenData: null,
    posNewData: null
};
function DataGet() {

    /*
     * 获取台区数据
     */
    this.getTransformerData = function (afterF) {
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': 1 },
            success: function (dataGotton) {

                console.log('想要的数据', dataGotton);
                dataGet.apitransformer = JSON.parse(dataGotton);
                afterF();
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    };

    this.getTransformerDataAtDate = function (date, afterF) {
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': 1, 'Date': date },
            success: function (dataGotton) {

                console.log('想要的数据', dataGotton);
                dataGet.apitransformer = JSON.parse(dataGotton);
                afterF(date);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    };

    this.getBoundyData = function (areaCode) {
        $.ajax({
            type: "POST",
            url: '~/data.apiregionpoint',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('read162', dataGotton);
                dataGet.apiregionpoint = JSON.parse(dataGotton);
                var data = dataGet.apiregionpoint[0].coordinate;
                var vertices = [];
                //var deltaY = 0.02;
                for (var i = 0; i < data.length; i++) {
                    var lon = data[i].Lon;
                    var lat = data[i].Lat;
                    vertices.push(MercatorGetXbyLongitude(lon), 0, -MercatorGetYbyLatitude(lat));


                }
                if (data.length > 2) {
                    var i = 0;
                    var lon = data[i].Lon;;
                    var lat = data[i].Lat;
                    vertices.push(MercatorGetXbyLongitude(lon), 0, -MercatorGetYbyLatitude(lat));
                }
                // var geometry = new THREE.Geometry();
                var geometry = new THREE.LineGeometry();
                //var color = 0x66ff00;
                geometry.setPositions(vertices);
                var material = new THREE.LineMaterial({
                    color: showAConfig.boundry.color,
                    linewidth: showAConfig.boundry.width,
                });
                material.renderOrder = 9;
                material.depthTest = false;
                var line = new THREE.Line2(geometry, material);
                line.computeLineDistances();
                line.renderOrder = 0;
                line.scale.set(1, 1, 1);
                line.renderOrder = 9;
                boundryGroup.add(line);

                boundryGroup.position.z = -1;
            },
            error: function (err) {
                console.log('~/data.apiregionpoint', err);
            }
        });
    }
    this.drawRegionBlock = function (areaCode) {
        $.ajax({
            type: "POST",
            url: '~/data.apislicearea',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('read162', dataGotton);
                dataGet.apislicearea = JSON.parse(dataGotton);
                var data = dataGet.apislicearea;
                var drawRegionBlockItem2 = function (itemData, itemIndex) {


                    //var cadLeftTop = { x: 16369.1554, y: 67202.5534 };
                    //var cadRightBottom = { x: 20907.227, y: 62778.341 };

                    //var baiduMapLeftTop = { x: 112.540805, y: 37.906085 };//112.540805,37.906085
                    //var baiduMapRightBottom = { x: 112.592103, y: 37.866438 };//112.592103,37.866538 865538
                    var polygonData = itemData.coordinate;

                    var points = [];
                    for (var i = 0; i < itemData.coordinate.length; i++) {
                        points.push({ x: MercatorGetXbyLongitude(itemData.coordinate[i]['Lon']), z: MercatorGetYbyLatitude(itemData.coordinate[i]['Lat']) });
                    }
                    var nameOfRegionBlock = itemData.Name;
                    var area = (function (points) {
                        var max_x = -1000000;
                        var min_x = 1000000;

                        var max_z = -1000000;
                        var min_z = 1000000

                        var x_v = 0;
                        var z_v = 0;
                        var area = 0;
                        var k = 1;
                        var c = 0;
                        for (var i = 0; i < points.length; i++) {
                            if (points[i].x > max_x) {
                                max_x = points[i].x;
                            }
                            if (points[i].x < min_x) {
                                min_x = points[i].x;
                            }
                            if (points[i].z > max_z) {
                                max_z = points[i].z;
                            }
                            if (points[i].z < min_z) {
                                min_z = points[i].z;
                            }

                            var previous = points[(i - 1 + points.length) % points.length];
                            var current = points[i];

                            area += previous.x * current.z - previous.z * current.x;
                            //   c += getLengthOfTwoPoint(getBaiduPositionLon(previous.x), getBaiduPositionLat(-previous.z), getBaiduPositionLon(current.x), getBaiduPositionLat(-current.z));
                        }
                        if (points.length > 1) {
                            area = area / 2;
                            var areaRealWidth = getLengthOfTwoPoint(getBaiduPositionLon(min_x), getBaiduPositionLat((-min_z - max_z) / 2), getBaiduPositionLon(max_x), getBaiduPositionLat((-min_z - max_z) / 2));
                            var areaRealHeight = getLengthOfTwoPoint(getBaiduPositionLon((min_x + max_x) / 2), getBaiduPositionLat(-min_z), getBaiduPositionLon((min_x + max_x) / 2), getBaiduPositionLat(-max_z));


                            var length1 = getLengthOfTwoPoint(getBaiduPositionLon(min_x), getBaiduPositionLat(-min_z), getBaiduPositionLon(max_x), getBaiduPositionLat(-max_z));
                            var areaProjection = Math.abs((max_x - min_x) * (max_z - min_z));
                            if (areaProjection > 1e-5) {
                                area = area / areaProjection * (areaRealWidth * areaRealHeight);
                                //var cStr = c > 1000 ? ((Math.round(c / 10) / 100) + '千米') : ((Math.round(c)) + '米');
                                //var areaStr = Math.abs((Math.round(area))) + '平米';
                                //measureAreaObj.measureAreaDiv.textContent = '周长：' + cStr + ',面积：' + areaStr + ',负荷密度：' + Math.round((c / 100 * randomV), 2) + '兆瓦/平方公里';
                            }
                            else {
                                // measureAreaObj.measureAreaDiv.textContent = ' ';
                            }
                        }
                        else {
                            measureAreaObj.measureAreaDiv.textContent = ' ';
                        }
                        return Math.abs(area);
                    })(points);

                    var regionPts = [];
                    var color = itemData.Color;
                    var opacity = itemData.opacity;
                    var code = itemData.Code;
                    var regionType = itemData.SliceAreaType;
                    var PlotRatio = itemData.PlotRatio;
                    var Population = itemData.Population;

                    var W = itemData.W;
                    var F = itemData.F;
                    var K = itemData.K;
                    var loadLast = itemData.loadLast;
                    var loadNumber = itemData.loadNumber;
                    // var W = itemData.W;

                    //"W": 0.8, "F": 0.9, "K": 0.5, "loadLast": 1.24697173, "loadNumber": 12.0
                    //var sumSql = '';
                    for (var i = 0; i < polygonData.length; i++) {

                        //var x = polygonData[i][0];

                        var lon = polygonData[i]['Lon'];
                        var lat = polygonData[i]['Lat'];

                        //var lon = baiduMapLeftTop.x + (polygonData[i][0] - cadLeftTop.x) / (cadRightBottom.x - cadLeftTop.x) * (baiduMapRightBottom.x - baiduMapLeftTop.x);
                        //var lat = baiduMapRightBottom.y + (polygonData[i][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                        var x_m = MercatorGetXbyLongitude(lon);
                        var z_m = MercatorGetYbyLatitude(lat);
                        // positions.push(x_m, 1, 0 - z_m);
                        //var sql = 'update area_wise_pos set lon=' + lon + ',lat=' + lat + ' where aw_id=' + (itemIndex + 2) + ' and sort=' + i + ';';//(aw_id,,lat,sort)VALUES(' + (itemIndex + 2) + ',' + lon + ',' + lat + ',' + i + ');';
                        //sumSql += sql;
                        regionPts.push(new THREE.Vector2(x_m, z_m));
                    }
                    var regionShape = new THREE.Shape(regionPts);
                    var extrudeSettings = { depth: 0.3, bevelEnabled: false };
                    var geometry = new THREE.ExtrudeBufferGeometry(regionShape, extrudeSettings);

                    //var color = 0x666600;
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
                    var material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, transparent: true, opacity: opacity });
                    material.depthTest = false;
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, 0);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.scale.set(1, 1, 1);
                    mesh.Tag =
                    {
                        regionType: regionType,//regionTypes[itemIndex % 8],
                        //regionTypeSimple: regionTypeSimples[itemIndex % 8],
                        rongjilv: 99,
                        code: code,
                        'area': area,
                        'name': nameOfRegionBlock,
                        'PlotRatio': PlotRatio,
                        'Population': Population,
                        'W': W,
                        'F': F,
                        'K': K,
                        'loadLast': loadLast,
                        'loadNumber': loadNumber
                    };
                    mesh.renderOrder = 97;
                    regionBlockGroup.add(mesh);
                    regionBlockGroup.position.z = -1;
                    //return sumSql;
                }
                var sumSqlss = '';
                for (var i = 0; i < data.length; i++) {
                    drawRegionBlockItem2(data[i], i);
                    //'INSERT INTO area_wise (`name`,at_id,p_id)VALUES (\'' + '区块' + i + '\',' + (i + 2) + ',1);';
                }
                //console.log('sumSqlss', sumSqlss);
            },
            error: function (err) {
                console.log('~/data.apislicearea', err);
            }
        });
    }
    this.drawPeibian = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('read162', dataGotton);
                dataGet.apitransformer = JSON.parse(dataGotton);
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.apitransformer;
                var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

                //var deltaLon = 112.5492 - 112.536353;
                //var deltaLat = 37.889121 - 37.882311;
                //for (var i = 0; i < data.length; i++) { //data.length
                //    var lon = data[i].lon + deltaLon;
                //    var lat = data[i].lat + deltaLat + 0.0001;
                var sumSql = '';
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].Longitude;
                    var lat = data[i].Latitude;
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
                    data[i].name = data[i].Name;

                    child1.Tag = { part: '1', detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                    child2.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code };
                    data[i].name = data[i].s_name;
                    peibianGroup.add(child1);
                    peibianGroup.add(child2);

                    //var sqlItem = 'INSERT INTO transformer (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                    //sumSql += sqlItem;

                }
                // console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }
    this.drawPeibianWithDate = function (areaCode, date, afterf) {
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('read162', dataGotton);
                dataGet.apitransformer = JSON.parse(dataGotton);
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.apitransformer;
                var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

                //var deltaLon = 112.5492 - 112.536353;
                //var deltaLat = 37.889121 - 37.882311;
                //for (var i = 0; i < data.length; i++) { //data.length
                //    var lon = data[i].lon + deltaLon;
                //    var lat = data[i].lat + deltaLat + 0.0001;
                var sumSql = '';
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].Longitude;
                    var lat = data[i].Latitude;
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
                    data[i].name = data[i].Name;

                    child1.Tag = { part: '1', detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                    child2.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code };
                    data[i].name = data[i].s_name;
                    peibianGroup.add(child1);
                    peibianGroup.add(child2);

                    //var sqlItem = 'INSERT INTO transformer (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                    //sumSql += sqlItem;

                }
                // console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }
    this.drawPeibian_Icon = function (areaCode) {

        if (dataGet.apitransformer) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

            var data = dataGet.apitransformer;
            // var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

            //var deltaLon = 112.5492 - 112.536353;
            //var deltaLat = 37.889121 - 37.882311;
            //for (var i = 0; i < data.length; i++) { //data.length
            //    var lon = data[i].lon + deltaLon;
            //    var lat = data[i].lat + deltaLat + 0.0001;

            for (var i = 0; i < data.length; i++) { //data.length

                var lon = data[i].Longitude;
                var lat = data[i].Latitude;
                //var bdPosition = gcj02tobd09(lon, lat);
                //lon = bdPosition[0] + deltaLon;
                //lat = bdPosition[1] + deltaLat;
                // var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);


                var element = document.createElement('div');
                element.className = 'pointPeibian';

                var img = document.createElement('img');
                img.src = "Pic/bd_0.png";
                //state 表示正常 或异常 正常为0 ，异常为非0 异常包括重过载异常和台区线损异常
                //if (data[i].state == "0") {
                //    img.src = "Pic/bd_0.png";
                //    data[i].state = "0";
                //}
                //else {
                //    img.src = "Pic/bd_2.png";
                //}
                //if (dataGet.exceptionArea[data[i].tgId]) {
                //    img.src = "Pic/bd_1.png";
                //    data[i].state = "1";
                //}

                //img.style.width=''

                var element2 = document.createElement('div');

                var elementb = document.createElement('b');
                //elementb.innerText = data[i].name;

                //element2.appendChild(elementb);

                element.appendChild(img);
                //element.appendChild(element2);
                element.Tag = data[i];
                //element.onclick = function () { alert('A'); }

                var object = new THREE.CSS2DObject(element);


                object.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code, state: 0, tgId: data[i].tgId, statDate: data[i].statDate };
                // objects.push(object);

                // var schoolModel = xingquDianGroup.unit.school.clone();
                // console.log('itemData' + i, data[i]);

                //var objGroup = xingquDianGroup.unit.hosipital.clone();
                //var radius = 0.5;
                //var color = 'red';
                //var coordinates = data[i].Point.coordinates.split(',');
                //if (coordinates.length != 2) {
                //    continue;
                //}
                //var lon = Number.parseFloat(coordinates[0]) * kx + dx;
                //var lat = Number.parseFloat(coordinates[1]) * ky + dy;
                //var x_m = MercatorGetXbyLongitude(lon);
                //var z_m = MercatorGetYbyLatitude(lat);

                element.Tag = { detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state, tgId: data[i].tgId, statDate: data[i].statDate, index: i };
                element.addEventListener('click', function () {

                    //if (mouseClickInterviewState.click()) {
                    //    mouseClickInterviewState.init();
                    //}
                    //else {

                    //    return;
                    //}
                    if (mouseClickElementInterviewState.click()) {
                        mouseClickElementInterviewState.init();
                    }
                    else {
                        return;
                    }
                    var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "peibian", Tag: this.Tag })
                    top.postMessage(sendMsg, '*');
                    console.log('iframe外发送信息', sendMsg);
                    this.Tag.select = true;
                });

                // object.Tag = { detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                object.position.set(x_m, 0, -z_m);
                peibianGroup.add(object);

            }
        }

        return;
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {

                dataGet.apitransformer = JSON.parse(dataGotton);

            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    //drawPeibian_IconForwangjia
    this.drawPeibian_IconForwangjia = function (areaCode) {

        if (dataGet.apitransformer) {
            var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

            var data = dataGet.apitransformer;
            // var geometry = new THREE.ConeGeometry(0.04, 0.2, 8);

            //var deltaLon = 112.5492 - 112.536353;
            //var deltaLat = 37.889121 - 37.882311;
            //for (var i = 0; i < data.length; i++) { //data.length
            //    var lon = data[i].lon + deltaLon;
            //    var lat = data[i].lat + deltaLat + 0.0001;

            for (var i = 0; i < data.length; i++) { //data.length

                var lon = data[i].Longitude;
                var lat = data[i].Latitude;
                //var bdPosition = gcj02tobd09(lon, lat);
                //lon = bdPosition[0] + deltaLon;
                //lat = bdPosition[1] + deltaLat;
                // var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.6 }));
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);


                var element = document.createElement('div');
                //  element.Tag = data[i];
                element.className = 'pointPeibian';

                element.onmouseover = function (e) {
                    console.log('e', this.Tag);
                    taiqu.drawInfoLabel(this.Tag);
                }
                element.onmouseout = function () {
                    // console.log('e', this);
                    taiqu.cancleInfoLabel();
                }

                var img = document.createElement('img');
                img.src = "Pic/bd_0.png";
                //state 表示正常 或异常 正常为0 ，异常为非0 异常包括重过载异常和台区线损异常
                //if (data[i].state == "0") {
                //    img.src = "Pic/bd_0.png";
                //    data[i].state = "0";
                //}
                //else {
                //    img.src = "Pic/bd_2.png";
                //}
                //if (dataGet.exceptionArea[data[i].tgId]) {
                //    img.src = "Pic/bd_1.png";
                //    data[i].state = "1";
                //}

                //img.style.width=''

                var element2 = document.createElement('div');

                var elementb = document.createElement('b');
                //elementb.innerText = data[i].name;

                //element2.appendChild(elementb);

                element.appendChild(img);
                //element.appendChild(element2);
                element.Tag = data[i];
                //element.onclick = function () { alert('A'); }

                var object = new THREE.CSS2DObject(element);


                object.Tag = data[i];
                // objects.push(object);

                // var schoolModel = xingquDianGroup.unit.school.clone();
                // console.log('itemData' + i, data[i]);

                //var objGroup = xingquDianGroup.unit.hosipital.clone();
                //var radius = 0.5;
                //var color = 'red';
                //var coordinates = data[i].Point.coordinates.split(',');
                //if (coordinates.length != 2) {
                //    continue;
                //}
                //var lon = Number.parseFloat(coordinates[0]) * kx + dx;
                //var lat = Number.parseFloat(coordinates[1]) * ky + dy;
                //var x_m = MercatorGetXbyLongitude(lon);
                //var z_m = MercatorGetYbyLatitude(lat);

                element.Tag = data[i];
                element.addEventListener('click', function () {

                    //if (mouseClickInterviewState.click()) {
                    //    mouseClickInterviewState.init();
                    //}
                    //else {

                    //    return;
                    //}
                    if (mouseClickElementInterviewState.click()) {
                        mouseClickElementInterviewState.init();
                    }
                    else {
                        return;
                    }
                    var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "peibian", Tag: this.Tag })
                    top.postMessage(sendMsg, '*');
                    console.log('iframe外发送信息', sendMsg);
                    this.Tag.select = true;
                });

                // object.Tag = { detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                object.position.set(x_m, 0, -z_m);
                taiqu.group.add(object);

            }
        }

        return;
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {

                dataGet.apitransformer = JSON.parse(dataGotton);

            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }


    this.drawTongxin5G = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.apivgstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                //console.log('read162', dataGotton);
                dataGet.vgstation = JSON.parse(dataGotton);
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.vgstation;
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].Longitude;
                    var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;
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

                    //tongxin5GMapGroup.add(child1);
                    //tongxin5GMapGroup.add(child2);

                    // t3.position.set(x_m, 1 * s, -z_m);
                    child1.position.set(x_m, s * 4, -z_m);
                    child2.position.set(x_m, 1.5 * s, -z_m);
                    child1.scale.set(s, s, s);
                    child2.scale.set(s, s, s);
                    data[i].name = data[i].detail;

                    child1.Tag = { part: '1', detail: data[i].detail, select: false, id: data[i].Code };
                    child2.Tag = { part: '2', detail: data[i].detail, select: false, id: data[i].Code };
                    data[i].name = data[i].detail;
                    tongxin5GMapGroup.add(child1);
                    tongxin5GMapGroup.add(child2);

                    //var sqlItem = 'INSERT INTO space_based (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                    //sumSql += sqlItem;
                }
                //console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }
    this.drawTongxin5G_Icon = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.apivgstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                //console.log('read162', dataGotton);
                dataGet.vgstation = JSON.parse(dataGotton);
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.vgstation;
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].Longitude;
                    var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);


                    var element = document.createElement('div');
                    element.className = 'point-5G';

                    var img = document.createElement('img');
                    img.src = "Pic/jizhan5G_02.png";

                    //img.style.width=''

                    var element2 = document.createElement('div');

                    var elementb = document.createElement('b');
                    //elementb.innerText = data[i].name;

                    //element2.appendChild(elementb);

                    element.appendChild(img);
                    //element.appendChild(element2);
                    element.Tag = data[i];
                    //element.onclick = function () { alert('A'); }

                    var object = new THREE.CSS2DObject(element);


                    object.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                    object.position.set(x_m, 0, -z_m);
                    tongxin5GMapGroup.add(object);
                    continue;
                    /*--分割线--*/

                }
                //console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.drawTongxin5G_newData = function (areaCode) {
        $.ajax({
            type: "GET",
            url: 'data.a08apiPosNew',
            crossDomain: true,
            data: {},
            success: function (dataGotton) {
                console.log('drawTongxin5G_newData', dataGotton);


                dataGet.posNewData = JSON.parse(dataGotton);

                //   return;
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.posNewData;
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = parseFloat(data[i].Longitude)+0.013;
                    var lat = parseFloat(data[i].Latitude) + 0.0076;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                    var x_m = MercatorGetXbyLongitude(lon);
                    var z_m = MercatorGetYbyLatitude(lat);


                    var element = document.createElement('div');
                    element.className = 'point-5G';

                    var img = document.createElement('img');
                    img.src = "Pic/jizhan5G_02.png";

                    //img.style.width=''

                    var element2 = document.createElement('div');

                    var elementb = document.createElement('b');
                    elementb.innerText = data[i].Address;

                    element2.appendChild(elementb);

                    element.appendChild(img);
                    // element.appendChild(element2);
                    element.Tag = data[i];

                    element.onmouseover = function () {
                        console.log('状态', '进入');
                        console.log('状态', this);
                        document.getElementById('notifyMsgOf5G').style.cssText = this.style.cssText;
                        document.getElementById('notifyMsgOf5G').style.zIndex = '99999';
                        document.getElementById('notifyMsgOf5G').style.color = 'white';
                        document.getElementById('notifyMsgOf5G').style.textShadow = '1px 1px 1px yellow';
                        document.getElementById('notifyMsgOf5G').innerHTML =
                            `
  <div>地址${this.Tag.Address}</div>
<div>位置${this.Tag.Longitude},${this.Tag.Latitude}</div>
`; 
                    }
                    element.onmouseout = function () {
                        console.log('状态', '进入');
                        console.log('状态', this); 
                        document.getElementById('notifyMsgOf5G').style.zIndex = '-99999';
                        document.getElementById('notifyMsgOf5G').innerHTML = ''; 
                    }
                    //element.onclick = function () { alert('A'); }

                    var object = new THREE.CSS2DObject(element);


                    object.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                    object.position.set(x_m, 0, -z_m);
                    tongxin5GMapGroup.add(object);
                    continue;
                    /*--分割线--*/

                }
                //console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.drawGuangou = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.apipipetrench',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('read162', dataGotton);
                dataGet.guangouData = JSON.parse(dataGotton);

                for (var i = 0; i < dataGet.guangouData.length; i++) {
                    var Code = dataGet.guangouData[i].Code;
                    var Name = dataGet.guangouData[i].Name;
                    var AreaCode = dataGet.guangouData[i].AreaCode;
                    var PipeTrenchType = dataGet.guangouData[i].PipeTrenchType;
                    var coordinates = dataGet.guangouData[i].coordinates;

                    if (coordinates.length < 2) {
                        continue;
                    }
                    else {
                        var positions = [];
                        var geometry = new THREE.LineGeometry();
                        var geometryLine = new THREE.BufferGeometry();
                        for (var j = 0; j < coordinates.length; j++) {
                            var lon = coordinates[j].Lon;
                            var lat = coordinates[j].Lat;
                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);
                            positions.push(x_m, 0, 0 - z_m);
                            positions.push(x_m, 0, 0 - z_m);
                        }

                        geometry.setPositions(positions);
                        var color = 'blue';
                        if (PipeTrenchType == 2) {
                            color = 'skyblue';
                        }
                        var material = new THREE.LineMaterial({
                            color: color,
                            linewidth: 0.003, // in pixels
                            //vertexColors: 0x12f43d,
                            ////resolution:  // to be set by renderer, eventually
                            //dashed: false
                        });
                        material.depthTest = false;
                        geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                        var material_ForSelect = new THREE.LineBasicMaterial({ color: 0, linewidth: 1, transparent: true, opacity: 0 });
                        var line_ForSelect = new THREE.Line(geometryLine, material_ForSelect);
                        line_ForSelect.Tag = { data: dataGet.guangouData[i] };
                        //line.Tag = { name: data[i].name, voltage: data[i].voltage }



                        var line = new THREE.Line2(geometry, material);
                        line.computeLineDistances();
                        line.Tag = { name: '', voltage: '', indexV: '', colorR: color };
                        line.renderOrder = 99;
                        line.scale.set(1, 1, 1);
                        //line.rotateX(-Math.PI / 2);
                        guangouGroup.add(line_ForSelect);
                        guangouGroup.add(line);
                        //var lon = 
                        //var lat = baiduMapRightBottom.y + (geometryFromData[j][1] - cadRightBottom.y) / (cadLeftTop.y - cadRightBottom.y) * (baiduMapLeftTop.y - baiduMapRightBottom.y);
                    }
                }

            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.drawPanorama = function (areaCode) {

        $.ajax({
            type: "POST",
            url: '~/data.apipanorama',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {

                var opreateGroup = panorama.group;
                if (opreateGroup.children.length == 0) {
                    // return;
                }
                else {
                    return;
                }
                //  console.log('read162', dataGotton);
                // read162 [{"Code": 1, "AreaCode": 1, "Longitude": "1.0000000000000000", "Latitude": "1.0000000000000000", "Details": "1"}]
                var objGotton = JSON.parse(dataGotton);
                for (var i = 0; i < objGotton.length; i++) {
                    var Code = objGotton[i].Code;
                    var AreaCode = objGotton[i].AreaCode;
                    var Longitude = parseFloat(objGotton[i].Longitude);
                    var Latitude = parseFloat(objGotton[i].Latitude);

                    var element = document.createElement('div');
                    element.className = 'pointLabelElement cursor';

                    var img = document.createElement('img');
                    img.src = "Pic/panorama.svg";
                    var element2 = document.createElement('div');

                    var elementb = document.createElement('b');
                    elementb.innerText = objGotton[i].Details;

                    element2.appendChild(elementb);

                    element.appendChild(img);
                    element.appendChild(element2);
                    element.Tag = objGotton[i];
                    //element.onclick = function () { alert('A'); }

                    var object = new THREE.CSS2DObject(element);

                    var x_m = MercatorGetXbyLongitude(Longitude);
                    var z_m = MercatorGetYbyLatitude(Latitude);
                    element.addEventListener('click', function () {
                        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "panorama", Tag: this.Tag })
                        top.postMessage(sendMsg, '*');
                        console.log('iframe外发送信息', sendMsg);
                    });

                    object.position.set(x_m, 0, -z_m);
                    opreateGroup.add(object);
                }
            },
            error: function (err) {
                console.log('~/data.apiregionpoint', err);
            }
        });
    }

    this.drawLine = function (areaCode) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);

                var operateGroup = electricLine.group;
                var obj = JSON.parse(dataGotton);
                dataGet.lineData = obj;
                if (operateGroup.children.length == 0) {
                    for (var i = 0; i < obj.length; i++) {
                        var dataItem = obj[i];
                        var segementID = dataItem.Code;
                        var Code = dataItem.SubstationCode;
                        var LineId = dataItem.LineId;
                        var Name = dataItem.Name;
                        var AreaCode = dataItem.AreaCode;
                        var Substation = dataItem.Substation;
                        var Voltage = dataItem.Voltage;
                        var color = dataItem.Color;
                        var coordinates = dataItem.coordinates;
                        var runDate = dataItem.RunDate;
                        var positions = [];
                        var geometryLine = new THREE.BufferGeometry();
                        var geometry = new THREE.LineGeometry();

                        var geometryFromData = coordinates;
                        var stationName = Substation;

                        var midPoints = [];

                        for (var j = 0; j < coordinates.length; j++) {
                            var lon = coordinates[j].Lon;
                            var lat = coordinates[j].Lat;

                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);
                            positions.push(x_m, 0, 0 - z_m);
                            if (j > 0) {
                                var lonLast = coordinates[j - 1].Lon;
                                var latLast = coordinates[j - 1].Lat;;
                                var x_mLast = MercatorGetXbyLongitude(lonLast);
                                var z_mLast = MercatorGetYbyLatitude(latLast);

                                midPoints.push();
                                midPoints.push();

                                electricLine.dataOfLineLabel.push({ x: (x_m + x_mLast) / 2, z: -(z_m + z_mLast) / 2, nameV: Name, colorR: color, indexV: 0, LineId: LineId });
                                {
                                    var lengthOfTwoPoint = Math.sqrt((x_m - x_mLast) * (x_m - x_mLast) + (z_m - z_mLast) * (z_m - z_mLast));
                                    if (lengthOfTwoPoint > 0.5) {
                                        var n = Math.ceil(lengthOfTwoPoint / 0.5);
                                        var p = function (nInput, x1, y1, x2, y2) {
                                            var points = [];
                                            for (var ii = 0; ii < nInput; ii++) {

                                                for (var jj = 0; jj < chaoliufenxiGroupCount; jj++) {
                                                    chaoliuFenxiData[jj].push((chaoliufenxiGroupCount * ii + jj) / (chaoliufenxiGroupCount * nInput) * (x2 - x1) + x1);
                                                    chaoliuFenxiData[jj].push((chaoliufenxiGroupCount * ii + jj) / (chaoliufenxiGroupCount * nInput) * (y2 - y1) + y1);
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
                        }

                        try {
                            geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                            geometry.setPositions(positions);
                        }
                        catch (e) {
                            console.log('i', i);
                            console.log('j', j);
                            throw e;
                        }
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

                        var statDate = '';

                        if (dataGet.lineExceptionInfo[LineId]) {
                            statDate = dataGet.lineExceptionInfo[LineId].statDate;
                        }
                        else if (dataItem.MergeId) {
                            if (dataGet.lineExceptionInfo[dataItem.MergeId]) {
                                statDate = dataGet.lineExceptionInfo[dataItem.MergeId].statDate;
                            }
                            else { }

                        }
                        else {
                            statDate = ''
                        }

                        //if (statDate == '') {
                        //    throw (LineId);
                        //}
                        //catch (e) {
                        //    throw (LineId);

                        //}

                        line_ForSelect.Tag = { name: Name, station: stationName, LineId: LineId, runDate: runDate, index: i, statDate: statDate, segementID: segementID };
                        //line.Tag = { name: data[i].name, voltage: data[i].voltage }

                        //var sqlOfLine = "INSERT INTO line (id,sub_id,`name`,p_id,sub_Name)VALUES(" + i + ",1,'" + nameV + "',1,'" + stationName + "');";
                        //sumSql += sqlOfLine;
                        console.log('vv', Name, stationName);

                        var line = new THREE.Line2(geometry, material);
                        line.computeLineDistances();
                        line.Tag = { name: Name, voltage: Voltage, indexV: Code, colorR: color, LineId: LineId, runDate: runDate, index: i };
                        line.renderOrder = 99;
                        line.scale.set(1, 1, 1);
                        //line.rotateX(-Math.PI / 2);
                        operateGroup.add(line_ForSelect);
                        operateGroup.add(line);
                    }
                }

                electricLine.updateLabelOfLine();
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawLineForWangjia = function (areaCode) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);

                var operateGroup = wangjia.group;
                var obj = JSON.parse(dataGotton);
                dataGet.lineData = obj;
                if (operateGroup.children.length == 0) {
                    for (var i = 0; i < obj.length; i++) {
                        var dataItem = obj[i];
                        var segementID = dataItem.Code;
                        var Code = dataItem.SubstationCode;
                        var LineId = dataItem.LineId;
                        var Name = dataItem.Name;
                        var AreaCode = dataItem.AreaCode;
                        var Substation = dataItem.Substation;
                        var Voltage = dataItem.Voltage;
                        var color = dataItem.Color;
                        var coordinates = dataItem.coordinates;
                        var runDate = dataItem.RunDate;
                        var LineLength = dataItem.LineLength;
                        var positions = [];
                        var geometryLine = new THREE.BufferGeometry();
                        var geometry = new THREE.LineGeometry();

                        var geometryFromData = coordinates;
                        var stationName = Substation;

                        var midPoints = [];

                        for (var j = 0; j < coordinates.length; j++) {
                            var lon = coordinates[j].Lon;
                            var lat = coordinates[j].Lat;

                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);
                            positions.push(x_m, 0, 0 - z_m);
                            if (j > 0) {
                                var lonLast = coordinates[j - 1].Lon;
                                var latLast = coordinates[j - 1].Lat;;
                                var x_mLast = MercatorGetXbyLongitude(lonLast);
                                var z_mLast = MercatorGetYbyLatitude(latLast);

                                midPoints.push();
                                midPoints.push();

                                wangjia.dataOfLineLabel.push({ x: (x_m + x_mLast) / 2, z: -(z_m + z_mLast) / 2, nameV: Name, colorR: color, indexV: 0, LineId: LineId });

                            }
                        }

                        geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                        geometry.setPositions(positions);

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

                        var statDate = '';

                        if (dataGet.lineExceptionInfo[LineId]) {
                            statDate = dataGet.lineExceptionInfo[LineId].statDate;
                        }
                        else if (dataItem.MergeId) {
                            if (dataGet.lineExceptionInfo[dataItem.MergeId]) {
                                statDate = dataGet.lineExceptionInfo[dataItem.MergeId].statDate;
                            }
                            else { }

                        }
                        else {
                            statDate = ''
                        }

                        //if (statDate == '') {
                        //    throw (LineId);
                        //}
                        //catch (e) {
                        //    throw (LineId);

                        //}

                        line_ForSelect.Tag = { name: Name, station: stationName, LineId: LineId, runDate: runDate, index: i, statDate: statDate, segementID: segementID, LineLength: LineLength, Voltage: Voltage };
                        //line.Tag = { name: data[i].name, voltage: data[i].voltage }

                        //var sqlOfLine = "INSERT INTO line (id,sub_id,`name`,p_id,sub_Name)VALUES(" + i + ",1,'" + nameV + "',1,'" + stationName + "');";
                        //sumSql += sqlOfLine;
                        console.log('vv', Name, stationName);

                        var line = new THREE.Line2(geometry, material);
                        line.computeLineDistances();
                        line.Tag = { name: Name, voltage: Voltage, indexV: Code, colorR: color, LineId: LineId, runDate: runDate, index: i };
                        line.renderOrder = 99;
                        line.scale.set(1, 1, 1);
                        //line.rotateX(-Math.PI / 2);
                        operateGroup.add(line_ForSelect);
                        operateGroup.add(line);
                    }
                }

                electricLine.updateLabelOfLine();
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawLine_forShow = function (areaCode) {

        $.ajax({
            type: "GET",
            url: 'Javascript/electricData.json',
            crossDomain: true,
            //data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);

                var operateGroup = electricLine.group;
                var obj = dataGotton;
                dataGet.lineData = obj;
                if (operateGroup.children.length == 0) {
                    for (var i = 0; i < obj.length; i++) {
                        var dataItem = obj[i];
                        var segementID = dataItem.Code;
                        var Code = dataItem.SubstationCode;
                        var LineId = dataItem.LineId;
                        var Name = dataItem.Name;
                        var AreaCode = dataItem.AreaCode;
                        var Substation = dataItem.Substation;
                        var Voltage = dataItem.Voltage;
                        var color = dataItem.Color;
                        var coordinates = dataItem.coordinates;
                        var runDate = dataItem.RunDate;
                        var positions = [];
                        var geometryLine = new THREE.BufferGeometry();
                        var geometry = new THREE.LineGeometry();

                        var geometryFromData = coordinates;
                        var stationName = Substation;

                        var midPoints = [];

                        for (var j = 0; j < coordinates.length; j++) {
                            var lon = coordinates[j].Lon;
                            var lat = coordinates[j].Lat;

                            var x_m = MercatorGetXbyLongitude(lon);
                            var z_m = MercatorGetYbyLatitude(lat);
                            positions.push(x_m, 0, 0 - z_m);
                            if (j > 0) {
                                var lonLast = coordinates[j - 1].Lon;
                                var latLast = coordinates[j - 1].Lat;;
                                var x_mLast = MercatorGetXbyLongitude(lonLast);
                                var z_mLast = MercatorGetYbyLatitude(latLast);

                                midPoints.push();
                                midPoints.push();

                                electricLine.dataOfLineLabel.push({ x: (x_m + x_mLast) / 2, z: -(z_m + z_mLast) / 2, nameV: Name, colorR: color, indexV: 0, LineId: LineId })
                            }
                        }

                        geometryLine.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                        geometry.setPositions(positions);

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

                        //var statDate = '';

                        //if (dataGet.lineExceptionInfo[LineId]) {
                        //    statDate = dataGet.lineExceptionInfo[LineId].statDate;
                        //}
                        //else if (dataItem.MergeId) {
                        //    if (dataGet.lineExceptionInfo[dataItem.MergeId]) {
                        //        statDate = dataGet.lineExceptionInfo[dataItem.MergeId].statDate;
                        //    }
                        //    else { }

                        //}
                        //else {
                        //    statDate = ''
                        //}

                        //if (statDate == '') {
                        //    throw (LineId);
                        //}
                        //catch (e) {
                        //    throw (LineId);

                        //}

                        line_ForSelect.Tag = { name: Name, station: stationName, LineId: LineId, runDate: runDate, index: i, statDate: '', segementID: segementID };
                        //line.Tag = { name: data[i].name, voltage: data[i].voltage }

                        //var sqlOfLine = "INSERT INTO line (id,sub_id,`name`,p_id,sub_Name)VALUES(" + i + ",1,'" + nameV + "',1,'" + stationName + "');";
                        //sumSql += sqlOfLine;
                        console.log('vv', Name, stationName);

                        var line = new THREE.Line2(geometry, material);
                        line.computeLineDistances();
                        line.Tag = { name: Name, voltage: Voltage, indexV: Code, colorR: color, LineId: LineId, runDate: runDate, index: i };
                        line.renderOrder = 99;
                        line.scale.set(1, 1, 1);
                        //line.rotateX(-Math.PI / 2);
                        operateGroup.add(line_ForSelect);
                        operateGroup.add(line);
                    }
                }

                electricLine.updateLabelOfLine();
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawLineDxf = function (areaCode) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {

            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawSubstation = function (areaCode) {
        $.ajax({
            type: "POST",
            url: '~/data.apisubstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);


                //   var obj = [{ "Code": 1, "Name": "城北变", "AreaCode": 1, "Longitude": "112.5724102332714100", "Latitude": "37.9029532084403160", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 2, "Name": "解放变", "AreaCode": 1, "Longitude": "112.5727407036562500", "Latitude": "37.8969425658084500", "Voltage": "220kv", "Icon": null, "Color": 898989 }, { "Code": 3, "Name": "柳溪变", "AreaCode": 1, "Longitude": "112.5612232993725900", "Latitude": "37.8924736204253350", "Voltage": "110kv", "Icon": null, "Color": 232323 }, { "Code": 4, "Name": "城西站", "AreaCode": 1, "Longitude": "112.5473833274789100", "Latitude": "37.8740834101297600", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 5, "Name": "铜锣湾变", "AreaCode": 1, "Longitude": "112.5756621053763100", "Latitude": "37.8755250335408200", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 6, "Name": "杏花岭站", "AreaCode": 1, "Longitude": "112.5853212454922500", "Latitude": "37.8773871583045860", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 7, "Name": "东大站", "AreaCode": 1, "Longitude": "112.5759622507683100", "Latitude": "37.8899505903281000", "Voltage": "110kv", "Icon": null, "Color": 1 }]
                var obj = JSON.parse(dataGotton);
                var operateGroup = biandiansuo.group;

                {
                    operateGroup.visible = true;
                    if (operateGroup.children.length == 0) {

                        //var sumSql = '';
                        //var cadLeftTop = { x: 17545.309, y: 65811.8395 };
                        //var cadRightBottom = { x: 20904.8089, y: 62787.9504 };

                        //var baiduMapLeftTop = { x: 112.553929, y: 37.894187 };
                        //var baiduMapRightBottom = { x: 112.592161, y: 37.866492 };

                        var data = obj;
                        for (var i = 0; i < data.length; i++) {

                            var divC = document.createElement('div');
                            var imgC = document.createElement('img');
                            imgC.src = 'Pic/biandianzhan110kv.png';
                            divC.appendChild(imgC);
                            divC.className = 'biandianzhanTuPian';

                            var colorOfCircle = data[i].Color;

                            //colorOfCircle = getColorByStation(data[i].name);
                            switch (data[i].Voltage) {
                                case '110kv':
                                    {
                                        var lon = data[i].Longitude;
                                        var lat = data[i].Latitude;
                                        var x_m = MercatorGetXbyLongitude(lon);
                                        var z_m = MercatorGetYbyLatitude(lat);

                                        var radius = showAConfig.biandianzhan.l110kv.radius;
                                        var color = colorOfCircle;
                                        var geometry = new THREE.RingGeometry(radius, radius * 0.75, 18);

                                        var material = i == 0 ? new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }) : new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
                                        material.depthTest = false;
                                        var plane = new THREE.Mesh(geometry, material);
                                        // plane.name = data[i].name;

                                        // sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

                                        var position = { x: x_m, y: 0, z: -z_m };
                                        plane.Tag = { name: data[i].Name, position: position }
                                        //measureAreaObj.measureAreaDiv.className = 'label';
                                        //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                                        //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                                        //var label = new THREE.CSS2DObject(divC);
                                        plane.renderOrder = 98;

                                        plane.position.set(x_m, 0, -z_m);
                                        plane.rotateX(Math.PI / 2);
                                        operateGroup.add(plane);



                                        var labelDiv = document.createElement('div');
                                        labelDiv.className = 'labelbiandianzhan';
                                        labelDiv.textContent = data[i].Name;
                                        labelDiv.style.marginTop = '-1em';
                                        labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                                        //labelDiv.style.color = color;
                                        var divLabel = new THREE.CSS2DObject(labelDiv);
                                        divLabel.position.set(x_m, 0, -z_m);
                                        divLabel.positionTag = [x_m, 0, -z_m];
                                        operateGroup.add(divLabel);

                                    }; break;
                                case '220kv':
                                    {

                                        var lon = data[i].Longitude;
                                        var lat = data[i].Latitude;
                                        var x_m = MercatorGetXbyLongitude(lon);
                                        var z_m = MercatorGetYbyLatitude(lat);

                                        var geometry1 = new THREE.RingGeometry(radius, radius * 0.75, 18);
                                        var material = new THREE.MeshBasicMaterial({ color: colorOfCircle, side: THREE.DoubleSide });
                                        material.depthTest = false;
                                        var plane1 = new THREE.Mesh(geometry1, material);
                                        plane1.name = data[i].Name;

                                        //  sumSql += "update substation set lon=" + lon + ",lat=" + lat + " where sub_name='" + data[i].name + "';";

                                        var position = { x: x_m, y: 0, z: -z_m };
                                        plane1.Tag = { name: data[i].Name, position: position };
                                        //measureAreaObj.measureAreaDiv.className = 'label';
                                        //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                                        //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                                        //var label = new THREE.CSS2DObject(divC);
                                        plane1.renderOrder = 98;

                                        plane1.position.set(x_m, 0, -z_m);
                                        plane1.rotateX(Math.PI / 2);
                                        operateGroup.add(plane1);



                                        var geometry2 = new THREE.RingGeometry(radius * 0.5, radius * 0.25, 18);
                                        var plane2 = new THREE.Mesh(geometry2, material);
                                        //  plane2.name = data[i].name;

                                        //var position = { x: x_m, y: 0, z: -z_m };
                                        plane2.Tag = { name: data[i].Name, position: position }
                                        //measureAreaObj.measureAreaDiv.className = 'label';
                                        //measureAreaObj.measureAreaDiv.textContent = 'Earth';
                                        //measureAreaObj.measureAreaDiv.style.marginTop = '-1em';
                                        //var label = new THREE.CSS2DObject(divC);
                                        plane2.renderOrder = 98;

                                        plane2.position.set(x_m, 0, -z_m);
                                        plane2.rotateX(Math.PI / 2);
                                        operateGroup.add(plane2);

                                        var labelDiv = document.createElement('div');
                                        labelDiv.className = 'labelbiandianzhan';
                                        labelDiv.textContent = data[i].Name;
                                        labelDiv.style.marginTop = '-1em';

                                        labelDiv.style.color = Number.isInteger(colorOfCircle) ? get16(colorOfCircle) : colorOfCircle;
                                        var divLabel = new THREE.CSS2DObject(labelDiv);
                                        divLabel.position.set(x_m, 0, -z_m);
                                        divLabel.positionTag = [x_m, 0, -z_m];
                                        operateGroup.add(divLabel);
                                    }; break;
                            }
                        }
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



                //electricLine.updateLabelOfLine();
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawSubstationStl = function (areaCode, f) {
        $.ajax({
            type: "POST",
            url: '~/data.apisubstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);


                //   var obj = [{ "Code": 1, "Name": "城北变", "AreaCode": 1, "Longitude": "112.5724102332714100", "Latitude": "37.9029532084403160", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 2, "Name": "解放变", "AreaCode": 1, "Longitude": "112.5727407036562500", "Latitude": "37.8969425658084500", "Voltage": "220kv", "Icon": null, "Color": 898989 }, { "Code": 3, "Name": "柳溪变", "AreaCode": 1, "Longitude": "112.5612232993725900", "Latitude": "37.8924736204253350", "Voltage": "110kv", "Icon": null, "Color": 232323 }, { "Code": 4, "Name": "城西站", "AreaCode": 1, "Longitude": "112.5473833274789100", "Latitude": "37.8740834101297600", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 5, "Name": "铜锣湾变", "AreaCode": 1, "Longitude": "112.5756621053763100", "Latitude": "37.8755250335408200", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 6, "Name": "杏花岭站", "AreaCode": 1, "Longitude": "112.5853212454922500", "Latitude": "37.8773871583045860", "Voltage": "110kv", "Icon": null, "Color": 1 }, { "Code": 7, "Name": "东大站", "AreaCode": 1, "Longitude": "112.5759622507683100", "Latitude": "37.8899505903281000", "Voltage": "110kv", "Icon": null, "Color": 1 }]
                var obj = JSON.parse(dataGotton);
                var operateGroup = biandiansuo.groupStl;

                {
                    operateGroup.visible = true;
                    if (operateGroup.children.length == 0) {

                        var data = obj;
                        f(data);
                    }
                    else {

                    }
                }



                //electricLine.updateLabelOfLine();
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }

    this.drawTongxin5G_2 = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.apivgstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {
                //console.log('read162', dataGotton);
                dataGet.vgstation = JSON.parse(dataGotton);
                var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                var data = dataGet.vgstation;
                for (var i = 0; i < data.length; i++) { //data.length

                    var lon = data[i].Longitude;
                    var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;
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

                    //tongxin5GMapGroup.add(child1);
                    //tongxin5GMapGroup.add(child2);

                    // t3.position.set(x_m, 1 * s, -z_m);
                    child1.position.set(x_m, s * 4, -z_m);
                    child2.position.set(x_m, 1.5 * s, -z_m);
                    child1.scale.set(s, s, s);
                    child2.scale.set(s, s, s);
                    data[i].name = data[i].detail;

                    child1.Tag = { part: '1', detail: data[i].detail, select: false, id: data[i].Code };
                    child2.Tag = { part: '2', detail: data[i].detail, select: false, id: data[i].Code };
                    data[i].name = data[i].detail;
                    tongxin5GMapGroup.add(child1);
                    tongxin5GMapGroup.add(child2);

                    //var sqlItem = 'INSERT INTO space_based (s_name,lon,lat,details,p_id)VALUES(\'' + data[i].detail.trim() + '\',' + lon + ',' + lat + ',\'' + data[i].detail.trim() + '\',1);';
                    //sumSql += sqlItem;
                }
                //console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.drawInfomationStream = function (showF) {
        $.ajax({
            type: "POST",
            url: 'data.apivgstation',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': 1 },
            success: function (dataGotton) {
                //console.log('read162', dataGotton);
                showF(JSON.parse(dataGotton));

                //var l = Math.sqrt((camera.position.x - controls.target.x) * (camera.position.x - controls.target.x) +
                //    (camera.position.y - controls.target.y) * (camera.position.y - controls.target.y) +
                //    (camera.position.z - controls.target.z) * (camera.position.z - controls.target.z));

                //var data = dataGet.vgstation;
                //for (var i = 0; i < data.length; i++) { //data.length

                //    var lon = data[i].Longitude;
                //    var lat = data[i].Latitude;//+ deltaLat + 0.0001 + Math.sin(i) * 0.001;

                //    var x_m = MercatorGetXbyLongitude(lon);
                //    var z_m = MercatorGetYbyLatitude(lat);


                //    var element = document.createElement('div');
                //    element.className = 'point-5G';

                //    var img = document.createElement('img');
                //    img.src = "Pic/jizhan5G_02.png";

                //    //img.style.width=''

                //    var element2 = document.createElement('div');

                //    var elementb = document.createElement('b');
                //    //elementb.innerText = data[i].name;

                //    //element2.appendChild(elementb);

                //    element.appendChild(img);
                //    //element.appendChild(element2);
                //    element.Tag = data[i];
                //    //element.onclick = function () { alert('A'); }

                //    var object = new THREE.CSS2DObject(element);


                //    object.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state };
                //    object.position.set(x_m, 0, -z_m);
                //    tongxin5GMapGroup.add(object);
                //    continue;
                //    /*--分割线--*/

                //}
                //console.log('sumSql', sumSql);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.getInterstPoint = function (areaCode) {
        $.ajax({
            type: "POST",
            url: 'data.interestpoint', //\.interestpoint 
            crossDomain: true,
            data: { 'Type': 'read' },
            success: function (dataGotton) {
                //console.log('read162', dataGotton);
                dataGet.interestpoint = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.getExceptionArea = function () {
        throw '此方法已启用';
        //$.ajax({
        //    type: "POST",
        //    url: 'data.exceptionarea ', //\.interestpoint 
        //    crossDomain: true,
        //    data: { 'Date': '2020-04-18' },
        //    success: function (dataGotton) {
        //        //console.log('read162', dataGotton);
        //        dataGet.exceptionArea = {};
        //        var objGotton = JSON.parse(dataGotton);
        //        for (var i = 0; i < objGotton.length; i++) {
        //            if (objGotton[i].TG_ID) {
        //                dataGet.exceptionArea[objGotton[i].TG_ID] = true;
        //            }
        //        } 
        //    },
        //    error: function (err) {
        //        console.log('data.apitransformer', err);
        //    }
        //});
    }

    this.getExceptionLine = function () {
        $.ajax({
            type: "POST",
            url: 'data.exceptionline', //\.interestpoint 
            crossDomain: true,
            data: { 'Date': '2020-04-18' },
            success: function (dataGotton) {
                dataGet.exceptionLine = {};
                var objGotton = JSON.parse(dataGotton);
                for (var i = 0; i < objGotton.length; i++) {
                    if (objGotton[i].LINE_ID) {
                        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    }
                    if (objGotton[i].MERGE_LINE_ID) {
                        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    }
                }
                //console.log('read162', dataGotton);
                //  dataGet.exceptionLine = JSON.parse(dataGotton);
                //  dataGet.interestpoint = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    this.getControlPoint = function () {
        $.ajax({
            type: "POST",
            url: 'data.controlpoint', //\.interestpoint 
            crossDomain: true,
            data: { 'Type': 'read' },
            success: function (dataGotton) {
                // dataGet.exceptionLine = {};
                var objGotton = JSON.parse(dataGotton);
                dataGet.controlpoint = objGotton;

                for (var i = 0; i < objGotton.length; i++) {
                    new DataGet().getControlPointDataOfPoint(null, objGotton[i].Code);
                }
                //console.log('controlpoint', objGotton);
                //for (var i = 0; i < objGotton.length; i++) {
                //    if (objGotton[i].LINE_ID) {
                //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                //    }
                //    if (objGotton[i].MERGE_LINE_ID) {
                //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                //    }
                //}
                //console.log('read162', dataGotton);
                //  dataGet.exceptionLine = JSON.parse(dataGotton);
                //  dataGet.interestpoint = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    }

    this.setTypeIDOfRegionID = function (regionID, atid) {
        switch (atid) {
            case '9': { }; break;
            case '10': { }; break;
            case '11': { }; break;
            case '12': { }; break;
            case '13': { }; break;
            case '14': { }; break;
            case '15': { }; break;
            default:
                {
                    alert(atid + '还没有指定类型');
                    return;
                };
        }
        $.ajax({
            type: "POST",
            url: 'data.sliceAreaupdate', //\.interestpoint 
            crossDomain: true,
            data: { 'Id': regionID, 'AtId': atid },
            success: function (dataGotton) {
                alert('更新成功！');
                var startLength = regionBlockGroup.children.length;
                for (var i = startLength - 1; i >= 0; i--) {
                    regionBlockGroup.remove(regionBlockGroup.children[i]);
                }
                var dg = new DataGet();
                dg.drawRegionBlock(1);
                //console.log('read162', dataGotton);
                //  dataGet.exceptionLine = JSON.parse(dataGotton);
                //  dataGet.interestpoint = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.sliceAreaupdate', err);
            }
        });
    }

    this.getControlPointDataOfPoint = function (DateInput, CodeInput) {
        if (DateInput)
            $.ajax({
                type: "POST",
                url: 'data.ycontrolpointdataday', //\.interestpoint 
                crossDomain: true,
                data: { 'Date': DateInput, 'Code': CodeInput },
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    var objGotton = JSON.parse(dataGotton);
                    // dataGet.controlpoint = objGotton;
                    console.log('ControlPointDataday', objGotton);
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        else {
            $.ajax({
                type: "POST",
                url: 'data.ycontrolpointdataday', //\.interestpoint 
                crossDomain: true,
                data: { 'Code': CodeInput },
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    try {
                        var objGotton = JSON.parse(dataGotton);
                        // dataGet.controlpoint = objGotton;
                        console.log('ControlPointDataday', objGotton);
                        dataGet.ControlPointDataday[objGotton[0].code] = objGotton[0];
                    }
                    catch
                    {
                        throw CodeInput;
                    }
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        }
    }

    this.getPolluteenterprise = function () {
        $.ajax({
            type: "POST",
            url: 'data.polluteenterprise', //\.interestpoint 
            crossDomain: true,
            data: { 'Type': 'read' },
            success: function (dataGotton) {
                // dataGet.exceptionLine = {};
                try {
                    var objGotton = JSON.parse(dataGotton);
                    // dataGet.controlpoint = objGotton;
                    console.log('polluteenterprise', objGotton);
                    dataGet.polluteenterprise = objGotton;
                }
                catch
                {
                    throw dataGotton;
                }
                //for (var i = 0; i < objGotton.length; i++) {
                //    if (objGotton[i].LINE_ID) {
                //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                //    }
                //    if (objGotton[i].MERGE_LINE_ID) {
                //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                //    }
                //}
                //console.log('read162', dataGotton);
                //  dataGet.exceptionLine = JSON.parse(dataGotton);
                //  dataGet.interestpoint = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    }

    this.getLineExceptionInfo = function () {
        if (arguments.length == 0) {
            $.ajax({
                type: "POST",
                url: 'data.a01apilineExceptionInfo', //\.interestpoint 
                crossDomain: true,
                data: {},
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    try {
                        var objGotton = JSON.parse(dataGotton);
                        dataGet.lineExceptionInfo = {};
                        for (var i = 0; i < objGotton.length; i++) {
                            dataGet.lineExceptionInfo[objGotton[i].lineId] = objGotton[i];
                            //= objGotton;
                        }
                    }
                    catch
                    {
                        throw dataGotton;
                    }
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        }
        else if (arguments.length == 2) {
            var date = arguments[0];
            var successF = arguments[1];
            $.ajax({
                type: "POST",
                url: 'data.a01apilineExceptionInfo', //\.interestpoint 
                crossDomain: true,
                data: { 'Date': date },
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    try {
                        var objGotton = JSON.parse(dataGotton);
                        dataGet.lineExceptionInfo = {};
                        for (var i = 0; i < objGotton.length; i++) {
                            dataGet.lineExceptionInfo[objGotton[i].lineId] = objGotton[i];
                            //= objGotton;
                        }
                        successF(date);
                    }
                    catch
                    {
                        throw dataGotton;
                    }
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        }
        else {
            throw `${arguments.length}`;
        }
    }

    this.drawPeibianBelongToLine = function (index) {
        var line = dataGet.lineData[index];
        var LineId = line.LineId;
        var MergeId = line.MergeId;
        if (dataGet.apitransformer) {
            var data = dataGet.apitransformer;
            for (var i = 0; i < data.length; i++) { //data.length

                if (data[i].lineId == LineId || data[i].lineId == MergeId) {
                }
                else {
                    continue;
                }
                var lon = data[i].Longitude;
                var lat = data[i].Latitude;
                var x_m = MercatorGetXbyLongitude(lon);
                var z_m = MercatorGetYbyLatitude(lat);


                var element = document.createElement('div');
                element.className = 'pointPeibian2';

                var img = document.createElement('img');
                img.src = "Pic/bd_0.png";
                //state 表示正常 或异常 正常为0 ，异常为非0 异常包括重过载异常和台区线损异常
                //if (data[i].state == "0") {
                //    img.src = "Pic/bd_0.png";
                //    data[i].state = "0";
                //}
                //else {
                //    img.src = "Pic/bd_2.png";
                //}
                //if (dataGet.exceptionArea[data[i].tgId]) {
                //    img.src = "Pic/bd_1.png";
                //    data[i].state = "1";
                //}

                //img.style.width=''

                var element2 = document.createElement('div');

                var elementb = document.createElement('b');
                //elementb.innerText = data[i].name;

                //element2.appendChild(elementb);

                element.appendChild(img);
                //element.appendChild(element2);
                element.Tag = data[i];
                //element.onclick = function () { alert('A'); }

                var object = new THREE.CSS2DObject(element);


                object.Tag = { part: '2', detail: data[i].Details, select: false, id: data[i].Code, state: 0, tgId: data[i].tgId, statDate: data[i].statDate };


                element.Tag = { detail: data[i].Details, select: false, id: data[i].Code, state: data[i].state, tgId: data[i].tgId, statDate: data[i].statDate, index: i };
                element.addEventListener('click', function () {
                    if (mouseClickElementInterviewState.click()) {
                        mouseClickElementInterviewState.init();
                    }
                    else {
                        return;
                    }
                    var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "peibian", Tag: this.Tag })
                    top.postMessage(sendMsg, '*');
                    console.log('iframe外发送信息', sendMsg);
                    this.Tag.select = true;
                });


                object.position.set(x_m, 0, -z_m);
                electricLine.peibianGroup2.add(object);

            }
        }

        return;
        $.ajax({
            type: "POST",
            url: 'data.apitransformer',
            crossDomain: true,
            data: { 'Type': 'read', 'AreaCode': areaCode },
            success: function (dataGotton) {

                dataGet.apitransformer = JSON.parse(dataGotton);

            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    }

    //(new DataGet()).getPlotPosData()
    this.getPlotPosData = function () {
        $.ajax({
            type: "POST",
            url: 'data.a02apiPlotPos',
            crossDomain: true,
            data: { 'Date': Date.now() },
            success: function (dataGotton) {

                console.log('想要的数据', dataGotton);
                dataGet.courtData = JSON.parse(dataGotton);
                //dataGet.apitransformer = JSON.parse(dataGotton);
                //afterF(date);
            },
            error: function (err) {
                console.log('data.apitransformer', err);
            }
        });
    };

    this.getMicroStation = function () {
        $.ajax({
            type: "POST",
            url: 'data.a03apiMicroStation',
            crossDomain: true,
            data: { 'AreaCode': 0 },
            success: function (dataGotton) {

                console.log('想要的数据', dataGotton);
                dataGet.micoroStation = JSON.parse(dataGotton);
                //dataGet.apitransformer = JSON.parse(dataGotton);
                //afterF(date);
                for (var i = 0; i < dataGet.micoroStation.length; i++) {
                    new DataGet().getMicoroStationPointDataday(null, dataGet.micoroStation[i].Code);
                }

            },
            error: function (err) {
                console.log('data.a03apiMicroStation', err);
            }
        });
    }

    this.getMicoroStationPointDataday = function (DateInput, CodeInput) {
        if (DateInput)
            $.ajax({
                type: "POST",
                url: 'data.a04apiMicroStationDataDay', //\.微站每天数据 
                crossDomain: true,
                data: { 'Date': DateInput, 'Code': CodeInput },
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    var objGotton = JSON.parse(dataGotton);
                    // dataGet.controlpoint = objGotton;
                    console.log('getMicoroStationPointDataday', objGotton);
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        else {
            $.ajax({
                type: "POST",
                url: 'data.a04apiMicroStationDataDay', //\.微站每天数据 
                crossDomain: true,
                data: { 'Code': CodeInput },
                success: function (dataGotton) {
                    // dataGet.exceptionLine = {};
                    try {
                        var objGotton = JSON.parse(dataGotton);
                        // dataGet.controlpoint = objGotton;
                        console.log('MicroStationDataDay', objGotton);
                        dataGet.micoroStationPointDataday[objGotton[0].code] = objGotton[0];
                    }
                    catch
                    {
                        throw CodeInput;
                    }
                    //for (var i = 0; i < objGotton.length; i++) {
                    //    if (objGotton[i].LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //    if (objGotton[i].MERGE_LINE_ID) {
                    //        dataGet.exceptionLine[objGotton[i].MERGE_LINE_ID] = objGotton[i].RATE_LOSS;
                    //    }
                    //}
                    //console.log('read162', dataGotton);
                    //  dataGet.exceptionLine = JSON.parse(dataGotton);
                    //  dataGet.interestpoint = JSON.parse(dataGotton);
                },
                error: function (err) {
                    console.log('data.controlpoint', err);
                }
            });
        }
    };

    this.AddWalkerData = function (name, jsonValue, f) {
        $.ajax({
            type: "POST",
            url: 'data.a05apiRoma', //\.微站每天数据 
            crossDomain: true,
            data: { 'Type': 'add', 'Name': name, 'Content': jsonValue },
            success: function (dataGotton) {
                try {
                    (new DataGet()).getAllWalkerData();
                }
                catch (e) {
                    throw e;
                }
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    };
    this.getAllWalkerData = function () {
        $.ajax({
            type: "POST",
            url: 'data.a05apiRoma', //\.微站每天数据 
            crossDomain: true,
            data: { 'Type': 'read' },
            success: function (dataGotton) {
                dataGet.walkerData = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    };

    this.getBlackOutDataOfLine = function () {
        $.ajax({
            type: "POST",
            url: 'data.a06apiBlackOut', //\.线路停电数据 
            crossDomain: true,
            data: {},
            success: function (dataGotton) {
                console.log('BlackOut', dataGotton);
                //dataGet.walkerData = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    };

    this.getBlackOutDataOfTq = function () {
        $.ajax({
            type: "POST",
            url: 'data.a07apiBlackOut', //\.台区停电数据 
            crossDomain: true,
            data: {},
            success: function (dataGotton) {
                //console.log('BlackOut', dataGotton);
                dataGet.blackOfTq = [];
                var objGotton = JSON.parse(dataGotton);
                for (var i = 0; i < objGotton.result.length; i++) {
                    dataGet.blackOfTq.push(objGotton.result[i].tgId);
                }
                //dataGet.walkerData = JSON.parse(dataGotton);
            },
            error: function (err) {
                console.log('data.controlpoint', err);
            }
        });
    };

    this.addLine = function (Name, coordinates) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'add', 'Name': Name, 'coordinates': coordinates },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);

            },
            error: function (err) {
                console.log('~/data.apiline  addLine', err);
            }
        });
    };

    this.removeLineSeg = function (id) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'delete', 'Code': id },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);

            },
            error: function (err) {
                console.log('~/data.apiline  addLine', err);
            }
        });
    };

    this.getDataOfYingjiweiwen = function () {
        $.ajax({
            type: "GET", //请求方式为get
            dataType: "json", //返回数据格式为json
            url: 'Javascript/yingjiweiwenziyuan.json?xx=30',
            crossDomain: true,
            success: function (dataGotton) {
                //console.log('dataGotton', dataGotton);
                dataGet.yingjiweiwenData = dataGotton;

            },
            error: function (err) {
                console.log('~/data.apiline  addLine', err);
            }
        });
    };

    this.delLineSegment = function (sigmentID) {

        $.ajax({
            type: "POST",
            url: '~/data.apiline',
            crossDomain: true,
            data: { 'Type': 'delete', 'Code': sigmentID },
            success: function (dataGotton) {
                console.log('dataGotton', dataGotton);
            },
            error: function (err) {
                console.log('~/data.apiline', err);
            }
        });
    }
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


var getSql = function () {
    var data = hospitalInfo.Document.Folder.Placemark;
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
            img.src = "Pic/cgq.png";
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



        //if (objType == "factory") {
        //    //var xx = new THREE.Object3D();
        //    //xx.position.set(x_m, 0, -z_m);
        //    //xx.Tag = {};
        //    element.addEventListener('click', function () {
        //        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "factory", Tag: this.Tag })
        //        top.postMessage(sendMsg, '*');
        //        console.log('iframe外发送信息', sendMsg);
        //    });
        //}
        //else if (objType == "environment") {
        //    //var xx = new THREE.Object3D();
        //    //xx.position.set(x_m, 0, -z_m);
        //    //xx.Tag = {};
        //    element.addEventListener('click', function () {
        //        var sendMsg = JSON.stringify({ command: 'showInformation', selectType: "environment", Tag: this.Tag })
        //        top.postMessage(sendMsg, '*');
        //        console.log('iframe外发送信息', sendMsg);
        //    });
        //}

        object.position.set(x_m, 0, -z_m);
        opreateGroup.add(object);

    }
}



