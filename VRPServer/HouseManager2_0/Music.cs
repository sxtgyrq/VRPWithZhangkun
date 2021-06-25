using Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0
{
    public class Music
    {
        public Music() { }

        // public delegate void MusicChanged(string priceType, long value);
         

        internal string getByRegion(string region)
        {
            switch (region)
            {
                case "榆次区": { return "yuci"; };
                case "迎泽区": { return "yingze"; };
                case "阳曲县": { return "yangqu"; };
                case "杏花岭区": { return "xinghualing"; };
                case "小店区": { return "xiaodian"; };
                case "万柏林区": { return "wanbailin"; };
                case "太谷区": { return "taigu"; };
                case "寿阳县": { return ""; };
                case "清徐县": { return "qingxu"; };
                case "祁县": { return "qixian"; };
                case "晋源区": { return "jinyuan"; };
                case "交城县": { return "jiaocheng"; };
                case "尖草坪区": { return "dayanta"; };
                case "古交市": { return "piantouqu"; };
                default:
                    {
                        return "";
                    }
            }
        }
    }
}
