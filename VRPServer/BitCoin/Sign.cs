using System;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace BitCoin
{
    public class Sign
    {
        private static RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider();
        public static BigInteger[] GenerateSignature(BigInteger privateKey, byte[] hash)
        {
            BigInteger? k = null;
            for (int i = 0; i < 100; i++)
            {

                byte[] kBytes = new byte[33];
                rngCsp.GetBytes(kBytes);
                kBytes[32] = 0;

                k = new BigInteger(kBytes);
                var z = Bytes32.ConvetToBigInteger(hash);

                if (k.Value.IsZero || k >= Secp256k1.q) continue;

                var r = Calculate.getPublicByPrivate(k.Value)[0] % Secp256k1.q;

                if (r.IsZero) continue;

                var ss = (z + r * privateKey);
                var s = (ss * (k.Value.ModInverse(Secp256k1.q))) % Secp256k1.q;

                if (s.IsZero) continue;

                return new BigInteger[] { r, s };
            }

            throw new Exception("Unable to generate signature");
        }

        public static bool VerifySignature(BigInteger[] publicKey, byte[] hash, BigInteger r, BigInteger s)
        {
            if (r >= Secp256k1.q || r.IsZero || s >= Secp256k1.q || s.IsZero)
            {
                return false;
            }

            var z = Bytes32.ConvetToBigInteger(hash); ;
            var w = s.ModInverse(Secp256k1.q);
            var u1 = (z * w) % Secp256k1.q;
            var u2 = (r * w) % Secp256k1.q;
            bool isZero;
            var pt = Calculate.pointPlus(Calculate.getPublicByPrivate(u1), Calculate.getMulValue(u2, publicKey), out isZero);// (publicKey.Multiply(u2));

            if (pt == null)
            {
                return false;
            }
            else
            {
                var pmod = pt[0] % Secp256k1.q;

                return pmod == r;
            }
        }

        public static string SignMessage()
        {
            Console.WriteLine("请输入要签名的信息(utf-8)");
            var msg = Console.ReadLine();
            Console.WriteLine("请输入要私钥");
            //   output($"拖入您的Base58编码的37位或38位的私钥的路径，用此私钥进行验证.即校验.txt");

            var privateKey = Console.ReadLine();
            System.Numerics.BigInteger privateBigInteger;
            if (PrivateKeyF.Check(privateKey, out privateBigInteger)) { }
            else
            {
                Console.WriteLine($"请输入正确的私钥！！！");
                return "";
            }
            bool compressed;
            string address;
            if (privateKey.Length == 51)
            {
                compressed = false;
                address = PublicKeyF.GetAddressOfUncompressed(Calculate.getPublicByPrivate(privateBigInteger));
            }
            else if (privateKey.Length == 52)
            {
                compressed = true;
                address = PublicKeyF.GetAddressOfcompressed(Calculate.getPublicByPrivate(privateBigInteger));
            }
            else
            {
                throw new Exception("");
            }


            var msgHash = msg_digest(msg);
            var signal = PrivateKeyF.Sign(privateBigInteger, msgHash);
            var r = signal[0];
            var rByte = HexToByteArray.BigIntegerTo32ByteArray(r);
            HexToByteArray.ChangeDirection(ref rByte);

            var s = signal[1];
            var sByte = HexToByteArray.BigIntegerTo32ByteArray(s);
            HexToByteArray.ChangeDirection(ref sByte);

            // Console.WriteLine($"{Convert.ToBase64String(rByte)}{Convert.ToBase64String(sByte)}");

            var sequence = new byte[] { 0 }; //[0];
            sequence = sequence.Concat(rByte).ToArray();
            sequence = sequence.Concat(sByte).ToArray();

            for (var i = 0; i < 4; i++)
            {
                int nV = 27 + i;
                if (compressed)
                    nV += 4;
                sequence[0] = Convert.ToByte(nV);
                var sig = Convert.ToBase64String(sequence);
                Console.WriteLine(sig);
                var calAddredd = verify_message(sig, msg, compressed ? 1 : 0);
                // return sig;
                if (calAddredd == address)
                {
                    return sig;
                }
                //if (verify_message(sig, msg, compressed ? 1 : 0) == address)
                //    return sig;
            }
            return "";
        }

        public static bool checkSign(string signature, string message, string address)
        {
            byte[] sig;
            {
                sig = Convert.FromBase64String(signature);
            }

            if (sig.Length != 65)
                return false;

            // extract r,s from signature
            var r = Bytes32.ConvetToBigInteger(sig.Skip(1).Take(32).ToArray());
            var s = Bytes32.ConvetToBigInteger(sig.Skip(33).Take(32).ToArray());
            // var s = BigInteger.fromByteArrayUnsigned(sig.slice(33, 33 + 32));

            // get recid
            var compressed = false;
            var nV = Convert.ToInt32(sig[0]);
            if (nV < 27 || nV >= 35)
                return false;
            if (nV >= 31)
            {
                compressed = true;
                nV -= 4;
            }
            var recid = new BigInteger(nV - 27);

            //var ecparams = getSECCurveByName("secp256k1");
            //var curve = ecparams.getCurve();
            //var a = curve.getA().toBigInteger();
            //var b = curve.getB().toBigInteger();
            //var p = curve.getQ();
            //var G = ecparams.getG();
            //var order = ecparams.getN();

            //var x = r.add(order.multiply(recid.divide(BigInteger.valueOf(2))));
            var x = recid / 2 * Secp256k1.q + r;

            //Calculate.getMulValue(,recid / 2);
            // var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
            var alpha = (x * x * x + Secp256k1.a * x + Secp256k1.b) % Secp256k1.p;
            //var beta = alpha.modPow(p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)), p);
            var beta = BigInteger.ModPow(alpha, (Secp256k1.p + 1) / 4, Secp256k1.p);//Calculate.Pow((Secp256k1.p + 1) / 4, alpha);
            var y = (beta - recid).IsEven ? beta : (Secp256k1.p - beta);
            //var y = beta.subtract(recid).isEven() ? beta : p.subtract(beta);

            //   var R = new ECPointFp(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
            // var e = BigInteger.fromByteArrayUnsigned(msg_digest(message));
            var e = Bytes32.ConvetToBigInteger(msg_digest(message));
            //    var minus_e = BigInteger.Negate(e)+ % Secp256k1.q;
            var minus_e = ((Secp256k1.q - e) % Secp256k1.q + Secp256k1.q) % Secp256k1.q;
            var inv_r = Inverse.ex_gcd(r, Secp256k1.q);////BigInteger.mo r.modInverse(order);
            //var Q = (R.multiply(s).add(G.multiply(minus_e))).multiply(inv_r);
            bool isZero;
            var Q__ = Calculate.pointPlus(Calculate.getMulValue(s, new BigInteger[] { x, y }),
                Calculate.getPublicByPrivate(minus_e), out isZero);
            if (isZero)
            {
                return false;
            }
            else
            {
                var Q = Calculate.getMulValue(inv_r, Q__);
                // var public_key = PublicKeyF.GetAddressOfcompressed(Q);
                if (compressed)
                {
                    var compressedAdress = PublicKeyF.GetAddressOfcompressed(Q);
                    Console.WriteLine($"compressed Adress:{compressedAdress}");
                    return compressedAdress == address;

                }
                else
                {
                    var unCompressedAdress = PublicKeyF.GetAddressOfUncompressed(Q);
                    Console.WriteLine($"uncompressed adress:{unCompressedAdress}");
                    return unCompressedAdress == address;
                }
            }
        }

        static byte[] msg_digest(string message)
        {
            SHA256 sha256 = new SHA256Managed();
            Console.WriteLine("Bitcoin Signed Message:\n");
            var preInfoMsg = "Bitcoin Signed Message:\n";

            var b = msg_bytes(preInfoMsg).Concat(msg_bytes(message)).ToArray();

            var msgHash = sha256.ComputeHash(b);
            msgHash = sha256.ComputeHash(msgHash);
            return msgHash;
        }
        /// <summary>
        /// 无符号右移, 相当于java里的 value>>>pos
        /// </summary>
        /// <param name="value"></param>
        /// <param name="pos"></param>
        /// <returns></returns>
        static int RightMove(int value, int pos)
        {
            //移动 0 位时直接返回原值
            if (pos != 0)
            {
                // int.MaxValue = 0x7FFFFFFF 整数最大值
                int mask = int.MaxValue;
                //无符号整数最高位不表示正负但操作数还是有符号的，有符号数右移1位，正数时高位补0，负数时高位补1
                value = value >> 1;
                //和整数最大值进行逻辑与运算，运算后的结果为忽略表示正负值的最高位
                value = value & mask;
                //逻辑运算后的值无符号，对无符号的值直接做右移运算，计算剩下的位
                value = value >> pos - 1;
            }

            return value;
        }
        static byte[] msg_numToVarInt(int i)
        {
            if (i < 0xfd)
            {
                return new byte[] { Convert.ToByte(i) }; //[i];
            }
            else if (i <= 0xffff)
            {
                return new byte[]
                {
                    Convert.ToByte(0xfd),
                    Convert.ToByte(i & 255),
                    Convert.ToByte( RightMove(i,8))
                };

            }
            else if (i <= 0x7FFFFFFF)
            {
                //[0xfe, i & 255, (i >>> 8) & 255, (i >>> 16) & 255, i >>> 24]
                return new byte[]
                {
                    Convert.ToByte(0xfe),
                    Convert.ToByte(i&255),
                    Convert.ToByte(RightMove(i,8)&255),
                    Convert.ToByte(RightMove(i,16)&255),
                    Convert.ToByte( RightMove(i,24))
                };
            }
            else
            {
                throw new Exception("out length");
            }
        }


        static byte[] msg_bytes(string message)
        {
            var b = Encoding.UTF8.GetBytes(message);
            return msg_numToVarInt(b.Length).Concat(b).ToArray();
        }

        public static string verify_message(string signature, string message, int addrtype)
        {
            byte[] sig;
            //try
            {
                sig = Convert.FromBase64String(signature);
            }
            //catch (err)
            //{
            //    return false;
            //}

            if (sig.Length != 65)
                return "Error e";

            // extract r,s from signature
            var r = Bytes32.ConvetToBigInteger(sig.Skip(1).Take(32).ToArray());
            var s = Bytes32.ConvetToBigInteger(sig.Skip(33).Take(32).ToArray());
            // var s = BigInteger.fromByteArrayUnsigned(sig.slice(33, 33 + 32));

            // get recid
            //  var compressed = false;
            var nV = Convert.ToInt32(sig[0]);
            if (nV < 27 || nV >= 35)
                return "Error e";
            if (nV >= 31)
            {
                //    compressed = true;
                nV -= 4;
            }
            var recid = new BigInteger(nV - 27);


            {
                //var z = Bytes32.ConvetToBigInteger(hash); ;
                //var w = s.ModInverse(Secp256k1.q);
                //var u1 = (z * w) % Secp256k1.q;
                //var u2 = (r * w) % Secp256k1.q;
                //bool isZero;
                //var pt = Calculate.pointPlus(Calculate.getPublicByPrivate(u1), Calculate.getMulValue(u2, publicKey), out isZero);// (publicKey.Multiply(u2));

                //if (pt == null)
                //{
                //    return false;
                //}
                //else
                //{
                //    var pmod = pt[0] % Secp256k1.q;

                //    return pmod == r;
                //}
            }
            //var ecparams = getSECCurveByName("secp256k1");
            //var curve = ecparams.getCurve();
            //var a = curve.getA().toBigInteger();
            //var b = curve.getB().toBigInteger();
            //var p = curve.getQ();
            //var G = ecparams.getG();
            //var order = ecparams.getN();

            //var x = r.add(order.multiply(recid.divide(BigInteger.valueOf(2))));
            var x = recid / 2 * Secp256k1.q + r;

            //Calculate.getMulValue(,recid / 2);
            // var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
            var alpha = (x * x * x + Secp256k1.a * x + Secp256k1.b) % Secp256k1.p;
            //var beta = alpha.modPow(p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)), p);
            var beta = BigInteger.ModPow(alpha, (Secp256k1.p + 1) / 4, Secp256k1.p);//Calculate.Pow((Secp256k1.p + 1) / 4, alpha);
            var y = (beta - recid).IsEven ? beta : (Secp256k1.p - beta);
            //var y = beta.subtract(recid).isEven() ? beta : p.subtract(beta);

            //   var R = new ECPointFp(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
            // var e = BigInteger.fromByteArrayUnsigned(msg_digest(message));
            var e = Bytes32.ConvetToBigInteger(msg_digest(message));
            //    var minus_e = BigInteger.Negate(e)+ % Secp256k1.q;
            var minus_e = ((Secp256k1.q - e) % Secp256k1.q + Secp256k1.q) % Secp256k1.q;
            var inv_r = Inverse.ex_gcd(r, Secp256k1.q);////BigInteger.mo r.modInverse(order);
            //var Q = (R.multiply(s).add(G.multiply(minus_e))).multiply(inv_r);
            bool isZero;
            var Q__ = Calculate.pointPlus(Calculate.getMulValue(s, new BigInteger[] { x, y }),
                Calculate.getPublicByPrivate(minus_e), out isZero);
            if (isZero)
            {
                return "Error e";
            }
            else
            {
                var Q = Calculate.getMulValue(inv_r, Q__);
                var public_key = PublicKeyF.GetAddressOfcompressed(Q);
                if (addrtype == 0)
                {
                    return PublicKeyF.GetAddressOfUncompressed(Q);
                }
                else if (addrtype == 1)
                {
                    return PublicKeyF.GetAddressOfcompressed(Q);
                }
                else
                {
                    return "Error e";
                }
            }
        }
    }

    public static class SignM
    {
        public static BigInteger ModInverse(this BigInteger n, BigInteger p)
        {
            BigInteger x = 1;
            BigInteger y = 0;
            BigInteger a = p;
            BigInteger b = n;

            while (b != 0)
            {
                BigInteger t = b;
                BigInteger q = BigInteger.Divide(a, t);
                b = a - q * t;
                a = t;
                t = x;
                x = y - q * t;
                y = t;
            }

            if (y < 0)
                return y + p;
            //else
            return y;
        }
    }
}
