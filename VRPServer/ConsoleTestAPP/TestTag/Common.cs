using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleTestAPP.TestTag
{
    public class Common
    {
        public static async Task<string> CheckPlayerMoney(string checkUrl, string key)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPlayersMoney\"}}");
            return t1;
        }
        public static async Task<string> CheckPlayerCarPurpose(string checkUrl, string key, string car)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPlayerCarPuporse\",\"car\":\"{car}\"}}");
            return t1;
        }
        public static async Task<string> CheckPlayersCarState(string checkUrl, string key, string car)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPlayersCarState\",\"car\":\"{car}\"}}");
            return t1;
        }
        public static async Task<string> CheckPlayerCostBusiness(string checkUrl, string key, string car)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPlayerCostBusiness\",\"Car\":\"{car}\"}}");
            return t1;
        }
        public static async Task<string> CheckPlayerCostVolume(string checkUrl, string key, string car)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPlayerCostVolume\",\"Car\":\"{car}\"}}");
            return t1;
        }
        internal static void awaitF(int stopMs)
        {
            stopMs = Math.Max(1, stopMs);
            Thread.Sleep(stopMs);
        }

        internal static void awaitF(int stopMs, DateTime startTime)
        {
            var awaitT = stopMs - Convert.ToInt32((DateTime.Now - startTime).TotalMilliseconds);

            awaitT = Math.Max(1, awaitT);
            int length = 0;
            while (awaitT > 0)
            {
                var msg = $"请等待{awaitT}毫秒";
                Console.WriteLine(msg);
                length = msg.Length;
                Thread.Sleep(Math.Min(100, awaitT));
                Console.SetCursorPosition(0, Console.CursorTop - 1);
                ClearCurrentConsoleLine();
                awaitT -= 100;
            }
        }
        public static void ClearCurrentConsoleLine()
        {
            int currentLineCursor = Console.CursorTop;
            Console.SetCursorPosition(0, Console.CursorTop);
            Console.Write(new string(' ', Console.WindowWidth));
            Console.SetCursorPosition(0, currentLineCursor);
        }

        public static async Task<string> SendInfomation(string url, string json)
        {
            return await sendInmationToUrlAndGetRes(url, json);
        }
        static async Task<string> sendInfomation(string url, string json)
        {
            //stopMs = Math.Max(1, stopMs);
            //Thread.Sleep(stopMs);
            return await sendInmationToUrlAndGetRes(url, json);
            // throw new System.NotImplementedException();
        }

        internal static void CheckResult(string t1, string v, string testName)
        {
            if (t1 == v) { }
            else
            {
                Console.WriteLine($"{testName}测试失败");
                while (true)
                    Thread.Sleep(24 * 3600 * 1000);
            }
        }
        const int serverWsSize = 1024 * 1024 * 20;
        // static Dictionary<string, ClientWebSocket> _sockets = new Dictionary<string, ClientWebSocket>();
        static async Task<string> sendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            return await TcpFunction.WithResponse.SendInmationToUrlAndGetRes(roomUrl, sendMsg);
            // await  
        }
        internal static async Task<string> PromoteDiamondCount(string checkUrl, string key, string pType)
        {
            var t1 = await sendInfomation(checkUrl, $"{{\"Key\":\"{key}\",\"c\":\"CheckPromoteDiamondCount\",\"pType\":\"{pType}\"}}");
            return t1;
        }
    }
}
