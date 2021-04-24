using CommonClass;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TcpFunction
{
    public class WithResponse
    {
        public static string SendInmationToUrlAndGetRes(string roomUrl, string sendMsg)
        {

            var startTime = DateTime.Now;
            string result = "";

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
                    //  Common.CheckBeforeReadReason reason;
                    var length = Common.ReceiveLength(ns);
                    if (sendData.Length == length) { }
                    else
                    {
                        var msg = $"sendData.Length ({sendData.Length})!= length({length})";
                        Console.WriteLine(msg);
                        throw new Exception(msg);
                    }
                    //  Common.CheckBeforeSend(ns);
                    ns.Write(sendData, 0, sendData.Length);

                    var length2 = Common.ReceiveLength(ns);
                    Common.SendLength(length2, ns);

                    byte[] bytes = new byte[length2];
                    int bytesRead = ns.Read(bytes, 0, length2);

                    result = Encoding.UTF8.GetString(bytes, 0, bytesRead);
                    ns.Close(4000);
                }
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
                TcpClient client = server.AcceptTcpClient();
                {
                    Console.WriteLine("Connected!");
                    //   bool isRight;
                    NetworkStream ns = client.GetStream();

                    GetMsg01(client, ns, out notifyJson);
                    var outPut = await dealWith(notifyJson);
                    GetMsg02(client, ns, outPut);
                    ns.Close(4000);
                }
                client.Close();
            }
        }

        private static void GetMsg02(TcpClient client, NetworkStream ns, string outPut)
        {
            var sendData = Encoding.UTF8.GetBytes(outPut);
            Common.SendLength(sendData.Length, ns);
            var length2 = Common.ReceiveLength(ns);
            if (length2 != sendData.Length)
            {
                var msg = $"length2({length2})!= sendData.Length({sendData.Length})";
                Console.WriteLine(msg);
                throw new Exception(msg);
            }
            ns.Write(sendData, 0, sendData.Length);
        }

        private static void GetMsg01(TcpClient client, NetworkStream ns, out string notifyJson)
        {
            var length = Common.ReceiveLength(ns);


            Common.SendLength(length, ns);
            byte[] bytes = new byte[length];


            int bytesRead = ns.Read(bytes, 0, length);
            if (length != bytesRead)
            {
                throw new Exception("length != bytesRead");
            }
            notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);
        }
    }

    public class WithoutResponse
    {
        public static void SendInmationToUrl(string controllerUrl, string json)
        {

            //   Let’s use that to filter the records returned using the netstat command - netstat - ano | findstr 185.190.83.2
            Console.WriteLine($"controllerUrl:{controllerUrl}");
            Console.WriteLine($"json:{json}");
            try
            {
                string server = controllerUrl.Split(':')[0];
                Int32 port = int.Parse(controllerUrl.Split(':')[1]);
                TcpClient client = new TcpClient(server, port);
                if (client.Connected) { }
                else
                {
                    Console.WriteLine($"{controllerUrl},没有连接！");
                    return;
                }
                NetworkStream ns = client.GetStream();
                var sendData = Encoding.UTF8.GetBytes(json);
                Common.SendLength(sendData.Length, ns);
                var length = Common.ReceiveLength(ns);
                if (length == sendData.Length) { }
                else
                {
                    var msg = $"length:({length})!= sendData.Length({sendData.Length})";
                    Console.WriteLine(msg);
                    //throw new Exception($"length:({length})!= sendData.Length({sendData.Length})");
                    throw new Exception(msg);
                }
                ns.Write(sendData, 0, sendData.Length);

                ns.Close(4000);
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
                        Console.WriteLine("Connected!");
                        SetMsgAndIsRight smr = new SetMsgAndIsRight(SetMsgAndIsRightF);
                        GetMsg(client, smr, dealWith);

                    }
                    client.Close();
                }
                catch (SocketException e)
                {
                    Console.WriteLine("SocketException: {0}", e);
                }
            }
        }
        static void SetMsgAndIsRightF(string notifyJson, DealWith dealWith)
        {
            Console.WriteLine($"notify receive:{notifyJson}");
            dealWith(notifyJson);
        }

        delegate void SetMsgAndIsRight(string notifyJson, DealWith dealWith);
        private static void GetMsg(TcpClient client, SetMsgAndIsRight smr, DealWith dealWith)
        {
            NetworkStream stream = client.GetStream();
            var length = Common.ReceiveLength(stream);

            Common.SendLength(length, stream);

            byte[] bytes = new byte[length];

            int bytesRead = stream.Read(bytes, 0, length);

            var notifyJson = Encoding.UTF8.GetString(bytes, 0, bytesRead);

            smr(notifyJson, dealWith);
            stream.Close(4000);
        }
    }
    class Common
    {

        public static int ReceiveLength(NetworkStream ns)
        {
            byte[] bytes = new byte[4];
            int bytesRead = ns.Read(bytes, 0, 4);
            var length = bytes[0] * 256 * 256 * 256 + bytes[1] * 256 * 256 + bytes[2] * 256 + bytes[3] * 1;
            return length;
        }
        public static void SendLength(int length, NetworkStream ns)
        {
            var sendDataPreviw = new byte[]
            {
                Convert.ToByte((length>>24)%256),
                Convert.ToByte((length>>16)%256),
                Convert.ToByte((length>>8)%256),
                Convert.ToByte((length>>0)%256),
            };
            ns.Write(sendDataPreviw, 0, 4);
        }
    }
}

