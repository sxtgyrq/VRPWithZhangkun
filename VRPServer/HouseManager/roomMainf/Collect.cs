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
                                                {
                                                    var sucess = CollectF(car, player, sc, ref notifyMsg);
                                                    if (sucess)
                                                    {
                                                        printState(player, car, "已经在收集金钱的路上了");
                                                    }
                                                    else
                                                    {
                                                        collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                    }
                                                }
                                                else
                                                {
                                                    collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                }
                                            }; break;
                                        case CarState.waitAtBaseStation:
                                            {
                                                /*
                                                 * 在基地进行等待。收集不需要volume 或者business
                                                 */
                                                var sucess = CollectF(car, player, sc, ref notifyMsg);
                                                if (sucess)
                                                {
                                                    printState(player, car, "已经在收集金钱的路上了");
                                                }
                                                else 
                                                {
                                                    
                                                }
                                            }; break;
                                        case CarState.waitOnRoad:
                                            {
                                                if (car.purpose == Purpose.collect || car.purpose == Purpose.@null)
                                                {
                                                    var sucess = CollectF(car, player, sc, ref notifyMsg);
                                                    if (sucess)
                                                    {
                                                        printState(player, car, "已经在收集金钱的路上了");
                                                    }
                                                    else
                                                    {
                                                        collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                    }
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

        bool CollectF(Car car, Player player, SetCollect sc, ref List<string> notifyMsg)
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
                //更改汽车的状态，使之广播！
                car.changeState++;//更改状态  
                car.purpose = Purpose.collect;

                getAllCarInfomations(sc.Key, ref notifyMsg);
                return true;
            }

            else if (car.ability.leftMile >= goMile)
            {
                printState(player, car, $"剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile},你去了回不来。所以安排返回");
                return false;
            }
            else
            {
                printState(player, car, $"剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile},去不了。所以安排返回");
                return false;
            }
        }

        /// <summary>
        /// 到达某一地点。变更里程，进行collcet交易。
        /// </summary>
        /// <param name="startT"></param>
        /// <param name="pa"></param>
        private async void setArrive(int startT, commandWithTime.placeArriving pa)
        {
            /*
             * 到达地点某地点时，说明汽车在这个地点待命。
             */
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setArrive");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setArrive正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdateCollectState = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[pa.key];
                var car = this._Players[pa.key].getCar(pa.car);
                {
                    if (car.targetFpIndex == -1)
                    {
                        throw new Exception("这个地点应该是等待的地点！");
                    }
                    if (pa.target == this.getCollectPositionTo())
                    {
                        int taxPostion = this.getCollectPositionTo();
                        long sumCollect = this.CollectMoney;
                        long sumDebet = 0;
                        foreach (var item in player.Debts)
                        {
                            sumDebet += item.Value;
                        }
                        if (sumDebet > 0)
                        {
                            Dictionary<string, long> profiles = new Dictionary<string, long>();
                            foreach (var item in player.Debts)
                            {
                                if (item.Value > 0)
                                {
                                    var profileOfOther = item.Value * sumCollect / sumDebet;
                                    profileOfOther = Math.Min(profileOfOther, 1);
                                    profiles.Add(item.Key, profileOfOther);
                                }
                                else
                                {
                                    throw new Exception("出现item.Value <= 0");
                                }
                            }
                            foreach (var item in profiles)
                            {
                                if (this._Players.ContainsKey(item.Key))
                                {
                                    this._Players[item.Key].AddTax(taxPostion, item.Value);
                                    sumCollect -= item.Value;
                                }
                                else
                                {
                                    throw new Exception("系统错误！");
                                }
                            }
                        }
                        {
                            sumCollect = Math.Min(1, sumCollect);
                            car.ability.costVolume += sumCollect;
                        }
                        this.collectPosition = this.GetRandomPosition();
                        needUpdateCollectState = true;

                        Console.WriteLine("----Do the collect process----！");
                    }
                    else
                    {
                        Console.WriteLine("----Not do the collect process----！");
                    }
                    //收集完，留在原地。
                    //var car = this._Players[cmp.key].getCar(cmp.car);
                    car.ability.costMiles += pa.costMile;//
                    carParkOnRoad(pa.target, ref car);

                    if (car.purpose == Purpose.collect && car.state == CarState.roadForCollect)
                    {
                        car.state = CarState.waitForCollectOrAttack;
                        var carKey = $"{pa.car}_{pa.key}";
                        if (this.returningRecord.ContainsKey(carKey))
                        {
                            this.returningRecord[carKey] = pa.returnPath;
                        }
                        else
                        {
                            this.returningRecord.Add(carKey, pa.returnPath);
                        }

                        //第二步，更改状态
                        car.changeState++;
                        getAllCarInfomations(pa.key, ref notifyMsg);
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
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}执行setReturn结束");
            if (needUpdateCollectState)
            {
                await CheckAllPlayersCollectState();
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
