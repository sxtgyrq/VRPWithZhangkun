using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        public HouseManager2_0.Music Music { get; internal set; }

        private void GetMusic(Player player, ref List<string> notifyMsg)
        {
            var ti = player.getCar().targetFpIndex;
            if (ti >= 0)
            {
                var code = this.Music.getByRegion(Program.dt.GetFpByIndex(ti).region);
                var infomation = Program.rm.GetMusicInfomation(player.WebSocketID, code);
                var url = player.FromUrl;
                var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(infomation);
                notifyMsg.Add(url);
                notifyMsg.Add(sendMsg);
            }
        }

        private BradCastMusicTheme GetMusicInfomation(int webSocketID, string theme)
        {
            var obj = new BradCastMusicTheme
            {
                c = "BradCastMusicTheme",
                WebSocketID = webSocketID,
                theme = theme
            };
            return obj;
        }
    }
}
