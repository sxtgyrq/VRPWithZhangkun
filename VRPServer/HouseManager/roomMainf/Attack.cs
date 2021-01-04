using CommonClass;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        /*
         * 攻击的目的是为了增加股份。
         * A玩家，拿100块钱攻击B玩家，B玩家的债务和使用金额都增加100
         * 当债务比例大于某个值时，宣布破产。
         */
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
                                            if (car.purpose == Purpose.@null)
                                            {
                                                var moneyIsEnoughToStart = giveMoneyFromPlayerToCarForAttack(player, car);
                                                if (moneyIsEnoughToStart)
                                                {
                                                    doAttack(player, car, sa, ref notifyMsg);
                                                }
                                                else
                                                {
#warning 前端要提示
                                                    Console.WriteLine($"金钱不足以展开攻击！");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                            }
                                        }; break;
                                    case CarState.waitOnRoad:
                                        {
                                            /*
                                             * 在接收到攻击指令时，如果小车在路上，说明，
                                             * 其上一个任务是抢能力宝石，结果是没抢到。其
                                             * 目的应该应该为purpose=null
                                             * 或者目的应该是collect 或者 tax
                                             */
                                            if (car.purpose == Purpose.@null || car.purpose == Purpose.attack || car.purpose == Purpose.tax)
                                            {
                                                if (car.ability.costVolume + car.ability.costBusiness > 0)
                                                {
                                                    doAttack(player, car, sa, ref notifyMsg);
                                                }
                                                else
                                                {
                                                    Console.WriteLine($"金钱不足以展开攻击！");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                            }
                                        }; break;
                                    case CarState.waitForCollectOrAttack:
                                        {
                                            if (car.purpose == Purpose.collect)
                                            {
                                                if (car.ability.costVolume + car.ability.costBusiness > 0)
                                                {
                                                    doAttack(player, car, sa, ref notifyMsg);
                                                }
                                                else
                                                {
                                                    printState(player, car, "金钱不足");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                            }
                                        }; break;

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

        private void doAttack(Player player, Car car, SetAttack sa, ref List<string> notifyMsg)
        {
            int victimState;
            var attackSuccess = attack(player, car, sa, ref notifyMsg, out victimState);
            if (attackSuccess)
            {
                printState(player, car, $"执行了攻击任务！攻击{this._Players[sa.targetOwner].PlayerName},即攻击{Program.dt.GetFpByIndex(sa.target).FastenPositionName}");
            }
            else
            {
                giveMoneyFromCarToPlayer(player, car);
#warning 这里要对前台进行提示
                switch (victimState)
                {
                    case 0:
                        {
                            /*
                             * 
                             */
                        }; break;
                }
            }
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
            //throw new Exception("");
            if (player.MoneyToAttack < needMoney)
            {
                Console.WriteLine($"");
                return false;
            }
            else if (car.ability.SumMoneyCanForAttack != 0)
            {

                //初始化失败，小车 comeback后，没有完成交接！！！
                throw new Exception("car.ability.SumMoneyCanForAttack != 0");
            }
            else
            {
                player.Money -= needMoney;
                car.ability.costBusiness = needMoney;
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
        /// <param name="victimState">0，代表用户不存在了。1代表已经破产，2代表正常</param>
        /// <returns>true：表示已执行；false，表示各种原因(去不了、去了回不来)未执行。</returns>
        public bool attack(Player player, Car car, SetAttack sa, ref List<string> notifyMsg, out int victimState)
        {
            if (this._Players.ContainsKey(sa.targetOwner))
            {
                if (this._Players[sa.targetOwner].Bust)
                {
                    victimState = 1;
                    return false;
                }
                else
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
                        if (car.purpose == Purpose.@null || car.purpose == Purpose.collect)
                        {

                        }
                        else
                        {
                            throw new Exception("错误的car.purpose");
                        }
                        car.state = CarState.roadForAttack;
                        getAllCarInfomations(sa.Key, ref notifyMsg);
                        victimState = 2;
                        return true;
                    }

                    else if (car.ability.leftMile >= goMile)
                    {
                        //当攻击失败，必须返回
                        Console.Write($"去程{goMile}，回程{returnMile}");
                        Console.Write($"你去了回不来");

#warning 这里要在前台进行提示
                        victimState = 2;
                        return false;
                    }
                    else
                    {
#warning 这里要在web前台进行提示
                        //当攻击失败，必须返回
                        Console.Write($"去程{goMile}，回程{returnMile}");
                        Console.Write($"你去不了");
                        victimState = 2;
                        return false;
                    }
                }

            }
            else
            {
                victimState = 0;
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
                        //小车的上一个的目标
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
        //private int GetFromWhenUpdateCollect(Player player, string cType, Car car)
        //{
        //    switch (cType)
        //    {
        //        case "findWork":
        //            {
        //                switch (car.state)
        //                {
        //                    case CarState.waitAtBaseStation:
        //                        {
        //                            if (car.targetFpIndex != -1)
        //                            {
        //                                //出现这种情况，应该是回了基站里没有初始
        //                                throw new Exception("参数混乱");
        //                            }
        //                            else if (car.purpose == Purpose.@null)
        //                            {
        //                                return player.StartFPIndex;
        //                            }
        //                            else
        //                            {
        //                                //出现这种情况，应该是回了基站里没有初始
        //                                throw new Exception("参数混乱");
        //                            }
        //                        };
        //                    case CarState.waitForCollectOrAttack:
        //                        {
        //                            if (car.targetFpIndex == -1)
        //                            {
        //                                throw new Exception("参数混乱");
        //                            }
        //                            else if (car.purpose == Purpose.collect)
        //                            {
        //                                return car.targetFpIndex;
        //                            }
        //                            else
        //                            {
        //                                //出现这种情况，应该是回了基站里没有初始
        //                                throw new Exception("参数混乱");
        //                            }
        //                        };
        //                    case CarState.waitOnRoad:
        //                        {
        //                            if (car.targetFpIndex == -1)
        //                            {
        //                                throw new Exception("参数混乱");
        //                            }
        //                            else if (car.purpose == Purpose.collect || car.purpose == Purpose.@null)
        //                            {
        //                                return car.targetFpIndex;
        //                            }
        //                            else
        //                            {
        //                                //出现这种情况，应该是回了基站里没有初始
        //                                throw new Exception("参数混乱");
        //                            }
        //                        }; break;
        //                };
        //            }; break;
        //    }
        //    throw new Exception("非法调用");
        //}
        private void carsAttackFailedThenMustReturn(Car car, Player player, SetAttack sc, ref List<string> notifyMsg)
        {
            if (car.state == CarState.waitOnRoad)
            {
                //Console.Write($"现在剩余容量为{car.ability.leftVolume}，总容量为{car.ability.Volume}");
                Console.WriteLine($"由于里程安排问题，必须返回！");
                var from = getFromWhenAttack(this._Players[sc.Key], car);
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
        }



        //const double debtAssetsScale = 1.2;
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
                if (
                    car.purpose == Purpose.@null
                    || car.purpose == Purpose.collect)
                    car.purpose = Purpose.attack;
                else
                {
                    Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
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
                    else if (car.ability.diamondInCar != "")
                    {
                        throw new Exception("怎么能让满载宝石的车出来攻击？");
                    }
                    else if (!(car.purpose == Purpose.attack))
                    {
                        throw new Exception($"错误的purpose:{car.purpose}");
                    }
                    else if (car.ability.costBusiness + car.ability.costVolume <= 0)
                    {
#warning 出来攻击时，costBusiness>0
                        throw new Exception($"错误的car.ability.costBusiness :{car.ability.costBusiness }");
                    }
                    else
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
#warning 这里乱得很！！！
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
                                    if (attackMoney > 0)
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
                                /*
                                 * 1期工程，直接偿还账务。
                                 * 2期工程，做执行动画。
                                 */
                                victim.BustTime = DateTime.Now;
                                var keys = new List<string>();
                                foreach (var item in victim.Debts)
                                {
                                    keys.Add(item.Key);
                                    //if(this._Players.ContainsKey(item))
                                }
                                for (var i = 0; i < keys.Count; i++)
                                {
                                    if (this._Players.ContainsKey(keys[i]))
                                    {
                                        if (!this._Players[keys[i]].Bust)
                                            this._Players[keys[i]].Money += Math.Max(0, victim.Debts[keys[i]]);
                                        victim.Debts[keys[i]] = 0;

#warning 这里要提示。破产，你获取了多少资金。
                                    }
                                }
                                victim.Debts = new Dictionary<string, long>();
                                //for (var i = 0; i < victim.Debts.Count; i++)
                                //{
                                //    victim.Debts
                                //}
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
