using System;
using System.Threading;

namespace HouseManager2_0
{
    class Program
    {
        public static DateTime startTime;
        public static Data dt;
        public static bool Debug = false;
        public static Geometry.Boundary boundary;
        public static RoomMainF.RoomMain rm;
        static void Main(string[] args)
        {
            var version = "2.0.0";
            Console.WriteLine("Hello World!");
            Console.WriteLine($"版本号：{version}");
            Program.startTime = DateTime.Now;

            Program.boundary = new Geometry.Boundary();
            boundary.load();

            Program.dt = new Data();
            Program.dt.LoadRoad();

            Program.rm = new RoomMainF.RoomMain();

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
            // Console.ReadLine();

        }

        private static void PlayersSysOperate()
        {
            while (true)
            {
              
                rm.UpdatePlayerFatigueDegree(); 
              
                //  count++;
                Thread.Sleep(60 * 1000);


                rm.SetReturn();
                rm.ClearPlayers();

                //BaseInfomation.rm.GetTax();
            }
            //  throw new NotImplementedException();
        }
    }
}
