﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public class Listen
    {
        //static TcpListener server;
        //static TcpListener monitorServer;
        internal static void IpAndPort(string hostIP, int tcpPort)
        {
            var dealWith = new TcpFunction.WithResponse.DealWith(DealWith);
            TcpFunction.WithResponse.ListenIpAndPort(hostIP, tcpPort, dealWith);
        }


        internal static void IpAndPortMonitor(string hostIP, int tcpPort)
        {
            var dealWith = new TcpFunction.WithResponse.DealWith(DealWithMonitor);
            TcpFunction.WithResponse.ListenIpAndPort(hostIP, tcpPort, dealWith);
        }

        private static string DealWithMonitorValue(string notifyJson)
        {
            Console.WriteLine($"Monitor notify receive:{notifyJson}");

            string outPut = "haveNothingToReturn";
            {
                //  var notifyJson = returnResult.result;

                // Console.WriteLine($"json:{notifyJson}");


                Console.WriteLine($"monitor receive:{notifyJson}");
                CommonClass.Monitor m = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Monitor>(notifyJson);

                switch (m.c)
                {
                    case "CheckPlayersCarState":
                        {
                            CommonClass.CheckPlayersCarState cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayersCarState>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "CheckPlayersMoney":
                        {
                            CommonClass.CheckPlayersMoney cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayersMoney>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "CheckPlayerCostBusiness":
                        {
                            CommonClass.CheckPlayerCostBusiness cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCostBusiness>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "CheckPromoteDiamondCount":
                        {
                            CommonClass.CheckPromoteDiamondCount cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPromoteDiamondCount>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "CheckPlayerCarPuporse":
                        {
                            CommonClass.CheckPlayerCarPuporse cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCarPuporse>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "CheckPlayerCostVolume":
                        {
                            CommonClass.CheckPlayerCostVolume cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCostVolume>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(cpcs);
                            outPut = result;
                        }; break;
                    case "All":
                        {
                            CommonClass.All all = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.All>(notifyJson);
                            var result = BaseInfomation.rm.Monitor(all);
                            return result;
                        }; break;
                }
            }
            return outPut;
        }
        private static Task<string> DealWithMonitor(string notifyJson)
        {
            return Task.Factory.StartNew(() => DealWithMonitorValue(notifyJson));
        }

        private static async Task<string> DealWith(string notifyJson)
        {
            Console.WriteLine($"notify receive:{notifyJson}");
            // CommonClass.TeamCreateFinish teamCreateFinish = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamCreateFinish>(notifyJson);
            string outPut = "haveNothingToReturn";
            {
                {
                    Console.WriteLine($"json:{notifyJson}");

                    var t = Convert.ToInt32((DateTime.Now - Program.startTime).TotalMilliseconds);
                    //File.AppendAllText("debugLog.txt", Newtonsoft.Json.JsonConvert.SerializeObject
                    //    (
                    //    new { t = t, notifyJson = notifyJson }
                    //    ));
                    File.AppendAllText("debugLog.txt", $"awaitF({t})" + Environment.NewLine);
                    File.AppendAllText("debugLog.txt", $"SendInfomation({notifyJson})" + Environment.NewLine);
                    File.AppendAllText("debugLog.txt", "" + Environment.NewLine);

                    Console.WriteLine($"notify receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "PlayerAdd":
                            {
                                CommonClass.PlayerAdd addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd>(notifyJson);
                                var result = BaseInfomation.rm.AddPlayer(addItem);
                                outPut = result;
                            }; break;
                        case "PlayerCheck":
                            {
                                CommonClass.PlayerCheck checkItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerCheck>(notifyJson);
                                var result = BaseInfomation.rm.UpdatePlayer(checkItem);
                                outPut = result;
                            }; break;
                        case "Map":
                            {
                                CommonClass.Map map = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Map>(notifyJson);
                                switch (map.DataType)
                                {
                                    case "All":
                                        {
                                            //    public void getAll(out List<double[]> meshPoints, out List<object> listOfCrosses)
                                            List<double[]> meshPoints;
                                            List<object> listOfCrosses;
                                            Program.dt.getAll(out meshPoints, out listOfCrosses);
                                            var json = Newtonsoft.Json.JsonConvert.SerializeObject(new { meshPoints = meshPoints, listOfCrosses = listOfCrosses });
                                            outPut = json;
                                        }; break;
                                }
                            }; break;
                        case "GetPosition":
                            {
                                CommonClass.GetPosition getPosition = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.GetPosition>(notifyJson);
                                //string fromUrl; 
                                var GPResult = await BaseInfomation.rm.GetPosition(getPosition);
                                if (GPResult.Success)
                                {
                                    CommonClass.GetPositionNotify notify = new CommonClass.GetPositionNotify()
                                    {
                                        c = "GetPositionNotify",
                                        fp = GPResult.Fp,
                                        WebSocketID = GPResult.WebSocketID,
                                        carsNames = GPResult.CarsNames,
                                        key = getPosition.Key
                                    };

                                    await sendMsg(GPResult.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                                    var notifyMsgs = GPResult.NotifyMsgs;
                                    for (var i = 0; i < notifyMsgs.Count; i += 2)
                                    {
                                        await sendMsg(notifyMsgs[i], notifyMsgs[i + 1]);
                                    }
                                }
                                outPut = "ok";
                            }; break;
                        case "FinishTask":
                            {

                            }; break;
                        case "SetPromote":
                            {
                                CommonClass.SetPromote sp = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetPromote>(notifyJson);
                                var result = await BaseInfomation.rm.updatePromote(sp);
                                outPut = "ok";
                                //await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetCollect":
                            {
                                CommonClass.SetCollect sc = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetCollect>(notifyJson);
                                var result = await BaseInfomation.rm.updateCollect(sc);
                                outPut = "ok";
                                //await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetAttack":
                            {
                                CommonClass.SetAttack sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetAttack>(notifyJson);
                                var result = await BaseInfomation.rm.updateAttack(sa);
                                outPut = "ok";
                                //await context.Response.WriteAsync("ok");
                            }; break;
                        case "SetTax":
                            {
                                CommonClass.SetTax st = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetTax>(notifyJson);
                                var result = await BaseInfomation.rm.updateTax(st);
                                outPut = "ok";
                                //await context.Response.WriteAsync("ok");
                            }; break;
                    }
                }
            }
            {
                return outPut;
            }
        }

        static async Task sendMsg(string fromUrl, string v)
        {
            await Startup.sendMsg(fromUrl, v);
        }

    }
}
