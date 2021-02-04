using System.Collections.Generic;
using System.Text;

namespace BitCoin
{
    public class Secp256k1
    {
        public static System.Numerics.BigInteger p = HexToBigInteger.inputHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
        public static System.Numerics.BigInteger a = HexToBigInteger.inputHex("0");
        public static System.Numerics.BigInteger b = HexToBigInteger.inputHex("7");
        public static System.Numerics.BigInteger x = HexToBigInteger.inputHex("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798");
        public static System.Numerics.BigInteger y = HexToBigInteger.inputHex("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");
        public static System.Numerics.BigInteger q = HexToBigInteger.inputHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
    }
}
