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
        internal async Task<string> updatePromote(SetPromote sp)
        {
            //{"Key":"1faff8e98891e33f6defc9597354c08b","pType":"mile","car":"carE","c":"SetPromote"}
            //  Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(sp)}");
            //return "";
            if (string.IsNullOrEmpty(sp.car))
            {
                return "";
            }
            else if (!(sp.car == "carA" || sp.car == "carB" || sp.car == "carC" || sp.car == "carD" || sp.car == "carE"))
            {
                return "";
            }
            else if (string.IsNullOrEmpty(sp.pType))
            {
                return "";
            }
            else if (!(sp.pType == "mile" || sp.pType == "bussiness" || sp.pType == "volume" || sp.pType == "speed"))
            {
                return "";
            }
            else
            {
                var carIndex = getCarIndex(sp.car);
                List<string> notifyMsg = new List<string>();
                var player = this._Players[sp.Key];
                var car = player.getCar(carIndex);
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sp.Key))
                    {
                        //if(sp.pType=="mi")
                        switch (sp.pType)
                        {
                            case "mile":
                            case "bussiness":
                            case "volume":
                            case "speed":
                                {
                                    // var car = this._Players[sp.Key].getCar(carIndex);
                                    switch (car.state)
                                    {
                                        case CarState.waitAtBaseStation:
                                            {
                                                promote(player, car, sp, ref notifyMsg);
                                            }; break;
                                        case CarState.waitOnRoad:
                                            {
                                                if (car.ability.diamondInCar == "")
                                                {

                                                    promote(player, car, sp, ref notifyMsg);
                                                }
                                                else
                                                {
                                                    throw new Exception("在路上走的车，有了宝石，居然没返回！");
                                                }
                                            }; break;
                                        case CarState.waitForCollectOrAttack:
                                            {
                                                promote(player, car, sp, ref notifyMsg);
                                            }; break;
                                    }
                                    //this._Players[sp.Key].PromoteState[sp.pType]
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

        private int getFromWhenUpdatePromote(Player player, Car car)
        {
            switch (car.state)
            {
                case CarState.waitAtBaseStation:
                    {
                        return player.StartFPIndex;
                    };
                case CarState.waitOnRoad:
                    {
                        //上一个的目标
                        if (
                            (car.purpose == Purpose.@null || car.purpose == Purpose.collect) &&
                            car.ability.diamondInCar == "")
                            return car.targetFpIndex;
                        else
                        {
                            throw new Exception("");
                        }
                    };
                case CarState.waitForCollectOrAttack:
                    {
                        return car.targetFpIndex;
                    };
                default:
                    {
                        throw new Exception("错误的汽车状态");
                    }
            }
        }

        private async void setDiamondOwner(int startT, commandWithTime.diamondOwner dor)
        {
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setDiamondOwner");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setDiamondOwner正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdatePromoteState = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[dor.key];
                var car = this._Players[dor.key].getCar(dor.car);
                // car.targetFpIndex = this._Players[dor.key].StartFPIndex;
                if ((dor.changeType == "mile" || dor.changeType == "bussiness" || dor.changeType == "volume" || dor.changeType == "speed")
                    && car.state == CarState.buying)
                {
#warning 这里需要进行拆分，拆分出一个购买的过程。
                    // cons
                    // if(this.pla cmp.key)
                    if (car.targetFpIndex == -1)
                    {
                        throw new Exception("居然来了一个没有目标的车！！！");
                    }
                    if (car.ability.diamondInCar != "")
                    {
                        throw new Exception("怎么能让满载车出来购买？");
                    }
                    if (!(car.purpose == Purpose.collect || car.purpose == Purpose.@null))
                    {
                        throw new Exception($"错误的purpose:{car.purpose}");
                    }
                    if (dor.target == this.getPromoteState(dor.changeType))
                    {
                        setPromtePosition(dor.changeType);
                        //this.promoteMilePosition = GetRandomPosition();
                        needUpdatePromoteState = true;
                        car.ability.diamondInCar = dor.changeType;
                        Console.WriteLine("执行购买过程！需要立即执行返回！");
                        Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
                        {
                            c = "returnning",
                            key = dor.key,
                            car = dor.car,
                            returnPath = dor.returnPath,//returnPath_Record,
                            target = dor.target,
                            changeType = dor.changeType,
                        }));
                        th.Start();
                        ;
                    }
                    else
                    {
                        Console.WriteLine("由于迟到没有执行购买过程！");

                        car.ability.costMiles += dor.costMile;
                        carParkOnRoad(dor.target, ref car);

                        if ((car.purpose == Purpose.collect || car.purpose == Purpose.@null) && car.state == CarState.buying)
                        {
                            car.state = CarState.waitOnRoad;
                            var carKey = $"{dor.car}_{dor.key}";
                            if (this.returningRecord.ContainsKey(carKey))
                            {
                                this.returningRecord[carKey] = dor.returnPath;
                            }
                            else
                            {
                                this.returningRecord.Add(carKey, dor.returnPath);
                            }

                            //第二步，更改状态
                            car.changeState++;
                            getAllCarInfomations(dor.key, ref notifyMsg);
                        }
                        else
                        {
                            throw new Exception($"错误的目标{car.purpose } 和 状态{car.state}");
                        }
                        // car.state = CarState.waitOnRoad;
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
            if (needUpdatePromoteState)
            {
                await CheckAllPlayersPromoteState(dor.changeType);
            }
        }

        public void promote(Player player, Car car, SetPromote sp, ref List<string> notifyMsg)
        {
            var from = this.getFromWhenUpdatePromote(player, car);
            var to = getPromotePositionTo(sp.pType);//  this.promoteMilePosition;

            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var baseFp = Program.dt.GetFpByIndex(player.StartFPIndex);

            var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            var returnPath = Program.dt.GetAFromB(fp2, baseFp.FastenPositionID);

            var goMile = getMile(goPath);
            var returnMile = getMile(returnPath);


            //第一步，计算去程和回程。
            if (car.ability.leftMile >= goMile + returnMile)
            {
                //car.ability.costMiles += (goMile + returnMile);
                car.targetFpIndex = to;
                Console.WriteLine($"{car.name}的目标设置成了{Program.dt.GetFpByIndex(to).FastenPositionName}");
                var speed = car.ability.Speed;
                int startT = 0;
                List<Data.PathResult> result;
                if (car.state == CarState.waitOnRoad)
                {
                    result = new List<Data.PathResult>();
                }
                else if (car.state == CarState.waitAtBaseStation)
                {
                    result = getStartPositon(fp1, sp.car, ref startT);
                }
                else if (car.state == CarState.waitForCollectOrAttack)
                {
                    result = new List<Data.PathResult>();
                }
                else
                {
                    throw new Exception("错误的汽车类型！！！");
                }
                Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
                result.RemoveAll(item => item.t0 == item.t1);
                car.animateData = new AnimateData()
                {
                    animateData = result,
                    recordTime = DateTime.Now
                };
                Thread th = new Thread(() => setDiamondOwner(startT, new commandWithTime.diamondOwner()
                {
                    c = "diamondOwner",
                    key = sp.Key,
                    car = sp.car,
                    returnPath = returnPath,
                    target = to,//新的起点
                    changeType = sp.pType,
                    costMile = goMile
                }));
                th.Start();
                car.changeState++;//更改状态
                car.state = CarState.buying;
                getAllCarInfomations(sp.Key, ref notifyMsg);



            }

            else if (car.ability.leftMile >= goMile)
            {
                Console.Write($"去程{goMile}，回程{returnMile}");
                Console.Write($"你去了回不来");
            }
            else
            {
                Console.Write($"去程{goMile}，回程{returnMile}");
                Console.Write($"你去不了");
            }
        }
    }
}

/*
 * 测试日志。 
 * -----BEGIN BITCOIN SIGNED MESSAGE-----
 * "从基站出发-获取金钱-获取宝石-成功-返回基站"测试成功
 * -----BEGIN SIGNATURE-----
 * 1MhoP61wXyV5uCAZk36JFFQfV95mzfLFdw
 * HzsnYZjRMb7prothTDONMr0M98Fhpgj/GgOb+tWFfVTMM/pvgRwXvhHvU36BPxnPtAepb775XVp4zLDTNQuAqng=
 * -----END BITCOIN SIGNED MESSAGE-----
 * 
 * 
 */
