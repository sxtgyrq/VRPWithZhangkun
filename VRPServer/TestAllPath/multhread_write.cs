using HouseManager;
using Microsoft.AspNetCore.Mvc.Formatters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using TestAllPath;

namespace AllPathGenerator
{
    public class multhread_writeC
    {
        static object lockObj = new object();
        //static List<int> iList = new List<int>();
        //static List<int> jList = new List<int>();

        static List<int> bytesLengthList = new List<int>();
        static List<bool> finished = new List<bool>();

        static List<byte[]> byteResult = new List<byte[]>();
        delegate void calCulateFinish(int threadIndex, int bytesLength, byte[] bytes);
        public static void multhread_write()
        {
            TestAllPath.Program.dt = new Data();
            TestAllPath.Program.dt.LoadRoad();
            long startIndex = 0;

            Console.WriteLine($"输入线程数！");
            var input = Convert.ToInt32(Console.ReadLine());


            bytesLengthList = new List<int>();
            for (var i = 0; i < input; i++)
            {
                bytesLengthList.Add(0);
            }

            finished = new List<bool>();
            for (var i = 0; i < input; i++)
            {
                finished.Add(false);
            }

            byteResult = new List<byte[]>();
            for (var i = 0; i < input; i++)
            {
                byteResult.Add(new byte[] { });
            }

            var start = 0;
            {
                var count = Program.dt.Get61Fp();
                for (var i = start; i < count; i++)
                {
                    for (var j = 0; j < count; j += input)
                    {
                        lock (lockObj)
                        {
                            for (var k = 0; k < input; k++)
                            {
                                bytesLengthList[k] = 0;
                                finished[k] = false;
                                byteResult[k] = new byte[] { };
                            }
                        }

                        for (var k = j; k < j + input; k++)
                        {
                            if (i == k)
                            {
                                lock (lockObj)
                                {
                                    bytesLengthList[k - j] = 0;
                                    finished[k - j] = true;
                                }
                            }
                            else if (k >= count)
                            {
                                lock (lockObj)
                                {
                                    bytesLengthList[k - j] = 0;
                                    finished[k - j] = true;
                                }
                            }
                            else
                            {
                                calCulateFinish cf = new calCulateFinish(multhread_writeC.finishF);
                                int threadIndex = k - j;
                                int inputI = i + 0;
                                int inputJ = k + 0;
                                Thread Th = new Thread(() => singleThread(threadIndex, inputI, inputJ, cf));
                                Th.Start();
                            }
                        }
                        while (true)
                        {
                            var doRest = false;
                            lock (lockObj)
                            {
                                for (var k = 0; k < finished.Count; k++)
                                {
                                    if (!finished[k])
                                    {
                                        doRest = true;
                                        break;
                                    }
                                }
                            }
                            if (doRest)
                            {
                                Thread.Sleep(5);
                            }
                            else
                            {
                                break;
                            }
                        }
                        Console.WriteLine("开始运行主线程");
                        for (var k = j; k < j + input; k++)
                        {
                            int length;
                            int dataIndex;
                            int position;
                            byte[] bytes;
                            lock (lockObj)
                            {
                                length = bytesLengthList[k - j];
                                bytes = byteResult[k - j];
                            }
                            dataIndex = Convert.ToInt32((startIndex + length) / ((long)2147483648));

                            using (var fileStream = new FileStream($"bigData{dataIndex}.rqdt", FileMode.OpenOrCreate))
                            {
                                position = Convert.ToInt32(fileStream.Length);
                                fileStream.Seek(0, SeekOrigin.End);

                                if (k != i && k < count)
                                    fileStream.Write(bytes, 0, length);
                            }
                            //startIndexList.Add(dataIndex);
                            //startIndexList.Add(position);
                            //startIndexList.Add(length);
                            startIndex += length;

                            Console.WriteLine("记录写入日志");
                            File.AppendAllText("CalLog.txt", $"{i}-{j}-{k}-{Environment.NewLine}");
                            if (k < count)
                                File.AppendAllText("indexRecord.txt", $"{dataIndex},{position},{length},");
                            else
                                Console.WriteLine($"不记录：{i}-{j}-{k}");
                            Console.WriteLine($"记录：{dataIndex},{position},{length},");
                        }




                    }



                }
                //fileStream.Write();
                lock (lockObj)
                {
                    for (var k = 0; k < input; k++)
                    {
                        bytesLengthList[k] = 0;
                        finished[k] = false;
                        byteResult[k] = new byte[] { };
                    }
                }
            }
            Console.WriteLine($"主线程运行结束！");
            Console.ReadLine();
        }

        private static void finishF(int threadIndex, int bytesLength, byte[] bytes)
        {
            lock (lockObj)
            {
                bytesLengthList[threadIndex] = bytesLength;
                finished[threadIndex] = true;
                byteResult[threadIndex] = bytes;
            }
            Console.WriteLine($"线程{threadIndex}-运行完毕！");
        }

        private static void singleThread(int threadIndex, int i, int j, calCulateFinish cf)
        {

            {
                //var i = iList[threadIndex];
                //var j = jList[threadIndex];

                var fp1 = TestAllPath.Program.dt.GetFpByIndex(i);
                var fp2 = TestAllPath.Program.dt.GetFpByIndex(j);

                bool success;
                var goPath = TestAllPath.Program.dt.GetAFromB(fp1, fp2.FastenPositionID, out success);
                var goPathSimple = Program.ConvertToSimple(goPath);
                var jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(goPathSimple).Trim();
                var jsonByte = Encoding.ASCII.GetBytes(jsonStr);
                // var md5 = CommonClass.Random.GetMD5HashFromBytes(jsonByte);
                // md5s.Add(j, md5);
                //var compressStr = CompressString(jsonStr);
                var bytes = Program.Compress(jsonByte);

                int bytesLength = bytes.Length;


                cf(threadIndex, bytesLength, bytes);
                //lock (lockObj)
                //{
                //    bytesLengthList[threadIndex] = bytesLength;
                //    byteResult[threadIndex] = bytes;

                //    iList[threadIndex] = -1;
                //    jList[threadIndex] = -1;
                //    finished[threadIndex] = true;


                //}
                // Console.WriteLine($"线程{threadIndex}-运行完毕！");
            }
        }
    }
}
