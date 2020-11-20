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
                    switch (objMain.receivedState) {
                        case 'selectSingleTeamJoin':
                            {
                                selectSingleTeamJoinHtml();
                            }; break;
                        case 'OnLine':
                            {
                                set3DHtml();
                            }; break;
                        case 'WaitingToStart':
                            {
                                setWaitingToStart();
                            }; break;
                        case 'WaitingToGetTeam':
                            {
                                setWaitingToGetTeam();
                            }; break;
                    }
                }; break;
            case 'setSession':
                {
                    sessionStorage['session'] = received_obj.session;
                }; break;
            case 'TeamCreateFinish':
                {
                    //  alert();
                    console.log('提示', '队伍创建成功');
                    if (objMain.receivedState == 'WaitingToStart') {
                        //{"CommandStart":"182be0c5cdcd5072bb1864cdee4d3d6e","WebSocketID":3,"TeamNum":0,"c":"TeamCreateFinish"}
                        token.CommandStart = received_obj.CommandStart;
                        createTeam(received_obj)
                    }
                    //  sessionStorage['session'] = received_obj.session;
                }; break;
            case 'TeamJoinFinish':
                {
                    console.log('提示', '加入队伍成功');
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        joinTeamDetail(received_obj);
                    }
                }; break;
            case 'Alert':
                {
                    alert(received_obj.msg);
                }; break;
            case 'TeamJoinBroadInfo':
                {
                    //  broadTeamJoin(received_obj);
                    if (objMain.receivedState == 'WaitingToGetTeam' || objMain.receivedState == 'WaitingToStart') {
                        broadTeamJoin(received_obj);
                    }
                }; break;
            case 'TeamNumWithSecret':
                {
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        objMain.ws.send(received_msg);
                    }
                }; break;

        }
        //alert("数据已接收...");
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

var setWaitingToStart = function () {
    var text = "";
    text += "  <div>";
    text += "          请等待";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}

var createTeam = function (teamCreateFinish) {
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';

    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamCreateFinish.TeamNum));
    div1.appendChild(addDiv('队长：', teamCreateFinish.PlayerName));

    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '开始';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "1em";
    button.onclick = function () {
        // alert('开始事件还没有写写哦');
        //objMain.ws.se
        objMain.ws.send(token.CommandStart);
    };
    div2.appendChild(button);
    document.getElementById('rootContainer').appendChild(div2);
}

var joinTeamDetail = function (teamJoinFinish) {
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';

    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamJoinFinish.TeamNum));
    div1.appendChild(addDiv('队长：', teamJoinFinish.PlayerNames[0]));

    for (var i = 1; i < teamJoinFinish.PlayerNames.length; i++) {
        div1.appendChild(addDiv('队员：', teamJoinFinish.PlayerNames[i]));
    }

    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    document.getElementById('rootContainer').appendChild(div2);
}

var broadTeamJoin = function (teamJoinBroadInfo) {
    var addDiv = function (title, content) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        return div;
    }
    document.getElementById('rootContainer').children[0].appendChild(addDiv('队员：', teamJoinBroadInfo.PlayerName));
}

var setWaitingToGetTeam = function () {
    document.getElementById('rootContainer').innerHTML = '';
    //var roomNum = null;
    //do {
    //    roomNum = prompt('输入房间号', '0');
    //}
    //while (roomNum == null);
    //objMain.ws.send(roomNum);

    //<div style="text-align:center;margin-top:2em">
    //    <label >房间号</label><input id="roomNubInput" type="number" />
    //</div>
    //    <div style="text-align:center;">
    //        <button style="width: 5em;
    //    height: 3em;
    //    margin-top: 1em;">
    //            加入
    //        </button>
    //    </div>
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';
    div1.style.marginTop = '2em';
    var label = document.createElement('label');
    label.innerText = '房间号';
    var input = document.createElement('input');
    input.id = 'roomNumInput';
    input.type = 'number';
    div1.appendChild(label);
    div1.appendChild(input);
    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '加入';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "1em";
    button.onclick = function () {
        console.log('提示', '加入事件还没有写写哦');
        var roomNumInput = document.getElementById('roomNumInput').value;
        if (roomNumInput == '') {
            alert('不要输入空');
        }
        else {
            objMain.ws.send(roomNumInput);
            this.onclick = function () { };
        }
    };
    div2.appendChild(button);
    document.getElementById('rootContainer').appendChild(div2);
}

animate();

var buttonClick = function (v) {
    if (objMain.receivedState == 'selectSingleTeamJoin') {
        switch (v) {
            case 'single':
                {
                    objMain.ws.send(JSON.stringify({ c: 'JoinGameSingle' }));
                    //    objMain.ws = ws;
                }; break;
            case 'team':
                {
                    objMain.ws.send(JSON.stringify({ c: 'CreateTeam' }));
                }; break;
            case 'join':
                {
                    objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
                }; break;
        }
        objMain.receivedState = '';
    }
}

var token =
{
    CommandStart: '',

};