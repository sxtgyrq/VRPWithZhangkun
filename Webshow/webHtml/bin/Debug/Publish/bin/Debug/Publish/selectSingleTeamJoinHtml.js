var selectSingleTeamJoinHtmlF =
{
    drawHtml: function ()
    {
        var html = `<div>
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 2em)/3);border:solid 1px green;left:10px;top:calc(20px);position:absolute;" onclick="buttonClick('single')">开始</div>
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 2em)/3);border:solid 1px green;left:10px;top:calc((100% + 40px - 2em)/3);position:absolute;" onclick="buttonClick('team')">组队</div>
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 2em)/3);border:solid 1px green;left:10px;top:calc((100% + 10px - 2em)/3 * 2);position:absolute;" onclick="buttonClick('join')">加入</div>
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 1em)/3);left:10px;top:calc((100% - 20px - 1em)/3 * 3);position:absolute;text-align:right;" onclick="buttonClick('join')">
                <span>鄙人要瑞卿的糙作，多多指教</span> <!--<span>求打赏</span>-->
            </div>
        </div>`;
        return html;
    }
}