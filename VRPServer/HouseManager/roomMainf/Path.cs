using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using OssModel = Model;

namespace HouseManager
{
    public partial class RoomMain
    {
        private List<OssModel.MapGo.nyrqPosition> GetAFromB(int from, int to, Player player, ref List<string> notifyMsgs)
        {
            var path = Program.dt.GetAFromB(from, to);
            for (var i = 0; i < path.Count; i++)
            {
                player.addUsedRoad(path[i].roadCode, ref notifyMsgs);
            }
            return path;
        }

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
