var objNotify =
{
    carNotifyShow: function () {
        var that = objNotify;

        var addChildren = function () {
            for (var i = 0; i < 5; i++) {

                // var parentID = '';
                var parentID = 'carsPanelFrame' + '_' + 'child' + i;
                //text += "        <div style=\"width: calc(100% - 2px);";
                //text += "        text-align: center;";
                //text += "        border: 1px solid deepskyblue;";
                //text += "        border-radius: 0.3em;";
                //text += "        margin-top: 4px;";
                //text += "        margin-bottom: 4px;\">";
                //text += "            <span id=\"carASpan\">啊啊啊啊啊啊啊</span>";
                //text += "        </div>";
                var divChildOfItem = document.createElement('div');
                divChildOfItem.classList.add('carState');
                //divChildOfItem.style.width = 'calc(100% - 2px)';
                divChildOfItem.style.height = 'calc(100% - 6px)';
                //divChildOfItem.style.textAlign = 'center';
                //divChildOfItem.style.border = '1px solid deepskyblue';
                //divChildOfItem.style.borderRadius = 'calc(50% - 1px)';
                //divChildOfItem.style.marginTop = '4px';

                //divChildOfItem.style.marginBottom = '4px';
                divChildOfItem.yrqTagIndex = i + 0;
                divChildOfItem.id = that.ids[i];
                //divChildOfItem.parentNode

                divChildOfItem.innerText = (i + 1) + '';
                //var spanOfItem = document.createElement('span');
                //spanOfItem.innerText = 'carsNames[i]';

                var parent = document.getElementById(parentID);

                parent.appendChild(divChildOfItem);
            }
        }
        addChildren();

        //  document.body.appendChild(divCreate);
    },
    ids: ['carANotifyObj', 'carBNotifyObj', 'carCNotifyObj', 'carDNotifyObj', 'carENotifyObj'],
    notifyCar: function (carID, state) {
        var that = objNotify;
        var operateID = '';
        switch (carID) {
            case 'carA':
                {
                    operateID = that.ids[0];
                }; break;
            case 'carB':
                {
                    operateID = that.ids[1];
                }; break;
            case 'carC':
                {
                    operateID = that.ids[2];
                }; break;
            case 'carD':
                {
                    operateID = that.ids[3];
                }; break;
            case 'carE':
                {
                    operateID = that.ids[4];
                }; break;
            default:
                {
                    return;
                }; break;
        }
        var operateObj = document.getElementById(operateID);
        switch (state) {
            case 'waitAtBaseStation':
                {
                    operateObj.classList.add('wait');
                }; break;
            case 'waitOnRoad':
                {
                    operateObj.classList.add('wait');
                }; break;
            case 'roadForTax':
                {
                    operateObj.classList.remove('wait');
                }; break;
            case 'waitForTaxOrAttack':
                {
                    operateObj.classList.add('wait');
                }; break;
            case 'roadForCollect':
                {
                    operateObj.classList.remove('wait');
                }; break;
            case 'waitForCollectOrAttack':
                {
                    operateObj.classList.add('wait');
                }; break;
            case 'roadForAttack':
                {
                    operateObj.classList.remove('wait');
                }; break;
            case 'returning':
                {
                    operateObj.classList.remove('wait');
                }; break;
            case 'buying':
                {
                    operateObj.classList.remove('wait');
                }; break;


        }
    }
};
var showNotify = function () {

    if (!show) {
        return;
    }




    //   divCreate.onabort

    document.body.appendChild(divCreate);
};

var carBtns =
{
    addBtnToFrame: function (carsNames, show) {

        var that = carBtns;

        var ids = ['carABtn', 'carBBtn', 'carCBtn', 'carDBtn', 'carEBtn'];
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i] + '';
            while (document.getElementById(id) != null) {
                document.getElementById(id).remove();
                carAbility.clear();
            }
        }
        if (!show) {
            return;
        }
        //    var id = 'carsPanelFrame' + '_' + 'child' + i;
        var parentIDs = [
            'carsPanelFrame_child0',
            'carsPanelFrame_child1',
            'carsPanelFrame_child2',
            'carsPanelFrame_child3',
            'carsPanelFrame_child4'];


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
            var id = ids[i] + '';
            divChildOfItem.id = id;
            divChildOfItem.style.width = 'calc(8em - 6px)';
            divChildOfItem.style.height = 'calc(100% - 6px)';
            //divChildOfItem.style.left = 'calc(1em + 6px)';
            //divChildOfItem.style.top = '0px';
            divChildOfItem.style.textAlign = 'center';
            divChildOfItem.style.border = '1px solid deepskyblue';
            divChildOfItem.style.borderRadius = '0.3em';
            //divChildOfItem.style.marginTop = '0px';
            //divChildOfItem.style.marginBottom = '-px';
            // divChildOfItem.style.position = 'relative';
            divChildOfItem.style.display = 'inline-block';
            divChildOfItem.style.marginLeft = '2px';
            divChildOfItem.yrqTagIndex = i + 0;
            //divChildOfItem.parentNode
            divChildOfItem.onclick = function () {
                // return;
                for (var i = 0; i < 5; i++) {
                    //  console.log(i, this.parentNode.children[i]);
                    var objOperating = document.getElementById(ids[i]);

                    if (objOperating.yrqTagIndex == this.yrqTagIndex) {
                        objOperating.style.border = '2px inset #ffc403';
                        var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
                        objMain.Task.carSelect = names[i] + '_' + objMain.indexKey;
                        carAbility.drawPanel(names[i]);
                        if (objMain.PromoteList.indexOf(objMain.Task.state) >= 0)
                            objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
                        else if (objMain.Task.state == 'collect')
                            objMain.mainF.lookTwoPositionCenter(objMain.collectGroup.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
                    }
                    else
                    {
                        objOperating.style.border = '1px solid deepskyblue';
                    }
                    //if (i == this.yrqTagIndex) {
                    //    this.parentNode.children[i].style.border = '2px inset #ffc403';
                    //    var names = ['carA', 'carB', 'carC', 'carD', 'carE'];
                    //    objMain.Task.carSelect = names[i] + '_' + objMain.indexKey;
                    //    carAbility.drawPanel(names[i]);
                    //    if (objMain.PromoteList.indexOf(objMain.Task.state) >= 0)
                    //        objMain.mainF.lookTwoPositionCenter(objMain.promoteDiamond.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);
                    //    else if (objMain.Task.state == 'collect')
                    //        objMain.mainF.lookTwoPositionCenter(objMain.collectGroup.children[0].position, objMain.carGroup.getObjectByName(objMain.Task.carSelect).position);

                    //}
                    //else {
                    //    this.parentNode.children[i].style.border = '1px solid deepskyblue';
                    //}
                }

            }

            var spanOfItem = document.createElement('span');
            spanOfItem.innerText = carsNames[i];
            divChildOfItem.appendChild(spanOfItem);
            var parentId = parentIDs[i];
            var parentObj = document.getElementById(parentId);
            parentObj.appendChild(divChildOfItem);
        }
    },
    clearBtnInFrame: function ()
    {
        var ids = ['carABtn', 'carBBtn', 'carCBtn', 'carDBtn', 'carEBtn'];
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i] + '';
            while (document.getElementById(id) != null) {
                document.getElementById(id).remove(); 
            }
        }
    }
};
