using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0
{
    public class Car
    {
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
        public delegate void SendStateAndPurposeF(Player player, Car car, ref List<string> notifyMsg);

        public delegate void SendPurposeOfCarF(Player player, Car car, ref List<string> notifyMsg);

        public delegate void SetAnimateChangedF(Player player, Car car, ref List<string> notifyMsg);

        //public string name { get; set; }
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


        /// <summary>
        /// 此函数主要用于动画变化！
        /// </summary>
        int _changeState = 0;
        public int changeState { get { return this._changeState; } }
        public SetAnimateChangedF SetAnimateChanged;
        public AnimateData2 animateData { get; private set; }
        internal void setAnimateData(Player player, ref List<string> notifyMsg, AnimateData2 data)
        {
            this.animateData = data;
            this._changeState++;
            SetAnimateChanged(player, this, ref notifyMsg);
            //  throw new NotImplementedException();
        }

        //public int carIndex { get; internal set; }

        internal string IndexString
        {
            get
            {
                return "car";
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

        public class AnimateData2
        {
            public Data.PathStartPoint2 start { get; internal set; }
            //public List<Data.PathResult3> animateData { get; internal set; }
            public List<int> animateData { get; internal set; }
            public DateTime recordTime { get; internal set; }
        }
    }


}
