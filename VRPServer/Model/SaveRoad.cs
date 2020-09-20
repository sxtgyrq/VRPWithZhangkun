using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class SaveRoad
    {
        /// <summary>
        /// 此类必须依据协议走
        /// </summary>
        public class RoadInfo
        {

            public string VersionNumber { get; set; }
            public string RoadCode { get; set; }
            public int RoadOrder { get; set; }
            public double startLongitude { get; set; }
            public double startLatitude { get; set; }
            public double endLongitude { get; set; }
            public double endLatitude { get; set; }

            public int CarInDirection { get; set; }
            public int CarInOpposeDirection { get; set; }
            public int EBicycleInDirection { get; set; }
            public int EBicycleInOpposeDirection { get; set; }
            public int WalkInDirection { get; set; }
            public int WalkInOpposeDirection { get; set; }
            public int MaxSpeed { get; set; }

            public DictCross[] Cross1 { get; set; }
            public DictCross[] Cross2 { get; set; }

            public FastenPositionCalculate[] PassShop { get; set; }
        }

        public class DictCross
        {
            public string RoadCode1 { get; set; }
            public string RoadCode2 { get; set; }
            public double BDLongitude { get; set; }
            public double BDLatitude { get; set; }
            public int IsChanged { get; set; }
            public int CrossState { get; set; }
            public int RoadOrder1 { get; set; }
            public int RoadOrder2 { get; set; }
            public double Percent1 { get; set; }
            public double Percent2 { get; set; }

        }

        public class FastenPositionCalculate
        {
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
            public string FastenPositionID { get; set; }
            public double positionLongitudeOnRoad { get; set; }
            public double positionLatitudeOnRoad { get; set; }
        }
    }
}
