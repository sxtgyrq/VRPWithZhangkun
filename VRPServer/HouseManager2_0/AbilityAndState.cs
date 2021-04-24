using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0
{
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
        public int getDataCount(string key)
        {
            if (this.Data.ContainsKey(key))
            {
                return this.Data[key].Count;
            }
            else
            {
                return 0;
            }
        }
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
                return this.Data["mile"].Count * 7 + 350;
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
        public long Business { get { return (this.Data["business"].Count * 500 + 10000); } }
        /// <summary>
        /// 小车能装载的最大容量，默认为10000分，即1/100元。
        /// </summary>
        public long Volume { get { return (this.Data["volume"].Count * 500 + 10000); } }
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
}
