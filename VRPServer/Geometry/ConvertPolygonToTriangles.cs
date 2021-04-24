using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace Geometry
{
    public class ConvertPolygonToTriangles
    {
        public class BigRationalNumber : IComparable
        {


            public BigRationalNumber(BigInteger numerato_input, BigInteger denominator_Input)
            {
                //走查ok
                this.denominator = denominator_Input;
                this.numerato = numerato_input;

                if (this.denominator <= 0)
                {
                    throw new Exception("分母必须为非负数");
                }
                else
                {
                    var maxApproximateNumber = getMaxApproximateNumber(new BigInteger[] { this.numerato, this.denominator });
                    this.numerato = this.numerato / maxApproximateNumber;
                    this.denominator = this.denominator / maxApproximateNumber;
                }
            }

            //分母必须大于0，最小1
            /// <summary>
            /// 分母
            /// </summary>
            public BigInteger denominator { get; private set; }//分母

            /// <summary>
            /// 分子
            /// </summary>
            public BigInteger numerato { get; private set; }//分子


            public static BigRationalNumber operator +(BigRationalNumber c1, BigRationalNumber c2)
            {
                //走查ok
                return new BigRationalNumber(c1.numerato * c2.denominator + c2.numerato * c1.denominator, c1.denominator * c2.denominator);
                //return new Student(c1 + c2, "晓菜鸟");
            }
            public static BigRationalNumber operator -(BigRationalNumber c1, BigRationalNumber c2)
            {
                //走查ok
                return new BigRationalNumber(c1.numerato * c2.denominator - c2.numerato * c1.denominator, c1.denominator * c2.denominator);
            }



            public static BigRationalNumber operator *(BigRationalNumber c1, BigRationalNumber c2)
            {
                //走查ok
                return new BigRationalNumber(c1.numerato * c2.numerato, c1.denominator * c2.denominator);

            }

            public static BigRationalNumber operator /(BigRationalNumber c1, BigRationalNumber c2)
            {
                if (c1.denominator * c2.numerato > 0)
                    return new BigRationalNumber(c1.numerato * c2.denominator, c1.denominator * c2.numerato);
                else if ((c1.denominator * c2.numerato).IsZero)
                {
                    throw new Exception("0不能做分母");
                }
                else
                {
                    return new BigRationalNumber(0 - (c1.numerato * c2.denominator), 0 - (c1.denominator * c2.numerato));
                }
            }

            public static bool operator >(BigRationalNumber c1, BigRationalNumber c2)
            {
                return (c1 - c2).numerato > 0;

            }
            public static bool operator <(BigRationalNumber c1, BigRationalNumber c2)
            {
                return (c1 - c2).numerato < 0;

            }
            public static bool operator ==(BigRationalNumber c1, BigRationalNumber c2)
            {
                return (c1 - c2).numerato.IsZero;
            }
            public static bool operator !=(BigRationalNumber c1, BigRationalNumber c2)
            {
                return !(c1 - c2).numerato.IsZero;
            }

            public static implicit operator BigRationalNumber(int v)
            {
                return new BigRationalNumber(v, 1);
            }
            public static implicit operator BigRationalNumber(long v)
            {
                return new BigRationalNumber(v, 1);
            }

            public override bool Equals(object obj)
            {
                if (obj is BigRationalNumber)
                {

                    return (this - (BigRationalNumber)obj).numerato.IsZero;
                }
                else
                {
                    return false;
                }

            }

            //  public override

            public override int GetHashCode()
            {

                int hash = 17;
                hash = (hash * 23 + this.numerato.GetHashCode()) % int.MaxValue;
                hash = (hash * 23 + this.denominator.GetHashCode()) % int.MaxValue;
                return hash;
            }

            private BigInteger getMaxApproximateNumber(BigInteger[] sumVNew)
            {
                if (sumVNew[0].IsZero)
                {
                    return BigInteger.Abs(sumVNew[1]);
                }
                else if (sumVNew[1].IsZero)
                {
                    return BigInteger.Abs(sumVNew[0]);
                }
                else
                {
                    var a = BigInteger.Max(BigInteger.Abs(sumVNew[0]), BigInteger.Abs(sumVNew[1]));
                    var b = BigInteger.Min(BigInteger.Abs(sumVNew[0]), BigInteger.Abs(sumVNew[1]));

                    return getMaxApproximateNumber(new BigInteger[] { b, a % b });
                }
            }

            public static BigRationalNumber MaxValue
            {
                get
                {
                    return new BigRationalNumber(Int64.MaxValue, 1);
                }
            }

            public static BigRationalNumber MinValue
            {
                get
                {
                    return new BigRationalNumber(Int64.MinValue, 1);
                }
            }

            public double Double { get { return Convert.ToDouble(this.numerato.ToString()) / Convert.ToDouble(this.denominator.ToString()); } }

            internal static BigRationalNumber Min(BigRationalNumber v1, BigRationalNumber v2)
            {
                if (v1 < v2)
                {
                    return v1;
                }
                else
                {
                    return v2;
                }
            }

            internal static BigRationalNumber Max(BigRationalNumber v1, BigRationalNumber v2)
            {
                if (v1 < v2)
                {
                    return v2;
                }
                else
                {
                    return v1;
                }
            }

            internal static BigInteger[] ConvertToAngle(BigRationalNumber[] bigRationalNumber)
            {

                var angleV1 = bigRationalNumber[0];
                var angleV2 = bigRationalNumber[1];
                return new BigInteger[] { angleV1.numerato * angleV2.denominator, angleV2.numerato * angleV1.denominator };
            }

            int IComparable.CompareTo(object obj)
            {
                if (obj is BigRationalNumber)
                {
                    if (this > (BigRationalNumber)obj)
                    {
                        return 1;
                    }
                    else if (this == (BigRationalNumber)obj)
                    {
                        return 0;
                    }
                    else
                    {
                        return -1;
                    }
                }
                else
                    throw new NotImplementedException();
            }

            public static BigRationalNumber Abs(BigRationalNumber bigRationalNumber)
            {
                if (bigRationalNumber < 0)
                {
                    return 0 - bigRationalNumber;
                }
                else
                {
                    return bigRationalNumber;
                }
            }

            //public int CompareTo(object obj)
            //{
            //    return ((IComparable)numerato).CompareTo(obj);
            //}
        }

        public class Line
        {
            public Point start { get; set; }
            public Point end { get; set; }
        }
        public class Point
        {
            public BigRationalNumber x { get; set; }
            public BigRationalNumber y { get; set; }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="lineA">作为射线</param>
        /// <param name="lineB">作为线段</param>
        /// <param name="state">1,表示左侧，2表示右侧</param>
        /// <returns>相切或相离，即非相割</returns>
        public static bool isSeperated(Line lineA, Line lineB, int inputState, out int state)
        {

            BigRationalNumber APx = lineA.start.x;
            BigRationalNumber APy = lineA.start.y;
            BigRationalNumber BPx = lineA.end.x;
            BigRationalNumber BPy = lineA.end.y;

            BigRationalNumber CPx = lineB.start.x;
            BigRationalNumber CPy = lineB.start.y;
            BigRationalNumber DPx = lineB.end.x;
            BigRationalNumber DPy = lineB.end.y;


            if ((APx == CPx && APy == CPy) ||
                (APx == DPx && APy == DPy) ||
                (BPx == CPx && BPy == CPy) ||
                (BPx == DPx && BPy == DPy)
                )
            {
                state = 0;
                return true;
            }

            BigRationalNumber[] ABFindBD = new BigRationalNumber[] { ((DPx - APx) * (CPy - APy) - (CPx - APx) * (DPy - APy)), ((DPx - BPx) * (CPy - BPy) - (CPx - BPx) * (DPy - BPy)) };
            BigRationalNumber[] CDFindAB = new BigRationalNumber[] { ((BPx - CPx) * (APy - CPy) - (APx - CPx) * (BPy - CPy)), (BPx - DPx) * (APy - DPy) - (APx - DPx) * (BPy - DPy) };


            if ((((ABFindBD[0] > 0 && ABFindBD[1] > 0) || (ABFindBD[0] < 0 && ABFindBD[1] < 0))
                ||
                ((CDFindAB[0] > 0 && CDFindAB[1] > 0) || (CDFindAB[0] < 0 && CDFindAB[1] < 0))))
            {
                state = inputState;
                return true;

            }

            //var ABFindBD = ((DPx - APx) * (CPy - APy) - (CPx - APx) * (DPy - APy)) * ((DPx - BPx) * (CPy - BPy) - (CPx - BPx) * (DPy - BPy));
            //var BPFindAB = ((BPx - CPx) * (APy - CPy) - (APx - CPx) * (BPy - CPy)) * ((BPx - DPx) * (APy - DPy) - (APx - DPx) * (BPy - DPy));

            //if (ABFindBD > 0.0 || BPFindAB > 0)
            //{
            //    return true;
            //}

            //else if (ABFindBD == 0 && BPFindAB == 0)
            else if ((ABFindBD[0] == 0 || ABFindBD[1] == 0) && (CDFindAB[0] == 0 || CDFindAB[1] == 0))
            {
                //相切 
                state = inputState;
                return true;
                if (APx != BPx && CPx != DPx)
                {
                    if (APx < CPx && APx < DPx &&
                        BPx < CPx && BPx < DPx)
                    {
                        return true;
                    }
                    else if (APx > CPx && APx > DPx &&
                        BPx > CPx && BPx > DPx)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

                if (APy != BPy && CPy != DPy)
                {
                    if (APy < CPy && APy < DPy &&
                        BPy < CPy && BPy < DPy)
                    {
                        return true;
                    }
                    else if (APy > CPy && APy > DPy &&
                        BPy > CPy && BPy > DPy)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;

            }
            else if (CDFindAB[0] == 0 && CDFindAB[1] != 0)
            {
                //C点在线上，D点不在
                if (CDFindAB[1] * inputState > 0)
                {
                    if (CDFindAB[1] < 0)
                    {
                        state = -1;
                    }
                    else
                    {
                        state = 1;
                    }
                    return true;
                }
                else
                {
                    if (CDFindAB[1] < 0)
                    {
                        state = -1;
                    }
                    else
                    {
                        state = 1;
                    }
                    return false;
                }
                //C点作为虚点r
                //C点与AB共线，但D与AB不共线
                //if ((CPx - APx) * (CPx - BPx) < 0)
                //{
                //    if (CDFindAB[1] * state > 0)
                //    {
                //        state
                //    }
                //    return true;
                //}
                //else if ((CPy - APy) * (CPy - BPy) < 0)
                //{
                //    return true;
                //}
                //else
                //    return true;
            }
            else if (CDFindAB[1] == 0 && CDFindAB[0] != 0)
            {
                // D点在射线上，C点不在
                if (CDFindAB[0] < 0)
                {
                    state = -1;
                }
                else
                {
                    state = 1;
                }
                return true;
            }
            else
            {
                if (CDFindAB[1] < 0)
                {
                    state = -1;
                }
                else
                {
                    state = 1;
                }
                return false;
            }
        }
    }
}
