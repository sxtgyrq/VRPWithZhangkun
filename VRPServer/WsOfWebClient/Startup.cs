using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WsOfWebClient
{
    internal class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy(name: "MyPolicy",
                    builder =>
                    {
                        builder.WithOrigins("http://*");
                    });
            });
        }

        const int size = 1024 * 3;
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseWebSockets();
            // app.useSt(); // For the wwwroot folder
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new PhysicalFileProvider(
            //"F:\\MyProject\\VRPWithZhangkun\\MainApp\\VRPWithZhangkun\\VRPServer\\WebApp\\webHtml"),
            //    RequestPath = "/StaticFiles"
            //});

            //app.Map("/postinfo", HandleMapdownload);
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(60000 * 1000),
                ReceiveBufferSize = 1024 * 1000
            };
            app.UseWebSockets(webSocketOptions);
            app.Map("/websocket", WebSocketF);

            app.Map("/notify", notify);
            //app.Map("/websocket", builder =>
            //{
            //    builder.Use(async (context, next) =>
            //    {
            //        if (context.WebSockets.IsWebSocketRequest)
            //        {

            //            {
            //                //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");
            //                var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            //                await Echo(webSocket);
            //            }
            //        }

            //        await next();
            //    });
            //});
        }

        private static void WebSocketF(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await Echo(webSocket);
                }
            });
        }

        private static async Task Echo(System.Net.WebSockets.WebSocket webSocket)
        {
            WebSocketReceiveResult wResult;
            {
                //byte[] buffer = new byte[size];
                //var buffer = new ArraySegment<byte>(new byte[8192]);
                State s = new State();
                s.WebsocketID = ConnectInfo.webSocketID++;
                s.Ls = LoginState.empty;
                removeWsIsNotOnline();
                addWs(webSocket, s.WebsocketID);

                var carsNames = new string[] { "车1,", "车2,", "车3,", "车4,", "车5," };
                var playerName = "玩家1";
                //if(s.Ls== LoginState.)

                do
                {
                    try
                    {

                        var returnResult = await ReceiveStringAsync(webSocket);

                        wResult = returnResult.wr;
                        Console.WriteLine($"receive:{returnResult.result}");
                        CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(returnResult.result);
                        switch (c.c)
                        {
                            case "CheckSession":
                                {
                                    if (s.Ls == LoginState.empty)
                                    {
                                        CheckSession checkSession = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckSession>(returnResult.result);
                                        var checkResult = await BLL.CheckSessionBLL.checkIsOK(checkSession);
                                        if (checkResult)
                                        {
                                            s.Ls = LoginState.OnLine;
                                            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                            var sendData = Encoding.UTF8.GetBytes(msg);
                                            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                        }
                                        else
                                        {
                                            //int roomID = 0;
                                            //  string sessession = BLL.CheckSessionBLL.getSession();
                                            s.Ls = LoginState.selectSingleTeamJoin;
                                            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                            var sendData = Encoding.UTF8.GetBytes(msg);
                                            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                        }
                                    }
                                }; break;
                            case "JoinGameSingle":
                                {
                                    JoinGameSingle joinType = Newtonsoft.Json.JsonConvert.DeserializeObject<JoinGameSingle>(returnResult.result);
                                    if (s.Ls == LoginState.selectSingleTeamJoin)
                                    {
                                        // if (joinType.joinType == "signle")
                                        {
                                            s = await Room.GetRoomThenStart(s, webSocket);
                                        }
                                    }
                                }; break;
                            case "CreateTeam":
                                {
                                    CreateTeam ct = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateTeam>(returnResult.result);
                                    if (s.Ls == LoginState.selectSingleTeamJoin)
                                    {

                                        // if (joinType.joinType == "team")
                                        {
                                            // var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                            //var team = await Team.createTeam(s.WebsocketID, command_start);
                                            //   var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                            string command_start;
                                            CommonClass.TeamResult team;
                                            {
                                                //将状态设置为等待开始和等待加入
                                                s.Ls = LoginState.WaitingToStart;
                                                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                var sendData = Encoding.UTF8.GetBytes(msg);
                                                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                            }
                                            {
                                                //
                                                command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                                team = await Team.createTeam2(s.WebsocketID, command_start);
                                            }
                                            {
                                                //var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID); 
                                                returnResult = await ReceiveStringAsync(webSocket);

                                                wResult = returnResult.wr;
                                                if (returnResult.result == command_start)
                                                {
                                                    // throw new Exception("");
                                                    s = await Room.GetRoomThenStartAfterCreateTeam(s, webSocket, team);
                                                    //var roomInfo = Room.getRoomNum(s.WebsocketID);
                                                    //var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                                                    //var receivedMsg = await sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                                                    //if (receivedMsg == "ok")
                                                    //{
                                                    //    {
                                                    //        // roomNumber
                                                    //        /*
                                                    //         * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
                                                    //         */
                                                    //        roomInfo.FromUrl = "";
                                                    //        var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                                                    //        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                                                    //        var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                    //    }
                                                    //    {
                                                    //        //int roomID = 0;
                                                    //        //  string sessession = BLL.CheckSessionBLL.getSession();
                                                    //        s.Ls = LoginState.OnLine;
                                                    //        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                    //        var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                    //    }

                                                    //}
                                                    //s.Ls = LoginState.OnLine;
                                                    //var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                    //var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                }
                                            }
                                        }
                                        //else if()


                                    }
                                }; break;
                            case "JoinTeam":
                                {
                                    JoinTeam ct = Newtonsoft.Json.JsonConvert.DeserializeObject<JoinTeam>(returnResult.result);
                                    if (s.Ls == LoginState.selectSingleTeamJoin)
                                    {

                                        // if (joinType.joinType == "team")
                                        {
                                            // var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                            //var team = await Team.createTeam(s.WebsocketID, command_start);
                                            //   var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                            string command_start;
                                            CommonClass.TeamResult team;
                                            {
                                                //将状态设置为等待开始和等待加入
                                                s.Ls = LoginState.WaitingToGetTeam;
                                                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                var sendData = Encoding.UTF8.GetBytes(msg);
                                                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                            }
                                            {
                                                returnResult = await ReceiveStringAsync(webSocket);

                                                wResult = returnResult.wr;
                                                var teamID = returnResult.result;
                                                command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                                var teamFound = await Team.findTeam2(s.WebsocketID, command_start);
                                                if (teamFound.HasResult)
                                                {
                                                    returnResult = await ReceiveStringAsync(webSocket);

                                                    wResult = returnResult.wr;
                                                    if (returnResult.result == command_start)
                                                    {
                                                        s = await Room.GetRoomThenStartAfterJoinTeam(s, webSocket, teamID);
                                                    }
                                                }
                                                else
                                                {
                                                    await WaitForSelection.SelectSingleTeamJoin(s, webSocket);
                                                    var notifyMsg = $"没有通过{teamID}找到队伍！";

                                                    await Message.Notify(webSocket, notifyMsg);
                                                    continue;
                                                }
                                                //if (returnResult.result == command_start) { }
                                            }
                                            {
                                                //
                                                command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                                team = await Team.createTeam2(s.WebsocketID, command_start);
                                            }
                                            {
                                                //var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID); 
                                                returnResult = await ReceiveStringAsync(webSocket);

                                                wResult = returnResult.wr;
                                                if (returnResult.result == command_start)
                                                {
                                                    // throw new Exception("");
                                                    s = await Room.GetRoomThenStartAfterCreateTeam(s, webSocket, team);
                                                    //var roomInfo = Room.getRoomNum(s.WebsocketID);
                                                    //var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                                                    //var receivedMsg = await sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                                                    //if (receivedMsg == "ok")
                                                    //{
                                                    //    {
                                                    //        // roomNumber
                                                    //        /*
                                                    //         * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
                                                    //         */
                                                    //        roomInfo.FromUrl = "";
                                                    //        var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                                                    //        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                                                    //        var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                    //    }
                                                    //    {
                                                    //        //int roomID = 0;
                                                    //        //  string sessession = BLL.CheckSessionBLL.getSession();
                                                    //        s.Ls = LoginState.OnLine;
                                                    //        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                    //        var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                    //    }

                                                    //}
                                                    //s.Ls = LoginState.OnLine;
                                                    //var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                                                    //var sendData = Encoding.UTF8.GetBytes(msg);
                                                    //await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                                }
                                            }
                                        }
                                        //else if()


                                    }
                                }; break;
                            case "setCarName":
                                {

                                }; break;
                            case "SetPlayerName":
                                {
                                    if (s.Ls == LoginState.selectSingleTeamJoin)

                                    {
                                        SetPlayerName setPlayerName = Newtonsoft.Json.JsonConvert.DeserializeObject<SetPlayerName>(returnResult.result);
                                        playerName = setPlayerName.Name;
                                    }
                                }; break;
                            case "SetCarName":
                                {
                                    if (s.Ls == LoginState.selectSingleTeamJoin)
                                    {
                                        SetCarName setCarName = Newtonsoft.Json.JsonConvert.DeserializeObject<SetCarName>(returnResult.result);
                                        if (setCarName.Name.Trim().Length < 7 && setCarName.Name.Trim().Length > 1)
                                        {
                                            if (setCarName.CarIndex >= 0 && setCarName.CarIndex < 5)
                                            {
                                                carsNames[setCarName.CarIndex] = setCarName.Name;
                                            }
                                        }
                                        //playerName = setPlayerName.Name;
                                    }
                                }; break;
                        }
                    }
                    catch
                    {
                        // Console.WriteLine($"step2：webSockets数量：{   BufferImage.webSockets.Count}");
                        return;
                    }
                }
                while (!wResult.CloseStatus.HasValue);
                try
                {
                    await webSocket.CloseAsync(wResult.CloseStatus.Value, wResult.CloseStatusDescription, CancellationToken.None);


                }
                catch
                {
                    return;
                }
            };
        }

        public static async Task<string> sendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            // ConnectInfo.Client.PostAsync(roomUrl,)
            var buffer = Encoding.UTF8.GetBytes(sendMsg);
            var byteContent = new ByteArrayContent(buffer);
            var response = await ConnectInfo.Client.PostAsync(roomUrl, byteContent);
            return await response.Content.ReadAsStringAsync();
        }

        private static void addWs(System.Net.WebSockets.WebSocket webSocket, int websocketID)
        {
            lock (ConnectInfo.connectedWs_LockObj)
            {
                ConnectInfo.connectedWs.Add(websocketID, webSocket);
            }
        }

        private static void removeWsIsNotOnline()
        {
            lock (ConnectInfo.connectedWs_LockObj)
            {
                List<int> keys = new List<int>();

                foreach (var item in ConnectInfo.connectedWs)
                {
                    if (item.Value.CloseStatus.HasValue)
                    {
                        keys.Add(item.Key);
                    }
                }
                for (int i = 0; i < keys.Count; i++)
                {
                    ConnectInfo.connectedWs.Remove(keys[i]);
                }
            }
        }

        class ReceiveObj
        {
            public WebSocketReceiveResult wr { get; set; }
            public string result { get; set; }
        }

        private static async Task<ReceiveObj> ReceiveStringAsync(System.Net.WebSockets.WebSocket socket, CancellationToken ct = default(CancellationToken))
        {
            var buffer = new ArraySegment<byte>(new byte[size]);
            WebSocketReceiveResult result;
            using (var ms = new MemoryStream())
            {
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if (result.MessageType != WebSocketMessageType.Text)
                {
                    return new ReceiveObj()
                    {
                        result = null,
                        wr = result
                    };
                }
                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    var strValue = await reader.ReadToEndAsync();
                    return new ReceiveObj()
                    {
                        result = strValue,
                        wr = result
                    };
                }
            }
        }


        const double roadZoomValue = 0.0000003;

        public static LoginState WaitingToStart { get; private set; }

        private static System.Numerics.Complex setToOne(System.Numerics.Complex vecRes)
        {
            var data = setToOne(new double[] { vecRes.Real, vecRes.Imaginary });
            return new System.Numerics.Complex(data[0], data[1]);
        }

        private static double[] setToOne(double[] vec)
        {
            var l = Math.Sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
            return new double[] { vec[0] / l, vec[1] / l };
        }

        private static string getStrFromByte(ref byte[] buffer)
        {
            string str = "";

            for (var i = buffer.Length - 1; i >= 0; i--)
            {
                if (buffer[i] != 0)
                {
                    str = Encoding.UTF8.GetString(buffer.Take(i + 1).ToArray()).Trim();
                    break;
                }

            }
            buffer = new byte[size];
            return str;

        }

        private static void notify(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (context.Request.Method.ToLower() == "post")
                {
                    var notifyJson = getBodyStr(context);
                    //  await context.Response.WriteAsync("ok");

                    //var notifyJson = getBodyStr(context);

                    Console.WriteLine($"notify receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    if (c.c == "PlayerAdd")
                    {
                        CommonClass.PlayerAdd addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd>(notifyJson);
                        //BaseInfomation.rm.Players.Add(addItem.Key, new Player()
                        //{
                        //    Key = addItem.Key,
                        //    FromUrl = addItem.FromUrl,

                        //});
                        //await sendInmationToUrl(addItem.FromUrl, notifyJson);
                    }
                    await context.Response.WriteAsync("ok");
                }
            });
        }

        public static string getBodyStr(HttpContext context)
        {
            string requestContent;
            using (var requestReader = new StreamReader(context.Request.Body, Encoding.UTF8))
            {
                requestContent = requestReader.ReadToEnd();

            }
            return requestContent;

        }
    }
}
