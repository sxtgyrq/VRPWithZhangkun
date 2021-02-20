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
        internal class CheckIsOKResult
        {
            public bool CheckOK { get; set; }
            public int roomIndex { get; set; }

            /// <summary>
            /// 由AddPlayer 产生的key
            /// </summary>
            public string Key { get; set; }
        }
        internal static async Task<CheckIsOKResult> checkIsOK(CheckSession checkSession, State s)
        {
            //
            try
            {
                var playerCheck = Newtonsoft.Json.JsonConvert.DeserializeObject<PlayerCheck>(checkSession.session);
                playerCheck.c = "PlayerCheck";
                playerCheck.FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}";//ConnectInfo.ConnectedInfo + "/notify";
                // pl
                playerCheck.WebSocketID = s.WebsocketID;

                if (Room.CheckSign(playerCheck))
                {
                    var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(playerCheck);
                    var reqResult = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[playerCheck.RoomIndex], sendMsg);
                    if (reqResult.ToLower() == "ok")
                    {
                        s.roomIndex = playerCheck.RoomIndex;
                        return new CheckIsOKResult()
                        {
                            CheckOK = true,
                            roomIndex = playerCheck.RoomIndex,
                            Key = playerCheck.Key
                        };
                    }
                }
                return new CheckIsOKResult()
                {
                    CheckOK = false,
                    roomIndex = -1,
                    Key = "不存在"
                };
            }
            catch
            {
                return new CheckIsOKResult()
                {
                    CheckOK = false,
                    roomIndex = -1,
                    Key = "不存在"
                };
            }

        }

        internal static string getSession()
        {
            return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_0";
        }
    }
}
