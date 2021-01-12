using System;

namespace ConsoleTestAPP
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            Console.WriteLine(@"
        milereturn  ---测试能力提升点返回！
");
            var command = Console.ReadLine();
            switch (command)
            {
                case "milereturn":
                    {
                        TestTag.MileTest.TestReturn();
                    }; break;
            }
            Console.ReadLine();
        }
    }
}
