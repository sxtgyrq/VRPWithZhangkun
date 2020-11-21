using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
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
            //app.Map("/websocket", WebSocket);

            app.Map("/notify", notify);
        }
        private static void notify(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (context.Request.Method.ToLower() == "post")
                {
                    var notifyJson = getBodyStr(context);

                    Console.WriteLine($"notify receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "PlayerAdd":
                            {
                                CommonClass.PlayerAdd addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd>(notifyJson);
                                BaseInfomation.rm.Players.Add(addItem.Key, new Player()
                                {
                                    Key = addItem.Key,
                                    FromUrl = addItem.FromUrl,

                                });
                                // await sendInmationToUrl(addItem.FromUrl, notifyJson);
                                await context.Response.WriteAsync("ok");
                            }; break;
                        case "PlayerCheck":
                            {
                                CommonClass.PlayerCheck checkItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerCheck>(notifyJson);
                                if (BaseInfomation.rm.Players.ContainsKey(checkItem.Key))
                                {
                                    await context.Response.WriteAsync("ok");
                                }
                                else
                                {
                                    await context.Response.WriteAsync("ng");
                                }
                            }; break;
                        case "Map":
                            {
                                //CommonClass.PlayerCheck checkItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerCheck>(notifyJson);
                                //if (BaseInfomation.rm.Players.ContainsKey(checkItem.Key))
                                //{
                                //    {
                                //        Dictionary<string, bool> Cs = new Dictionary<string, bool>();
                                //        List<object> listOfCrosses = new List<object>();
                                //        Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> result;
                                //        Program.dt.GetData(out result);
                                //        List<double[]> meshPoints = new List<double[]>();
                                //        //   List<int> colors = new List<int>();
                                //        foreach (var item in result)
                                //        {
                                //            foreach (var itemj in item.Value)
                                //            {
                                //                var value = itemj.Value;
                                //                var ps = getRoadRectangle(value, item.Value);
                                //                meshPoints.Add(ps);


                                //                for (var i = 0; i < value.Cross1.Length; i++)
                                //                {
                                //                    var cross = value.Cross1[i];
                                //                    var key = cross.RoadCode1.CompareTo(cross.RoadCode2) > 0 ?
                                //                        $"{cross.RoadCode1}_{cross.RoadOrder1}_{cross.RoadCode2}_{cross.RoadOrder2}" :
                                //                        $"{cross.RoadCode2}_{cross.RoadOrder2}_{cross.RoadCode1}_{cross.RoadOrder1}";
                                //                    if (Cs.ContainsKey(key)) { }
                                //                    else
                                //                    {
                                //                        Cs.Add(key, false);
                                //                        listOfCrosses.Add(new { lon = cross.BDLongitude, lat = cross.BDLatitude, state = cross.CrossState });
                                //                    }
                                //                }
                                //                //value.Cross1
                                //            }
                                //        }
                                //        {
                                //            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { reqMsg = str, t = "road", obj = meshPoints });
                                //            var sendData = Encoding.UTF8.GetBytes(msg);
                                //            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                //        }
                                //        {
                                //            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { reqMsg = str, t = "cross", obj = listOfCrosses });
                                //            var sendData = Encoding.UTF8.GetBytes(msg);
                                //            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), wResult.MessageType, true, CancellationToken.None);
                                //        }

                                //        //foreach (var item in result)
                                //        //{
                                //        //    foreach (var itemj in item.Value)
                                //        //    {
                                //        //        var value = itemj.Value;
                                //        //        var ps = getCrossPoints(value, result);
                                //        //        meshPoints.Add(ps);

                                //        //    }
                                //        //}

                                //    }
                                //    await context.Response.WriteAsync("ok");
                                //}
                                //else
                                //{
                                //    await context.Response.WriteAsync("ng");
                                //}
                            }; break;
                    }
                    //if (c.c == "PlayerAdd")
                    //{
                    //    CommonClass.PlayerAdd addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd>(notifyJson);
                    //    BaseInfomation.rm.Players.Add(addItem.Key, new Player()
                    //    {
                    //        Key = addItem.Key,
                    //        FromUrl = addItem.FromUrl,

                    //    });
                    //    // await sendInmationToUrl(addItem.FromUrl, notifyJson);
                    //    await context.Response.WriteAsync("ok");
                    //}
                    // await context.Response.WriteAsync("ok");
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

        private static async Task sendInmationToUrl(string roomUrl, string sendMsg)
        {
            // ConnectInfo.Client.PostAsync(roomUrl,)
            var buffer = Encoding.UTF8.GetBytes(sendMsg);
            var byteContent = new ByteArrayContent(buffer);
            await BaseInfomation.Client.PostAsync(roomUrl, byteContent);
        }

    }
}
