using CommonClass;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace HouseManager
{
    public class Market
    {
        PriceChanged _priceChanged;
        public long? mile_Price { get; private set; }
        public long? business_Price { get; private set; }
        public long? volume_Price { get; private set; }
        public long? speed_Price { get; private set; }
        //   else if (!(sp.pType == "mile" || sp.pType == "business" || sp.pType == "volume" || sp.pType == "speed"))
        //{
        //    return $"wrong pType:{sp.pType}"; ;
        //}
        string IP { get; set; }
        int port { get; set; }
        public Market(PriceChanged priceChanged)
        {
            this.mile_Price = null;
            this.business_Price = null;
            this.volume_Price = null;
            this.speed_Price = null;
            this._priceChanged = priceChanged;
            var rootPath = System.IO.Directory.GetCurrentDirectory();
            Console.WriteLine($"path:{rootPath}");
            //Console.WriteLine($"IPPath:{rootPath}");
            if (File.Exists($"{rootPath}\\config\\MarketIP.txt"))
            {
                var text = File.ReadAllText($"{rootPath}\\config\\MarketIP.txt");
                var ipAndPort = text.Split(':');
                this.IP = ipAndPort[0];
                this.port = int.Parse(ipAndPort[1]);
            }
            else
            {
                Console.WriteLine($"请market输入IP");
                this.IP = Console.ReadLine();
                Console.WriteLine("请market输入端口");
                this.port = int.Parse(Console.ReadLine());
                var text = $"{this.IP}:{this.port}";
                File.WriteAllText($"{rootPath}\\config\\MarketIP.txt", text);
            }

        }

        internal void Update(MarketPrice sa)
        {
            switch (sa.sellType)
            {
                case "mile":
                    {
                        this.mile_Price = sa.price;
                        LogClass.Class1.Add($"收到{sa.sellType}市场价:{sa.price}");
                        this._priceChanged(sa.sellType, this.mile_Price.Value);
                    }; break;
                case "business":
                    {
                        this.business_Price = sa.price;
                        LogClass.Class1.Add($"收到{sa.sellType}市场价:{sa.price}");
                        this._priceChanged(sa.sellType, this.business_Price.Value);
                    }; break;
                case "volume":
                    {
                        this.volume_Price = sa.price;
                        LogClass.Class1.Add($"收到{sa.sellType}市场价:{sa.price}");
                        this._priceChanged(sa.sellType, this.volume_Price.Value);
                    }; break;
                case "speed":
                    {
                        this.speed_Price = sa.price;
                        LogClass.Class1.Add($"收到{sa.sellType}市场价:{sa.price}");
                        this._priceChanged(sa.sellType, this.speed_Price.Value);
                    }; break;
            }
            // throw new NotImplementedException();
        }

        /// <summary>
        /// 玩家卖，市场收
        /// </summary>
        /// <param name="pType"></param>
        /// <param name="v"></param>
        internal async void Receive(string pType, int v)
        {

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(new MarketIn()
            {
                c = "MarketIn",
                pType = pType,
                count = v
            });
            await HouseManager.Startup.sendMsg($"{this.IP}:{this.port}", json);

        }
        /// <summary>
        /// 玩家买，市场发
        /// </summary>
        /// <param name="pType"></param>
        /// <param name="v"></param>
        internal async void Send(string pType, int v)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(new MarketOut()
            {
                c = "MarketOut",
                pType = pType,
                count = v
            });
            await HouseManager.Startup.sendMsg($"{this.IP}:{this.port}", json);
        }

        internal void Buy(BuyDiamondInMarket bd)
        {
            //switch (bd.buyType)
            //{
            //    case "mile":
            //        {
            //            if (this.mile_Price != null) 
            //            {

            //            }
            //            //this.mile_Price = sa.price;
            //            //this._priceChanged(sa.sellType, this.mile_Price.Value);
            //        }; break;
            //    case "business":
            //        {
            //            this.business_Price = sa.price;
            //            this._priceChanged(sa.sellType, this.business_Price.Value);
            //        }; break;
            //    case "volume":
            //        {
            //            this.volume_Price = sa.price;
            //            this._priceChanged(sa.sellType, this.volume_Price.Value);
            //        }; break;
            //    case "speed":
            //        {
            //            this.speed_Price = sa.price;
            //            this._priceChanged(sa.sellType, this.speed_Price.Value);
            //        }; break;
            //}
            // throw new NotImplementedException();
        }
    }

    public delegate void PriceChanged(string priceType, long value);
}
