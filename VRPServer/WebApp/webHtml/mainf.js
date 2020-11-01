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
        alert("数据已接收...");
    };
    ws.onclose = function () {
        // 关闭 websocket
        alert("连接已关闭...");
    };
}