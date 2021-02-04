using CommonClass;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TcpFunction
{
    public class WithResponse
    {
        public static async Task<string> SendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            var startTime = DateTime.Now;
            string result = "";
            bool isRight = true;
            for (var kk = 0; kk < 100000; kk++)
            {
                using (TcpClient tc = new TcpClient())
                {
                    IPAddress ipa;
                    if (IPAddress.TryParse(roomUrl.Split(':')[0], out ipa))
                    {
                        await tc.ConnectAsync(ipa, int.Parse(roomUrl.Split(':')[1]));
                        if (tc.Connected)
                        {
                            using (var ns = tc.GetStream())
                            {
                                var sendData = Encoding.UTF8.GetBytes(sendMsg);
                                await Common.SendLength(sendData.Length, ns);

                                var length = await Common.ReceiveLength(ns);
                                if (sendData.Length == length) { }
                                else
                                {
                                    var msg = $"sendData.Length ({sendData.Length})!= length({length})";
                                    Console.WriteLine(msg);
                                    throw new Exception(msg);
                                }
                                Common.CheckBeforeSend(ns);
                                await ns.WriteAsync(sendData, 0, sendData.Length);

                                var md5Return = await Common.ReveiveMd5(ns);
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
                                    await Common.SendWrong(ns);
                                    await Common.ReveiveEnd(ns);
                                }
                                // await Common.SendDataMd5(sendData, ns);
                                //var md5Return = await Common.ReveiveMd5(ns);
                                //var md5Cal = CommonClass.Random.GetMD5HashByteFromBytes(sendData);

                                //bool isRight = true;
                                //for (var j = 0; j < 16; j++)
                                //{
                                //    if (md5Return[j] == md5Cal[j]) { }
                                //    else
                                //    {
                                //        isRight = false;
                                //        break;
                                //    }
                                //}
                                if (isRight)
                                {
                                    await Common.SendRight(ns);

                                    var length2 = await Common.ReceiveLength(ns);
                                    await Common.SendLength(length2, ns);
                                    byte[] bytes = new byte[length2];
                                    Common.CheckBeforeRead(ns);
                                    int bytesRead = await ns.ReadAsync(bytes);

                                    if (length2 != bytesRead)
                                    {
                                        throw new Exception("");
                                    } 
                                    await Common.SendDataMd5(bytes, ns);
                                    isRight = await Common.ReveiveRight(ns);

                                    if (isRight)
                                    {
                                        result = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                                        //await Common.SendEnd(ns);
                                    }
                                    await Common.SendEnd(ns);
                                }
                                else
                                {
                                    await Common.SendWrong(ns);
                                    await Common.ReveiveEnd(ns);
                                }




                                ns.Close();
                            }
                        }
                        else
                        {
                            result = $"{roomUrl}连接失败！";
                            Console.WriteLine("result");
                        }
                    }
                    else
                    {
                        result = $"{roomUrl}格式错误失败！";
                        Console.WriteLine("result");
                        throw new Exception($"{result}");
                    }
                    tc.Client.Dispose();
                    tc.Client.Close();
                    tc.Close();
                }
                if (isRight)
                {
                    break;
                }
                else
                {
                    Console.WriteLine("md5校验失败");
                    Console.ReadLine();
                }
            }
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
                using (TcpClient client = server.AcceptTcpClient())
                {
                    Console.WriteLine("Connected!");
                    bool isRight;
                    using (NetworkStream stream = client.GetStream())
                    {

                        var length = await Common.ReceiveLength(stream);


                        await Common.SendLength(length, stream);
                        //stream.

                        Common.CheckBeforeRead(stream);
                        byte[] bytes = new byte[length];
                        int bytesRead = await stream.ReadAsync(bytes);

                        if (length != bytesRead)
                        {
                            throw new Exception("length != bytesRead");
                        }

                        await Common.SendDataMd5(bytes, stream);

                        isRight = await Common.ReveiveRight(stream);

                        if (isRight)
                        {
                            notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                            var outPut = await dealWith(notifyJson);

                            var sendData = Encoding.UTF8.GetBytes(outPut);
                            await Common.SendLength(sendData.Length, stream);
                            var length2 = await Common.ReceiveLength(stream);
                            if (length2 != sendData.Length)
                            {
                                var msg = $"length2({length2})!= sendData.Length({sendData.Length})";
                                Console.WriteLine(msg);
                                throw new Exception(msg);
                            }
                            Common.CheckBeforeSend(stream);
                            await stream.WriteAsync(sendData, 0, sendData.Length);
                            // stream.CanRead
                            var md5Return = await Common.ReveiveMd5(stream);
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
                                await Common.SendRight(stream);
                            }
                            else
                            {
                                await Common.SendWrong(stream);
                            }
                            await Common.ReveiveEnd(stream);
                        }
                        else
                        {
                            await Common.SendEnd(stream);
                        }
                        stream.Close();
                    }
                    client.Client.Dispose();
                    client.Client.Close();
                    client.Close();
                }
            }
        }
    }

    public class WithoutResponse
    {
        public static async Task SendInmationToUrl(string controllerUrl, string json)
        {
            //   Let’s use that to filter the records returned using the netstat command - netstat - ano | findstr 185.190.83.2
            Console.WriteLine($"controllerUrl:{controllerUrl}");
            Console.WriteLine($"json:{json}");
            for (var i = 0; i < 10000; i++)
            {
                bool isRight = true;
                using (TcpClient tc = new TcpClient())
                {
                    IPAddress ipa;
                    if (IPAddress.TryParse(controllerUrl.Split(':')[0], out ipa))
                    {
                        await tc.ConnectAsync(ipa, int.Parse(controllerUrl.Split(':')[1]));
                        if (tc.Connected)
                        {
                            using (var ns = tc.GetStream())
                            {
                                {
                                    var sendData = Encoding.UTF8.GetBytes(json);
                                    await Common.SendLength(sendData.Length, ns);
                                    var length = await Common.ReceiveLength(ns);
                                    if (length == sendData.Length) { }
                                    else
                                    {
                                        throw new Exception($"length:({length})!= sendData.Length({sendData.Length})");
                                    }

                                    await ns.WriteAsync(sendData, 0, sendData.Length);
                                    var md5Return = new byte[16];
                                    await ns.ReadAsync(md5Return, 0, 16);
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
                                        await Common.SendRight(ns);
                                    }
                                    else
                                    {
                                        await Common.SendWrong(ns);
                                    }
                                    await Common.ReveiveEnd(ns);
                                    //var md5 = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
                                    //await ns.WriteAsync(md5,0, sendData.Length);
                                }
                                ns.Close();
                            }
                        }
                        else
                        {
                            Console.WriteLine($"{controllerUrl}-连接失败！！！");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"{controllerUrl} 有问题！");
                    }
                    tc.Client.Dispose();
                    tc.Client.Close();
                    tc.Close();
                }
                if (isRight)
                {
                    break;
                }
                else
                {
                    Console.WriteLine($"传输数据校验失败,输入任意键继续。");
                    Console.ReadKey();
                }
            }


            //  string result;

        }

        public delegate Task DealWith(string notifyJson);
        public static async void startTcp(string ip, int port, DealWith dealWith)
        {
            // throw new NotImplementedException();
            // Int32 port = port;
            IPAddress localAddr = IPAddress.Parse(ip);
            var server = new TcpListener(localAddr, port);
            server.Start();
            while (true)
            {
                Console.Write("Waiting for a connection... ");

                string notifyJson;
                bool isRight;
                using (TcpClient client = server.AcceptTcpClient())
                {

                    Console.WriteLine("Connected!");


                    using (NetworkStream stream = client.GetStream())
                    {
                        //  do
                        {
                            var length = await Common.ReceiveLength(stream);
                            await Common.SendLength(length, stream);

                            byte[] bytes = new byte[length];
                            int bytesRead = await stream.ReadAsync(bytes);
                            // Console.WriteLine($"receive:{returnResult.result}");

                            notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);

                            var md5Respon = CommonClass.Random.GetMD5HashByteFromBytes(bytes);
                            await stream.WriteAsync(md5Respon, 0, 16);

                            isRight = await Common.ReveiveRight(stream);

                            await Common.SendEnd(stream);
                        }
                        //  while (!await Common.ReveiveEnd(stream));

                        stream.Close();
                    }
                    client.Client.Dispose();
                    client.Client.Close();
                    client.Close();
                }
                //  client.Client.
                Console.WriteLine($"notify receive:{notifyJson}");
                if (isRight)
                {
                    await dealWith(notifyJson);
                }
            }
        }
    }


    class Common
    {
        public static async Task<int> ReceiveLength(NetworkStream ns)
        {

            // while (true)

            {
                if (CheckBeforeRead(ns)) { }
                {
                    byte[] bytes = new byte[4];
                    int bytesRead = await ns.ReadAsync(bytes);
                    var length = bytes[0] * 256 * 256 * 256 + bytes[1] * 256 * 256 + bytes[2] * 256 + bytes[3] * 1;
                    return length;
                }
            }
        }
        public static bool CheckBeforeSend(NetworkStream ns)
        {
            int k = 0;
            while (true)
            {
                if (ns.CanWrite)
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
                    throw new Exception("等待10s没响应！");
                }
            }
            return true;
        }

        public static bool CheckBeforeRead(NetworkStream ns)
        {
            int k = 0;
            while (true)
            {
                if (ns.CanRead)
                {
                    break;
                }
                else
                {
                    k++;
                    Thread.Sleep(1);
                }
                if (k >= 10000)
                {
                    throw new Exception("等待10s没响应！");
                }
            }
            return true;
        }


        public static async Task SendLength(int length, NetworkStream ns)
        {
            if (CheckBeforeSend(ns)) { }
            var sendDataPreviw = new byte[]
            {
                Convert.ToByte((length>>24)%256),
                Convert.ToByte((length>>16)%256),
                Convert.ToByte((length>>8)%256),
                Convert.ToByte((length>>0)%256),
            };
            await ns.WriteAsync(sendDataPreviw, 0, 4);
        }

        internal static async Task<bool> ReveiveEnd(NetworkStream ns)
        {
            CheckBeforeRead(ns);
            byte[] bytes = new byte[3];
            int bytesRead = await ns.ReadAsync(bytes);
            return bytesRead == 3;
        }

        //     const byte endByte = 255;
        internal static async Task SendEnd(NetworkStream stream)
        {
            CheckBeforeSend(stream);
            var sendDataPreviw = new byte[] { (byte)0, (byte)255, (byte)255 };
            await stream.WriteAsync(sendDataPreviw, 0, 3);
        }

        internal static async Task SendRight(NetworkStream stream)
        {
            CheckBeforeSend(stream);
            var sendDataPreviw = new byte[] { (byte)129 };
            await stream.WriteAsync(sendDataPreviw, 0, 1);
        }
        internal static async Task SendWrong(NetworkStream stream)
        {
            CheckBeforeSend(stream);
            var sendDataPreviw = new byte[] { (byte)130 };
            await stream.WriteAsync(sendDataPreviw, 0, 1);
        }

        internal static async Task<bool> ReveiveRight(NetworkStream ns)
        {
            CheckBeforeRead(ns);

            byte[] bytes = new byte[1];
            int bytesRead = await ns.ReadAsync(bytes);
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
                throw new Exception($"传输一个字节{bytes[0]}也报错？");
            }
        }

        internal static async Task<byte[]> ReveiveMd5(NetworkStream ns)
        {
            Common.CheckBeforeRead(ns);
            var md5Return = new byte[16];
            await ns.ReadAsync(md5Return, 0, 16);
            return md5Return;
        }

        internal static async Task SendDataMd5(byte[] sendData, NetworkStream ns)
        {
            Common.CheckBeforeSend(ns);
            var md5 = CommonClass.Random.GetMD5HashByteFromBytes(sendData);
            await ns.WriteAsync(md5, 0, 16);
        }
    }
}
