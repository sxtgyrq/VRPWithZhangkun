using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async Task SendMsg(DialogMsg dm)
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(dm.Key))
                {
                    if (this._Players.ContainsKey(dm.To))
                    {
                        notifyMsg.Add(this._Players[dm.Key].FromUrl);
                        dm.WebSocketID = this._Players[dm.Key].WebSocketID;
                        notifyMsg.Add(Newtonsoft.Json.JsonConvert.SerializeObject(dm));

                        notifyMsg.Add(this._Players[dm.To].FromUrl);
                        dm.WebSocketID = this._Players[dm.To].WebSocketID;
                        notifyMsg.Add(Newtonsoft.Json.JsonConvert.SerializeObject(dm));
                    }
                }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                await Startup.sendMsg(url, sendMsg);
            }
        }
    }
}
