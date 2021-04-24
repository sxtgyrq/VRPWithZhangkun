using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {


        public HouseManager.Market Market { get; internal set; }

        internal async void Sell(SetSellDiamond ss)
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(ss.Key))
                {
                    var player = this._Players[ss.Key];
                    if (player.Bust) { }
                    //else if(player.)
                    else
                    {
                        switch (ss.pType)
                        {
                            case "mile":
                                {
                                    if (this.Market.mile_Price != null)
                                    {
                                        var calValue = this.Market.mile_Price.Value;
                                        if (player.PromoteDiamondCount[ss.pType] > 0)
                                        {
                                            player.MoneySet(player.Money + calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[ss.pType]--;
                                            SendPromoteCountOfPlayer(ss.pType, player, ref notifyMsg);
                                            this.Market.Receive(ss.pType, 1);
                                        }
                                        else
                                        {
                                            Console.WriteLine($"没有宝石");
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "business":
                                {
                                    if (this.Market.business_Price != null)
                                    {
                                        var calValue = this.Market.business_Price.Value;
                                        if (player.PromoteDiamondCount[ss.pType] > 0)
                                        {
                                            player.MoneySet(player.Money + calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[ss.pType]--;
                                            SendPromoteCountOfPlayer(ss.pType, player, ref notifyMsg);
                                            this.Market.Receive(ss.pType, 1);
                                        }
                                        else
                                        {
                                            Console.WriteLine($"没有宝石");
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "volume":
                                {
                                    if (this.Market.volume_Price != null)
                                    {
                                        var calValue = this.Market.volume_Price.Value;
                                        if (player.PromoteDiamondCount[ss.pType] > 0)
                                        {
                                            player.MoneySet(player.Money + calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[ss.pType]--;
                                            SendPromoteCountOfPlayer(ss.pType, player, ref notifyMsg);
                                            this.Market.Receive(ss.pType, 1);
                                        }
                                        else
                                        {
                                            Console.WriteLine($"没有宝石");
#warning 这里要提示前台
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "speed":
                                {
                                    if (this.Market.speed_Price != null)
                                    {
                                        var calValue = this.Market.speed_Price.Value;
                                        if (player.PromoteDiamondCount[ss.pType] > 0)
                                        {
                                            player.MoneySet(player.Money + calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[ss.pType]--;
                                            SendPromoteCountOfPlayer(ss.pType, player, ref notifyMsg);
                                            this.Market.Receive(ss.pType, 1);
                                        }
                                        else
                                        {
                                            Console.WriteLine($"没有宝石");
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                        }
                    }
                }

            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
        }
        internal async void Buy(SetBuyDiamond bd)
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(bd.Key))
                {
                    var player = this._Players[bd.Key];
                    if (player.Bust) { }
                    //else if(player.)
                    else
                    {
                        switch (bd.pType)
                        {
                            case "mile":
                                {
                                    if (this.Market.mile_Price != null)
                                    {
                                        var calValue = this.Market.mile_Price.Value;
                                        if (player.Money >= calValue)
                                        {
                                            player.MoneySet(player.Money - calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[bd.pType]++;
                                            SendPromoteCountOfPlayer(bd.pType, player, ref notifyMsg);
                                            this.Market.Send(bd.pType, 1);
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "business":
                                {
                                    if (this.Market.business_Price != null)
                                    {
                                        var calValue = this.Market.business_Price.Value;
                                        if (player.Money >= calValue)
                                        {
                                            player.MoneySet(player.Money - calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[bd.pType]++;
                                            SendPromoteCountOfPlayer(bd.pType, player, ref notifyMsg);
                                            this.Market.Send(bd.pType, 1);
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "volume":
                                {
                                    if (this.Market.volume_Price != null)
                                    {
                                        var calValue = this.Market.volume_Price.Value;
                                        if (player.Money >= calValue)
                                        {
                                            player.MoneySet(player.Money - calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[bd.pType]++;
                                            SendPromoteCountOfPlayer(bd.pType, player, ref notifyMsg);
                                            this.Market.Send(bd.pType, 1);
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                            case "speed":
                                {
                                    if (this.Market.speed_Price != null)
                                    {
                                        var calValue = this.Market.speed_Price.Value;
                                        if (player.Money >= calValue)
                                        {
                                            player.MoneySet(player.Money - calValue, ref notifyMsg);
                                            player.PromoteDiamondCount[bd.pType]++;
                                            SendPromoteCountOfPlayer(bd.pType, player, ref notifyMsg);
                                            this.Market.Send(bd.pType, 1);
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("市場沒開放");
                                    }
                                }; break;
                        }
                    }
                }

            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }

        }
        internal void Buy(BuyDiamondInMarket bd)
        {

        }

        private void TellMarketServer(string buyType)
        {
            throw new NotImplementedException();
        }


    }
}
