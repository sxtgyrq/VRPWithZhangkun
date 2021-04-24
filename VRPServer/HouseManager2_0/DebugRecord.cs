using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace HouseManager2_0
{
    class DebugRecord
    {
        internal static void FileRecord(string json)
        {
            var filename = $"exception{DateTime.Now.ToString("yyyyMMddHHmmssff")}.txt";
            File.WriteAllText(filename, json);
        }
    }
}
