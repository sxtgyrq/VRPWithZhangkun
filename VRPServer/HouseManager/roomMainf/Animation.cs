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

        private void addPlayerCarRecord(Player self, Player other, ref List<string> msgsWithUrl)
        {
            //这是发送给self的消息
            //throw new NotImplementedException();
            if (self.othersContainsKey(other.Key))
            {
                for (var indexOfCar = 0; indexOfCar < 5; indexOfCar++)
                {
                    if (self.GetOthers(other.Key).getCarState(indexOfCar) == other.getCar(indexOfCar).changeState)
                    {

                    }
                    else
                    {
                        if (other.getCar(indexOfCar).animateData == null)
                        {

                        }
                        else
                        {
                            var result = new
                            {
                                deltaT = Convert.ToInt32((DateTime.Now - other.getCar(indexOfCar).animateData.recordTime).TotalMilliseconds),
                                animateData = other.getCar(indexOfCar).animateData.animateData
                            };
                            var obj = new BradCastAnimateOfOthersCar
                            {
                                c = "BradCastAnimateOfOthersCar",
                                Animate = result,
                                WebSocketID = self.WebSocketID,
                                carID = getCarName(indexOfCar) + "_" + other.Key,
                                parentID = other.Key,
                            };
                            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                            msgsWithUrl.Add(self.FromUrl);
                            msgsWithUrl.Add(json);
                        }
                        self.GetOthers(other.Key).setCarState(indexOfCar, other.getCar(indexOfCar).changeState);
                    }
                }
            }
        }


        private void addPlayerCarRecordxxx(Player self, Player other, ref List<string> msgsWithUrl)
        {
            //这是发送给self的消息
            //throw new NotImplementedException();
            if (self.othersContainsKey(other.Key))
            {
                var otherRecord = self.GetOthers(other.Key); ;
                //if (otherRecord.brokenParameterT1Record != self.brokenParameterT1)
                //{
                //    otherRecord.brokenParameterT1Record = self.brokenParameterT1;
                //}
            }
        }
    }
}
