using System;
using System.Collections.Generic;
using System.Text;

namespace CommonClass
{
    public class Monitor
    {
        public string c { get; set; }
    }

    public class CheckPlayersCarState : Monitor
    {
        public string Key { get; set; }
        public string Car { get; set; }
    }
    public class CheckPlayersMoney : Monitor
    {
        public string Key { get; set; } 
    }
    public class CheckPlayerCostBusiness : Monitor
    {
        public string Key { get; set; }
        public string Car { get; set; }
    }

    public class CheckPlayerCostVolume : Monitor
    {
        public string Key { get; set; }
        public string Car { get; set; }
    }
    public class CheckPlayerCarPuporse : Monitor
    {
        public string Key { get; set; }
        public string Car { get; set; }
    }

    public class CheckPromoteDiamondCount : Monitor
    {
        public string Key { get; set; }
        public string pType { get; set; }
    }

    public class All : Monitor
    { 

    }
}
