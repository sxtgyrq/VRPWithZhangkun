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
        internal async Task<string> updateBust(SetBust sb)
        {
            if (string.IsNullOrEmpty(sb.car))
            {
                return "";
            }
            else if (!(sb.car == "carA" || sb.car == "carB" || sb.car == "carC" || sb.car == "carD" || sb.car == "carE"))
            {
                return "";
            }
            else if (!(this._Players.ContainsKey(sb.targetOwner)))
            {
                return "";
            }
            else if (this._Players[sb.targetOwner].StartFPIndex != sb.target)
            {
                return "";
            }
            else if (sb.targetOwner == sb.Key)
            {
#warning 这里要加日志，出现了自己破产自己！！！
                return "";
            }
            else
            {
                var carIndex = getCarIndex(sb.car);
                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sb.Key))
                    {
                        if (this._Players[sb.Key].Bust) { }
                        else
                        {
                            //  case "findWork":
                            {
                                var player = this._Players[sb.Key];
                                var car = this._Players[sb.Key].getCar(carIndex);
                                switch (car.state)
                                {
                                    case CarState.waitAtBaseStation:
                                        {
                                            if (car.purpose == Purpose.@null)
                                            {
                                                {

                                                    //var state = CheckTargetState(sa.targetOwner);
                                                    if (this._Players[sb.targetOwner].TheLargestHolderKey == player.Key)
                                                    {
                                                        MileResultReason mrr;
                                                        bust(player, car, sb, ref notifyMsg, out mrr);
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
                                                            giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                        }
                                                        // doAttack(player, car, sa, ref notifyMsg);
                                                    }
                                                    else
                                                    {
                                                        Console.WriteLine($"攻击对象的最大股东不是你！");
                                                        giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                    }
                                                    //else if (state == CarStateForBeAttacked.NotExisted)
                                                    //{
                                                    //    Console.WriteLine($"攻击对象已经退出了游戏！");
                                                    //    giveMoneyFromCarToPlayer(player, car, ref notifyMsg);
                                                    //}
                                                    //else
                                                    //{
                                                    //    throw new Exception($"{state.ToString()}未注册！");
                                                    //}
                                                }
                                                //                                                else
                                                //                                                {
                                                //#warning 前端要提示
                                                //                                                    Console.WriteLine($"金钱不足以展开攻击！");
                                                //                                                    //carsBustFailedThenMustReturn(car, player, sb, ref notifyMsg);
                                                //                                                    carsBustFailedThenMustReturn(car, player, sb, ref notifyMsg);
                                                //                                                }
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

        //更新玩家的贡献率！
        /// <summary>
        /// 更新玩家的资金回报率！
        /// </summary>
        internal async void UpdatePlayerFatigueDegree()
        {
            /*
             * 后台，调整了玩家的资金回报率（游戏难度），要进行广播。告诉所有参与的人！
             */
            List<string> notifyMsg = new List<string>();
            List<string> keysOfAll = new List<string>();
            lock (this.PlayerLock)
            {
                // List<string> keysOfAll = new List<string>();
                foreach (var item in this._Players)
                {
                    if (!item.Value.Bust)
                    {
                        keysOfAll.Add(item.Key);
                    }
                }
                for (var i = 0; i < keysOfAll.Count; i++)
                {
                    var recordValue = this._Players[keysOfAll[i]].brokenParameterT1 + 1;
                    this._Players[keysOfAll[i]].setBrokenParameterT1(recordValue, ref notifyMsg);

                    //  await TellOtherPlayerMyFatigueDegree(getPosition.Key);

                    for (var j = 0; j < keysOfAll.Count; j++)
                    {
                        if (i != j)
                        {
                            if (this._Players[keysOfAll[j]].othersContainsKey(keysOfAll[i]))
                            {
                                var other = this._Players[keysOfAll[j]].GetOthers(keysOfAll[i]);
                                if (other.brokenParameterT1Record != recordValue)
                                {
                                    other.setBrokenParameterT1Record(recordValue, ref notifyMsg);
                                }
                            }
                        }
                    }
                }

            }

            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                //   Console.WriteLine($"url:{url}");
                await Startup.sendMsg(url, sendMsg);
            }

            for (var i = 0; i < keysOfAll.Count; i++)
            {
                await TellOtherPlayerMyFatigueDegree(keysOfAll[i]);
            }
            //    return;
            //List<string> notifyMsg = new List<string>();
            //lock (this.PlayerLock)
            //{
            //    List<string> keysOfAll = new List<string>();
            //    List<string> keysNeedToClear = new List<string>();
            //    foreach (var item in this._Players)
            //    {

            //        if (item.Value.Bust)
            //        {
            //            List<int> indexAll = new List<int>()
            //            {
            //                0,1,2,3,4
            //            };
            //            var countAtBaseStation = (from indexItem in indexAll
            //                                      where
            //               item.Value.getCar(indexItem).state == CarState.waitAtBaseStation
            //                                      select indexItem).Count();
            //            if (countAtBaseStation == 5)
            //            {
            //                keysNeedToClear.Add(item.Key);
            //                //  this._Players.Remove(keysNeedToClear[i]);

            //                //for (var j = 0; j < keysOfAll.Count; j++)
            //                //{
            //                //    if (this._Players[keysOfAll[j]].others.ContainsKey(keysNeedToClear[i]))
            //                //    {
            //                //        this._Players[keysOfAll[j]].others.Remove(keysNeedToClear[i]);
            //                //    }
            //                //    if (this._Players[keysOfAll[j]].DebtsContainsKey(keysNeedToClear[i]))
            //                //    {
            //                //        this._Players[keysOfAll[j]].DebtsRemove(keysNeedToClear[i]);
            //                //    }

            //                //}
            //                //continue;
            //            }
            //            else
            //            {
            //                keysOfAll.Add(item.Key);
            //            }
            //        }
            //        else
            //        {
            //            keysOfAll.Add(item.Key);
            //        }
            //    }

            //    for (var i = 0; i < keysNeedToClear.Count; i++)
            //    {
            //        this._Players.Remove(keysNeedToClear[i]);

            //        for (var j = 0; j < keysOfAll.Count; j++)
            //        {
            //            if (this._Players[keysOfAll[j]].othersContainsKey(keysNeedToClear[i]))
            //            {
            //                this._Players[keysOfAll[j]].othersRemove(keysNeedToClear[i], ref notifyMsg);
            //            }
            //            if (this._Players[keysOfAll[j]].DebtsContainsKey(keysNeedToClear[i]))
            //            {
            //                this._Players[keysOfAll[j]].DebtsRemove(keysNeedToClear[i], ref notifyMsg);
            //            }

            //        }
            //        continue;
            //    }

            //}

            //for (var i = 0; i < notifyMsg.Count; i += 2)
            //{
            //    var url = notifyMsg[i];
            //    var sendMsg = notifyMsg[i + 1];
            //    //   Console.WriteLine($"url:{url}");
            //    await Startup.sendMsg(url, sendMsg);
            //}
        }
        internal async Task TellMeOtherPlayersFatigueDegree(string selfKey)
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                foreach (var item in this._Players)
                {
                    {
                        brokenParameterT1RecordChanged(selfKey, item.Key, item.Value.brokenParameterT1, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                // Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
        }
        internal async Task TellOtherPlayerMyFatigueDegree(string key)
        {

            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                foreach (var item in this._Players)
                {
                    if (item.Key == key) { }
                    else
                    {
                        // item.Value.brokenParameterT1;
                        brokenParameterT1RecordChanged(item.Key, key, this._Players[key].brokenParameterT1, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                // Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
        }

        private void carsBustFailedThenMustReturn(Car car, Player player, SetBust sb, ref List<string> notifyMsg)
        {
            Console.WriteLine($"由于里程安排问题，必须返回！");
            var from = getFromWhenAttack(this._Players[sb.Key], car);
            int startT = 1;
            //var carKey = $"{}_{}";
            var returnPath_Record = this._Players[sb.Key].returningRecord[sb.car];
            Thread th = new Thread(() => setReturn(startT, new commandWithTime.returnning()
            {
                c = "returnning",
                key = sb.Key,
                car = sb.car,
                returnPath = returnPath_Record,
                target = from,
                changeType = AttackFailedReturn,
            }));
            th.Start();
        }

        private void bust(Player player, Car car, SetBust sb, ref List<string> notifyMsg, out MileResultReason Mrr)
        {
            {
                //if (this._Players[sa.targetOwner].Bust)


                {
                    var from = this.getFromWhenAttack(player, car);
                    var to = sb.target;
                    var fp1 = Program.dt.GetFpByIndex(from);
                    var fp2 = Program.dt.GetFpByIndex(to);
                    var baseFp = Program.dt.GetFpByIndex(player.StartFPIndex);

                    // var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
                    var goPath = this.GetAFromB(from, to, player, ref notifyMsg);
                    // var goPath = Program.dt.GetAFromB(from, to);
                    //var returnPath = Program.dt.GetAFromB(fp2, baseFp.FastenPositionID);
                    var returnPath = this.GetAFromB(to, player.StartFPIndex, player, ref notifyMsg);
                    //var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);

                    var goMile = GetMile(goPath);
                    var returnMile = GetMile(returnPath);


                    //第一步，计算去程和回程。
                    if (car.ability.leftMile >= goMile + returnMile)
                    {
                        int startT;
                        EditCarStateWhenBustStartOK(player, ref car, to, fp1, sb, goPath, out startT, ref notifyMsg);
                        SetBustArrivalThread(startT, car, sb, returnPath);
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

            }
        }



        private void SetBustArrivalThread(int startT, Car car, SetBust sb, List<Model.MapGo.nyrqPosition> returnPath)
        {
            Thread th = new Thread(() => setBustF(startT, new commandWithTime.bustSet()
            {
                c = "bustSet",
                key = sb.Key,
                car = sb.car,
                returnPath = returnPath,
                target = car.targetFpIndex,//新的起点
                changeType = "Bust",
                victim = sb.targetOwner
            }));
            th.Start();
        }


        private void BustChangedF(Player player, bool bustValue, ref List<string> msgsWithUrl)
        {
            foreach (var item in this._Players)
            {
                msgsWithUrl.Add(item.Value.FromUrl);
                BustStateNotify tn = new BustStateNotify()
                {
                    c = "BustStateNotify",
                    Bust = bustValue,
                    WebSocketID = item.Value.WebSocketID,
                    Key = item.Value.Key
                };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(tn);
                msgsWithUrl.Add(json);
            }
        }
        private async Task<string> setBustF(int startT, commandWithTime.bustSet bustSet)
        {
            lock (this.PlayerLock)
            {
                var player = this._Players[bustSet.key];
                var car = this._Players[bustSet.key].getCar(bustSet.car);
                if (car.purpose == Purpose.attack)
                {

                }
                else
                {
                    Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
                    throw new Exception("car.purpose 未注册");
                }
            }

            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setBustF");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setBustF正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdatePlayers = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[bustSet.key];
                var car = this._Players[bustSet.key].getCar(bustSet.car);
                // car.targetFpIndex = this._Players[dor.key].StartFPIndex;
                if (bustSet.changeType == "Bust"
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
                    else if (car.ability.costBusiness != 0)
                    {

                        throw new Exception($"执行破产业务时，错误的car.ability.costBusiness :{car.ability.costBusiness }");
                    }
                    else
                    {
                        /*
                         * 当到达地点时，有可能攻击攻击对象不存在。
                         * 也有可能攻击对象已破产。
                         * 还有正常情况。
                         * 这三种情况都要考虑到。
                         */

                        var attackMoney = 0;
                        Console.WriteLine($"player:{player.Key},car{bustSet.car},bustMoney:{0}");
                        if (this._Players.ContainsKey(bustSet.victim))
                        {
                            var victim = this._Players[bustSet.victim];
                            if (!victim.Bust)
                            {
                                //  var m1 = victim.GetMoneyCanSave();
                                // var lastDebt = victim.LastDebt;
                                if (player.DebtsContainsKey(bustSet.victim))
                                {

                                    /*
                                     * step1用 business 和 volume 先偿还债务！
                                     * s
                                     */
                                    int k = 0;
                                    do
                                    {
                                        {
                                            var debt = Math.Min(car.ability.costBusiness, player.DebtsGet(bustSet.victim));
                                            player.SetDebts(bustSet.victim, player.DebtsGet(bustSet.victim) - debt, ref notifyMsg);
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
                                            var debt = Math.Min(car.ability.costVolume, player.DebtsGet(bustSet.victim));
                                            player.SetDebts(bustSet.victim, player.DebtsGet(bustSet.victim) - debt, ref notifyMsg);
                                            //player.Debts[dOwner.victim] -= debt;
                                            //car.ability.costVolume -= debt;
                                            if (debt > 0)
                                            {
                                                car.ability.setCostVolume(car.ability.costVolume - debt, player, car, ref notifyMsg);
                                            }

                                            //AbilityChanged(player, car, ref notifyMsg, "volume");
                                        }
                                        // attackMoney = car.ability.costBusiness + car.ability.costVolume;
                                        k++;
                                        if (k > 1000)
                                        {
                                            Console.ReadLine();
                                        }
                                    }
                                    while (attackMoney != 0 && player.DebtsGet(bustSet.victim) != 0);

                                    if (player.DebtsGet(bustSet.victim) == 0)
                                    {
                                        player.DebtsRemove(bustSet.victim, ref notifyMsg);
                                    }

                                }

                                {
                                    //执行 攻击动作！ 
                                    // if (attackMoney > 0)
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
                                        //car.ability.costVolume -= attack;
                                        //AbilityChanged(player, car, ref notifyMsg, "volume");
                                    }
                                }
                                //  var m2 = victim.GetMoneyCanSave();
                                // if (m1 != m2)
                                {
                                    /*执行破产过程*/
                                    if (victim.TheLargestHolderKey == player.Key)
                                    {
                                        //victim.Bust = true;
                                        victim.SetBust(true, ref notifyMsg);
                                    }
                                }
                                {
                                    /*分配财富*/
                                    var money = Math.Max(victim.Money - 500, 0);

                                    var shares = victim.Shares;

                                    List<string> keys = new List<string>();
                                    var copy = victim.DebtsCopy;
                                    foreach (var item in copy)
                                    {
                                        keys.Add(item.Key);
                                    }
                                    if (victim.sumDebets > 0)
                                    {
                                        for (var i = 0; i < keys.Count; i++)
                                        {
                                            copy[keys[i]] = money * copy[keys[i]] / victim.sumDebets;

                                        }
                                        for (var i = 0; i < keys.Count; i++)
                                        {
                                            this._Players[keys[i]].AddTax(victim.StartFPIndex, Math.Max(1, copy[keys[i]]), ref notifyMsg);
                                        }
                                    }
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
                            key = bustSet.key,
                            car = bustSet.car,
                            returnPath = bustSet.returnPath,//returnPath_Record,
                            target = bustSet.target,
                            changeType = bustSet.changeType,
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
            return "ok";
        }

        private void EditCarStateWhenBustStartOK(Player player, ref Car car, int to, Model.FastonPosition fp1, SetBust sb, List<Model.MapGo.nyrqPosition> goPath, out int startT, ref List<string> notifyMsg)
        {
            car.targetFpIndex = to;//A.更改小车目标，在其他地方引用。
            car.setPurpose(this._Players[sb.Key], ref notifyMsg, Purpose.attack);
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
                result = getStartPositon(fp1, sb.car, ref startT);
            }
            else
            {
                throw new Exception("错误的汽车类型！！！");
            }
            car.setState(this._Players[sb.Key], ref notifyMsg, CarState.roadForAttack);
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
        }
    }
}
