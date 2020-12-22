using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using OssModel = Model;
namespace HouseManager
{
    public class Data
    {
        /// <summary>
        /// all road infomation
        /// </summary>
        Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> _road;

        /// <summary>
        /// all shop infomation
        /// </summary>
        List<OssModel.FastonPosition> _allFp;
        // string rewardRecord = "";

        public string IP { get; private set; }

        public void LoadRoad()
        {
            var rootPath = System.IO.Directory.GetCurrentDirectory();
            Console.WriteLine($"path:{rootPath}");
            var roadPath = $"{rootPath}\\DBPublish\\allroaddata.txt";

            // "fpDictionary": "F:\\MyProject\\VRPWithZhangkun\\MainApp\\DBPublish\\",
            var fpDictionary = $"{rootPath}\\DBPublish\\";

            string json;
            using (StreamReader sr = new StreamReader(roadPath))
            {
                json = sr.ReadToEnd();
            }

            this._road = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>>>(json);

            this._allFp = GetAllFp(fpDictionary);

            Console.WriteLine($"{this._road.Count}_{this._allFp.Count}");
        }

        static List<OssModel.FastonPosition> GetAllFp(string fpDictionary)
        {
            //  throw new Exception("");
            ////var fpConfig = Config.map.getFastonPositionConfigInfo(city, false);
            List<OssModel.FastonPosition> result = new List<OssModel.FastonPosition>();
            var index = 0;
            while (File.Exists($"{fpDictionary}fpindex\\fp_{index }.txt"))
            {
                var json = File.ReadAllText($"{fpDictionary}fpindex\\fp_{index }.txt");
                var item = Newtonsoft.Json.JsonConvert.DeserializeObject<OssModel.FastonPosition>(json);
                result.Add(item);
                index++;
            }
            return result;
        }

        internal void GetData(out Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> result)
        {
            result = this._road;
        }

        public int Get61Fp()
        {

            return this._allFp.Count;

        }



        public OssModel.FastonPosition GetFpByIndex(int indexValule)
        {

            if (indexValule >= this._allFp.Count || indexValule < 0)
            {
                return null;
            }
            var fp = this._allFp[indexValule];
            return fp;
        }

        public int getCarInOpposeDirection(string roadCode)
        {
            if (this._road.ContainsKey(roadCode)) if (this._road[roadCode].ContainsKey(0)) return this._road[roadCode][0].CarInOpposeDirection;
            return -1;
        }

        internal int GetFpCount()
        {
            return this._allFp.Count;
        }

        public decimal getCurrentTimeCostOfEveryStep()
        {
            throw new Exception("");
            //var now = DateTime.Now;
            //var pathCostNow = $"{this.rewardRecord}{now.ToString("yyyyMMddHH")}Cost.txt";
            //if (File.Exists(pathCostNow))
            //{
            //    var stringValue = File.ReadAllText(pathCostNow);
            //    var result = Convert.ToDecimal(stringValue);
            //    if (result <= 0.01m)
            //    {
            //        return 0.01m;
            //    }
            //    else
            //    {
            //        return Math.Round(result, 2);
            //        //return result;
            //    }
            //}
            //else
            //{
            //    decimal sumRecord = 0m;
            //    decimal lastCost = 0.01m;
            //    bool getCostFromRecod = false;
            //    decimal cost;
            //    for (int i = 1; i <= 8; i++)
            //    {
            //        var timeNode = now.AddHours(-i);
            //        if (!getCostFromRecod)
            //        {
            //            var pathBeforeOfCost = $"{this.rewardRecord}{timeNode.ToString("yyyyMMddHH")}Cost.txt";
            //            if (File.Exists(pathBeforeOfCost))
            //            {
            //                getCostFromRecod = true;
            //                var stringValue = File.ReadAllText(pathBeforeOfCost);

            //                lastCost = Convert.ToDecimal(stringValue);
            //                lastCost = Math.Max(0.01m, lastCost);
            //            }
            //        }

            //        var pathBeforeOfReward = $"{this.rewardRecord}{timeNode.ToString("yyyyMMddHH")}Reward.txt";
            //        if (File.Exists(pathBeforeOfReward))
            //        {
            //            var stringValue = File.ReadAllText(pathBeforeOfReward);
            //            sumRecord += Convert.ToDecimal(stringValue);
            //        }
            //        //var path=""
            //    }
            //    if (sumRecord >= 60 * 8)
            //    {
            //        if (lastCost < 0.1m)
            //        {
            //            cost = lastCost * 2m;
            //        }
            //        else
            //        {
            //            cost = lastCost * 1.1m;
            //        }
            //    }
            //    else
            //    {
            //        if (lastCost < 0.1m)
            //        {
            //            cost = lastCost / 2m;
            //        }
            //        else
            //        {
            //            cost = lastCost / 1.1m;
            //        }
            //    }
            //    {
            //        cost = Math.Round(cost, 2);
            //        cost = Math.Max(0.01m, cost);
            //        var stringValue = cost.ToString();
            //        File.WriteAllText(pathCostNow, stringValue);
            //    }
            //    return getCurrentTimeCostOfEveryStep();
            //}
        }



