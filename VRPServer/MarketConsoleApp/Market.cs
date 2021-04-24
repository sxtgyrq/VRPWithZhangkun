using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MarketConsoleApp
{
    class Market
    {

        string[] servers;
        internal void loadSevers()
        {
            this.servers = File.ReadAllLines("servers.txt");
            for (var i = 0; i < this.servers.Length; i++)
            {
                Console.WriteLine($"服务器{i}-{this.servers[i]}");
            }
            Console.WriteLine($"请确认服务器，输入任意键继续");
            Console.ReadLine();
        }

        internal void sendInteview()
        {
            Thread th = new Thread(() => this.sendInteview(true));
            th.Start();
        }
        internal void sendInteview(bool waitT)
        {
            while (true)
            {
                Thread.Sleep(1000 * 60 * 5);
                tellMarketIsOn();
            }
        }

        string IP = "127.0.0.1";
        int Port = 12630;
        internal void waitToBeTelled()
        {
            Console.WriteLine($"请输入IP地址！默认{this.IP}");
            var input = Console.ReadLine().Trim();
            if (!string.IsNullOrEmpty(input))
            {
                this.IP = input;
            }
            Console.WriteLine($"请输入端口。默认{this.Port}");
            input = Console.ReadLine().Trim();
            if (!string.IsNullOrEmpty(input))
            {
                this.Port = int.Parse(input);
            }
            var dealWith = new TcpFunction.WithoutResponse.DealWith(this.DealWith);
            TcpFunction.WithoutResponse.startTcp(this.IP, this.Port, dealWith);

            // Listen.IpAndPort(ip, tcpPort)
            // throw new NotImplementedException();
        }

        private async Task<string> DealWith(string notifyJson)
        {
            Console.WriteLine($"DealWith-Msg-{notifyJson}");
            CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);
            switch (c.c)
            {
                case "MarketIn":
                    {
                        CommonClass.MarketIn mi = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.MarketIn>(notifyJson);
                        switch (mi.pType)
                        {
                            case "mile":
                                {
                                    var price1 = getPrice(this.mileCount);
                                    this.mileCount += mi.count;
                                    var price2 = getPrice(this.mileCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mi.pType);
                                        saveCount(mi.pType, this.mileCount);
                                    }
                                }; break;
                            case "business":
                                {
                                    var price1 = getPrice(this.businessCount);
                                    this.businessCount += mi.count;
                                    var price2 = getPrice(this.businessCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mi.pType);
                                        saveCount(mi.pType, this.businessCount);
                                    }
                                }; break;
                            case "volume":
                                {
                                    var price1 = getPrice(this.volumeCount);
                                    this.volumeCount += mi.count;
                                    var price2 = getPrice(this.volumeCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mi.pType);
                                        saveCount(mi.pType, this.volumeCount);
                                    }
                                }; break;
                            case "speed":
                                {
                                    var price1 = getPrice(this.speedCount);
                                    this.speedCount += mi.count;
                                    var price2 = getPrice(this.speedCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mi.pType);
                                        saveCount(mi.pType, this.speedCount);
                                    }
                                }; break;
                        }
                    }; break;
                case "MarketOut":
                    {
                        CommonClass.MarketOut mo = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.MarketOut>(notifyJson);
                        switch (mo.pType)
                        {
                            case "mile":
                                {
                                    var price1 = getPrice(this.mileCount);
                                    this.mileCount -= mo.count;
                                    var price2 = getPrice(this.mileCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mo.pType);
                                        saveCount(mo.pType, this.mileCount);
                                    }
                                }; break;
                            case "business":
                                {
                                    var price1 = getPrice(this.businessCount);
                                    this.businessCount -= mo.count;
                                    var price2 = getPrice(this.businessCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mo.pType);
                                        saveCount(mo.pType, this.businessCount);
                                    }
                                }; break;
                            case "volume":
                                {
                                    var price1 = getPrice(this.volumeCount);
                                    this.volumeCount -= mo.count;
                                    var price2 = getPrice(this.volumeCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mo.pType);
                                        saveCount(mo.pType, this.volumeCount);
                                    }
                                }; break;
                            case "speed":
                                {
                                    var price1 = getPrice(this.speedCount);
                                    this.speedCount -= mo.count;
                                    var price2 = getPrice(this.speedCount);
                                    if (price1 != price2)
                                    {
                                        await tellMarketItem(mo.pType);
                                        saveCount(mo.pType, this.speedCount);
                                    }
                                }; break;
                        }
                    }; break;
            }
            return "";
        }

        private void saveCount(string pType, int count)
        {
            DalOfAddress.Diamoudcount.UpdateItem(pType, count);
        }

        private async Task tellMarketItem(string pType)
        {
            for (var i = 0; i < this.servers.Length; i++)
            {
                //string ip = this.servers[i].Split(':')[0];
                //int port = int.Parse(this.servers[i].Split(':')[1]);
                switch (pType)
                {
                    case "mile":
                        {
                            await sendMsg(this.servers[i],
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new CommonClass.MarketPrice()
                                    {
                                        c = "MarketPrice",
                                        count = this.mileCount,
                                        price = getPrice(this.mileCount),
                                        sellType = "mile",
                                    }));
                        }; break;
                    case "business":
                        {
                            await sendMsg(this.servers[i],
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new CommonClass.MarketPrice()
                                    {
                                        c = "MarketPrice",
                                        count = this.businessCount,
                                        price = getPrice(this.businessCount),
                                        sellType = "business",
                                    }));
                        }; break;
                    case "volume":
                        {
                            await sendMsg(this.servers[i],
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new CommonClass.MarketPrice()
                                    {
                                        c = "MarketPrice",
                                        count = this.volumeCount,
                                        price = getPrice(this.volumeCount),
                                        sellType = "volume",
                                    }));
                        }; break;
                    case "speed":
                        {
                            await sendMsg(this.servers[i],
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new CommonClass.MarketPrice()
                                    {
                                        c = "MarketPrice",
                                        count = this.speedCount,
                                        price = getPrice(this.speedCount),
                                        sellType = "speed",
                                    }));
                        }; break;
                }
            }
        }

        int mileCount = 8000;
        int businessCount = 8000;
        int volumeCount = 8000;
        int speedCount = 8000;
        internal void loadCount()
        {
            var rootPath = System.IO.Directory.GetCurrentDirectory();
            Console.WriteLine($"path:{rootPath}");
            this.mileCount = getCount("mile", this.mileCount);
            this.businessCount = getCount("business", this.businessCount);
            this.volumeCount = getCount("volume", this.volumeCount);
            this.speedCount = getCount("speed", this.speedCount);
            Console.WriteLine($"mile:{this.mileCount};business:{this.businessCount};volume:{this.volumeCount};speed:{this.speedCount}");
            Console.WriteLine($"以上为库存数量！");
            Console.ReadLine();
        }

        private int getCount(string v, int value)
        {
            return DalOfAddress.Diamoudcount.GetCount(v);
        }

        internal async void tellMarketIsOn()
        {
            //  this.servers = File.ReadAllLines("servers.txt");
            for (var i = 0; i < this.servers.Length; i++)
            {
                //string ip = this.servers[i].Split(':')[0];
                //int port = int.Parse(this.servers[i].Split(':')[1]);

                await sendMsg(this.servers[i],
                    Newtonsoft.Json.JsonConvert.SerializeObject(
                        new CommonClass.MarketPrice()
                        {
                            c = "MarketPrice",
                            count = this.mileCount,
                            price = getPrice(this.mileCount),
                            sellType = "mile",
                        }));
                await sendMsg(this.servers[i],
                   Newtonsoft.Json.JsonConvert.SerializeObject(
                       new CommonClass.MarketPrice()
                       {
                           c = "MarketPrice",
                           count = this.businessCount,
                           price = getPrice(this.businessCount),
                           sellType = "business",
                       }));
                await sendMsg(this.servers[i],
                   Newtonsoft.Json.JsonConvert.SerializeObject(
                       new CommonClass.MarketPrice()
                       {
                           c = "MarketPrice",
                           count = this.volumeCount,
                           price = getPrice(this.volumeCount),
                           sellType = "volume",
                       }));
                await sendMsg(this.servers[i],
                   Newtonsoft.Json.JsonConvert.SerializeObject(
                       new CommonClass.MarketPrice()
                       {
                           c = "MarketPrice",
                           count = this.speedCount,
                           price = getPrice(this.speedCount),
                           sellType = "speed",
                       }));
            }


        }

        public static async Task sendMsg(string controllerUrl, string json)
        {
            // TcpFunction.WithResponse.SendInmationToUrlAndGetRes
            try
            {
                await Task.Run(() => TcpFunction.WithResponse.SendInmationToUrlAndGetRes(controllerUrl, json));
            }
            catch (Exception e) 
            {
                Console.WriteLine($"往{controllerUrl}发送消息--{json}失败！");
            }
        }
        private long getPrice(int mileCount)
        {
            //if (mileCount < 0)
            //{
            //    return 100000;//10W分,1000元
            //}
            //else 
            if (mileCount < 1000)
            {
                //max:100000分,min:10000分。
                return ((100000 - 90 * mileCount) / 50) * 50;
            }
            else if (mileCount < 8000)
            {
                //max:10000分,min:1250分。
                return ((11250 - 5 * mileCount / 4) / 50) * 50;
            }
            else
            {
                return 1250;
            }
        }
    }
}
