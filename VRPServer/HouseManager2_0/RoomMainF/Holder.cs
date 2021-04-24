using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
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
        private void SendMaxHolderInfoMation(Player player, ref List<string> notifyMsgs)
        {
            foreach (var item in this._Players)
            {
                //  if (player.Key == item.Key) { }
                //else 
                {
                    if (item.Value.TheLargestHolderKey == item.Key)
                    {
                        this.TheLargestHolderKeyChanged(item.Key, player.Key, player.Key, ref notifyMsgs);
                    }
                }
            }
            // throw new NotImplementedException();
        }
    }
}
