using CommonClass;
using Renci.SshNet.Security;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public class Player
    {
        /// <summary>
        /// 玩家初始携带金额，单位分。
        /// </summary>
        const long intializedMoney = 50000;


        public string Key { get; internal set; }
        public string FromUrl { get; internal set; }
        public int WebSocketID { get; internal set; }
        public string PlayerName { get; internal set; }
        public string[] CarsNames
        {
            get
            {
                return new string[]
                {
                    this._Cars[0].name,
                    this._Cars[1].name,
                    this._Cars[2].name,
                    this._Cars[3].name,
                    this._Cars[4].name
                };
            }
        }
        public DateTime CreateTime { get; internal set; }



        public DateTime ActiveTime { get; internal set; }
        public int StartFPIndex { get; internal set; }

        public Car getCar(int carIndex)
        {
            return this._Cars[carIndex];
        }
        public Car getCar(string carName)
        {
            switch (carName)
            {
                case "carA":
                    {
                        return this._Cars[0];
                    }
                case "carB":
                    {
                        return this._Cars[1];
                    }
                case "carC":
                    {
                        return this._Cars[2];
                    }
                case "carD":
                    {
                        return this._Cars[3];
                    }
                case "carE":
                    {
                        return this._Cars[4];
                    }
            }
            throw new Exception($"{carName}的非法调用");
            // return this._Cars[carIndex];
        }



        List<Car> _Cars = new List<Car>();
        internal void initializeCars(string[] carsNames, RoomMain roomMain)
        {
            if (carsNames.Length != 5)
            {
                var msg = "应该有5个汽车";
                Console.WriteLine(msg);
                throw new Exception(msg);
            }
            this._Cars = new List<Car>(5);
            for (var i = 0; i < 5; i++)
            {
                var car = new Car()
                {
                    name = carsNames[i],
                    ability = new AbilityAndState(),
                    targetFpIndex = -1,
                    carIndex = i + 0
                };
                var notifyMsg = new List<string>();
                car.SendStateAndPurpose = RoomMain.SendStateOfCar;
                car.setState(this, ref notifyMsg, CarState.waitAtBaseStation);

                car.SendPurposeOfCar = RoomMain.SendPurposeOfCar;
                car.setPurpose(this, ref notifyMsg, Purpose.@null);

                car.SetAnimateChanged = roomMain.SetAnimateChanged;
                car.setAnimateData(this, ref notifyMsg, null);

                car.ability.MileChanged = RoomMain.AbilityChanged2_0;
                car.ability.BusinessChanged = RoomMain.AbilityChanged2_0;
                car.ability.VolumeChanged = RoomMain.AbilityChanged2_0;
                car.ability.SpeedChanged = RoomMain.AbilityChanged2_0;

                // car.ability.SubsidizeChanged = RoomMain.SubsidizeChanged;
                car.ability.DiamondInCarChanged = RoomMain.DiamondInCarChanged;

                this._Cars.Add(car);
            }
            this._Money = intializedMoney;
            // this.Money = intializedMoney;
            this.SupportToPlay = null;
        }

        internal void initializeOthers()
        {
            this.others = new Dictionary<string, OtherPlayers>();
        }

        public OtherPlayers getOthers(string key)
        {
            return this.others[key];
        }

        Dictionary<string, OtherPlayers> others = new Dictionary<string, OtherPlayers>();

        public bool othersContainsKey(string key)
        {
            return this.others.ContainsKey(key);
        }
        internal void othersAdd(string key, OtherPlayers otherPlayer)
        {
            this.others.Add(key, otherPlayer);
        }
        // public delegate void SysRemovePlayerByKey(string key, ref List<string> msgsWithUrl);
        // public SysRemovePlayerByKey SysRemovePlayerByKeyF;

        internal void othersRemove(string key, ref List<string> notifyMsg)
        {
            if (this.others.ContainsKey(key))
            {
                //  SysRemovePlayerByKeyF(key, ref notifyMsg);

                var url = this.FromUrl;

                OthersRemove or = new OthersRemove()
                {
                    c = "OthersRemove",
                    WebSocketID = this.WebSocketID,
                    othersKey = key
                };

                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(or);
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);

                this.others.Remove(key);
            }
        }



        /// <summary>
        /// 能力提升宝石的状态，用于前台刷新
        /// </summary>
        public Dictionary<string, int> PromoteState { get; set; }
        public int Collect { get; internal set; }

        internal void TaxInPositionInit()
        {
            this.TaxInPosition = new Dictionary<int, long>();
        }

        public delegate void MoneyChangedF(Player player, long money, ref List<string> msgsWithUrl);
        public MoneyChangedF MoneyChanged;
        long _Money = 0;

        internal void InitializeDebt()
        {
            this.Debts = new Dictionary<string, long>();
            //throw new NotImplementedException();
        }



        /// <summary>
        /// 单位是分
        /// </summary>
        public long Money
        {
            get
            {
                return this._Money;
            }
            //set
            //{
            //    if (value < 0)
            //    {
            //        throw new Exception("金钱怎么能负，为何不做判断？");
            //    }
            //    this._Money = value;
            //}
        }

        public delegate void TheLargestHolderKeyChangedF(string keyFrom, string keyTo, string roleKey, ref List<string> notifyMsg);



        public TheLargestHolderKeyChangedF TheLargestHolderKeyChanged;



        /// <summary>
        /// 最大股东,收三个因素印象，钱，债，比值（责任）
        /// </summary>
        public string TheLargestHolderKey { get; private set; }



        internal void InitializeTheLargestHolder()
        {
            this.TheLargestHolderKey = this.Key;
        }

        public void MoneySet(long value, ref List<string> notifyMsg)
        {
            if (value < 0)
            {
                throw new Exception("金钱怎么能负，为何不做判断？");
            }
            this._Money = value;
            MoneyChanged(this, this.Money, ref notifyMsg);
            this.SetMoneyCanSave(this, ref notifyMsg);

            GetTheLargestHolderKey(ref notifyMsg);
        }

        private void GetTheLargestHolderKey(ref List<string> notifyMsg)
        {
            var valueToCal = this.Key;
            long moneyToCalculate = this.Money;
            foreach (var item in this.Debts)
            {
                if (this.Magnify(item.Value) > moneyToCalculate)
                {
                    valueToCal = item.Key;
                    moneyToCalculate = item.Value;
                }
            }

            if (valueToCal != this.TheLargestHolderKey)
            {
                if (TheLargestHolderKeyChanged != null)
                    TheLargestHolderKeyChanged(this.TheLargestHolderKey, valueToCal, this.Key, ref notifyMsg);
                this.TheLargestHolderKey = valueToCal;
                Console.WriteLine($"最大股权人发生了变化{this.TheLargestHolderKey}->{valueToCal}");
            }
            // throw new NotImplementedException();
        }

        /// <summary>
        /// 可用于攻击的金钱。
        /// </summary>
        public long MoneyToAttack
        {
            get
            {
                return this.LastMoneyCanUseForAttack;
            }
        }

        internal bool TaxContainsKey(int target)
        {
            return this.TaxInPosition.ContainsKey(target);
        }

        /// <summary>
        /// 玩家，总债务！
        /// </summary>
        public long sumDebets
        {
            get
            {
                long debets = 0;
                foreach (var item in this.Debts)
                {
                    debets += item.Value;
                }

                return debets;
            }
        }
        /// <summary>
        /// 可用于购买能力宝石的钱，总钱-总债-系统扶持+外部扶持为可用户购买宝石的钱！
        /// </summary>
        public long MoneyToPromote
        {
            get
            {
                //总钱+外部扶持为可用户购买宝石的钱！
                return this.Money;// + (this.SupportToPlay == null ? 0 : this.SupportToPlay.Money);
            }
        }

        /// <summary>
        /// 表征玩家玩耍是不是有外部支持！
        /// </summary>
        Support SupportToPlay { get; set; }
        public class Support
        {
            //long _Money = 0;
            ///// <summary>
            ///// 单位是分
            ///// </summary>
            //public long Money
            //{
            //    get
            //    {
            //        return this._Money;
            //    }
            //    set
            //    {
            //        if (value < 0)
            //        {
            //            throw new Exception("金钱怎么能负，为何不做判断？");
            //        }
            //        this._Money = value;
            //    }
            //}
        }

        //public delegate void SupportChanged(Player player, Support money, ref List<string> msgsWithUrl);
        //public SupportChanged SupportChangedF;
        //public long SupportToPlayMoney
        //{
        //    get
        //    {
        //        if (this.SupportToPlay == null)
        //        {
        //            return 0;
        //        }
        //        return SupportToPlay.Money;
        //    }
        //}
        //internal void setSupportToPlayMoney(long newValue, ref List<string> notifyMsg)
        //{

        //    if (this.SupportToPlay == null)
        //    {
        //        this.SupportToPlay = new Support()
        //        {
        //            Money = 0
        //        };
        //    }
        //    if (this.SupportToPlay.Money != newValue)
        //    {
        //        this.SupportToPlay.Money = newValue;
        //        this.SupportChangedF(this, this.SupportToPlay, ref notifyMsg);
        //    }


        //}
        //internal void RunSupportChangedF(ref List<string> notifyMsgs)
        //{
        //    this.SupportChangedF(this, this.SupportToPlay, ref notifyMsgs);
        //    //throw new NotImplementedException();
        //}
        ///// <summary>
        ///// 专款专用，扶持的资金，进扶持的账户，赚的钱，进赚着的账户
        ///// </summary>
        ///// <param name="needMoney">总共需要的钱</param>
        ///// <param name="moneyFromSupport">用于扶持的钱</param>
        ///// <param name="moneyFromEarn">从自己腰包里掏出的钱</param>
        //internal void PayWithSupport(long needMoney, out long moneyFromSupport, out long moneyFromEarn, ref List<string> notifyMsg)
        //{


        //    if (this.SupportToPlay != null)
        //    {
        //        moneyFromSupport = Math.Min(needMoney, this.SupportToPlay.Money);
        //    }
        //    else
        //    {
        //        moneyFromSupport = 0;
        //    }
        //    //  Console.WriteLine($"{needMoney}{moneyFromSupport}{}");
        //    moneyFromEarn = needMoney - moneyFromSupport;
        //    if (this.SupportToPlay != null)
        //        this.SupportToPlay.Money -= moneyFromSupport;
        //    if (moneyFromEarn > 0)
        //    {
        //        this.MoneySet(this.Money - moneyFromEarn, ref notifyMsg);
        //    }
        //    //this.Money -= moneyFromEarn;
        //}
        /// <summary>
        /// 玩家欠其他玩家的债！
        /// </summary>
        private Dictionary<string, long> Debts { get; set; }

        internal Dictionary<string, long> DebtsCopy
        {
            get
            {
                var result = new Dictionary<string, long>();
                foreach (var item in this.Debts)
                {
                    result.Add(item.Key + "", item.Value + 0);
                }
                return result;
            }
        }

        /// <summary>
        /// 用于计算破产相关参数
        /// </summary>
        long brokenParameterT2
        {
            get { return 100; }
        }
        long brokenParameterT1Value = 100;
        /// <summary>
        /// 用于计算破产相关参数
        /// </summary>
        public long brokenParameterT1
        {
            get
            {
                return brokenParameterT1Value;
            }
            private set
            {
                brokenParameterT1Value = value;
            }
        }

        internal void setBrokenParameterT1(long v, ref List<string> notifyMsg)
        {
            var m1 = this.MoneyForSave;
            this.brokenParameterT1 = v;
            var m2 = this.MoneyForSave;
            GetTheLargestHolderKey(ref notifyMsg);
            if (m1 != m2)
                this.SetMoneyCanSave(this, ref notifyMsg);
        }
        ///// <summary>
        ///// 返回使玩家破产需要的资金！
        ///// </summary>
        ///// <param name="victim">玩家</param>
        ///// <returns>返回使玩家破产需要的资金！</returns>
        //public long LastDebt
        //{
        //    /*
        //     * a asset资产
        //     * d debt债务
        //     * a+x=(d+x)*t
        //     * t=t1/t2
        //     * t1=120
        //     * t2-100
        //     */
        //    get
        //    {
        //        long debt = 0;
        //        foreach (var item in this.Debts)
        //        {
        //            debt += item.Value;
        //        }
        //        long asset = this.Money;
        //        //const long t2 = 100;
        //        //const long t1 = 120;
        //        return Math.Max(1, (asset * brokenParameterT2 - debt * brokenParameterT1) / (brokenParameterT1 - brokenParameterT2));
        //    }

        //}

        long LastMoneyCanUseForAttack
        {
            get
            {
                return this.Money;
                //if (this.Money > 0)
                //{
                //    return Math.Max(1, this.Money - this.sumDebets * brokenParameterT1 / brokenParameterT2);
                //}
                //else if (this.Money == 0)
                //    return this.Money;//;Math.Max(0, this.Money - this.sumDebets * brokenParameterT1 / brokenParameterT2);
                //else
                //{
                //    throw new Exception("");
                //}
            }

            //get { return  }
        }

        /// <summary>
        /// 表征玩家已破产。已破产后，系统接管玩家进行还债。玩家的操作权被收回。
        /// </summary>
        public bool Bust
        {
            get; private set;
        }
        public delegate void BustChanged(Player player, bool bustValue, ref List<string> msgsWithUrl);
        public BustChanged BustChangedF;
        internal void SetBust(bool v, ref List<string> notifyMsg)
        {
            this.Bust = v;
            BustChangedF(this, this.Bust, ref notifyMsg);
        }

        internal bool DebtsContainsKey(string key)
        {
            return this.Debts.ContainsKey(key);
            //  throw new NotImplementedException();
        }
        internal void AddDebts(string key, long attack, ref List<string> notifyMsg)
        {
            if (key == this.Key)
            {
                throw new Exception("自己给自己增加债务？");
            }
            if (this.Debts.ContainsKey(key))
            {
                this.Debts[key] += attack;
            }
            else
            {
                this.Debts.Add(key, attack);
            }
           ;
            this.MoneySet(this.Money + attack, ref notifyMsg);
            SetMoneyCanSave(this, ref notifyMsg);

            this.GetTheLargestHolderKey(ref notifyMsg);
            // SetMoneyCanSave(ref notifyMsg);
        }

        /// <summary>
        /// 表征玩家在某一地点能,key是地点，long是金钱（分）
        /// </summary>
        Dictionary<int, long> TaxInPosition { get; set; }
        public long GetTaxByPositionIndex(int position)
        {
            if (this.TaxInPosition.ContainsKey(position))
                return this.TaxInPosition[position];
            else return 0;
        }

        public void SetTaxByPositionIndex(int taxPostion, long taxValue, ref List<string> notifyMsg)
        {
            if (this.TaxInPosition.ContainsKey(taxPostion))
            {
                this.TaxInPosition[taxPostion] = taxValue;
            }
            else
            {
                this.TaxInPosition.Add(taxPostion, taxValue);
            }
            TaxChanged(this, taxPostion, this.TaxInPosition[taxPostion], ref notifyMsg);
            if (this.TaxInPosition[taxPostion] == 0)
            {
                this.TaxInPosition.Remove(taxPostion);
            }
            else if (this.TaxInPosition[taxPostion] < 0)
            {
                throw new Exception("错误！");
            }
        }
        public long getAllBonus()
        {
            long sum = 0;
            foreach (var item in this.TaxInPosition)
            {
                sum += item.Value;
            }
            return sum;
            //throw new NotImplementedException();
        }
        internal long getTaxByBonus()
        {
            long allBonus = this.getAllBonus();
            //var tax=this.
            throw new NotImplementedException();
        }
        public List<int> TaxInPositionForeach()
        {

            List<int> result = new List<int>();
            foreach (var item in this.TaxInPosition)
            {
                result.Add(item.Key);
            }
            return result;
        }

        DateTime _BustTime { get; set; }
        public DateTime BustTime
        {
            get
            {
                if (this.Bust)
                {
                    return this._BustTime;
                }
                else
                {
                    return DateTime.Now.AddDays(1);
                }
            }
            set
            {
                if (this.Bust)
                {
                    this._BustTime = DateTime.Now;
                }
                else
                {
                    this._BustTime = DateTime.Now.AddDays(1);
                }
            }
        }





        /// <summary>
        /// 记录待收税金！
        /// </summary>
        /// <param name="taxPostion">地点</param>
        /// <param name="taxValue">待收税金（分）</param>
        internal void AddTax(int taxPostion, long taxValue, ref List<string> notifyMsg)
        {
            if (this.TaxInPosition.ContainsKey(taxPostion))
            {
                this.TaxInPosition[taxPostion] += taxValue;
            }
            else
            {
                this.TaxInPosition.Add(taxPostion, taxValue);
            }
            if (taxValue > 0)
            {
                TaxChanged(this, taxPostion, this.TaxInPosition[taxPostion], ref notifyMsg);
            }
        }

        public long MoneyForSave
        {
            get
            {
                if (this.brokenParameterT1 < brokenParameterT2)
                    return Math.Max(0, this.Money - intializedMoney - this.sumDebets * 2);
                else
                    return Math.Max(0, this.Money - intializedMoney - this.sumDebets * brokenParameterT1 / brokenParameterT2 * 2);
            }
        }
        public delegate void SetMoneyCanSaveF(Player player, ref List<string> notifyMsg);
        public SetMoneyCanSaveF SetMoneyCanSave;
        //{
        //    var newValue = Math.Max(0, this.Money - intializedMoney - this.sumDebets * brokenParameterT1 / brokenParameterT2 * 2);
        //    if (newValue == MoneyForSave) { }
        //    else
        //    {
        //        MoneyForSave = newValue;
        //    }
        //    //   return Math.Max(0, this.Money - intializedMoney - this.sumDebets * brokenParameterT1 / brokenParameterT2 * 2);
        //}

        internal Dictionary<string, List<Model.MapGo.nyrqPosition>> returningRecord { get; set; }

        /// <summary>
        /// 用于表征，玩家是第一次打开还是第二次打开。
        /// </summary>
        public int OpenMore { get; set; }

        /// <summary>
        /// 当小车执行完宝石获取任务，回到基地后。用相应增加。
        /// </summary>
        public Dictionary<string, int> PromoteDiamondCount { get; set; }

        public delegate void TaxChangedF(Player player, int Position, long AddValue, ref List<string> msgsWithUrl);
        public TaxChangedF TaxChanged { get; internal set; }



        internal long DebtsGet(string key)
        {
            return this.Debts[key];
        }

        internal void SetDebts(string key, long v, ref List<string> notifyMsg)
        {
            this.Debts[key] = v;
            this.GetTheLargestHolderKey(ref notifyMsg);
        }

        internal void DebtsRemove(string key, ref List<string> notifyMsg)
        {
            var url = this.FromUrl;

            DebtsRemove dr = new DebtsRemove()
            {
                c = "DebtsRemove",
                WebSocketID = this.WebSocketID,
                othersKey = key
            };

            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(dr);
            notifyMsg.Add(url);
            notifyMsg.Add(sendMsg);
            this.Debts.Remove(key);
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
        internal long Magnify(long value)
        {
            return value * this.brokenParameterT1 / this.brokenParameterT2;
            //throw new NotImplementedException();
        }

        public delegate void DrawSingleRoad(Player player, string roadCode, ref List<string> notifyMsg);
        public DrawSingleRoad DrawSingleRoadF;
        Dictionary<string, bool> usedRoad = new Dictionary<string, bool>();
        internal void addUsedRoad(string roadCode, ref List<string> notifyMsgs)
        {
            if (this.usedRoad.ContainsKey(roadCode)) { }
            else
            {
                this.usedRoad.Add(roadCode, true);
                this.DrawSingleRoadF(this, roadCode, ref notifyMsgs);
            }
        }

        public List<string> usedRoadsList
        {
            get
            {
                var result = new List<string>();
                foreach (var item in this.usedRoad)
                {
                    result.Add(item.Key);
                }
                return result;
            }
        }
        //Dictionary<string, bool> usedFps = new Dictionary<string, bool>();
        //internal void addUsedFps(string fpCode, ref List<string> notifyMsgs)
        //{
        //    if (this.usedFps.ContainsKey(fpCode)) { }
        //    else
        //        this.usedFps.Add(fpCode, true);
        //}
    }
    public class OtherPlayers
    {
        public OtherPlayers()
        {
            this.carAChangeState = -1;
            this.carBChangeState = -1;
            this.carCChangeState = -1;
            this.carDChangeState = -1;
            this.carEChangeState = -1;
        }
        public int carAChangeState { get; private set; }
        public int carBChangeState { get; private set; }
        public int carCChangeState { get; private set; }
        public int carDChangeState { get; private set; }
        public int carEChangeState { get; private set; }

        internal int getCarState(int v)
        {
            switch (v)
            {
                case 0:
                    {
                        return this.carAChangeState;
                    };
                case 1:
                    {
                        return this.carBChangeState;
                    };
                case 2:
                    {
                        return this.carCChangeState;
                    };
                case 3:
                    {
                        return this.carDChangeState;
                    };
                case 4:
                    {
                        return this.carEChangeState;
                    };
                default:
                    {
                        throw new Exception("getCarState 非法调用");
                    };
            }
        }

        internal void setCarState(int v, int changeState)
        {
            switch (v)
            {
                case 0:
                    {
                        this.carAChangeState = changeState;
                        return;
                    };
                case 1:
                    {
                        this.carBChangeState = changeState;
                        return;
                    };
                case 2:
                    {
                        this.carCChangeState = changeState;
                        return;
                    };
                case 3:
                    {
                        this.carDChangeState = changeState;
                        return;
                    };
                case 4:
                    {
                        this.carEChangeState = changeState;
                        return;
                    };
                default:
                    {
                        throw new Exception("getCarState 非法调用");
                    };
            }
        }
    }


    /*
     * [A]:waitAtBaseStation→roadForTax,roadForCollect,roadForAttack→[B]|[C]|[D]|[E]|[F]
     * [B]:[A]→roadForTax→waitForTaxOrAttack→roadForTax→……→waitForTaxOrAttack→returning→waitAtBaseStation
     * [C]:[A]→roadForTax→waitForTaxOrAttack→roadForAttack→[F]
     * [D]:[A]→roadForCollect→waitForCollectOrAttack→roadForCollect→……→waitForCollectOrAttack→returning→waitAtBaseStation
     * [E]:[A]→roadForCollect→waitForCollectOrAttack→roadForAttack→[F]
     * [F]:roadForAttack→returning→waitAtBaseStation
     * [G]:waitAtBaseStation→buying→returning→waitAtBaseStation
     * [H]:waitForTaxOrAttack→buying→returning→waitAtBaseStation
     * [I]:waitForCollectOrAttack→buying→returning→waitAtBaseStation
     * 买完东西后不一定要回。在没有买到东西的情况下，原来收税，还可以继续收税。原来收集还可以继续收集。原来waitAtBaseStation，还可以进行选择。
     * 买到东西后，一定要回。
     * 收集，产生税收。
     */
    //
    //
    public enum CarState
    {
        /// <summary>
        /// 在基地里等待可以执行购买、收税、攻击
        /// </summary>
        waitAtBaseStation,
        waitOnRoad,
        roadForTax,
        waitForTaxOrAttack,
        roadForCollect,
        waitForCollectOrAttack,
        roadForAttack,
        /// <summary>
        /// returning状态，只能在setReturn -ReturnThenSetComeBack是定义。
        /// </summary>
        returning,
        buying
    }

    public enum Purpose
    {
        @null,
        collect,
        tax,
        attack
    }
    public class Car
    {
        public delegate void SendStateAndPurposeF(Player player, Car car, ref List<string> notifyMsg);

        public delegate void SendPurposeOfCarF(Player player, Car car, ref List<string> notifyMsg);

        public delegate void SetAnimateChangedF(Player player, Car car, ref List<string> notifyMsg);

        public string name { get; set; }
        public AbilityAndState ability { get; set; }

        CarState _state = CarState.waitAtBaseStation;

        public SendStateAndPurposeF SendStateAndPurpose;


        public CarState state
        {
            get
            {
                return this._state;
            }
        }
        public void setState(Player player, ref List<string> notifyMsg, CarState s)
        {
            this._state = s;
            SendStateAndPurpose(player, this, ref notifyMsg);

        }

        public Purpose purpose { get; private set; }


        /// <summary>
        /// 汽车的目标地点。
        /// </summary>
        public int targetFpIndex { get; set; }


        int _changeState = 0;
        public int changeState { get { return this._changeState; } }
        public SetAnimateChangedF SetAnimateChanged;
        public AnimateData animateData { get; private set; }
        internal void setAnimateData(Player player, ref List<string> notifyMsg, AnimateData data)
        {
            this.animateData = data;
            this._changeState++;
            SetAnimateChanged(player, this, ref notifyMsg);
            //  throw new NotImplementedException();
        }

        public int carIndex { get; internal set; }

        internal string IndexString
        {
            get
            {
                switch (this.carIndex)
                {
                    case 0:
                        {
                            return "carA";
                        }; ;
                    case 1:
                        {
                            return "carB";
                        };
                    case 2:
                        {
                            return "carC";
                        };
                    case 3:
                        {
                            return "carD";
                        };
                    case 4:
                        {
                            return "carE";
                        };
                    default:
                        {
                            throw new Exception("");
                        };
                }
            }
            //this._Cars.FindIndex(car);
            //throw new NotImplementedException();
        }
        internal void Refresh(Player player, ref List<string> notifyMsg)
        {
            this.setState(player, ref notifyMsg, CarState.waitAtBaseStation);
            //this.state = CarState.waitAtBaseStation;
            this.targetFpIndex = -1;
            this.setPurpose(player, ref notifyMsg, Purpose.@null);
            //this.purpose = Purpose.@null;
        }
        public SendPurposeOfCarF SendPurposeOfCar;
        internal void setPurpose(Player player, ref List<string> notifyMsg, Purpose p)
        {
            this.purpose = p;
            this.SendPurposeOfCar(player, this, ref notifyMsg);
            //throw new NotImplementedException();
        }


    }
    public class AbilityAndState
    {

        //long _subsidize = 0;
        /// <summary>
        /// 资助用于提升能力的钱。专款专用。如果没有用完，还是将这个资金返回player的 subsidize账户。这个资金不能用于攻击。
        /// 单位为分
        /// </summary>
        //public long subsidize
        //{
        //    get { return this._subsidize; }
        //    //private set
        //    //{
        //    //    if (value < 0)
        //    //    {
        //    //        throw new Exception("错误的输入");
        //    //    }
        //    //    this._subsidize = value;
        //    //}
        //}

        //public delegate void SubsidizeChangedF(Player player, Car car, ref List<string> notifyMsgs, long subsidize);
        //public SubsidizeChangedF SubsidizeChanged;
        //public void setSubsidize(long subsidizeInput, Player player, Car car, ref List<string> notifyMsg)
        //{
        //    this._subsidize = subsidizeInput;
        //    this.SubsidizeChanged(player, car, ref notifyMsg, this.subsidize);
        //    //this._costMiles = costMileInput;
        //    //MileChanged(player, car, ref notifyMsg, "mile");
        //}


        Dictionary<string, List<DateTime>> Data { get; set; }
        public void AbilityAdd(string pType, Player player, Car car, ref List<string> notifyMsg)
        {
            if (this.Data.ContainsKey(pType))
            {
                this.Data[pType].Add(DateTime.Now);
                switch (pType)
                {
                    case "mile":
                        {
                            this.MileChanged(player, car, ref notifyMsg, pType);
                        }; break;
                    case "business":
                        {
                            this.BusinessChanged(player, car, ref notifyMsg, pType);
                        }; break;
                    case "volume":
                        {
                            this.VolumeChanged(player, car, ref notifyMsg, pType);
                        }; break;
                    case "speed":
                        {
                            this.SpeedChanged(player, car, ref notifyMsg, pType);
                        }; break;
                }
            }
        }

        string _diamondInCar = "";

        public delegate void DiamondInCarChangedF(Player player, Car car, ref List<string> notifyMsgs, string value);

        public DiamondInCarChangedF DiamondInCarChanged;
        /// <summary>
        /// 车上有没有已经完成的能力提升任务！""代表无，如mile则代表有！
        /// </summary>
        public string diamondInCar { get { return this._diamondInCar; } }


        public void setDiamondInCar(string diamondInCarInput, Player player, Car car, ref List<string> notifyMsg)
        {
            this._diamondInCar = diamondInCarInput;
            this.DiamondInCarChanged(player, car, ref notifyMsg, this.diamondInCar);
        }

        DateTime CreateTime { get; set; }

        long _costMiles = 0;
        /// <summary>
        /// 已经花费的里程！
        /// </summary>
        public long costMiles
        {
            get { return _costMiles; }

        }

        long _costBusiness = 0;
        /// <summary>
        /// 在车上的通过初始携带、税收获得的钱。单位为分，1/100元
        /// </summary>
        public long costBusiness
        {
            get
            {
                return _costBusiness;
            }
            //private set

            //{
            //    if (value < 0)
            //    {
            //        throw new Exception("错误的输入");
            //    }
            //    this._costBusiness = value;
            //}
        }
        long _costVolume = 0;
        /// <summary>
        /// 在车上的通过收集获得的钱。单位为分，1/100元
        /// </summary>
        internal long costVolume
        {
            get
            {
                return _costVolume;
            }
            //private set

            //{
            //    if (value < 0)
            //    {
            //        throw new Exception("错误的输入");
            //    }
            //    this._costVolume = value;
            //}
        }
        public AbilityAndState()
        {
            this.CreateTime = DateTime.Now;
            this.Data = new Dictionary<string, List<DateTime>>()
            {
                {
                    "mile",new List<DateTime>()
                },
                {
                    "business",new List<DateTime>()
                },
                {
                    "volume",new List<DateTime>()
                },
                {
                    "speed",new List<DateTime>()
                }
            };
            this._costMiles = 0;//this.costMiles = 0;
            this._costVolume = 0;//this.costVolume = 0;
            this._costBusiness = 0;
            this._diamondInCar = "";
            // this._subsidize = 0; ;
            //this.costBusiness = 0;
            //this.diamondInCar = "";
            //this.subsidize = 0;
        }
        /// <summary>
        /// 刷新时，会更新宝石状况（diamondInCar=""）。
        /// </summary>
        public void Refresh(Player player, Car car, ref List<string> notifyMsg)
        {

            //this.Data["mile"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            //this.Data["business"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            //this.Data["volume"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            //this.Data["speed"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this._costMiles = 0;
            this._costBusiness = 0;
            this._costVolume = 0;
            MileChanged(player, car, ref notifyMsg, "mile");
            BusinessChanged(player, car, ref notifyMsg, "business");
            VolumeChanged(player, car, ref notifyMsg, "volume");
            SpeedChanged(player, car, ref notifyMsg, "speed");
            this.setCostMiles(0, player, car, ref notifyMsg);
            // this.costMiles = 0;
            this.setCostBusiness(0, player, car, ref notifyMsg);
            //this.set
            //this.costBusiness = 0;
            this.setCostVolume(0, player, car, ref notifyMsg);
            //this.costVolume = 0;
            this.setDiamondInCar("", player, car, ref notifyMsg);
            //  this.diamondInCar = "";
            //  this.setSubsidize(0, player, car, ref notifyMsg);
            //   this.subsidize = 0;
        }

        public delegate void AbilityChangedF(Player player, Car car, ref List<string> notifyMsgs, string pType);
        public AbilityChangedF MileChanged;
        public void setCostMiles(long costMileInput, Player player, Car car, ref List<string> notifyMsg)
        {
            this._costMiles = costMileInput;
            MileChanged(player, car, ref notifyMsg, "mile");
        }

        public AbilityChangedF BusinessChanged;
        public void setCostBusiness(long costBusinessCostInput, Player player, Car car, ref List<string> notifyMsg)
        {
            this._costBusiness = costBusinessCostInput;
            BusinessChanged(player, car, ref notifyMsg, "business");
        }

        public AbilityChangedF VolumeChanged;
        public void setCostVolume(long costVolumeCostInput, Player player, Car car, ref List<string> notifyMsg)
        {
            this._costVolume = costVolumeCostInput;
            VolumeChanged(player, car, ref notifyMsg, "volume");
        }

        public AbilityChangedF SpeedChanged;
        //internal delegate void AbilityChanged(Player player, Car car, ref List<string> notifyMsgs, string pType);
        /// <summary>
        /// 依次用辅助、business、volume来支付。
        /// </summary>
        /// <param name="needMoney"></param>
        internal void payForPromote(long needMoney, Player player, Car car, ref List<string> notifyMsgs)
        {
            //var pay1 = needMoney;// Math.Min(needMoney, this.subsidize);
            // this.subsidize -= pay1;

            //var subsidizeNew = this.subsidize - pay1;
            //if (subsidizeNew != this.subsidize)
            //{
            //    this.setSubsidize(subsidizeNew, player, car, ref notifyMsgs);
            //}

            //   needMoney -= pay1;

            var pay2 = Math.Min(needMoney, this.costBusiness);
            // this.costBusiness -= pay2;
            var costBusinessNew = this.costBusiness - pay2;
            if (costBusinessNew != this.costBusiness)
            {
                this.setCostBusiness(costBusinessNew, player, car, ref notifyMsgs);
            }
            needMoney -= pay2;
            if (pay2 > 0)
            {
                //needToUpdateCostBussiness = true;
            }
            /*
             * 在获得能力提升宝石过程中，不可能动costVolume上的钱。
             * 状态变成收集后，只能攻击或者继续收集
             */
            //var pay3 = Math.Min(needMoney, this.costVolume);
            //this.costVolume -= pay3;
            //needMoney -= pay3;

            if (needMoney != 0)
            {
                throw new Exception("");
            }
        }

        /// <summary>
        /// 小车能跑的最大距离，最小值为350km！确保地图中的最长路径有个来回！
        /// </summary>
        public long mile
        {
            get
            {
                return this.Data["mile"].Count * 10 + 350;
            }
        }
        public long leftMile
        {
            get
            {
                return this.mile - this.costMiles;
            }
        }
        /// <summary>
        /// 通过税收、携带，还能带多少钱。单位为分，即1/100元
        /// </summary>
        public long leftBusiness
        {
            get
            {
                return this.Business - this.costBusiness;
            }
        }
        /// <summary>
        /// 通过收集，还能收集多少钱。单位为分，即1/100元
        /// </summary>
        public long leftVolume
        {
            get
            {
                return this.Volume - this.costVolume;
            }
        }
        /// <summary>
        /// 小车能携带的金钱数量！单位为分，即1/100元。
        /// </summary>
        public long Business { get { return (this.Data["business"].Count * 10 + 200) * 100; } }
        /// <summary>
        /// 小车能装载的最大容量，默认为100鼋！单位为分，即1/100元。
        /// </summary>
        public long Volume { get { return (this.Data["volume"].Count * 10 + 500) * 100; } }
        /// <summary>
        /// 小车能跑的最快速度！
        /// </summary>
        public int Speed { get { return this.Data["speed"].Count * 2 + 50; } }

        /// <summary>
        /// 单位为分，是身上business（业务） subsidize（资助）的和。
        /// </summary>
        public long SumMoneyCanForPromote
        {
            get
            {
                return this.costBusiness;//+ this.subsidize;
            }
        }
        public long SumMoneyCanForAttack
        {
            get
            {
                return this.costVolume + this.costBusiness;
            }
        }

    }

    public class AnimateData
    {
        public List<Data.PathResult> animateData { get; internal set; }
        public DateTime recordTime { get; internal set; }
    }
}
