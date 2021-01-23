using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        bool debug = true;
        Dictionary<string, Player> _Players { get; set; }
        System.Random rm { get; set; }
        public RoomMain()
        {
            //这儿采用0，用于样例测试
            //如果用于生产环境，请用当前时间！
            this.rm = new System.Random(0);
            //  breakMiniSecods

            lock (PlayerLock)
            {
                this._Players = new Dictionary<string, Player>();
                this._FpOwner = new Dictionary<int, string>();
                //this._PlayerFp = new Dictionary<string, int>();
            }
            LookFor();
            this.recordOfPromote = new Dictionary<string, List<DateTime>>()
            {
                {  "mile" ,new List<DateTime>()},
                {  "business" ,new List<DateTime>() },
                {  "volume" ,new List<DateTime>() },
                {  "speed" ,new List<DateTime>() },
            };
            this.promotePrice = new Dictionary<string, long>()
            {
                {  "mile" ,10 * 100},
                {  "business" ,10 * 100 },
                {  "volume" ,10 * 100 },
                {  "speed" ,10 * 100},
            };
            // case "mile":
            //        {
            //    return 1;
            //}; break;
            //    case "business":
            //        {
            //    return 1;
            //}; break;
            //    case "volume":
            //        {
            //    return 1;
            //}; break;
            //    case "speed":
            //        {
            //    return 1;
            //}; break;
        }
        object PlayerLock = new object();
        /// <summary>
        /// 商店-玩家索引。key，代表所在位置的 商店index，value（string）代表player.key
        /// </summary>
        Dictionary<int, string> _FpOwner { get; set; }



        /// <summary>
        /// 获取收集金钱的状态
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        private async Task CheckCollectState(string key)
        {

            string url = "";
            string sendMsg = "";
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(key))
                    if (this._Players[key].Collect == this.collectPosition)
                    {
                    }
                    else
                    {
                        var infomation = BaseInfomation.rm.GetCollectInfomation(this._Players[key].WebSocketID);
                        url = this._Players[key].FromUrl;
                        sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                        this._Players[key].Collect = this.collectPosition;
                    }
            if (!string.IsNullOrEmpty(url))
            {
                await Startup.sendMsg(url, sendMsg);
            }
        }
        private async Task CheckAllPlayersCollectState()
        {
            var all = getGetAllPlayer();
            for (var i = 0; i < all.Count; i++)
            {
                await CheckCollectState(all[i].Key);
            }
        }

        private BradCastCollectInfoDetail GetCollectInfomation(int webSocketID)
        {
            var obj = new BradCastCollectInfoDetail
            {
                c = "BradCastCollectInfoDetail",
                WebSocketID = webSocketID,
                Fp = Program.dt.GetFpByIndex(this.collectPosition),
                collectMoney = this.CollectReWard
            };
            return obj;
        }

        private void AddOtherPlayer(string key, ref List<string> msgsWithUrl)
        {
            var players = getGetAllPlayer();
            for (var i = 0; i < players.Count; i++)
            {
                if (players[i].Key == key)
                {
                    /*
                     * 保证自己不会算作其他人
                     */
                }
                else
                {
                    {
                        /*
                         * 告诉自己，场景中有哪些人！
                         * 告诉场景中的其他人，场景中有我！
                         */
                        {
                            var self = this._Players[key];
                            var other = players[i];
                            addPlayerRecord(self, other, ref msgsWithUrl);

                        }
                        {
                            var self = players[i];
                            var other = this._Players[key];
                            addPlayerRecord(self, other, ref msgsWithUrl);
                        }
                    }
                }
            }
        }

        private void addPlayerRecord(Player self, Player other, ref List<string> msgsWithUrl)
        {
            if (self.Key == other.Key)
            {
                return;
            }
            if (self.others.ContainsKey(other.Key))
            {

            }
            else
            {
                self.others.Add(other.Key, new OtherPlayers());
                var fp = Program.dt.GetFpByIndex(other.StartFPIndex);
                // fromUrl = this._Players[getPosition.Key].FromUrl;
                var webSocketID = self.WebSocketID;
                var carsNames = other.CarsNames;

                //  var fp=  players[i].StartFPIndex
                CommonClass.GetOthersPositionNotify notify = new CommonClass.GetOthersPositionNotify()
                {
                    c = "GetOthersPositionNotify",
                    fp = fp,
                    WebSocketID = webSocketID,
                    carsNames = carsNames,
                    key = other.Key,
                    PlayerName = other.PlayerName,
                    fPIndex = other.StartFPIndex
                    // var xx=  getPosition.Key
                };
                msgsWithUrl.Add(self.FromUrl);
                msgsWithUrl.Add(Newtonsoft.Json.JsonConvert.SerializeObject(notify));
            }


        }




        private List<Player> getGetAllPlayer()
        {
            List<Player> players = new List<Player>();
            foreach (var item in this._Players)
            {
                players.Add(item.Value);
            }
            return players;
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
                        var infomation = BaseInfomation.rm.GetPromoteInfomation(this._Players[key].WebSocketID, promoteType);
                        url = this._Players[key].FromUrl;
                        sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                        this._Players[key].PromoteState[promoteType] = this.getPromoteState(promoteType);
                    }
            if (!string.IsNullOrEmpty(url))
            {
                await Startup.sendMsg(url, sendMsg);
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
                var returnPath_Record = this._Players[sc.Key].returningRecord[sc.car];
                // var returnPath_Record = this.returningRecord(carKey];
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
                car.changeState++;//更改状态   
                getAllCarInfomations(sc.Key, ref notifyMsg);
            }
            else if (car.state == CarState.waitAtBaseStation)
            {

            }
        }





        /// <summary>
        /// 删除对象时，这个要释放
        /// </summary>
        //List<Model.MapGo.nyrqPosition> returningRecord(string playerKey, string carKey)
        //{
        //    if (this._Players.ContainsKey(key))
        //    {
        //        return this._Players[key].returningRecord;
        //    }
        //    else
        //    {
        //        return new List<Model.MapGo.nyrqPosition>();
        //    }
        //}


        /// <summary>
        /// 当没有抢到宝石-或者收集、保护费，在路上待命。
        /// </summary>
        /// <param name="target"></param>
        /// <param name="car"></param>
        private void carParkOnRoad(int target, ref Car car, Player player)
        {
            var fp = Program.dt.GetFpByIndex(target);
            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out endX, out endY);
            car.animateData = new AnimateData()
            {
                animateData = new List<Data.PathResult>()
                        {
                              new Data.PathResult()
                              {
                                  t0=0,
                                  x0=endX,
                                  y0=endY,
                                  t1=200000,
                                  x1=endX,
                                  y1=endY
                              }
                        },
                recordTime = DateTime.Now
            };

            if (this.debug)
            {
                //var goPath = Program.dt.GetAFromB(car.targetFpIndex, this.collectPosition);
                //var returnPath = Program.dt.GetAFromB(this.collectPosition, player.StartFPIndex);

                //var goMile = GetMile(goPath);
                //var returnMile = GetMile(returnPath);
                //if (goMile + returnMile > car.ability.leftMile) 
                //{
                //    for (int i = 0; i < 3; i++) 
                //    {
                //        Console.WriteLine($"现在回收是要返回的！");
                //    }
                //}
            }
        }

        private int getCollectPositionTo()
        {
            return this.collectPosition;
        }

        private bool FpIsUsing(int fpIndex)
        {

            var A = this._FpOwner.ContainsKey(fpIndex)
                  || fpIndex == this._promoteMilePosition
                  || fpIndex == this._promoteBusinessPosition
                  || fpIndex == this._promoteVolumePosition
                  || fpIndex == this._promoteSpeedPosition
                  || fpIndex == this._collectPosition;
            ;

            foreach (var item in this._Players)
            {
                A = item.Value.StartFPIndex == fpIndex || A;
                for (var i = 0; i < 5; i++)
                    A = item.Value.getCar(i).targetFpIndex == fpIndex || A;
            }
            return A;
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



        /// <summary>
        /// 单位是km
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        private int GetMile(List<Model.MapGo.nyrqPosition> path)
        {
            double sumMiles = 0;
            for (var i = 1; i < path.Count; i++)
            {
                sumMiles += CommonClass.Geography.getLengthOfTwoPoint.GetDistance(path[i].BDlatitude, path[i].BDlongitude, path[i - 1].BDlatitude, path[i - 1].BDlongitude);
            }
            return Convert.ToInt32(sumMiles) / 1000;
        }


        private void getEndPositon(Model.FastonPosition fp, string car, ref List<Data.PathResult> animateResult, ref int startTInput)
        {
            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.Longitude, fp.Latitde, out endX, out endY);
            int startT0, startT1;

            double startX, startY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out startX, out startY);
            int endT0, endT1;

            //这里要考虑前台坐标系（左手坐标系）。
            var cc = new Complex(startX - endX, (-startY) - (-endY));

            cc = ToOne(cc);

            var positon1 = cc * (new Complex(-0.309016994, 0.951056516));
            var positon2 = positon1 * (new Complex(0.809016994, 0.587785252));
            var positon3 = positon2 * (new Complex(0.809016994, 0.587785252));
            var positon4 = positon3 * (new Complex(0.809016994, 0.587785252));
            var positon5 = positon4 * (new Complex(0.809016994, 0.587785252));
            Complex position;
            switch (car)
            {
                case "carA":
                    {
                        position = positon1;
                    }; break;
                case "carB":
                    {
                        position = positon2;
                    }; break;
                case "carC":
                    {
                        position = positon3;
                    }; break;
                case "carD":
                    {
                        position = positon4;
                    }; break;
                case "carE":
                    {
                        position = positon5;
                    }; break;
                default:
                    {
                        position = positon1;
                    }; break;
            }
            var percentOfPosition = 0.25;
            double carPositionX = endX + position.Real * percentOfPosition;
            double carPositionY = endY - position.Imaginary * percentOfPosition;


            /*
             * 这里由于是返程，为了与getStartPositon 中的命名保持一致性，（位置上）end实际为start,时间上还保持一致
             */
            //  List<Data.PathResult> animateResult = new List<Data.PathResult>();

            /*
             * 上道路的速度为10m/s 即36km/h
             */
            var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(fp.Latitde, fp.Longitude, fp.positionLatitudeOnRoad, fp.positionLongitudeOnRoad) / 10 * 1000);
            startT1 = startTInput;
            endT1 = startT1 + interview;
            startTInput += interview;
            var animate2 = new Data.PathResult()
            {
                t0 = startT1,
                x0 = startX,
                y0 = startY,
                t1 = endT1,
                x1 = endX,
                y1 = endY
            };
            animateResult.Add(animate2);


            startT0 = startTInput;
            endT0 = startT0 + 500;
            startTInput += 500;
            var animate1 = new Data.PathResult()
            {
                t0 = startT0,
                x0 = endX,
                y0 = endY,
                t1 = endT0,
                x1 = carPositionX,
                y1 = carPositionY
            };
            animateResult.Add(animate1);

        }
        private Complex ToOne(Complex cc)
        {
            var m = Math.Sqrt(cc.Real * cc.Real + cc.Imaginary * cc.Imaginary);
            return new Complex(cc.Real / m, cc.Imaginary / m);
        }

        private int getCarIndex(string car)
        {
            int result = 0;
            switch (car)
            {
                case "carA":
                    {
                        return 0;
                    };
                case "carB":
                    {
                        return 1;
                    };
                case "carC":
                    {
                        return 2;
                    };
                case "carD":
                    {
                        return 3;
                    };
                case "carE":
                    {
                        return 4;
                    };
            }
            return result;
        }


        public class GetPositionResult
        {
            public bool Success { get; set; }
            public string FromUrl { get; set; }
            public int WebSocketID { get; set; }
            public Model.FastonPosition Fp { get; set; }
            public string[] CarsNames { get; set; }
            public List<string> NotifyMsgs { get; set; }
            public string PlayerName { get; set; }
        }
        /// <summary>
        /// 用于自己位置的初始化，实际上这个才是真正的初始化！在AddNewPlayer或者update以前，需要将self的others初始化
        /// </summary>
        /// <param name="getPosition">传入参数</param>
        /// <param name="fromUrl">返回的url</param>
        /// <param name="webSocketID">websocketID</param>
        /// <param name="fp">地点</param>
        /// <param name="carsNames"></param>
        /// <returns></returns>
        internal async Task<GetPositionResult> GetPosition(GetPosition getPosition)
        {
            GetPositionResult result;

            int OpenMore = -1;//第一次打开？
            var notifyMsgs = new List<string>();
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(getPosition.Key))
                {
                    var fp = Program.dt.GetFpByIndex(this._Players[getPosition.Key].StartFPIndex);
                    var fromUrl = this._Players[getPosition.Key].FromUrl;
                    var webSocketID = this._Players[getPosition.Key].WebSocketID;
                    var carsNames = this._Players[getPosition.Key].CarsNames;
                    var playerName = this._Players[getPosition.Key].PlayerName;
                    /*
                     * 这已经走查过，在AddNewPlayer、UpdatePlayer时，others都进行了初始化
                     */
                    AddOtherPlayer(getPosition.Key, ref notifyMsgs);
                    getAllCarInfomations(getPosition.Key, ref notifyMsgs);
                    OpenMore = this._Players[getPosition.Key].OpenMore;

                    result = new GetPositionResult()
                    {
                        Success = true,
                        CarsNames = carsNames,
                        Fp = fp,
                        FromUrl = fromUrl,
                        NotifyMsgs = notifyMsgs,
                        WebSocketID = webSocketID,
                        PlayerName = playerName
                    };
                }
                else
                {
                    result = new GetPositionResult()
                    {
                        Success = false
                    };
                }
            }

            if (OpenMore == 0)
            {
                await CheckAllPromoteState(getPosition.Key);
                await CheckCollectState(getPosition.Key);
            }
            else if (OpenMore > 0)
            {
                await CheckAllPromoteState(getPosition.Key);
                await CheckCollectState(getPosition.Key);
                await SendAllTax(getPosition.Key);
            }
            return result;
        }

        /// <summary>
        /// 广播小车状态
        /// </summary>
        /// <param name="key"></param>
        /// <param name="msgsWithUrl"></param>
        private void getAllCarInfomations(string key, ref List<string> msgsWithUrl)
        {
            var players = getGetAllPlayer();
            for (var i = 0; i < players.Count; i++)
            {
                if (players[i].Key == key)
                {

                }
                else
                {
                    {
                        /*
                         * 告诉自己，场景中有哪些别人的车！
                         * 告诉别人，场景中有哪些车是我的的！
                         */
                        {
                            var self = this._Players[key];
                            var other = players[i];
                            addPlayerCarRecord(self, other, ref msgsWithUrl);

                        }
                        {
                            var self = players[i];
                            var other = this._Players[key];
                            addPlayerCarRecord(self, other, ref msgsWithUrl);
                        }

                    }
                }
            }
            {
                var self = this._Players[key];
                addSelfCarRecord(self, ref msgsWithUrl);
            }
        }

        private void addSelfCarRecord(Player self, ref List<string> msgsWithUrl)
        {
            for (var indexOfCar = 0; indexOfCar < 5; indexOfCar++)
                if (self.getCar(indexOfCar).animateData == null)
                {

                }
                else
                {
                    var result = new
                    {
                        deltaT = Convert.ToInt32((DateTime.Now - self.getCar(indexOfCar).animateData.recordTime).TotalMilliseconds),
                        animateData = self.getCar(indexOfCar).animateData.animateData
                    };
                    var obj = new BradCastAnimateOfSelfCar
                    {
                        c = "BradCastAnimateOfSelfCar",
                        Animate = result,
                        WebSocketID = self.WebSocketID,
                        carID = getCarName(indexOfCar) + "_" + self.Key,
                        parentID = self.Key,
                        CostMile = self.getCar(indexOfCar).ability.costMiles,

                    };
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    msgsWithUrl.Add(self.FromUrl);
                    msgsWithUrl.Add(json);
                }
        }

        private void addPlayerCarRecord(Player self, Player other, ref List<string> msgsWithUrl)
        {
            //这是发送给self的消息
            //throw new NotImplementedException();
            if (self.others.ContainsKey(other.Key))
            {
                for (var indexOfCar = 0; indexOfCar < 5; indexOfCar++)
                {
                    if (self.others[other.Key].getCarState(indexOfCar) == other.getCar(indexOfCar).changeState)
                    {

                    }
                    else
                    {
                        if (other.getCar(indexOfCar).animateData == null)
                        {

                        }
                        else
                        {
                            var result = new
                            {
                                deltaT = Convert.ToInt32((DateTime.Now - other.getCar(indexOfCar).animateData.recordTime).TotalMilliseconds),
                                animateData = other.getCar(indexOfCar).animateData.animateData
                            };
                            var obj = new BradCastAnimateOfOthersCar
                            {
                                c = "BradCastAnimateOfOthersCar",
                                Animate = result,
                                WebSocketID = self.WebSocketID,
                                carID = getCarName(indexOfCar) + "_" + other.Key,
                                parentID = other.Key,
                            };
                            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                            msgsWithUrl.Add(self.FromUrl);
                            msgsWithUrl.Add(json);
                        }
                        self.others[other.Key].setCarState(indexOfCar, other.getCar(indexOfCar).changeState);
                    }
                }
            }
        }

        private string getCarName(int index)
        {
            switch (index)
            {
                case 0:
                    {
                        return "carA";
                    };
                case 1: { return "carB"; };
                case 2: { return "carC"; };
                case 3: { return "carD"; };
                case 4: { return "carE"; };
            }
            throw new Exception("错误的序数");
        }


        int GetRandomPosition()
        {
            int index;
            do
            {
                index = rm.Next(0, Program.dt.GetFpCount());
            }
            while (this.FpIsUsing(index));
            return index;
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
        void LookFor()
        {
            lock (this.PlayerLock)
            {
                this.promoteMilePosition = GetRandomPosition();
                this.promoteBusinessPosition = GetRandomPosition();
                this.promoteVolumePosition = GetRandomPosition();
                this.promoteSpeedPosition = GetRandomPosition();


                this.collectPosition = GetRandomPosition();

                //BaseInfomation.rm._Players[checkItem.Key]
            }
            return;
        }



        class commandWithTime
        {
            abstract public class baseC
            {
                public string c { get; set; }
                public string key { get; set; }
                public string car { get; set; }
            }
            public class returnning : baseC
            {


                internal List<Model.MapGo.nyrqPosition> returnPath { get; set; }
                /// <summary>
                /// 返回路程的起点
                /// </summary>
                internal int target { get; set; }

                /// <summary>
                /// 取值如mile
                /// </summary>
                public string changeType { get; internal set; }
            }

            public class diamondOwner : returnning
            {
                public int costMile { get; internal set; }
            }

            public class debtOwner : returnning
            {
                //  public int costMile { get; internal set; }
                public string victim { get; internal set; }
            }


            public class placeArriving : baseC
            {
                public int costMile { get; set; }
                internal int target { get; set; }

                internal List<Model.MapGo.nyrqPosition> returnPath { get; set; }
                //internal int target { get; set; }

                ///// <summary>
                ///// 取值如mile
                ///// </summary>
                //public string changeType { get; internal set; }
            }

            public class comeBack : baseC
            {

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

        List<TaskForPromote> taskForPromotes = new List<TaskForPromote>();
        void addTask()
        {
            //this.th.In
        }

        //Dictionary<string, int> TaskOcupyIndex = new Dictionary<string, int>();

        int _promoteMilePosition = -1;
        //   DateTime _TimeRecordMilePosition { get; set; }
        int _promoteBusinessPosition = -1;
        int _promoteVolumePosition = -1;
        int _promoteSpeedPosition = -1;
        int _collectPosition = -1;
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
        /// <summary>
        /// 挣钱的地点index
        /// </summary>
        int collectPosition
        {
            get { return this._collectPosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._collectPosition = value;
                    if (_CollectReWard == 10)
                    {
                        if (this.rm.NextDouble() < 0.5)
                        {
                            _CollectReWard = 5;
                        }
                        else
                        {
                            _CollectReWard = 20;
                        }
                    }
                    else if (_CollectReWard == 20)
                    {
                        if (this.rm.NextDouble() < 0.5)
                        {
                            _CollectReWard = 10;
                        }
                        else
                        {
                            _CollectReWard = 50;
                        }
                    }
                    else if (_CollectReWard == 50)
                    {
                        if (this.rm.NextDouble() < 0.5)
                        {
                            _CollectReWard = 20;
                        }
                        else
                        {
                            _CollectReWard = 100;
                        }
                    }
                    else
                    {
                        _CollectReWard = 10;
                    }
                }
            }
        }
        /// <summary>
        /// 单位是元，外部传输数据时，请使用CollectMoney
        /// </summary>
        int _CollectReWard = 10;
        /// <summary>
        /// 此处的单位是分。
        /// </summary>
        int CollectReWard
        {
            get { return this._CollectReWard * 100; }
        }
        class TaskPromote
        {

        }
        class TaskForPromote
        {
            public DateTime StartTime { get; set; }
            public object OperateObj { get; set; }

        }

    }
}
