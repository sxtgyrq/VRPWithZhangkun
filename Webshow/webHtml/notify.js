var objNotify =
{
    carNotifyShow: function () {
        var that = objNotify;
        while (document.getElementById('carsNotifyPanel') != null) {
            document.getElementById('carsNotifyPanel').remove();
        }
        // var carsNames = objMain.carsNames;
        var divCreate = document.createElement('div');
        divCreate.id = 'carsNotifyPanel';
        divCreate.style.position = 'absolute';
        divCreate.style.width = 'calc(1em - 2px)';
        divCreate.style.height = 'calc(6em + 48px)';
        divCreate.style.zIndex = '6';
        divCreate.style.left = '1px';

        divCreate.style.top = 'calc(50% - 20px - 2px - 3em)';
        divCreate.style.fontSize = '20px';
        //divCreate.style.color = 'blue';
        //divCreate.style.textShadow = '1px 1px 1px #000000';
        //divCreate.style.borderColor = 'deepskyblue';
        var addChildren = function () {
            for (var i = 0; i < 5; i++) {
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
                //divChildOfItem.style.height = 'calc(1em + 6px)';
                //divChildOfItem.style.textAlign = 'center';
                //divChildOfItem.style.border = '1px solid deepskyblue';
                //divChildOfItem.style.borderRadius = 'calc(50% - 1px)';
                //divChildOfItem.style.marginTop = '4px';

                //divChildOfItem.style.marginBottom = '4px';
                divChildOfItem.yrqTagIndex = i + 0;
                divChildOfItem.id = that.ids[i];
                //divChildOfItem.parentNode
                divChildOfItem.onclick = function () {
                }

                var spanOfItem = document.createElement('span');
                spanOfItem.innerText = 'carsNames[i]';
                divCreate.appendChild(divChildOfItem);
            }
        }
        addChildren();

        document.body.appendChild(divCreate);
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
}