using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async Task<string> UpdatePlayer(PlayerCheck checkItem)
        {
            bool success;
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(checkItem.Key))
                {
                    BaseInfomation.rm._Players[checkItem.Key].FromUrl = checkItem.FromUrl;
                    BaseInfomation.rm._Players[checkItem.Key].WebSocketID = checkItem.WebSocketID;

                    BaseInfomation.rm._Players[checkItem.Key].others = new Dictionary<string, OtherPlayers>();
                    //this.sendPrometeState(checkItem.FromUrl, checkItem.WebSocketID);
                    success = true;
                    BaseInfomation.rm._Players[checkItem.Key].PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"bussiness",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        };
                    BaseInfomation.rm._Players[checkItem.Key].Collect = -1;
                }
                else
                {
                    success = false;
                }
            }
            if (success)
            {
                await CheckAllPromoteState(checkItem.Key);
                await CheckCollectState(checkItem.Key);
                await SendAllTax(checkItem.Key);
                return "ok";
            }
            else
            {
                return "ng";
            }
        }

        class TaxWebObj
        {

        }
        
    }
}
