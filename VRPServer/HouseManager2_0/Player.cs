using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HouseManager2_0
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
        //public string[] CarsNames
        //{
        //    get
        //    {
        //        return new string[]
        //        {
        //            this._Cars[0].name,
        //            this._Cars[1].name,
        //            this._Cars[2].name,
        //            this._Cars[3].name,
        //            this._Cars[4].name
        //        };
        //    }
        //}
        public DateTime CreateTime { get; internal set; }



        public DateTime ActiveTime { get; internal set; }
        public int StartFPIndex { get; internal set; }

        public Car getCar()
        {
            return this._Car;
        }


        public int positionInStation = 0;

        Car _Car;
        internal void initializeCar(RoomMainF.RoomMain roomMain)
        {
            this._Car = new Car()
            {
                ability = new AbilityAndState(),
                targetFpIndex = -1,
            };
            var notifyMsg = new List<string>();
            this._Car.SendStateAndPurpose = RoomMainF.RoomMain.SendStateOfCar;
            this._Car.setState(this, ref notifyMsg, Car.CarState.waitAtBaseStation);
            this._Car.SendPurposeOfCar = RoomMainF.RoomMain.SendPurposeOfCar;

            this._Car.setState(this, ref notifyMsg, Car.CarState.waitAtBaseStation);

            // this._Car.SendPurposeOfCar = RoomMainF.RoomMain.SendPurposeOfCar;
            this._Car.setPurpose(this, ref notifyMsg, Car.Purpose.@null);

            this._Car.SetAnimateChanged = roomMain.SetAnimateChanged;
            this._Car.setAnimateData(this, ref notifyMsg, null);

            this._Car.ability.MileChanged = RoomMainF.RoomMain.AbilityChanged2_0;
            this._Car.ability.BusinessChanged = RoomMainF.RoomMain.AbilityChanged2_0;
            this._Car.ability.VolumeChanged = RoomMainF.RoomMain.AbilityChanged2_0;
            this._Car.ability.SpeedChanged = RoomMainF.RoomMain.AbilityChanged2_0;

            // car.ability.SubsidizeChanged = RoomMain.SubsidizeChanged;
            this._Car.ability.DiamondInCarChanged = RoomMainF.RoomMain.DiamondInCarChanged;


            this._Money = intializedMoney;
            // this.Money = intializedMoney;
            this.SupportToPlay = null;
        }

        internal void initializeOthers()
        {
            this.others = new Dictionary<string, OtherPlayers>();
        }

        public OtherPlayers GetOthers(string key)
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
        public Dictionary<int, int> CollectPosition { get; internal set; }

        // Dictionary<int, int> _collectPosition = new Dictionary<int, int>();
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
        long brokenParameterT1Value = 80;
        /// <summary>
        /// 用于计算破产相关参数
        /// </summary>
        public long brokenParameterT1
        {
            get
            {
                return brokenParameterT1Value;
            }
        }
        internal OtherPlayers.BrokenParameterT1RecordChanged brokenParameterT1RecordChanged;
        internal void setBrokenParameterT1(long v, ref List<string> notifyMsg)
        {
            var m1 = this.MoneyForSave;
            this.brokenParameterT1Value = v;
            brokenParameterT1RecordChanged(this.Key, this.Key, v, ref notifyMsg);
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

        internal List<Model.MapGo.nyrqPosition> returningRecord { get; set; }

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
        internal int DebtsPercent(string key)
        {
            if (this.Debts.ContainsKey(key))
            {
                long sum = 0;
                sum += this.Money;
                foreach (var item in this.Debts)
                {
                    sum += this.Magnify(item.Value);
                }
                var percent = Convert.ToInt32(this.Magnify(this.Debts[key]) * 1000 / sum);
                return percent;
            }
            else
            {
                return 0;
            }
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
        internal void clearUsedRoad()
        {
            this.usedRoad.Clear();
            var roadCode = Program.dt.GetFpByIndex(this.StartFPIndex).RoadCode;
            this.usedRoad.Add(roadCode, true);
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

        public const long ShareBaseValue = 10000;
        /// <summary>
        /// 获取所有债主的股份，这里包括自己的股份，获取的单位是万分之一
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public Dictionary<string, long> Shares
        {
            get
            {
                Player player = this;
                long sumShares = 0;
                var DebtsCopy = player.DebtsCopy;
                foreach (var item in DebtsCopy)
                {
                    sumShares += player.Magnify(item.Value);
                }
                sumShares += player.Money;

                Dictionary<string, long> result = new Dictionary<string, long>();
                foreach (var item in DebtsCopy)
                {
                    result.Add(item.Key, Math.Max(1, ShareBaseValue * player.Magnify(item.Value) / sumShares));
                }
                var selfValues = ShareBaseValue - result.Values.Sum();

                result.Add(player.Key, Math.Max(1, selfValues));
                return result;
            }
        }


    }

    public class OtherPlayers
    {
        string selfKey, otherKey;

        public OtherPlayers(string selfKeyInput, string otherKeyInput)
        {
            this.selfKey = selfKeyInput;
            this.otherKey = otherKeyInput;
            this.carChangeState = -1;
            this._brokenParameterT1Record = -1;
        }
        public int carChangeState { get; private set; }
        long _brokenParameterT1Record { get; set; }
        public long brokenParameterT1Record
        {
            get
            {
                return this._brokenParameterT1Record;
            }
        }
        public void setBrokenParameterT1Record(long value, ref List<string> notifyMsg)
        {
            this._brokenParameterT1Record = value;
            brokenParameterT1RecordChangedF(selfKey, otherKey, value, ref notifyMsg);
        }
        /// <summary>
        /// 告诉自己，别人的社会责任发生变化了
        /// </summary>
        /// <param name="msgToPlayerKey"></param>
        /// <param name="contentKey"></param>
        /// <param name="value"></param>
        /// <param name="notifyMsg"></param>
        public delegate void BrokenParameterT1RecordChanged(string msgToPlayerKey, string contentKey, long value, ref List<string> notifyMsg);
        /// <summary>
        /// 此方法的目的是告诉自己，别人的社会责任发生变化了
        /// </summary>
        public BrokenParameterT1RecordChanged brokenParameterT1RecordChangedF;

        internal int getCarState()
        {
            return this.carChangeState;
        }

        internal void setCarState(int changeState)
        {
            this.carChangeState = changeState;
        }


    }
}
