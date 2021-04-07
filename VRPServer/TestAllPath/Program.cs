using AllPathGenerator;
using HouseManager;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading;

namespace TestAllPath
{
    class Program
    {
        public static Data dt;
        static void Main(string[] args)
        {
            Console.WriteLine("此程序目的是校验所有的路径均能走！！！");
            Console.WriteLine("此程序目的是将运算结果压缩存储-最大存储单元2G！！！");

            Console.WriteLine("write or check  or mulThread?");
            Console.WriteLine("combine可以结合程序?");
            var select = Console.ReadLine();
            if (select.ToLower().Trim() == "write")
            {
                namal_write();
            }
            else if (select.ToLower().Trim() == "check")
            {
                namal_check();
            }
            else if (select.ToLower().Trim() == "testc")
            {
                testCompress();
            }
            else if (select.ToLower() == "combine")
            {
                Combine.DoCombine();
            }
            else if (select.ToLower() == "generatecontent")
            {
                Content.Generate();
                //  Combine.DoCombine();
            }
            else if (select.ToLower() == "multhread")
            {
                multhread_writeC.multhread_write();
            }
            Console.WriteLine("Hello World!");

            Console.ReadLine();
        }



        private static void testCompress()
        {
            string testStr = "";
            for (var i = 0; i < 10; i++)
            {
                Thread.Sleep(1);
                var itemData = DateTime.Now.ToString();
                Console.WriteLine($"{i}-{itemData}");
                testStr += CommonClass.Random.GetMD5HashFromStr(DateTime.Now.ToString());



            }
            var jsonData = Encoding.ASCII.GetBytes(testStr);
            Console.WriteLine($"压缩前md5{CommonClass.Random.GetMD5HashFromBytes(jsonData)}");
            var data = Compress(jsonData);
            var length = data.Length;

            var ucCompressData = Decompress(data, length);
            Console.WriteLine($"解压后md5{CommonClass.Random.GetMD5HashFromBytes(ucCompressData)}");
            var resultStr = Encoding.ASCII.GetString(ucCompressData);
            Console.WriteLine(resultStr);
            Console.ReadLine();

        }

        private static void namal_check()
        {
            //Program.dt = new Data();
            //Program.dt.LoadRoad();
            Check.CheckAll();
        }
        public class indexClass
        {
            public List<long> startIndexList { get; set; }
        }
        private static void namal()
        {
            Program.dt = new Data();
            Program.dt.LoadRoad();

            var count = Program.dt.Get61Fp();
            for (var i = 0; i < count; i++)
            {
                for (var j = 0; j < count; j++)
                {
                    if (i != j)
                    {
                        var fp1 = Program.dt.GetFpByIndex(i);
                        var fp2 = Program.dt.GetFpByIndex(j);
                        bool success;
                        var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID, out success);
                        if (success)
                        {
                            Console.WriteLine($"{i}-{j}计算成功！");
                        }
                        else
                        {
                            Console.WriteLine($"{i}-{j}计算错误！");
                            Console.ReadLine();
                        }
                    }
                }
            }

            Console.WriteLine($"计算完毕！");
        }

