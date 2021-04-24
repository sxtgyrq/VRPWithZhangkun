using System;
using System.Threading.Tasks;

namespace HouseManagerController
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("你好，测试员");
            Console.WriteLine("劳烦您输入Monitor地址");
            string url = Console.ReadLine();

            Console.WriteLine("输入命令");
            var command = Console.ReadLine();

            while (true)
            {
                if (command.ToLower() == "exit")
                {
                    break;
                }
                var result = sendInmationToUrlAndGetRes(url, command);
                Console.WriteLine(result);
                command = Console.ReadLine();

            }
        }

        public static async Task<string> sendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            return await Task.Run(() => TcpFunction.WithResponse.SendInmationToUrlAndGetRes(roomUrl, sendMsg));
        }
    }
}
