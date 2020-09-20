using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace Server
{
    class ServerStart
    {
        TcpListener server = null;
        public ServerStart(string ip, int port)
        {
            IPAddress localAddr = IPAddress.Parse(ip);
            server = new TcpListener(localAddr, port);
            server.Start();
            //StartListener();
        }

        public void StartListener(ref Data data)
        {
            try
            {
                while (true)
                {
                    Console.WriteLine($"{Thread.CurrentThread.Name}-{DateTime.Now.ToString("yyyy-MM-dd")}:Waiting for a connection...");
                    using (TcpClient client = server.AcceptTcpClient())
                    {
                        Console.WriteLine($"{Thread.CurrentThread.Name}-{DateTime.Now.ToString("yyyy-MM-dd")}:Connected!");

                        using (var stream = client.GetStream())
                        {
                            try
                            {
                                Byte[] bytes = new Byte[2 * 1024 * 1024];//2M

                                stream.Read(bytes, 0, bytes.Length);

                                var ss = System.Text.Encoding.UTF8.GetString(bytes);

                                var result = dealWithMsg(ss, ref data);
                                string str = result.Trim();
                                Byte[] reply = System.Text.Encoding.UTF8.GetBytes(str);
                                stream.Write(reply, 0, reply.Length);
                            }
                            catch
                            {

                            }
                        }

                        // s.Read()



                    }

                }
            }
            catch (SocketException e)
            {
                Console.WriteLine("SocketException: {0}", e);
                server.Stop();
            }
        }

        private string dealWithMsg(string ss, ref Data data)
        {
            try
            {
                var c = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.Command>(ss);
                switch (c.Type)
                {
                    case "GetCountOfFP":
                        {

                            //获取商店的数量
                            var count = data.Get61Fp();
                            var countOfFP = new { Count = count };
                            var selectionResult = Newtonsoft.Json.JsonConvert.SerializeObject(countOfFP);
                            return selectionResult;
                        }; break;
                    case "GetFPOnlyByIndex":
                        {
                            var gi = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.GetByIndex>(c.JsonValue);

                            var fp = data.GetFpByIndex(gi.IndexValule);
                            if (fp != null)
                                return Newtonsoft.Json.JsonConvert.SerializeObject(new { fp = fp });
                        }; break;
                    case "AToB":
                        {
                            //4s  373209M
                            var fpID1 = Convert.ToString(c.JsonValue.Substring(0, 10));
                            var fpID2 = Convert.ToString(c.JsonValue.Substring(10, 10));
                            return data.GetAFromB(fpID1, fpID2);
                        }; break;

                    case "FirstIndex":
                        {
                            throw new Exception("");
                            // return data.FirstIndex();
                        }
                    case "Refresh":
                        {
                            throw new Exception("");
                            //return data.Refresh();
                        }; break;

                }
                return "";
            }
            catch
            {
                Console.WriteLine($"{ss}_执行没结果");
                return "";
            }
            //  throw new NotImplementedException();
        }
    }
}
