using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static Model.MapGo;
using static Model.SaveRoad;

namespace HouseManager
{
    public class FindF
    {
        delegate bool LikeFsPresentCode(string fsPresentCode);
        static LikeFsPresentCode likeFsPresentCode = CommonClass.MapFormat.LikeFsPresentCode;

        delegate bool LikeCross(string crossCode);
        static LikeCross likeCross = CommonClass.MapFormat.LikeCross;

        delegate double GetDistance(double lat1, double lng1, double lat2, double lng2);
        static GetDistance getDistance = CommonClass.Geography.getLengthOfTwoPoint.GetDistance;
        public class DataToNavigateWithTimeFunction2
        {
            /// <summary>
            /// 线路衍生到此的时间。主键是商店，值是时间。
            /// </summary>
            Dictionary<string, int> TimeToExpand { get; set; }
            Dictionary<string, string> LastDirection { get; set; }
            Dictionary<string, DictCross> CrossRecord { get; set; }
            Dictionary<string, string> DirectionComeFrom { get; set; }
            public DataToNavigateWithTimeFunction2()
            {
                //this.city = city_;
                //this.configItem = CityRunAliyunDAL.Config.map.getMapConfigInfo(city, false);
                this.TimeToExpand = new Dictionary<string, int>();
                this.LastDirection = new Dictionary<string, string>();
                this.CrossRecord = new Dictionary<string, DictCross>();
                this.DirectionComeFrom = new Dictionary<string, string>();
            }
            private string city;
            public Dictionary<string, Dictionary<int, RoadInfo>> roads;
            public Dictionary<string, FastonPosition> allFps;
            //   CityRunModel.Config.MapConfig configItem;

            public void ReadRoadInfo(Dictionary<string, Dictionary<int, RoadInfo>> roads_, List<FastonPosition> allFps_)
            {
                this.roads = roads_;
                this.allFps = new Dictionary<string, FastonPosition>();
                for (var i = 0; i < allFps_.Count; i++)
                {
                    this.allFps.Add(allFps_[i].FastenPositionID, allFps_[i]);
                }
            }


            //public void AddFpDirection(string FastenPositionID,double operateT)

            //   internal List<nyrqPosition> FindPlace(FastonPosition fpLast, string placePresentCode)
            public List<nyrqPosition> FindPlace(FastonPosition fpLast, string placePresentCode)
            {
                bool success;
                var result = FindPlace(fpLast, placePresentCode, out success);
                if (success) { }
                else
                {
                    return new List<nyrqPosition>();
                }
                return result;
            }
            public List<nyrqPosition> FindPlace(string roadCode_input, int roadOrder_input, double percent_input, string placePresentCode)
            {
                bool success;
                var result = FindPlace(roadCode_input, roadOrder_input, percent_input, placePresentCode, out success);
                if (success) { }
                else
                {
                    return new List<nyrqPosition>();
                }
                return result;
            }

