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
        public string[] CarsNames { get; internal set; }
        public DateTime CreateTime { get; internal set; }
        public DateTime ActiveTime { get; internal set; }
        public int StartFPIndex { get; internal set; }
    }
}
