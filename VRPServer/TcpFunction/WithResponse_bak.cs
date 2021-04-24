using CommonClass;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TcpFunction2
{
    public class WithResponse
    {
        public static string SendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            int count = 0;
            return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
        }



        static string SendInmationToUrlAndGetRes(string roomUrl, string sendMsg, int count)
        {
            if (count >= 10)
            {
                Console.WriteLine($"roomUrl:{roomUrl}");
                Console.WriteLine($"sendMsg:{sendMsg}");
                Console.WriteLine($"以上消息没有发送出去");
                Console.ReadLine();
            }

            var startTime = DateTime.Now;
            string result = "";
            bool isRight = true;

            IPAddress ipa;
            if (IPAddress.TryParse(roomUrl.Split(':')[0], out ipa))
            {
                TcpClient tc = new TcpClient();
                tc.Connect(ipa, int.Parse(roomUrl.Split(':')[1]));
                if (tc.Connected)
                {
                    NetworkStream ns = tc.GetStream();
                    var sendData = Encoding.UTF8.GetBytes(sendMsg);
                    Common.SendLength(sendData.Length, ns);
                    Common.CheckBeforeReadReason reason;
                    var length = Common.ReceiveLength(ns, out reason);

                    if (reason == Common.CheckBeforeReadReason.Ok) { }
                    else
                    {
                        ns.Close();
                        tc.Close();
                        count++;
                        return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                    }

                    if (sendData.Length == length) { }
                    else
                    {
                        var msg = $"sendData.Length ({sendData.Length})!= length({length})";
                        Console.WriteLine(msg);

                        ns.Close();
                        tc.Close();
                        count++;
                        return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                    }
                    //  Common.CheckBeforeSend(ns);
                    ns.Write(sendData, 0, sendData.Length);

                    var md5Return = Common.ReveiveMd5(ns);
                    var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
                    for (var j = 0; j < 16; j++)
                    {
                        if (md5Return[j] == md5Cal[j]) { }
                        else
                        {
                            isRight = false;
                            break;
                        }
                    }
                    if (isRight) { }
                    else
                    {
                        ns.Close();
                        tc.Close();
                        count++;
                        return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                        //Common.SendWrong(ns);
                        //Common.ReveiveEnd(ns);
                    }

                    if (isRight)
                    {
                        Common.SendRight(ns);

                        var length2 = Common.ReceiveLength(ns, out reason);

                        if (reason == Common.CheckBeforeReadReason.Ok) { }
                        else
                        {
                            ns.Close();
                            tc.Close();
                            count++;
                            return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                        }

                        Common.SendLength(length2, ns);
                        byte[] bytes = new byte[length2];

                        Common.CheckBeforeRead(ns, out reason);

                        if (reason == Common.CheckBeforeReadReason.Ok) { }
                        else
                        {
                            ns.Close();
                            tc.Close();
                            count++;
                            return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                        }

                        int bytesRead = ns.Read(bytes, 0, length2);

                        if (length2 != bytesRead)
                        {
                            ns.Close();
                            tc.Close();
                            count++;
                            return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                        }
                        Common.SendDataMd5(bytes, ns);
                        isRight = Common.ReveiveRight(ns);

                        if (isRight)
                        {
                            result = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                            //await Common.SendEnd(ns);
                        }
                        else
                        {
                            ns.Close(2000);
                            tc.Close();
                            count++;
                            return SendInmationToUrlAndGetRes(roomUrl, sendMsg, count);
                        }
                        Common.SendEnd(ns);
                    }
                    //else
                    //{
                    //    Common.SendWrong(ns);
                    //    Common.ReveiveEnd(ns);
                    //}
                    ns.Close(2000);
                }
                tc.Close();
            }
            //for (var kk = 0; kk < 100000; kk++)
            //{
            //    //TcpClient tc = new TcpClient();
            //    using (TcpClient tc = new TcpClient())
            //    {
            //        IPAddress ipa;
            //        if (IPAddress.TryParse(roomUrl.Split(':')[0], out ipa))
            //        {
            //            await tc.ConnectAsync(ipa, int.Parse(roomUrl.Split(':')[1]));
            //            if (tc.Connected)
            //            {
            //                using (var ns = tc.GetStream())
            //                {
            //                    var sendData = Encoding.UTF8.GetBytes(sendMsg);
            //                    await Common.SendLength(sendData.Length, ns);

            //                    var length = Common.ReceiveLength(ns);
            //                    if (sendData.Length == length) { }
            //                    else
            //                    {
            //                        var msg = $"sendData.Length ({sendData.Length})!= length({length})";
            //                        Console.WriteLine(msg);
            //                        throw new Exception(msg);
            //                    }
            //                    Common.CheckBeforeSend(ns);
            //                    await ns.WriteAsync(sendData, 0, sendData.Length);

            //                    var md5Return = await Common.ReveiveMd5(ns);
            //                    var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
            //                    for (var j = 0; j < 16; j++)
            //                    {
            //                        if (md5Return[j] == md5Cal[j]) { }
            //                        else
            //                        {
            //                            isRight = false;
            //                            break;
            //                        }
            //                    }
            //                    if (isRight) { }
            //                    else
            //                    {
            //                        await Common.SendWrong(ns);
            //                        await Common.ReveiveEnd(ns);
            //                    }
            //                    // await Common.SendDataMd5(sendData, ns);
            //                    //var md5Return = await Common.ReveiveMd5(ns);
            //                    //var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);

            //                    //bool isRight = true;
            //                    //for (var j = 0; j < 16; j++)
            //                    //{
            //                    //    if (md5Return[j] == md5Cal[j]) { }
            //                    //    else
            //                    //    {
            //                    //        isRight = false;
            //                    //        break;
            //                    //    }
            //                    //}
            //                    if (isRight)
            //                    {
            //                        await Common.SendRight(ns);

            //                        var length2 = Common.ReceiveLength(ns);
            //                        await Common.SendLength(length2, ns);
            //                        byte[] bytes = new byte[length2];
            //                        Common.CheckBeforeRead(ns);
            //                        int bytesRead = await ns.ReadAsync(bytes);

            //                        if (length2 != bytesRead)
            //                        {
            //                            throw new Exception("");
            //                        }
            //                        await Common.SendDataMd5(bytes, ns);
            //                        isRight = await Common.ReveiveRight(ns);

            //                        if (isRight)
            //                        {
            //                            result = Encoding.UTF8.GetString(bytes, 0, bytesRead);
            //                            //await Common.SendEnd(ns);
            //                        }
            //                        await Common.SendEnd(ns);
            //                    }
            //                    else
            //                    {
            //                        await Common.SendWrong(ns);
            //                        await Common.ReveiveEnd(ns);
            //                    }
            //                }
            //            }
            //            else
            //            {
            //                result = $"{roomUrl}连接失败！";
            //                Console.WriteLine("result");
            //            }
            //        }
            //        else
            //        {
            //            result = $"{roomUrl}格式错误失败！";
            //            Console.WriteLine("result");
            //            throw new Exception($"{result}");
            //        }

            //        //tc.Client.Dispose();
            //        //tc.Client.Close();
            //        //tc.Close();
            //    }
            //    if (isRight)
            //    {
            //        //Thread Th = new Thread(() => CloseTcp(tc));
            //        break;
            //    }
            //    else
            //    {
            //        Console.WriteLine("md5校验失败");
            //        Console.ReadLine();
            //    }
            //}
            var endTime = DateTime.Now;
            Console.WriteLine($"------------------------------------");
            Console.WriteLine($"{sendMsg}响应时间：{(endTime - startTime).TotalSeconds}秒");
            Console.WriteLine($"------------------------------------");
            return result;
        }


        public delegate Task<string> DealWith(string notifyJson);
        public static async void ListenIpAndPort(string hostIP, int tcpPort, DealWith dealWith)
        {
            Int32 port = tcpPort;
            IPAddress localAddr = IPAddress.Parse(hostIP);
            var server = new TcpListener(localAddr, port);
            server.Start();
            while (true)
            {
                Console.Write("Waiting for a connection... ");

                string notifyJson;
                TcpClient client = server.AcceptTcpClient();
                {
                    Console.WriteLine("Connected!");
                    //   bool isRight;
                    NetworkStream ns = client.GetStream();
                    // using (NetworkStream stream = client.GetStream())
                    {
                        bool doNext;
                        GetMsg01(client, ns, out notifyJson, out doNext);
                        if (doNext)
                        {
                            ns.Close(2000);
                            client.Close();
                            continue;
                        }
                        else
                        {
                            var outPut = await dealWith(notifyJson);
                            GetMsg02(client, ns, outPut, out doNext);
                            if (doNext)
                            {
                                ns.Close(2000);
                                client.Close();
                                continue;
                            }
                        }
                        // Common.CheckBeforeReadReason reason;

                    }
                    ns.Close(2000);
                }
                client.Close();
            }
        }

        private static void GetMsg02(TcpClient client, NetworkStream ns, string outPut, out bool doNext)
        {
            bool isRight = true;
            Common.CheckBeforeReadReason reason;
            var sendData = Encoding.UTF8.GetBytes(outPut);
            Common.SendLength(sendData.Length, ns);
            var length2 = Common.ReceiveLength(ns, out reason);

            if (reason == Common.CheckBeforeReadReason.Ok) { }
            else
            {
                doNext = true;
                return;
            }

            if (length2 != sendData.Length)
            {
                var msg = $"length2({length2})!= sendData.Length({sendData.Length})";
                Console.WriteLine(msg);
                if (reason == Common.CheckBeforeReadReason.Ok) { }
                else
                {
                    doNext = true;
                    return;
                }
            }
            ns.Write(sendData, 0, sendData.Length);
            var md5Return = Common.ReveiveMd5(ns);
            var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);

            for (int i = 0; i < 16; i++)
            {
                if (md5Return[i] == md5Cal[i]) { }
                else
                {
                    isRight = false;
                    break;
                }
            }
            if (isRight)
            {
                Common.SendRight(ns);
            }
            else
            {
                doNext = true;
                return;
                // Common.SendWrong(ns);
            }
            Common.ReveiveEnd(ns);
            doNext = false;
        }

        private static void GetMsg01(TcpClient client, NetworkStream ns, out string notifyJson, out bool doNext)
        {
            // ;
            bool isRight;
            Common.CheckBeforeReadReason reason;
            var length = Common.ReceiveLength(ns, out reason);

            if (reason == Common.CheckBeforeReadReason.Ok) { }
            else
            {
                notifyJson = null;
                doNext = true;
                return;
            }


            Common.SendLength(length, ns);
            byte[] bytes = new byte[length];
            Common.CheckBeforeRead(ns, out reason);
            if (reason == Common.CheckBeforeReadReason.Ok) { }
            else
            {
                notifyJson = null;
                doNext = true;
                return;
            }


            int bytesRead = ns.Read(bytes, 0, length);
            if (length != bytesRead)
            {
                throw new Exception("length != bytesRead");
            }
            Common.SendDataMd5(bytes, ns);
            isRight = Common.ReveiveRight(ns);
            if (isRight)
            {
                notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                doNext = false;
                return;
                //  var outPut = await dealWith(notifyJson);

            }
            else
            {
                notifyJson = null;
                doNext = true;
                return;
            }
        }
    }

    public class WithoutResponse
    {
        public static void SendInmationToUrl(string controllerUrl, string json)
        {
            int count = 0;
            SendInmationToUrl(controllerUrl, json, count);
        }
        static void SendInmationToUrl(string controllerUrl, string json, int count)
        {
            if (count > 10)
            {
#warning 这里做记录
                Console.WriteLine($"controllerUrl:{controllerUrl}");
                Console.WriteLine($"json:{json}");
                Console.WriteLine($"以上消息发送了10次，没发送出去！");
                return;
            }
            //   Let’s use that to filter the records returned using the netstat command - netstat - ano | findstr 185.190.83.2
            Console.WriteLine($"controllerUrl:{controllerUrl}");
            Console.WriteLine($"json:{json}");
            try
            {
                string server = controllerUrl.Split(':')[0];
                Int32 port = int.Parse(controllerUrl.Split(':')[1]);
                bool isRight = true;
                TcpClient client = new TcpClient(server, port);
                NetworkStream ns = client.GetStream();
                var sendData = Encoding.UTF8.GetBytes(json);
                Common.SendLength(sendData.Length, ns);
                Common.CheckBeforeReadReason Reason;
                var length = Common.ReceiveLength(ns, out Reason);
                if (Reason == Common.CheckBeforeReadReason.Ok)
                {

                }
                else
                {
                    ns.Close(2000);
                    client.Close();
                    count++;
                    SendInmationToUrl(controllerUrl, json, count);
                    return;
                }
                if (length == sendData.Length) { }
                else
                {
                    Console.WriteLine($"length:({length})!= sendData.Length({sendData.Length})");
                    //throw new Exception($"length:({length})!= sendData.Length({sendData.Length})");
                    ns.Close(2000);
                    client.Close();
                    count++;
                    SendInmationToUrl(controllerUrl, json, count);
                    return;
                }
                ns.Write(sendData, 0, sendData.Length);
                var md5Return = new byte[16];
                Common.CheckBeforeRead(ns, out Reason);

                if (Reason == Common.CheckBeforeReadReason.Ok)
                {
                }
                else
                {
                    ns.Close(2000);
                    client.Close();
                    count++;
                    SendInmationToUrl(controllerUrl, json, count);
                    return;
                }

                ns.Read(md5Return, 0, 16);
                var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
                for (var j = 0; j < 16; j++)
                {
                    if (md5Return[j] == md5Cal[j]) { }
                    else
                    {
                        isRight = false;
                        break;
                    }
                }
                Console.WriteLine($"结果{isRight}");
                if (isRight)
                {
                    Common.SendRight(ns);
                }
                else
                {
                    ns.Close(2000);
                    client.Close();
                    count++;
                    SendInmationToUrl(controllerUrl, json, count);
                    return;
                    // Common.SendWrong(ns);
                }
                Common.ReveiveEnd(ns);

                 ns.Close(2000);
                client.Close();
            }
            catch (ArgumentNullException e)
            {
                Console.WriteLine("ArgumentNullException: {0}", e);
            }
            catch (SocketException e)
            {
                Console.WriteLine("SocketException: {0}", e);
            }
            //for (var i = 0; i < 10000; i++)
            //{
            //    bool isRight = true;
            //    using (TcpClient tc = new TcpClient())
            //    {
            //        IPAddress ipa;
            //        if (IPAddress.TryParse(controllerUrl.Split(':')[0], out ipa))
            //        {
            //            await tc.ConnectAsync(ipa, int.Parse(controllerUrl.Split(':')[1]));
            //            if (tc.Connected)
            //            {
            //                AutoResetEvent allDone = new AutoResetEvent(false);
            //                using (var ns = tc.GetStream())
            //                {
            //                    {
            //                        var sendData = Encoding.UTF8.GetBytes(json);
            //                        await Common.SendLength(sendData.Length, ns);
            //                        var length = Common.ReceiveLength(ns);
            //                        if (length == sendData.Length) { }
            //                        else
            //                        {
            //                            throw new Exception($"length:({length})!= sendData.Length({sendData.Length})");
            //                        }

            //                        await ns.WriteAsync(sendData, 0, sendData.Length);
            //                        var md5Return = new byte[16];
            //                        await ns.ReadAsync(md5Return, 0, 16);
            //                        var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);

            //                        for (var j = 0; j < 16; j++)
            //                        {
            //                            if (md5Return[j] == md5Cal[j]) { }
            //                            else
            //                            {
            //                                isRight = false;
            //                                break;
            //                            }
            //                        }
            //                        Console.WriteLine($"结果{isRight}");
            //                        if (isRight)
            //                        {
            //                            await Common.SendRight(ns);
            //                        }
            //                        else
            //                        {
            //                            await Common.SendWrong(ns);
            //                        }
            //                        await Common.ReveiveEnd(ns);
            //                        Thread Th = new Thread(() => WaitT(allDone));
            //                        Th.Start();
            //                        allDone.WaitOne();
            //                        //Thread.Sleep(5 * 1000);
            //                        //var md5 = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
            //                        //await ns.WriteAsync(md5,0, sendData.Length);
            //                    }
            //                }
            //            }
            //            else
            //            {
            //                Console.WriteLine($"{controllerUrl}-连接失败！！！");
            //            }
            //        }
            //        else
            //        {
            //            Console.WriteLine($"{controllerUrl} 有问题！");
            //        }
            //    }
            //    if (isRight)
            //    {
            //        break;
            //    }
            //    else
            //    {
            //        Console.WriteLine($"传输数据校验失败,输入任意键继续。");
            //        Console.ReadKey();
            //    }
            //}


            //  string result;

        }
 

        public delegate Task DealWith(string notifyJson);
        public static void startTcp(string ip, int port, DealWith dealWith)
        {
            // throw new NotImplementedException();
            // Int32 port = port;
            IPAddress localAddr = IPAddress.Parse(ip);
            var server = new TcpListener(localAddr, port);
            server.Start();
            //AutoResetEvent allDone = new AutoResetEvent(false);
            while (true)
            {
                Console.Write("Waiting for a connection... ");


                //string notifyJson;
                //  bool isRight;
                try
                {
                    TcpClient client = server.AcceptTcpClient();
                    {
                        bool doNext;
                        Console.WriteLine("Connected!");
                        SetMsgAndIsRight smr = new SetMsgAndIsRight(SetMsgAndIsRightF);
                        GetMsg(client, smr, dealWith, out doNext);
                        if (doNext)
                        {
                            client.Close();
                            continue;
                        }
                    }
                    client.Close();
                }
                catch (SocketException e)
                {
                    Console.WriteLine("SocketException: {0}", e);
                }
            }
        } 
        static void SetMsgAndIsRightF(string notifyJson, bool isRight, DealWith dealWith)
        {
            Console.WriteLine($"notify receive:{notifyJson}");
            if (isRight)
            {

                Task.Run(() => dealWith(notifyJson));
            }
        }

        delegate void SetMsgAndIsRight(string notifyJson, bool isRight, DealWith dealWith);
        private static void GetMsg(TcpClient client, SetMsgAndIsRight smr, DealWith dealWith, out bool doNext)
        {
            NetworkStream stream = client.GetStream();
            {
                //  do
                {

                    Common.CheckBeforeReadReason reason;
                    var length = Common.ReceiveLength(stream, out reason);

                    if (reason == Common.CheckBeforeReadReason.Ok)
                    {

                    }
                    else
                    {
                        stream.Close();
                        doNext = true;
                        return;
                    }

                    Common.SendLength(length, stream);

                    byte[] bytes = new byte[length];
                    Common.CheckBeforeRead(stream, out reason);

                    if (reason == Common.CheckBeforeReadReason.Ok)
                    {

                    }
                    else
                    {
                        stream.Close();
                        doNext = true;
                        return;
                    }

                    int bytesRead = stream.Read(bytes, 0, length);
                    // Console.WriteLine($"receive:{returnResult.result}");

                    var notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);

                    var md5Respon = CommonClass.Random.GetMD5HashByteFromBytes(bytes);
                    stream.Write(md5Respon, 0, 16);

                    var isRight = Common.ReveiveRight(stream);
                    if (isRight)
                    {
                        Common.SendEnd(stream);
                    }
                    else
                    {
                        stream.Close();
                        doNext = true;
                        return;
                    }
                    doNext = false;
                    smr(notifyJson, isRight, dealWith);
                    stream.Close(2000);
                }
            }
        }
    }


    class Common
    {

        public static int ReceiveLength(NetworkStream ns, out CheckBeforeReadReason Reason)
        {

            // while (true)

            {
                CheckBeforeRead(ns, out Reason);

                {
                    byte[] bytes = new byte[4];
                    // ns.BeginRead(bytes, 0, 4, myReadCallBack, new PassObj() { ns = ns, allDone = allDone });

                    // ns.EndRead()
                    // ns.EndRead()
                    int bytesRead = ns.Read(bytes, 0, 4);
                    //  int bytesRead = await ns.ReadAsync(bytes);
                    var length = bytes[0] * 256 * 256 * 256 + bytes[1] * 256 * 256 + bytes[2] * 256 + bytes[3] * 1;
                    return length;
                }
            }
        }


        //public static bool CheckBeforeSend(NetworkStream ns)
        //{
        //    int k = 0;
        //    while (true)
        //    {
        //        if (ns.CanWrite)
        //        {
        //            break;
        //        }
        //        else
        //        {
        //            k++;
        //            Thread.Sleep(10);
        //        }
        //        if (k >= 1000)
        //        {
        //            throw new Exception("等待10s没响应！");
        //        }
        //    }
        //    return true;
        //}

        public enum CheckBeforeReadReason
        {
            Ok,
            OutTime
        }
        public static bool CheckBeforeRead(NetworkStream ns, out CheckBeforeReadReason Reason)
        {
            int k = 0;
            while (true)
            {
                if (ns.DataAvailable)
                {
                    break;
                }
                else
                {
                    k++;
                    Thread.Sleep(10);
                }
                if (k >= 1000)
                {
                    Reason = CheckBeforeReadReason.OutTime;
                    return false;
                    //throw new Exception("等待10s没响应！");
                }
            }
            Reason = CheckBeforeReadReason.Ok;
            return true;
        }


        public static void SendLength(int length, NetworkStream ns)
        {
            //if (CheckBeforeSend(ns)) { }
            var sendDataPreviw = new byte[]
            {
                Convert.ToByte((length>>24)%256),
                Convert.ToByte((length>>16)%256),
                Convert.ToByte((length>>8)%256),
                Convert.ToByte((length>>0)%256),
            };
            ns.Write(sendDataPreviw, 0, 4);
        }

        internal static bool ReveiveEnd(NetworkStream ns)
        {
            CheckBeforeReadReason Reason;
            CheckBeforeRead(ns, out Reason);
            byte[] bytes = new byte[3];
            int bytesRead = ns.Read(bytes, 0, 3);
            return bytesRead == 3;
        }

        //     const byte endByte = 255;
        internal static void SendEnd(NetworkStream stream)
        {
            //  CheckBeforeSend(stream);
            var sendDataPreviw = new byte[] { (byte)0, (byte)255, (byte)255 };
            stream.Write(sendDataPreviw, 0, 3);
        }

        internal static void SendRight(NetworkStream stream)
        {
            // CheckBeforeSend(stream);
            var sendDataPreviw = new byte[] { (byte)129 };
            stream.Write(sendDataPreviw, 0, 1);
        }
        internal static void SendWrong(NetworkStream stream)
        {
            var sendDataPreviw = new byte[] { (byte)130 };
            stream.Write(sendDataPreviw, 0, 1);
        }

        internal static bool ReveiveRight(NetworkStream ns)
        {
            CheckBeforeReadReason reason;
            CheckBeforeRead(ns, out reason);
            if (reason == CheckBeforeReadReason.Ok)
            {
                byte[] bytes = new byte[1];
                int bytesRead = ns.Read(bytes, 0, 1);
                if (bytes[0] == (byte)129)
                {
                    return true;
                }
                else if (bytes[0] == (byte)130)
                {
                    return false;
                }
                else
                {
                    return false;
                    //throw new Exception($"传输一个字节{bytes[0]}也报错？");
                }
            }
            else
            {
                return false;
            }

        }

        internal static byte[] ReveiveMd5(NetworkStream ns)
        {
            CheckBeforeReadReason reason;
            Common.CheckBeforeRead(ns, out reason);
            var md5Return = new byte[16];
            ns.Read(md5Return, 0, 16);
            return md5Return;
        }

        internal static void SendDataMd5(byte[] sendData, NetworkStream ns)
        {
            // Common.CheckBeforeSend(ns);
            var md5 = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
            ns.Write(md5, 0, 16);
            // await ns.WriteAsync(md5, 0, 16);
        }
    }
}

