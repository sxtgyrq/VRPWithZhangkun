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
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if ((cmp.changeType == "mile" || cmp.changeType == "business" || cmp.changeType == "volume" || cmp.changeType == "speed")
                  && car.state == CarState.waitOnRoad)
                {
                    /*
                     * 此项对应的条件是在找能力提升宝石过程中，里程不够然后安排返回。
                     * 
                     */
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == CollectReturn && (car.state == CarState.waitForCollectOrAttack || car.state == CarState.waitOnRoad))
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "tax-return" && (car.state == CarState.waitForTaxOrAttack || car.state == CarState.waitOnRoad))
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "Attack" && car.state == CarState.roadForAttack && car.purpose == Purpose.attack)
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == AttackFailedReturn)
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "sys-return")
                {
                    //if (car.state == CarState.roadForAttack)
                    {
                        ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                    }
                }
                else if (cmp.changeType == "orderToReturn")
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "Bust" && car.state == CarState.roadForAttack && car.purpose == Purpose.attack)
                {
                    ReturnThenSetComeBack(player, car, cmp, ref notifyMsg);
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

       


        internal async Task<string> OrderToReturn(OrderToReturn otr)
        {
            if (string.IsNullOrEmpty(otr.car))
            {
                return "";
            }
            else if (!(otr.car == "carA" || otr.car == "carB" || otr.car == "carC" || otr.car == "carD" || otr.car == "carE"))
            {
                return "";
            }
            else
            {

                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {

                    if (this._Players.ContainsKey(otr.Key))
                    {
                        if (this._Players[otr.Key].Bust) { }
                        else
                        {
                            var player = this._Players[otr.Key];
                            var carIndex = getCarIndex(otr.car);
                            var car = this._Players[otr.Key].getCar(carIndex);
                            switch (car.state)
                            {
                                case CarState.waitOnRoad:
                                    {
                                        SendOrderToReturnWhenCarIsStoping(otr, car);
                                    }; break;
                                case CarState.waitForCollectOrAttack:
                                    {
                                        SendOrderToReturnWhenCarIsStoping(otr, car);
                                    }; break;
                                case CarState.waitForTaxOrAttack:
                                    {
                                        SendOrderToReturnWhenCarIsStoping(otr, car);
                                    }; break;
                            }
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


        private void SendOrderToReturnWhenCarIsStoping(OrderToReturn otr, Car car)
        {
            // var carKey = $"{sp.car}_{sp.Key}";
            var returnPath = this._Players[otr.Key].returningRecord[otr.car];//  this.returningRecord[carKey];
            Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
            {
                c = "returnning",
                key = otr.Key,
                car = otr.car,
                returnPath = returnPath,//returnPath_Record,
                target = car.targetFpIndex,//这里的target 实际上是returnning 的起点,是汽车的上一个目标
                changeType = "orderToReturn",
            }));
            th.Start();
        }

        private void ReturnThenSetComeBack(Player player, Car car, commandWithTime.returnning cmp, ref List<string> notifyMsg)
        {
            var speed = car.ability.Speed;
            int startT = 0;
            var result = new List<Data.PathResult>();
            Program.dt.GetAFromBPoint(cmp.returnPath, Program.dt.GetFpByIndex(cmp.target), speed, ref result, ref startT);
            getEndPositon(Program.dt.GetFpByIndex(this._Players[cmp.key].StartFPIndex), cmp.car, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);

            car.setState(this._Players[cmp.key], ref notifyMsg, CarState.returning);
            // car.state = CarState.returning;
            Thread th = new Thread(() => setBack(startT, new commandWithTime.comeBack()
            {
                c = "comeBack",
                car = cmp.car,
                key = cmp.key
            }));
            th.Start();

            //var player = this._Players[cmp.key];
            car.setAnimateData(player, ref notifyMsg, new AnimateData()
            {
                animateData = result,
                recordTime = DateTime.Now
            });
            //car.animateData = new AnimateData()
            //{
            //    animateData = result,
            //    recordTime = DateTime.Now
            //};
            //第二步，更改状态
            //car.changeState++;
            //getAllCarInfomations(cmp.key, ref notifyMsg);
        }
        private async void setBack(int startT, commandWithTime.comeBack comeBack)
        {
            Thread.Sleep(startT);
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                var player = this._Players[comeBack.key];
                var car = player.getCar(comeBack.car);
                if (car.state == CarState.returning)
                {
                    //  var moneyCanSave1 = player.GetMoneyCanSave();

                    player.MoneySet(player.Money + car.ability.costBusiness + car.ability.costVolume, ref notifyMsg);
                    //player.Money += car.ability.costBusiness;
                    //player.Money += car.ability.costVolume;

                    //if (car.ability.subsidize > 0)
                    //{
                    //    player.setSupportToPlayMoney(player.SupportToPlayMoney + car.ability.subsidize, ref notifyMsg);
                    //    //player.SupportToPlay.Money += car.ability.subsidize;
                    //}
                    if (!string.IsNullOrEmpty(car.ability.diamondInCar))
                    {
                        player.PromoteDiamondCount[car.ability.diamondInCar]++;
                        SendPromoteCountOfPlayer(car.ability.diamondInCar, player, ref notifyMsg);
                    }
                    car.ability.Refresh(player, car, ref notifyMsg);
                    car.Refresh(player, ref notifyMsg);

                    //AbilityChanged(player, car, ref notifyMsg, "business");
                    //AbilityChanged(player, car, ref notifyMsg, "volume");
                    //AbilityChanged(player, car, ref notifyMsg, "mile");

                    printState(player, car, "执行了归位");
                    //  var moneyCanSave2 = player.GetMoneyCanSave();
                    //if (moneyCanSave1 != moneyCanSave2)
                    {
                        // MoneyCanSaveChanged(player, moneyCanSave2, ref notifyMsg);
                    }
                }
                else
                {
                    throw new Exception($"{car.name}返回是状态为{this._Players[comeBack.key].getCar(comeBack.car).state}");
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

        
    }
}
