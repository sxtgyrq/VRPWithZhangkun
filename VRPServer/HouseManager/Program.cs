using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using System;
using System.Threading;

namespace HouseManager
{
    class Program
    {
        public static DateTime startTime;
        public static Data dt;
        public static bool Debug = false;
        static void Main(string[] args)
        {
            Program.startTime = DateTime.Now;
            namal();
            startTaskForAwait();
            BaseInfomation.rm = new RoomMain();
            Console.WriteLine("你好！此服务为网页端的webSocket服务！");
            var ip = "http://127.0.0.1:11100";
            Console.WriteLine($"输入ip和端口如“{ip}”");
            var inputIp = Console.ReadLine();
            // return;
            if (string.IsNullOrEmpty(inputIp)) { }
            else
            {
                ip = inputIp;
            }
            //ConnectInfo.ConnectedInfo = ip;
            CreateWebHostBuilder(new string[] { ip }).Build().Run();

            Thread th = new Thread(() => ClearPlayers());
            th.Start();
            //  Console.WriteLine("Hello World!");
        }

        private static void ClearPlayers()
        {
            Thread.Sleep(30 * 1000);
            BaseInfomation.rm.ClearPlayers();
            throw new NotImplementedException();
        }

        static void startTaskForAwait()
        {
            //Thread t=new Thread()
        }
        static void namal()
        {
            Program.dt = new Data();
            Program.dt.LoadRoad();
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