        public List<OssModel.MapGo.nyrqPosition> GetAFromB(OssModel.FastonPosition fpStart, string fpID2, out bool sucess)
        {
            //  throw new Exception("");
            // var dt1 = DateTime.Now;
            FindF.DataToNavigateWithTimeFunction2 data = new FindF.DataToNavigateWithTimeFunction2();
            data.ReadRoadInfo(this._road, this._allFp);
            // bool findObjSuccess;
            var dataResult = data.FindPlace(fpStart, fpID2, out sucess);
            return dataResult;
            //var json = Newtonsoft.Json.JsonConvert.SerializeObject(dataResult);
            //// Console.WriteLine(json);
            //// var dt2 = DateTime.Now;
            ////Console.WriteLine($"计算时间{(dt2 - dt1).TotalSeconds}");
            //return json;
        }



        public List<OssModel.MapGo.nyrqPosition> GetAFromB(OssModel.FastonPosition fpStart, string fpID2)
        {
            //  throw new Exception("");
            // var dt1 = DateTime.Now;
            FindF.DataToNavigateWithTimeFunction2 data = new FindF.DataToNavigateWithTimeFunction2();
            data.ReadRoadInfo(this._road, this._allFp);
            // bool findObjSuccess;
            var dataResult = data.FindPlace(fpStart, fpID2);
            return dataResult;
            //var json = Newtonsoft.Json.JsonConvert.SerializeObject(dataResult);
            //// Console.WriteLine(json);
            //// var dt2 = DateTime.Now;
            ////Console.WriteLine($"计算时间{(dt2 - dt1).TotalSeconds}");
            //return json;
        }
        public class PathResult
        {
            public double x0 { get; set; }
            public double y0 { get; set; }
            public int t0 { get; set; }

            public double x1 { get; set; }
            public double y1 { get; set; }
            public int t1 { get; set; }
        }

