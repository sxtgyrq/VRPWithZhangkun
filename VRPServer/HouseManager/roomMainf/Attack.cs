using CommonClass;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async Task<string> updateAttack(SetAttack sa)
        {
            //  Attack a = new Attack(sa, this);
            //a.doAttack();
            if (string.IsNullOrEmpty(sa.car))
            {
                return "";
            }
            else if (!(sa.car == "carA" || sa.car == "carB" || sa.car == "carC" || sa.car == "carD" || sa.car == "carE"))
            {
                return "";
            }
            else if (!(this._Players.ContainsKey(sa.targetOwner)))
            {
                return "";
            }
            else if (this._Players[sa.targetOwner].StartFPIndex != sa.target)
            {
                return "";
            }
            else if (sa.targetOwner == sa.Key)
            {
#warning 这里要加日志，出现了自己攻击自己！！！
                return "";
            }
            else
            {
                var carIndex = getCarIndex(sa.car);
                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sa.Key))
                    {
                        {
                            //  case "findWork":
                            {
                                var player = this._Players[sa.Key];
                                var car = this._Players[sa.Key].getCar(carIndex);
                                switch (car.state)
                                {
                                    case CarState.waitAtBaseStation:
                                        {
                                            var moneyIsEnoughToStart = giveMoneyFromPlayerToCarForAttack(player, car);
                                            if (moneyIsEnoughToStart)
                                            {
                                                var attackSuccess = attack(player, car, sa, ref notifyMsg);
                                                if (attackSuccess)
                                                {

                                                }
                                                else
                                                {
                                                    giveMoneyFromCarToPlayer(player, car);
                                                }
                                            }
                                            else
                                            {
                                                Console.WriteLine($"金钱不足以展开攻击！");
                                            }
                                            //if (car.ability.leftVolume > 0)
                                            //    collect(car, player, sc, ref notifyMsg);
                                            //else
                                            //{
                                            //    carsVolumeIsFullMustReturn(car, player, sc, ref notifyMsg);
                                            //}
                                        }; break;
                                        //case CarState.waitAtBaseStation:
                                        //    {
                                        //        collect(car, player, sc, ref notifyMsg);
                                        //    }; break;
                                        //case CarState.waitOnRoad:
                                        //    {
                                        //        if (car.purpose == Purpose.collect || car.purpose == Purpose.@null)
                                        //        {
                                        //            collect(car, player, sc, ref notifyMsg);
                                        //        }
                                        //        else
                                        //        {
                                        //            throw new Exception("CarState.waitOnRoad car.purpose!= Purpose.collect");
                                        //        }
                                        //    }; break;

                                }
                            };
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
            throw new NotImplementedException();
        }

        /// <summary>
        /// 让小车进行攻击
        /// </summary>
        /// <param name="player">玩家</param>
        /// <param name="car">小车</param>
        /// <returns>玩家将钱给小车，小车进行攻击。如果攻击不成（如去不了、去了回不来），应该将钱返回</returns>
        private bool giveMoneyFromPlayerToCarForAttack(Player player, Car car)
        {
            var needMoney = car.ability.Business;
            if (player.MoneyToPromote < needMoney)
            {
                return false;
            }
            else if (car.ability.SumMoneyCanForCollect != 0)
            {

                //初始化失败，小车 comeback后，没有完成交接！！！
                throw new Exception("car.ability.costBusiness != 0m");
            }
            else
            {
                player.Money -= car.ability.Business;
                car.ability.costBusiness = car.ability.Business;
                return true;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="player">玩家</param>
        /// <param name="car">小车</param>
        /// <param name="sa"></param>
        /// <param name="notifyMsg"></param>
        /// <returns>true：表示已执行；false，表示各种原因(去不了、去了回不来)未执行。</returns>
        public bool attack(Player player, Car car, SetAttack sa, ref List<string> notifyMsg)
        {
            var from = this.getFromWhenAttack(player, car);
            var to = sa.target;
            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var baseFp = Program.dt.GetFpByIndex(player.StartFPIndex);

            var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            var returnPath = Program.dt.GetAFromB(fp2, baseFp.FastenPositionID);

            var goMile = GetMile(goPath);
            var returnMile = GetMile(returnPath);


            //第一步，计算去程和回程。
            if (car.ability.leftMile >= goMile + returnMile)
            {
                car.targetFpIndex = to;
                Console.WriteLine($"{car.name}的目标设置成了{Program.dt.GetFpByIndex(to).FastenPositionName}");
                var speed = car.ability.Speed;
                int startT = 0;
                List<Data.PathResult> result;
                if (car.state == CarState.waitAtBaseStation)
                {
                    result = getStartPositon(fp1, sa.car, ref startT);
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
                Thread th = new Thread(() => setDebt(startT, new commandWithTime.debtOwner()
                {
                    c = "debtOwner",
                    key = sa.Key,
                    car = sa.car,
                    returnPath = returnPath,
                    target = to,//新的起点
                    changeType = "Attack",
                    victim = sa.targetOwner
                }));
                th.Start();
                car.changeState++;//更改状态
                car.state = CarState.roadForAttack;
                getAllCarInfomations(sa.Key, ref notifyMsg);
                return true;
            }

            else if (car.ability.leftMile >= goMile)
            {
                Console.Write($"去程{goMile}，回程{returnMile}");
                Console.Write($"你去了回不来");
                return false;
            }
            else
            {
                Console.Write($"去程{goMile}，回程{returnMile}");
                Console.Write($"你去不了");
                return false;
            }
        }

        private int getFromWhenAttack(Player player, Car car)
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
                        throw new Exception("");
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

        const double debtAssetsScale = 1.2;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="startT"></param>
        /// <param name="dor"></param>
        private async void setDebt(int startT, commandWithTime.debtOwner dOwner)
        {
            lock (this.PlayerLock)
            {
                var player = this._Players[dOwner.key];
                var car = this._Players[dOwner.key].getCar(dOwner.car);
                if (car.purpose == Purpose.@null)
                    car.purpose = Purpose.attack;
                else
                {
                    throw new Exception("car.purpose 未注册");
                }
            }

            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setDebt");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setDebt正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdatePlayers = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[dOwner.key];
                var car = this._Players[dOwner.key].getCar(dOwner.car);
                // car.targetFpIndex = this._Players[dor.key].StartFPIndex;
                if (dOwner.changeType == "Attack"
                    && car.state == CarState.roadForAttack)
                {
                    if (car.targetFpIndex == -1)
                    {
                        throw new Exception("居然来了一个没有目标的车！！！");
                    }
                    if (car.ability.diamondInCar != "")
                    {
                        throw new Exception("怎么能让满载车出来购买？");
                    }
                    if (!(car.purpose == Purpose.attack))
                    {
                        throw new Exception($"错误的purpose:{car.purpose}");
                    }
                    if (car.ability.costBusiness == 0)
                    {
                        throw new Exception($"错误的car.ability.costBusiness :{car.ability.costBusiness }");
                    }
                    {
                        var attackMoney = car.ability.costBusiness + car.ability.costVolume;
                        Console.WriteLine($"player:{player.Key},car{dOwner.car},attackMoney:{attackMoney}");
                        if (this._Players.ContainsKey(dOwner.victim))
                        {

                            var victim = this._Players[dOwner.victim];
                            if (!victim.Bust)
                            {
                                // var lastDebt = victim.LastDebt;
                                if (player.Debts.ContainsKey(dOwner.victim))
                                {
                                    /*
                                     * step1用 business 和 volume 先偿还债务！
                                     * s
                                     */
                                    do
                                    {
                                        {
                                            var debt = Math.Min(car.ability.costBusiness, player.Debts[dOwner.victim]);
                                            player.Debts[dOwner.victim] -= debt;
                                            car.ability.costBusiness -= debt;
                                        }
                                        {
                                            var debt = Math.Min(car.ability.costVolume, player.Debts[dOwner.victim]);
                                            player.Debts[dOwner.victim] -= debt;
                                            car.ability.costVolume -= debt;
                                        }
                                        attackMoney = car.ability.costBusiness + car.ability.costVolume;
                                    }
                                    while (attackMoney != 0 && player.Debts[dOwner.victim] != 0);
                                    if (player.Debts[dOwner.victim] == 0)
                                    {
                                        player.Debts.Remove(dOwner.victim);
                                    }

                                }

                                var lastDebt = victim.LastDebt;
                                if (attackMoney >= lastDebt)
                                {
                                    victim.Bust = true;

                                }
                                else
                                {

                                }
                                {
                                    //执行 攻击动作！ 
                                    {
                                        var attack = Math.Min(car.ability.costBusiness, lastDebt);
                                        victim.AddDebts(player.Key, attack);
                                        car.ability.costBusiness -= attack;
                                        lastDebt -= attack;
                                    }
                                    {
                                        var attack = Math.Min(car.ability.costVolume, lastDebt);
                                        victim.AddDebts(player.Key, attack);
                                        car.ability.costVolume -= attack;
                                        lastDebt -= attack;
                                    }
                                }
                            }
                            else
                            {
                                //这种情况也有可能存在。
                            }
                            if (victim.Bust)
                            {
#warning 这里要开始系统帮助玩家自动还债进程！
                            }
                        }
                        else
                        {
                            //这种情况有可能存在.
                        }
                        /*
                         * 无论什么情况，直接返回。
                         */
                        Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
                        {
                            c = "returnning",
                            key = dOwner.key,
                            car = dOwner.car,
                            returnPath = dOwner.returnPath,//returnPath_Record,
                            target = dOwner.target,
                            changeType = dOwner.changeType,
                        }));
                        th.Start();
                        ;
                    }
                }
                else
                {
                    throw new Exception("car.state == CarState.buying!或者 dor.changeType不是四种类型");
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
            if (needUpdatePlayers)
            {
#warning 随着前台显示内容的丰富，这里要更新前台的player信息。
                //  await CheckAllPlayersPromoteState(dor.changeType);
            }
        }



    }
}
