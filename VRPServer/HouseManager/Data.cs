using System;
using System.Collections.Generic;
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
        string rewardRecord = "";

        public string IP { get; private set; }

        public void LoadRoad()
        {

            //string configStr;
            //configStr = "jsconfig1";
            //if (select.ToUpper().Trim() == "DEBUG")
            //{
            //    configStr = "jsconfig1";
            //}
            //else
            //{
            //    configStr = "jsconfig2";
            //}
            //  var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile($"{configStr}.json");
            //var config = builder.Build();
            //Console.WriteLine($"{config["roadPath"]}");
            var d = System.IO.Directory.GetCurrentDirectory();
            Console.WriteLine(d);
            //var roadPath = config["roadPath"];

            //var fpDictionary = config["fpDictionary"];

            //this.rewardRecord = config["rewardRecord"];
            //this.IP = config["ip"];

            //string json;
            //using (StreamReader sr = new StreamReader(roadPath))
            //{
            //    // Read the stream to a string, and write the string to the console.
            //    json = sr.ReadToEnd();
            //}

            //this._road = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>>>(json);

            //this._allFp = GetAllFp(fpDictionary);

            //Console.WriteLine($"{this._road.Count}_{this._allFp.Count}");
        }

        static List<OssModel.FastonPosition> GetAllFp(string fpDictionary)
        {
            throw new Exception("");
            ////var fpConfig = Config.map.getFastonPositionConfigInfo(city, false);
            //List<OssModel.FastonPosition> result = new List<OssModel.FastonPosition>();
            //var index = 0;
            //while (File.Exists($"{fpDictionary}fpindex\\fp_{index }.txt"))
            //{
            //    var json = File.ReadAllText($"{fpDictionary}fpindex\\fp_{index }.txt");
            //    var item = Newtonsoft.Json.JsonConvert.DeserializeObject<OssModel.FastonPosition>(json);
            //    result.Add(item);
            //    index++;
            //}
            //return result;
            ////var index = 0;
            ////var path = string.Format("{0}/{1}.txt", fpConfig.versionNumber, "allfastonpositions");
            ////if (mainConfig.Exist(key))
            ////{
            ////    var json = mainConfig.GetStringBuilder(key).ToString();
            ////    return CityRunFunction.JsonConvertf.DeserializeListObject<CityRunModel.OssModel.FastonPosition>(json);
            ////}
            ////else
            ////{
            ////    return new List<CityRunModel.OssModel.FastonPosition>();
            ////}
        }

        internal void GetData(out Dictionary<string, Dictionary<int, OssModel.SaveRoad.RoadInfo>> result)
        {
            result = this._road;
        }

        internal int Get61Fp()
        {

            return this._allFp.Count;
            //var rm
            //List<int> result = new List<int>();
            //int sum = 61;
            //for (int i = 0; i < sum; i++) 
            //{
            //   var v=
            //}

        }



        internal OssModel.FastonPosition GetFpByIndex(int indexValule)
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







        internal string GetAFromB(string fpID1, string fpID2)
        {
            throw new Exception("");
            //// var dt1 = DateTime.Now;
            //DataToNavigateWithTimeFunction2 data = new DataToNavigateWithTimeFunction2();
            //data.ReadRoadInfo(this._road, this._allFp);
            //bool findObjSuccess;
            //var dataResult = data.FindPlace(this._allFp.FindLast(item => item.FastenPositionID == fpID1), fpID2, out findObjSuccess);
            //var json = Newtonsoft.Json.JsonConvert.SerializeObject(dataResult);
            //// Console.WriteLine(json);
            //// var dt2 = DateTime.Now;
            ////Console.WriteLine($"计算时间{(dt2 - dt1).TotalSeconds}");
            //return json;
        }


    }
}
