using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        Dictionary<string, List<DateTime>> recordOfPromote = new Dictionary<string, List<DateTime>>();
        /// <summary>
        /// 依据频率，获取价格。这个是随机获取地址的时候，就会获得。
        /// </summary>
        /// <param name="resultType">mile，business，volume，speed</param>
        /// <returns>返回结果为分，即1/100元</returns>
        long GetPriceOfPromotePosition(string resultType)
        {
            if (resultType == "mile" || resultType == "business" || resultType == "volume" || resultType == "speed")
            {
                this.recordOfPromote[resultType].Add(DateTime.Now);
            }
            else
            {
                throw new Exception($"错误地调用{resultType}");
            }
            if (this.recordOfPromote[resultType].Count < 10)
            {
                //  this.recordOfPromote[resultType].Add(DateTime.Now);
                return 10 * 100;
            }
            else
            {
                if (this.recordOfPromote[resultType].Count > 10)
                {
                    this.recordOfPromote[resultType].RemoveAt(0);
                }
                double sumHz = 0;
                for (var i = 1; i < this.recordOfPromote[resultType].Count; i++)
                {
                    var timeS = (this.recordOfPromote[resultType][i] - this.recordOfPromote[resultType][i - 1]).TotalSeconds;
                    timeS = Math.Max(1, timeS);
                    var itemHz = 1 / timeS;
                    sumHz += itemHz;
                }
                var averageValue = sumHz / (this.recordOfPromote[resultType].Count - 1);
                return Convert.ToInt32(50 * 100 * 60 * averageValue); //确保1分钟 的价格是50元
                //var calResult = Math.Round(Convert.ToDecimal(Math.Round(50 * 60 * averageValue, 2)), 2);
                //return Math.Max(0.01m, calResult);
            }
        }
    }
}
