using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;

namespace ConsoleTestAPP.TestTag
{
    public class PromoteIsNotEnoughThenReturn
    {
        public static async void Test(string command)
        {
            Console.WriteLine("测试名称：" + command);
            Console.WriteLine("测试目的：在寻找能力提升宝石过程中，其里程不够时，自动返回");
            Console.WriteLine("          确保整个过程金钱流正确");
            Console.WriteLine("测试前提：此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("测试前提：此过程模拟两个用户");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();

            var url = "http://127.0.0.1:11100" + "/notify";
            var checkUrl = "http://127.0.0.1:11100" + "/monitor";
            var startTime = DateTime.Now;

            //主角是 378f53292e97bf6383f01bbbceb7b50a carA

            Common.awaitF(114151, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"FromUrl\":\"http://127.0.0.1:11001/notify\",\"RoomIndex\":0,\"Check\":\"b64d3ba6aa518d71c779888694b01ee4\",\"WebSocketID\":1,\"PlayerName\":\"测试玩家A\",\"CarsNames\":[\"A车1,\",\"A车2,\",\"A车3,\",\"A车4,\",\"A车5,\"],\"c\":\"PlayerAdd\"}");

            //Thread th = new Thread(() => CheckF(startTime));
            //th.Start();

            Common.awaitF(119112, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"c\":\"GetPosition\"}");

            Common.awaitF(121590, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"FromUrl\":\"http://127.0.0.1:11001/notify\",\"RoomIndex\":0,\"Check\":\"074079b9038c5ffc9eff963115c59590\",\"WebSocketID\":2,\"PlayerName\":\"测试玩家B\",\"CarsNames\":[\"B车1,\",\"B车2,\",\"B车3,\",\"B车4,\",\"B车5,\"],\"c\":\"PlayerAdd\"}");

            Common.awaitF(126563, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"c\":\"GetPosition\"}");

            Common.awaitF(155320, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"speed\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(159571, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(195875, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"volume\",\"car\":\"carC\",\"c\":\"SetPromote\"}");

            Common.awaitF(214370, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(225803, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(232507, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(355207, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(360239, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(403747, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"mile\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(421218, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(550500, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(563540, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"mile\",\"car\":\"carC\",\"c\":\"SetPromote\"}");

            Common.awaitF(694994, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(701536, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"mile\",\"car\":\"carE\",\"c\":\"SetPromote\"}");

            Common.awaitF(759980, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(771216, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"speed\",\"car\":\"carD\",\"c\":\"SetPromote\"}");

            Common.awaitF(897145, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"business\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(903345, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"business\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(938643, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"business\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(946098, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"business\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(1046865, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"0bf1af6f9daa94cc8f87adb2a76284e5\",\"pType\":\"volume\",\"car\":\"carD\",\"c\":\"SetPromote\"}");

            Common.awaitF(1061000, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"378f53292e97bf6383f01bbbceb7b50a\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(1144068, startTime);
            var t1 = await Common.CheckPlayerCostBusiness(checkUrl, "378f53292e97bf6383f01bbbceb7b50a", "carA");
            Common.CheckResult(t1, "1000", command);
            t1 = await Common.CheckPlayersCarState(checkUrl, "378f53292e97bf6383f01bbbceb7b50a", "carA");
            Common.CheckResult(t1, "returning", command);

            Common.awaitF(1147102, startTime);
            t1 = await Common.CheckPlayersCarState(checkUrl, "378f53292e97bf6383f01bbbceb7b50a", "carA");
            Common.CheckResult(t1, "waitAtBaseStation", command);

            Console.WriteLine($"{command}测试通过！");
        }

        internal static async void Test2(string command)
        {
            Console.WriteLine("测试名称：" + command);
            Console.WriteLine("测试目的：在寻找能力提升宝石过程中，等待-收集金钱-其里程不够时，自动返回");
            Console.WriteLine("          确保整个过程金钱流正确");
            Console.WriteLine("测试前提：此次测试，需要确保先有1个用户网页登录");
            Console.WriteLine("测试前提：此过程模拟一个用户");
            Console.WriteLine("按任意键开始检测！");
            Console.ReadKey();

            var url = "http://127.0.0.1:11100" + "/notify";
            var checkUrl = "http://127.0.0.1:11100" + "/monitor";
            var startTime = DateTime.Now;

            Common.awaitF(42877, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"FromUrl\":\"http://127.0.0.1:11001/notify\",\"RoomIndex\":0,\"Check\":\"cd40e1bd64f735fea9c703516844a0d7\",\"WebSocketID\":100,\"PlayerName\":\"玩家测试\",\"CarsNames\":[\"车1,\",\"车2,\",\"车3,\",\"车4,\",\"车5,\"],\"c\":\"PlayerAdd\"}");

            Common.awaitF(47866, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"c\":\"GetPosition\"}");

            Thread th = new Thread(() => CheckF(startTime));
            th.Start();

            Common.awaitF(69984, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"volume\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(79622, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(109053, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carC\",\"c\":\"SetPromote\"}");

            Common.awaitF(114668, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carD\",\"c\":\"SetPromote\"}");

            Common.awaitF(134716, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(151916, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(209662, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"volume\",\"car\":\"carD\",\"c\":\"SetPromote\"}");

            Common.awaitF(320837, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"volume\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(344046, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(349651, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(464253, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(486440, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(633542, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(639847, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"speed\",\"car\":\"carC\",\"c\":\"SetPromote\"}");

            Common.awaitF(791087, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carB\",\"c\":\"SetPromote\"}");

            Common.awaitF(796364, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"mile\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(938819, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"business\",\"car\":\"carA\",\"c\":\"SetPromote\"}");

            Common.awaitF(945066, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"pType\":\"business\",\"car\":\"carC\",\"c\":\"SetPromote\"}");

            Common.awaitF(1060757, startTime);
            await Common.SendInfomation(url, "{\"Key\":\"7588fe8ba09a16188052b39f200cfd77\",\"cType\":\"findWork\",\"car\":\"carA\",\"c\":\"SetCollect\"}");

            Common.awaitF(1065213, startTime);
            var b = await Common.CheckPlayersCarState(checkUrl, "7588fe8ba09a16188052b39f200cfd77", "carA");
            Common.CheckResult(b, "returning", command);
            var cb = await Common.CheckPlayerCostBusiness(checkUrl, "7588fe8ba09a16188052b39f200cfd77", "carA");
            Common.CheckResult(cb, "1000", command);

            Common.awaitF(1072773, startTime);
            b = await Common.CheckPlayersCarState(checkUrl, "7588fe8ba09a16188052b39f200cfd77", "carA");
            Common.CheckResult(b, "waitAtBaseStation", command);
            cb = await Common.CheckPlayerCostBusiness(checkUrl, "7588fe8ba09a16188052b39f200cfd77", "carA");
            Common.CheckResult(cb, "0", command);

            Console.WriteLine($"{command}验证成功");
        }

        private static async void CheckF(DateTime startTime)
        {
            return;
            var checkUrl = "http://127.0.0.1:11100" + "/monitor";
            for (var i = 0; i < 30000000; i += 1000)
            {


                {
                    var key = "7588fe8ba09a16188052b39f200cfd77";
                    var car = "carA";
                    var b = await Common.CheckPlayersCarState(checkUrl, key, car);
                    var t = (DateTime.Now - startTime).TotalMilliseconds;
                    var cb = await Common.CheckPlayerCostBusiness(checkUrl, key, car);
                    var pm = await Common.CheckPlayerMoney(checkUrl, key);
                    //Common.PromoteDiamondCount(checkUrl,key,)
                    {

                        var itemData = $@"
┌────────────
│time-{t}
├────────────
│CarState-{b}
│CostBusiness-{cb}
│PlayerMoney-{pm}
└────────────

";
                        File.AppendAllText("F:\\work\\202101\\log.txt", itemData);

                        ;
                    }
                }
                Thread.Sleep(1500);
            }
        }

        //class 
    }
}