        /// <summary>
        /// 获取路径
        /// </summary>
        /// <param name="dataResult">路径</param>
        /// <param name="fpLast">起始点</param>
        /// <param name="speed">速度</param>
        /// <param name="result">ref path的结果。</param>
        /// <param name="startT">ref 时间结果</param>
        internal void GetAFromBPoint(List<OssModel.MapGo.nyrqPosition> dataResult, OssModel.FastonPosition fpLast, int speed, ref List<PathResult> result, ref int startT)
        {
            for (var i = 0; i < dataResult.Count; i++)
            {
                if (i == 0)
                {
                    //var startX = result.Last().x1;
                    //var startY = result.Last().y1;
                    double startX, startY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fpLast.positionLongitudeOnRoad, fpLast.positionLatitudeOnRoad, out startX, out startY);

                    //var length=

                    double endX, endY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i].BDlongitude, dataResult[i].BDlatitude, out endX, out endY);
                    //  var interview =
                    var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(fpLast.positionLatitudeOnRoad, fpLast.positionLongitudeOnRoad, dataResult[i].BDlatitude, dataResult[i].BDlongitude) / dataResult[i].maxSpeed * 3.6 / 20 * 1000 * 50 / speed);
                    var animate1 = new Data.PathResult()
                    {
                        t0 = startT + 0,
                        x0 = startX,
                        y0 = startY,
                        t1 = startT + interview,
                        x1 = endX,
                        y1 = endY
                    };
                    startT += interview;
                    result.Add(animate1);
                }
                else if (dataResult[i].roadCode == dataResult[i - 1].roadCode)
                {

                    double startX, startY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i - 1].BDlongitude, dataResult[i - 1].BDlatitude, out startX, out startY);

                    double endX, endY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i].BDlongitude, dataResult[i].BDlatitude, out endX, out endY);

                    // var length = CommonClass.Geography.getLengthOfTwoPoint.
                    //  var interview =
                    var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(dataResult[i - 1].BDlatitude, dataResult[i - 1].BDlongitude, dataResult[i].BDlatitude, dataResult[i].BDlongitude) / dataResult[i].maxSpeed * 3.6 / 20 * 1000 * 50 / speed);
                    var animate1 = new Data.PathResult()
                    {
                        t0 = startT + 0,
                        x0 = startX,
                        y0 = startY,
                        t1 = startT + interview,
                        x1 = endX,
                        y1 = endY
                    };
                    startT += interview;
                    result.Add(animate1);
                }
            }
        }
        internal void GetAFromBPoint(string fpID1, string fpID2, int speed, ref List<PathResult> result, ref int startT)
        {
            //throw new Exception("");
            // var dt1 = DateTime.Now;
            FindF.DataToNavigateWithTimeFunction2 data = new FindF.DataToNavigateWithTimeFunction2();
            data.ReadRoadInfo(this._road, this._allFp);
            bool findObjSuccess;
            OssModel.FastonPosition fpLast = this._allFp.FindLast(item => item.FastenPositionID == fpID1);
            var dataResult = data.FindPlace(fpLast, fpID2, out findObjSuccess);

            //   List<PathResult> animateResult = new List<PathResult>();
            //    double sumCostTime = 0;
            for (var i = 0; i < dataResult.Count; i++)
            {
                if (i == 0)
                {
                    //var startX = result.Last().x1;
                    //var startY = result.Last().y1;
                    double startX, startY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fpLast.positionLongitudeOnRoad, fpLast.positionLatitudeOnRoad, out startX, out startY);

                    //var length=

                    double endX, endY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i].BDlongitude, dataResult[i].BDlatitude, out endX, out endY);
                    //  var interview =
                    var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(fpLast.positionLatitudeOnRoad, fpLast.positionLongitudeOnRoad, dataResult[i].BDlatitude, dataResult[i].BDlongitude) / dataResult[i].maxSpeed * 3.6 / 20 * 1000 * 50 / speed);
                    var animate1 = new Data.PathResult()
                    {
                        t0 = startT + 0,
                        x0 = startX,
                        y0 = startY,
                        t1 = startT + interview,
                        x1 = endX,
                        y1 = endY
                    };
                    startT += interview;
                    result.Add(animate1);
                }
                else if (dataResult[i].roadCode == dataResult[i - 1].roadCode)
                {

                    double startX, startY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i - 1].BDlongitude, dataResult[i - 1].BDlatitude, out startX, out startY);

                    double endX, endY;
                    CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(dataResult[i].BDlongitude, dataResult[i].BDlatitude, out endX, out endY);

                    // var length = CommonClass.Geography.getLengthOfTwoPoint.
                    //  var interview =
                    var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(dataResult[i - 1].BDlatitude, dataResult[i - 1].BDlongitude, dataResult[i].BDlatitude, dataResult[i].BDlongitude) / dataResult[i].maxSpeed * 3.6 / 20 * 1000 * 50 / speed);
                    var animate1 = new Data.PathResult()
                    {
                        t0 = startT + 0,
                        x0 = startX,
                        y0 = startY,
                        t1 = startT + interview,
                        x1 = endX,
                        y1 = endY
                    };
                    startT += interview;
                    result.Add(animate1);
                }
            }
        }



        public void getAll(out List<double[]> meshPoints, out List<object> listOfCrosses)
        {
            Dictionary<string, bool> Cs = new Dictionary<string, bool>();
            listOfCrosses = new List<object>();
            Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> result;

            Program.dt.GetData(out result);
            meshPoints = new List<double[]>();
            //        //   List<int> colors = new List<int>();
            foreach (var item in result)
            {
                foreach (var itemj in item.Value)
                {
                    var value = itemj.Value;
                    var ps = getRoadRectangle(value, item.Value);
                    meshPoints.Add(ps);


                    for (var i = 0; i < value.Cross1.Length; i++)
                    {
                        var cross = value.Cross1[i];
                        var key = cross.RoadCode1.CompareTo(cross.RoadCode2) > 0 ?
                            $"{cross.RoadCode1}_{cross.RoadOrder1}_{cross.RoadCode2}_{cross.RoadOrder2}" :
                            $"{cross.RoadCode2}_{cross.RoadOrder2}_{cross.RoadCode1}_{cross.RoadOrder1}";
                        if (Cs.ContainsKey(key)) { }
                        else
                        {
                            Cs.Add(key, false);
                            listOfCrosses.Add(new { lon = cross.BDLongitude, lat = cross.BDLatitude, state = cross.CrossState });
                        }
                    }
                }
            }
        }

        const double roadZoomValue = 0.0000003;
        private static double[] getRoadRectangle(OssModel.SaveRoad.RoadInfo value, Dictionary<int, OssModel.SaveRoad.RoadInfo> result)
        {
            double KofPointStretchFirstAndSecond = 1;
            double KofPointStretchThirdAndFourth = 1;
            if (value.CarInOpposeDirection == 0)
            {
                KofPointStretchFirstAndSecond = 0.1;
                KofPointStretchThirdAndFourth = 1.5;
            }

            double[] point1, point2, point3, point4;
            var vec = new double[] { value.endLongitude - value.startLongitude, value.endLatitude - value.startLatitude };
            vec = setToOne(vec);
            System.Numerics.Complex c = new System.Numerics.Complex(vec[0], vec[1]);
            if (!result.ContainsKey(value.RoadOrder - 1))
            {
                var c2 = new System.Numerics.Complex(0, 1);
                var c3 = c * c2;

                point1 = new double[] {
                    value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond
                    };
                var c5 = c / c2;
                point2 = new double[] {
                    value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };

            }
            else
            {
                var valueP = result[value.RoadOrder - 1];//previows
                var vecP = new double[] { valueP.endLongitude - valueP.startLongitude, valueP.endLatitude - valueP.startLatitude };
                vecP = setToOne(vecP);
                System.Numerics.Complex cP = new System.Numerics.Complex(-vecP[0], -vecP[1]);
                var vecDiv2 = c + cP;
                {
                    if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
                    {
                        var c2 = new System.Numerics.Complex(0, 1);
                        var c3 = c * c2;
                        point1 = new double[] {
                    value.startLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond  };
                        var c5 = c / c2;
                        point2 = new double[] {
                    value.startLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond };
                    }
                    else
                    {
                        var k = 1 / (vecDiv2 / c).Imaginary;
                        var s = Math.Sqrt(k * k + 1 / k / k);

                        {
                            var vecDivOperate = s / k * setToOne(vecDiv2);
                            point1 = new double[] {
                    value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                    value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchFirstAndSecond };
                        }
                        {
                            var vecDiv2_opp_diretion = -1 * (vecDiv2);
                            var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
                            point2 = new double[] {
                            value.startLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchFirstAndSecond,
                            value.startLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue *KofPointStretchFirstAndSecond };
                        }
                    }
                }
            }
            c = new System.Numerics.Complex(-vec[0], -vec[1]);
            if (!result.ContainsKey(value.RoadOrder + 1))
            {
                var c2 = new System.Numerics.Complex(0, 1);
                var c3 = c * c2;
                point3 = new double[] {
                    value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
                };
                var c5 = c / c2;
                point4 = new double[] {
                    value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth
                };
            }
            else
            {
                var valueN = result[value.RoadOrder + 1];//next
                var vecN = new double[] {
                    valueN.endLongitude - valueN.startLongitude,
                    valueN.endLatitude - valueN.startLatitude
                };
                vecN = setToOne(vecN);
                System.Numerics.Complex cP = new System.Numerics.Complex(vecN[0], vecN[1]);
                var vecDiv2 = c + cP;
                if (Math.Abs((vecDiv2 / c).Imaginary) < 1e-6)
                {
                    var c2 = new System.Numerics.Complex(0, 1);
                    var c3 = c * c2;
                    point3 = new double[] {
                    value.endLongitude + c3.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c3.Imaginary * value.MaxSpeed * roadZoomValue  *KofPointStretchThirdAndFourth};
                    var c5 = c / c2;
                    point4 = new double[] {
                    value.endLongitude + c5.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                    value.endLatitude + c5.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth };
                }
                else
                {
                    var k = 1 / (vecDiv2 / c).Imaginary;
                    var s = Math.Sqrt(k * k + 1 / k / k);
                    {

                        var vecDivOperate = s / k * setToOne(vecDiv2);
                        point3 = new double[] {
                            value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                            value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
                    }
                    {
                        var vecDiv2_opp_diretion = -1 * vecDiv2;
                        var vecDivOperate = s / k * setToOne(vecDiv2_opp_diretion);
                        point4 = new double[] {
                            value.endLongitude + vecDivOperate.Real * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth,
                            value.endLatitude + vecDivOperate.Imaginary * value.MaxSpeed * roadZoomValue*KofPointStretchThirdAndFourth  };
                    }
                }


            }
            return new double[]
            {
              Math.Round(  point1[0],9),Math.Round(point1[1],9),
             Math.Round(   point2[0],9),Math.Round(point2[1],9),
             Math.Round(   point3[0],9),Math.Round(point3[1],9),
             Math.Round(   point4[0],9),Math.Round(point4[1],9)
            };
        }

        private static System.Numerics.Complex setToOne(System.Numerics.Complex vecRes)
        {
            var data = setToOne(new double[] { vecRes.Real, vecRes.Imaginary });
            return new System.Numerics.Complex(data[0], data[1]);
        }

        private static double[] setToOne(double[] vec)
        {
            var l = Math.Sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
            return new double[] { vec[0] / l, vec[1] / l };
        }
    }
}
