using HouseManager;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace TestAllPath
{
    public class Check
    {
        public static void CheckAll()
        {
            Program.dt = new Data();
            Program.dt.LoadRoad(); 
            {
                var count = Program.dt.Get61Fp();
                for (var i = 0; i < count; i++)
                {
                    //Dictionary<int, string> md5s = new Dictionary<int, string>();
                    for (var j = 0; j < count; j++)
                    {

                        if (i != j)
                        {
                            byte[] data;
                            string json1;
                            string json2;
                            int startPosition = (i * count + j) * 8;
                            if (Read(ref startPosition, out data))
                            {
                                var dataIndex = data[0] * 1;
                                var startPositionInDB =
                                    data[1] * 1 +
                                    data[2] * 256 +
                                    data[3] * 256 * 256 +
                                    data[4] * 256 * 256 * 256;
                                var length =
                                    data[5] * 1 +
                                    data[6] * 256 +
                                    data[7] * 256 * 256;
                                Console.WriteLine($"{dataIndex},{startPositionInDB},{length}");
                            
                                var JsonByteFromDB = Program.Decompress(GetDataOfPath(dataIndex, startPositionInDB, length), length * 50);
                                var json = Encoding.ASCII.GetString(JsonByteFromDB);
                                Console.WriteLine($"fromDB:{json}");
                                json1 = json;
                            }
                            else
                            {
                                throw new Exception("具体看代码！");
                            }
                            {
                                var fp1 = Program.dt.GetFpByIndex(i);
                                var fp2 = Program.dt.GetFpByIndex(j);
                                bool success;
                                var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID, out success);
                                var goPathSimple = Program.ConvertToSimple(goPath);
                                json2 = Newtonsoft.Json.JsonConvert.SerializeObject(goPathSimple).Trim();
                                Console.WriteLine($"计算的json:{json2}");
                            }
                            var result = (json2 == json1);
                            Console.WriteLine($"{i}-{j}:{result}");
                            if (!result)
                                Console.ReadLine();
                        }

                    }
                }

            }
        }

        private static byte[] GetDataOfPath(int dataIndex, int startPositionInDB, int length)
        {
            using (var fileStream = new FileStream($"bigData{dataIndex}.rqdt", FileMode.OpenOrCreate))
            {
                var data = new byte[length];
                fileStream.Seek(startPositionInDB, SeekOrigin.Begin);
                fileStream.Read(data, 0, length);
                return data;
            }
        }

        private static bool Read(ref int startPosition, out byte[] data)
        {
            using (var fileStream = new FileStream($"contentofdata", FileMode.OpenOrCreate))
            {
                data = new byte[8];
                if (startPosition < fileStream.Length)
                {
                    fileStream.Seek(startPosition, SeekOrigin.Begin);
                    fileStream.Read(data, 0, 8);
                    startPosition += 8;
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
