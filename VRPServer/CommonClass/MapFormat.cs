using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace CommonClass
{
    public class MapFormat
    {
        public static bool LikeFsPresentCode(string fsPresentCode)
        {
            var re = @"^[A-Z]{10}$";
            Regex reg = new Regex(re);
            if (reg.IsMatch(fsPresentCode))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool LikeCross(string crossCode)
        {
            var re = @"^[A-Z]{10}[0-9][0-9]*[A-Z]{10}[0-9][0-9]*$";
            Regex reg = new Regex(re);
            if (reg.IsMatch(crossCode))
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
