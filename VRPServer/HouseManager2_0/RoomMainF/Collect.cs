using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static HouseManager2_0.Car;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {

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
            CanNotReturn,
            MoneyIsNotEnougt
        }
        /// <summary>
        /// 获取收集金钱的状态
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        private async Task CheckCollectState(string key)
        {

            //string url = "";
            //string sendMsg = "";
            List<string> sendMsgs = new List<string>();
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(key))
                    for (var i = 0; i < 38; i++)
                    {
                        if (this._Players[key].CollectPosition[i] == this._collectPosition[i])
                        { }
                        else
                        {
                            var infomation = Program.rm.GetCollectInfomation(this._Players[key].WebSocketID, i);
                            var url = this._Players[key].FromUrl;
                            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                            sendMsgs.Add(url);
                            sendMsgs.Add(sendMsg);
                            this._Players[key].CollectPosition[i] = this._collectPosition[i];
                        }
                    }

            for (var i = 0; i < sendMsgs.Count; i += 2)
            {
                await Startup.sendMsg(sendMsgs[i], sendMsgs[i + 1]);
            }
        }

        private BradCastCollectInfoDetail_v2 GetCollectInfomation(int webSocketID, int collectIndex)
        {
            var obj = new BradCastCollectInfoDetail_v2
            {
                c = "BradCastCollectInfoDetail_v2",
                WebSocketID = webSocketID,
                Fp = Program.dt.GetFpByIndex(this._collectPosition[collectIndex]),
                collectMoney = this.GetCollectReWard(collectIndex),
                collectIndex = collectIndex
            };
            return obj;
        }

        internal async Task<string> updateCollect(SetCollect sc)
        {
            //if (string.IsNullOrEmpty(sc.car))
            //{
            //    return "";
            //}
            //else if (!(sc.car == "carA" || sc.car == "carB" || sc.car == "carC" || sc.car == "carD" || sc.car == "carE"))
            //{
            //    return "";
            //}
            //else 
            if (string.IsNullOrEmpty(sc.cType))
            {
                return "";
            }
            else if (!(sc.cType == "findWork"))
            {
                return "";
            }
            if (string.IsNullOrEmpty(sc.fastenpositionID))
            {
                return "";
            }
            else if (!CityRunFunction.FormatLike.LikeFsPresentCode(sc.fastenpositionID))
            {
                return "";
            }
            else if (sc.collectIndex < 0 || sc.collectIndex >= 38)
            {
                return "";
            }
            else if (Program.dt.GetFpByIndex(this._collectPosition[sc.collectIndex]).FastenPositionID != sc.fastenpositionID)
            {
                return "";
            }
            else
            {
                //var carIndex = getCarIndex(sc.car);
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
                                        var car = this._Players[sc.Key].getCar();
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

        void CollectF(Car car, Player player, SetCollect sc, ref List<string> notifyMsg, out MileResultReason reason)
        {
            var from = GetFromWhenUpdateCollect(this._Players[sc.Key], sc.cType, car);
            var to = getCollectPositionTo(sc.collectIndex);//  this.promoteMilePosition;
            var fp1 = Program.dt.GetFpByIndex(from);
            var fp2 = Program.dt.GetFpByIndex(to);
            var fbBase = Program.dt.GetFpByIndex(player.StartFPIndex);
            //var goPath = Program.dt.GetAFromB(fp1, fp2.FastenPositionID);
            //var goPath = Program.dt.GetAFromB(from, to);
            var goPath = this.GetAFromB(from, to, player, ref notifyMsg);
            //var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);
            var returnPath = this.GetAFromB(to, player.StartFPIndex, player, ref notifyMsg);
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
                //car = sc.car,
                returnPath = returnPath,
                target = car.targetFpIndex,
                costMile = goMile
            }));
            th.Start();
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
                var car = this._Players[pa.key].getCar();


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


        private void arriveThenDoCollect(ref Player player, ref Car car, commandWithTime.placeArriving pa, ref List<string> notifyMsg, out bool needUpdateCollectState)
        {
            needUpdateCollectState = false;
            if (car.targetFpIndex == -1)
            {
                throw new Exception("这个地点应该是等待的地点！");
            }
            if (this._collectPosition.ContainsValue(pa.target))
            {


                int taxPostion = pa.target;
                //拿到钱的单位是分！
                long collectReWard = getCollectReWardByReward(pa.target);//依据target来判断应该收入多少！

                long sumCollect = collectReWard; //DealWithTheFrequcy(this.CollectReWard);
                var selfGet = sumCollect;
                //  long sumDebet = 0;


                var shares = GetShares(player);//获取股份

                Dictionary<string, long> profiles = new Dictionary<string, long>();
                foreach (var item in shares)
                {
                    if (item.Key != player.Key)
                    {
                        var profileOfOther = item.Value * sumCollect / Player.ShareBaseValue;
                        profileOfOther = Math.Max(profileOfOther, 1);
                        profiles.Add(item.Key, profileOfOther);
                        printState(player, car, $"{player.PlayerName}({player.Key})通过收集，在{Program.dt.GetFpByIndex(taxPostion).FastenPositionName}，给{this._Players[item.Key].PlayerName}创造利润");
                        selfGet -= profileOfOther;
                    }
                }
                foreach (var item in profiles)
                {
                    if (this._Players.ContainsKey(item.Key))
                    {
                        var sumTax = item.Value;
                        var Shares = this._Players[item.Key].Shares;
                        foreach (var shareItem in shares)
                        {
                            var itemTax = shareItem.Value * sumTax / Player.ShareBaseValue;
                            itemTax = Math.Max(1, itemTax);
                            this._Players[shareItem.Key].AddTax(taxPostion, itemTax, ref notifyMsg);
                        }

                    }
                    else
                    {
                        //#warning 这里要确保删除player单个对象时，把其他player中的关于本player的记录进行删除
                        //↑↑↑这个需要安排模拟测试↑↑↑
                        throw new Exception("系统错误！");
                    }
                }
                {
                    selfGet = Math.Max(1, selfGet);
                    car.ability.setCostVolume(car.ability.costVolume + selfGet, player, car, ref notifyMsg);
                    addFrequencyRecord();
                }
                this.setCollectPosition(pa.target);
                //  this.collectPosition = this.GetRandomPosition(true);
                needUpdateCollectState = true;

                Console.WriteLine("----Do the collect process----！");

                GetMusic(player, ref notifyMsg);
                GetBackground(player, ref notifyMsg);
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
                this._Players[pa.key].returningRecord = pa.returnPath;

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



        private void setCollectPosition(int target)
        {
            int key = -1;
            foreach (var item in this._collectPosition)
            {
                if (item.Value == target)
                {
                    key = item.Key;
                    break;
                    //  return this.GetCollectReWard(item.Key) * 100;
                }
            }
            if (key != -1)
            {
                this._collectPosition[key] = GetRandomPosition(true);
            }
            // return 0;
        }

        private long getCollectReWardByReward(int target)
        {
            foreach (var item in this._collectPosition)
            {
                if (item.Value == target)
                {
                    return this.GetCollectReWard(item.Key) * 100;
                }
            }
            return 0;
            // throw new NotImplementedException();
        }

        private int getCollectPositionTo(int collectIndex)
        {
            if (collectIndex >= 0 && collectIndex < 38)
            {
                return this._collectPosition[collectIndex];
            }
            else
                throw new Exception("parameter is wrong!");
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
        private int GetCollectReWard(int collectIndex)
        {
            switch (collectIndex)
            {
                case 0:
                    {
                        return 100;
                    };
                case 1:
                case 2:
                    {
                        return 50;
                    }
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    {
                        return 20;
                    }
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                    {
                        return 10;
                    }
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                case 37:
                    { return 5; }
                default:
                    {
                        throw new NotImplementedException();
                    }
            }
        }

        /// <summary>
        /// 收集失败，安排返回。
        /// </summary>
        /// <param name="car"></param>
        /// <param name="player"></param>
        /// <param name="sc"></param>
        /// <param name="notifyMsg"></param>
        private void collectFailedThenReturn(Car car, Player player, SetCollect sc, ref List<string> notifyMsg)
        {
            if (car.state == CarState.waitForCollectOrAttack || car.state == CarState.waitOnRoad)
            {
                //Console.Write($"现在剩余容量为{car.ability.leftVolume}，总容量为{car.ability.Volume}");
                //Console.Write($"你装不下了！");
                Console.Write($"该汽车被安排回去了");
                var from = GetFromWhenUpdateCollect(this._Players[sc.Key], sc.cType, car);
                int startT = 1;
                //var carKey = $"{sc.car}_{}";
                var returnPath_Record = this._Players[sc.Key].returningRecord;
                // var returnPath_Record = this.returningRecord(carKey];
                Thread th = new Thread(() => setReturn(startT, new commandWithTime.returnning()
                {
                    c = "returnning",
                    key = sc.Key,
                    returnPath = returnPath_Record,
                    target = from,
                    changeType = CollectReturn,
                }));
                th.Start();
                //car.changeState++;//更改状态   
                //getAllCarInfomations(sc.Key, ref notifyMsg);
            }
            else if (car.state == CarState.waitAtBaseStation)
            {

            }
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
            List<int> result;
            Data.PathStartPoint2 startPosition;
            if (car.state == CarState.waitAtBaseStation)
            {
                getStartPositionByFp(out startPosition, fp1);
                result = getStartPositon(fp1, player.positionInStation, ref startT);
            }
            else if (car.state == CarState.waitForCollectOrAttack)
            {
                result = new List<int>();
                getStartPositionByGoPath(out startPosition, goPath);
            }
            else if (car.state == CarState.waitOnRoad && car.ability.diamondInCar == "" && (car.purpose == Purpose.@null || car.purpose == Purpose.collect))
            {
                result = new List<int>();
                getStartPositionByGoPath(out startPosition, goPath);
            }
            else
            {
                throw new Exception($"未知情况！{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
            }
            car.setState(player, ref notifyMsg, CarState.roadForCollect);
            //car.state = CarState.roadForCollect;

            Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
            //  result.RemoveAll(item => item.t == 0);

            car.setAnimateData(player, ref notifyMsg, new AnimateData2()
            {
                start = startPosition,
                animateData = result,
                recordTime = DateTime.Now
            });
        }


        private async Task CheckAllPlayersCollectState()
        {
            var all = getGetAllPlayer();
            for (var i = 0; i < all.Count; i++)
            {
                await CheckCollectState(all[i].Key);
            }
        }
    }
}
