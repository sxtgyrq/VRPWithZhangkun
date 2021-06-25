using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        BackGround bg;
        private void GetBackground(Player player, ref List<string> notifyMsg)
        {
            var ti = player.getCar().targetFpIndex;
            if (ti >= 0)
            {
                var code = this.bg.getPathByRegion(Program.dt.GetFpByIndex(ti).region);
                var infomation = Program.rm.GetBackgroundInfomation(player.WebSocketID, code);
                var url = player.FromUrl;
                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);
            }
        }

        private BradCastBackground GetBackgroundInfomation(int webSocketID, string code)
        {
            var obj = new BradCastBackground
            {
                c = "BradCastBackground",
                WebSocketID = webSocketID,
                path = code
            };
            return obj;
        }

    }
}
