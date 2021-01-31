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
                        if (this._Players[sc.Key].Bust) { }
                        else
                            switch (sc.cType)
                            {
                                case "findWork":
                                    {
                                        var player = this._Players[sc.Key];
                                        var car = this._Players[sc.Key].getCar(carIndex);
                                        if (car.purpose == Purpose.@null || car.purpose == Purpose.collect)
                                        {
                                            switch (car.state)
                                            {
                                                case CarState.waitForCollectOrAttack:
                                                    {
                                                        if (car.purpose == Purpose.collect)
                                                        {
                                                            if (car.ability.leftVolume > 0)
                                                            {
                                                                MileResultReason result;
                                                                CollectF(car, player, sc, ref notifyMsg, out result);
                                                                if (result == MileResultReason.Abundant)
                                                                {
                                                                    printState(player, car, "已经在收集金钱的路上了");
                                                                }
                                                                else
                                                                {
                                                                    printState(player, car, $"里程问题，被安排回去");
                                                                    //Console.Write($"现在剩余容量为{car.ability.leftVolume}，总容量为{car.ability.Volume}");
                                                                    //Console.Write($"你装不下了！");
                                                                    collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                                    if (result == MileResultReason.CanNotReach)
                                                                    {
                                                                        WebNotify(player, "您的剩余里程不足以支持您到达目的地！");
                                                                    }
                                                                    else if (result == MileResultReason.CanNotReturn)
                                                                    {
                                                                        WebNotify(player, "到达目的地后，您的剩余里程不足以支持您返回！");
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                printState(player, car, $"收集仓已满，被安排回去");
                                                                collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                                WebNotify(player, $"收集仓已满，被安排回去");
                                                            }
                                                        }
                                                    }; break;
                                                case CarState.waitAtBaseStation:
                                                    {
                                                        /*
                                                         * 在基地进行等待。收集不需要volume 或者business
                                                         */
                                                        if (car.purpose == Purpose.@null)
                                                        {
                                                            MileResultReason result;
                                                            CollectF(car, player, sc, ref notifyMsg, out result);
                                                            if (result == MileResultReason.Abundant)
                                                            {
                                                                printState(player, car, "已经在收集金钱的路上了");
                                                            }
                                                            else
                                                            {
                                                                printState(player, car, $"里程问题，未能启动！");
                                                            }
                                                        }
                                                    }; break;
                                                case CarState.waitOnRoad:
                                                    {
                                                        if (car.purpose != Purpose.tax && car.purpose != Purpose.attack)
                                                        {
                                                            if (car.ability.leftVolume > 0)
                                                            {
                                                                MileResultReason result;
                                                                CollectF(car, player, sc, ref notifyMsg, out result);
                                                                if (result == MileResultReason.Abundant)
                                                                {
                                                                    printState(player, car, "已经在收集金钱的路上了");
                                                                }
                                                                else
                                                                {
                                                                    printState(player, car, $"里程问题，被安排回去");
                                                                    collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                                }
                                                            }
                                                            else
                                                            {
                                                                printState(player, car, $"收集仓已满，被安排回去");
                                                                collectFailedThenReturn(car, player, sc, ref notifyMsg);
                                                            }
                                                        }
                                                        else
                                                        {
                                                            Console.WriteLine("CarState.waitOnRoad car.purpose= Purpose.tax");
                                                            //throw new Exception();
                                                        }
                                                    }; break;

                                            }
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

        private void WebNotify(Player player, string v)
        {
#warning 这里要写
            Console.WriteLine($"{player.PlayerName}-{v}");
        }

        enum MileResultReason
        {
            /// <summary>
            /// 里程充足
            /// </summary>
            Abundant,
            /// <summary>
            /// 不能到达
            /// </summary>
            CanNotReach,
            /// <summary>
            /// 能到达但是不能返回
            /// </summary>
            CanNotReturn
        }
        void CollectF(Car car, Player player, SetCollect sc, ref List<string> notifyMsg, out MileResultReason reason)
        {
            var from = GetFromWhenUpdateCollect(this._Players[sc.Key], sc.cType, car);
            var to = getCollectPositionTo();//  this.promoteMilePosition;
            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var fbBase = Program.dt.GetFpByIndex(player.StartFPIndex);
            //var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            var goPath = Program.dt.GetAFromB(from, to);
            var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);
            var goMile = GetMile(goPath);
            var returnMile = GetMile(returnPath);
            if (car.ability.leftMile >= goMile + returnMile)
            {
                int startT;
                EditCarStateWhenCollectStartOK(player, ref car, to, fp1, sc, goPath, ref notifyMsg, out startT);
                StartArriavalThread(startT, car, sc, returnPath, goMile);
                //  getAllCarInfomations(sc.Key, ref notifyMsg);
                reason = MileResultReason.Abundant;//返回原因
            }

            else if (car.ability.leftMile >= goMile)
            {
                printState(player, car, $"剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile},你去了回不来。所以安排返回");
                reason = MileResultReason.CanNotReturn;
            }
            else
            {
                printState(player, car, $"剩余里程为{car.ability.leftMile}去程{goMile}，回程{returnMile},去不了。所以安排返回");
                reason = MileResultReason.CanNotReach;
                //   return false;
            }
        }

        private void UpdateCurrentAnimation()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 启动到达线程
        /// </summary>
        /// <param name="startT">线程起始时间</param>
        /// <param name="car">执行任务小车</param> 
        /// <param name="sc">传参对象</param>
        /// <param name="returnPath">计划的返还路径</param>
        /// <param name="goMile">去里程,主要用于里程统计！</param>
        private void StartArriavalThread(int startT, Car car, SetCollect sc, List<Model.MapGo.nyrqPosition> returnPath, int goMile)
        {
            Thread th = new Thread(() => setArrive(startT, new commandWithTime.placeArriving()
            {
                c = "placeArriving",
                key = sc.Key,
                car = sc.car,
                returnPath = returnPath,
                target = car.targetFpIndex,
                costMile = goMile
            }));
            th.Start();
        }

        /// <summary>
        /// 修改小车相关属性
        /// </summary>
        /// <param name="car"></param>
        /// <param name="to"></param>
        /// <param name="fp1"></param>
        /// <param name="sc"></param>
        /// <param name="goPath"></param>
        private void EditCarStateWhenCollectStartOK(Player player, ref Car car, int to, Model.FastonPosition fp1, SetCollect sc, List<Model.MapGo.nyrqPosition> goPath, ref List<string> notifyMsg, out int startT)
        {

            car.targetFpIndex = to;//A.更改小车目标，在其他地方引用。
            car.setPurpose(player, ref notifyMsg, Purpose.collect); //B.更改小车目的，用户操作控制
                                                                    //car.purpose = Purpose.collect;//B.更改小车目的，用户操作控制
                                                                    //    car.changeState++;//C.更改状态用去前台更新动画   
            /*
             * 步骤C已经封装进 car.setAnimateData
             */
            /*
             * D.更新小车动画参数
             */

            var speed = car.ability.Speed;
            startT = 0;
            List<Data.PathResult> result;
            if (car.state == CarState.waitAtBaseStation)
                result = getStartPositon(fp1, sc.car, ref startT);
            else if (car.state == CarState.waitForCollectOrAttack)
                result = new List<Data.PathResult>();
            else if (car.state == CarState.waitOnRoad && car.ability.diamondInCar == "" && (car.purpose == Purpose.@null || car.purpose == Purpose.collect))
            {
                result = new List<Data.PathResult>();
            }
            else
            {
                throw new Exception($"未知情况！{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
            }
            car.setState(player, ref notifyMsg, CarState.roadForCollect);
            //car.state = CarState.roadForCollect;

            Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);

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


                if (car.state == CarState.roadForCollect)
                {
                    arriveThenDoCollect(ref player, ref car, pa, ref notifyMsg, out needUpdateCollectState);

                }
                else if (car.state == CarState.roadForTax)
                {
                    arriveThenGetTax(ref player, ref car, pa, ref notifyMsg);
                    //if (car.targetFpIndex == -1)
                    //{
                    //    throw new Exception("这个地点应该是等待的地点！");
                    //}
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
        /// 此方法，用于债务放大权益（包括收益、债务重组）
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        //private long Magnify(long value)
        //{
        //    const long t1 = 105;
        //    const long t2 = 100;
        //    return value * t1 / t2;
        //}
        private void arriveThenDoCollect(ref Player player, ref Car car, commandWithTime.placeArriving pa, ref List<string> notifyMsg, out bool needUpdateCollectState)
        {
            needUpdateCollectState = false;
            if (car.targetFpIndex == -1)
            {
                throw new Exception("这个地点应该是等待的地点！");
            }
            if (pa.target == this.getCollectPositionTo())
            {
                int taxPostion = this.getCollectPositionTo();
                long sumCollect = this.CollectReWard;
                var selfGet = sumCollect;
                long sumDebet = 0;

                var DebtsCopy = player.DebtsCopy;
                foreach (var item in DebtsCopy)
                {
                    sumDebet += player.Magnify(item.Value);
                }
                if (sumDebet > 0)
                {
                    Dictionary<string, long> profiles = new Dictionary<string, long>();

                    // long sumDebts = 0;
                    //foreach (var item in DebtsCopy)
                    //{
                    //    sumDebts += Magnify(item.Value);
                    //}
                    sumDebet += player.Money;
                    sumDebet = Math.Max(1, sumDebet);

                    foreach (var item in DebtsCopy)
                    {
                        if (item.Value > 0)
                        {
                            var profileOfOther = player.Magnify(item.Value) * sumCollect / sumDebet;
                            profileOfOther = Math.Max(profileOfOther, 1);
                            profiles.Add(item.Key, profileOfOther);
                            printState(player, car, $"{player.PlayerName}({player.Key})通过收集，在{Program.dt.GetFpByIndex(taxPostion).FastenPositionName}，给{this._Players[item.Key].PlayerName}创造利润");
                            selfGet -= profileOfOther;
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
                            this._Players[item.Key].AddTax(taxPostion, item.Value, ref notifyMsg);
                            //   SendSingleTax(item.Key, taxPostion, ref notifyMsg);
                        }
                        else
                        {
#warning 这里要确保删除player单个对象时，把其他player中的关于本player的记录进行删除
                            //↑↑↑这个需要安排模拟测试↑↑↑
                            throw new Exception("系统错误！");
                        }
                    }
                }
                {
                    /*
                     * Collect 用 costVolume
                     * GetTax 用 costBussiness
                     */
                    selfGet = Math.Max(1, selfGet);

                    //car.ability.costVolume += selfGet;
                    car.ability.setCostVolume(car.ability.costVolume + selfGet, player, car, ref notifyMsg);
                    //AbilityChanged(player, car, ref notifyMsg, "volume");
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
            // car.ability.costMiles += pa.costMile;//

            var newCostMile = car.ability.costMiles + pa.costMile;
            car.ability.setCostMiles(newCostMile, player, car, ref notifyMsg);
            // AbilityChanged(player, car, ref notifyMsg, "mile");


            carParkOnRoad(pa.target, ref car, player, ref notifyMsg);

            if (car.purpose == Purpose.collect && car.state == CarState.roadForCollect)
            {
                car.setState(player, ref notifyMsg, CarState.waitForCollectOrAttack);
                //car.state = CarState.waitForCollectOrAttack;
                //this.SendStateAndPurpose(player, car, ref notifyMsg);
                //var carKey = $"{pa.car}";
                this._Players[pa.key].returningRecord[pa.car] = pa.returnPath;

                //第二步，更改状态
                //car.changeState++;
                //getAllCarInfomations(pa.key, ref notifyMsg);
            }
            else
            {
#warning 如果代码运行至此处，是要报错，并记录的！
                throw new Exception("");
            }
        }

        //private void AlibityChanged(long m, Player player, Car car, ref List<string> notifyMsg, string pType)
        //{
        //    throw new NotImplementedException();
        //}





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
