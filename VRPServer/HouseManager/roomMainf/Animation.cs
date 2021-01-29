using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal void SetAnimateChanged(Player player, Car car, ref List<string> notifyMsg)
        {
            lock (this.PlayerLock)
            {
                var key = player.Key;
                var players = getGetAllPlayer();
                for (var i = 0; i < players.Count; i++)
                {
                    if (players[i].Key == key)
                    {

                    }
                    else
                    {
                        {
                            /*
                             * 告诉自己，场景中有哪些别人的车！
                             * 告诉别人，场景中有哪些车是我的的！
                             */
                            {
                                var self = this._Players[key];
                                var other = players[i];
                                addPlayerCarRecord(self, other, ref notifyMsg);

                            }
                            {
                                var self = players[i];
                                var other = this._Players[key];
                                addPlayerCarRecord(self, other, ref notifyMsg);
                            }

                        }
                    }
                }
                {
                    var self = this._Players[key];
                    addSelfCarSingleRecord(self, car, ref notifyMsg);
                }
            }
        }

        private void addSelfCarSingleRecord(Player self, Car car, ref List<string> msgsWithUrl)
        {
            if (car.animateData == null)
            { }
            else
            {
                var result = new
                {
                    deltaT = Convert.ToInt32((DateTime.Now - car.animateData.recordTime).TotalMilliseconds),
                    animateData = car.animateData.animateData
                };
                var obj = new BradCastAnimateOfSelfCar
                {
                    c = "BradCastAnimateOfSelfCar",
                    Animate = result,
                    WebSocketID = self.WebSocketID,
                    carID = getCarName(car.carIndex) + "_" + self.Key,
                    parentID = self.Key,
                    CostMile = car.ability.costMiles,

                };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                msgsWithUrl.Add(self.FromUrl);
                msgsWithUrl.Add(json);
            } 
        }
    }
}
