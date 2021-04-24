var frequencyShow =
{
    operateID: 'frequencyShow',
    html: `<div id="frequencyShow" style="position:absolute;right:5px;top:4px;z-index:7;color:rgba(255, 216, 0,1);text-shadow:2px 2px 2px gray">
        3.2
    </div>`,
    show: function () {
        var that = frequencyShow;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            that.updateFrequency();

        }
        else {
            that.updateFrequency();
        }
    },
    updateFrequency: function () {
        var that = frequencyShow;
        document.getElementById(that.operateID).innerText = (objMain.FrequencyOfCollectReward / 100).toFixed(2);
    }
};

var moneyShow =
{
    operateID: 'moneyShow',
    html: `<div id="moneyShow" style="position:absolute;left:5px;top:4px;z-index:7;color:rgba(255, 216, 0,1);text-shadow:2px 2px 2px gray">
        3.2
    </div>`,
    show: function () {
        var that = moneyShow;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            that.updateMoneyShow();

        }
        else {
            that.updateMoneyShow();
        }
    },
    updateMoneyShow: function () {
        var that = moneyShow;
        document.getElementById(that.operateID).innerText = (objMain.Money / 100).toFixed(2);
    }
};

var operateStateShow =
{
    operateID: 'operateStateShow',
    html: `<div id="operateStateShow" style="position:absolute;right:5px;top:calc(8px + 1em);z-index:7;color:rgba(255, 216, 0,1);text-shadow:2px 2px 2px gray">
        旋转
    </div>`,
    show: function () {
        var that = operateStateShow;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            that.update();

        }
        else {
            that.update();
        }
    },
    update: function () {
        var that = operateStateShow;
        switch (objMain.panOrRotate) {
            case 'rotate':
                {
                    document.getElementById(that.operateID).innerText = '旋转';
                }; break;
            case 'pan':
                {
                    document.getElementById(that.operateID).innerText = '移动';
                }; break;
        } 
    }
};