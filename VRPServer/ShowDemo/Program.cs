using System;

namespace ShowDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            string key = "333333333322222222222222";
            string result1 = CommonClass.AES.AesEncrypt("张三丰2B2B2B2B2B2B2B", key);
            Console.WriteLine(result1); //o7TgaEbkrWOzUMOPdnrh8Q==

            string result2 = CommonClass.AES.AesDecrypt(result1, key);
            Console.WriteLine(result2); //张三丰
            var xx = Console.ReadLine();
        }
    }
}
