using System;
using System.Collections.Generic;
using System.Text;
using static HouseManager2_0.Car;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        internal async void ClearPlayers()
        {
            //   return;
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                List<string> keysOfAll = new List<string>();
                List<string> keysNeedToClear = new List<string>();
                foreach (var item in this._Players)
                {

                    if (item.Value.Bust)
                    {
                        if (item.Value.getCar().state == CarState.waitAtBaseStation) 
                        {
                            keysNeedToClear.Add(item.Key); 
                        }
                        else
                        {
                            keysOfAll.Add(item.Key);
                        }
                    }
                    else
                    {
                        keysOfAll.Add(item.Key);
                    }
                }

                for (var i = 0; i < keysNeedToClear.Count; i++)
                {
                    this._Players.Remove(keysNeedToClear[i]);

                    for (var j = 0; j < keysOfAll.Count; j++)
                    {
                        if (this._Players[keysOfAll[j]].othersContainsKey(keysNeedToClear[i]))
                        {
                            this._Players[keysOfAll[j]].othersRemove(keysNeedToClear[i], ref notifyMsg);
                        }
                        if (this._Players[keysOfAll[j]].DebtsContainsKey(keysNeedToClear[i]))
                        {
                            this._Players[keysOfAll[j]].DebtsRemove(keysNeedToClear[i], ref notifyMsg);
                        }
                        // if (this._Players[keysOfAll[j]].(keysNeedToClear[i])).
                    }
                    continue;
                }

            }

            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                //   Console.WriteLine($"url:{url}");
                await Startup.sendMsg(url, sendMsg);
            }
        }
    }
}
