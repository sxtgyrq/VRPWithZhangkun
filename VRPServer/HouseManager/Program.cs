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
            var version = "1.0.0";
            Console.WriteLine($"版本号：{version}");

            Program.startTime = DateTime.Now;
            namal();
            startTaskForAwait();
            BaseInfomation.rm = new RoomMain();

            {
                var ip = "127.0.0.1";
                int tcpPort = 11100;

                Console.WriteLine($"输入ip,如“{ip}”");
                var inputIp = Console.ReadLine();
                if (string.IsNullOrEmpty(inputIp)) { }
                else
                {
                    ip = inputIp;
                }

                Console.WriteLine($"输入端口≠15000,如“{tcpPort}”");
                var inputWebsocketPort = Console.ReadLine();
                if (string.IsNullOrEmpty(inputWebsocketPort)) { }
                else
                {
                    int num;
                    if (int.TryParse(inputWebsocketPort, out num))
                    {
                        tcpPort = num;
                    }
                }


                Data.SetRootPath();

                Thread startTcpServer = new Thread(() => Listen.IpAndPort(ip, tcpPort));
                startTcpServer.Start();

                Thread startMonitorTcpServer = new Thread(() => Listen.IpAndPortMonitor(ip, 30000 - tcpPort));
                startMonitorTcpServer.Start();

                Thread th = new Thread(() => PlayersSysOperate());
                th.Start();
                //int tcpServerPort = 30000 - websocketPort;
                //ConnectInfo.HostIP = ip;
                //ConnectInfo.webSocketPort = websocketPort;
                //ConnectInfo.tcpServerPort = tcpServerPort;
            }
            while (true)
            {
                if (Console.ReadLine().ToLower() == "exit")
                {
                    break;
                }
            }
            //Console.WriteLine("你好！此服务为网页端的webSocket服务！");
            //var ip = "http://127.0.0.1:11100";
            //Console.WriteLine($"输入ip和端口如“{ip}”");
            //var inputIp = Console.ReadLine();
            //// return;
            //if (string.IsNullOrEmpty(inputIp)) { }
            //else
            //{
            //    ip = inputIp;
            //}
            ////ConnectInfo.ConnectedInfo = ip;
            //CreateWebHostBuilder(new string[] { ip }).Build().Run();

            //Thread th = new Thread(() => ClearPlayers());
            //th.Start();
            //  Console.WriteLine("Hello World!");
        }

        static int count = 0;
        private static void PlayersSysOperate()
        {
            while (true)
            {
                count++;
                Thread.Sleep(60 * 1000);
                BaseInfomation.rm.SetReturn();
                BaseInfomation.rm.ClearPlayers();
                BaseInfomation.rm.UpdatePlayerFatigueDegree();
                //BaseInfomation.rm.GetTax();
            }
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
