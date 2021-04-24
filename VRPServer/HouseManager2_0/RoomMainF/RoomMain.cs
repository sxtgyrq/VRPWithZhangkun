using CommonClass;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;
using static HouseManager2_0.Car;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        bool debug = true;
        System.Random rm { get; set; }
        public RoomMain()
        {
            this.rm = new System.Random(DateTime.Now.GetHashCode());
            this.Market = new Market(this.priceChanged);
            lock (PlayerLock)
            {
                this._Players = new Dictionary<string, Player>();
                //    this._FpOwner = new Dictionary<int, string>();
                //this._PlayerFp = new Dictionary<string, int>();
            }
            LookFor();
            this.recordOfPromote = new Dictionary<string, List<DateTime>>()
            {
                {  "mile" ,new List<DateTime>()},
                {  "business" ,new List<DateTime>() },
                {  "volume" ,new List<DateTime>() },
                {  "speed" ,new List<DateTime>() },
            };
            this.promotePrice = new Dictionary<string, long>()
            {
                {  "mile" ,10 * 100},
                {  "business" ,10 * 100 },
                {  "volume" ,10 * 100 },
                {  "speed" ,10 * 100},
            };
        }



        private async void priceChanged(string priceType, long value)
        {
            List<string> msgs = new List<string>();
            lock (this.PlayerLock)
            {
                foreach (var item in this._Players)
                {
                    var player = item.Value;
                    var obj = new BradDiamondPrice
                    {
                        c = "BradDiamondPrice",
                        WebSocketID = player.WebSocketID,
                        priceType = priceType,
                        price = value
                    };
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    msgs.Add(player.FromUrl);
                    msgs.Add(json);
                }
            }
            for (var i = 0; i < msgs.Count; i += 2)
            {
                await Startup.sendMsg(msgs[i], msgs[i + 1]);
            }
        }
        object PlayerLock = new object();

        /// <summary>
        /// 单位是km
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        private int GetMile(List<Model.MapGo.nyrqPosition> path)
        {
            double sumMiles = 0;
            for (var i = 1; i < path.Count; i++)
            {
                sumMiles += CommonClass.Geography.getLengthOfTwoPoint.GetDistance(path[i].BDlatitude, path[i].BDlongitude, path[i - 1].BDlatitude, path[i - 1].BDlongitude);
            }
            return Convert.ToInt32(sumMiles) / 1000;
        }

        class commandWithTime
        {
            abstract public class baseC
            {
                public string c { get; set; }
                public string key { get; set; }
                //public string car { get; set; }
            }
            public class returnning : baseC
            {


                internal List<Model.MapGo.nyrqPosition> returnPath { get; set; }
                /// <summary>
                /// 返回路程的起点
                /// </summary>
                internal int target { get; set; }

                /// <summary>
                /// 取值如mile
                /// </summary>
                public string changeType { get; internal set; }
            }

            public class diamondOwner : returnning
            {
                public int costMile { get; internal set; }
            }

            public class debtOwner : returnning
            {
                //  public int costMile { get; internal set; }
                public string victim { get; internal set; }
            }
            public class bustSet : returnning
            {
                //  public int costMile { get; internal set; }
                public string victim { get; internal set; }
            }

            public class placeArriving : baseC
            {
                public int costMile { get; set; }
                internal int target { get; set; }

                internal List<Model.MapGo.nyrqPosition> returnPath { get; set; }
                //internal int target { get; set; }

                ///// <summary>
                ///// 取值如mile
                ///// </summary>
                //public string changeType { get; internal set; }
            }

            public class comeBack : baseC
            {

            }
        }

        private Complex ToOne(Complex cc)
        {
            var m = Math.Sqrt(cc.Real * cc.Real + cc.Imaginary * cc.Imaginary);
            return new Complex(cc.Real / m, cc.Imaginary / m);
        }

        /// <summary>
        /// 当没有抢到宝石-或者收集、保护费，在路上待命。
        /// </summary>
        /// <param name="target"></param>
        /// <param name="car"></param>
        private void carParkOnRoad(int target, ref Car car, Player player, ref List<string> notifyMsgs)
        {
            var fp = Program.dt.GetFpByIndex(target);
            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out endX, out endY);

            var animate = new AnimateData()
            {
                animateData = new List<Data.PathResult>()
                        {
                              new Data.PathResult()
                              {
                                  t0=0,
                                  x0=endX,
                                  y0=endY,
                                  t1=200000,
                                  x1=endX,
                                  y1=endY
                              }
                        },
                recordTime = DateTime.Now
            };
            car.setAnimateData(player, ref notifyMsgs, animate);
            //car.animateData = new AnimateData()
            //{
            //    animateData = new List<Data.PathResult>()
            //            {
            //                  new Data.PathResult()
            //                  {
            //                      t0=0,
            //                      x0=endX,
            //                      y0=endY,
            //                      t1=200000,
            //                      x1=endX,
            //                      y1=endY
            //                  }
            //            },
            //    recordTime = DateTime.Now
            //};

            if (this.debug)
            {
                //var goPath = Program.dt.GetAFromB(car.targetFpIndex, this.collectPosition);
                //var returnPath = Program.dt.GetAFromB(this.collectPosition, player.StartFPIndex);

                //var goMile = GetMile(goPath);
                //var returnMile = GetMile(returnPath);
                //if (goMile + returnMile > car.ability.leftMile) 
                //{
                //    for (int i = 0; i < 3; i++) 
                //    {
                //        Console.WriteLine($"现在回收是要返回的！");
                //    }
                //}
            }
        }
        //public int GetFrequency()
        //{
        //    return this.frequency;
        //}

    }
}
