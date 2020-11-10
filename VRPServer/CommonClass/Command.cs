using System;
using System.Collections.Generic;
using System.Text;

namespace CommonClass
{
    public class Command
    {
        public string c { get; set; }
    }

    public class PlayerAdd : Command
    {
        public string Key { get; set; }
        public string FromUrl { get; set; }
        public int RoomIndex { get; set; }

        public string Check { get; set; }
        public int WebSocketID { get; set; }
    }

    public class PlayerCheck : PlayerAdd { }

    public class TeamCreate : Command
    {
        public string FromUrl { get; set; }
        public string CommandStart { get; set; }
        public int WebSocketID { get; set; }
    }
    public class TeamResult : Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }
        /// <summary>
        /// 作为队伍的索引
        /// </summary>
        public int TeamNumber { get; set; }
    }

    public class TeamFoundResult : Command
    {
        public bool HasResult { get; set; }
        /// <summary>
        /// 作为队伍的索引
        /// </summary>
        public int TeamNumber { get; set; }
    }
    public class TeamBegain : Command
    {
        public int TeamNumber { get; set; }
    }
}
