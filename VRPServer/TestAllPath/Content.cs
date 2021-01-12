using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace TestAllPath
{
    class Content
    {
        internal static void Generate()
        {

            // var file = ;
            var json = File.ReadAllText("indexRecord.txt");
            var list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(json);
            int maxLength = 0;
            for (var i = 0; i < list.Count; i += 3)
            {
                // var byte1 = list[i];
                var byte1 = Convert.ToByte(list[i] % 256);

                var byte2 = Convert.ToByte(list[i + 1] % 256);
                var byte3 = Convert.ToByte(list[i + 1] / 256 % 256);
                var byte4 = Convert.ToByte(list[i + 1] / 256 / 256 % 256);
                var byte5 = Convert.ToByte(list[i + 1] / 256 / 256 / 256 % 256);

                var byte6 = Convert.ToByte(list[i + 2] % 256);
                var byte7 = Convert.ToByte(list[i + 2] / 256 % 256);
                var byte8 = Convert.ToByte(list[i + 2] / 256 / 256 % 256);

                var bytes = new byte[] {
                    byte1,
                    byte2,
                    byte3,
                    byte4,
                    byte5,
                    byte6,
                    byte7,
                    byte8
                };
                //File.WriteAllBytes("", bytes);
                using (var fileStream = new FileStream($"contentofdata", FileMode.OpenOrCreate))
                {
                    fileStream.Seek(i / 3 * 8, SeekOrigin.Begin);
                    fileStream.Write(bytes, 0, 8);
                }
                //length = length_;
                //maxLength = Math.Max(maxLength, list[i + 2]);
            }
            Console.WriteLine($"{maxLength}");

            //throw new NotImplementedException();
        }
    }
}
