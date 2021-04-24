using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;
using OssModel = Model;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        private List<OssModel.MapGo.nyrqPosition> GetAFromB(int from, int to, Player player, ref List<string> notifyMsgs)
        {
            var path = Program.dt.GetAFromB(from, to);
            for (var i = 0; i < path.Count; i++)
            {
                player.addUsedRoad(path[i].roadCode, ref notifyMsgs);
            }
            return path;
        }
        private void getEndPositon(Model.FastonPosition fp, int initPosition, ref List<Data.PathResult> animateResult, ref int startTInput)
        {
            double endX, endY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.Longitude, fp.Latitde, out endX, out endY);
            int startT0, startT1;

            double startX, startY;
            CommonClass.Geography.calculatBaideMercatorIndex.getBaiduPicIndex(fp.positionLongitudeOnRoad, fp.positionLatitudeOnRoad, out startX, out startY);
            int endT0, endT1;

            //这里要考虑前台坐标系（左手坐标系）。
            var cc = new Complex(startX - endX, (-startY) - (-endY));

            cc = ToOne(cc);

            var positon1 = cc * (new Complex(-0.309016994, 0.951056516));
            var positon2 = positon1 * (new Complex(0.809016994, 0.587785252));
            var positon3 = positon2 * (new Complex(0.809016994, 0.587785252));
            var positon4 = positon3 * (new Complex(0.809016994, 0.587785252));
            var positon5 = positon4 * (new Complex(0.809016994, 0.587785252));
            Complex position;
            switch (initPosition)
            {
                case 0:
                    {
                        position = positon1;
                    }; break;
                case 1:
                    {
                        position = positon2;
                    }; break;
                case 2:
                    {
                        position = positon3;
                    }; break;
                case 3:
                    {
                        position = positon4;
                    }; break;
                case 4:
                    {
                        position = positon5;
                    }; break;
                default:
                    {
                        position = positon1;
                    }; break;
            }
            var percentOfPosition = 0.25;
            double carPositionX = endX + position.Real * percentOfPosition;
            double carPositionY = endY - position.Imaginary * percentOfPosition;


            /*
             * 这里由于是返程，为了与getStartPositon 中的命名保持一致性，（位置上）end实际为start,时间上还保持一致
             */
            //  List<Data.PathResult> animateResult = new List<Data.PathResult>();

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


            startT0 = startTInput;
            endT0 = startT0 + 500;
            startTInput += 500;
            var animate1 = new Data.PathResult()
            {
                t0 = startT0,
                x0 = endX,
                y0 = endY,
                t1 = endT0,
                x1 = carPositionX,
                y1 = carPositionY
            };
            animateResult.Add(animate1);

        }
    }
}