        private static void namal_write()
        {
            Program.dt = new Data();
            Program.dt.LoadRoad();
            long startIndex = 0;
            //  List<int> startIndexList = new List<int>();
            Console.WriteLine($"输入起始数字:");
            var start = int.Parse(Console.ReadLine());
            {
                var count = Program.dt.Get61Fp();
                for (var i = start; i < count; i++)
                {
                    //Dictionary<int, string> md5s = new Dictionary<int, string>();
                    for (var j = 0; j < count; j++)
                    {
                        int length;
                        int dataIndex;
                        int position;
                        if (i != j)
                        {
                            var fp1 = Program.dt.GetFpByIndex(i);
                            var fp2 = Program.dt.GetFpByIndex(j);
                            bool success;
                            var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID, out success);
                            var goPathSimple = ConvertToSimple(goPath);
                            var jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(goPathSimple).Trim();
                            var jsonByte = Encoding.ASCII.GetBytes(jsonStr);
                            var md5 = CommonClass.Random.GetMD5HashFromBytes(jsonByte);
                            // md5s.Add(j, md5);
                            //var compressStr = CompressString(jsonStr);
                            var bytes = Compress(jsonByte);
                            length = bytes.Length;
                            dataIndex = Convert.ToInt32((startIndex + length) / ((long)2147483648));
                            //   position;
                            using (var fileStream = new FileStream($"bigData{dataIndex}.rqdt", FileMode.OpenOrCreate))
                            {
                                position = Convert.ToInt32(fileStream.Length);
                                fileStream.Seek(0, SeekOrigin.End);

                                fileStream.Write(bytes, 0, length);
                            }
                            //startIndexList.Add(dataIndex);
                            //startIndexList.Add(position);
                            //startIndexList.Add(length);
                            startIndex += length;

                            if (success)
                            {
                                Console.WriteLine($"{i}-{j}计算成功！sumLength={startIndex}");
                                Thread.Sleep(1);
                            }
                            else
                            {
                                Console.WriteLine($"{i}-{j}计算错误！");
                                Console.ReadLine();
                            }
                        }
                        else
                        {
                            //var 
                            length = 0;
                            dataIndex = Convert.ToInt32((startIndex + length) / ((long)2147483648));
                            // int position;
                            using (var fileStream = new FileStream($"bigData{dataIndex}.rqdt", FileMode.OpenOrCreate))
                            {
                                position = Convert.ToInt32(fileStream.Length);
                                fileStream.Seek(0, SeekOrigin.End);
                            }
                            //startIndexList.Add(dataIndex);
                            //startIndexList.Add(position);
                            //startIndexList.Add(length);
                            startIndex += length;
                        }

                        Console.WriteLine("记录写入日志");
                        File.AppendAllText("CalLog.txt", $"{i}-{j}-{Environment.NewLine}");
                        File.AppendAllText("indexRecord.txt", $"{dataIndex},{position},{length},");
                        Console.WriteLine($"记录：{dataIndex},{position},{length},");
                    }



                }
                //fileStream.Write();

            }


            // var indexPageJson = Newtonsoft.Json.JsonConvert.SerializeObject(new { startIndexList = startIndexList });
            // File.WriteAllText("calResult.json", indexPageJson);

            Console.WriteLine($"计算完毕！");
        }

        public static List<Model.MapGo.nyrqPosition_Simple> ConvertToSimple(List<Model.MapGo.nyrqPosition> goPath)
        {
            List<Model.MapGo.nyrqPosition_Simple> result = new List<Model.MapGo.nyrqPosition_Simple>();
            for (var i = 0; i < goPath.Count; i++)
            {
                result.Add(goPath[i].ToSimple());
            }
            return result;
        }

        /// <summary>
        /// 字符串压缩
        /// </summary>
        /// <param name="strSource"></param>
        /// <returns></returns>
        public static byte[] Compress(byte[] data)
        {
            try
            {
                MemoryStream ms = new MemoryStream();
                GZipStream zip = new GZipStream(ms, CompressionMode.Compress, true);
                zip.Write(data, 0, data.Length);
                zip.Close();
                byte[] buffer = new byte[ms.Length];
                ms.Position = 0;
                ms.Read(buffer, 0, buffer.Length);
                ms.Close();
                return buffer;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        /// <summary>
        /// 字符串解压缩
        /// </summary>
        /// <param name="strSource"></param>
        /// <returns></returns>
        public static byte[] Decompress(byte[] data, int comPressLength)
        {
            try
            {
                MemoryStream ms = new MemoryStream(data);
                GZipStream zip = new GZipStream(ms, CompressionMode.Decompress, true);
                MemoryStream msreader = new MemoryStream();
                byte[] buffer = new byte[comPressLength * 50];
                while (true)
                {
                    int reader = zip.Read(buffer, 0, buffer.Length);
                    //zip.Read()
                    if (reader <= 0)
                    {
                        break;
                    }
                    msreader.Write(buffer, 0, reader);
                }
                zip.Close();
                ms.Close();
                msreader.Position = 0;
                buffer = msreader.ToArray();
                msreader.Close();
                return buffer;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        //public static string CompressString(string str)
        //{
        //    string compressString = "";
        //    byte[] compressBeforeByte = Encoding.UTF8.GetBytes(str);
        //    byte[] compressAfterByte = Compress(compressBeforeByte);
        //    //compressString = Encoding.GetEncoding("UTF-8").GetString(compressAfterByte);  
        //    compressString = Convert.ToBase64String(compressAfterByte);
        //    return compressString;
        //}

        //public static string DecompressString(string str)
        //{
        //    string compressString = "";
        //    //byte[] compressBeforeByte = Encoding.GetEncoding("UTF-8").GetBytes(str);  
        //    byte[] compressBeforeByte = Convert.FromBase64String(str);
        //    byte[] compressAfterByte = Decompress(compressBeforeByte);
        //    compressString = Encoding.GetEncoding("UTF-8").GetString(compressAfterByte);
        //    return compressString;
        //}
    }
}
