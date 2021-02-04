using System;
using System.Collections.Generic;
using System.Numerics;
using System.Security.Cryptography;

namespace BitCoin
{
    public class Inverse
    {
        public static BigInteger ex_gcd(BigInteger a, BigInteger b)
        {
            //while (a < 0)
            //{
            //    a += b;
            //}
            a = a % b;
            if (a < 0)
            {
                a += b;
            }
            BigInteger x, y;
            ex_gcd(a, b, out x, out y);
            if (x > 0)
            {
                return x;
            }
            else
            {
                return b + x;
            }
        }

        public static BigInteger ex_gcd(BigInteger a, BigInteger b, out BigInteger x, out BigInteger y)
        {
            BigInteger ret, tmp;
            if (b == 0)
            {
                x = 1;
                y = 0;
                return a;
            }
            ret = ex_gcd(b, a % b, out x, out y);
            tmp = x;
            x = y;
            y = tmp - a / b * y;
            return ret;
        }
    }
    public class Calculate
    {
        public static BigInteger[] getPublicByPrivate(BigInteger privateKey)
        {
            if (privateKey > 0)
            {
                bool isZero;
                BigInteger[] result = null;
                BigInteger[] baseP = new System.Numerics.BigInteger[] { Secp256k1.x, Secp256k1.y };
                privateKey = privateKey % Secp256k1.q;
                var r = get(privateKey);
                //bool isZero = false;
                for (int i = 0; i < r.Length; i++)
                {
                    if (!r[i])
                    {
                        if (baseP == null)
                        {
                        }
                        else
                        {
                            if (result == null)
                            {
                                result = baseP;
                            }
                            else
                            {

                                result = pointPlus(result, baseP, out isZero);

                                //Console.WriteLine($"baseP{i} ={baseP[0]},{baseP[1]}");
                            }
                            //  result = result == null ? baseP : pointPlus(result, baseP); 
                        }
                    }
                    baseP = getDoubleP(baseP, out isZero);

                }
                return result;
            }
            else if (privateKey.IsZero)
            {
                return null;
            }
            else
            {
                throw new Exception("privateKey的值不能为0和负数");
            }
        }

        internal static BigInteger[] getMulValue(BigInteger rValue, BigInteger[] baseP)
        {
            if (rValue > 0)
            {
                bool isZero;
                BigInteger[] result = null;
                var r = get(rValue);
                //bool isZero = false;
                for (int i = 0; i < r.Length; i++)
                {
                    if (!r[i])
                    {
                        if (baseP == null)
                        {
                        }
                        else
                        {
                            if (result == null)
                            {
                                result = baseP;
                            }
                            else
                            {
                                result = pointPlus(result, baseP, out isZero);
                            }
                        }
                    }
                    baseP = getDoubleP(baseP, out isZero);
                }
                return result;
            }
            else if (rValue.IsZero)
            {
                return null;
            }
            else
            {
                throw new Exception("privateKey的值不能为0和负数");
            }
        }

