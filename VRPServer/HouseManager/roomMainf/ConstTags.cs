using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        const string AttackFailedReturn = "attack-failed-return";
        const string CollectReturn = "collect-return";

        internal static void SubsidizeChanged(Player player, Car car, ref List<string> notifyMsgs, long subsidize)
        {
            Console.WriteLine($"SubsidizeChanged 方法没有编写");
            //throw new NotImplementedException();
        }

        internal static void DiamondInCarChanged(Player player, Car car, ref List<string> notifyMsgs, string value)
        {
            Console.WriteLine($"DiamondInCarChanged 方法没有编写");
        }

        
    }
}
