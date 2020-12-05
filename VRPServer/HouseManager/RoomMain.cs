using CommonClass;
using System;
using System.Collections.Generic;
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
                int from = -1, to = -1;
                string Command = "";
                //List<string> keys = new List<string>();
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
                                                from = this._Players[sp.Key].StartFPIndex;
                                                to = this._Players[sp.Key].PromoteState[sp.pType];
                                                Command = "goToBuy";
                                                goto doCommand;
                                            }; ;
                                    }
                                    //this._Players[sp.Key].PromoteState[sp.pType]
                                }; break;
                        }
                    }
                }
                doCommand:
                {
                    switch (Command)
                    {
                        case "goToBuy":
                            {
                                var fp1 = Program.dt.GetFpByIndex(from);
                                var fp2 = Program.dt.GetFpByIndex(to);
                                var json = Program.dt.GetAFromB(fp1.FastenPositionID, fp2.FastenPositionID);
                                Console.WriteLine(json);
                            }; break;
                    }
                }
                //for (var i = 0; i < keys.Count; i++)
                //{
                //    await this.CheckPromoteState(keys[i], sp.pType);
                //}
                return "ok";
            }
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
