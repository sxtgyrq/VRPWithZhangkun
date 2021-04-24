using System;
using System.IO;
using System.Runtime.CompilerServices;

namespace MarketConsoleApp
{
    class Program
    {
        static Market m = null;
        static void Main(string[] args)
        {
            Program.m = new Market();
            m.loadCount();
            m.loadSevers();
            // m.loadCountInMarket();
            m.tellMarketIsOn();
            m.sendInteview();
            m.waitToBeTelled();
            while (true)
            {
                if (Console.ReadLine().Trim().ToUpper() == "EXIT")
                {
                    break;
                }
            }
        }

        private static void loadSevers()
        {

            File.ReadAllLines("file.txt");
            throw new NotImplementedException();
        }
    }
}
