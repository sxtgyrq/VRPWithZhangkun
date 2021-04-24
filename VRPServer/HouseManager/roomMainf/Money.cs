using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
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
        //private void MoneyCanSaveChanged(Player player, long Money, ref List<string> msgsWithUrl)
        //{
        //    var obj = new BradCastMoneyForSave
        //    {
        //        c = "BradCastMoneyForSave",
        //        Money = Money,
        //        WebSocketID = player.WebSocketID

        //    };
        //    var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
        //    msgsWithUrl.Add(player.FromUrl);
        //    msgsWithUrl.Add(json);
        //    Console.WriteLine($"显示---{player.FromUrl}");
        //    Console.WriteLine($"显示---{json}");
        //}
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

        private void TheLargestHolderKeyChanged(string keyFrom, string keyTo, string roleKey, ref List<string> notifyMsg)
        {
            /*
             * lock 机制，保证了所有的key 都存在
             */
            var roleName = this._Players[roleKey].PlayerName;
            var nameTo = this._Players[keyTo].PlayerName;
            if (this._Players.ContainsKey(keyFrom))
            {
                var player = this._Players[keyFrom];
                TheLargestHolderChangedNotify holder = new TheLargestHolderChangedNotify()
                {
                    c = "TheLargestHolderChangedNotify",
                    WebSocketID = player.WebSocketID,
                    operateKey = roleKey,
                    operateName = roleName,
                    ChangeTo = keyTo,
                    nameTo = nameTo
                };
                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(holder);
                var url = player.FromUrl;
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);
            }
            if (keyTo != keyFrom && this._Players.ContainsKey(keyTo))
            {
                var player = this._Players[keyTo];
                TheLargestHolderChangedNotify holder = new TheLargestHolderChangedNotify()
                {
                    c = "TheLargestHolderChangedNotify",
                    WebSocketID = player.WebSocketID,
                    operateKey = roleKey,
                    operateName = roleName,
                    ChangeTo = keyTo,
                    nameTo = nameTo
                };
                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(holder);
                var url = player.FromUrl;
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);
            }
            if (roleKey != keyFrom && roleKey != keyTo && this._Players.ContainsKey(roleKey))
            {
                var player = this._Players[roleKey];
                TheLargestHolderChangedNotify holder = new TheLargestHolderChangedNotify()
                {
                    c = "TheLargestHolderChangedNotify",
                    WebSocketID = player.WebSocketID,
                    operateKey = roleKey,
                    operateName = roleName,
                    ChangeTo = keyTo,
                    nameTo = nameTo
                };
                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(holder);
                var url = player.FromUrl;
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);
            }

            //throw new NotImplementedException();
        }

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

        //private static void SupportChanged(Player player, Player.Support support, ref List<string> notifyMsg)
        //{
        //    //if (support != null)
        //    //{
        //    //    var url = player.FromUrl;

        //    //    SupportNotify tn = new SupportNotify()
        //    //    {
        //    //        c = "SupportNotify",
        //    //        WebSocketID = player.WebSocketID,
        //    //        Money = support.Money
        //    //    };

        //    //    var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(tn);
        //    //    notifyMsg.Add(url);
        //    //    notifyMsg.Add(sendMsg);
        //    //}
        //}
    }
}
