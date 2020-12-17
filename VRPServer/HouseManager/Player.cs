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
        }

        public Dictionary<string, OtherPlayers> others { get; set; }

        public Dictionary<string, int> PromoteState { get; set; }
        public int Collect { get; internal set; }
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
        Dictionary<string, List<DateTime>> Data { get; set; }
        DateTime CreateTime { get; set; }
        public decimal costMiles { get; set; }
        public decimal costBusiness { get; set; }
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
        }
        public void Refresh()
        {

            this.Data["mile"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["business"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["volume"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["speed"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.costMiles = 0;

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
        public decimal leftBussiness
        {
            get
            {
                return this.Business - this.costBusiness;
            }
        }
        /// <summary>
        /// 小车能携带的金钱数量！
        /// </summary>
        public decimal Business { get { return this.Data["business"].Count + 2; } }
        /// <summary>
        /// 小车能装载的最大容量，默认为3！
        /// </summary>
        public int Volume { get { return this.Data["volume"].Count + 3; } }
        /// <summary>
        /// 小车能跑的最快速度！
        /// </summary>
        public int Speed { get { return this.Data["speed"].Count + 50; } }
    }

    public class AnimateData
    {
        public List<Data.PathResult> animateData { get; internal set; }
        public DateTime recordTime { get; internal set; }
    }
}
