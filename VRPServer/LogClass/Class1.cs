using System;
using System.IO;

namespace LogClass
{
    public class Class1
    {
        public static void Add(string v)
        {
            var content = $"[{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}]{v}{Environment.NewLine}";
            File.AppendAllText("conmunicateRecord.txt", content);
        }
    }
}
