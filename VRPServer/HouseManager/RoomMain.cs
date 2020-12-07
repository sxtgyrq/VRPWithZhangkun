﻿using CommonClass;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public class RoomMain
    {
        Dictionary<string, Player> _Players { get; set; }
        System.Random rm { get; set; }
        public RoomMain()
        {
            this.rm = new System.Random(DateTime.Now.GetHashCode());
            //  breakMiniSecods
            this.th = new Thread(() => LookFor());
            this.th.Name = "eventThread";
            th.Start();
            lock (PlayerLock)
            {
                this._Players = new Dictionary<string, Player>();
                this._FpOwner = new Dictionary<int, string>();
                //this._PlayerFp = new Dictionary<string, int>();
            }
        }
        object PlayerLock = new object();
        Dictionary<int, string> _FpOwner { get; set; }
        Dictionary<string, int> _PlayerFp { get; set; }

        internal async Task<string> AddPlayer(PlayerAdd addItem)
        {
            bool success;
            lock (this.PlayerLock)
            {
                addItem.Key = addItem.Key.Trim();
                if (this._Players.ContainsKey(addItem.Key))
                {
                    success = false;
                    return "ng";
                }
                else
                {
                    success = true;
                    // BaseInfomation.rm.AddPlayer
                    this._Players.Add(addItem.Key, new Player()
                    {
                        Key = addItem.Key,
                        FromUrl = addItem.FromUrl,
                        WebSocketID = addItem.WebSocketID,
                        PlayerName = addItem.PlayerName,

                        CreateTime = DateTime.Now,
                        ActiveTime = DateTime.Now,
                        StartFPIndex = -1,
                        others = new Dictionary<string, OtherPlayers>(),
                        PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"yewu",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        }
                    });
                    this._Players[addItem.Key].initializeCars(addItem.CarsNames);
                    //System.Random rm = new System.Random(DateTime.Now.GetHashCode());

                    int fpIndex = this.GetRandomPosition(); // this.rm.Next(0, Program.dt.GetFpCount());

                    this._FpOwner.Add(fpIndex, addItem.Key);
                    this._Players[addItem.Key].StartFPIndex = fpIndex;

                    //  await CheckPromoteState(addItem.Key, "mile");
                    //this._Players[addItem.Key].lichengState==
                    //this.sendPrometeState(addItem.FromUrl, addItem.WebSocketID);

                }
            }

            if (success)
            {
                await CheckPromoteState(addItem.Key, "mile");
                return "ok";
            }
            else
            {
                return "ng";
            }
            //  throw new NotImplementedException();
        }

        private async Task CheckPromoteState(string key, string promoteType)
        {
            string url = "";
            string sendMsg = "";
            lock (this.PlayerLock)
                if (this._Players.ContainsKey(key))
                    if (this._Players[key].PromoteState[promoteType] == this.PromoteState[promoteType])
                    {

                    }
                    else
                    {
                        var infomation = BaseInfomation.rm.GetPromoteInfomation(this._Players[key].WebSocketID, "mile");
                        url = this._Players[key].FromUrl;
                        sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                        //await Startup.sendMsg(this._Players[key].FromUrl, );
                        this._Players[key].PromoteState[promoteType] = this.PromoteState[promoteType];
                    }
            if (!string.IsNullOrEmpty(url))
            {
                await Startup.sendMsg(url, sendMsg);
            }

        }

        private bool FpIsUsing(int fpIndex)
        {
            return this._FpOwner.ContainsKey(fpIndex)
                  || fpIndex == this._promoteMilePosition
                  || fpIndex == this._promoteYewuPosition
                  || fpIndex == this._promoteVolumePosition
                  || fpIndex == this._promoteSpeedPosition;
        }

        internal async Task<string> UpdatePlayer(PlayerCheck checkItem)
        {
            bool success;
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(checkItem.Key))
                {
                    BaseInfomation.rm._Players[checkItem.Key].FromUrl = checkItem.FromUrl;
                    BaseInfomation.rm._Players[checkItem.Key].WebSocketID = checkItem.WebSocketID;
                    //this.sendPrometeState(checkItem.FromUrl, checkItem.WebSocketID);
                    success = true;
                    BaseInfomation.rm._Players[checkItem.Key].PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"yewu",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        };
                }
                else
                {
                    success = false;
                }
            }
            if (success)
            {
                await CheckPromoteState(checkItem.Key, "mile");
                return "ok";
            }
            else
            {
                return "ng";
            }
        }

        internal async Task<string> updatePromote(SetPromote sp)
        {
            //{"Key":"1faff8e98891e33f6defc9597354c08b","pType":"mile","car":"carE","c":"SetPromote"}
            //  Console.WriteLine($"{Newtonsoft.Json.JsonConvert.SerializeObject(sp)}");
            //return "";
            if (string.IsNullOrEmpty(sp.car))
            {
                return "";
            }
            else if (!(sp.car == "carA" || sp.car == "carB" || sp.car == "carC" || sp.car == "carD" || sp.car == "carE"))
            {
                return "";
            }
            else if (string.IsNullOrEmpty(sp.pType))
            {
                return "";
            }
            else if (!(sp.pType == "mile"))
            {
                return "";
            }
            else
            {
                var carIndex = getCarIndex(sp.car);
                //int from = -1, to = -1;
                //string Command = "";
                //List<string> keys = new List<string>();
                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sp.Key))
                    {
                        //if(sp.pType=="mi")
                        switch (sp.pType)
                        {
                            case "mile":
                                {
                                    var car = this._Players[sp.Key].getCar(carIndex);
                                    switch (car.state)
                                    {
                                        case CarState.waitAtBaseStation:
                                            {
                                                var from = this._Players[sp.Key].StartFPIndex;
                                                var to = this.promoteMilePosition;
                                                var speed = car.ability.Speed;
                                                //Command = "goToBuy";
                                                //goto doCommand;
                                                var fp1 = Program.dt.GetFpByIndex(from);
                                                var fp2 = Program.dt.GetFpByIndex(to);
                                                int startT = 0;
                                                var result = getStartPositon(fp1, sp.car, ref startT);

                                                Program.dt.GetAFromBPoint(fp1.FastenPositionID, fp2.FastenPositionID, speed, ref result, ref startT);
                                                // var json = Newtonsoft.Json.JsonConvert.SerializeObject(result);
                                                result.RemoveAll(item => item.t0 == item.t1);
                                                //   var json = Newtonsoft.Json.JsonConvert.SerializeObject(result);
                                                //Console.WriteLine(json);
                                                // goto doCommand;
                                                //BradCastAnimateOfCar
                                                //this._Players[sp.Key].

                                                car.changeState++;

                                                var obj = new BradCastAnimateOfCar
                                                {
                                                    c = "BradCastAnimateOfCar",
                                                    Animate = result,
                                                    WebSocketID = this._Players[sp.Key].WebSocketID,
                                                    carID = sp.car + "_" + sp.Key
                                                };
                                                var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                                                notifyMsg.Add(this._Players[sp.Key].FromUrl);
                                                notifyMsg.Add(json);
#warning 这里还没有遍历状态，获取转发状态！
                                            }; break;
                                    }
                                    //this._Players[sp.Key].PromoteState[sp.pType]
                                }; break;
                        }
                    }
                }

                for (var i = 0; i < notifyMsg.Count; i += 2)
                {
                    var url = notifyMsg[i];
                    var sendMsg = notifyMsg[i + 1];
                    await Startup.sendMsg(url, sendMsg);
                }
                return "";
            }
        }

        private List<Data.PathResult> getStartPositon(Model.FastonPosition fp, string car, ref int startTInput)
        {
            double startX, startY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.Longitude, fp.Latitde, out startX, out startY);
            int startT0, startT1;

            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out endX, out endY);
            int endT0, endT1;

            //这里要考虑前台坐标系（左手坐标系）。
            var cc = new Complex(endX - startX, (-endY) - (-startY));

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
            double carPositionX = startX + position.Real * percentOfPosition;
            double carPositionY = startY - position.Imaginary * percentOfPosition;

            List<Data.PathResult> animateResult = new List<Data.PathResult>();
            startT0 = startTInput;
            endT0 = startT0 + 500;
            startTInput += 500;
            var animate1 = new Data.PathResult()
            {
                t0 = startT0,
                x0 = carPositionX,
                y0 = carPositionY,
                t1 = endT0,
                x1 = startX,
                y1 = startY
            };
            animateResult.Add(animate1);
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
            return animateResult;
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

        internal bool GetPosition(GetPosition getPosition, out string fromUrl, out int webSocketID, out Model.FastonPosition fp, out string[] carsNames)
        {
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(getPosition.Key))
                {
                    fp = Program.dt.GetFpByIndex(this._Players[getPosition.Key].StartFPIndex);
                    fromUrl = this._Players[getPosition.Key].FromUrl;
                    webSocketID = this._Players[getPosition.Key].WebSocketID;
                    carsNames = this._Players[getPosition.Key].CarsNames;
                    return true;
                }
                else
                {
                    fp = null;
                    fromUrl = null;
                    webSocketID = -1;
                    carsNames = null;
                    return false;
                }
            }

        }

        int _breakMiniSecods;
        int breakMiniSecods
        {
            get { return this._breakMiniSecods; }
            set
            {
                lock (this.PlayerLock) this._breakMiniSecods = value;
            }
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

        Dictionary<string, int> PromoteState { get; set; }
        async void LookFor()
        {
            lock (this.PlayerLock)
            {
                this.promoteMilePosition = GetRandomPosition();
                this.promoteYewuPosition = GetRandomPosition();
                this.promoteVolumePosition = GetRandomPosition();
                this.promoteSpeedPosition = GetRandomPosition();


                this.PromoteState = new Dictionary<string, int>()
                {
                    {"mile",0 },{"yewu",0 },{"volume",0 },{"speed",0 }
                };

                //BaseInfomation.rm._Players[checkItem.Key]
            }

            while (true)
            {
                breakMiniSecods = int.MaxValue;
                //try 
                //Thread.Sleep(2);
                lock (this.PlayerLock)
                {
                    Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}-thread doFun");
                    //Thread.Sleep(2 * 1000);

                }
                while (breakMiniSecods-- > 0)
                {
                    Thread.Sleep(10);
                }


            }
        }

        //[Obsolete]
        //private async void sendPrometeState(string fromUrl, int webSocketID)
        //{
        //    throw new Exception("");
        //    //CommonClass.BradCastPromoteInfoNotify notify = new CommonClass.BradCastPromoteInfoNotify()
        //    //{
        //    //    c = "BradCastPromoteInfoNotify",
        //    //    WebSocketID = webSocketID,
        //    //    PromoteState = this.PromoteState[]
        //    //    // var xx=  getPosition.Key
        //    //};
        //    //var msg = Newtonsoft.Json.JsonConvert.SerializeObject(notify);
        //    //await Startup.sendMsg(fromUrl, msg);
        //}
        //public enum PromoteType
        //{
        //    mile, yewu, volume, speed
        //}
        decimal PriceOfPromotePosition(string resultType)
        {
            switch (resultType)
            {
                case "mile":
                    {
                        return 1;
                    }; break;
                case "yewu":
                    {
                        return 1;
                    }; break;
                case "volume":
                    {
                        return 1;
                    }; break;
                case "speed":
                    {
                        return 1;
                    }; break;
                default:
                    {
                        return 1;
                    }; break;
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
                            Price = this.PriceOfPromotePosition(resultType)
                        };
                        return obj;
                    }; break;
                case "yewu": { }; break;
                case "volume": { }; break;
                case "speed": { }; break;
                default: { }; break;
            }
            throw new Exception("");
            //var obj = new BradCastPromoteInfoDetail
            //{
            //    c = "BradCastPromoteInfoDetail",
            //    WebSocketID = webSocketID,
            //    lichengFp = Program.dt.GetFpByIndex(this.promoteLichengPosition),
            //    yewuFp = Program.dt.GetFpByIndex(this.promoteYewuPosition),
            //    volumeFp = Program.dt.GetFpByIndex(this.promoteVolumePosition),
            //    speedFp = Program.dt.GetFpByIndex(this.promoteSpeedPosition),
            //    PromoteState = this.PromoteState
            //};
            //return obj;
        }

        List<TaskForPromote> taskForPromotes = new List<TaskForPromote>();
        void addTask()
        {
            //this.th.In
        }
        Thread th { get; set; }

        //Dictionary<string, int> TaskOcupyIndex = new Dictionary<string, int>();

        int _promoteMilePosition = -1;
        DateTime _TimeRecordMilePosition { get; set; }
        int _promoteYewuPosition = -1;
        DateTime _TimeRecordYewuPosition { get; set; }
        int _promoteVolumePosition = -1;
        DateTime _TimeRecordVolumePosition { get; set; }
        int _promoteSpeedPosition = -1;
        DateTime _TimeRecordSpeedPosition { get; set; }
        int promoteMilePosition
        {
            get { return this._promoteMilePosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._TimeRecordMilePosition = DateTime.Now;
                    this._promoteMilePosition = value;
                }
            }
        }
        int promoteYewuPosition
        {
            get { return this._promoteYewuPosition; }
            set
            {
                lock (this.PlayerLock)
                {
                    this._TimeRecordYewuPosition = DateTime.Now;
                    this._promoteYewuPosition = value;
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
                    this._TimeRecordVolumePosition = DateTime.Now;
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
                    this._TimeRecordSpeedPosition = DateTime.Now;
                    this._promoteSpeedPosition = value;
                }
            }
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
