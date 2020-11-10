var objMain =
{
    state: '',
    receivedState: ''
};
var startA = function () {
    var connected = false;
    var wsConnect = 'ws://127.0.0.1:11001/websocket';
    var ws = new WebSocket(wsConnect);
    ws.onopen = function () {
        // Web Socket 已连接上，使用 send() 方法发送数据
        // ws.send("发送数据");
        var session = '';
        if (sessionStorage['session'] == undefined) {

        }
        else {

            session = sessionStorage['session'];
        }
        ws.send(JSON.stringify({ c: 'CheckSession', session: session }));

        //   alert("数据发送中...");
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log(evt.data);
        var received_obj = JSON.parse(evt.data);
        switch (received_obj.c) {
            case 'setState':
                {
                    objMain.receivedState = received_obj.state;
                }; break;
            case 'setSession':
                {
                    sessionStorage['session'] = received_obj.session;
                }; break;
        }
        alert("数据已接收...");
    };
    ws.onclose = function () {
        // 关闭 websocket
        alert("连接已关闭...");
    };
    objMain.ws = ws;
}
startA();

function animate() {
    {
        requestAnimationFrame(animate);
        if (objMain.state != objMain.receivedState) {
            switch (objMain.receivedState) {
                case 'selectSingleTeamJoin':
                    {
                        selectSingleTeamJoinHtml();
                    }; break;
                case 'OnLine':
                    {
                        set3DHtml();
                    }; break;
            }
            objMain.state = objMain.receivedState;
        }
        else { }
    }
}

var selectSingleTeamJoinHtml = function () {
    var text = "";
    text += "   <div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:20px;position:absolute;\" onclick=\"buttonClick('single')\">开始</div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:calc((100% + 40px)/3);position:absolute;\" onclick=\"buttonClick('team')\">组队</div>";
    text += "            <div style=\"width:calc(100% - 22px);height:calc((100% - 80px)/3);border:solid 1px green;left:10px;top:calc((100% + 10px)/3 * 2);position:absolute;\" onclick=\"buttonClick('join')\">加入</div>";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}
var set3DHtml = function () {
    var text = "";
    text += "  <div>";
    text += "            3D界面";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}

animate();

var buttonClick = function (v) {
    switch (v) {
        case 'single':
            {
                objMain.ws.send(JSON.stringify({ c: 'SetJoinGameType', joinType: "signle" }));
                //    objMain.ws = ws;
            }; break;
    }
}