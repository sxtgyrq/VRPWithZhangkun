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

        internal static PlayerAdd getRoomNum(int websocketID, out int roomIndex)
        {
            roomIndex = 0;
            // var  
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[roomIndex];
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
        private static PlayerAdd getRoomNumByRoom(int websocketID, int roomIndex)
        {
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[roomIndex];
            return new PlayerAdd()
            {
                Key = key,
                c = "PlayerAdd",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = 0,
                WebSocketID = websocketID,
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter)
            };
        }

        public static async Task<State> enterRoomByTeam(string json, State s, WebSocket webSocket)
        {
            var roomNumberResult = Newtonsoft.Json.JsonConvert.DeserializeObject<RoomNumberResult>(json);
#warning,这里从前台传入消息，没有进行Check
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + s.WebsocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[roomNumberResult.RoomIndex];
            var roomInfo = new PlayerAdd()
            {
                Key = key,
                c = "PlayerAdd",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = 0,
                WebSocketID = s.WebsocketID,
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter)
            };
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
                return s;
            }
            return null;
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
            int roomIndex;
            var roomInfo = Room.getRoomNum(s.WebsocketID, out roomIndex);

            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                await WriteSession(roomInfo, webSocket);
                s.roomIndex = roomIndex;
                s = await setOnLine(s, webSocket);

            }
            return s;
        }

        public static async Task<State> setOnLine(State s, WebSocket webSocket)
        {
            var result = await setState(s, webSocket, LoginState.OnLine);

            getRoadInfomation(s);

            return result;
        }

        private static void getRoadInfomation(State s)
        {
            throw new NotImplementedException();
        }

        public static async Task<State> GetRoomThenStartAfterCreateTeam(State s, System.Net.WebSockets.WebSocket webSocket, TeamResult team)
        {
            /*
             * 组队，队长状态下，队长点击了开始
             */
            int roomIndex;
            var roomInfo = Room.getRoomNum(s.WebsocketID, out roomIndex);
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Team.SetToBegain(team, roomIndex);
            // var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                if (receivedMsg == "ok")
                {
                    await WriteSession(roomInfo, webSocket);
                    s.roomIndex = roomIndex;
                    s = await setOnLine(s, webSocket);
                }
            }
            return s;
        }

        internal static bool CheckJoinTeam(PassRoomMd5Check passObj)
        {
            return passObj.CheckMd5 == CommonClass.Random.GetMD5HashFromStr(passObj.StartMd5.Trim() + passObj.RoomIndex.ToString().Trim() + CheckParameter.Trim());
            //  return true;
        }

        internal static async Task<State> GetRoomThenStartAfterJoinTeam(State s, WebSocket webSocket, int roomIndex)
        {
            var roomInfo = Room.getRoomNumByRoom(s.WebsocketID, roomIndex);
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                await WriteSession(roomInfo, webSocket);
                s.roomIndex = roomIndex;
                s = await setOnLine(s, webSocket);
            }
            return s;
        }

        static async Task WriteSession(PlayerAdd roomInfo, WebSocket webSocket)
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

        internal static async Task<State> setState(State s, WebSocket webSocket, LoginState ls)
        {
            s.Ls = ls;
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
            var sendData = Encoding.UTF8.GetBytes(msg);
            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            return s;
        }

        internal static async Task Alert(WebSocket webSocket, string alertMsg)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "Alert", msg = alertMsg });
            var sendData = Encoding.UTF8.GetBytes(msg);
            await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
        }

        internal static bool CheckSecret(string result, string key, out int roomIndex)
        {
            try
            {
                CommonClass.TeamNumWithSecret passObj = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamNumWithSecret>(result);
                var roomNum = CommonClass.AES.AesDecrypt(passObj.Secret, key);
                var ss = roomNum.Split(':');
                Console.WriteLine($"sec:{ss}");
                if (ss[0] == "team")
                {
                    roomIndex = int.Parse(ss[1]);
                    return true;
                }
                else
                {
                    roomIndex = -1;
                    return false;
                }
            }
            catch
            {
                roomIndex = -1;
                return false;
            }
        }
    }


    public class Team
    {
        //  "http://127.0.0.1:11100" + "/notify"
        static string teamUrl = "http://127.0.0.1:11200";
        internal static async Task<TeamResult> createTeam2(int websocketID, string playerName, string command_start)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamCreate()
            {
                WebSocketID = websocketID,
                c = "TeamCreate",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                CommandStart = command_start,
                PlayerName = playerName
            });
            var result = await Startup.sendInmationToUrlAndGetRes($"{teamUrl}/createteam", msg);

            return Newtonsoft.Json.JsonConvert.DeserializeObject<TeamResult>(result);

        }

        internal static async Task<string> SetToBegain(TeamResult team, int roomIndex)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamBegain()
            {
                c = "TeamBegain",
                TeamNum = team.TeamNumber,
                RoomIndex = roomIndex
                //  TeamNumber = team.TeamNumber
            });
            var result = await Startup.sendInmationToUrlAndGetRes($"{teamUrl}/teambegain", msg);
            return result;
        }

        internal static async Task<string> findTeam2(int websocketID, string playerName, string command_start, string teamIndex)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamJoin()
            {
                WebSocketID = websocketID,
                c = "TeamJoin",
                FromUrl = ConnectInfo.ConnectedInfo + "/notify",
                CommandStart = command_start,
                PlayerName = playerName,
                TeamIndex = teamIndex
            });
            string resStr = await Startup.sendInmationToUrlAndGetRes($"{teamUrl}/findTeam", msg);
            return resStr;
            //return Newtonsoft.Json.JsonConvert.DeserializeObject<TeamFoundResult>(json);
        }
    }
}
