using CommonClass;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WsOfWebClient
{
    public class Room
    {
        public static List<string> roomUrls = new List<string>()
        {
            "http://127.0.0.1:11100" + "/notify"
        };

        internal static PlayerAdd getRoomNum(int websocketID)
        {
            // var  
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[0];
            return new PlayerAdd()
            {
                Key = key,
                c = "PlayerAdd",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = 0,
                WebSocketID = websocketID,
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter)
            };
            // throw new NotImplementedException();
        }
        static string CheckParameter = "_add_yrq";
        internal static bool CheckSign(PlayerCheck playerCheck)
        {
            var roomUrl = roomUrls[playerCheck.RoomIndex];
            var check = CommonClass.Random.GetMD5HashFromStr(playerCheck.Key + roomUrl + CheckParameter);
            return playerCheck.Check == check;
        }

        public static async Task<State> GetRoomThenStart(State s, System.Net.WebSockets.WebSocket webSocket)
        {
            /*
             * 单人组队下
             */
            var roomInfo = Room.getRoomNum(s.WebsocketID);
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                {
                    // roomNumber
                    /*
                     * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
                     */
                    roomInfo.FromUrl = "";
                    var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                    var sendData = Encoding.UTF8.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                }
                {
                    //int roomID = 0;
                    //  string sessession = BLL.CheckSessionBLL.getSession();
                    s.Ls = LoginState.OnLine;
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                    var sendData = Encoding.UTF8.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                }

            }
            return s;
        }

        public static async Task<State> GetRoomThenStartAfterCreateTeam(State s, System.Net.WebSockets.WebSocket webSocket, TeamResult team)
        {
            /*
             * 组队，队长状态下，队长点击了开始
             */
            var roomInfo = Room.getRoomNum(s.WebsocketID);
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Team.SetToBegain(team);
            // var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                if (receivedMsg == "ok")
                {
                    {
                        // roomNumber
                        /*
                         * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
                         */
                        roomInfo.FromUrl = "";
                        var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                        var sendData = Encoding.UTF8.GetBytes(msg);
                        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                    }


                    {
                        //int roomID = 0;
                        //  string sessession = BLL.CheckSessionBLL.getSession();
                        s.Ls = LoginState.OnLine;
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                        var sendData = Encoding.UTF8.GetBytes(msg);
                        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
            } 
            return s;
        }

        internal static Task<State> GetRoomThenStartAfterJoinTeam(State s, WebSocket webSocket, string teamID)
        {
            var roomInfo = Room.getRoomNum(s.WebsocketID);
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                {
                    // roomNumber
                    /*
                     * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
                     */
                    roomInfo.FromUrl = "";
                    var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                    var sendData = Encoding.UTF8.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                }
                {
                    //int roomID = 0;
                    //  string sessession = BLL.CheckSessionBLL.getSession();
                    s.Ls = LoginState.OnLine;
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
                    var sendData = Encoding.UTF8.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                }

            }
            return s;
        }
    }


    public class Team
    {
        //  "http://127.0.0.1:11100" + "/notify"
        static string teamUrl = "http://127.0.0.1:11200";
        internal static async Task<TeamResult> createTeam2(int websocketID, string command_start)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamCreate()
            {
                WebSocketID = websocketID,
                c = "TeamCreate",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                CommandStart = command_start
            });
            var result = await Startup.sendInmationToUrlAndGetRes($"{teamUrl}/teamcreate", msg);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<TeamResult>(result);

        }

        internal static async Task<string> SetToBegain(TeamResult team)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamBegain()
            {
                c = "TeamBegain",
                TeamNumber = team.TeamNumber
            });
            var result = await Startup.sendInmationToUrlAndGetRes($"{teamUrl}/teambegain", msg);
            return result;
        }

        internal static Task<TeamFoundResult> findTeam2(int websocketID, string command_start)
        {
            throw new NotImplementedException();
        }
    }
}
