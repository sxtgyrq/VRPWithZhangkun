using System;
using System.Threading;

namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello VRP");
            Console.WriteLine("输入任意键继续！");
            var select = Console.ReadLine();

            Thread th1 = new Thread(() => namal(select));
        }

        static void namal(string select)
        {
            var data = new Data();
            data.LoadRoad(select);


            //var gn = Newtonsoft.Json.JsonConvert.DeserializeObject<ConsoleModel.GetNext>(c.JsonValue);
            //CityRunBussinessManager.WalkInTheMapManager.GetData gd = new CityRunBussinessManager.WalkInTheMapManager.GetData(data.GetData);
            //var selectionResult = CityRunBussinessManager.WalkInTheMapManager.GetJson("HOVJWHHYZE", 22, 0.85075103125604468, gd);

            //Console.WriteLine($"{selectionResult.Length}");
            //  return selectionResult;
            //Console.WriteLine("请输入IP");
            //var ip = Console.ReadLine();
            var ip = data.IP;
            var s = new Server.ServerStart(ip, 9760);
            s.StartListener(ref data);
        }
    }
}
