using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DalOfAddress
{
    internal class Connection
    {
        static string ConnectionStrValue_ = "";
        public static string ConnectionStr
        {
            get
            {
                if (string.IsNullOrEmpty(ConnectionStrValue_))
                {
                    var content = File.ReadAllText("connect.txt");
                    ConnectionStrValue_ = CommonClass.AES.AesDecrypt(content, "Yrq123");
                    Console.WriteLine($"{ConnectionStrValue_}");
                }
                // Console.WriteLine
                return ConnectionStrValue_;
            }
        }
    }
}
