using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using System;
using System.Threading;

namespace Server
{
    public class Program
    {
        public static Data dt;
        static void Main(string[] args)
        {
            Console.WriteLine("Hello VRP");
            Console.WriteLine("输入任意键继续！");
            var select = Console.ReadLine();

            //Thread th1 = new Thread(() => namal(select));
            //th1.Start();
            namal(select);
            CreateWebHostBuilder(new string[] { "http://127.0.0.1:9760" }).Build().Run();
        }

        static void namal(string select)
        {
            Program.dt = new Data();
            Program.dt.LoadRoad(select); 
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
