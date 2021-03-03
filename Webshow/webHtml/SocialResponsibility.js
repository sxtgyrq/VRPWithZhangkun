var SocialResponsibility =
{
    data: {},
    operateID: 'SocialResponsibilityShow',
    html: `<div id="SocialResponsibilityShow" style="position:absolute;left:5px;top:calc(8px + 1em);z-index:7;color:rgba(255, 216, 0,1);text-shadow:2px 2px 2px gray">
        3.2
    </div>`,
    show: function () {
        var that = SocialResponsibility;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            //frag.onclick = function ()
            //{
            //    alert('提醒你！！！');
            //};
            that.updateSocialResponsibility();

        }
        else {
            that.updateSocialResponsibility();
        }
    },
    updateSocialResponsibility: function () {
        var that = SocialResponsibility;
        document.getElementById(that.operateID).innerText = (that.data[objMain.indexKey] / 100).toFixed(2);
        document.getElementById(that.operateID).onclick = function ()
        {
            alert('提醒你！！！');
        };
    }
}