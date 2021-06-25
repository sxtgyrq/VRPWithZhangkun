using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        private static void SetMoneyCanSave(Player player, ref List<string> notifyMsg)
        {
            var url = player.FromUrl;

            MoneyForSaveNotify tn = new MoneyForSaveNotify()
            {
                c = "MoneyForSaveNotify",
                WebSocketID = player.WebSocketID,
                MoneyForSave = player.MoneyForSave
            };

            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(tn);
            notifyMsg.Add(url);
            notifyMsg.Add(sendMsg);
            //throw new NotImplementedException();
        }
        private static void MoneyChanged(Player player, long money, ref List<string> notifyMsg)
        {
            var url = player.FromUrl;

            MoneyNotify mn = new MoneyNotify()
            {
                c = "MoneyNotify",
                WebSocketID = player.WebSocketID,
                Money = money
            };

            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(mn);
            notifyMsg.Add(url);
            notifyMsg.Add(sendMsg);
            // throw new NotImplementedException();
        }
        private void LookFor()
        {
            lock (this.PlayerLock)
            {
                this._collectPosition = new Dictionary<int, int>();
                SetLookForPromote();
                SetLookForMoney();
            }
        }



        private void SetLookForMoney()
        {
            /*
             * 0->100.00
             * 1,2->50.00
             * 3,4,5,6,7->20.00
             * 8,9,10,11,12,13,14,15,16,17->10.00
             * 18-37->5.00
             */


            for (var i = 0; i < 38; i++)
            {
                this._collectPosition.Add(i, GetRandomPosition(true));
                //  throw new NotImplementedException();
            }
        }

        Dictionary<int, int> _collectPosition = new Dictionary<int, int>();

        internal async Task<string> SaveMoney(SaveMoney saveMoney)
        {
            // var doSaveMoney = false;
            long money = 0;
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(saveMoney.Key))
                {
                    if (this._Players[saveMoney.Key].Bust) { }
                    else
                    {
                        var player = this._Players[saveMoney.Key];
                        switch (saveMoney.dType)
                        {
                            case "half":
                                {
                                    money = this._Players[saveMoney.Key].MoneyForSave / 2;
                                    if (money > 0)
                                    {
                                        //  doSaveMoney = true;
                                        player.MoneySet(player.Money - money, ref notifyMsg);
                                    }
                                }; break;
                            case "all":
                                {
                                    money = this._Players[saveMoney.Key].MoneyForSave;
                                    if (money > 0)
                                    {
                                        //  doSaveMoney = true;
                                        player.MoneySet(player.Money - money, ref notifyMsg);
                                    }
                                }; break;
                        }
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                Console.WriteLine($"url:{url}");
                if (!string.IsNullOrEmpty(url))
                {
                    await Startup.sendMsg(url, sendMsg);
                }
            }

            if (money > 0)
            {
                DalOfAddress.MoneyAdd.AddMoney(saveMoney.address, money);
                //Thread th = new Thread(() => );
                //th.Start();
            }
            return "";
        }

        internal async Task OrderToSubsidize(OrderToSubsidize ots)
        {
            List<string> notifyMsg = new List<string>();
            if (BitCoin.Sign.checkSign(ots.signature, ots.Key, ots.address))
            {

                lock (this.PlayerLock)
                    if (this._Players.ContainsKey(ots.Key))
                    {
                        if (!this._Players[ots.Key].Bust)
                        {
                            long subsidizeGet, subsidizeLeft;
                            DalOfAddress.MoneyGet.GetSubsidizeAndLeft(ots.address, ots.value, out subsidizeGet, out subsidizeLeft);

                            var player = this._Players[ots.Key];
                            player.MoneySet(player.Money + subsidizeGet, ref notifyMsg);
                            //  player.setSupportToPlayMoney(player.SupportToPlayMoney + subsidizeGet, ref notifyMsg);

                            SendLeftMoney(player, subsidizeLeft, ots.address, ref notifyMsg);
                            //player.SupportToPlay.
                        }
                    }
            }
            else
            {
                Console.WriteLine($"检验签名失败,{ots.Key},{ots.signature},{ots.address}");
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                Console.WriteLine($"url:{url}");
                await Startup.sendMsg(url, sendMsg);
            }
        }

        private void SendLeftMoney(Player player, long subsidizeLeft, string address, ref List<string> notifyMsg)
        {
            var url = player.FromUrl;
            LeftMoneyInDB lmdb = new LeftMoneyInDB()
            {
                c = "LeftMoneyInDB",
                WebSocketID = player.WebSocketID,
                Money = subsidizeLeft,
                address = address
            };
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(lmdb);
            notifyMsg.Add(url);
            notifyMsg.Add(sendMsg);
        }

    }
}
