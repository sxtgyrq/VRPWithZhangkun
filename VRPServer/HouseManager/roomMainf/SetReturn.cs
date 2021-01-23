using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        /// <summary>
        /// set return 本身自带广播功能
        /// </summary>
        /// <param name="startT"></param>
        /// <param name="cmp"></param>
        private async void setReturn(int startT, commandWithTime.returnning cmp)
        {
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setReturn");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setReturn正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdatePromoteState = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[cmp.key];
                var car = this._Players[cmp.key].getCar(cmp.car);
                car.targetFpIndex = this._Players[cmp.key].StartFPIndex;
                if ((cmp.changeType == "mile" || cmp.changeType == "business" || cmp.changeType == "volume" || cmp.changeType == "speed")
                    && car.state == CarState.buying)
                {
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if ((cmp.changeType == "mile" || cmp.changeType == "business" || cmp.changeType == "volume" || cmp.changeType == "speed")
                  && car.state == CarState.waitOnRoad)
                {
                    /*
                     * 此项对应的条件是在找能力提升宝石过程中，里程不够然后安排返回。
                     * 
                     */
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "collect-return" && (car.state == CarState.waitForCollectOrAttack || car.state == CarState.waitOnRoad))
                {
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "tax-return" && (car.state == CarState.waitForTaxOrAttack || car.state == CarState.waitOnRoad))
                {
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "Attack" && car.state == CarState.roadForAttack && car.purpose == Purpose.attack)
                {
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "sys-return")
                {
                    //if (car.state == CarState.roadForAttack)
                    {
                        ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                    }
                }

                else
                {

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(car);

                    for (var i = 0; i < 100; i++)
                    {
                        Console.WriteLine("↓↓↓↓↓出现异常↓↓↓↓↓");
                    }
                    Console.WriteLine(json);
                    DebugRecord.FileRecord($@"-----setReturn 以下情况未注册-----
{json}
-----setReturn 以下情况未注册-----");
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
                await CheckAllPlayersPromoteState(cmp.changeType);
            }
        }

        internal async void ClearPlayers()
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                List<string> keysOfAll = new List<string>();
                List<string> keysNeedToClear = new List<string>();
                foreach (var item in this._Players)
                {

                    if (item.Value.Bust)
                    {
                        keysNeedToClear.Add(item.Key);
                    }
                    else
                    {
                        keysOfAll.Add(item.Key);
                    }
                }



                for (var i = 0; i < keysNeedToClear.Count; i++)
                {
                    List<int> indexAll = new List<int>()
                    {
                        0,1,2,3,4
                    };
                    var countAtBaseStation = (from item in indexAll
                                              where
                       this._Players[keysNeedToClear[i]].getCar(item).state == CarState.waitAtBaseStation
                                              select item).Count();
                    if (countAtBaseStation == 5)
                    {
                        this._Players.Remove(keysNeedToClear[i]);

                        for (var j = 0; j < keysOfAll.Count; j++)
                        {
                            if (this._Players[keysOfAll[j]].others.ContainsKey(keysNeedToClear[i]))
                            {
                                this._Players[keysOfAll[j]].others.Remove(keysNeedToClear[i]);
                            }
                            if (this._Players[keysOfAll[j]].Debts.ContainsKey(keysNeedToClear[i]))
                            {
                                this._Players[keysOfAll[j]].Debts.Remove(keysNeedToClear[i]);
                            }

                        }
                        continue;
                    }

                    var needToSetReturn = (from item in indexAll
                                           where
                    this._Players[keysNeedToClear[i]].getCar(item).state == CarState.waitForCollectOrAttack ||
                    this._Players[keysNeedToClear[i]].getCar(item).state == CarState.waitForTaxOrAttack ||
                    this._Players[keysNeedToClear[i]].getCar(item).state == CarState.waitOnRoad
                                           select item).ToList();
                    for (var j = 0; j < needToSetReturn.Count; j++)
                    {
                        var carName = getCarName(needToSetReturn[j]);
                        var car = this._Players[keysNeedToClear[i]].getCar(needToSetReturn[j]);
                        var returnPath_Record = this._Players[keysNeedToClear[i]].returningRecord[carName];


                        Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
                        {
                            c = "returnning",
                            key = keysNeedToClear[i],
                            car = carName,
                            returnPath = returnPath_Record,
                            target = car.targetFpIndex,
                            changeType = "sys-return",
                        }));
                        th.Start();
                        car.changeState++;//更改状态   
                        getAllCarInfomations(keysNeedToClear[i], ref notifyMsg);
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

        private void ReturnThenSetComeBack(Car car, commandWithTime.returnning cmp, ref List<string> notifyMsg)
        {
            var speed = car.ability.Speed;
            int startT = 0;
            var result = new List<Data.PathResult>();
            Program.dt.GetAFromBPoint(cmp.returnPath, Program.dt.GetFpByIndex(cmp.target), speed, ref result, ref startT);
            getEndPositon(Program.dt.GetFpByIndex(this._Players[cmp.key].StartFPIndex), cmp.car, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);

            car.state = CarState.returning;
            Thread th = new Thread(() => setBack(startT, new commandWithTime.comeBack()
            {
                c = "comeBack",
                car = cmp.car,
                key = cmp.key
            }));
            th.Start();


            car.animateData = new AnimateData()
            {
                animateData = result,
                recordTime = DateTime.Now
            };
            //第二步，更改状态
            car.changeState++;
            getAllCarInfomations(cmp.key, ref notifyMsg);
        }
        private void setBack(int startT, commandWithTime.comeBack comeBack)
        {
            Thread.Sleep(startT);
            lock (this.PlayerLock)
            {
                var player = this._Players[comeBack.key];
                var car = player.getCar(comeBack.car);
                if (car.state == CarState.returning)
                {
                    player.Money += car.ability.costBusiness;
                    player.Money += car.ability.costVolume;
                    if (car.ability.subsidize > 0)
                    {
                        player.SupportToPlay.Money += car.ability.subsidize;
                    }
                    if (!string.IsNullOrEmpty(car.ability.diamondInCar))
                    {
                        player.PromoteDiamondCount[car.ability.diamondInCar]++;
                    }
                    car.ability.Refresh();
                    car.Refresh();
                    printState(player, car, "执行了归位");
                }
                else
                {
                    throw new Exception($"{car.name}返回是状态为{this._Players[comeBack.key].getCar(comeBack.car).state}");
                }
            }
        }

      
    }
}
