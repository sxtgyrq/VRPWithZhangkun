using HouseManager;
using System;

namespace TestAllPath
{
    class Program
    {
        public static Data dt;
        static void Main(string[] args)
        {
            Console.WriteLine("此程序目的是校验所有的路径均能走！！！");
            namal();
            Console.WriteLine("Hello World!");

            Console.ReadLine();
        }

        private static void namal()
        {
            Program.dt = new Data();
            Program.dt.LoadRoad();

            var count = Program.dt.Get61Fp();
            for (var i = 0; i < count; i++)
            {
                for (var j = 0; j < count; j++)
                {
                    if (i != j)
                    {
                        var fp1 = Program.dt.GetFpByIndex(i);
                        var fp2 = Program.dt.GetFpByIndex(j);
                        bool success;
                        var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID, out success);
                        if (success)
                        {
                            Console.WriteLine($"{i}-{j}计算成功！");
                        }
                        else
                        {
                            Console.WriteLine($"{i}-{j}计算错误！");
                            Console.ReadLine();
                        }
                    }
                }
            }

            Console.WriteLine($"计算完毕！");
        }
    }
}
