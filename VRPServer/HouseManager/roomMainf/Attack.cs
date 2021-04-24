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
         * A玩家，拿100块钱攻击B玩家，B玩家的债务增加100，使用金额都增加90
         * 当第一股东不是B玩家时，是A玩家时。A玩家有权对B进行破产清算。
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
                        if (this._Players[sa.Key].Bust) { }
                        else
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
                                                var moneyIsEnoughToStart = giveMoneyFromPlayerToCarForAttack(player, car, ref notifyMsg);
                                                if (moneyIsEnoughToStart)
                                                {
                                                    var state = CheckTargetState(sa.targetOwner);
                                                    if (state == CarStateForBeAttacked.CanBeAttacked)
                                                    {
                                                        MileResultReason mrr;
                                                        attack(player, car, sa, ref notifyMsg, out mrr);
                                                        if (mrr == MileResultReason.Abundant)
                                                        {

                                                        }
                                                        else
                                                        {
                                                            if (mrr == MileResultReason.CanNotReach)
                                                            {

                                                            }
                                                            else if (mrr == MileResultReason.CanNotReturn)
                                                            {
                                                            }
                                                            else if (mrr == MileResultReason.MoneyIsNotEnougt)
                                                            { }
                                                            giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                        }
                                                        // doAttack(player, car, sa, ref notifyMsg);
                                                    }
                                                    else if (state == CarStateForBeAttacked.HasBeenBust)
                                                    {
                                                        Console.WriteLine($"攻击对象已经破产！");
                                                        giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                    }
                                                    else if (state == CarStateForBeAttacked.NotExisted)
                                                    {
                                                        Console.WriteLine($"攻击对象已经退出了游戏！");
                                                        giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                    }
                                                    else
                                                    {
                                                        throw new Exception($"{state.ToString()}未注册！");
                                                    }
                                                }
                                                else
                                                {
#warning 前端要提示
                                                    Console.WriteLine($"金钱不足以展开攻击！");
                                                    giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                    //carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                            }
                                        }; break;
                                    case CarState.waitOnRoad:
                                        {
                                            /*
                                             * 在接收到攻击指令时，如果小车在路上，说明，
                                             * 其上一个任务是抢能力宝石，结果是没抢到。其
                                             * 目的应该应该为purpose=null 
                                             */
                                            if (car.purpose == Purpose.@null)
                                            {
                                                var state = CheckTargetState(sa.targetOwner);
                                                if (state == CarStateForBeAttacked.CanBeAttacked)
                                                {
                                                    MileResultReason mrr;
                                                    attack(player, car, sa, ref notifyMsg, out mrr);
                                                    if (mrr == MileResultReason.Abundant) { }
                                                    else if (mrr == MileResultReason.CanNotReach)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.CanNotReturn)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.MoneyIsNotEnougt)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    // doAttack(player, car, sa, ref notifyMsg);
                                                }
                                                else if (state == CarStateForBeAttacked.HasBeenBust)
                                                {
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    Console.WriteLine($"攻击对象已经破产！");
                                                }
                                                else if (state == CarStateForBeAttacked.NotExisted)
                                                {
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    Console.WriteLine($"攻击对象已经退出了游戏！");
                                                }
                                                else
                                                {
                                                    throw new Exception($"{state.ToString()}未注册！");
                                                }
                                            }

                                        }; break;
                                    case CarState.waitForTaxOrAttack:
                                        {
                                            if (car.purpose == Purpose.tax)
                                            {
                                                var state = CheckTargetState(sa.targetOwner);
                                                if (state == CarStateForBeAttacked.CanBeAttacked)
                                                {
                                                    MileResultReason mrr;
                                                    attack(player, car, sa, ref notifyMsg, out mrr);
                                                    if (mrr == MileResultReason.Abundant) { }
                                                    else if (mrr == MileResultReason.CanNotReach)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.CanNotReturn)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.MoneyIsNotEnougt)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    // doAttack(player, car, sa, ref notifyMsg);
                                                }
                                                else if (state == CarStateForBeAttacked.HasBeenBust)
                                                {
                                                    Console.WriteLine($"攻击对象已经破产！");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                                else if (state == CarStateForBeAttacked.NotExisted)
                                                {
                                                    Console.WriteLine($"攻击对象已经退出了游戏！");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                                else
                                                {
                                                    throw new Exception($"{state.ToString()}未注册！");
                                                }
                                            }
                                        }; break;
                                    case CarState.waitForCollectOrAttack:
                                        {
                                            if (car.purpose == Purpose.collect)
                                            {
                                                var state = CheckTargetState(sa.targetOwner);
                                                if (state == CarStateForBeAttacked.CanBeAttacked)
                                                {
                                                    MileResultReason mrr;
                                                    attack(player, car, sa, ref notifyMsg, out mrr);
                                                    if (mrr == MileResultReason.Abundant) { }
                                                    else if (mrr == MileResultReason.CanNotReach)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.CanNotReturn)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                    else if (mrr == MileResultReason.MoneyIsNotEnougt)
                                                    {
                                                        carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    }
                                                }
                                                else if (state == CarStateForBeAttacked.HasBeenBust)
                                                {
                                                    Console.WriteLine($"攻击对象已经破产！");
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                }
                                                else if (state == CarStateForBeAttacked.NotExisted)
                                                {
                                                    carsAttackFailedThenMustReturn(car, player, sa, ref notifyMsg);
                                                    Console.WriteLine($"攻击对象已经退出了游戏！");
                                                }
                                                else
                                                {
                                                    throw new Exception($"{state.ToString()}未注册！");
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
                    if (!string.IsNullOrEmpty(url))
                    {
                        await Startup.sendMsg(url, sendMsg);
                    }
                }
                return "";
            }
        }

        enum CarStateForBeAttacked
        {
            CanBeAttacked,
            NotExisted,
            HasBeenBust,
        }
        private CarStateForBeAttacked CheckTargetState(string targetOwner)
        {
            if (this._Players.ContainsKey(targetOwner))
            {
                if (this._Players[targetOwner].Bust)
                {
                    return CarStateForBeAttacked.HasBeenBust;
                }
                else
                {
                    return CarStateForBeAttacked.CanBeAttacked;
                }
            }
            else
            {
                return CarStateForBeAttacked.NotExisted;
            }
        }

        //        private void doAttack(Player player, Car car, SetAttack sa, ref List<string> notifyMsg)
        //        {


        //            AttackState aState;
        //            attack(player, car, sa, ref notifyMsg, out aState);

        //            if (aState == AttackState.Abundant)
        //            {
        //                printState(player, car, $"执行了攻击任务！攻击{this._Players[sa.targetOwner].PlayerName},即攻击{Program.dt.GetFpByIndex(sa.target).FastenPositionName}");
        //            }
        //            else
        //            {
        //                if (car.state == CarState.waitAtBaseStation)
        //                {
        //                    giveMoneyFromCarToPlayer(player, car);
        //                }

        //#warning 这里要对前台进行提示
        //                switch (aState)
        //                {
        //                    case 0:
        //                        {
        //                            /*
        //                             * 
        //                             */
        //                        }; break;
        //                }
        //            }
        //        }



        /// <summary>
        /// 让小车进行攻击
        /// </summary>
        /// <param name="player">玩家</param>
        /// <param name="car">小车</param>
        /// <returns>玩家将钱给小车，小车进行攻击。如果攻击不成（如去不了、去了回不来），应该将钱返回</returns>
        private bool giveMoneyFromPlayerToCarForAttack(Player player, Car car, ref List<string> notifyMsg)
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
                // var m1 = player.GetMoneyCanSave();
                //player.Money -= needMoney;
                player.MoneySet(player.Money - needMoney, ref notifyMsg);

                car.ability.setCostBusiness(needMoney, player, car, ref notifyMsg);
                //   car.ability.costBusiness = needMoney;
                // AbilityChanged(player, car, ref notifyMsg, "business");

                //  var m2 = player.GetMoneyCanSave();
                //  if (m1 != m2)
                {
                    // MoneyCanSaveChanged(player, m2, ref notifyMsg);
                }
                return true;
            }
        }


        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="player">玩家</param>
        ///// <param name="car">小车</param>
        ///// <param name="sa"></param>
        ///// <param name="notifyMsg"></param>
        ///// <param name="victimState">0，代表用户不存在了。1代表已经破产，2代表正常</param>

        /// <summary>
        /// 此函数，必须在this._Players.ContainsKey(sa.targetOwner)=true且this._Players[sa.targetOwner].Bust=false情况下运行。请提前进行判断！
        /// </summary>
        /// <param name="player">玩家</param>
        /// <param name="car"></param>
        /// <param name="sa"></param>
        /// <param name="notifyMsg"></param>
        /// <param name="victimState"></param>
        /// <param name="reason"></param>
        void attack(Player player, Car car, SetAttack sa, ref List<string> notifyMsg, out MileResultReason Mrr)
        {
            //   if (this._Players.ContainsKey(sa.targetOwner))
            {
                //if (this._Players[sa.targetOwner].Bust)

                if (car.ability.costBusiness + car.ability.costVolume > 0)
                {
                    var from = this.getFromWhenAttack(player, car);
                    var to = sa.target;
                    var fp1 = Program.dt.GetFpByIndex(from);
                    var fp2 = Program.dt.GetFpByIndex(to);
                    var baseFp = Program.dt.GetFpByIndex(player.StartFPIndex);

                    // var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);

                    //var goPath = Program.dt.GetAFromB(from, to);
                    var goPath = this.GetAFromB(from, to, player, ref notifyMsg);
                    //var returnPath = Program.dt.GetAFromB(fp2, baseFp.FastenPositionID);
                    //var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);
                    var returnPath = this.GetAFromB(to, player.StartFPIndex, player, ref notifyMsg);

                    var goMile = GetMile(goPath);
                    var returnMile = GetMile(returnPath);



                    //第一步，计算去程和回程。
                    if (car.ability.leftMile >= goMile + returnMile)
                    {
                        int startT;
                        EditCarStateWhenAttackStartOK(player, ref car, to, fp1, sa, goPath, out startT, ref notifyMsg);
                        SetAttackArrivalThread(startT, car, sa, returnPath);
                        // getAllCarInfomations(sa.Key, ref notifyMsg);
                        Mrr = MileResultReason.Abundant;
                    }

                    else if (car.ability.leftMile >= goMile)
                    {
                        //当攻击失败，必须返回
                        Console.Write($"去程{goMile}，回程{returnMile}");
                        Console.Write($"你去了回不来");
                        Mrr = MileResultReason.CanNotReturn;
                    }
                    else
                    {
#warning 这里要在web前台进行提示
                        //当攻击失败，必须返回
                        Console.Write($"去程{goMile}，回程{returnMile}");
                        Console.Write($"你去不了");
                        Mrr = MileResultReason.CanNotReach;
                    }
                }
                else
                {
                    Mrr = MileResultReason.MoneyIsNotEnougt;
                }
            }
            //else
            //{
            //    throw new Exception("此方法，不该在此条件下运行");
            //}

        }

        private void SetAttackArrivalThread(int startT, Car car, SetAttack sa, List<Model.MapGo.nyrqPosition> returnPath)
        {
            Thread th = new Thread(() => setDebt(startT, new commandWithTime.debtOwner()
            {
                c = "debtOwner",
                key = sa.Key,
                car = sa.car,
                returnPath = returnPath,
                target = car.targetFpIndex,//新的起点
                changeType = "Attack",
                victim = sa.targetOwner
            }));
            th.Start();
        }

        private void EditCarStateWhenAttackStartOK(Player player, ref Car car, int to, Model.FastonPosition fp1, SetAttack sa, List<Model.MapGo.nyrqPosition> goPath, out int startT, ref List<string> notifyMsg)
        {
            car.targetFpIndex = to;//A.更改小车目标，在其他地方引用。
            car.setPurpose(this._Players[sa.Key], ref notifyMsg, Purpose.attack);
            // car.purpose = Purpose.attack;//B.更改小车目的，小车变为攻击状态！
            //  car.changeState++;//C.更改状态用去前台更新动画  

            /*
            * D.更新小车动画参数
            */
            var speed = car.ability.Speed;
            startT = 0;
            List<Data.PathResult> result;
            if (car.state == CarState.waitAtBaseStation)
            {
                result = getStartPositon(fp1, sa.car, ref startT);
            }
            else if (car.state == CarState.waitForCollectOrAttack)
            {
                result = new List<Data.PathResult>();
            }
            else if (car.state == CarState.waitForTaxOrAttack)
            {
                result = new List<Data.PathResult>();
            }
            else if (car.state == CarState.waitOnRoad)
            {
                result = new List<Data.PathResult>();
            }
            else
            {
                throw new Exception("错误的汽车类型！！！");
            }
            car.setState(this._Players[sa.Key], ref notifyMsg, CarState.roadForAttack);
            //car.state = CarState.roadForAttack;
            //  this.SendStateAndPurpose(this._Players[sa.Key], car, ref notifyMsg);


            Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);

            var animateData = new AnimateData()
            {
                animateData = result,
                recordTime = DateTime.Now
            };

            car.setAnimateData(player, ref notifyMsg, animateData);
            //car.animateData = new AnimateData()
            //{
            //    animateData = result,
            //    recordTime = DateTime.Now
            //};
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
                case CarState.waitForTaxOrAttack:
                    {
                        return car.targetFpIndex;
                    }; break;
                default:
                    {
                        throw new Exception($"错误的汽车状态:{car.state.ToString()}");
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
            // if (car.state == CarState.waitAtBaseStation)
            {
                //Console.Write($"现在剩余容量为{car.ability.leftVolume}，总容量为{car.ability.Volume}");
                Console.WriteLine($"由于里程安排问题，必须返回！");
                var from = getFromWhenAttack(this._Players[sc.Key], car);
                int startT = 1;
                //var carKey = $"{}_{}";
                var returnPath_Record = this._Players[sc.Key].returningRecord[sc.car];
                Thread th = new Thread(() => setReturn(startT, new commandWithTime.returnning()
                {
                    c = "returnning",
                    key = sc.Key,
                    car = sc.car,
                    returnPath = returnPath_Record,
                    target = from,
                    changeType = AttackFailedReturn,
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
            /*
             * 先还钱，再借给钱！
             */
            lock (this.PlayerLock)
            {
                var player = this._Players[dOwner.key];
                var car = this._Players[dOwner.key].getCar(dOwner.car);
                if (car.purpose == Purpose.attack)
                {

                }
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
                        /*
                         * 当到达地点时，有可能攻击对象不存在。
                         * 也有可能攻击对象已破产。
                         * 还有正常情况。
                         * 这三种情况都要考虑到。
                         */

                        var attackMoney = car.ability.costBusiness + car.ability.costVolume;
                        Console.WriteLine($"player:{player.Key},car{dOwner.car},attackMoney:{attackMoney}");
                        if (this._Players.ContainsKey(dOwner.victim))
                        {
                            var victim = this._Players[dOwner.victim];
                            if (!victim.Bust)
                            {
                                //  var m1 = victim.GetMoneyCanSave();
                                // var lastDebt = victim.LastDebt;
                                if (player.DebtsContainsKey(dOwner.victim))
                                {

                                    /*
                                     * step1用 business 和 volume 先偿还债务！
                                     * s
                                     */
                                    int k = 0;
                                    do
                                    {
                                        {
                                            var debt = Math.Min(car.ability.costBusiness, player.DebtsGet(dOwner.victim));
                                            player.SetDebts(dOwner.victim, player.DebtsGet(dOwner.victim) - debt, ref notifyMsg);
                                            //   player.Debts[dOwner.victim] -= debt;
                                            //car.ability.costBusiness -= debt;
                                            if (debt > 0)
                                            {
                                                car.ability.setCostBusiness(car.ability.costBusiness - debt, player, car, ref notifyMsg);
                                            }

                                            //AbilityChanged(player, car, ref notifyMsg, "business");
                                        }
                                        {
                                            //  player.DebtsGet
                                            var debt = Math.Min(car.ability.costVolume, player.DebtsGet(dOwner.victim));
                                            player.SetDebts(dOwner.victim, player.DebtsGet(dOwner.victim) - debt, ref notifyMsg);
                                            //player.Debts[dOwner.victim] -= debt;
                                            //car.ability.costVolume -= debt;
                                            if (debt > 0)
                                            {
                                                car.ability.setCostVolume(car.ability.costVolume - debt, player, car, ref notifyMsg);
                                            }

                                            //AbilityChanged(player, car, ref notifyMsg, "volume");
                                        }
                                        attackMoney = car.ability.costBusiness + car.ability.costVolume;
                                        k++;
                                        if (k > 1000)
                                        {
                                            Console.WriteLine("出现了金钱没有清0的状况！");
                                            Console.ReadLine();
                                        }
                                    }
                                    while (attackMoney != 0 && player.DebtsGet(dOwner.victim) != 0);

                                    if (player.DebtsGet(dOwner.victim) == 0)
                                    {
                                        player.DebtsRemove(dOwner.victim, ref notifyMsg);
                                    }

                                }


                                {
                                    //执行 攻击动作！  
                                    {
                                        var attack = car.ability.costBusiness;
                                        if (attack > 0)
                                        {
                                            victim.AddDebts(player.Key, attack, ref notifyMsg);
                                            car.ability.setCostBusiness(car.ability.costBusiness - attack, player, car, ref notifyMsg);
                                        }
                                        //  car.ability.costBusiness -= attack;
                                        //AbilityChanged(player, car, ref notifyMsg, "business");
                                    }
                                    {
                                        var attack = car.ability.costVolume;
                                        if (attack > 0)
                                        {
                                            victim.AddDebts(player.Key, attack, ref notifyMsg);
                                            car.ability.setCostVolume(car.ability.costVolume - attack, player, car, ref notifyMsg);
                                        }
                                    }
                                }

                                {

                                    /*
                                     * A.告诉被攻击者，还有多少权利，多少义务。
                                     * B.告诉攻击者，还有多少权利，多少义务。
                                     */
                                    tellMyRightAndDutyToOther(player, victim, ref notifyMsg);
                                    tellMyRightAndDutyToOther(victim, player, ref notifyMsg);
                                }
                            }
                            else
                            {
                                //这种情况也有可能存在。
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
        private async Task TellMeOthersRightAndDuty(string key)
        {
            List<string> notifyMsg = new List<string>();
            if (this._Players.ContainsKey(key))
            {
                var self = this._Players[key];
                foreach (var item in this._Players)
                {
                    if (item.Key != key)
                    {
                        tellMyRightAndDutyToOther(item.Value, self, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                await Startup.sendMsg(url, sendMsg);
            }
        }
        /// <summary>
        /// 告诉别人我有多少权利和义务。
        /// </summary>
        /// <param name="self">被告诉的内容。即self所指对象的权利、义务。</param>
        /// <param name="other">告诉的对象</param>
        /// <param name="notifyMsg">传的参数</param>
        private void tellMyRightAndDutyToOther(Player self, Player other, ref List<string> notifyMsg)
        {
            /*
             * 三种情况下应该被调用。
             * 第一种情况，启动。
             * 第二种情况，攻击。
             * 第三种情况，参数变更。
             */
            long right;
            int rightPercent;
            long duty;
            int dutyPercent;
            if (self.DebtsContainsKey(other.Key))
            {
                right = self.DebtsGet(other.Key);
                rightPercent = self.DebtsPercent(other.Key);
            }
            else
            {
                right = 0;
                rightPercent = 0;
            }

            if (other.DebtsContainsKey(self.Key))
            {
                duty = other.DebtsGet(self.Key);
                dutyPercent = other.DebtsPercent(self.Key);
            }
            else
            {
                duty = 0;
                dutyPercent = 0;
            }

            var obj = new BradCastRightAndDuty
            {
                c = "BradCastRightAndDuty",
                right = right,
                duty = duty,
                WebSocketID = other.WebSocketID,
                playerKey = self.Key,
                rightPercent = rightPercent,
                dutyPercent = dutyPercent
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            notifyMsg.Add(other.FromUrl);
            notifyMsg.Add(json);
        }
    }
}