            /// <summary>
            /// 获取路径
            /// </summary>
            /// <param name="fpLast">指出发点</param>
            /// <param name="placePresentCode">指要寻找的fp的Id</param>
            /// <param name="success">是否成功</param>
            /// <returns>返回路径</returns>
            public List<nyrqPosition> FindPlace(FastonPosition fpLast, string placePresentCode, out bool success)
            {

                // throw new Exception("");
                Dictionary<string, bool> dealedKeys = new Dictionary<string, bool>();
                int maxmSeconsCount = 24 * 3600 * 1000;
                //string operateRoadCode = fpLast.RoadCode;
                //var operateRoadOrder = fpLast.RoadOrder;
                //var operatePercent = fpLast.RoadPercent;
                int operateT = 0;
                /*
                 * 这里的fpLast实际为出发地点。出发地点的操作时间为0
                 */
                this.TimeToExpand.Add(fpLast.FastenPositionID, operateT);
                this.LastDirection.Add(fpLast.FastenPositionID, "start");

                while (true)
                {
                    if ((!this.TimeToExpand.ContainsKey(placePresentCode)))
                    {
                        if (dealWithWhileProcess(ref operateT, maxmSeconsCount, ref dealedKeys)) { }
                        else
                        {
                            break;
                        }

                    }
                    else
                    {
                        /*
                         * 加入在预计的时间内，没有包含目标，继续寻找
                         */
                        if (this.TimeToExpand[placePresentCode] > operateT)
                        {
                            if (dealWithWhileProcess(ref operateT, maxmSeconsCount, ref dealedKeys)) { }
                            else
                            {
                                break;
                            }
                        }
                        else
                        {
                            ///A做为Path
                            List<nyrqPosition> A = new List<nyrqPosition>();
                            var key = placePresentCode;
                            while (key != "start")
                            {
                                //   A += key + ":";


                                if (likeFsPresentCode(key))
                                {
                                    if (A.Count == 0)
                                    {
                                        var passedFp = this.allFps[key];
                                        A.Add(new nyrqPosition(passedFp.RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, this.roads[passedFp.RoadCode][0].MaxSpeed));
                                    }
                                    else
                                    {
                                        var lastInsert = A[0];
                                        var passedFp = this.allFps[key];
                                        if (lastInsert.roadCode != passedFp.RoadCode)
                                        {
                                            throw new Exception("");
                                        }
                                        string RoadCode = passedFp.RoadCode;
                                        int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                        bool isInDirection = passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent;
                                        //if (passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent)
                                        {
                                            if (passedFp.RoadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > passedFp.RoadOrder) : (i < passedFp.RoadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            passedFp.RoadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLongitude : this.roads[RoadCode][passedFp.RoadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLatitude : this.roads[RoadCode][passedFp.RoadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                                }
                                            }
                                        }
                                    }
                                    //A += CityRunFunction.JsonConvertf.SerializeObject(this.allFps[key]);
                                }
                                else if (likeCross(key))
                                {
                                    if (A.Count == 0)
                                    {
                                        throw new Exception("");
                                    }
                                    else
                                    {

                                        var lastInsert = A[0];
                                        var passedcross = this.CrossRecord[key];



                                        {
                                            string RoadCode;
                                            int roadOrder;
                                            double roadPercent;
                                            if (passedcross.RoadCode1 == lastInsert.roadCode)
                                            {
                                                RoadCode = passedcross.RoadCode1;
                                                roadOrder = passedcross.RoadOrder1;
                                                roadPercent = passedcross.Percent1;
                                            }
                                            else if (passedcross.RoadCode2 == lastInsert.roadCode)
                                            {
                                                RoadCode = passedcross.RoadCode2;
                                                roadOrder = passedcross.RoadOrder2;
                                                roadPercent = passedcross.Percent2;
                                            }
                                            else
                                            {
                                                throw new Exception("");
                                            }
                                            int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                            bool isInDirection = roadOrder + roadPercent < lastInsert.roadOrder + lastInsert.percent;

                                            if (roadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, roadOrder, roadPercent, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > roadOrder) : (i < roadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            roadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][roadOrder].endLongitude : this.roads[RoadCode][roadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][roadOrder].endLatitude : this.roads[RoadCode][roadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, roadOrder, roadPercent, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                                }
                                            }
                                        }
                                        {
                                            string roadCodeToChange;
                                            int roadOrderToChange;
                                            double roadPercentToChange;
                                            if (DirectionComeFrom.ContainsKey(key)) { }
                                            else
                                            {
                                                Console.Write(key);
                                                throw new Exception(key);
                                            }
                                            if (passedcross.RoadCode1 == DirectionComeFrom[key])
                                            {
                                                roadCodeToChange = passedcross.RoadCode1;
                                                roadOrderToChange = passedcross.RoadOrder1;
                                                roadPercentToChange = passedcross.Percent1;
                                            }
                                            else if (passedcross.RoadCode2 == DirectionComeFrom[key])
                                            {
                                                roadCodeToChange = passedcross.RoadCode2;
                                                roadOrderToChange = passedcross.RoadOrder2;
                                                roadPercentToChange = passedcross.Percent2;
                                            }
                                            else
                                            {
                                                throw new Exception("");
                                            }
                                            int MaxSpeed = this.roads[roadCodeToChange][0].MaxSpeed;
                                            A.Insert(0, new nyrqPosition(roadCodeToChange, roadOrderToChange, roadPercentToChange, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                        }
                                    }
                                }

                                key = this.LastDirection[key];

                            }
                            {
                                if (key != "start")
                                {
                                    throw new Exception("key!=\"start\"");
                                }


                                if (likeFsPresentCode(fpLast.FastenPositionID))
                                {
                                    if (A.Count == 0)
                                    {
                                        var passedFp = fpLast;
                                        A.Add(new nyrqPosition(passedFp.RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLatitudeOnRoad, passedFp.positionLongitudeOnRoad, this.roads[passedFp.RoadCode][0].MaxSpeed));
                                    }
                                    else
                                    {
                                        var lastInsert = A[0];
                                        var passedFp = fpLast;

                                        if (lastInsert.roadCode != passedFp.RoadCode)
                                        {
                                            throw new Exception("");
                                        }
                                        string RoadCode = passedFp.RoadCode;
                                        int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                        bool isInDirection = passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent;
                                        {
                                            if (passedFp.RoadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > passedFp.RoadOrder) : (i < passedFp.RoadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            passedFp.RoadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLongitude : this.roads[RoadCode][passedFp.RoadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLatitude : this.roads[RoadCode][passedFp.RoadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    throw new Exception("");
                                }
                            }
                            success = true;
                            return A;
                        }
                    }

                }

                success = false;
                return new List<nyrqPosition>();
            }


            const string virtualFastonPositionID = "NOTEXIST";

            FastonPosition virtualFastonPosition;

            public List<nyrqPosition> FindPlace(string roadCode_input, int roadOrder_input, double percent_input, string placePresentCode, out bool success)
            {

                var fpLast = new FastonPosition()
                {
                    RoadCode = roadCode_input,
                    RoadOrder = roadOrder_input,
                    RoadPercent = percent_input,
                    FastenPositionID = virtualFastonPositionID,
                    positionLongitudeOnRoad = this.roads[roadCode_input][roadOrder_input].startLongitude + (this.roads[roadCode_input][roadOrder_input].endLongitude - this.roads[roadCode_input][roadOrder_input].startLongitude) * percent_input,
                    positionLatitudeOnRoad = this.roads[roadCode_input][roadOrder_input].startLatitude + (this.roads[roadCode_input][roadOrder_input].endLatitude - this.roads[roadCode_input][roadOrder_input].startLatitude) * percent_input,
                    Longitude = this.roads[roadCode_input][roadOrder_input].startLongitude + (this.roads[roadCode_input][roadOrder_input].endLongitude - this.roads[roadCode_input][roadOrder_input].startLongitude) * percent_input,
                    Latitde = this.roads[roadCode_input][roadOrder_input].startLatitude + (this.roads[roadCode_input][roadOrder_input].endLatitude - this.roads[roadCode_input][roadOrder_input].startLatitude) * percent_input
                };
                this.virtualFastonPosition = fpLast;
                // throw new Exception("");
                Dictionary<string, bool> dealedKeys = new Dictionary<string, bool>();
                int maxmSeconsCount = 24 * 3600 * 1000;
                //string operateRoadCode = fpLast.RoadCode;
                //var operateRoadOrder = fpLast.RoadOrder;
                //var operatePercent = fpLast.RoadPercent;
                int operateT = 0;

                this.TimeToExpand.Add(fpLast.FastenPositionID, operateT);
                this.LastDirection.Add(fpLast.FastenPositionID, "start");

                while (true)
                {
                    if ((!this.TimeToExpand.ContainsKey(placePresentCode)))
                    {
                        if (dealWithWhileProcess(ref operateT, maxmSeconsCount, ref dealedKeys)) { }
                        else
                        {
                            break;
                        }

                    }
                    else
                    {
                        if (this.TimeToExpand[placePresentCode] > operateT)
                        {
                            if (dealWithWhileProcess(ref operateT, maxmSeconsCount, ref dealedKeys)) { }
                            else
                            {
                                break;
                            }
                        }
                        else
                        {
                            List<nyrqPosition> A = new List<nyrqPosition>();
                            var key = placePresentCode;
                            while (key != "start")
                            {
                                //   A += key + ":";


                                if (likeFsPresentCode(key))
                                {
                                    if (A.Count == 0)
                                    {
                                        var passedFp = this.allFps[key];
                                        A.Add(new nyrqPosition(passedFp.RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, this.roads[passedFp.RoadCode][0].MaxSpeed));
                                    }
                                    else
                                    {
                                        var lastInsert = A[0];
                                        var passedFp = this.allFps[key];
                                        if (lastInsert.roadCode != passedFp.RoadCode)
                                        {
                                            throw new Exception("");
                                        }
                                        string RoadCode = passedFp.RoadCode;
                                        int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                        bool isInDirection = passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent;
                                        //if (passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent)
                                        {
                                            if (passedFp.RoadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > passedFp.RoadOrder) : (i < passedFp.RoadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            passedFp.RoadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLongitude : this.roads[RoadCode][passedFp.RoadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLatitude : this.roads[RoadCode][passedFp.RoadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                                }
                                            }
                                        }
                                    }
                                    //A += CityRunFunction.JsonConvertf.SerializeObject(this.allFps[key]);
                                }
                                else if (likeCross(key))
                                {
                                    if (A.Count == 0)
                                    {
                                        throw new Exception("");
                                    }
                                    else
                                    {

                                        var lastInsert = A[0];
                                        var passedcross = this.CrossRecord[key];



                                        {
                                            string RoadCode;
                                            int roadOrder;
                                            double roadPercent;
                                            if (passedcross.RoadCode1 == lastInsert.roadCode)
                                            {
                                                RoadCode = passedcross.RoadCode1;
                                                roadOrder = passedcross.RoadOrder1;
                                                roadPercent = passedcross.Percent1;
                                            }
                                            else if (passedcross.RoadCode2 == lastInsert.roadCode)
                                            {
                                                RoadCode = passedcross.RoadCode2;
                                                roadOrder = passedcross.RoadOrder2;
                                                roadPercent = passedcross.Percent2;
                                            }
                                            else
                                            {
                                                throw new Exception("");
                                            }
                                            int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                            bool isInDirection = roadOrder + roadPercent < lastInsert.roadOrder + lastInsert.percent;

                                            if (roadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, roadOrder, roadPercent, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > roadOrder) : (i < roadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            roadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][roadOrder].endLongitude : this.roads[RoadCode][roadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][roadOrder].endLatitude : this.roads[RoadCode][roadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, roadOrder, roadPercent, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                                }
                                            }
                                        }
                                        {
                                            string roadCodeToChange;
                                            int roadOrderToChange;
                                            double roadPercentToChange;
                                            if (DirectionComeFrom.ContainsKey(key)) { }
                                            else
                                            {
                                                Console.Write(key);
                                                throw new Exception(key);
                                            }
                                            if (passedcross.RoadCode1 == DirectionComeFrom[key])
                                            {
                                                roadCodeToChange = passedcross.RoadCode1;
                                                roadOrderToChange = passedcross.RoadOrder1;
                                                roadPercentToChange = passedcross.Percent1;
                                            }
                                            else if (passedcross.RoadCode2 == DirectionComeFrom[key])
                                            {
                                                roadCodeToChange = passedcross.RoadCode2;
                                                roadOrderToChange = passedcross.RoadOrder2;
                                                roadPercentToChange = passedcross.Percent2;
                                            }
                                            else
                                            {
                                                throw new Exception("");
                                            }
                                            int MaxSpeed = this.roads[roadCodeToChange][0].MaxSpeed;
                                            A.Insert(0, new nyrqPosition(roadCodeToChange, roadOrderToChange, roadPercentToChange, passedcross.BDLongitude, passedcross.BDLatitude, MaxSpeed));
                                        }
                                    }
                                }

                                key = this.LastDirection[key];

                            }
                            {
                                if (key != "start")
                                {
                                    throw new Exception("key!=\"start\"");
                                }


                                if (likeFsPresentCode(fpLast.FastenPositionID) || fpLast.FastenPositionID == virtualFastonPositionID)
                                {
                                    if (A.Count == 0)
                                    {
                                        var passedFp = fpLast;
                                        A.Add(new nyrqPosition(passedFp.RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLatitudeOnRoad, passedFp.positionLongitudeOnRoad, this.roads[passedFp.RoadCode][0].MaxSpeed));
                                    }
                                    else
                                    {
                                        var lastInsert = A[0];
                                        var passedFp = fpLast;

                                        if (lastInsert.roadCode != passedFp.RoadCode)
                                        {
                                            throw new Exception("");
                                        }
                                        string RoadCode = passedFp.RoadCode;
                                        int MaxSpeed = this.roads[RoadCode][0].MaxSpeed;
                                        bool isInDirection = passedFp.RoadOrder + passedFp.RoadPercent < lastInsert.roadOrder + lastInsert.percent;
                                        {
                                            if (passedFp.RoadOrder == lastInsert.roadOrder)
                                            {
                                                A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                            }
                                            else
                                            {
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (RoadCode,
                                                        lastInsert.roadOrder, isInDirection ? 0 : 1,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLongitude : this.roads[RoadCode][lastInsert.roadOrder].endLongitude,
                                                        isInDirection ? this.roads[RoadCode][lastInsert.roadOrder].startLatitude : this.roads[RoadCode][lastInsert.roadOrder].endLatitude,
                                                        MaxSpeed));

                                                }
                                                for (
                                                    var i = (isInDirection ? (lastInsert.roadOrder - 1) : (lastInsert.roadOrder + 1));
                                                    isInDirection ? (i > passedFp.RoadOrder) : (i < passedFp.RoadOrder);
                                                  i = i + (isInDirection ? -1 : 1))
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][i].endLongitude : this.roads[RoadCode][i].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][i].endLatitude : this.roads[RoadCode][i].startLatitude,
                                                            MaxSpeed));
                                                    A.Insert(0,
                                                        new nyrqPosition
                                                        (
                                                            RoadCode,
                                                            i,
                                                            isInDirection ? 0 : 1,
                                                            isInDirection ? this.roads[RoadCode][i].startLongitude : this.roads[RoadCode][i].endLongitude,
                                                           isInDirection ? this.roads[RoadCode][i].startLatitude : this.roads[RoadCode][i].endLatitude,
                                                           MaxSpeed));
                                                }
                                                {
                                                    A.Insert(0,
                                                        new nyrqPosition(
                                                            RoadCode,
                                                            passedFp.RoadOrder,
                                                            isInDirection ? 1 : 0,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLongitude : this.roads[RoadCode][passedFp.RoadOrder].startLongitude,
                                                            isInDirection ? this.roads[RoadCode][passedFp.RoadOrder].endLatitude : this.roads[RoadCode][passedFp.RoadOrder].startLatitude, MaxSpeed));
                                                    A.Insert(0, new nyrqPosition(RoadCode, passedFp.RoadOrder, passedFp.RoadPercent, passedFp.positionLongitudeOnRoad, passedFp.positionLatitudeOnRoad, MaxSpeed));
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    throw new Exception("");
                                }
                            }
                            success = true;
                            return A;
                        }
                    }

                }

                success = false;
                return new List<nyrqPosition>();
            }
            /// <summary>
            /// 
            /// </summary>
            /// <param name="operateT">延展时间</param>
            /// <param name="maxmSeconsCount">最大时间数，一般是24小时</param>
            /// <param name="dealedKeys">已经处理的地点</param>
            /// <returns></returns>
            private bool dealWithWhileProcess(ref int operateT, int maxmSeconsCount, ref Dictionary<string, bool> dealedKeys)
            {
                bool hasFoundNewElement = false;//表征该过程是否找到了新的元素！

                var newOperateT = int.MaxValue;//默认值为最大值
                string key = "";//设置最大值

                foreach (var item in this.TimeToExpand)
                {
                    /*
                     * 确定最小时间间隔
                     */
                    if (item.Value >= operateT)
                    {
                        if (item.Value < newOperateT)
                        {
                            if (dealedKeys.ContainsKey(item.Key)) { }
                            else
                            {
                                newOperateT = item.Value;
                                key = item.Key;
                            }
                        }
                        //newOperateT = Math.Min(newOperateT, item.Value);
                        //key
                    }
                }
                if (newOperateT > maxmSeconsCount || key == "")
                {
                    return false;
                }
                else
                {
                    if (likeFsPresentCode(key) || key == virtualFastonPositionID)
                    {

                        //标志找到的地点为固定地点。
                        string operateRoadCode;
                        int operateRoadOrder;
                        double operateRoadPercent;
                        if (key == virtualFastonPositionID)
                        {
                            operateRoadCode = this.virtualFastonPosition.RoadCode;
                            operateRoadOrder = this.virtualFastonPosition.RoadOrder;
                            operateRoadPercent = this.virtualFastonPosition.RoadPercent;
                        }
                        else
                        {
                            operateRoadCode = this.allFps[key].RoadCode;
                            operateRoadOrder = this.allFps[key].RoadOrder;
                            operateRoadPercent = this.allFps[key].RoadPercent;
                        }


                        if (this.roads[operateRoadCode][operateRoadOrder].CarInDirection == 1)
                        {

                            var road = this.roads[operateRoadCode];

                            for (var i = operateRoadOrder; i < road.Count; i++)
                            {
                                var roadSegment = road[i];
                                {
                                    DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                }
                                {
                                    DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                }
                                {
                                    dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                }
                            }
                        }
                        if (this.roads[operateRoadCode][operateRoadOrder].CarInOpposeDirection == 1)
                        {
                            var road = this.roads[operateRoadCode];

                            for (var i = 0; i <= operateRoadOrder; i++)
                            {
                                var roadSegment = road[i];

                                DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                            }

                        }
                        operateT = newOperateT;
                        dealedKeys.Add(key, true);
                        return true;
                    }
                    else if (likeCross(key))
                    {
                        {
                            var operateRoadCode = this.CrossRecord[key].RoadCode1;
                            var operateRoadOrder = this.CrossRecord[key].RoadOrder1;
                            var operateRoadPercent = this.CrossRecord[key].Percent1;
                            if (this.roads[operateRoadCode][operateRoadOrder].CarInDirection == 1)
                            {
                                var road = this.roads[operateRoadCode];

                                for (var i = operateRoadOrder; i < road.Count; i++)
                                {
                                    var roadSegment = road[i];
                                    {
                                        DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                    {
                                        DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                    {
                                        dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                }
                            }
                            if (this.roads[operateRoadCode][operateRoadOrder].CarInOpposeDirection == 1)
                            {
                                var road = this.roads[operateRoadCode];

                                for (var i = 0; i <= operateRoadOrder; i++)
                                {
                                    var roadSegment = road[i];

                                    DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                    DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                    dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                }

                            }
                        }
                        {
                            var operateRoadCode = this.CrossRecord[key].RoadCode2;
                            var operateRoadOrder = this.CrossRecord[key].RoadOrder2;
                            var operateRoadPercent = this.CrossRecord[key].Percent2;
                            if (this.roads[operateRoadCode][operateRoadOrder].CarInDirection == 1)
                            {
                                var road = this.roads[operateRoadCode];

                                for (var i = operateRoadOrder; i < road.Count; i++)
                                {
                                    var roadSegment = road[i];
                                    {
                                        DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                    {
                                        DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                    {
                                        dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInDirection));
                                    }
                                }
                            }
                            if (this.roads[operateRoadCode][operateRoadOrder].CarInOpposeDirection == 1)
                            {
                                var road = this.roads[operateRoadCode];

                                for (var i = 0; i <= operateRoadOrder; i++)
                                {
                                    var roadSegment = road[i];

                                    DealWithCross1(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                    DealWithCross2(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                    dealWithPassShop(roadSegment, operateRoadPercent, operateRoadOrder, operateRoadCode, newOperateT, key, ref hasFoundNewElement, i, new condition(conditionWhenInOpposeDirection));

                                }

                            }
                        }
                        operateT = newOperateT;
                        dealedKeys.Add(key, true);
                        return true;
                    }
                    else
                    {
                        throw new Exception("");
                    }

                }
            }

            /// <summary>
            /// 将线路线段路口进行记录
            /// </summary>
            /// <param name="roadSegment"></param>
            /// <param name="operateRoadPercent"></param>
            /// <param name="operateRoadOrder"></param>
            /// <param name="operateRoadCode"></param>
            /// <param name="newOperateT"></param>
            /// <param name="key"></param>
            /// <param name="hasFoundNewElement"></param>
            /// <param name="i"></param>
            /// <param name="cd"></param>
            private void DealWithCross1(RoadInfo roadSegment, double operateRoadPercent, int operateRoadOrder, string operateRoadCode, int newOperateT, string key, ref bool hasFoundNewElement, int i, condition cd)
            {
                DictCross[] selectResult;
                selectResult = (from item in roadSegment.Cross1 where cd(item.Percent1, item.RoadOrder1, operateRoadPercent, operateRoadOrder) && item.CrossState == 1 orderby item.Percent1 ascending select item).ToArray();
                for (var j = 0; j < selectResult.Length; j++)
                {
                    if (selectResult[j].RoadCode1 != operateRoadCode)
                    {
                        throw new Exception("");
                    }
                    else if (selectResult[j].RoadOrder1 != i)
                    {
                        throw new Exception("");
                    }
                    else
                    {
                        var tCost = calTimeCost(operateRoadCode, operateRoadOrder, operateRoadPercent, selectResult[j].RoadCode1, selectResult[j].RoadOrder1, selectResult[j].Percent1);
                        var crossKey = getCrossKey(selectResult[j]);
                        var crossOperateT = tCost + newOperateT;
                        var cross = selectResult[j];
                        if (this.TimeToExpand.ContainsKey(crossKey))
                        {
                            if (crossOperateT < this.TimeToExpand[crossKey])
                            {
                                this.TimeToExpand[crossKey] = crossOperateT;
                                this.LastDirection[crossKey] = key;
                                this.DirectionComeFrom[crossKey] = roadSegment.RoadCode;
                                hasFoundNewElement = true;
                            }
                        }
                        else
                        {
                            this.TimeToExpand.Add(crossKey, crossOperateT);
                            this.LastDirection.Add(crossKey, key);
                            this.CrossRecord.Add(crossKey, cross);
                            this.DirectionComeFrom.Add(crossKey, roadSegment.RoadCode);
                            hasFoundNewElement = true;
                        }
                    }
                }
            }
            /// <summary>
            /// 将线段线路上的路口数据进行记录。
            /// </summary>
            /// <param name="roadSegment"></param>
            /// <param name="operateRoadPercent"></param>
            /// <param name="operateRoadOrder"></param>
            /// <param name="operateRoadCode"></param>
            /// <param name="newOperateT"></param>
            /// <param name="key"></param>
            /// <param name="hasFoundNewElement"></param>
            /// <param name="i"></param>
            /// <param name="cd"></param>
            private void DealWithCross2(RoadInfo roadSegment, double operateRoadPercent, int operateRoadOrder, string operateRoadCode, int newOperateT, string key, ref bool hasFoundNewElement, int i, condition cd)
            {
                DictCross[] selectResult;
                selectResult = (from item in roadSegment.Cross2 where cd(item.Percent2, item.RoadOrder2, operateRoadPercent, operateRoadOrder) && item.CrossState == 1 select item).ToArray();
                for (var j = 0; j < selectResult.Length; j++)
                {
                    if (selectResult[j].RoadCode2 != operateRoadCode)
                    {
                        throw new Exception("");
                    }
                    else if (selectResult[j].RoadOrder2 != i)
                    {
                        throw new Exception("");
                    }
                    else
                    {
                        var tCost = calTimeCost(operateRoadCode, operateRoadOrder, operateRoadPercent, selectResult[j].RoadCode2, selectResult[j].RoadOrder2, selectResult[j].Percent2);
                        var crossKey = getCrossKey(selectResult[j]);
                        var crossOperateT = tCost + newOperateT;
                        var cross = selectResult[j];
                        if (this.TimeToExpand.ContainsKey(crossKey))
                        {
                            if (crossOperateT < this.TimeToExpand[crossKey])
                            {
                                this.TimeToExpand[crossKey] = crossOperateT;
                                this.LastDirection[crossKey] = key;
                                this.DirectionComeFrom[crossKey] = roadSegment.RoadCode;
                                hasFoundNewElement = true;
                            }
                        }
                        else
                        {
                            this.TimeToExpand.Add(crossKey, crossOperateT);
                            this.LastDirection.Add(crossKey, key);
                            this.CrossRecord.Add(crossKey, cross);
                            this.DirectionComeFrom.Add(crossKey, roadSegment.RoadCode);
                            hasFoundNewElement = true;
                        }
                    }
                }
            }


            bool conditionWhenInDirection(double item_RoadPercent, int item_RoadOrder, double operateRoadPercent, int operateRoadOrder)
            {
                return item_RoadOrder + item_RoadPercent > operateRoadPercent + operateRoadOrder;
            }
            bool conditionWhenInOpposeDirection(double item_RoadPercent, int item_RoadOrder, double operateRoadPercent, int operateRoadOrder)
            {
                return item_RoadOrder + item_RoadPercent < operateRoadPercent + operateRoadOrder;
            }

            delegate bool condition(double item_RoadPercent, int item_RoadOrder, double operateRoadPercent, int operateRoadOrder);
            private void dealWithPassShop(RoadInfo roadSegment, double operateRoadPercent, int operateRoadOrder, string operateRoadCode, int newOperateT, string key, ref bool hasFoundNewElement, int i, condition cf)
            {
                FastenPositionCalculate[] passShop;
                {
                    passShop = (from item in roadSegment.PassShop where cf(item.RoadPercent, item.RoadOrder, operateRoadPercent, operateRoadOrder) select item).ToArray();
                    for (var j = 0; j < passShop.Length; j++)
                    {
                        if (passShop[j].RoadCode != operateRoadCode)
                        {
                            throw new Exception("");
                        }
                        if (passShop[j].RoadOrder != i)
                        {
                            throw new Exception("");
                        }
                        else
                        {
                            var tCost = calTimeCost(operateRoadCode, operateRoadOrder, operateRoadPercent, passShop[j].RoadCode, passShop[j].RoadOrder, passShop[j].RoadPercent);

                            var fpKey = passShop[j].FastenPositionID;
                            var fpOperateT = tCost + newOperateT;

                            if (this.TimeToExpand.ContainsKey(fpKey))
                            {
                                if (fpOperateT < this.TimeToExpand[fpKey])
                                {
                                    this.TimeToExpand[fpKey] = fpOperateT;
                                    this.LastDirection[fpKey] = key;
                                    hasFoundNewElement = true;
                                }
                            }
                            else
                            {
                                this.TimeToExpand.Add(fpKey, fpOperateT);
                                this.LastDirection.Add(fpKey, key);
                                hasFoundNewElement = true;
                            }
                        }
                    }

                }
            }

            private void DealWithCross(DictCross[] cross1)
            {
                throw new NotImplementedException();
            }

            private string getCrossKey(DictCross dictCross)
            {
                return dictCross.RoadCode1 + dictCross.RoadOrder1 + dictCross.RoadCode2 + dictCross.RoadOrder2;
            }

            //  private string getCrossKey
            /// <summary>
            /// 计算在一直线线路上的两点距离。
            /// </summary>
            /// <param name="operateRoadCode"></param>
            /// <param name="operateRoadOrder"></param>
            /// <param name="operateRoadPercent"></param>
            /// <param name="roadCode"></param>
            /// <param name="roadOrder"></param>
            /// <param name="percent"></param>
            /// <returns></returns>
            private int calTimeCost(string operateRoadCode, int operateRoadOrder, double operateRoadPercent, string roadCode, int roadOrder, double percent)
            {
                if (operateRoadCode != roadCode)
                {
                    throw new Exception("");
                }
                if (operateRoadOrder + operateRoadPercent < roadOrder + percent)
                {
                    if (operateRoadOrder == roadOrder)
                    {
                        int sumT = 0;

                        double lat1, lon1;
                        getLatAndLon(out lat1, out lon1, operateRoadCode, operateRoadOrder, operateRoadPercent);

                        double lat2, lon2;
                        getLatAndLon(out lat2, out lon2, operateRoadCode, roadOrder, percent);

                        var l = getDistance(lat1, lon1, lat2, lon2);
                        int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][operateRoadOrder].MaxSpeed) * 3600.0 * 1000.0);
                        sumT += TimeSpend;
                        return sumT;
                    }
                    else
                    {
                        int sumT = 0;
                        {
                            double lat1, lon1;
                            getLatAndLon(out lat1, out lon1, operateRoadCode, operateRoadOrder, operateRoadPercent);

                            var lat2 = this.roads[operateRoadCode][operateRoadOrder].endLatitude;
                            var lon2 = this.roads[operateRoadCode][operateRoadOrder].endLongitude;

                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][operateRoadOrder].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }
                        for (var i = operateRoadOrder + 1; i < roadOrder; i++)
                        {
                            var lat1 = this.roads[operateRoadCode][i].startLatitude;
                            var lon1 = this.roads[operateRoadCode][i].startLongitude;

                            var lat2 = this.roads[operateRoadCode][i].endLatitude;
                            var lon2 = this.roads[operateRoadCode][i].endLongitude;
                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][i].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }
                        {
                            var lat1 = this.roads[operateRoadCode][roadOrder].startLatitude;
                            var lon1 = this.roads[operateRoadCode][roadOrder].startLongitude;

                            double lat2, lon2;
                            getLatAndLon(out lat2, out lon2, operateRoadCode, roadOrder, percent);

                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][roadOrder].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }
                        return sumT;
                    }
                }
                else
                {
                    if (operateRoadOrder == roadOrder)
                    {
                        int sumT = 0;

                        double lat1, lon1;
                        getLatAndLon(out lat1, out lon1, operateRoadCode, operateRoadOrder, operateRoadPercent);

                        double lat2, lon2;
                        getLatAndLon(out lat2, out lon2, operateRoadCode, roadOrder, percent);

                        var l = getDistance(lat1, lon1, lat2, lon2);
                        int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][operateRoadOrder].MaxSpeed) * 3600.0 * 1000.0);
                        sumT += TimeSpend;
                        return sumT;
                    }
                    else
                    {
                        int sumT = 0;
                        {
                            double lat1, lon1;
                            getLatAndLon(out lat1, out lon1, operateRoadCode, operateRoadOrder, operateRoadPercent);

                            var lat2 = this.roads[operateRoadCode][operateRoadOrder].startLatitude;
                            var lon2 = this.roads[operateRoadCode][operateRoadOrder].startLongitude;

                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][operateRoadOrder].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }
                        for (var i = operateRoadOrder - 1; i > roadOrder; i--)
                        {
                            var lat1 = this.roads[operateRoadCode][i].startLatitude;
                            var lon1 = this.roads[operateRoadCode][i].startLongitude;

                            var lat2 = this.roads[operateRoadCode][i].endLatitude;
                            var lon2 = this.roads[operateRoadCode][i].endLongitude;
                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][i].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }

                        {
                            var lat1 = this.roads[operateRoadCode][roadOrder].endLatitude;
                            var lon1 = this.roads[operateRoadCode][roadOrder].endLongitude;

                            double lat2, lon2;
                            getLatAndLon(out lat2, out lon2, operateRoadCode, roadOrder, percent);

                            var l = getDistance(lat1, lon1, lat2, lon2);
                            int TimeSpend = Convert.ToInt32((l / 1000.0 / this.roads[operateRoadCode][roadOrder].MaxSpeed) * 3600.0 * 1000.0);
                            sumT += TimeSpend;
                        }
                        return sumT;
                    }
                }
            }

