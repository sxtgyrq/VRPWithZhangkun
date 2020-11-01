using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using System;

namespace MateWsAndHouse
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("你好！此服务为匹配用户和房间的服务！");
            var ip = "http://127.0.0.1:11000";
            Console.WriteLine("输入ip和端口");
            CreateWebHostBuilder(new string[] { "http://127.0.0.1:9760" }).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args).Configure(item => item.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    })).UseKestrel(options =>
    {
        options.AllowSynchronousIO = true;
    })
    .UseUrls(args[0])
        .UseStartup<Startup>();
    }
}
