using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class FastonPosition
    {
        public string FastenPositionID { get; set; }
        public string FastenPositionName { get; set; }
        public string FastenPositionInfo { get; set; }
        public double Longitude { get; set; }
        public double Latitde { get; set; }
        public string RoadCode { get; set; }
        public double RoadPercent { get; set; }
        public int IsChanged { get; set; }
        public int FastenType { get; set; }
        public int RoadOrder { get; set; }
        public string UserName { get; set; }
        public double positionLongitudeOnRoad { get; set; }
        public double positionLatitudeOnRoad { get; set; }
        public int MacatuoX { get; set; }
        public int MacatuoY { get; set; }
        public int Weight { get; set; }
        public string region { get; set; }
    }
}
