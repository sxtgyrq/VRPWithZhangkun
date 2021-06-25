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
        Dictionary<string, long> promotePrice = new Dictionary<string, long>()
        {
            { "mile",1000},
            { "business",1000},
            { "volume",1000},
            { "speed",1000},
        };

        //  if (!(pType == "mile" || pType == "business" || pType == "volume" || pType == "speed"))
        int _promoteMilePosition = -1;
        //   DateTime _TimeRecordMilePosition { get; set; }
        int _promoteBusinessPosition = -1;
        int _promoteVolumePosition = -1;
        int _promoteSpeedPosition = -1;
        int promoteMilePosition
        {
            get
            {
                return this._promoteMilePosition;
            }
            set
            {
                lock (this.PlayerLock)
                {
                    this._promoteMilePosition = value;
                }
            }
        }
        int promoteBusinessPosition
        {
            get { return this._promoteBusinessPosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._promoteBusinessPosition = value;
                }
            }
        }
        int promoteVolumePosition
        {
            get { return this._promoteVolumePosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._promoteVolumePosition = value;
                }
            }
        }
        int promoteSpeedPosition
        {
            get { return this._promoteSpeedPosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._promoteSpeedPosition = value;
                }
            }
        }

        private void SetLookForPromote()
        {
            this.promoteMilePosition = GetRandomPosition(true);
            this.promoteBusinessPosition = GetRandomPosition(true);
            this.promoteVolumePosition = GetRandomPosition(true);
            this.promoteSpeedPosition = GetRandomPosition(true);
        }

        private void SendPromoteCountOfPlayer(string pType, Player player, ref List<string> notifyMsgs)
        {
            if (!(pType == "mile" || pType == "business" || pType == "volume" || pType == "speed"))
            {

            }
            else
            {
                var count = player.PromoteDiamondCount[pType];
                var obj = new BradCastPromoteDiamondCount
                {
                    c = "BradCastPromoteDiamondCount",
                    count = count,
                    WebSocketID = player.WebSocketID,
                    pType = pType
                };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                notifyMsgs.Add(player.FromUrl);
                notifyMsgs.Add(json);
            }
            //throw new NotImplementedException();
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


        private async Task CheckPromoteState(string key, string promoteType)
        {
            string url = "";
            string sendMsg = "";
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(key))
                    if (this._Players[key].PromoteState[promoteType] == this.getPromoteState(promoteType))
                    {
                    }
                    else
                    {
                        var infomation = Program.rm.GetPromoteInfomation(this._Players[key].WebSocketID, promoteType);
                        url = this._Players[key].FromUrl;
                        sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                        this._Players[key].PromoteState[promoteType] = this.getPromoteState(promoteType);
                    }
            if (!string.IsNullOrEmpty(url))
            {
                await Startup.sendMsg(url, sendMsg);
            }
        }

        int getPromoteState(string pType)
        {
            switch (pType)
            {
                case "mile":
                    {
                        return this.promoteMilePosition;
                    }
                case "business":
                    {
                        return this.promoteBusinessPosition;
                    }; ;
                case "volume":
                    {
                        return this.promoteVolumePosition;
                    };
                case "speed":
                    {
                        return this.promoteSpeedPosition;
                    };
                default:
                    {
                        throw new Exception($"{pType}是什么类型");
                    };
            }
        }

        private BradCastPromoteInfoDetail GetPromoteInfomation(int webSocketID, string resultType)
        {
            switch (resultType)
            {
                case "mile":
                    {
                        var obj = new BradCastPromoteInfoDetail
                        {
                            c = "BradCastPromoteInfoDetail",
                            WebSocketID = webSocketID,
                            resultType = resultType,
                            Fp = Program.dt.GetFpByIndex(this.promoteMilePosition),
                            Price = this.promotePrice[resultType]
                        };
                        return obj;
                    }; break;
                case "business":
                    {
                        var obj = new BradCastPromoteInfoDetail
                        {
                            c = "BradCastPromoteInfoDetail",
                            WebSocketID = webSocketID,
                            resultType = resultType,
                            Fp = Program.dt.GetFpByIndex(this.promoteBusinessPosition),
                            Price = this.promotePrice[resultType]
                        };
                        return obj;
                    }; break;
                case "volume":
                    {
                        var obj = new BradCastPromoteInfoDetail
                        {
                            c = "BradCastPromoteInfoDetail",
                            WebSocketID = webSocketID,
                            resultType = resultType,
                            Fp = Program.dt.GetFpByIndex(this.promoteVolumePosition),
                            Price = this.promotePrice[resultType]
                        };
                        return obj;
                    }; break;
                case "speed":
                    {
                        var obj = new BradCastPromoteInfoDetail
                        {
                            c = "BradCastPromoteInfoDetail",
                            WebSocketID = webSocketID,
                            resultType = resultType,
                            Fp = Program.dt.GetFpByIndex(this.promoteSpeedPosition),
                            Price = this.promotePrice[resultType]
                        };
                        return obj;
                    }; break;
                default: { }; break;
            }
            throw new Exception("");
        }

        internal async Task<string> updatePromote(SetPromote sp)
        {
            if (string.IsNullOrEmpty(sp.pType))
            {
                return $"wrong pType:{sp.pType}";
            }
            else if (!(sp.pType == "mile" || sp.pType == "business" || sp.pType == "volume" || sp.pType == "speed"))
            {
                return $"wrong pType:{sp.pType}"; ;
            }
            else
            {
                if (this._Players.ContainsKey(sp.Key))
                {
                    List<string> notifyMsg = new List<string>();
                    var player = this._Players[sp.Key];
                    var car = player.getCar();
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
                                                                            WebNotify(player, $"car-在路上寻找能力宝石的路上了！！！");
                                                                            printState(player, car, "开始在路上寻找能力宝石的路上了！！！");
                                                                        }
                                                                        else
                                                                        {
                                                                            if (reason == MileResultReason.CanNotReach)
                                                                            {
                                                                                WebNotify(player, $"您车的剩余里程不足以支持到达目的地！");
                                                                                //WebNotify(player, $"资金不够,{car.name}未能上路！！！");
                                                                            }
                                                                            else if (reason == MileResultReason.CanNotReturn)
                                                                            {
                                                                                WebNotify(player, $"到达目的地后，您车的剩余里程不足以支持返回！");
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
                                                                                WebNotify(player, $"您的车已经在寻找能力宝石的路上了！！！");
                                                                                printState(player, car, $"已经在收集{sp.pType}宝石的路上了！");
                                                                            }
                                                                            else
                                                                            {
                                                                                if (reason == MileResultReason.CanNotReach)
                                                                                {
                                                                                    WebNotify(player, $"您车的剩余里程不足以支持到达目的地！");
                                                                                    //WebNotify(player, $"资金不够,{car.name}未能上路！！！");
                                                                                }
                                                                                else if (reason == MileResultReason.CanNotReturn)
                                                                                {
                                                                                    WebNotify(player, $"到达目的地后，您车的剩余里程不足以支持返回！");
                                                                                }
                                                                                printState(player, car, "收集宝石剩余里程不足，必须立即返回！");
                                                                                setReturnWhenPromoteFailed(sp, car);
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            WebNotify(player, $"资金不够,您的车被安排返航！！！");
                                                                            printState(player, car, "在路上走的车，想找宝石，钱不够啊，必须立即返回！");
                                                                            Console.WriteLine($"宝石的价格{this.promotePrice[sp.pType]}，钱不够啊,{car.ability.costBusiness},{car.ability.costVolume}！");
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
                }

                return "ok";
            }
        }

        /// <summary>
        /// 各种原因，使小车从基地里没有出发。小车上的钱必须从下车返回为玩家！
        /// </summary>
        /// <param name="player"></param>
        /// <param name="car"></param>
        private void giveMoneyFromCarToPlayer(Player player, Car car, ref List<string> notifyMsg)
        {
            //   var m1 = player.GetMoneyCanSave();
            player.MoneySet(player.Money + car.ability.leftBusiness + car.ability.leftVolume, ref notifyMsg);
            //player.Money += car.ability.leftBusiness;
            //player.Money += car.ability.leftVolume;

            if (car.ability.leftBusiness > 0)
                printState(player, car, $"返回基站，通过leftBusiness，是流动资金增加{car.ability.leftBusiness}");
            if (car.ability.leftVolume > 0)
                printState(player, car, $"返回基站，通过leftBusiness，是流动资金增加{car.ability.leftVolume}");
            //if (car.ability.subsidize > 0)
            //{
            //    /*
            //     * 从逻辑上，必须要保证car.ability.subsidize>0,player.SupportToPlay!=null
            //     */
            //    player.setSupportToPlayMoney(player.SupportToPlayMoney + car.ability.subsidize, ref notifyMsg);
            //    //player.SupportToPlayMoney += car.ability.subsidize;
            //    printState(player, car, $"返回基站，返还资助{car.ability.subsidize}");
            //}
            car.Refresh(player, ref notifyMsg);

            if (!string.IsNullOrEmpty(car.ability.diamondInCar))
            {
                player.PromoteDiamondCount[car.ability.diamondInCar]++;
            }
            car.ability.Refresh(player, car, ref notifyMsg);
            //  var m2 = player.GetMoneyCanSave();
            //  if (m1 != m2)
            {
                // MoneyCanSaveChanged(player, m2, ref notifyMsg);
            }
        }


        private void printState(Player player, Car car, string msg)
        {
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}{player.PlayerName}-car--{msg}");
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
                if (player.Money - needMoney < 0)
                {
                    throw new Exception("逻辑错误");
                }
                player.MoneySet(player.Money - needMoney, ref notifyMsg);
                car.ability.setCostBusiness(car.ability.costBusiness + needMoney, player, car, ref notifyMsg);

                return true;
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
            // var goPath = Program.dt.GetAFromB(from, to);
            var goPath = this.GetAFromB(from, to, player, ref notifyMsg);
            // var returnPath = Program.dt.GetAFromB(to, player.StartFPIndex);
            var returnPath = this.GetAFromB(to, player.StartFPIndex, player, ref notifyMsg);

            var goMile = GetMile(goPath);
            var returnMile = GetMile(returnPath);


            //第一步，计算去程和回程。
            if (car.ability.leftMile >= goMile + returnMile)
            {
                int startT;
                EditCarStateWhenPromoteStartOK(player, ref car, to, fp1, to, sp, goPath, ref notifyMsg, out startT);
                StartDiamondOwnerThread(startT, car, sp, returnPath, goMile);
                //  getAllCarInfomations(sp.Key, ref notifyMsg);
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

        private int GetPromotePositionTo(string pType)
        {
            switch (pType)
            {
                case "mile": { return this.promoteMilePosition; }; ;
                case "business": { return this.promoteBusinessPosition; };
                case "volume": { return this.promoteVolumePosition; };
                case "speed": { return this.promoteSpeedPosition; };
                default:
                    {
                        throw new Exception($"{pType}没有定义");
                    }
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

        private void setReturnWhenPromoteFailed(SetPromote sp, Car car)
        {
            // var carKey = $"{sp.car}_{sp.Key}";
            var returnPath = this._Players[sp.Key].returningRecord;//  this.returningRecord[carKey];
            Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
            {
                c = "returnning",
                key = sp.Key,
                //car = sp.car,
                returnPath = returnPath,//returnPath_Record,
                target = car.targetFpIndex,//这里的target 实际上是returnning 的起点,是汽车的上一个目标
                changeType = sp.pType,
            }));
            th.Start();
        }

        private void EditCarStateWhenPromoteStartOK(Player player, ref Car car, int to, Model.FastonPosition fp1, int to2, SetPromote sp, List<Model.MapGo.nyrqPosition> goPath, ref List<string> nofityMsgs, out int startT)
        {
            car.targetFpIndex = to;//A.更改小车目标，在其他地方引用。
                                   //  car.changeState++;//B.更改状态用去前台更新动画    

            /*
             * C.更新小车动画参数
             */
            var speed = car.ability.Speed;
            startT = 0;
            List<int> result;
            Data.PathStartPoint2 startPosition;
            if (car.state == CarState.waitOnRoad)
            {
                result = new List<int>();
                getStartPositionByGoPath(out startPosition, goPath);
                //startPosition = new Data.PathStartPoint()
                //{
                //    x = goPath.First().BDlongitude,
                //    y = goPath.First().BDlatitude
                //};
            }
            else if (car.state == CarState.waitAtBaseStation)
            {
                result = getStartPositon(fp1, player.positionInStation, ref startT);
                getStartPositionByFp(out startPosition, fp1);
            }
            else if (car.state == CarState.waitForCollectOrAttack)
            {
                result = new List<int>();
                getStartPositionByGoPath(out startPosition, goPath);
            }
            else if (car.state == CarState.waitForTaxOrAttack)
            {
                result = new List<int>();
                getStartPositionByGoPath(out startPosition, goPath);
            }
            else
            {
                Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(car)}");
                throw new Exception("错误的汽车类型！！！");
            }
            Program.dt.GetAFromBPoint(goPath, fp1, speed, ref result, ref startT);
            // result.RemoveAll(item => item.t == 0);

            var animateData = new AnimateData2()
            {
                start = startPosition,
                animateData = result,
                recordTime = DateTime.Now
            };
            car.setAnimateData(player, ref nofityMsgs, animateData);
            //car.animateData = new AnimateData()
            //{
            //    animateData = result,
            //    recordTime = DateTime.Now
            //};
            car.setState(player, ref nofityMsgs, CarState.buying);
            //  car.state = CarState.buying;//更改汽车状态

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

        private void StartDiamondOwnerThread(int startT, Car car, SetPromote sp, List<Model.MapGo.nyrqPosition> returnPath, int goMile)
        {
            Thread th = new Thread(() => setDiamondOwner(startT, new commandWithTime.diamondOwner()
            {
                c = "diamondOwner",
                key = sp.Key,
                returnPath = returnPath,
                target = car.targetFpIndex,//新的起点
                changeType = sp.pType,
                costMile = goMile
            }));
            th.Name = "DiamondOwner";
            th.Start();
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
                var car = this._Players[dor.key].getCar();
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
                            printState(player, car, $"支付前：costBusiness:{car.ability.costBusiness},costVolume:{car.ability.costVolume},needMoney:{needMoney}");

                            //var costBusiness1 = car.ability.costBusiness;
                            // bool needToUpdateCostBussiness;
                            car.ability.payForPromote(needMoney, player, car, ref notifyMsg);//用汽车上的钱支付
                            //if (needToUpdateCostBussiness)
                            //    AbilityChanged(player, car, ref notifyMsg, "business");

                            printState(player, car, $"支付后：costBusiness:{car.ability.costBusiness},costVolume:{car.ability.costVolume},needMoney:{needMoney}");

                            setPromtePosition(dor.changeType);
                            //this.promoteMilePosition = GetRandomPosition();
                            needUpdatePromoteState = true;
                            car.ability.setDiamondInCar(dor.changeType, player, car, ref notifyMsg);
                            // car.ability.diamondInCar = dor.changeType;
                            printState(player, car, "执行购买过程！需要立即执行返回！");
                            Thread th = new Thread(() => setReturn(0, new commandWithTime.returnning()
                            {
                                c = "returnning",
                                key = dor.key,
                                //car = dor.car,
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

                            car.ability.setCostMiles(car.ability.costMiles + dor.costMile, player, car, ref notifyMsg);
                            //   car.ability.costMiles += dor.costMile;


                            //   AbilityChanged(player, car, ref notifyMsg, "mile");

                            Console.WriteLine($"{player.PlayerName}的小车执行完购买宝石过程，由于没有抢到，停在路上,待命中...！");
                            carParkOnRoad(dor.target, ref car, player, ref notifyMsg);

                            if (this.debug)
                            {

                            }

                            if (car.purpose == Purpose.@null && car.state == CarState.buying)
                            {
                                car.setState(player, ref notifyMsg, CarState.waitOnRoad);
                                //car.state = CarState.waitOnRoad;

                                this._Players[dor.key].returningRecord = dor.returnPath;


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

        private void setPromtePosition(string changeType)
        {
            if (changeType == "mile")
                this.promoteMilePosition = GetRandomPosition(true);
            else if (changeType == "business")
                this.promoteBusinessPosition = GetRandomPosition(true);
            else if (changeType == "volume")
                this.promoteVolumePosition = GetRandomPosition(true);
            else if (changeType == "speed")
                this.promoteSpeedPosition = GetRandomPosition(true);
            else
            {
                throw new Exception($"{changeType}是什么类型？");
            }
            this.promotePrice[changeType] = GetPriceOfPromotePosition(changeType);
        }

        /// <summary>
        /// 更新所有玩家的功能提升点
        /// </summary>
        /// <param name="pType"></param>
        /// <returns></returns>
        private async Task CheckAllPlayersPromoteState(string pType)
        {
            var all = getGetAllPlayer();
            for (var i = 0; i < all.Count; i++)
            {
                await CheckPromoteState(all[i].Key, pType);
            }
        }
    }
}
