using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async Task<string> updateCollect(SetCollect sc)
        {
            if (string.IsNullOrEmpty(sc.car))
            {
                return "";
            }
            else if (!(sc.car == "carA" || sc.car == "carB" || sc.car == "carC" || sc.car == "carD" || sc.car == "carE"))
            {
                return "";
            }
            else if (string.IsNullOrEmpty(sc.cType))
            {
                return "";
            }
            else if (!(sc.cType == "findWork"))
            {
                return "";
            }

            else
            {
                var carIndex = getCarIndex(sc.car);
                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sc.Key))
                    {
                        //if(sp.pType=="mi")
                        switch (sc.cType)
                        {
                            case "findWork":
                                {
                                    var player = this._Players[sc.Key];
                                    var car = this._Players[sc.Key].getCar(carIndex);
                                    switch (car.state)
                                    {
                                        case CarState.waitForCollectOrAttack:
                                            {
                                                if (car.ability.leftVolume > 0)
                                                    collect(car, player, sc, ref notifyMsg);
                                                else
                                                {
                                                    carsVolumeIsFullMustReturn(car, player, sc, ref notifyMsg);
                                                }
                                            }; break;
                                        case CarState.waitAtBaseStation:
                                            {
                                                collect(car, player, sc, ref notifyMsg);
                                            }; break;
                                        case CarState.waitOnRoad:
                                            {
                                                if (car.purpose == Purpose.collect || car.purpose == Purpose.@null)
                                                {
                                                    collect(car, player, sc, ref notifyMsg);
                                                }
                                                else
                                                {
                                                    throw new Exception("CarState.waitOnRoad car.purpose!= Purpose.collect");
                                                }
                                            }; break;

                                    }
                                }; break;
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
                return "";
            }
        }

        void collect(Car car, Player player, SetCollect sc, ref List<string> notifyMsg)
        {
            var from = GetFromWhenUpdateCollect(this._Players[sc.Key], sc.cType, car);
            var to = getCollectPositionTo();//  this.promoteMilePosition;
            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var fbBase = Program.dt.GetFpByIndex(player.StartFPIndex);
            var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            var returnPath = Program.dt.GetAFromB(fp2, fbBase.FastenPositionID);
            var goMile = GetMile(goPath);
            var returnMile = GetMile(returnPath);
            if (car.ability.leftMile >= goMile + returnMile)
            {
                car.targetFpIndex = to;
                car.purpose = Purpose.collect;

                // car.ability.costMiles += goMile;
                var speed = car.ability.Speed;
                int startT = 0;
                List<Data.PathResult> result;
                if (car.state == CarState.waitAtBaseStation)
                    result = getStartPositon(fp1, sc.car, ref startT);
                else if (car.state == CarState.waitForCollectOrAttack)
                    result = new List<Data.PathResult>();
                else if (car.state == CarState.waitOnRoad && car.ability.diamondInCar == "")
                {
                    result = new List<Data.PathResult>();
                }
                else
                {
                    throw new Exception($"未知情况！{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
                }
                car.state = CarState.roadForCollect;
                Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
                result.RemoveAll(item => item.t0 == item.t1);
                car.animateData = new AnimateData()
                {
                    animateData = result,
                    recordTime = DateTime.Now
                };
                //  int carState = car.changeState + 1;
                Thread th = new Thread(() => setArrive(startT, new commandWithTime.placeArriving()
                {
                    c = "placeArriving",
                    key = sc.Key,
                    car = sc.car,
                    returnPath = returnPath,
                    target = to,
                    costMile = goMile
                }));
                th.Start();
                //this.loopCommands.Add();

                //  this.breakMiniSecods = 0;
                //第二步，更改状态
                //car.changeState++;//更改状态


                // car.state = CarState.buying;


                getAllCarInfomations(sc.Key, ref notifyMsg);
            }

            else if (car.ability.leftMile >= goMile)
            {

                Console.Write($"现在剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile}");
                Console.Write($"你去了回不来");
                Console.Write($"该汽车被安排回去了");
                if (car.state == CarState.waitForCollectOrAttack)
                {
                    int startT = 1;
                    var carKey = $"{sc.car}_{sc.Key}";
                    var returnPath_Record = this.returningRecord[carKey];
                    Thread th = new Thread(() => setReturn(startT, new commandWithTime.returnning()
                    {
                        c = "returnning",
                        key = sc.Key,
                        car = sc.car,
                        returnPath = returnPath_Record,
                        target = from,
                        changeType = "collect-return",
                    }));
                    th.Start();
                }
                else if (car.state == CarState.waitAtBaseStation)
                {
                    //Console.Write($"现在剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile}");
                    //Console.Write($"你去了回不来");
                    //Console.Write($"该汽车被安排回去了");
                }
                else
                {
                    throw new Exception("没有这种情况！");
                }
            }
            else
            {
                Console.Write($"现在剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile}");
                Console.Write($"你去不了");
                if (car.state == CarState.waitForCollectOrAttack)
                {
                    int startT = 1;
                    var carKey = $"{sc.car}_{sc.Key}";
                    var returnPath_Record = this.returningRecord[carKey];
                    Thread th = new Thread(() => setReturn(startT, new commandWithTime.returnning()
                    {
                        c = "returnning",
                        key = sc.Key,
                        car = sc.car,
                        returnPath = returnPath_Record,
                        target = from,
                        changeType = "collect-return",
                    }));
                    th.Start();
                }
                else if (car.state == CarState.waitAtBaseStation)
                {
                    //Console.Write($"现在剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile}");
                    //Console.Write($"你去了回不来");
                    //Console.Write($"该汽车被安排回去了");
                }
                else
                {
                    throw new Exception("没有这种情况！");
                }
            }
        }

        /// <summary>
        /// 获取出发地点
        /// </summary>
        /// <param name="player"></param>
        /// <param name="cType"></param>
        /// <param name="car"></param>
        /// <returns></returns>
        private int GetFromWhenUpdateCollect(Player player, string cType, Car car)
        {
            switch (cType)
            {
                case "findWork":
                    {
                        switch (car.state)
                        {
                            case CarState.waitAtBaseStation:
                                {
                                    if (car.targetFpIndex != -1)
                                    {
                                        //出现这种情况，应该是回了基站里没有初始
                                        throw new Exception("参数混乱");
                                    }
                                    else if (car.purpose == Purpose.@null)
                                    {
                                        return player.StartFPIndex;
                                    }
                                    else
                                    {
                                        //出现这种情况，应该是回了基站里没有初始
                                        throw new Exception("参数混乱");
                                    }
                                };
                            case CarState.waitForCollectOrAttack:
                                {
                                    if (car.targetFpIndex == -1)
                                    {
                                        throw new Exception("参数混乱");
                                    }
                                    else if (car.purpose == Purpose.collect)
                                    {
                                        return car.targetFpIndex;
                                    }
                                    else
                                    {
                                        //出现这种情况，应该是回了基站里没有初始
                                        throw new Exception("参数混乱");
                                    }
                                };
                            case CarState.waitOnRoad:
                                {
                                    if (car.targetFpIndex == -1)
                                    {
                                        throw new Exception("参数混乱");
                                    }
                                    else if (car.purpose == Purpose.collect || car.purpose == Purpose.@null)
                                    {
                                        return car.targetFpIndex;
                                    }
                                    else
                                    {
                                        //出现这种情况，应该是回了基站里没有初始
                                        throw new Exception("参数混乱");
                                    }
                                }; break;
                        };
                    }; break;
            }
            throw new Exception("非法调用");
        }
    }
}
