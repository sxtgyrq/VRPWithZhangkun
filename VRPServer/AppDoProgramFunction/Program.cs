using System;

namespace AppDoProgramFunction
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("输入明文");
            var content = Console.ReadLine();
            Console.WriteLine("输入密钥");
            var key = Console.ReadLine();
            var result = CommonClass.AES.AesEncrypt(content, key);
            Console.WriteLine($"{result}");
            Console.WriteLine("Hello World!");
            Console.ReadLine();
        }
    }
}
