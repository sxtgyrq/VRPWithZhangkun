using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;

namespace ConsoleTestAPP.TestTag
{
    class PromoteCollectOK
    {
        public static async void Test(string command)
        {
            Console.WriteLine("测试名称：" + command);
            Console.WriteLine("测试目的：在寻找能力提升宝石过程中，保证其状态成功转为收集");
            Console.WriteLine("          确保整个过程状态、金钱流正确");
            Console.WriteLine("测试前提：此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("测试前提：此过程模拟一个用户");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();

            var url = "127.0.0.1:11100";
            var checkUrl= "127.0.0.1:18900";
            var startTime = DateTime.Now;

            //主角是 378f53292e97bf6383f01bbbceb7b50a carA


            Common.awaitF(23774, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"3ebd01689785d3b015f2c51c6094fbd1\",\"FromUrl\":\"127.0.0.1:18999\",\"RoomIndex\":0,\"Check\":\"14ed8f27298052b131183c42c7433ed0\",\"WebSocketID\":99,\"PlayerName\":\"测试玩家\",\"CarsNames\":[\"车A,\",\"车B,\",\"车C,\",\"车D,\",\"车E,\"],\"c\":\"PlayerAdd\"}");

            Common.awaitF(28180, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"3ebd01689785d3b015f2c51c6094fbd1\",\"c\":\"GetPosition\"}");

            //Thread th = new Thread(() => CheckF(startTime));
            //th.Start();
            Thread th = new Thread(() => CheckF(startTime));
            th.Start();

            Common.awaitF(29956, startTime);
            var t1 = await Common.CheckPlayersCarState(checkUrl, "3ebd01689785d3b015f2c51c6094fbd1", "carA");
            Common.CheckResult(t1, "waitAtBaseStation", command);

            Common.awaitF(41385, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"3ebd01689785d3b015f2c51c6094fbd1\",\"pType\":\"volume\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(44864, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"3ebd01689785d3b015f2c51c6094fbd1\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(45240, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "3ebd01689785d3b015f2c51c6094fbd1", "carA");
            Common.CheckResult(t1, "buying", command);

            Common.awaitF(66545, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "3ebd01689785d3b015f2c51c6094fbd1", "carA");
            Common.CheckResult(t1, "waitOnRoad", command);


            Common.awaitF(68586, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"3ebd01689785d3b015f2c51c6094fbd1\",\"cType\":\"findWork\",\"car\":\"carA\",\"c\":\"SetCollect\"}");

            Common.awaitF(174679, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "3ebd01689785d3b015f2c51c6094fbd1", "carA");
            Common.CheckResult(t1, "waitForCollectOrAttack", command);
            // Common.awaitF(66545, startTime);

            Console.WriteLine($"{command}检测成功！");

        }

        private static async void CheckF(DateTime startTime)
        {

            var checkUrl= "127.0.0.1:18900";
            for (var i = 0; i < 30000000; i += 1000)
            {


                {
                    var key = "3ebd01689785d3b015f2c51c6094fbd1";
                    var car = "carA";
                    var b = await Common.CheckPlayersCarState(checkUrl, key, car);
                    var t = (DateTime.Now - startTime).TotalMilliseconds;
                    var cb = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                    var pm = await Common.CheckPlayerMoney(checkUrl, key);
                    var purpose = await Common.CheckPlayerCarPurpose(checkUrl, key, car);
                    //   if (b == "waitForCollectOrAttack")
                    {

                        var itemData = $@"
┌────────────
│time={t}
├────────────
│CarState={b}
│PlayerMoney={pm}
│CostBusiness={cb}
│purpose={purpose}
└────────────

";
                        File.AppendAllText("F:\\work\\202101\\log.txt", itemData);
                        //  Console.WriteLine(itemData);
                        //break;
                        ;
                    }
                }
                Thread.Sleep(1500);
            }
        }
    }
}
