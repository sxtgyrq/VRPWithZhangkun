var theLagestHoderKey =
{
    data: {},
    removeData: function (key) {
        delete theLagestHoderKey.data[key];
        // delete theLagestHoderKey.data[received_obj.operateKey];
        theLagestHoderKey.updateCollectGroup();
    },
    updateLeaveGameModel: function (key, name) {
        if (objMain.othersBasePoint[key] == undefined) {
            return;
        }
        var fp = objMain.othersBasePoint[key].basePoint;
        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
        var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
        var cc = new Complex(end.x - start.x, end.z - start.z);
        cc.toOne();

        var positon1 = cc.multiply(new Complex(0, 1));
        var positon2 = positon1.multiply(new Complex(0, 1));
        var percentOfPosition = 0.7;
        {
            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            var end = new THREE.Vector3(start.x + positon2.r * percentOfPosition, 0, start.z + positon2.i * percentOfPosition);

            if (objMain.getOutGroup.getObjectByName(name) == undefined) {
                var clone = objMain.leaveGameModel.children[0].clone();
                clone.position.set(end.x, end.y, end.z);
                clone.scale.set(0.003, 0.003, 0.003);
                clone.name = name;
                clone.userData['key'] = key;
                // mesh.userData.index = index[i];
                objMain.getOutGroup.add(clone);
            }
            else {
            }
        }
    },
    updateCollectGroup: function () {
        var group = objMain.getOutGroup;
        var startIndex = group.children.length - 1;
        for (var i = startIndex; i >= 0; i--) {
            //if
            var item = group.children[i];
            //collect_
            if (theLagestHoderKey.data[item.name.substring(8)] == undefined) {
                group.remove(group.children[i]);
            }
            else if (theLagestHoderKey.data[item.name.substring(8)].ChangeTo != objMain.indexKey) {
                group.remove(group.children[i]);
            }
        }
        var keys = Object.keys(theLagestHoderKey.data);
        for (var i = 0; i < keys.length; i++) {
            // if(keys[i]==
            if (theLagestHoderKey.data[keys[i]].ChangeTo == objMain.indexKey) {
                var name = 'collect_' + keys[i];
                var key = keys[i];
                theLagestHoderKey.updateLeaveGameModel(key, name);
            }
        }
    },
    animate: function () {
        var group = objMain.getOutGroup;
        var startIndex = group.children.length - 1;
        for (var i = startIndex; i >= 0; i--) {
            //if
            var item = group.children[i];
            item.rotation.set(0, Date.now() % 6000 / 6000 * 2 * Math.PI, 0, 'XYZ');
        }
    }
}