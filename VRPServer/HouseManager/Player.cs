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
                    targetFpIndex = -1
                });
        }

        public Dictionary<string, OtherPlayers> others { get; set; }

        public Dictionary<string, int> PromoteState { get; set; }
    }
    public class OtherPlayers
    {

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
     */
    //
    //
    public enum CarState
    {
        waitAtBaseStation,
        roadForTax,
        waitForTaxOrAttack,
        roadForCollect,
        waitForCollectOrAttack,
        roadForAttack,
        returning,
        buying
    }
    public class Car
    {
        public string name { get; set; }
        public AbilityAndState ability { get; set; }
        public CarState state { get; set; }
        public int targetFpIndex { get; set; }
        public int changeState { get; set; }
    }
    public class AbilityAndState
    {
        Dictionary<string, List<DateTime>> Data { get; set; }
        DateTime CreateTime { get; set; }
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
        }
        public void Refresh()
        {

            this.Data["mile"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["business"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["volume"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
            this.Data["speed"].RemoveAll(item => (item - this.CreateTime).TotalMinutes > 120);
        }
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
        public int Licheng
        {
            get
            {
                return this.Data["mile"].Count + 160;
            }
        }
        /// <summary>
        /// 小车能携带的金钱数量！
        /// </summary>
        public decimal Yewu { get { return this.Data["business"].Count + 2; } }
        /// <summary>
        /// 小车能装载的最大容量，默认为3！
        /// </summary>
        public int Volume { get { return this.Data["volume"].Count + 3; } }
        /// <summary>
        /// 小车能跑的最快速度！
        /// </summary>
        public int Speed { get { return this.Data["speed"].Count + 50; } }
    }
}
