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
            public nyrqPosition_Simple ToSimple()
            {
                return new nyrqPosition_Simple(this.roadCode, this.roadOrder, this.percent, this.BDlongitude, this.BDlatitude, this.maxSpeed);
            }
        }

        public class nyrqPosition_Simple
        {
            public nyrqPosition_Simple(string rc, int rorder, double percent_, double BDlongitude_, double BDlatitude_, int maxSpeed_)
            {
                this.r = rc;
                this.o = rorder;
                this.p = Math.Round(percent_, 6);
                this.g = Math.Round(BDlongitude_, 8);
                this.t = Math.Round(BDlatitude_, 8);
                this.s = maxSpeed_;
            }
            public string r { get; private set; }
            public int o { get; private set; }
            public double p { get; private set; }
            public double g { get; private set; }
            public double t { get; private set; }
            public int s { get; private set; }

            public nyrqPosition copy()
            {
                return new nyrqPosition(this.r, this.o, this.p, this.g, this.t, this.s);
            }
            public override bool Equals(object obj)
            {
                if (obj.GetType() == typeof(nyrqPosition))
                {
                    return ((nyrqPosition)obj).roadCode.Trim() == this.r.Trim() && ((nyrqPosition)obj).roadOrder == this.o && ((nyrqPosition)obj).percent == this.p;
                }
                else return false;
            }
            public override int GetHashCode()
            {
                int hash = 23;
                hash = (hash * 17) + this.r.GetHashCode();
                hash = (hash * 17) + this.o.GetHashCode();
                hash = (hash * 17) + this.p.GetHashCode();
                return hash;
            }
        }
    }
}
