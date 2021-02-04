using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async void SetReturn()
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                List<string> keysNeedToSetReturn = new List<string>();
                foreach (var item in this._Players)
                {
                    if (item.Value.Bust)
                    {
                        keysNeedToSetReturn.Add(item.Key);
                    }
                }
                for (var i = 0; i < keysNeedToSetReturn.Count; i++)
                {
                    List<int> indexAll = new List<int>()
                    {
                        0,1,2,3,4
                    };
                    var needToSetReturn = (from item in indexAll
                                           where
                    this._Players[keysNeedToSetReturn[i]].getCar(item).state == CarState.waitForCollectOrAttack ||
                    this._Players[keysNeedToSetReturn[i]].getCar(item).state == CarState.waitForTaxOrAttack ||
                    this._Players[keysNeedToSetReturn[i]].getCar(item).state == CarState.waitOnRoad
                                           select item).ToList();
                    for (var j = 0; j < needToSetReturn.Count; j++)
                    {
                        var carName = getCarName(needToSetReturn[j]);
                        var car = this._Players[keysNeedToSetReturn[i]].getCar(needToSetReturn[j]);
                        var returnPath_Record = this._Players[keysNeedToSetReturn[i]].returningRecord[carName];

                        var key = keysNeedToSetReturn[i];
                        Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
                        {
                            c = "returnning",
                            key = key,
                            car = carName,
                            returnPath = returnPath_Record,
                            target = car.targetFpIndex,
                            changeType = "sys-return",
                        }));
                        th.Start();
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
                        List<int> indexAll = new List<int>()
                        {
                            0,1,2,3,4
                        };
                        var countAtBaseStation = (from indexItem in indexAll
                                                  where
                           item.Value.getCar(indexItem).state == CarState.waitAtBaseStation
                                                  select indexItem).Count();
                        if (countAtBaseStation == 5)
                        {
                            keysNeedToClear.Add(item.Key);
                            //  this._Players.Remove(keysNeedToClear[i]);

                            //for (var j = 0; j < keysOfAll.Count; j++)
                            //{
                            //    if (this._Players[keysOfAll[j]].others.ContainsKey(keysNeedToClear[i]))
                            //    {
                            //        this._Players[keysOfAll[j]].others.Remove(keysNeedToClear[i]);
                            //    }
                            //    if (this._Players[keysOfAll[j]].DebtsContainsKey(keysNeedToClear[i]))
                            //    {
                            //        this._Players[keysOfAll[j]].DebtsRemove(keysNeedToClear[i]);
                            //    }

                            //}
                            //continue;
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
