using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace BitCoin
{
    public class Bytes32
    {
        public static BigInteger ConvetToBigInteger(byte[] hash1)
        {
            BigInteger result = 0;
            for (var i = 0; i < hash1.Length; i++)
            {
                result = result * 256;
                var item = Convert.ToInt32(hash1[i]);
                result += item;

            }
            return result % Secp256k1.q;
        }

        internal static bool ByteArrayEqual(byte[] hash1, byte[] hashCode)
        {
            if (hash1.Length == hashCode.Length)
            {
                for (int i = 0; i < hash1.Length; i++)
                {
                    if (hash1[i] == hashCode[i]) { }
                    else { return false; }
                }
                return true;
            }
            return false;
        }
    }
}