            private void getLatAndLon(out double lat1, out double lon1, string operateRoadCode, int roadOrder, double percent)
            {
                lat1 = this.roads[operateRoadCode][roadOrder].startLatitude + (this.roads[operateRoadCode][roadOrder].endLatitude - this.roads[operateRoadCode][roadOrder].startLatitude) * percent;
                lon1 = this.roads[operateRoadCode][roadOrder].startLongitude + (this.roads[operateRoadCode][roadOrder].endLongitude - this.roads[operateRoadCode][roadOrder].startLongitude) * percent;
            }

            private void CalLengthAndRecord(DictCross dictCross)
            {

                //throw new NotImplementedException();
            }

            internal bool ExistP2P(string fastenPositionID, string placePresentCode)
            {
                throw new Exception("");
                //return CityRunAliyunDAL.CalculateResult.P2p.Exist(this.configItem.versionNumber, fastenPositionID, placePresentCode);
            }

            internal List<nyrqPosition> GetP2p(string fastenPositionID, string placePresentCode)
            {
                throw new Exception("");
                //var json = CityRunAliyunDAL.CalculateResult.P2p.Get(this.configItem.versionNumber, fastenPositionID, placePresentCode);
                //var data = CityRunFunction.JsonConvertf.DeserializeListObject<nyrqPositionm2>(json);

                //List<nyrqPosition> dataResult = new List<nyrqPosition>();
                //for (int i = 0; i < data.Count; i++)
                //{
                //    dataResult.Add(new nyrqPosition(data[i].roadCode, data[i].roadOrder, data[i].percent, data[i].BDlongitude, data[i].BDlatitude, data[i].maxSpeed));
                //}
                //return dataResult;
            }

            internal void SaveP2P(List<nyrqPosition> dataResult, string fastenPositionID, string placePresentCode)
            {

                //List<nyrqPositionm2> d2 = new List<nyrqPositionm2>();
                //for (int i = 0; i < dataResult.Count; i++)
                //{
                //    d2.Add(new nyrqPositionm2()
                //    {
                //        BDlatitude = dataResult[i].BDlatitude,
                //        BDlongitude = dataResult[i].BDlongitude,
                //        maxSpeed = dataResult[i].maxSpeed,
                //        percent = dataResult[i].percent,
                //        roadCode = dataResult[i].roadCode,
                //        roadOrder = dataResult[i].roadOrder
                //    });
                //}
                //var json = CityRunFunction.JsonConvertf.SerializeObject(d2);
                //CityRunAliyunDAL.CalculateResult.P2p.Save(this.configItem.versionNumber, fastenPositionID, placePresentCode, json);
            }
        }
    }
}
