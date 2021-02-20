var Tax =
{
    data: function () {
        return objMain.Tax;
    },
    removeData: function (fpIndexKey) {
        delete objMain.Tax[fpIndexKey];
        // delete theLagestHoderKey.data[key];
        // delete theLagestHoderKey.data[received_obj.operateKey];
        Tax.updateTaxGroup();
    },
    updateTaxModel: function (key, name) {
        if (objMain.Tax[key] == undefined) {
            return;
        }
        var fp = objMain.Tax[key].fp;
        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde))
        var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
        var cc = new Complex(end.x - start.x, end.z - start.z);
        cc.toOne();

        var positon1 = cc.multiply(new Complex(0, 1));
        var positon2 = positon1.multiply(new Complex(0, 1));
        var percentOfPosition = 0;
        {
            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            var end = new THREE.Vector3(start.x + positon2.r * percentOfPosition, 0, start.z + positon2.i * percentOfPosition);

            if (objMain.getOutGroup.getObjectByName(name) == undefined) {
                var clone = objMain.profileModel.children[0].clone();
                clone.position.set(end.x, end.y, end.z);
                clone.scale.set(0.003, 0.003, 0.003);
                clone.name = name;
                clone.userData['key'] = key;
                // mesh.userData.index = index[i];
                objMain.taxGroup.add(clone);
            }
            else {
            }
        }
    },
    updateTaxGroup: function () {
        var group = objMain.taxGroup;
        var startIndex = group.children.length - 1;
        for (var i = startIndex; i >= 0; i--) {
            //if
            var item = group.children[i];
            //fp_
            if (objMain.Tax[item.name.substring(3)] == undefined) {
                group.remove(group.children[i]);
            }
        }
        var keys = Object.keys(objMain.Tax);
        for (var i = 0; i < keys.length; i++) {
            var name = 'fp_' + keys[i];
            var key = keys[i];
            Tax.updateTaxModel(key, name);
        }
    },
    animate: function (lengthInput) {
        if (Tax.needsUpdate) {
            var group = objMain.taxGroup;
            var startIndex = group.children.length - 1;
            for (var i = startIndex; i >= 0; i--) { 
                var item = group.children[i];
                item.rotation.set(0, Date.now() % 6000 / 6000 * 2 * Math.PI, 0, 'XYZ');
                item.scale.set(lengthInput / 1000, lengthInput / 1000, lengthInput / 1000);
            }
        }
    },
    needsUpdate: false,
    trunOnAnimate: function () {
        Tax.needsUpdate = true;
    },
    trunOffAnimate: function () {
        Tax.needsUpdate = false;
        var lengthInput = 3;
        var group = objMain.taxGroup;
        var startIndex = group.children.length - 1;
        for (var i = startIndex; i >= 0; i--) {
            var item = group.children[i];
            item.scale.set(lengthInput / 1000, lengthInput / 1000, lengthInput / 1000);
        }
    },
}