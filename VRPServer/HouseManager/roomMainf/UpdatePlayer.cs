using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal string UpdatePlayer(PlayerCheck checkItem)
        {
            //   try
            {
                bool success;
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(checkItem.Key))
                    {
                        BaseInfomation.rm._Players[checkItem.Key].FromUrl = checkItem.FromUrl;
                        BaseInfomation.rm._Players[checkItem.Key].WebSocketID = checkItem.WebSocketID;

                        //BaseInfomation.rm._Players[checkItem.Key].others = new Dictionary<string, OtherPlayers>();
                        BaseInfomation.rm._Players[checkItem.Key].initializeOthers();
                        //this.sendPrometeState(checkItem.FromUrl, checkItem.WebSocketID);
                        success = true;
                        BaseInfomation.rm._Players[checkItem.Key].PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"business",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        };
                        BaseInfomation.rm._Players[checkItem.Key].Collect = -1;
                        BaseInfomation.rm._Players[checkItem.Key].OpenMore++;
                        BaseInfomation.rm._Players[checkItem.Key].clearUsedRoad();
                    }
                    else
                    {
                        success = false;
                    }
                }
                if (success)
                {
                    return "ok";
                }
                else
                {
                    return "ng";
                }
            }
            //catch
            //{
            //    return "ng";
            //}
        }

        class TaxWebObj
        {

        }

    }
}
