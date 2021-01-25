using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace TcpFunction
{
    public class WithResponse
    {
        public static async Task<string> SendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {
            var startTime = DateTime.Now;
            string result;
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
                            await ns.WriteAsync(sendData, 0, sendData.Length);

                            var length2 = await Common.ReceiveLength(ns);
                            await Common.SendLength(length2, ns);
                            byte[] bytes = new byte[length2];
                            int bytesRead = await ns.ReadAsync(bytes);

                            if (length2 != bytesRead)
                            {
                                throw new Exception("");
                            }
                            result = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                            await Common.SendEnd(ns);

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
                    using (NetworkStream stream = client.GetStream())
                    {

                        var length = await Common.ReceiveLength(stream);
                        await Common.SendLength(length, stream);
                        byte[] bytes = new byte[length];
                        int bytesRead = await stream.ReadAsync(bytes);

                        if (length != bytesRead)
                        {
                            throw new Exception("length != bytesRead");
                        }
                        notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                        var outPut = await dealWith(notifyJson);
                        {
                            var sendData = Encoding.UTF8.GetBytes(outPut);
                            await Common.SendLength(sendData.Length, stream);
                            var length2 = await Common.ReceiveLength(stream);
                            if (length2 != sendData.Length)
                            {
                                var msg = $"length2({length2})!= sendData.Length({sendData.Length})";
                                Console.WriteLine(msg);
                                throw new Exception(msg);
                            }
                            await stream.WriteAsync(sendData, 0, sendData.Length);
                            await Common.ReveiveEnd(stream);
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

            //  string result;
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
                                await Common.ReveiveEnd(ns);
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

                            await Common.SendEnd(stream);
                            //  var md5Received = CommonClass.Random.GetMD5HashByteFromBytes(bytes);

                            //   await stream.WriteAsync(byteMd5, 0, 1);
                            //for (var i = 0; i < md5Received.Length; i++)
                            //{
                            //    byte[] byteMd5 = new byte[1]
                            //    {
                            //        md5Received[i]
                            //    };
                            //    await stream.WriteAsync(byteMd5, 0, 1);
                            //    // stream.
                            //}
                            // byte[] bytes = new byte[length];
                            //await Common.SendEnd(stream);
                            //int k = 0;
                            //k++;
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
                await dealWith(notifyJson);
            }
        }
    }


    class Common
    {
        public static async Task<int> ReceiveLength(NetworkStream ns)
        {
            byte[] bytes = new byte[4];
            int bytesRead = await ns.ReadAsync(bytes);
            var length = bytes[0] * 256 * 256 * 256 + bytes[1] * 256 * 256 + bytes[2] * 256 + bytes[3] * 1;
            return length;
        }


        public static async Task SendLength(int length, NetworkStream ns)
        {
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

            byte[] bytes = new byte[0];
            int bytesRead = await ns.ReadAsync(bytes);
            return bytesRead == 0;
        }

        //     const byte endByte = 255;
        internal static async Task SendEnd(NetworkStream stream)
        {
            var sendDataPreviw = new byte[] { };
            await stream.WriteAsync(sendDataPreviw, 0, 0);
        }
    }
}
