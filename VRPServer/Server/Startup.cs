using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using OssModel = Model;

namespace Server
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
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
            "F:\\MyProject\\VRPWithZhangkun\\MainApp\\VRPWithZhangkun\\VRPServer\\WebApp\\webHtml"),
                RequestPath = "/StaticFiles"
            });

            //app.Map("/postinfo", HandleMapdownload);
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(60000 * 1000),
                ReceiveBufferSize = 1024 * 1000
            };
            app.UseWebSockets(webSocketOptions);
            //  app.Map("/websocket", WebSocket);


            app.Map("/websocket", builder =>
            {
                builder.Use(async (context, next) =>
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {

                        {
                            //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");
                            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                            await Echo(webSocket);
                        }
                    }

                    await next();
                });
            });
        }


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
                byte[] buffer = new byte[size];
                do
                {
                    try
                    {
                        wResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        var str = getStrFromByte(ref buffer);
                        if (str == "allMap")
                        {
                            Dictionary<string, bool> Cs = new Dictionary<string, bool>();
                            List<object> listOfCrosses = new List<object>();
                            Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> result;
                            Program.dt.GetData(out result);
                            List<double[]> meshPoints = new List<double[]>();
                         //   List<int> colors = new List<int>();
                            foreach (var item in result)
                            {
                                foreach (var itemj in item.Value)
                                {
                                    var value = itemj.Value;
                                    var ps = getRoadRectangle(value, item.Value);
                                    meshPoints.Add(ps);

                                 
                                    for (var i = 0; i < value.Cross1.Length; i++)
                                    {
                                        var cross = value.Cross1[i];
                                        var key = cross.RoadCode1.CompareTo(cross.RoadCode2) > 0 ?
                                            $"{cross.RoadCode1}_{cross.RoadOrder1}_{cross.RoadCode2}_{cross.RoadOrder2}" :
                                            $"{cross.RoadCode2}_{cross.RoadOrder2}_{cross.RoadCode1}_{cross.RoadOrder1}";
                                        if (Cs.ContainsKey(key)) { }
                                        else
                                        {
                                            Cs.Add(key, false);
                                            listOfCrosses.Add(new { lon = cross.BDLongitude, lat = cross.BDLatitude, state = cross.CrossState });
                                        }
                                    }
                                    //value.Cross1
                                }
                            }
                            {
                                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { reqMsg = str, t = "road", obj = meshPoints  });
                                var sendData = Encoding.UTF8.GetBytes(msg);
                                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                            }
                            {
                                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { reqMsg = str, t = "cross", obj = listOfCrosses });
                                var sendData = Encoding.UTF8.GetBytes(msg);
                                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                            }

                            //foreach (var item in result)
                            //{
                            //    foreach (var itemj in item.Value)
                            //    {
                            //        var value = itemj.Value;
                            //        var ps = getCrossPoints(value, result);
                            //        meshPoints.Add(ps);

                            //    }
                            //}

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

        private static object getCrossPoints(SaveRoad.RoadInfo value, Dictionary<string, Dictionary<int, SaveRoad.RoadInfo>> result)
        {
            //List<string>
            throw new NotImplementedException();
        }
        //00ff00 至 ffff00
        const double roadZoomValue = 0.0000003;
        private static double[] getRoadRectangle(SaveRoad.RoadInfo value, Dictionary<int, SaveRoad.RoadInfo> result)
        {
            double KofPointStretchFirstAndSecond = 1;
            double KofPointStretchThirdAndFourth = 1;
            if (value.CarInOpposeDirection == 0)
            {
                KofPointStretchFirstAndSecond = 0.1;
                KofPointStretchThirdAndFourth = 1.5;
            }

            double[] point1, point2, point3, point4;
            var vec = new double[] { value.endLongitude - value.startLongitude, value.endLatitude - value.startLatitude };
            vec = setToOne(vec);
            System.Numerics.Complex c = new System.Numerics.Complex(vec[0], vec[1]);
            if (!result.ContainsKey(value.RoadOrder - 1))
            {
                var c2 = new System.Numerics.Complex(0, 1);
                var c3 = c * c2;

                point1 = new double[] {
                    value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond
                    };
                var c5 = c / c2;
                point2 = new double[] {
                    value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };

            }
            else
            {
                var valueP = result[value.RoadOrder - 1];//previows
                var vecP = new double[] { valueP.endLongitude - valueP.startLongitude, valueP.endLatitude - valueP.startLatitude };
                vecP = setToOne(vecP);
                System.Numerics.Complex cP = new System.Numerics.Complex(-vecP[0], -vecP[1]);
                var vecDiv2 = c + cP;
                {
                    if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
                    {
                        var c2 = new System.Numerics.Complex(0, 1);
                        var c3 = c * c2;
                        point1 = new double[] {
                    value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };
                        var c5 = c / c2;
                        point2 = new double[] {
                    value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond };
                    }
                    else
                    {
                        var k = 1 / (vecDiv2 / c).Imaginary;
                        var s = Math.Sqrt(k * k + 1 / k / k);

                        {
                            var vecDivOperate = s / k * setToOne(vecDiv2);
                            point1 = new double[] {
                    value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchFirstAndSecond };
                        }
                        {
                            var vecDiv2_opp_diretion = -1 * (vecDiv2);
                            var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
                            point2 = new double[] {
                            value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                            value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue *KofPointStretchFirstAndSecond };
                        }
                    }
                }
            }
            c = new System.Numerics.Complex(-vec[0], -vec[1]);
            if (!result.ContainsKey(value.RoadOrder + 1))
            {
                var c2 = new System.Numerics.Complex(0, 1);
                var c3 = c * c2;
                point3 = new double[] {
                    value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
                };
                var c5 = c / c2;
                point4 = new double[] {
                    value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
                };
            }
            else
            {
                var valueN = result[value.RoadOrder + 1];//next
                var vecN = new double[] {
                    valueN.endLongitude - valueN.startLongitude,
                    valueN.endLatitude - valueN.startLatitude
                };
                vecN = setToOne(vecN);
                System.Numerics.Complex cP = new System.Numerics.Complex(vecN[0], vecN[1]);
                var vecDiv2 = c + cP;
                if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
                {
                    var c2 = new System.Numerics.Complex(0, 1);
                    var c3 = c * c2;
                    point3 = new double[] {
                    value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchThirdAndFourth};
                    var c5 = c / c2;
                    point4 = new double[] {
                    value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth };
                }
                else
                {
                    var k = 1 / (vecDiv2 / c).Imaginary;
                    var s = Math.Sqrt(k * k + 1 / k / k);
                    {

                        var vecDivOperate = s / k * setToOne(vecDiv2);
                        point3 = new double[] {
                            value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                            value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
                    }
                    {
                        var vecDiv2_opp_diretion = -1 * vecDiv2;
                        var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
                        point4 = new double[] {
                            value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                            value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
                    }
                }


            }
            return new double[]
            {
              Math.Round(  point1[0],9),Math.Round(point1[1],9),
             Math.Round(   point2[0],9),Math.Round(point2[1],9),
             Math.Round(   point3[0],9),Math.Round(point3[1],9),
             Math.Round(   point4[0],9),Math.Round(point4[1],9)
            };
        }

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