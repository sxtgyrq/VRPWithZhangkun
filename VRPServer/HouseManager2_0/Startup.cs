using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0
{
    class Startup
    {
        public static async Task sendMsg(string controllerUrl, string json)
        {
            await Task.Run(() => TcpFunction.WithoutResponse.SendInmationToUrl(controllerUrl, json));
        }
    }
}
