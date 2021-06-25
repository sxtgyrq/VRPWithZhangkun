using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0
{
    public class Listen
    {
        internal static void IpAndPort(string hostIP, int tcpPort)
        {
            var dealWith = new TcpFunction.WithResponse.DealWith(DealWith);
            TcpFunction.WithResponse.ListenIpAndPort(hostIP, tcpPort, dealWith);
        }
        private static async Task<string> DealWith(string notifyJson)
        {
            Console.WriteLine($"notify receive:{notifyJson}");
            File.AppendAllText("log/d.txt", $"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}-{notifyJson}{Environment.NewLine}");
            //File.AppendText("",)
            // CommonClass.TeamCreateFinish teamCreateFinish = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamCreateFinish>(notifyJson);
            string outPut = "haveNothingToReturn";
            {
                CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                switch (c.c)
                {
                    case "PlayerAdd_V2":
                        {
                            CommonClass.PlayerAdd_V2 addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd_V2>(notifyJson);
                            var result = Program.rm.AddPlayer(addItem);
                            outPut = result;
                        }; break;
                    case "GetPosition":
                        {
                            CommonClass.GetPosition getPosition = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.GetPosition>(notifyJson);
                            //string fromUrl; 
                            var GPResult = await Program.rm.GetPosition(getPosition);
                            if (GPResult.Success)
                            {
                                CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                                {
                                    c = "GetPositionNotify_v2",
                                    fp = GPResult.Fp,
                                    WebSocketID = GPResult.WebSocketID,
                                    key = getPosition.Key,
                                    PlayerName = GPResult.PlayerName,
                                    positionInStation = GPResult.positionInStation
                                };

                                await Startup.sendMsg(GPResult.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                                var notifyMsgs = GPResult.NotifyMsgs;
                                for (var i = 0; i < notifyMsgs.Count; i += 2)
                                {
                                    await Startup.sendMsg(notifyMsgs[i], notifyMsgs[i + 1]);
                                }
                            }
                            outPut = "ok";
                        }; break;
                    case "SetPromote":
                        {
                            CommonClass.SetPromote sp = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetPromote>(notifyJson);
                            var result = await Program.rm.updatePromote(sp);
                            outPut = "ok";
                            //await context.Response.WriteAsync("ok");
                        }; break;
                    case "SetAbility":
                        {
                            CommonClass.SetAbility sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetAbility>(notifyJson);
                            await Program.rm.SetAbility(sa);
                            outPut = "ok";
                        }; break;
                    case "PlayerCheck":
                        {
                            CommonClass.PlayerCheck checkItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerCheck>(notifyJson);
                            var result = Program.rm.UpdatePlayer(checkItem);
                            outPut = result;
                        }; break;
                    case "SetCollect":
                        {
                            CommonClass.SetCollect sc = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetCollect>(notifyJson);
                            var result = await Program.rm.updateCollect(sc);
                            outPut = "ok";
                            //await context.Response.WriteAsync("ok");
                        }; break;
                    case "SetAttack":
                        {
                            CommonClass.SetAttack sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetAttack>(notifyJson);
                            var result = await Program.rm.updateAttack(sa);
                            outPut = "ok";
                            //await context.Response.WriteAsync("ok");
                        }; break;
                    case "SetBust":
                        {
                            CommonClass.SetBust sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetBust>(notifyJson);
                            var result = await Program.rm.updateBust(sa);
                            outPut = "ok";
                            //await context.Response.WriteAsync("ok");
                        }; break;
                    case "GetFrequency":
                        {
                            outPut = Program.rm.GetFrequency().ToString();
                        }; break;
                    case "OrderToReturn":
                        {
                            CommonClass.OrderToReturn otr = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.OrderToReturn>(notifyJson);
                            await Program.rm.OrderToReturn(otr);
                            outPut = "ok";
                        }; break;
                    case "SaveMoney":
                        {
                            CommonClass.SaveMoney saveMoney = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SaveMoney>(notifyJson);
                            await Program.rm.SaveMoney(saveMoney);
                            outPut = "ok";
                        }; break;
                    case "SetTax":
                        {
                            CommonClass.SetTax st = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetTax>(notifyJson);
                            var result = await Program.rm.updateTax(st);
                            outPut = "ok";
                            //await context.Response.WriteAsync("ok");
                        }; break;
                    case "MarketPrice":
                        {
                            CommonClass.MarketPrice sa = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.MarketPrice>(notifyJson);

                            Program.rm.Market.Update(sa);
                        }; break;
                    case "SetBuyDiamond":
                        {
                            CommonClass.SetBuyDiamond bd = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetBuyDiamond>(notifyJson);

                            Program.rm.Buy(bd);
                        }; break;
                    case "SetSellDiamond":
                        {
                            CommonClass.SetSellDiamond ss = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.SetSellDiamond>(notifyJson);

                            Program.rm.Sell(ss);
                        }; break;
                    case "OrderToSubsidize":
                        {
                            CommonClass.OrderToSubsidize ots = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.OrderToSubsidize>(notifyJson);
                            await Program.rm.OrderToSubsidize(ots);
                            outPut = "ok";
                        }; break;
                    case "DialogMsg":
                        {
                            CommonClass.DialogMsg dm = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.DialogMsg>(notifyJson);
                            await Program.rm.SendMsg(dm);
                            outPut = "ok";
                        }; break;
                }
            }
            {
                return outPut;
            }
        }

        internal static void IpAndPortMonitor(string hostIP, int tcpPort)
        {
            var dealWith = new TcpFunction.WithResponse.DealWith(DealWithMonitor);
            TcpFunction.WithResponse.ListenIpAndPort(hostIP, tcpPort, dealWith);
        }
        private static async Task<string> DealWithMonitor(string notifyJson)
        {
            return await Task.Run(() => DealWithMonitorValue(notifyJson));
        }

        private static string DealWithMonitorValue(string notifyJson)
        {
            Console.WriteLine($"Monitor notify receive:{notifyJson}");

            string outPut = "haveNothingToReturn";
            //{
            //    //  var notifyJson = returnResult.result;

            //    // Console.WriteLine($"json:{notifyJson}");


            //    Console.WriteLine($"monitor receive:{notifyJson}");
            //    CommonClass.Monitor m = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Monitor>(notifyJson);

            //    switch (m.c)
            //    {
            //        case "CheckPlayersCarState":
            //            {
            //                CommonClass.CheckPlayersCarState cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayersCarState>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "CheckPlayersMoney":
            //            {
            //                CommonClass.CheckPlayersMoney cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayersMoney>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "CheckPlayerCostBusiness":
            //            {
            //                CommonClass.CheckPlayerCostBusiness cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCostBusiness>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "CheckPromoteDiamondCount":
            //            {
            //                CommonClass.CheckPromoteDiamondCount cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPromoteDiamondCount>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "CheckPlayerCarPuporse":
            //            {
            //                CommonClass.CheckPlayerCarPuporse cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCarPuporse>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "CheckPlayerCostVolume":
            //            {
            //                CommonClass.CheckPlayerCostVolume cpcs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CheckPlayerCostVolume>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(cpcs);
            //                outPut = result;
            //            }; break;
            //        case "All":
            //            {
            //                CommonClass.All all = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.All>(notifyJson);
            //                var result = BaseInfomation.rm.Monitor(all);
            //                return result;
            //            }; break;

            //    }
            //}
            return outPut;
        }
    }
}
