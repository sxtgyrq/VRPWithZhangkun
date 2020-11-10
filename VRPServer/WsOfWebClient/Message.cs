using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WsOfWebClient
{
    class Message
    {
        internal static async Task Notify(WebSocket webSocket, string notifyMsg)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "message", type = "notify", msg = notifyMsg });
            var sendData = Encoding.UTF8.GetBytes(msg);
            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}
