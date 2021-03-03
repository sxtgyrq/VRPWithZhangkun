var selectSingleTeamJoinHtmlF =
{
    drawHtml: function ()
    {
        var html = ` <div>
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 1em)/3);border:solid 1px green;left:10px;top:calc(20px);position:absolute;" onclick="buttonClick('single')">开始</div>
            <div style="        width: calc((100% - 30px)/2);
        height: calc((100% - 80px - 1em)/3);
        border: solid 1px green;
        left: 10px;
        top: calc((100% + 40px - 1em)/3);
        position: absolute;
        text-align: center;
        line-height: 100%;
    " onclick="buttonClick('team')">
                <span style="top:calc(50% - 0.5em);position:relative;">
                    查看/修改昵称
                </span>
            </div>
            <div style="        width: calc((100% - 34px)/2);
        height: calc((100% - 80px - 1em)/3);
        border: solid 1px green;
        left: calc((100% - 30px)/2 + 20px);
        top: calc((100% + 40px - 1em)/3);
        position: absolute;
        text-align: center;
        line-height:100%;
    " onclick="buttonClick('team')">
                <span style="top:calc(50% - 0.5em);position:relative;">
                    查看/修改车名
                </span>
            </div> 
            <div style="        width: calc((100% - 30px)/2);
        height: calc((100% - 80px - 1em)/3);
        border: solid 1px green;
        left: 10px;
        top: calc((100% + 10px - 1em)/3 * 2);
        position: absolute;" onclick="buttonClick('team')">组队</div>
            <div style="        width: calc((100% - 30px)/2);
        height: calc((100% - 80px - 1em)/3);
        border: solid 1px green;
        left: calc((100% - 34px)/2 + 20px);
        top: calc((100% + 10px - 1em)/3 * 2);
        position: absolute;" onclick="buttonClick('join')">加入</div>
            
            <div style="width:calc(100% - 22px);height:calc((100% - 80px - 1em)/3);left:10px;top:calc((100% - 20px - 1em)/3 * 3);position:absolute;text-align:right;" onclick="buttonClick('join')">
                <span>要瑞卿的粗糙作品，多多指教</span> 
            </div>
        </div>`;
        return html;
    }
}