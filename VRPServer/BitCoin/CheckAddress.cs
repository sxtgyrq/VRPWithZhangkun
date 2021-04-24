using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace BitCoin
{
    public class CheckAddress
    {
        public static bool CheckAddressIsUseful(string address)
        {
            var regx = new Regex("^[1][a-km-zA-HJ-NP-Z0-9]{26,33}$");
            if (regx.Match(address).Success)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
