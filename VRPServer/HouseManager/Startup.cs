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
