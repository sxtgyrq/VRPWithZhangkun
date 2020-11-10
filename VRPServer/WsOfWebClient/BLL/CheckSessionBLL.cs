using CommonClass;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace WsOfWebClient.BLL
{
    class CheckSessionBLL
    {
        internal static async Task<bool> checkIsOK(CheckSession checkSession)
        {
            //
            try
            {
                var playerCheck = Newtonsoft.Json.JsonConvert.DeserializeObject<PlayerCheck>(checkSession.session);
                playerCheck.c = "PlayerCheck";
                playerCheck.FromUrl = ConnectInfo.ConnectedInfo + "/notify";
                if (Room.CheckSign(playerCheck))
                {
                    var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(playerCheck);
                    var reqResult = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[playerCheck.RoomIndex], sendMsg);
                    if (reqResult.ToLower() == "ok")
                    {
                        return true;
                    }
                }
                return false;
            }
            catch
            {
                return false;
            }

        }

        internal static string getSession()
        {
            return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_0";
        }
    }
}
