using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace HouseManager
{
    public static class BaseInfomation
    {
        public static RoomMain rm = new RoomMain()
        {
            Players = new Dictionary<string, Player>()
        };

        public static HttpClient Client = new HttpClient();
    }
}
