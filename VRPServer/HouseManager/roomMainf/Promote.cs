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
                return "wrong car";
            }
            else if (!(sp.car == "carA" || sp.car == "carB" || sp.car == "carC" || sp.car == "carD" || sp.car == "carE"))
            {
                return $"wrong car:{sp.car}";
            }
            else if (string.IsNullOrEmpty(sp.pType))
            {
                return $"wrong pType:{sp.pType}";
            }
            else if (!(sp.pType == "mile" || sp.pType == "business" || sp.pType == "volume" || sp.pType == "speed"))
            {
                return $"wrong pType:{sp.pType}"; ;
            }
            else
            {
                var carIndex = getCarIndex(sp.car);
                List<string> notifyMsg = new List<string>();
                var player = this._Players[sp.Key];
                var car = player.getCar(carIndex);
                if (player.Bust)
                {
                    WebNotify(player, "您已破产");
                    return $"{player.Key} go bust!";
#warning 这里要提示前台，已经进行破产清算了。
                }
                else
                {
                    lock (this.PlayerLock)
                    {
                        if (this._Players.ContainsKey(sp.Key))
                        {
                            //if(sp.pType=="mi")
                            switch (sp.pType)
                            {
                                case "mile":
                                case "business":
                                case "volume":
                                case "speed":
                                    {
                                        switch (car.purpose)
                                        {
                                            case Purpose.@null:
                                                {
                                                    switch (car.state)
                                                    {
                                                        case CarState.waitAtBaseStation:
                                                            {
                                                                // if(player.Money<)
                                                                var moneyIsEnoughToStart = giveMoneyFromPlayerToCarForPromoting(player, car, sp.pType, ref notifyMsg);
                                                                if (moneyIsEnoughToStart)
                                                                {
                                                                    MileResultReason reason;
                                                                    var hasBeginToPromote = promote(player, car, sp, ref notifyMsg, out reason);
                                                                    if (hasBeginToPromote)
                                                                    {
                                                                        WebNotify(player, $"{car.name}在路上寻找能力宝石的路上了！！！");
                                                                        printState(player, car, "开始在路上寻找能力宝石的路上了！！！");
                                                                    }
                                                                    else
                                                                    {
                                                                        if (reason == MileResultReason.CanNotReach)
                                                                        {
                                                                            WebNotify(player, $"{car.name}的剩余里程不足以支持到达目的地！");
                                                                            //WebNotify(player, $"资金不够,{car.name}未能上路！！！");
                                                                        }
                                                                        else if (reason == MileResultReason.CanNotReturn)
                                                                        {
                                                                            WebNotify(player, $"到达目的地后，{car.name}的剩余里程不足以支持返回！");
                                                                        }
                                                                        printState(player, car, "各种原因，不能开始！");
                                                                        giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    WebNotify(player, $"钱不够了,由于本身待在基地，不用返回");
                                                                    printState(player, car, "钱不够了,由于本身待在基地，不用返回。");
                                                                }
                                                            }; break;
                                                        case CarState.waitOnRoad:
                                                            {
                                                                if (car.ability.diamondInCar == "")
                                                                {
                                                                    if (car.ability.SumMoneyCanForPromote >= this.promotePrice[sp.pType])
                                                                    {
                                                                        MileResultReason reason;
                                                                        var hasBeginToPromote = promote(player, car, sp, ref notifyMsg, out reason);
                                                                        if (hasBeginToPromote)
                                                                        {
                                                                            WebNotify(player, $"{car.name}在路上寻找能力宝石的路上了！！！");
                                                                            printState(player, car, $"已经在收集{sp.pType}宝石的路上了！");
                                                                        }
                                                                        else
                                                                        {
                                                                            if (reason == MileResultReason.CanNotReach)
                                                                            {
                                                                                WebNotify(player, $"{car.name}的剩余里程不足以支持到达目的地！");
                                                                                //WebNotify(player, $"资金不够,{car.name}未能上路！！！");
                                                                            }
                                                                            else if (reason == MileResultReason.CanNotReturn)
                                                                            {
                                                                                WebNotify(player, $"到达目的地后，{car.name}的剩余里程不足以支持返回！");
                                                                            }
                                                                            printState(player, car, "收集宝石剩余里程不足，必须立即返回！");
                                                                            setReturnWhenPromoteFailed(sp, car);
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        WebNotify(player, $"资金不够,{car.name}被安排返航！！！");
                                                                        printState(player, car, "在路上走的车，想找宝石，钱不够啊，必须立即返回！");
                                                                        Console.WriteLine($"宝石的价格{this.promotePrice[sp.pType]}，钱不够啊， {car.ability.subsidize},{car.ability.costBusiness},{car.ability.costVolume}！");
#warning 在路上，由于资金不够，这里没有能测到。
                                                                        setReturnWhenPromoteFailed(sp, car);
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    Console.WriteLine("在路上走的车，有了宝石，居然没返回！");
                                                                    //throw new Exception();
                                                                }
                                                            }; break;
                                                        default:
                                                            {
                                                                var msg = $"{car.state.ToString()}状态下不能提升能力！";
                                                                Console.WriteLine(msg);
                                                            }; break;

                                                    }
                                                }; break;
                                            default:
                                                {
                                                    Console.WriteLine($"{car.purpose}状态下不能获取提升能力宝石了！");
                                                    return $"{car.purpose}-state can not do action ！";
                                                }; break;
                                        }
                                    }; break;
                            }
                        }
                        else
                        {
                            return $"not has player-{sp.Key}!";
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
                return "ok";
            }
        }

        private void setReturnWhenPromoteFailed(SetPromote sp, Car car)
        {
            // var carKey = $"{sp.car}_{sp.Key}";
            var returnPath = this._Players[sp.Key].returningRecord[sp.car];//  this.returningRecord[carKey];
            Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
            {
                c = "returnning",
                key = sp.Key,
                car = sp.car,
                returnPath = returnPath,//returnPath_Record,
                target = car.targetFpIndex,//这里的target 实际上是returnning 的起点,是汽车的上一个目标
                changeType = sp.pType,
            }));
            th.Start();
        }

        private void printState(Player player, Car car, string msg)
        {
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}{player.PlayerName}-{car.name}--{msg}");
        }

        /// <summary>
        /// 各种原因，使小车从基地里没有出发。小车上的钱必须从下车返回为玩家！
        /// </summary>
        /// <param name="player"></param>
        /// <param name="car"></param>
        private void giveMoneyFromCarToPlayer(Player player, Car car, ref List<string> notifyMsg)
        {
            var m1 = player.GetMoneyCanSave();
            player.Money += car.ability.leftBusiness;
            player.Money += car.ability.leftVolume;

            if (car.ability.leftBusiness > 0)
                printState(player, car, $"返回基站，通过leftBusiness，是流动资金增加{car.ability.leftBusiness}");
            if (car.ability.leftVolume > 0)
                printState(player, car, $"返回基站，通过leftBusiness，是流动资金增加{car.ability.leftVolume}");
            if (car.ability.subsidize > 0)
            {
                /*
                 * 从逻辑上，必须要保证car.ability.subsidize>0,player.SupportToPlay!=null
                 */
                player.SupportToPlay.Money += car.ability.subsidize;
                printState(player, car, $"返回基站，返还资助{car.ability.subsidize}");
            }
            car.Refresh();
            if (!string.IsNullOrEmpty(car.ability.diamondInCar))
            {
                player.PromoteDiamondCount[car.ability.diamondInCar]++;
            }
            car.ability.Refresh();
            var m2 = player.GetMoneyCanSave();
            if (m1 != m2)
            {
                MoneyCanSaveChanged(player, m2, ref notifyMsg);
            }
        }

        /// <summary>
        /// 从player将钱转移到car
        /// </summary>
        /// <param name="player"></param>
        /// <param name="car"></param>
        /// <param name="pType"></param>
        /// <returns></returns>
        private bool giveMoneyFromPlayerToCarForPromoting(Player player, Car car, string pType, ref List<string> notifyMsg)
        {
            var needMoney = this.promotePrice[pType];
            if (player.MoneyToPromote < needMoney)
            {
                return false;
            }
            else if (car.ability.SumMoneyCanForPromote != 0)
            {
                Console.WriteLine("小车从基站出发，身上的钱，没有清零！");
                //初始化失败，小车 comeback后，没有完成交接！！！
                throw new Exception("car.ability.costBusiness != 0m");
            }
            else
            {
                var m1 = player.GetMoneyCanSave();
                long moneyFromSupport, moneyFromEarn;
                player.PayWithSupport(needMoney, out moneyFromSupport, out moneyFromEarn);
                car.ability.getMoneyWithSupport(moneyFromSupport, moneyFromEarn);
                var m2 = player.GetMoneyCanSave();
                if (m1 != m2)
                {
                    MoneyCanSaveChanged(player, m2, ref notifyMsg);
                }
                return true;
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="startT"></param>
        /// <param name="dor"></param>
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
                {
                    if ((dor.changeType == "mile" || dor.changeType == "business" || dor.changeType == "volume" || dor.changeType == "speed")
                     && car.state == CarState.buying)
                    {
                        if (car.targetFpIndex == -1)
                        {
                            throw new Exception("居然来了一个没有目标的车！！！");
                        }
                        if (car.ability.diamondInCar != "")
                        {
                            throw new Exception("怎么能让满载车出来购买？");
                        }
                        if (!(car.purpose == Purpose.collect || car.purpose == Purpose.@null || car.purpose == Purpose.tax))
                        {
                            //在执行抢能力提升宝石是，有可能之前是在基地等待 car.purpose == Purpose.@null
                            //在执行抢能力提升宝石时，也有可能之前是在完成收集任务之后 car.purpose == Purpose.collect
                            //在执行抢能力提升宝石时，也有可能之前是在完成收集保护费之后 car.purpose == Purpose.tax
                            throw new Exception($"错误的purpose:{car.purpose}");
                        }
                        if (dor.target == this.getPromoteState(dor.changeType))
                        {
                            /*
                             * 这里，整个流程，保证玩家在开始任务的时候，钱是够的。如果不够，要爆异常的。
                             */
                            var needMoney = this.promotePrice[dor.changeType];
                            if (car.ability.SumMoneyCanForPromote < needMoney)
                            {
                                /*
                                 * 这里，在逻辑上保证了car.ability.SumMoneyCanForPromote >=needMoney
                                 * 首先在出发的时候就进行判断
                                 * 其次，在promote地点选择的时候，会避免使用玩家的target.
                                 * 最后保证了dor.target == this.getPromoteState(dor.changeType) 条件下，
                                 * 肯定car.ability.SumMoneyCanForPromote >= needMoney
                                 */
                                throw new Exception("钱不够，还让执行setDiamondOwner");
                            }
                            Console.WriteLine($"需要用钱支付");
                            printState(player, car, $"支付前：subsidize:{car.ability.subsidize},costBusiness:{car.ability.costBusiness},costVolume:{car.ability.costVolume},needMoney:{needMoney}");
                            car.ability.payForPromote(needMoney);//用汽车上的钱支付
                            printState(player, car, $"支付后：subsidize:{car.ability.subsidize},costBusiness:{car.ability.costBusiness},costVolume:{car.ability.costVolume},needMoney:{needMoney}");

                            setPromtePosition(dor.changeType);
                            //this.promoteMilePosition = GetRandomPosition();
                            needUpdatePromoteState = true;
                            car.ability.diamondInCar = dor.changeType;
                            printState(player, car, "执行购买过程！需要立即执行返回！");
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
                            Console.WriteLine($"{player.PlayerName}的{dor.car}执行完购买宝石过程，由于没有抢到，停在路上,待命中...！");
                            carParkOnRoad(dor.target, ref car, player);

                            if (this.debug)
                            {

                            }

                            if (car.purpose == Purpose.@null && car.state == CarState.buying)
                            {
                                car.state = CarState.waitOnRoad;

                                this._Players[dor.key].returningRecord[dor.car] = dor.returnPath;

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
                    else
                    {
                        throw new Exception("car.state == CarState.buying!或者 dor.changeType不是四种类型");
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="player"></param>
        /// <param name="car"></param>
        /// <param name="sp"></param>
        /// <param name="notifyMsg"></param>
        /// <returns>true：表示已执行；false，表示各种原因(去不了、去了回不来)未执行。</returns>
        bool promote(Player player, Car car, SetPromote sp, ref List<string> notifyMsg, out MileResultReason reason)
        {
            var from = this.getFromWhenUpdatePromote(player, car);
            var to = GetPromotePositionTo(sp.pType);//  this.promoteMilePosition;

            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var baseFp = Program.dt.GetFpByIndex(player.StartFPIndex);

            //var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            //var returnPath = Program.dt.GetAFromB(fp2, baseFp.FastenPositionID);
            var goPath = Program.dt.GetAFromB(from, to);
            var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);

            var goMile = GetMile(goPath);
            var returnMile = GetMile(returnPath);


            //第一步，计算去程和回程。
            if (car.ability.leftMile >= goMile + returnMile)
            {
                int startT;
                EditCarStateWhenPromoteStartOK(ref car, to, fp1, to, sp, goPath, out startT);
                StartDiamondOwnerThread(startT, car, sp, returnPath, goMile);
                getAllCarInfomations(sp.Key, ref notifyMsg);
                reason = MileResultReason.Abundant;
                return true;
            }

            else if (car.ability.leftMile >= goMile)
            {
                printState(player, car, $"去程{goMile}，回程{returnMile},去了回不来");
                reason = MileResultReason.CanNotReturn;
                return false;
            }
            else
            {
                printState(player, car, $"去程{goMile}，回程{returnMile},去不了");
                reason = MileResultReason.CanNotReach;
                return false;
            }
        }

        private void StartDiamondOwnerThread(int startT, Car car, SetPromote sp, List<Model.MapGo.nyrqPosition> returnPath, int goMile)
        {
            Thread th = new Thread(() => setDiamondOwner(startT, new commandWithTime.diamondOwner()
            {
                c = "diamondOwner",
                key = sp.Key,
                car = sp.car,
                returnPath = returnPath,
                target = car.targetFpIndex,//新的起点
                changeType = sp.pType,
                costMile = goMile
            }));
            th.Name = "DiamondOwner";
            th.Start();
        }

        private void EditCarStateWhenPromoteStartOK(ref Car car, int to, Model.FastonPosition fp1, int to2, SetPromote sp, List<Model.MapGo.nyrqPosition> goPath, out int startT)
        {
            car.targetFpIndex = to;//A.更改小车目标，在其他地方引用。
            car.changeState++;//B.更改状态用去前台更新动画    

            /*
             * C.更新小车动画参数
             */
            var speed = car.ability.Speed;
            startT = 0;
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
            else if (car.state == CarState.waitForTaxOrAttack)
            {
                result = new List<Data.PathResult>();
            }
            else
            {
                Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
                throw new Exception("错误的汽车类型！！！");
            }
            Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);
            car.animateData = new AnimateData()
            {
                animateData = result,
                recordTime = DateTime.Now
            };

            car.state = CarState.buying;//更改汽车状态

            //Thread th = new Thread(() => setDiamondOwner(startT, new commandWithTime.diamondOwner()
            //{
            //    c = "diamondOwner",
            //    key = sp.Key,
            //    car = sp.car,
            //    returnPath = returnPath,
            //    target = to,//新的起点
            //    changeType = sp.pType,
            //    costMile = goMile
            //}));
            //th.Start();
            //car.changeState++;//更改状态

            //getAllCarInfomations(sp.Key, ref notifyMsg);
        }

        private void setPromtePosition(string changeType)
        {
            if (changeType == "mile")
                this.promoteMilePosition = GetRandomPosition();
            else if (changeType == "business")
                this.promoteBusinessPosition = GetRandomPosition();
            else if (changeType == "volume")
                this.promoteVolumePosition = GetRandomPosition();
            else if (changeType == "speed")
                this.promoteSpeedPosition = GetRandomPosition();
            else
            {
                throw new Exception($"{changeType}是什么类型？");
            }
            this.promotePrice[changeType] = GetPriceOfPromotePosition(changeType);
        }

        /// <summary>
        /// 获取一个玩家的 四个能力提升点
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        private async Task CheckAllPromoteState(string key)
        {
            await CheckPromoteState(key, "mile");
            await CheckPromoteState(key, "business");
            await CheckPromoteState(key, "volume");
            await CheckPromoteState(key, "speed");
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
