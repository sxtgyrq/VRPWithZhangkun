using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace MateWsAndHouse
{
    public class Team
    {
        internal List<TeamJoin> member { get; set; }

        public TeamCreate captain { get; set; }

        public int TeamID { get; set; }
        public DateTime CreateTime { get; set; }

        public bool IsBegun { get; set; }

    }
    public class Number
    {
        string url { get; set; }
        int WsID { get; set; }
    }
}
