using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;

namespace BitCoin
{
    public class Base58
    {
        private const string Digits = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        public static byte[] Decode(string base58)
        {
            // Decode Base58 string to BigInteger 
            BigInteger intData = 0;
            for (int i = 0; i < base58.Length; i++)
            {
                int digit = Digits.IndexOf(base58[i]); //Slow
                if (digit < 0)
                    throw new FormatException(string.Format("Invalid Base58 character `{0}` at position {1}", base58[i], i));
                intData = intData * 58 + digit;
            }

            // Encode BigInteger to byte[]
            // Leading zero bytes get encoded as leading `1` characters
            int leadingZeroCount = base58.TakeWhile(c => c == '1').Count();
            var leadingZeros = Enumerable.Repeat((byte)0, leadingZeroCount);
            var bytesWithoutLeadingZeros =
                intData.ToByteArray()
                .Reverse()// to big endian
                .SkipWhile(b => b == 0);//strip sign byte
            var result = leadingZeros.Concat(bytesWithoutLeadingZeros).ToArray();
            return result;
        }
    }
    public class PrivateKeyF
    {
        internal static void Config()
        {
            throw new NotImplementedException();
        }

        internal static bool Check(string inputSting, out System.Numerics.BigInteger privateBigInteger)
        {
            var privateByte = Base58.Decode(inputSting);
            // var privateByte = Hex.HexToBytes32(inputSting);
            //  var privateKey1 = Calculate.Encode(privateByte);
            if (privateByte.Length == 38)
            {
                if (privateByte[0] == 0x80 && privateByte[33] == 0x01)
                {
                    var m = new List<byte>();
                    for (var i = 0; i < 34; i++)
                    {
                        m.Add(privateByte[i]);
                    }
                    byte[] chechHash = Calculate.GetCheckSum(m.ToArray());
                    if (
                        chechHash[0] == privateByte[34] &&
                        chechHash[1] == privateByte[35] &&
                        chechHash[2] == privateByte[36] &&
                        chechHash[3] == privateByte[37])
                    {
                        privateBigInteger = 0;
                        for (var i = 1; i < 33; i++)
                        {
                            privateBigInteger = privateBigInteger * 256;
                            privateBigInteger = privateBigInteger + Convert.ToInt32(privateByte[i]);
                        }
                        privateBigInteger = privateBigInteger % Secp256k1.q;
                        return true;
                    }
                    else
                    {
                        privateBigInteger = -1;
                        return false;
                    }
                }
                else
                {
                    privateBigInteger = -1;
                    return false;
                }
            }
            else if (privateByte.Length == 37)
            {
                if (privateByte[0] == 0x80)
                {
                    var m = new List<byte>();
                    for (var i = 0; i < 33; i++)
                    {
                        m.Add(privateByte[i]);
                    }
                    byte[] chechHash = Calculate.GetCheckSum(m.ToArray());
                    if (
                        chechHash[0] == privateByte[33] &&
                        chechHash[1] == privateByte[34] &&
                        chechHash[2] == privateByte[35] &&
                        chechHash[3] == privateByte[36])
                    {
                        privateBigInteger = 0;
                        for (var i = 1; i < 33; i++)
                        {
                            privateBigInteger = privateBigInteger * 256;
                            privateBigInteger = privateBigInteger + Convert.ToInt32(privateByte[i]);
                        }
                        privateBigInteger = privateBigInteger % Secp256k1.q;
                        return true;
                    }
                    else
                    {
                        privateBigInteger = -1;
                        return false;
                    }
                }
                else
                {
                    privateBigInteger = -1;
                    return false;
                }
            }
            else
            {
                privateBigInteger = -1;
                return false;
            }
        }

        internal static BigInteger[] Sign(BigInteger privateBigInteger, byte[] hashCode)
        {
            return BitCoin.Sign.GenerateSignature(privateBigInteger, hashCode);


        }

        //internal static void Adapter(ref byte[] privateByte)
        //{
        //    var result = new byte[32];
        //    var l = privateByte.Length;
        //    for (int i = 0; i < 32; i++)
        //    {
        //        if (i < l) result[i] = privateByte[i];
        //        else result[i] = Convert.ToByte(0);

        //    }
        //    privateByte = result;
        //}
    }
}
