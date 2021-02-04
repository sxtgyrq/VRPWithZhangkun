using System;
using System.Numerics;

namespace BitCoin
{
    public class HexToBigInteger
    {
        public static BigInteger inputHex(string hexInput)
        {
            hexInput = hexInput.ToLower();
            BigInteger result = new BigInteger(0);
            for (var i = 0; i < hexInput.Length; i++)
            {
                result = result * 16;
                var charIndex = hexInput[i];
                switch (charIndex)
                {
                    case '0':
                        {
                            result += 0;
                        }; break;
                    case '1':
                        {
                            result += 1;
                        }; break;
                    case '2':
                        {
                            result += 2;
                        }; break;
                    case '3':
                        {
                            result += 3;
                        }; break;
                    case '4':
                        {
                            result += 4;
                        }; break;
                    case '5':
                        {
                            result += 5;
                        }; break;
                    case '6':
                        {
                            result += 6;
                        }; break;
                    case '7':
                        {
                            result += 7;
                        }; break;
                    case '8':
                        {
                            result += 8;
                        }; break;
                    case '9':
                        {
                            result += 9;
                        }; break;
                    case 'a':
                        {
                            result += 10;
                        }; break;
                    case 'b':
                        {
                            result += 11;
                        }; break;
                    case 'c':
                        {
                            result += 12;
                        }; break;
                    case 'd':
                        {
                            result += 13;
                        }; break;
                    case 'e':
                        {
                            result += 14;
                        }; break;
                    case 'f':
                        {
                            result += 15;
                        }; break;
                    default:
                        {
                            throw new Exception(charIndex.ToString());
                        }
                }
            }
            return result;
        }

        /// <summary>
        /// 逆序排序
        /// </summary>
        /// <param name="hexInput"></param>
        /// <returns></returns>
        public static BigInteger inputHex2(string hexInput)
        {
            hexInput = hexInput.ToLower();
            BigInteger result = new BigInteger(0);
            for (var i = 0; i < hexInput.Length; i++)
            {
                result = result * 16;
                var charIndex = hexInput[i];
                switch (charIndex)
                {
                    case '0':
                        {
                            result += 0;
                        }; break;
                    case '1':
                        {
                            result += 1;
                        }; break;
                    case '2':
                        {
                            result += 2;
                        }; break;
                    case '3':
                        {
                            result += 3;
                        }; break;
                    case '4':
                        {
                            result += 4;
                        }; break;
                    case '5':
                        {
                            result += 5;
                        }; break;
                    case '6':
                        {
                            result += 6;
                        }; break;
                    case '7':
                        {
                            result += 7;
                        }; break;
                    case '8':
                        {
                            result += 8;
                        }; break;
                    case '9':
                        {
                            result += 9;
                        }; break;
                    case 'a':
                        {
                            result += 10;
                        }; break;
                    case 'b':
                        {
                            result += 11;
                        }; break;
                    case 'c':
                        {
                            result += 12;
                        }; break;
                    case 'd':
                        {
                            result += 13;
                        }; break;
                    case 'e':
                        {
                            result += 14;
                        }; break;
                    case 'f':
                        {
                            result += 15;
                        }; break;
                    default:
                        {
                            throw new Exception(charIndex.ToString());
                        }
                }
            }
            return result;
        }

        public static string bigIntergetToHex(BigInteger num)
        {
            string result = "";
            do
            {
                var nItem = getInt(num % 16);


                switch (nItem)
                {
                    case 0:
                        { result = result.Insert(0, "0"); }; break;
                    case 1:
                        { result = result.Insert(0, "1"); }; break;
                    case 2:
                        { result = result.Insert(0, "2"); }; break;
                    case 3:
                        { result = result.Insert(0, "3"); }; break;
                    case 4:
                        { result = result.Insert(0, "4"); }; break;
                    case 5:
                        { result = result.Insert(0, "5"); }; break;
                    case 6:
                        { result = result.Insert(0, "6"); }; break;
                    case 7:
                        { result = result.Insert(0, "7"); }; break;
                    case 8:
                        { result = result.Insert(0, "8"); }; break;
                    case 9:
                        { result = result.Insert(0, "9"); }; break;
                    case 10:
                        { result = result.Insert(0, "a"); }; break;
                    case 11:
                        { result = result.Insert(0, "b"); }; break;
                    case 12:
                        { result = result.Insert(0, "c"); }; break;
                    case 13:
                        { result = result.Insert(0, "d"); }; break;
                    case 14:
                        { result = result.Insert(0, "e"); }; break;
                    case 15:
                        { result = result.Insert(0, "f"); }; break;
                    default:
                        {
                            throw new Exception("");
                        }
                };
                num = num / 16;
            } while (!num.IsZero);
            return result;
        }

        public static string bigIntergetToHex32(BigInteger num)
        {
            string result = "";
            do
            {
                var nItem = getInt(num % 16);


                switch (nItem)
                {
                    case 0:
                        { result = result.Insert(0, "0"); }; break;
                    case 1:
                        { result = result.Insert(0, "1"); }; break;
                    case 2:
                        { result = result.Insert(0, "2"); }; break;
                    case 3:
                        { result = result.Insert(0, "3"); }; break;
                    case 4:
                        { result = result.Insert(0, "4"); }; break;
                    case 5:
                        { result = result.Insert(0, "5"); }; break;
                    case 6:
                        { result = result.Insert(0, "6"); }; break;
                    case 7:
                        { result = result.Insert(0, "7"); }; break;
                    case 8:
                        { result = result.Insert(0, "8"); }; break;
                    case 9:
                        { result = result.Insert(0, "9"); }; break;
                    case 10:
                        { result = result.Insert(0, "a"); }; break;
                    case 11:
                        { result = result.Insert(0, "b"); }; break;
                    case 12:
                        { result = result.Insert(0, "c"); }; break;
                    case 13:
                        { result = result.Insert(0, "d"); }; break;
                    case 14:
                        { result = result.Insert(0, "e"); }; break;
                    case 15:
                        { result = result.Insert(0, "f"); }; break;
                    default:
                        {
                            throw new Exception("");
                        }
                };
                num = num / 16;
            } while (!num.IsZero);

            while (result.Length < 64)
            {
                result = result.Insert(0, "0");
            }
            return result;
        }

        public static int getInt(BigInteger bigInteger)
        {
            int result = 0;
            int baseInt = 1;
            do
            {
                if (bigInteger.IsEven)
                {
                    result += 0;
                }
                else
                {
                    result += baseInt;
                }
                bigInteger = bigInteger / 2;
                baseInt = baseInt * 2;
            } while (!bigInteger.IsZero);
            return result;
        }
    }
}
