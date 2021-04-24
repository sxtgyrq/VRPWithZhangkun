using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        private void DrawSingleRoadF(Player player, string roadCode, ref List<string> notifyMsg)
        {
            List<double[]> meshPoints;
            Program.dt.getSingle(roadCode, out meshPoints);
            SingleRoadPathData srpd = new SingleRoadPathData()
            {
                c = "SingleRoadPathData",
                WebSocketID = player.WebSocketID,
                meshPoints = meshPoints,
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(srpd);
            notifyMsg.Add(player.FromUrl);
            notifyMsg.Add(json);
        }
    }
}
