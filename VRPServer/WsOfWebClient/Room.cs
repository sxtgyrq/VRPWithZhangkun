using CommonClass;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace WsOfWebClient
{
    public class Room
    {
        //public static List<string> roomUrls = new List<string>()
        //{
        //    "127.0.0.1:11100"
        //};
        //public static List<string> roomUrls = new List<string>()
        //{
        //    "10.80.52.218:11100",//10.80.52.218
        //    "10.80.52.218:11200",//10.80.52.218
        //};
        public static List<string> roomUrls
        {
            get
            {
                if (DebugInLocalHost)
                {
                    return new List<string>()
                    {
                        "127.0.0.1:11100"
                    };
                }
                else
                {
                    return new List<string>()
                    {
                        "10.80.52.218:11100",//10.80.52.218
                        "10.80.52.218:11200",//10.80.52.218
                    };
                }
            }
        }
        private static bool DebugInLocalHost = true;
        private static System.Random rm = new System.Random(DateTime.Now.GetHashCode());
        public static void SetWhenStart()
        {
            Console.WriteLine("是否以debug形式运行(y/n)");
            var input = Console.ReadLine().ToUpper().Trim();
            if (input == "Y" || input == "YES")
            {
                DebugInLocalHost = true;
            }
            else if (input == "N" || input == "NO")
            {
                DebugInLocalHost = false;
            }
        }
        internal static async Task<PlayerAdd> getRoomNum(int websocketID, string playerName, string[] carsNames)
        {
            int roomIndex = 0;
            if (DebugInLocalHost)
            {
                roomIndex = 0;
            }
            else
            {
                var index1 = rm.Next(roomUrls.Count);
                var index2 = rm.Next(roomUrls.Count);
                if (index1 == index2)
                {
                    roomIndex = index1;
                }
                else
                {
                    var frequency1 = await getFrequency(Room.roomUrls[index1]); ; //Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                    var frequency2 = await getFrequency(Room.roomUrls[index2]);
                    //这里的2000，极值是1/6Hz(2000)。极限是1/4Hz(3000)
                    var value1 = frequency1 < 2000 ? frequency1 : Math.Max(1, 6000 - 2 * frequency1);
                    var value2 = frequency2 < 2000 ? frequency2 : Math.Max(1, 6000 - 2 * frequency2);
                    var sumV = value1 + value2;
                    var rIndex = rm.Next(sumV);
                    if (rIndex < value1)
                    {
                        roomIndex = index1;
                    }
                    else
                    {
                        roomIndex = index2;
                    }
                }
            }
            // var  
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.HostIP + websocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[roomIndex];
            return new PlayerAdd()
            {
                Key = key,
                c = "PlayerAdd",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",// ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = roomIndex,
                WebSocketID = websocketID,
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter),
                PlayerName = playerName,
                CarsNames = carsNames
            };
            // throw new NotImplementedException();
        }

        private static async Task<int> getFrequency(string roomUrl)
        {
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(new GetFrequency()
            {
                c = "GetFrequency",

            });
            var result = await Startup.sendInmationToUrlAndGetRes(roomUrl, sendMsg);

            return int.Parse(result);
        }

        private static PlayerAdd getRoomNumByRoom(int websocketID, int roomIndex, string playerName, string[] carsNames)
        {
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.HostIP + websocketID + DateTime.Now.ToString());
            var roomUrl = roomUrls[roomIndex];
            return new PlayerAdd()
            {
                Key = key,
                c = "PlayerAdd",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",// ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = roomIndex,
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
            var roomInfo = await Room.getRoomNum(s.WebsocketID, playerName, carsNames);
            roomIndex = roomInfo.RoomIndex;
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

        /// <summary>
        /// 起到一个承前启后的作用，好些功能需要在这个参数里加载。包括后台，包括前台！
        /// </summary>
        /// <param name="s"></param>
        /// <param name="webSocket"></param>
        /// <returns></returns>
        public static async Task<State> setOnLine(State s, WebSocket webSocket)
        {
            State result;
            //var result = await setState(s, webSocket, LoginState.OnLine);
            // string json;
            {
                if (string.IsNullOrEmpty(ConnectInfo.mapRoadAndCrossJson))
                {
                    ConnectInfo.mapRoadAndCrossJson = await getRoadInfomation(s);
                    Console.WriteLine($"获取ConnectInfo.mapRoadAndCrossJson json的长度为{ConnectInfo.mapRoadAndCrossJson.Length}");
                }
                if (false)
                {
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "start" });
                    var sendData = Encoding.ASCII.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                    {
                        #region 校验响应
                        var checkIsOk = await CheckRespon(webSocket, "MapRoadAndCrossJson,start");
                        if (checkIsOk) { }
                        else
                        {
                            return null;
                        }
                        #endregion
                    }

                    for (var i = 0; i < ConnectInfo.mapRoadAndCrossJson.Length; i += 1000)
                    {
                        var passStr = ConnectInfo.mapRoadAndCrossJson.Substring(i, (i + 1000) <= ConnectInfo.mapRoadAndCrossJson.Length ? 1000 : (ConnectInfo.mapRoadAndCrossJson.Length % 1000));
                        msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "mid", passStr = passStr });
                        sendData = Encoding.ASCII.GetBytes(msg);
                        await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

                        {
                            #region 校验响应
                            var checkIsOk = await CheckRespon(webSocket, "MapRoadAndCrossJson,mid");
                            if (checkIsOk) { }
                            else
                            {
                                return null;
                            }
                            #endregion
                        }
                    }

                    msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "MapRoadAndCrossJson", action = "end" });
                    sendData = Encoding.ASCII.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

                    {
                        #region 校验响应
                        var checkIsOk = await CheckRespon(webSocket, "MapRoadAndCrossJson,end");
                        if (checkIsOk) { }
                        else
                        {
                            return null;
                        }
                        #endregion
                    }
                }

                if (ConnectInfo.RobotBase64.Length == 0)
                {
                    string obj, mtl, carA, carB, carC, carD, carE;
                    {
                        var bytes = File.ReadAllBytes("Car_A.png");
                        var Base64 = Convert.ToBase64String(bytes);
                        carA = Base64;
                    }
                    {
                        var bytes = File.ReadAllBytes("Car_B.png");
                        var Base64 = Convert.ToBase64String(bytes);
                        carB = Base64;
                    }
                    {
                        var bytes = File.ReadAllBytes("Car_C.png");
                        var Base64 = Convert.ToBase64String(bytes);
                        carC = Base64;
                    }
                    {
                        var bytes = File.ReadAllBytes("Car_D.png");
                        var Base64 = Convert.ToBase64String(bytes);
                        carD = Base64;
                    }
                    {
                        var bytes = File.ReadAllBytes("Car_E.png");
                        var Base64 = Convert.ToBase64String(bytes);
                        carE = Base64;
                    }
                    {
                        mtl = File.ReadAllText("Car1.mtl"); ;
                    }
                    {
                        obj = File.ReadAllText("Car1.obj"); ;
                    }
                    ConnectInfo.RobotBase64 = new string[] { obj, mtl, carA, carB, carC, carD, carE };
                }
                else
                {
                    // json = ConnectInfo.mapRoadAndCrossJson;
                }
                {
                    /*
                     * 前台的汽车模型
                     */
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        c = "SetRobot",
                        modelBase64 = ConnectInfo.RobotBase64
                    });
                    var sendData = Encoding.ASCII.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

                    {
                        #region 校验响应
                        var checkIsOk = await CheckRespon(webSocket, "SetRobot");
                        if (checkIsOk) { }
                        else
                        {
                            return null;
                        }
                        #endregion
                    }
                }
                {
                    var checkIsOk = await addRMB(webSocket);
                    if (checkIsOk) { }
                    else
                    {
                        return null;
                    }
                }


                if (string.IsNullOrEmpty(ConnectInfo.DiamondObj))
                {
                    ConnectInfo.DiamondObj = await File.ReadAllTextAsync("diamond.obj");
                }
                {
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        c = "SetDiamond",
                        DiamondObj = ConnectInfo.DiamondObj
                    });
                    var sendData = Encoding.ASCII.GetBytes(msg);
                    await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

                    {
                        #region 校验响应
                        var checkIsOk = await CheckRespon(webSocket, "SetDiamond");
                        if (checkIsOk) { }
                        else
                        {
                            return null;
                        }
                        #endregion
                    }
                }
                result = await setState(s, webSocket, LoginState.OnLine);

                {
                    #region 校验响应
                    var checkIsOk = await CheckRespon(webSocket, "SetOnLine");
                    if (checkIsOk) { }
                    else
                    {
                        return null;
                    }
                    #endregion
                }
                await initializeOperation(s);
            }
            return result;
        }

        /// <summary>
        /// 校验网页的回应！
        /// </summary>
        /// <param name="webSocket"></param>
        /// <param name="v"></param>
        /// <returns></returns>
        private static async Task<bool> CheckRespon(WebSocket webSocket, string checkValue)
        {
            var resultAsync = await Startup.ReceiveStringAsync(webSocket);
            if (resultAsync.result == checkValue)
            {
                return true;
            }
            else
            {
                Console.WriteLine($"{resultAsync.result}校验{checkValue}失败！");
                await webSocket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "错误的回话", new CancellationToken());
                return false;
            }
        }

        /// <summary>
        /// 增加金钱模型
        /// </summary>
        /// <param name="webSocket"></param>
        /// <returns></returns>
        private static async Task<bool> addRMB(WebSocket webSocket)
        {
            if (ConnectInfo.YuanModel == "")
            {
                string obj;
                obj = File.ReadAllText("rmb/rmb100.obj");
                ConnectInfo.YuanModel = obj;
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.YuanModel,
                    faceValue = "model"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk) { }
                else
                {
                    return false;
                }
            }
            #endregion

            if (ConnectInfo.RMB100.Length == 0)
            {
                string mtl, rmbJpg;
                {
                    var bytes = File.ReadAllBytes("rmb/rmb100.jpg");
                    var Base64 = Convert.ToBase64String(bytes);
                    rmbJpg = Base64;
                }
                {
                    mtl = File.ReadAllText("rmb/rmb100.mtl");
                }
                ConnectInfo.RMB100 = new string[] { mtl, rmbJpg };
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.RMB100,
                    faceValue = "rmb100"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk) { }
                else
                {
                    return false;
                }
            }
            #endregion

            if (ConnectInfo.RMB50.Length == 0)
            {
                string mtl, rmbJpg;
                {
                    var bytes = File.ReadAllBytes("rmb/rmb50.jpg");
                    var Base64 = Convert.ToBase64String(bytes);
                    rmbJpg = Base64;
                }
                {
                    mtl = File.ReadAllText("rmb/rmb50.mtl");
                }
                ConnectInfo.RMB50 = new string[] { mtl, rmbJpg };
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.RMB50,
                    faceValue = "rmb50"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk) { }
                else
                {
                    return false;
                }
            }
            #endregion

            if (ConnectInfo.RMB20.Length == 0)
            {
                string mtl, rmbJpg;
                {
                    var bytes = File.ReadAllBytes("rmb/rmb20.jpg");
                    var Base64 = Convert.ToBase64String(bytes);
                    rmbJpg = Base64;
                }
                {
                    mtl = File.ReadAllText("rmb/rmb20.mtl");
                }
                ConnectInfo.RMB20 = new string[] { mtl, rmbJpg };
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.RMB20,
                    faceValue = "rmb20"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk) { }
                else
                {
                    return false;
                }
            }
            #endregion

            if (ConnectInfo.RMB10.Length == 0)
            {
                string mtl, rmbJpg;
                {
                    var bytes = File.ReadAllBytes("rmb/rmb10.jpg");
                    var Base64 = Convert.ToBase64String(bytes);
                    rmbJpg = Base64;
                }
                {
                    mtl = File.ReadAllText("rmb/rmb10.mtl");
                }
                ConnectInfo.RMB10 = new string[] { mtl, rmbJpg };
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.RMB10,
                    faceValue = "rmb10"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);

            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk) { }
                else
                {
                    return false;
                }
            }
            #endregion

            if (ConnectInfo.RMB5.Length == 0)
            {
                string mtl, rmbJpg;
                {
                    var bytes = File.ReadAllBytes("rmb/rmb5.jpg");
                    var Base64 = Convert.ToBase64String(bytes);
                    rmbJpg = Base64;
                }
                {
                    mtl = File.ReadAllText("rmb/rmb5.mtl");
                }
                ConnectInfo.RMB5 = new string[] { mtl, rmbJpg };
            }
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    c = "SetRMB",
                    modelBase64 = ConnectInfo.RMB5,
                    faceValue = "rmb5"
                });
                var sendData = Encoding.ASCII.GetBytes(msg);
                await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }
            #region 校验响应
            {
                var checkIsOk = await CheckRespon(webSocket, "SetRMB");
                if (checkIsOk)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            #endregion
        }

        internal static async Task<string> setCarReturn(State s, SetCarReturn scr)
        {

            {
                Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");
                var m = r.Match(scr.car);
                // var m_Target = rex_Target.Match(attack.TargetOwner);
                if (m.Success)//&& m_Target.Success)
                {
                    //   var targetOwner = m_Target.Groups["target"].Value;

                    Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                    if (m.Groups["key"].Value == s.Key)
                    {
                        var getPosition = new OrderToReturn()
                        {
                            c = "OrderToReturn",
                            Key = s.Key,
                            car = "car" + m.Groups["car"].Value,
                        };
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                        await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                    }
                }
                return "";
            }
        }

        internal static async Task GetSubsidize(State s, GetSubsidize getSubsidize)
        {
            Regex r = new Regex("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
            if (r.IsMatch(getSubsidize.signature))
            {
                var getPosition = new OrderToSubsidize()
                {
                    c = "OrderToSubsidize",
                    Key = s.Key,
                    address = getSubsidize.address,
                    signature = getSubsidize.signature,
                    value = getSubsidize.value
                };
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
            }

            //throw new NotImplementedException();
        }

        internal static async Task<string> setBust(State s, Bust bust)
        {
            Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");
            Regex rex_Target = new Regex("^(?<target>[a-f0-9]{32})$");

            var m = r.Match(bust.car);
            var m_Target = rex_Target.Match(bust.TargetOwner);
            if (m.Success && m_Target.Success)
            {
                var targetOwner = m_Target.Groups["target"].Value;

                Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                if (m.Groups["key"].Value == s.Key)
                {
                    var getPosition = new SetBust()
                    {
                        c = "SetBust",
                        Key = s.Key,
                        car = "car" + m.Groups["car"].Value,
                        targetOwner = targetOwner,
                        target = bust.Target
                    };
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                    await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                }
            }
            return "";
        }

        internal static async Task<string> Donate(State s, Donate donate)
        {
            var sm = new SaveMoney()
            {
                c = "SaveMoney",
                Key = s.Key,
                address = donate.address,
                dType = donate.dType
            };
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(sm);
            await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
            return "";
        }

        internal static async Task<string> setCarAbility(State s, Ability a)
        {
            if (!(a.pType == "mile" || a.pType == "business" || a.pType == "volume" || a.pType == "speed"))
            {
                return "";
            }
            else
            {
                Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");
                var m = r.Match(a.car);
                // var m_Target = rex_Target.Match(attack.TargetOwner);
                if (m.Success)//&& m_Target.Success)
                {
                    //   var targetOwner = m_Target.Groups["target"].Value;

                    Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                    if (m.Groups["key"].Value == s.Key)
                    {
                        var getPosition = new SetAbility()
                        {
                            c = "SetAbility",
                            Key = s.Key,
                            car = "car" + m.Groups["car"].Value,
                            pType = a.pType
                        };
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                        await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                    }
                }
                return "";
            }
        }

        internal static async Task<string> passMsg(State s, Msg msg)
        {
            var dialogMsg = new DialogMsg()
            {
                c = "DialogMsg",
                Key = s.Key,
                Msg = msg.MsgPass,
                To = msg.To,
            };
            var msgString = Newtonsoft.Json.JsonConvert.SerializeObject(dialogMsg);
            //Room.roomUrls[s.roomIndex]
            var result = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msgString);
            return result;
            //var result = await Startup.sendInmationToUrlAndGetRes(s.roomIndex, msg);
        }



        /// <summary>
        /// 发送此命令，必在await setState(s, webSocket, LoginState.OnLine) 之后。两者是在前台是依托关系！
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        private async static Task initializeOperation(State s)
        {
            // var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            // var roomUrl = roomUrls[s.roomIndex];
            var getPosition = new GetPosition()
            {
                c = "GetPosition",
                Key = s.Key
            };
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
            var result = await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);

        }
        internal static async Task<string> setToCollectTax(State s, Tax tax)
        {
            Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");
            //   Regex rex_Target = new Regex("^(?<target>[a-f0-9]{32})$");

            var m = r.Match(tax.car);
            // var m_Target = rex_Target.Match(attack.TargetOwner);
            if (m.Success)//&& m_Target.Success)
            {
                //   var targetOwner = m_Target.Groups["target"].Value;

                Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                if (m.Groups["key"].Value == s.Key)
                {
                    var getPosition = new SetTax()
                    {
                        c = "SetTax",
                        Key = s.Key,
                        car = "car" + m.Groups["car"].Value,
                        target = tax.Target
                    };
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                    await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                }
            }
            return "";
        }

        internal static async Task<string> setAttack(State s, Attack attack)
        {
            Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");
            Regex rex_Target = new Regex("^(?<target>[a-f0-9]{32})$");

            var m = r.Match(attack.car);
            var m_Target = rex_Target.Match(attack.TargetOwner);
            if (m.Success && m_Target.Success)
            {
                var targetOwner = m_Target.Groups["target"].Value;

                Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                if (m.Groups["key"].Value == s.Key)
                {
                    var getPosition = new SetAttack()
                    {
                        c = "SetAttack",
                        Key = s.Key,
                        car = "car" + m.Groups["car"].Value,
                        targetOwner = targetOwner,
                        target = attack.Target
                    };
                    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                    await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                }
            }
            return "";
            throw new NotImplementedException();
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
            var roomInfo = await Room.getRoomNum(s.WebsocketID, playerName, carsNames);
            roomIndex = roomInfo.RoomIndex;
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

        internal static async Task<string> setPromote(State s, Promote promote)
        {
            if (promote.pType == "mile" || promote.pType == "business" || promote.pType == "volume" || promote.pType == "speed")
            {
                // string A = "carA_bb6a1ef1cb8c5193bec80b7752c6d54c";
                // A = Console.ReadLine();
                Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");

                var m = r.Match(promote.car);
                if (m.Success)
                {
                    Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                    if (m.Groups["key"].Value == s.Key)
                    {
                        var getPosition = new SetPromote()
                        {
                            c = "SetPromote",
                            Key = s.Key,
                            car = "car" + m.Groups["car"].Value,
                            pType = promote.pType
                        };
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                        await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                    }
                }

                //var "carA_bb6a1ef1cb8c5193bec80b7752c6d54c"

            }
            return "";
        }


        internal static async Task<string> setCollect(State s, Collect collect)
        {
            if (collect.cType == "findWork")
            {
                // string A = "carA_bb6a1ef1cb8c5193bec80b7752c6d54c";
                // A = Console.ReadLine();
                Regex r = new Regex("^car(?<car>[A-E]{1})_(?<key>[a-f0-9]{32})$");

                var m = r.Match(collect.car);
                if (m.Success)
                {
                    Console.WriteLine($"正则匹配成功：{m.Groups["car"] }+{m.Groups["key"] }");
                    if (m.Groups["key"].Value == s.Key)
                    {
                        var getPosition = new SetCollect()
                        {
                            c = "SetCollect",
                            Key = s.Key,
                            car = "car" + m.Groups["car"].Value,
                            cType = collect.cType
                        };
                        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
                        await Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);
                    }
                }
            }
            return "";
        }
    }


    public class Team
    {
        //  "http://127.0.0.1:11100" + "/notify"
        static string teamUrl = "127.0.0.1:11200";
        internal static async Task<TeamResult> createTeam2(int websocketID, string playerName, string command_start)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamCreate()
            {
                WebSocketID = websocketID,
                c = "TeamCreate",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",//ConnectInfo.ConnectedInfo + "/notify",
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
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",// ConnectInfo.ConnectedInfo + "/notify",
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
