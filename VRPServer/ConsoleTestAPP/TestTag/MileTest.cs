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
        internal static async void TestReturn(string command)
        {
            // Thread.CurrentThread.Name = "mile-testReturn";
            //throw new NotImplementedException();
            Console.WriteLine("测试名称：" + command);
            Console.WriteLine("测试目的：确保领取任务提升点-成功-返回中状态正确");
            Console.WriteLine("          确保整个过程金钱流正确");
            Console.WriteLine("测试前提：此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();

            var url = "127.0.0.1:11100";
            var checkUrl = "127.0.0.1:18900";
            var key = "ff0b0a5183da65771c530af40dd75217";
            var car = "carD";
            var startTime = DateTime.Now;
            //  var promoteType = "mile";


            await Common.SendInfomation(url, $"{{\"Key\":\"{key}\",\"FromUrl\":\"127.0.0.1:18999\",\"RoomIndex\":0,\"Check\":\"5c23c4d349559a9e99d3f3df4e3282ed\",\"WebSocketID\":10,\"PlayerName\":\"玩家1\",\"CarsNames\":[\"车1,\",\"车2,\",\"车3,\",\"车4,\",\"车5,\"],\"c\":\"PlayerAdd\"}}");
            {
                Common.awaitF(100 - Convert.ToInt32((DateTime.Now - startTime).TotalMilliseconds));
                var t1 = await Common.SendInfomation(checkUrl, $"{{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"c\":\"CheckPlayersCarState\",\"car\":\"{car}\"}}");
                Console.WriteLine($"t1:{t1}");
                Common.CheckResult(t1, "waitAtBaseStation", command);

                t1 = await Common.CheckPlayerMoney(checkUrl, key);
                Common.CheckResult(t1, "50000", command);

                t1 = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                Common.CheckResult(t1, "0", command);
            }


            Common.awaitF(1000, startTime);
            await Common.SendInfomation(url, $"{{\"Key\":\"{key}\",\"c\":\"GetPosition\"}}");

            Common.awaitF(2000, startTime);
            await Common.SendInfomation(url, $"{{\"Key\":\"{key}\",\"pType\":\"mile\",\"car\":\"{car}\",\"c\":\"SetPromote\"}}");

            // for (var i = 3; i < 1000; i++)
            {
                Common.awaitF(3 * 1000, startTime);
                var t1 = await Common.SendInfomation(checkUrl, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"c\":\"CheckPlayersCarState\",\"car\":\"carD\",}");
                Common.CheckResult(t1, "buying", command);

                t1 = await Common.CheckPlayerMoney(checkUrl, key);
                Common.CheckResult(t1, "49000", command);

                t1 = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                Common.CheckResult(t1, "1000", command);
            }
            {
                Common.awaitF(116 * 1000, startTime);
                var t1 = await Common.SendInfomation(checkUrl, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"c\":\"CheckPlayersCarState\",\"car\":\"carD\",}");
                Common.CheckResult(t1, "returning", command);

                t1 = await Common.CheckPlayerMoney(checkUrl, key);
                Common.CheckResult(t1, "49000", command);

                t1 = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                Common.CheckResult(t1, "0", command);
            }
            {
                Common.awaitF(229 * 1000, startTime);
                var t1 = await Common.SendInfomation(checkUrl, "{\"Key\":\"ff0b0a5183da65771c530af40dd75217\",\"c\":\"CheckPlayersCarState\",\"car\":\"carD\",}");
                Common.CheckResult(t1, "waitAtBaseStation", command);

                t1 = await Common.CheckPlayerMoney(checkUrl, key);
                Common.CheckResult(t1, "49000", command);

                t1 = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                Common.CheckResult(t1, "0", command);

                t1 = await Common.PromoteDiamondCount(checkUrl, key, "mile");
                Common.CheckResult(t1, "1", command);
            }
            Console.WriteLine("TestReturn测试成功！！！");
        } 

    }
}
