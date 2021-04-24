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
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Net.WebSockets;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleAppOtherFunc
{
    class WechatWebStartup
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

        const int webWsSize = 1024 * 3;
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            // app.Run()
            app.Map("/wechatWeb", WebF);

        }
        static string AppID = "";
        static string GetAppID()
        {
            if (String.IsNullOrEmpty(AppID))
            {
                var rootPath = System.IO.Directory.GetCurrentDirectory();
                var path = $"{rootPath}\\config\\appid.txt";
                AppID = File.ReadAllText(path).Trim();
            }
            return AppID;
        }
        static string SecretString = "";
        static string GetSecret()
        {
            if (String.IsNullOrEmpty(SecretString))
            {
                var rootPath = System.IO.Directory.GetCurrentDirectory();
                var path = $"{rootPath}\\config\\secret.txt";
                SecretString = File.ReadAllText(path).Trim();
            }
            return SecretString;
        }
        static string GetPrivateCode()
        {
            return GetSecret() + "12345";
        }
        private static void WebF(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                var code = context.Request.Query["code"];
                Console.WriteLine($"code:{code}");

                var state = context.Request.Query["state"];
                Console.WriteLine($"state:{state}");

                string result = "";
                string address = "";
                using (var httpClient = new HttpClient())
                {

                    var url = new Uri($"https://api.weixin.qq.com/sns/oauth2/access_token?appid={GetAppID()}&secret={GetSecret()}&code={code}&grant_type=authorization_code");
                    var response = httpClient.GetAsync(url).Result;
                    var data = response.Content.ReadAsStringAsync().Result;
                    Console.WriteLine($"{url.AbsolutePath}");
                    Console.WriteLine($"{data}");
                    //"openid":"
                    if (data.Contains("\"openid\":\""))
                    {
                        var tr = Newtonsoft.Json.JsonConvert.DeserializeObject<TokenResult>(data);
                        Console.WriteLine($"openid:{tr.openid}");
                        result = BitCoin.PrivateKeyF.getPrivateByString(DateTime.Now.ToString("yyyy-MM-dd") + tr.openid + GetPrivateCode(), out address);
                        DalOfAddress.MoneyAdd.AddMoney(address, 300000, tr.openid, DateTime.Now);
                    }
                }
                await context.Response.WriteAsync($"{result}");
            });
        }
        class TokenResult
        {
            public string access_token { get; set; }
            public string expires_in { get; set; }
            public string refresh_token { get; set; }
            public string openid { get; set; }
            public string scope { get; set; }
        }
        //private void WebF(IApplicationBuilder obj)
        //{

        //    // throw new NotImplementedException();
        //}
    }
}
