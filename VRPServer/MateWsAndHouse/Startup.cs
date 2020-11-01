using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MateWsAndHouse
{
    class Startup
    {
        /*
         * 单用户web端单人点击单人--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 返回 房间号
         * 单用户web端单人点击组队--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 创建队伍->等待队伍加入-->返回房间号
         * 单用户web端单人点击加入--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 创建队伍->等待队伍加入-->返回房间号
         */

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
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {

            app.Map("/single", single);
            app.Map("/createTeam", createTeam);

            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //app.UseWebSockets();
            //// app.useSt(); // For the wwwroot folder
            ////app.UseStaticFiles(new StaticFileOptions
            ////{
            ////    FileProvider = new PhysicalFileProvider(
            ////"F:\\MyProject\\VRPWithZhangkun\\MainApp\\VRPWithZhangkun\\VRPServer\\WebApp\\webHtml"),
            ////    RequestPath = "/StaticFiles"
            ////});

            ////app.Map("/postinfo", HandleMapdownload);
            //var webSocketOptions = new WebSocketOptions()
            //{
            //    KeepAliveInterval = TimeSpan.FromSeconds(60000 * 1000),
            //    ReceiveBufferSize = 1024 * 1000
            //};
            //app.UseWebSockets(webSocketOptions);
            ////  app.Map("/websocket", WebSocket);


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
            //app.Map()
        }

        private void single(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                var fromUrl = context.Request.Form["fromUrl"];
                var wsocketID = context.Request.Form["wsocketID"];
                int roomNum = 0;

                var result = new { ok = "ok" };
                await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(result));

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    command = "single",
                    wsocketID = wsocketID,
                    roomNum = roomNum
                });
                await sendMsg(fromUrl, json);
                // HttpClient hc= new HttpClient(ne)
                //if (context.WebSockets.IsWebSocketRequest)
                //{

                //    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                //    //Task task = new Task(() => SendMsg(webSocket));
                //    //task.Start();
                //    // BufferImage.webSockets.Add(webSocket);
                //    await Echo(webSocket);
                //    //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");


                //}
            });
        }

        private void createTeam(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                var fromUrl = context.Request.Form["fromUrl"].ToString();
                var wsocketID = context.Request.Form["wsocketID"].ToString();
                int teamID = 0;

                var result = new { ok = "ok" };
                await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(result));

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    command = "createTeam",
                    wsocketID = wsocketID,
                    teamID = teamID
                });
                await sendMsg(fromUrl, json);
                // HttpClient hc= new HttpClient(ne)
                //if (context.WebSockets.IsWebSocketRequest)
                //{

                //    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                //    //Task task = new Task(() => SendMsg(webSocket));
                //    //task.Start();
                //    // BufferImage.webSockets.Add(webSocket);
                //    await Echo(webSocket);
                //    //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");


                //}
            });
        }

        private static async Task sendMsg(Microsoft.Extensions.Primitives.StringValues fromUrl, string json)
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
                if (result.IsSuccessStatusCode)
                {
                    //    response = result.StatusCode.ToString();
                }
                else
                {
                    Console.WriteLine($"{fromUrl}推送失败！");
                }
            }
        }

        //private void sendMsg(Microsoft.Extensions.Primitives.StringValues fromUrl, string json)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
