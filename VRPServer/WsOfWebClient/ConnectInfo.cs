using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;

namespace WsOfWebClient
{
    public static class ConnectInfo
    {
        public static string ConnectedInfo { get; set; }
        public static int webSocketID = 0;
        public static object connectedWs_LockObj = new object();
        public static Dictionary<int, WebSocket> connectedWs = new Dictionary<int, WebSocket>();

        public static HttpClient Client = new HttpClient();
    }
}
