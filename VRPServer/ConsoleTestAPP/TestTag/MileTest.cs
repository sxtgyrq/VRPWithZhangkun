using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleTestAPP.TestTag
{
    class MileTest
    {
        internal static async void TestReturn()
        {
            //throw new NotImplementedException();
            Console.WriteLine("测试目的，确保领取任务提升点-成功-返回中状态正确");
            Console.WriteLine("此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();
            var url = "http://127.0.0.1:11100" + "/notify";

            var startTime = DateTime.Now;
            await sendInfomation(0, url, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"FromUrl\":\"http://127.0.0.1:11001/notify\",\"RoomIndex\":0,\"Check\":\"5c23c4d349559a9e99d3f3df4e3282ed\",\"WebSocketID\":1,\"PlayerName\":\"玩家1\",\"CarsNames\":[\"车1,\",\"车2,\",\"车3,\",\"车4,\",\"车5,\"],\"c\":\"PlayerAdd\"}");

            await sendInfomation(1000 - Convert.ToInt32((DateTime.Now - startTime).TotalMilliseconds), url, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"c\":\"GetPosition\"}");
            await sendInfomation(2000 - Convert.ToInt32((DateTime.Now - startTime).TotalMilliseconds), url, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"pType\":\"mile\",\"car\":\"carD\",\"c\":\"SetPromote\"}");
        }
        private static async Task sendInfomation(int stopMs, string url, string json)
        {
            stopMs = Math.Max(1, stopMs);
            Thread.Sleep(stopMs);
            await sendInmationToUrlAndGetRes(url, json);
            // throw new System.NotImplementedException();
        }

        public static async Task sendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            // ConnectInfo.Client.PostAsync(roomUrl,)
            using (HttpClient Client = new HttpClient())
            {

                var buffer = Encoding.UTF8.GetBytes(sendMsg);
                var byteContent = new ByteArrayContent(buffer);
                var response = await Client.PostAsync(roomUrl, byteContent);
                await response.Content.ReadAsStringAsync();
            }
        }
    }
}
