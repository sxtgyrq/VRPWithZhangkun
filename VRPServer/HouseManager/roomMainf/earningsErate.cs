using CommonClass;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {
        const int frequencyRecordCord = 10;

        /// <summary>
        /// 这里的100代表真实1/120.
        /// 取100是为了方便计算整型。
        /// </summary>
        int frequency = 100;
        public int GetFrequency()
        {
            return this.frequency;
        }
        DateTime lastFrequencyRecord = new DateTime(2000, 1, 1);
        private void initializeEarningRate()
        {
            // this.frequencyRecordCord = 10;
            this.frequency = 100;
            this.lastFrequencyRecord = new DateTime(2000, 1, 1);
        }
        const int baseFrequency = 100;
        //int frequencyEnlargedScale
        //{
        //    get
        //    {
        //        return this.frequency;
        //    }
        //  }
        /// <summary>
        /// 频率变化，要广播！，这里的频率变化，代表奖励倍数！
        /// </summary>
        /// <param name="notifyMsg"></param>
        void addFrequencyRecord(ref List<string> notifyMsg)
        {
            var a = this.frequency + 0;
            var calCulateT = DateTime.Now;
            var t = (calCulateT - this.lastFrequencyRecord).TotalSeconds;
            var f = 1 / t;
            var fInt = Convert.ToInt32(f * 120 * 100);

            fInt = Math.Max(baseFrequency, fInt);
            this.frequency = (this.frequency * frequencyRecordCord + fInt) / (frequencyRecordCord + 1);
            var b = this.frequency + 0;
            this.lastFrequencyRecord = calCulateT;
            if (a != b)
            {
                foreach (var item in this._Players)
                {
                    BroadCoastFrequency(item.Value, ref notifyMsg);
                    //  notifyMsg.Add(item.Value.FromUrl);

                }
            }
        }

        private void BroadCoastFrequency(Player value, ref List<string> notifyMsg)
        {
            notifyMsg.Add(value.FromUrl);

            FrequencyNotify fn = new FrequencyNotify()
            {
                c = "FrequencyNotify",
                WebSocketID = value.WebSocketID,
                frequency = this.frequency
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(fn);
            notifyMsg.Add(json);
        }

        private long DealWithTheFrequcy(int collectReWard)
        {
            return this.frequency * collectReWard / baseFrequency;
            //throw new NotImplementedException();
        }
    }
}
