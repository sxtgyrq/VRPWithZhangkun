using System;
using System.Collections.Generic;
using System.Text;

namespace CityRunFunction.Geography
{
    public class getLengthOfTwoPoint
    {
        private const double EARTH_RADIUS = 6371393;
        private static double rad(double d)
        {
            return d * Math.PI / 180.0;
        }
        /// <summary>
        /// 获取两点的距离，单位为米
        /// </summary>
        /// <param name="lat1">第一位置的纬度</param>
        /// <param name="lng1">第一位置的经度</param>
        /// <param name="lat2">第二位置的纬度</param>
        /// <param name="lng2">第二位置的经度</param>
        /// <returns></returns>
        public static double GetDistance(double lat1, double lng1, double lat2, double lng2)
        {
            double radLat1 = rad(lat1);
            double radLat2 = rad(lat2);
            double a = radLat1 - radLat2;
            double b = rad(lng1) - rad(lng2);

            double s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
             Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
            s = s * EARTH_RADIUS;
            return s;
        }
    }
}
