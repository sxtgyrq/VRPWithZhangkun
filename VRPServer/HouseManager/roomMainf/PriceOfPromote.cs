using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {

        Dictionary<string, List<DateTime>> recordOfPromote = new Dictionary<string, List<DateTime>>();
        //List<DateTime> recordOfMile = new List<DateTime>();
        //List<DateTime> recordOfBussiness = new List<DateTime>();
        //List<DateTime> recordOfVolume = new List<DateTime>();
        //List<DateTime> recordOfSpeed = new List<DateTime>();
        decimal PriceOfPromotePosition(string resultType)
        {
            if (this.recordOfPromote[resultType].Count < 10)
            {
                return 50;
            }
            else
            {
                double sumHz = 0;
                for (var i = 1; i < this.recordOfPromote[resultType].Count; i++)
                {
                    var timeS = (this.recordOfPromote[resultType][i] - this.recordOfPromote[resultType][i - 1]).TotalSeconds;
                    timeS = Math.Max(1, timeS);
                    var itemHz = 1 / timeS;
                    sumHz += itemHz;
                }
                var averageValue = sumHz / (this.recordOfPromote[resultType].Count - 1);
                var calResult = Math.Round(Convert.ToDecimal(Math.Round(50 * 60 * averageValue, 2)), 2);
                return Math.Max(0.01m, calResult);
            }
        }
    }
}
