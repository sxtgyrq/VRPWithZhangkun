using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
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
            services.Configure<FormOptions>(config =>
            {
                config.MultipartBodyLengthLimit = UInt32.MaxValue / 2;
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

                    var t = Convert.ToInt64((DateTime.Now - Program.startTime).TotalMilliseconds);

                    Console.WriteLine($"notify receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "PlayerAdd":
                            {
                                CommonClass.PlayerAdd addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd>(notifyJson);
                                var result = await BaseInfomation.rm.AddPlayer(addItem);
                                await context.Response.WriteAsync(result);
                            }; break;
                        case "PlayerCheck":
                            {
                                CommonClass.PlayerCheck checkItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerCheck>(notifyJson);
                                var result = await BaseInfomation.rm.UpdatePlayer(checkItem);
                                await context.Response.WriteAsync(result);
                            }; break;
                        case "Map":
                            {
                                CommonClass.Map map = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Map>(notifyJson);
                                switch (map.DataType)
                                {
                                    case "All":
                                        {
                                            //    public void getAll(out List<double[]> meshPoints, out List<object> listOfCrosses)
                                            List<double[]> meshPoints;
                                            List<object> listOfCrosses;
                                            Program.dt.getAll(out meshPoints, out listOfCrosses);
                                            var json = Newtonsoft.Json.JsonConvert.SerializeObject(new { meshPoints = meshPoints, listOfCrosses = listOfCrosses });
                                            await context.Response.WriteAsync(json);
                                        }; break;
                                }
                            }; break;
                        case "GetPosition":
                            {
                                CommonClass.GetPosition getPosition = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.GetPosition>(notifyJson);
                                string fromUrl;
                                int webSocketID;
                                Model.FastonPosition fp;
                                string[] carsNames;
                                List<string> notifyMsgs;
                                if (BaseInfomation.rm.GetPosition(getPosition, out fromUrl, out webSocketID, out fp, out carsNames, out notifyMsgs))
                                {
                                    CommonClass.GetPositionNotify notify = new CommonClass.GetPositionNotify()
                                    {
                                        c = "GetPositionNotify",
                                        fp = fp,
                                        WebSocketID = webSocketID,
                                        carsNames = carsNames,
                                        key = getPosition.Key
                                        // var xx=  getPosition.Key
                                    };

                                    await sendMsg(fromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                                }
                                for (var i = 0; i < notifyMsgs.Count; i += 2)
                                {
                                    await sendMsg(notifyMsgs[i], notifyMsgs[i + 1]);
                                }
                                await context.Response.WriteAsync("ok");
                            }; break;
                        case "FinishTask":
                            {

                            }; break;
                        case "SetPromote":
                            {
                                CommonClass.SetPromote sp = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetPromote>(notifyJson);
                                var result = await BaseInfomation.rm.updatePromote(sp);
                                await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetCollect":
                            {
                                CommonClass.SetCollect sc = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetCollect>(notifyJson);
                                var result = await BaseInfomation.rm.updateCollect(sc);
                                await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetAttack":
                            {
                                CommonClass.SetAttack sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetAttack>(notifyJson);
                                var result = await BaseInfomation.rm.updateAttack(sa);
                                await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetTax":
                            {
                                CommonClass.SetTax st = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetTax>(notifyJson);
                                var result = await BaseInfomation.rm.updateTax(st);
                                await context.Response.WriteAsync("ok");
                            }; break;
                    }
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

        //private static async Task sendInmationToUrl(string roomUrl, string sendMsg)
        //{
        //    // ConnectInfo.Client.PostAsync(roomUrl,)
        //    var buffer = Encoding.UTF8.GetBytes(sendMsg);
        //    var byteContent = new ByteArrayContent(buffer);
        //    await BaseInfomation.Client.PostAsync(roomUrl, byteContent);
        //}

        public static async Task sendMsg(Microsoft.Extensions.Primitives.StringValues fromUrl, string json)
        {
            using (HttpClient client = new HttpClient())
            {
                Uri u = new Uri(fromUrl);
                HttpContent c = new StringContent(json, Encoding.UTF8, "application/json");
                HttpRequestMessage request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = u,
                    Content = c
                };
                HttpResponseMessage result = await client.SendAsync(request);
                //   BaseInfomation.Client.
                if (result.IsSuccessStatusCode)
                {
                    //    response = result.StatusCode.ToString();
                }
                else
                {
                    Console.WriteLine($"{fromUrl}推送失败！");
                }
                client.Dispose();
            }
        }


    }
}
