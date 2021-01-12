using HouseManager;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace TestAllPath
{
    public class Combine
    {
        internal static void DoCombine()
        {
            var path1 = "F:\\work\\202101\\dataGenerate\\data1";
            List<int> indexPart1, indexPart2;
            {
                //var path1 = "F:\\work\\202101\\dataGenerate\\data1";
                var indexJson = File.ReadAllText($"{path1}\\indexRecord.txt");
                indexPart1 = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(indexJson);
            }
            var path2 = "F:\\work\\202101\\dataGenerate\\data2";
            {
                //  var path2 = "F:\\work\\202101\\dataGenerate\\data2";
                var indexJson = File.ReadAllText($"{path2}\\indexRecord.txt");
                indexPart2 = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(indexJson);
            }

            Console.WriteLine($"{indexPart1.Count},{indexPart2.Count}");
            Console.ReadLine();
            Program.dt = new Data();
            Program.dt.LoadRoad();
            long startIndex = 0;
            {
                var count = Program.dt.Get61Fp();
                for (var i = 0; i < count; i++)
                {

                    //Dictionary<int, string> md5s = new Dictionary<int, string>();
                    for (var j = 0; j < count; j++)
                    {
                        if (i == 370)
                        {
                            string md5_1, md5_2;
                            {
                                var index = i * count + j;

                                var dataIndex = indexPart1[index * 3];
                                int length = indexPart1[index * 3 + 2]; ;
                                // int dataIndex;
                                int position = indexPart1[index * 3 + 1];
                                var bytes = new byte[length];
                                using (var fileStream = new FileStream($"{path1}//bigData{dataIndex}.rqdt", FileMode.Open))
                                {
                                    fileStream.Seek(position, SeekOrigin.Begin);
                                    fileStream.Read(bytes, 0, length);
                                }
                                md5_1 = CommonClass.Random.GetMD5HashFromBytes(bytes);
                            }
                            {
                                var index = (i - 370) * count + j;

                                var dataIndex = indexPart2[index * 3];
                                int length = indexPart2[index * 3 + 2]; ;
                                // int dataIndex;
                                int position = indexPart2[index * 3 + 1];
                                var bytes = new byte[length];
                                using (var fileStream = new FileStream($"{path2}//bigData{dataIndex}.rqdt", FileMode.Open))
                                {
                                    fileStream.Seek(position, SeekOrigin.Begin);
                                    fileStream.Read(bytes, 0, length);
                                }
                                md5_2 = CommonClass.Random.GetMD5HashFromBytes(bytes);
                            }
                            if (md5_2 != md5_1)
                            {
                                Console.WriteLine($"{j}md5不相等");
                                Console.ReadLine();
                            }
                            else
                            {
                                if (j % 100 == 0)
                                {
                                    Console.WriteLine($"{j}_md5没问题_{md5_2}_{md5_1}");
                                    Console.ReadLine();
                                }
                            }
                            //using (var fileStream = new FileStream($"bigData{dataIndex}.rqdt", FileMode.))
                            //{
                            //    position = Convert.ToInt32(fileStream.Length);
                            //    fileStream.Seek(0, SeekOrigin.End);

                            //    fileStream.Write(bytes, 0, length);
                            //}
                        }

                        {
                            int length;
                            int dataIndex;
                            int position;
                            if (i != j)
                            {
                                byte[] bytes;
                                if (i < 370)
                                {
                                    var index = i * count + j;

                                    var dataIndex_ = indexPart1[index * 3];
                                    int length_ = indexPart1[index * 3 + 2]; ;
                                    // int dataIndex;
                                    int position_ = indexPart1[index * 3 + 1];
                                    bytes = new byte[length_];
                                    using (var fileStream = new FileStream($"{path1}//bigData{dataIndex_}.rqdt", FileMode.Open))
                                    {
                                        fileStream.Seek(position_, SeekOrigin.Begin);
                                        fileStream.Read(bytes, 0, length_);
                                    }
                                    length = length_;
                                    //  md5_1 = CommonClass.Random.GetMD5HashFromBytes(bytes);
                                }
                                else
                                {
                                    var index = (i - 370) * count + j;

                                    var dataIndex_ = indexPart2[index * 3];
                                    int length_ = indexPart2[index * 3 + 2]; ;
                                    // int dataIndex;
                                    int position_ = indexPart2[index * 3 + 1];
                                    bytes = new byte[length_];
                                    using (var fileStream = new FileStream($"{path2}//bigData{dataIndex_}.rqdt", FileMode.Open))
                                    {
                                        fileStream.Seek(position_, SeekOrigin.Begin);
                                        fileStream.Read(bytes, 0, length_);
                                    }
                                    length = length_;
                                }
                              
                                dataIndex = Convert.ToInt32((startIndex + length) / ((long)2147483648));
                                //   position;
                                Console.WriteLine($"{length},{bytes.Length},{startIndex},{dataIndex}");
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

                                //if (success)
                                //{
                                //    Console.WriteLine($"{i}-{j}计算成功！sumLength={startIndex}");
                                //    Thread.Sleep(1);
                                //}
                                //else
                                //{
                                //    Console.WriteLine($"{i}-{j}计算错误！");
                                //    Console.ReadLine();
                                //}
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



                }
                //fileStream.Write();

            }


            // var indexPageJson = Newtonsoft.Json.JsonConvert.SerializeObject(new { startIndexList = startIndexList });
            // File.WriteAllText("calResult.json", indexPageJson);

            Console.WriteLine($"计算完毕！");
        }
    }
}
