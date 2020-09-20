using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class MapGo
    {
        public class nyrqPosition
        {
            public nyrqPosition(string rc, int rorder, double percent_, double BDlongitude_, double BDlatitude_, int maxSpeed_)
            {
                this.roadCode = rc;
                this.roadOrder = rorder;
                this.percent = percent_;
                this.BDlongitude = BDlongitude_;
                this.BDlatitude = BDlatitude_;
                this.maxSpeed = maxSpeed_;
            }
            public string roadCode { get; private set; }
            public int roadOrder { get; private set; }
            public double percent { get; private set; }
            public double BDlongitude { get; private set; }
            public double BDlatitude { get; private set; }
            public int maxSpeed { get; private set; }

            public nyrqPosition copy()
            {
                return new nyrqPosition(this.roadCode, this.roadOrder, this.percent, this.BDlongitude, this.BDlatitude, this.maxSpeed);
            }
            public override bool Equals(object obj)
            {
                if (obj.GetType() == typeof(nyrqPosition))
                {
                    return ((nyrqPosition)obj).roadCode.Trim() == this.roadCode.Trim() && ((nyrqPosition)obj).roadOrder == this.roadOrder && ((nyrqPosition)obj).percent == this.percent;
                }
                else return false;
            }
            public override int GetHashCode()
            {
                int hash = 23;
                hash = (hash * 17) + this.roadCode.GetHashCode();
                hash = (hash * 17) + this.roadOrder.GetHashCode();
                hash = (hash * 17) + this.percent.GetHashCode();
                return hash;
            }
        }
    }
}
