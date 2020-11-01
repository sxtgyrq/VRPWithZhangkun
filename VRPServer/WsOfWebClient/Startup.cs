using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
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
            app.Map("/websocket", WebSocket);


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
        static int webSocketID = 0;
        static object connectedWs_LockObj = new object();
        static Dictionary<int, WebSocket> connectedWs = new Dictionary<int, WebSocket>();
        private static void WebSocket(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    //Task task = new Task(() => SendMsg(webSocket));
                    //task.Start();
                    // BufferImage.webSockets.Add(webSocket);
                    await Echo(webSocket);
                    //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");


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
                s.WebsocketID = webSocketID++;
                s.LoginState = "";
                removeWsIsNotOnline();
                addWs(webSocket, s.WebsocketID);
                do
                {
                    try
                    {

                        var returnResult = await ReceiveStringAsync(webSocket);

                        wResult = returnResult.wr;
                        Console.WriteLine($"receive:{returnResult.result}");
                        Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<Command>(returnResult.result);
                        switch (c.c)
                        {
                            case "CheckSession":
                                {
                                    if (s.LoginState == "")
                                    {
                                        CheckSession checkSession = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckSession>(returnResult.result);
                                        if (BLL.CheckSessionBLL.checkIsOK(checkSession))
                                        {

                                        }
                                        else 
                                        {
                                            int roomID = 0;
                                            int sessession=
                                            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { reqMsg = str, t = "cross", obj = listOfCrosses });
                                            var sendData = Encoding.UTF8.GetBytes(msg);
                                            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                        }
                                    }


                                    // var
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

        private static void addWs(System.Net.WebSockets.WebSocket webSocket, int websocketID)
        {
            lock (connectedWs_LockObj)
            {
                connectedWs.Add(websocketID, webSocket);
            }
        }

        private static void removeWsIsNotOnline()
        {
            lock (connectedWs_LockObj)
            {
                List<int> keys = new List<int>();

                foreach (var item in connectedWs)
                {
                    while (item.Value.CloseStatus.HasValue)
                    {
                        keys.Add(item.Key);
                    }
                }
                for (int i = 0; i < keys.Count; i++)
                {
                    connectedWs.Remove(keys[i]);
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

        //private static object getCrossPoints(SaveRoad.RoadInfo value, Dictionary<string, Dictionary<int, SaveRoad.RoadInfo>> result)
        //{
        //    //List<string>
        //    throw new NotImplementedException();
        //}
        //00ff00 至 ffff00
        const double roadZoomValue = 0.0000003;
        //private static double[] getRoadRectangle(SaveRoad.RoadInfo value, Dictionary<int, SaveRoad.RoadInfo> result)
        //{
        //    double KofPointStretchFirstAndSecond = 1;
        //    double KofPointStretchThirdAndFourth = 1;
        //    if (value.CarInOpposeDirection == 0)
        //    {
        //        KofPointStretchFirstAndSecond = 0.1;
        //        KofPointStretchThirdAndFourth = 1.5;
        //    }

        //    double[] point1, point2, point3, point4;
        //    var vec = new double[] { value.endLongitude - value.startLongitude, value.endLatitude - value.startLatitude };
        //    vec = setToOne(vec);
        //    System.Numerics.Complex c = new System.Numerics.Complex(vec[0], vec[1]);
        //    if (!result.ContainsKey(value.RoadOrder - 1))
        //    {
        //        var c2 = new System.Numerics.Complex(0, 1);
        //        var c3 = c * c2;

        //        point1 = new double[] {
        //            value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //            value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond
        //            };
        //        var c5 = c / c2;
        //        point2 = new double[] {
        //            value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //            value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };

        //    }
        //    else
        //    {
        //        var valueP = result[value.RoadOrder - 1];//previows
        //        var vecP = new double[] { valueP.endLongitude - valueP.startLongitude, valueP.endLatitude - valueP.startLatitude };
        //        vecP = setToOne(vecP);
        //        System.Numerics.Complex cP = new System.Numerics.Complex(-vecP[0], -vecP[1]);
        //        var vecDiv2 = c + cP;
        //        {
        //            if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
        //            {
        //                var c2 = new System.Numerics.Complex(0, 1);
        //                var c3 = c * c2;
        //                point1 = new double[] {
        //            value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //            value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };
        //                var c5 = c / c2;
        //                point2 = new double[] {
        //            value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //            value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond };
        //            }
        //            else
        //            {
        //                var k = 1 / (vecDiv2 / c).Imaginary;
        //                var s = Math.Sqrt(k * k + 1 / k / k);

        //                {
        //                    var vecDivOperate = s / k * setToOne(vecDiv2);
        //                    point1 = new double[] {
        //            value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //            value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchFirstAndSecond };
        //                }
        //                {
        //                    var vecDiv2_opp_diretion = -1 * (vecDiv2);
        //                    var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
        //                    point2 = new double[] {
        //                    value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
        //                    value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue *KofPointStretchFirstAndSecond };
        //                }
        //            }
        //        }
        //    }
        //    c = new System.Numerics.Complex(-vec[0], -vec[1]);
        //    if (!result.ContainsKey(value.RoadOrder + 1))
        //    {
        //        var c2 = new System.Numerics.Complex(0, 1);
        //        var c3 = c * c2;
        //        point3 = new double[] {
        //            value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //            value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
        //        };
        //        var c5 = c / c2;
        //        point4 = new double[] {
        //            value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //            value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
        //        };
        //    }
        //    else
        //    {
        //        var valueN = result[value.RoadOrder + 1];//next
        //        var vecN = new double[] {
        //            valueN.endLongitude - valueN.startLongitude,
        //            valueN.endLatitude - valueN.startLatitude
        //        };
        //        vecN = setToOne(vecN);
        //        System.Numerics.Complex cP = new System.Numerics.Complex(vecN[0], vecN[1]);
        //        var vecDiv2 = c + cP;
        //        if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
        //        {
        //            var c2 = new System.Numerics.Complex(0, 1);
        //            var c3 = c * c2;
        //            point3 = new double[] {
        //            value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //            value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchThirdAndFourth};
        //            var c5 = c / c2;
        //            point4 = new double[] {
        //            value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //            value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth };
        //        }
        //        else
        //        {
        //            var k = 1 / (vecDiv2 / c).Imaginary;
        //            var s = Math.Sqrt(k * k + 1 / k / k);
        //            {

        //                var vecDivOperate = s / k * setToOne(vecDiv2);
        //                point3 = new double[] {
        //                    value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //                    value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
        //            }
        //            {
        //                var vecDiv2_opp_diretion = -1 * vecDiv2;
        //                var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
        //                point4 = new double[] {
        //                    value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
        //                    value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
        //            }
        //        }


        //    }
        //    return new double[]
        //    {
        //      Math.Round(  point1[0],9),Math.Round(point1[1],9),
        //     Math.Round(   point2[0],9),Math.Round(point2[1],9),
        //     Math.Round(   point3[0],9),Math.Round(point3[1],9),
        //     Math.Round(   point4[0],9),Math.Round(point4[1],9)
        //    };
        //}

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
    }
}
