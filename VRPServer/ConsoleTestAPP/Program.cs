using System;
using System.Collections.Generic;

namespace ConsoleTestAPP
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("你好啊，测试员！！！");

            List<string> commands = new List<string>()
            {
                "milereturn","测试能力提升点返回！",
                "businessawaitreturn","测试能力提升点等待返回",
                "promotemilenotenoughreturn","能提提升时，剩余里程不足，返回",
                "promoteawaitcollectfailreturn","能提提升-等待-回收-里程不够-返回",
            };

            for (var i = 0; i < commands.Count; i += 2)
            {
                var index = (i / 2).ToString("D4");
                var A = commands[i];

                var s = index + "    " + A;
                while (s.Length < 40)
                {
                    s += " ";
                };
                s += commands[i + 1];
                Console.WriteLine(s);
            }

            var command = Console.ReadLine();
            bool success;
            int commandIndex;
            if (int.TryParse(command, out commandIndex))
            {
                if (commandIndex < commands.Count / 2)
                {
                    success = true;
                    command = commands[commandIndex * 2];
                }
                else
                {
                    success = false;
                    Console.WriteLine("请输入正确的序号");
                }
            }
            else
            {
                if (commands.Contains(command))
                {
                    commandIndex = (commands.FindIndex(item => item == command) / 2);
                    command = commands[commandIndex * 2];
                    success = true;
                }
                else
                {
                    success = false;
                    Console.WriteLine("请输入正确的命令");
                }
            }

            if (success)
                switch (command)
                {
                    case "milereturn":
                        {
                            TestTag.MileTest.TestReturn(command);
                        }; break;
                    case "businessawaitreturn":
                        {
                            TestTag.BusinessTest.TestWaitThenReturn(command);
                        }; break;
                    case "promotemilenotenoughreturn":
                        {
                            TestTag.PromoteIsNotEnoughThenReturn.Test(command);
                        }; break;
                    case "promoteawaitcollectfailreturn": 
                        {
                            TestTag.PromoteIsNotEnoughThenReturn.Test2(command);
                        };break;
                }
            Console.ReadLine();
        }
    }
}
