using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public class Player
    {
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
        internal void initializeCars(string[] carsNames)
        {
            if (carsNames.Length != 5)
            {
                var msg = "应该有5个汽车";
                Console.WriteLine(msg);
                throw new Exception(msg);
            }
            this._Cars = new List<Car>(5);
            for (var i = 0; i < 5; i++)
                this._Cars.Add(new Car()
                {
                    name = carsNames[i],
                    ability = new AbilityAndState(),
                    state = CarState.waitAtBaseStation,
                    changeState = 0,
                    targetFpIndex = -1,
                    animateData = null,
                    purpose = Purpose.@null
                });
            this.Money = 500 * 100;
            this.SupportToPlay = null;
        }

        public Dictionary<string, OtherPlayers> others { get; set; }

        public Dictionary<string, int> PromoteState { get; set; }
        public int Collect { get; internal set; }

        long _Money = 0;
        /// <summary>
        /// 单位是分
        /// </summary>
        public long Money
        {
            get
            {
                return this._Money;
            }
            set
            {
                if (value < 0)
                {
                    throw new Exception("金钱怎么能负，为何不做判断？");
                }
                this._Money = value;
            }
        }
        public long MoneyToPromote
        {
            get
            {
                return this.Money + (this.SupportToPlay == null ? 0 : this.SupportToPlay.Money);
            }
        }

        public Support SupportToPlay { get; private set; }
        public class Support
        {
            long _Money = 0;
            /// <summary>
            /// 单位是分
            /// </summary>
            public long Money
            {
                get
                {
                    return this._Money;
                }
                set
                {
                    if (value < 0)
                    {
                        throw new Exception("金钱怎么能负，为何不做判断？");
                    }
                    this._Money = value;
                }
            }
        }

        internal void PayWithSupport(long needMoney, out long moneyFromSupport, out long moneyFromEarn)
        {
            if (this.SupportToPlay != null)
            {
                if (needMoney <= this.SupportToPlay.Money)
                {
                    moneyFromSupport = needMoney;
                }
                else
                {
                    moneyFromSupport = this.SupportToPlay.Money;
                }
            }
            else
            {
                moneyFromSupport = 0;
            }
            //  Console.WriteLine($"{needMoney}{moneyFromSupport}{}");
            moneyFromEarn = needMoney - moneyFromSupport;
            if (this.SupportToPlay != null)
                this.SupportToPlay.Money -= moneyFromSupport;
            this.Money -= moneyFromEarn;
        }
        /// <summary>
        /// 玩家欠其他玩家的债！
        /// </summary>
        public Dictionary<string, long> Debts { get; set; }

        /// <summary>
        /// 返回使玩家破产需要的资金！
        /// </summary>
        /// <param name="victim">玩家</param>
        /// <returns>返回使玩家破产需要的资金！</returns>
        public long LastDebt
        {
            /*
             * a asset资产
             * d debt债务
             * a+x=(d+x)*t
             * t=t1/t2
             * t1=120
             * t2-100
             */
            get
            {
                long debt = 0;
                foreach (var item in this.Debts)
                {
                    debt += item.Value;
                }
                long asset = this.Money;
                const long t2 = 100;
                const long t1 = 120;
                return (asset * t2 - debt * t1) / (t1 - t2);
            }

        }

        /// <summary>
        /// 表征玩家已破产。已破产后，系统接管玩家进行还债。玩家的操作权被收回。
        /// </summary>
        public bool Bust
        {
            get; set;
        }

        internal void AddDebts(string key, long attack)
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
        }
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
        public string name { get; set; }
        public AbilityAndState ability { get; set; }

        public CarState state { get; set; }
        public Purpose purpose { get; set; }
        /// <summary>
        /// 汽车的目标地点。
        /// </summary>
        public int targetFpIndex { get; set; }
        public int changeState { get; set; }
        public AnimateData animateData { get; internal set; }



        internal void Refresh()
        {
            this.state = CarState.waitAtBaseStation;
            Console.WriteLine("执行了归位");
            this.targetFpIndex = -1;
            this.purpose = Purpose.@null;
        }
    }
    public class AbilityAndState
    {

        long _subsidize = 0;
        /// <summary>
        /// 资助用于提升能力的钱。专款专用。如果没有用完，还是将这个资金返回player的 subsidize账户。这个资金不能用于攻击。
        /// 单位为分
        /// </summary>
        public long subsidize
        {
            get { return this._subsidize; }
            set
            {
                if (value < 0)
                {
                    throw new Exception("错误的输入");
                }
                this._subsidize = value;
            }
        }

        Dictionary<string, List<DateTime>> Data { get; set; }


        public string diamondInCar { get; set; }
        DateTime CreateTime { get; set; }
        public decimal costMiles { get; set; }

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
            set

            {
                if (value < 0)
                {
                    throw new Exception("错误的输入");
                }
                this._costBusiness = value;
            }
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
            set

            {
                if (value < 0)
                {
                    throw new Exception("错误的输入");
                }
                this._costVolume = value;
            }
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
            this.costMiles = 0;
            this.costVolume = 0;
            this.costBusiness = 0;
            this.diamondInCar = "";
            this.subsidize = 0;
        }
        public void Refresh()
        {

            this.Data["mile"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["business"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["volume"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["speed"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.costMiles = 0;
            this.costBusiness = 0;
            this.costVolume = 0;

            this.diamondInCar = "";
            this.subsidize = 0;
        }
        /// <summary>
        /// 必须是在基地的时候引用
        /// </summary>
        /// <param name="pType"></param>
        public void AddAbility(string pType)
        {
            if (this.Data.ContainsKey(pType))
            {
                this.Data[pType].Add(DateTime.Now);
            }
            this.Refresh();
        }

        internal void getMoneyWithSupport(long moneyFromSupport, long moneyFromEarn)
        {
            this.subsidize += moneyFromSupport;
            this.costBusiness += moneyFromEarn;
        }

        /// <summary>
        /// 依次用辅助、bussiness、volume来支付。
        /// </summary>
        /// <param name="needMoney"></param>
        internal void payForPromote(long needMoney)
        {
            var pay1 = Math.Min(needMoney, this.subsidize);
            this.subsidize -= pay1;
            needMoney -= pay1;

            var pay2 = Math.Min(needMoney, this.costBusiness);
            this.costBusiness -= pay2;
            needMoney -= pay2;

            var pay3 = Math.Min(needMoney, this.costVolume);
            this.costVolume -= pay3;
            needMoney -= pay3;

            if (needMoney != 0)
            {
                throw new Exception("");
            }
        }

        /// <summary>
        /// 小车能跑的最大距离，最小值为160km！
        /// </summary>
        public decimal mile
        {
            get
            {
                return this.Data["mile"].Count + 200;
            }
        }
        public decimal leftMile
        {
            get
            {
                return this.mile - this.costMiles;
            }
        }
        /// <summary>
        /// 通过税收、携带，还能带多少钱。单位为分，即1/100元
        /// </summary>
        public long leftBussiness
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
        public long Business { get { return (this.Data["business"].Count + 100) * 100; } }
        /// <summary>
        /// 小车能装载的最大容量，默认为100鼋！单位为分，即1/100元。
        /// </summary>
        public long Volume { get { return (this.Data["volume"].Count + 100) * 100; } }
        /// <summary>
        /// 小车能跑的最快速度！
        /// </summary>
        public int Speed { get { return this.Data["speed"].Count + 50; } }

        /// <summary>
        /// 单位为分
        /// </summary>
        public long SumMoneyCanForCollect
        {
            get
            {
                return this.costVolume + this.costBusiness + this.subsidize;
            }
        }

    }

    public class AnimateData
    {
        public List<Data.PathResult> animateData { get; internal set; }
        public DateTime recordTime { get; internal set; }
    }
}
