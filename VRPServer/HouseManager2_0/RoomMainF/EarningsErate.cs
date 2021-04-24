using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
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
        private void BroadCoastFrequency(Player value, ref List<string> notifyMsg)
        {
#warning 频率的变化，已经不需要前天知道啦！
            //notifyMsg.Add(value.FromUrl);

            //FrequencyNotify fn = new FrequencyNotify()
            //{
            //    c = "FrequencyNotify",
            //    WebSocketID = value.WebSocketID,
            //    frequency = this.frequency
            //};
            //var json = Newtonsoft.Json.JsonConvert.SerializeObject(fn);
            //notifyMsg.Add(json);
        }

        /// <summary>
        /// 频率变化，不需要要广播！，这里的频率变化，作为房屋选择的参照！
        /// </summary>
        /// <param name="notifyMsg"></param>
        void addFrequencyRecord()
        {
            //  var a = this.frequency + 0;
            var calCulateT = DateTime.Now;
            var t = (calCulateT - this.lastFrequencyRecord).TotalSeconds;
            var f = 1 / t;
            var fInt = Convert.ToInt32(f * 120 * 100);

            fInt = Math.Max(baseFrequency, fInt);
            this.frequency = (this.frequency * frequencyRecordCord + fInt) / (frequencyRecordCord + 1);
            //var b = this.frequency + 0;
            this.lastFrequencyRecord = calCulateT;

        }
        const int baseFrequency = 100;
        DateTime lastFrequencyRecord = new DateTime(2000, 1, 1);
    }
}
