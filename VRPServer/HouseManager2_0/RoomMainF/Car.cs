using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        public static void SendStateOfCar(Player player, Car car, ref List<string> notifyMsg)
        {
            var carIndexStr = car.IndexString;

            var obj = new BradCarState
            {
                c = "BradCarState",
                WebSocketID = player.WebSocketID,
                State = car.state.ToString(),
                carID = carIndexStr
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            notifyMsg.Add(player.FromUrl);
            notifyMsg.Add(json);
        }
        public static void SendPurposeOfCar(Player player, Car car, ref List<string> notifyMsg)
        {
            var carIndexStr = car.IndexString;

            var obj = new BradCarPurpose
            {
                c = "BradCarPurpose",
                WebSocketID = player.WebSocketID,
                Purpose = car.purpose.ToString(),
                carID = carIndexStr
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            notifyMsg.Add(player.FromUrl);
            notifyMsg.Add(json);
        }
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
                    animateData = car.animateData.animateData,
                    start = car.animateData.start
                };
                var obj = new BradCastAnimateOfSelfCar
                {
                    c = "BradCastAnimateOfSelfCar",
                    Animate = result,
                    WebSocketID = self.WebSocketID,
                    carID = getCarName() + "_" + self.Key,
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
                //for (var indexOfCar = 0; indexOfCar < 5; indexOfCar++)
                {
                    if (self.GetOthers(other.Key).getCarState() == other.getCar().changeState)
                    {

                    }
                    else
                    {
                        if (other.getCar().animateData == null)
                        {

                        }
                        else
                        {
                            var result = new
                            {
                                deltaT = Convert.ToInt32((DateTime.Now - other.getCar().animateData.recordTime).TotalMilliseconds),
                                animateData = other.getCar().animateData.animateData,
                                start = other.getCar().animateData.start,
                            };
                            var obj = new BradCastAnimateOfOthersCar2
                            {
                                c = "BradCastAnimateOfOthersCar2",
                                Animate = result,
                                WebSocketID = self.WebSocketID,
                                carID = getCarName() + "_" + other.Key,
                                parentID = other.Key,
                            };
                            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                            msgsWithUrl.Add(self.FromUrl);
                            msgsWithUrl.Add(json);
                        }
                        self.GetOthers(other.Key).setCarState(other.getCar().changeState);
                    }
                }
            }
        }

        private string getCarName()
        {
            return "car";
        }

        internal static void DiamondInCarChanged(Player player, Car car, ref List<string> notifyMsgs, string value)
        {
            Console.WriteLine($"DiamondInCarChanged 方法没有编写");
        }


        /// <summary>
        /// 广播小车状态
        /// </summary>
        /// <param name="key"></param>
        /// <param name="msgsWithUrl"></param>
        private void GetAllCarInfomationsWhenInitialize(string key, ref List<string> msgsWithUrl)
        {
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
                            addPlayerCarRecord(self, other, ref msgsWithUrl);

                        }
                        {
                            var self = players[i];
                            var other = this._Players[key];
                            addPlayerCarRecord(self, other, ref msgsWithUrl);
                        }

                    }
                }
            }
            {
                var self = this._Players[key];
                addSelfCarRecord(self, ref msgsWithUrl);
            }
        }

        private void addSelfCarRecord(Player self, ref List<string> msgsWithUrl)
        {
            //  for (var indexOfCar = 0; indexOfCar < 5; indexOfCar++)
            if (self.getCar().animateData == null)
            {

            }
            else
            {
                var result = new
                {
                    deltaT = Convert.ToInt32((DateTime.Now - self.getCar().animateData.recordTime).TotalMilliseconds),
                    animateData = self.getCar().animateData.animateData,
                    start = self.getCar().animateData.start
                };
                var obj = new BradCastAnimateOfSelfCar
                {
                    c = "BradCastAnimateOfSelfCar",
                    Animate = result,
                    WebSocketID = self.WebSocketID,
                    carID = getCarName() + "_" + self.Key,
                    parentID = self.Key,
                    CostMile = self.getCar().ability.costMiles,

                };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                msgsWithUrl.Add(self.FromUrl);
                msgsWithUrl.Add(json);
            }
        }

        private async Task sendCarStateAndPurpose(string key)
        {
            List<string> notifyMsg = new List<string>();
            var player = this._Players[key];
            {
                var car = this._Players[key].getCar();
                SendStateOfCar(player, car, ref notifyMsg);
                SendPurposeOfCar(player, car, ref notifyMsg);
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
