
function search() {
    function peibian() {
        //按名字进行搜索 ，搜索的时候为*input*格式，当input为空字符串时，name为null
        this.name = null;
        this.startDate = new Date("01 1,2000");
        this.endDate = new Date("01 1 2100");
        //如重过载{ name: '重过载', state: 2 }


        /***
         * abnormalType （0：正常，1：负损，2：高损，3：不可算）
         * abnormalSup 供电异常类型（0：正常，1：突减，2：突增）
         * abnormalSal 售电异常类型（0：正常，1：突减，2：突增）
         * overload 重过载（0：正常，1：重载，2：过载）
         * electricVol 电压（0：正常，1：失压，2：三相不平衡）
         * electricCur 电流（0：正常，1：失流，2：三相不平衡）
         * powerFactor 功率因数（0：正常，1：异常）
         * zxAbnormal 正向电量异常（0：正常，1：突减，2：突增）
         * fxAbnormal 反向电量异常（0：正常，1：突减，2：突增）
         * haveValue 有无表底（0：无，1：有）
         ***/
        this.State = { name: 'xxxxxxxxx', state: '-1' };

        this.CheckException = function (name, state) {
            //正常
            switch (name) {
                case "abnormalType":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            case "3": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "abnormalSup":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "abnormalSal":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "overload":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "electricVol":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "electricCur":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "powerFactor":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "zxAbnormal":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "fxAbnormal":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "haveValue":
                    {
                        switch (state) {
                            /*
                             * 表示有没有数据
                             */
                            case "0": { return true; }; break;
                            case "1": { return false; }; break;
                            default: { return false; }
                        }
                    }; break;

                default:
                    {
                        return false;
                    }; break;
            };

        }
        this.searType = '';

        this.initial = function () {
            this.State.name = 'xxxxxxxxx';
            this.State.state = '-1';
            this.name = null;

        }
    }
    this.peibianObj = new peibian();

    function electricLine() {
        this.name = null;
        this.lineShowIndex = null;
        this.State = { name: 'xxxxxxxxx', state: '-1' };

        this.CheckException = function (name, state) {
            //正常
            switch (name) {
                case "abnormalType":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            case "3": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "abnormalSup":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                case "abnormalSal":
                    {
                        switch (state) {
                            case "0": { return false; }; break;
                            case "1": { return true; }; break;
                            case "2": { return true; }; break;
                            default: { return false; }
                        }
                    }; break;
                default:
                    {
                        return false;
                    }; break;
            };

        }

        this.initial = function () {
            this.State.name = 'xxxxxxxxx';
            this.State.state = '-1';
            this.name = null;

        }
    };

    this.eLObj = new electricLine();
}
var searchCondition = new search();

var updateTransformer = function () {

    if (peibianGroup) {
        var opreateGroup = peibianGroup;
        for (var i = opreateGroup.children.length - 1; i >= 0; i--) {
            console.log(i, opreateGroup.children[i]);
            var index = opreateGroup.children[i].element.Tag.index;

            /*
             * Tag.error，是非正常显示
             */

            opreateGroup.children[i].element.children[0].src = 'Pic/bd_0.png';
            opreateGroup.children[i].element.Tag.error = false;

            if (peibianStateObj.showType == 'abnormalType') {
                if (dataGet.apitransformer[index].abnormalType != 0) {
                    opreateGroup.children[index].element.children[0].src = 'Pic/bd_1.png';
                    opreateGroup.children[index].element.Tag.error = true;
                }
            }
            else if (peibianStateObj.showType == 'overload') {
                if (dataGet.apitransformer[index].overload != 0) {
                    opreateGroup.children[index].element.children[0].src = 'Pic/bd_2.png';
                    opreateGroup.children[index].element.Tag.error = true;
                }
            }
            else if (peibianStateObj.showType == 'black')
            {
                if (dataGet.blackOfTq.indexOf(peibianGroup.children[i].Tag.tgId) >= 0)
                {
                    opreateGroup.children[index].element.children[0].src = 'Pic/bd_2.png';
                    opreateGroup.children[index].element.Tag.error = true;
                }
                //if (dataGet.apitransformer[index].overload != 0) {
                //    opreateGroup.children[index].element.children[0].src = 'Pic/bd_2.png';
                //    opreateGroup.children[index].element.Tag.error = true;
                //}
            }
            //peibianStateObj.showType


        }
    }
}

var updatePeibianGroup2xxx = function (length) {
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

                        var index = operateGroups[i].children[j].element.Tag.index;
                        //statDate: "2020-04-19"
                        //runDate: "2017-11-24"  
                        var date = Date.parse(dataGet.apitransformer[index].runDate);
                        if (date < electricLine.recordT) {
                            if (j < operateGroups[i].children.length) {
                                var positionOfObj = operateGroups[i].children[j].position;
                                if (operateGroups[i].children[j].element.Tag.error) {
                                    operateGroups[i].children[j].element.classList.remove('displayNone');
                                    positions.push(positionOfObj);
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

var updatePeibianGroup_byName = function (length) {
    var operateGroups = [peibianGroup];

    if (length <= 12) {
        for (var i = 0; i < operateGroups.length; i++) {
            if (operateGroups[i].visible) {
                for (var j = 0; j < operateGroups[i].children.length; j++) {
                    var index = operateGroups[i].children[j].element.Tag.index;
                    //statDate: "2020-04-19"
                    //runDate: "2017-11-24"  
                    if (searchCondition.peibianObj.name != null && searchCondition.peibianObj.name != '') {
                        if (dataGet.apitransformer[index].name.indexOf(searchCondition.peibianObj.name) > 0) {
                            operateGroups[i].children[j].element.classList.add('findByName');
                        }
                        else {
                            operateGroups[i].children[j].element.classList.remove('findByName');
                        }
                    }
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

                        var index = operateGroups[i].children[j].element.Tag.index;
                        //statDate: "2020-04-19"
                        //runDate: "2017-11-24"  
                        var index = operateGroups[i].children[j].element.Tag.index;
                        //statDate: "2020-04-19"
                        //runDate: "2017-11-24"  
                        if (searchCondition.peibianObj.name != null && searchCondition.peibianObj.name != '') {
                            if (dataGet.apitransformer[index].name.indexOf(searchCondition.peibianObj.name) > 0) {
                                operateGroups[i].children[j].element.classList.add('findByName');
                                operateGroups[i].children[j].element.classList.remove('displayNone');
                                positions.push(positionOfObj);

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
                                operateGroups[i].children[j].element.classList.remove('findByName');
                                operateGroups[i].children[j].element.classList.remove('displayNone');
                            }
                            else {
                                operateGroups[i].children[j].element.classList.add('displayNone');
                                //  operateGroups[i].children[j].element.children[0].src = "Pic/bd_0.png";
                                // operateGroups[i].children[j].element.hidden = true;
                            }
                        }

                        var date = Date.parse(dataGet.apitransformer[index].runDate);
                        if (date < electricLine.recordT) {
                            if (j < operateGroups[i].children.length) {
                                var positionOfObj = operateGroups[i].children[j].position;
                                if (operateGroups[i].children[j].element.Tag.error) {
                                    operateGroups[i].children[j].element.classList.remove('displayNone');
                                    positions.push(positionOfObj);
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
