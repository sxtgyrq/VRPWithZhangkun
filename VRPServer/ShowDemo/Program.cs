using System;
using System.Text.RegularExpressions;
using System.Threading;

namespace ShowDemo
{
    class Program
    {
        static Thread th1;
        static void Main(string[] args)
        {
            byte[] SS = new byte[] { 00, 1,15,16,233 };
            for (int i = 0; i < SS.Length; i++)
            {
                Console.WriteLine(SS[i].ToString("x2"));
            }
            while (true)
            {
                string A = "carA_bb6a1ef1cb8c5193bec80b7752c6d54c";
                A = Console.ReadLine();
                Regex r = new Regex("^car[A-E]{1}_[a-f0-9]{32}$");
                ;
                Console.WriteLine(r.IsMatch(A));
            }
        }

    }
}
