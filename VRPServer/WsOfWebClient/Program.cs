using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using System;

namespace WsOfWebClient
{
    class Program
    {

        static void Main(string[] args)
        {
            Console.WriteLine("你好！此服务为网页端的webSocket服务！");
            var ip = "http://127.0.0.1:11001";
            Console.WriteLine($"输入ip和端口如“{ip}”");
            var inputIp = Console.ReadLine();
            if (string.IsNullOrEmpty(inputIp)) { }
            else
            {
                ip = inputIp;
            }
            ConnectInfo.ConnectedInfo = ip;
            CreateWebHostBuilder(new string[] { ip }).Build().Run();

            Console.WriteLine("Hello World!");
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
