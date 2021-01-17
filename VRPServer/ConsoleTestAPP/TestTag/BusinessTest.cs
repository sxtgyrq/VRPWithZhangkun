using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace ConsoleTestAPP.TestTag
{
    class BusinessTest
    {
        internal static async void TestWaitThenReturn(string command)
        {
            // Thread.CurrentThread.Name = "TestWaitThenReturn";
            //throw new NotImplementedException();
            Console.WriteLine($"测试名称：{command}");
            Console.WriteLine("测试目的：确保领取任务提升点--失败-成功-返回中状态正确");
            Console.WriteLine("          确保整个过程金钱流正确");
            Console.WriteLine("测试前提：此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("          此次测试，random(seed),其中seed==0，此条件需要在HouseManager中设置");
            Console.WriteLine("          再此过程中会模拟两个用户");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();

            var url = "127.0.0.1:11100";
            var checkUrl= "127.0.0.1:18900";
            var startTime = DateTime.Now;



            Common.awaitF(0, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"33957cbff3b0ae1e24a6576f218044d8\",\"FromUrl\":\"127.0.0.1:18999\",\"RoomIndex\":0,\"Check\":\"bce78a07f4ebcfa74ed59ab47f9dc1fe\",\"WebSocketID\":30,\"PlayerName\":\"测试玩家1\",\"CarsNames\":[\"车1,\",\"车2,\",\"车3,\",\"车4,\",\"车5,\"],\"c\":\"PlayerAdd\"}");

            Common.awaitF(3735, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"8e8092f61e69c07a8699001cc85c270a\",\"FromUrl\":\"127.0.0.1:18999\",\"RoomIndex\":0,\"Check\":\"c8eb80950b82f8e7242fa3cd0b13aa46\",\"WebSocketID\":40,\"PlayerName\":\"测试玩家2\",\"CarsNames\":[\"车1,\",\"车2,\",\"车3,\",\"车4,\",\"车5,\"],\"c\":\"PlayerAdd\"}");

            Common.awaitF(5544, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"33957cbff3b0ae1e24a6576f218044d8\",\"c\":\"GetPosition\"}");

            Common.awaitF(9291, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"8e8092f61e69c07a8699001cc85c270a\",\"c\":\"GetPosition\"}");



            Common.awaitF(41603, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"8e8092f61e69c07a8699001cc85c270a\",\"pType\":\"business\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(43749, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"33957cbff3b0ae1e24a6576f218044d8\",\"pType\":\"business\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(164897, startTime);
            var t1 = await Common.CheckPlayersCarState(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Common.CheckResult(t1, "waitOnRoad", command);

            Common.awaitF(168897, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"8e8092f61e69c07a8699001cc85c270a\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(172014, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Common.CheckResult(t1, "buying", command);

            t1 = await Common.CheckPlayerCostBusiness(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Console.WriteLine($"buying-{t1}");
            Common.CheckResult(t1, "1000", command);

            Common.awaitF(192151, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Common.CheckResult(t1, "returning", command);

            t1 = await Common.CheckPlayerCostBusiness(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Console.WriteLine($"returning-{t1}");
            Common.CheckResult(t1, "0", command);

            Common.awaitF(297500, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Common.CheckResult(t1, "waitAtBaseStation", command);

            //  Common.awaitF(297500, startTime);
            t1 = await Common.CheckPlayerMoney(checkUrl, "33957cbff3b0ae1e24a6576f218044d8");
            Console.WriteLine("校验第一个人的钱");
            Common.CheckResult(t1, "49000", command);
            //  Console.WriteLine($"t1:{t1}");

            t1 = await Common.CheckPlayerMoney(checkUrl, "8e8092f61e69c07a8699001cc85c270a");
            Console.WriteLine("校验第二个人的钱");
            Common.CheckResult(t1, "49000", command);
            // Console.WriteLine($"t1:{t1}");

            t1 = await Common.CheckPlayerCostBusiness(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            Common.CheckResult(t1, "0", command);

            t1 = await Common.CheckPlayerCostBusiness(checkUrl, "33957cbff3b0ae1e24a6576f218044d8", "carA");
            Common.CheckResult(t1, "0", command);

            //t1 = await Common.CheckPlayersCarState(checkUrl, "33957cbff3b0ae1e24a6576f218044d8", "carA");
            //Console.WriteLine($"t1:{t1}");

            //t1 = await Common.CheckPlayersCarState(checkUrl, "8e8092f61e69c07a8699001cc85c270a", "carA");
            //Console.WriteLine($"t1:{t1}");
        }

        private static async void CheckF(DateTime startTime)
        {
            var checkUrl= "127.0.0.1:18900";
            for (var i = 0; i < 300000; i += 1000)
            {


                {
                    var key = "8e8092f61e69c07a8699001cc85c270a";
                    var car = "carA";
                    var b = await Common.CheckPlayersCarState(checkUrl, key, car);

                    if (b == "returning")
                    {
                        var t = (DateTime.Now - startTime).TotalMilliseconds;
                        Console.WriteLine($@"
key-{key}
car-{car}
CostBusiness-{b}   
time-{t}
");
                        break;
                    }
                }
                Thread.Sleep(1000);
            }
        }
    }
}