        internal static bool CheckXYIsRight(BigInteger x, BigInteger y)
        {
            var r1 = get((y * y) % Secp256k1.p);
            var r2 = get((((x * x) % Secp256k1.p * x) % Secp256k1.p + Secp256k1.a * x + Secp256k1.b) % Secp256k1.p);
            if (r1.Length < 1)
            {
                return false;
            }
            else if (r1.Length == r2.Length)
            {
                for (int i = 0; i < r1.Length; i++)
                {
                    if (r1[i] != r2[i])
                    {
                        return false;
                    }
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        internal static BigInteger GetYByX(BigInteger x)
        {
            ///这种情况只使用与 p≡3（mod4）
            ///这里要感谢NB的数学家！！！
            //https://wenku.baidu.com/view/856c1b737fd5360cba1adbd5.html
            // throw new Exception("");
            var yy = (x * x * x + Secp256k1.a * x + Secp256k1.b) % Secp256k1.p;//(((x * x    * x) % Secp256k1.p + Secp256k1.a * x + Secp256k1.b) % Secp256k1.p;
            //var y=

            //28948022309329048855892746252171976963317496166410141009864396001977208667916
            // Console.WriteLine((ECCMain.Secp256k1.p + 1) / 4);
            var y = new BigInteger(1);
            // var baseP = new BigInteger(1);
            //bool isZero = false;
            var r = get((Secp256k1.p + 1) / 4);
            for (int i = 0; i < r.Length; i++)
            {
                if (!r[i])
                {
                    y = (y * yy) % Secp256k1.p;
                }
                yy = (yy * yy) % Secp256k1.p;

            }
            return y;
        }


        internal static BigInteger Pow(BigInteger index, BigInteger @base)
        {
            var r = get(index);
            var y = @base % Secp256k1.p;
            var yy = @base % Secp256k1.p;
            // var baseP = new BigInteger(1);
            //bool isZero = false;
            //var r = get((ECCMain.Secp256k1.p + 1) / 4);
            for (int i = 0; i < r.Length; i++)
            {
                if (!r[i])
                {
                    y = (y * @base) % Secp256k1.p;
                }
                yy = (yy * yy) % Secp256k1.p;

            }
            return y;
        }

        private const string Digits = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        public static string Encode(byte[] data)
        {
            //Contract.Requires<ArgumentNullException>(data != null);
            //Contract.Ensures(Contract.Result<string>() != null);

            // Decode byte[] to BigInteger
            BigInteger intData = 0;
            for (int i = 0; i < data.Length; i++)
            {
                intData = intData * 256 + data[i];
            }

            // Encode BigInteger to Base58 string
            string result = "";
            while (intData > 0)
            {
                int remainder = (int)(intData % 58);
                intData /= 58;
                result = Digits[remainder] + result;
            }

            // Append `1` for each leading 0 byte
            for (int i = 0; i < data.Length && data[i] == 0; i++)
            {
                result = '1' + result;
            }
            return result;
        }

        private static bool[] get(BigInteger bigIntegers)
        {
            List<bool> result = new List<bool>();
            while (!bigIntegers.IsZero)
            {
                if (bigIntegers.IsEven)
                {
                    result.Add(true);
                }
                else
                {
                    result.Add(false);
                }
                bigIntegers = bigIntegers / 2;
            }
            return result.ToArray();
        }

        public static BigInteger[] pointPlus(BigInteger[] point_P, BigInteger[] point_Q, out bool isZero)
        {
            // throw new Exception("");
            if (((point_P[0] - point_Q[0]) % Secp256k1.p).IsZero)
            {
                if ((point_P[1] - point_Q[1] % Secp256k1.p).IsZero)
                {
                    return getDoubleP(point_P, out isZero);
                }
                else
                {
                    isZero = true;
                    return null;
                }
            }
            else
            {
                isZero = false;
                var s = (point_P[1] - point_Q[1]) * (Inverse.ex_gcd((point_P[0] - point_Q[0] + Secp256k1.p) % Secp256k1.p, Secp256k1.p));
                s = s % Secp256k1.p;
                if (s < 0)
                {
                    s += Secp256k1.p;
                }
                var Xr = (s * s - (point_P[0] + point_Q[0])) % Secp256k1.p;

                var Yr = (s * (point_P[0] - Xr) - point_P[1]) % Secp256k1.p;
                while (Xr < 0)
                {
                    Xr += Secp256k1.p;
                }
                while (Yr < 0)
                {
                    Yr += Secp256k1.p;
                }
                return new BigInteger[] { Xr, Yr };
            }
            //  var s=a[]
            //var x = bigIntegers[0];
            //var y = bigIntegers[1];
            //var s = ((3 * x * x + a) * (ECCMain.Inverse.ex_gcd(2 * y, p))) % p;
            //var Xr = (s * s - 2 * x) % p;
            //while (Xr < 0)
            //{
            //    Xr += p;
            //}
            ////Xr = Xr % p;
            //var Yr = (s * (x - Xr) - y) % p;
            //while (Yr < 0)
            //{
            //    Yr += p;
            //}
            //return new BigInteger[] { Xr, Yr };
        }

        private static BigInteger[] getDoubleP(BigInteger[] bigIntegers, out bool isZero)
        {
            var x = bigIntegers[0];
            var y = bigIntegers[1];
            //if ((y%17.IsZero)
            //{
            //    isZero = true;
            //    return null;
            //}
            //else
            {
                var s = ((3 * x * x + Secp256k1.a) * (Inverse.ex_gcd((2 * y) % Secp256k1.p, Secp256k1.p))) % Secp256k1.p;
                var Xr = (s * s - 2 * x) % Secp256k1.p;
                while (Xr < 0)
                {
                    Xr += Secp256k1.p;
                }
                //Xr = Xr % p;
                var Yr = (s * (x - Xr) - y) % Secp256k1.p;
                while (Yr < 0)
                {
                    Yr += Secp256k1.p;
                }
                isZero = false;
                return new BigInteger[] { Xr, Yr };
            }
        }

        public const int CheckSumSizeInBytes = 4;
        public static byte[] GetCheckSum(byte[] data)
        {
            //Contract.Requires<ArgumentNullException>(data != null);
            //Contract.Ensures(Contract.Result<byte[]>() != null);

            SHA256 sha256 = new SHA256Managed();
            byte[] hash1 = sha256.ComputeHash(data);
            byte[] hash2 = sha256.ComputeHash(hash1);

            var result = new byte[CheckSumSizeInBytes];
            Buffer.BlockCopy(hash2, 0, result, 0, result.Length);

            return result;
        }
        public static byte[] BiteSplitJoint(byte[] bs1, byte[] bs2)
        {
            List<byte> byteSource = new List<byte>();
            for (int i = 0; i < bs1.Length; i++)
            {
                byteSource.Add(bs1[i]);


            }
            for (int i = 0; i < bs2.Length; i++)
            {
                byteSource.Add(bs2[i]);
            }
            return byteSource.ToArray();
        }
    }
}
