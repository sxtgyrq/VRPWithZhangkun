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