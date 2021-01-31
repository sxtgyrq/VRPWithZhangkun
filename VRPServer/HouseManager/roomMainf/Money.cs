using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        private static void MoneyChanged(Player player, long money, ref List<string> msgsWithUrl)
        {
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

        internal async Task<string> SaveMoney(SaveMoney saveMoney)
        {
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
                                    var money = this._Players[saveMoney.Key].MoneyForSave / 2;
                                    player.MoneySet(player.Money - money, ref notifyMsg);
                                }; break;
                            case "all":
                                {
                                    var money = this._Players[saveMoney.Key].MoneyForSave;
                                    player.MoneySet(player.Money - money, ref notifyMsg);
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
            return "";
        }
    }
}
