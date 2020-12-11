using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Test_HttpClientTest
{
    public class Startup
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
                    var text = getBodyStr(context);

                    //  int A = int.Parse(text);

                    Console.WriteLine($"notify receive:{text.Length}");
                    Thread.Sleep(1);
                    await context.Response.WriteAsync("");
                    // await sendMsg("http://127.0.0.1:11100/notify", A.ToString());

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
