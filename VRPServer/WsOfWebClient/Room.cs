﻿using CommonClass;
using System;
using System.Collections.Generic;
using System.IO;
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

        internal static PlayerAdd getRoomNum(int websocketID, string playerName, string[] carsNames, out int roomIndex)
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
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter),
                PlayerName = playerName,
                CarsNames = carsNames
            };
            // throw new NotImplementedException();
        }
        private static PlayerAdd getRoomNumByRoom(int websocketID, int roomIndex, string playerName, string[] carsNames)
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
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter),
                CarsNames = carsNames,
                PlayerName = playerName
            };
        }


        static string CheckParameter = "_add_yrq";
        internal static bool CheckSign(PlayerCheck playerCheck)
        {
            var roomUrl = roomUrls[playerCheck.RoomIndex];
            var check = CommonClass.Random.GetMD5HashFromStr(playerCheck.Key + roomUrl + CheckParameter);
            return playerCheck.Check == check;
        }

        public static async Task<State> GetRoomThenStart(State s, System.Net.WebSockets.WebSocket webSocket, string playerName, string[] carsNames)
        {
            /*
             * 单人组队下
             */
            int roomIndex;
            var roomInfo = Room.getRoomNum(s.WebsocketID, playerName, carsNames, out roomIndex);
            s.Key = roomInfo.Key;
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
            //var result = await setState(s, webSocket, LoginState.OnLine);
            // string json;
            if (string.IsNullOrEmpty(ConnectInfo.mapRoadAndCrossJson))
            {
                ConnectInfo.mapRoadAndCrossJson = await getRoadInfomation(s);
                Console.WriteLine($"获取ConnectInfo.mapRoadAndCrossJson json的长度为{ConnectInfo.mapRoadAndCrossJson.Length}");
            }
            else
            {
                // json = ConnectInfo.mapRoadAndCrossJson;
            }




            {


                //Console.WriteLine($"获取json的长度为{ConnectInfo.mapRoadAndCrossJson.Length}");

                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "start" });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

                for (var i = 0; i < ConnectInfo.mapRoadAndCrossJson.Length; i += 1000)
                {
                    var passStr = ConnectInfo.mapRoadAndCrossJson.Substring(i, (i + 1000) <= ConnectInfo.mapRoadAndCrossJson.Length ? 1000 : (ConnectInfo.mapRoadAndCrossJson.Length % 1000));
                    msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "mid", passStr = passStr });
                    sendData = Encoding.ASCII.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                }

                msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "end" });
                sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }

            if (ConnectInfo.RobotBase64.Length == 0)
            {
                string car1m, car2m, car3m, car4m, obj, mtl;
                {
                    var bytes = File.ReadAllBytes("Car_01.png");
                    var Base64 = Convert.ToBase64String(bytes);
                    car1m = Base64;
                }
                {
                    var bytes = File.ReadAllBytes("Car_02.png");
                    var Base64 = Convert.ToBase64String(bytes);
                    car2m = Base64;
                }
                {
                    var bytes = File.ReadAllBytes("Car_03.png");
                    var Base64 = Convert.ToBase64String(bytes);
                    car3m = Base64;
                }
                {
                    var bytes = File.ReadAllBytes("Car_04.png");
                    var Base64 = Convert.ToBase64String(bytes);
                    car4m = Base64;
                }
                {
                    mtl = File.ReadAllText("Car1.mtl"); ;
                }
                {
                    obj = File.ReadAllText("Car1.obj"); ;
                }
                ConnectInfo.RobotBase64 = new string[] { obj, mtl, car1m, car2m, car3m, car4m };
            }
            else
            {
                // json = ConnectInfo.mapRoadAndCrossJson;
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRobot",
                    modelBase64 = ConnectInfo.RobotBase64
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }

            var result = await setState(s, webSocket, LoginState.OnLine);

            await initializeOperation(s);

            //    passRobotInfomation(s);

            return result;
        }



        private async static Task initializeOperation(State s)
        {
            // var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            //   var roomUrl = roomUrls[s.roomIndex];
            var getPosition = new GetPosition()
            {
                c = "GetPosition",
                Key = s.Key
            };
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
            var result = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);

        }

        private async static Task<string> getRoadInfomation(State s)
        {
            var m = new Map()
            {
                c = "Map",
                DataType = "All"
            };
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(m);
            var result = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
            return result;
        }

        public static async Task<State> GetRoomThenStartAfterCreateTeam(State s, System.Net.WebSockets.WebSocket webSocket, TeamResult team, string playerName, string[] carsNames)
        {
            /*
             * 组队，队长状态下，队长点击了开始
             */
            int roomIndex;
            var roomInfo = Room.getRoomNum(s.WebsocketID, playerName, carsNames, out roomIndex);
            s.Key = roomInfo.Key;
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

        internal static async Task<State> GetRoomThenStartAfterJoinTeam(State s, WebSocket webSocket, int roomIndex, string playerName, string[] carsNames)
        {
            var roomInfo = Room.getRoomNumByRoom(s.WebsocketID, roomIndex, playerName, carsNames);
            s.Key = roomInfo.Key;
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
