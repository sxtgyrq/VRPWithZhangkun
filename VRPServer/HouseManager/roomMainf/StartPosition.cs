using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {
        /// <summary>
        /// 获取从基地出来时的路径！
        /// </summary>
        /// <param name="fp">初始地点</param>
        /// <param name="car">carA？-carE</param>
        /// <param name="startTInput">时间</param>
        /// <returns></returns>
        private List<Data.PathResult> getStartPositon(Model.FastonPosition fp, string car, ref int startTInput)
        {
            double startX, startY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.Longitude, fp.Latitde, out startX, out startY);
            int startT0, startT1;

            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out endX, out endY);
            int endT0, endT1;

            //这里要考虑前台坐标系（左手坐标系）。
            var cc = new Complex(endX - startX, (-endY) - (-startY));

            cc = ToOne(cc);

            var positon1 = cc * (new Complex(-0.309016994, 0.951056516));
            var positon2 = positon1 * (new Complex(0.809016994, 0.587785252));
            var positon3 = positon2 * (new Complex(0.809016994, 0.587785252));
            var positon4 = positon3 * (new Complex(0.809016994, 0.587785252));
            var positon5 = positon4 * (new Complex(0.809016994, 0.587785252));
            Complex position;
            switch (car)
            {
                case "carA":
                    {
                        position = positon1;
                    }; break;
                case "carB":
                    {
                        position = positon2;
                    }; break;
                case "carC":
                    {
                        position = positon3;
                    }; break;
                case "carD":
                    {
                        position = positon4;
                    }; break;
                case "carE":
                    {
                        position = positon5;
                    }; break;
                default:
                    {
                        position = positon1;
                    }; break;
            }
            var percentOfPosition = 0.25;
            double carPositionX = startX + position.Real * percentOfPosition;
            double carPositionY = startY - position.Imaginary * percentOfPosition;

            List<Data.PathResult> animateResult = new List<Data.PathResult>();
            startT0 = startTInput;
            endT0 = startT0 + 500;
            startTInput += 500;
            var animate1 = new Data.PathResult()
            {
                t0 = startT0,
                x0 = carPositionX,
                y0 = carPositionY,
                t1 = endT0,
                x1 = startX,
                y1 = startY
            };
            animateResult.Add(animate1);
            /*
             * 上道路的速度为10m/s 即36km/h
             */
            var interview = Convert.ToInt32(CommonClass.Geography.getLengthOfTwoPoint.GetDistance(fp.Latitde, fp.Longitude, fp.positionLatitudeOnRoad, fp.positionLongitudeOnRoad) / 10 * 1000);
            startT1 = startTInput;
            endT1 = startT1 + interview;
            startTInput += interview;
            var animate2 = new Data.PathResult()
            {
                t0 = startT1,
                x0 = startX,
                y0 = startY,
                t1 = endT1,
                x1 = endX,
                y1 = endY
            };
            animateResult.Add(animate2);
            return animateResult;
        }

    }
}
