using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MateWsAndHouse
{
    class Startup
    {
        /*
         * 单用户web端单人点击单人--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 返回 房间号
         * 单用户web端单人点击组队--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 创建队伍->等待队伍加入-->返回房间号
         * 单用户web端单人点击加入--(发送请求)-->websocket端（附带ws notify地址，websocketID）--> 创建队伍->等待队伍加入-->返回房间号
         */

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy(name: "MyPolicy",
                    builder =>
                    {
                        builder.WithOrigins("http://*");
                    });
            });
        }
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(3600 * 24),
                ReceiveBufferSize = 1024 * 1024 * 20
            };
            app.UseWebSockets(webSocketOptions);

            app.Map("/createteam", createTeam);
            app.Map("/teambegain", teambegain);
            app.Map("/findTeam", findTeam);
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //app.UseWebSockets();
            //// app.useSt(); // For the wwwroot folder
            ////app.UseStaticFiles(new StaticFileOptions
            ////{
            ////    FileProvider = new PhysicalFileProvider(
            ////"F:\\MyProject\\VRPWithZhangkun\\MainApp\\VRPWithZhangkun\\VRPServer\\WebApp\\webHtml"),
            ////    RequestPath = "/StaticFiles"
            ////});

            ////app.Map("/postinfo", HandleMapdownload);
            //var webSocketOptions = new WebSocketOptions()
            //{
            //    KeepAliveInterval = TimeSpan.FromSeconds(60000 * 1000),
            //    ReceiveBufferSize = 1024 * 1000
            //};
            //app.UseWebSockets(webSocketOptions);
            ////  app.Map("/websocket", WebSocket);


            //app.Map("/websocket", builder =>
            //{
            //    builder.Use(async (context, next) =>
            //    {
            //        if (context.WebSockets.IsWebSocketRequest)
            //        {

            //            {
            //                //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");
            //                var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            //                await Echo(webSocket);
            //            }
            //        }

            //        await next();
            //    });
            //});
            //app.Map()
        }

        private void single(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                var fromUrl = context.Request.Form["fromUrl"];
                var wsocketID = context.Request.Form["wsocketID"];
                int roomNum = 0;

                var result = new { ok = "ok" };
                await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(result));

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    command = "single",
                    wsocketID = wsocketID,
                    roomNum = roomNum
                });
                await sendMsg(fromUrl, json);
                // HttpClient hc= new HttpClient(ne)
                //if (context.WebSockets.IsWebSocketRequest)
                //{

                //    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                //    //Task task = new Task(() => SendMsg(webSocket));
                //    //task.Start();
                //    // BufferImage.webSockets.Add(webSocket);
                //    await Echo(webSocket);
                //    //  Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}--累计登陆{sumVisitor},当前在线{sumVisitor - sumLeaver}");


                //}
            });
        }

        private void createTeam(IApplicationBuilder app)
        {
            //app.Run(async context =>
            //{

            //});
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await dealWithCreateTeam(webSocket);
                }
            });
            return;

            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await dealWithCreateTeam(webSocket);
                }
            });
            return;

            app.Run(async context =>
            {
                if (context.Request.Method.ToLower() == "post")
                {
                    var notifyJson = getBodyStr(context);

                    Console.WriteLine($"createTeam receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamCreate":
                            {
                                CommonClass.TeamCreate teamCreate = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamCreate>(notifyJson);
                                int indexV;
                                lock (Program.teamLock)
                                {
                                    int maxValue = 10;
                                    //int indexV;
                                    do
                                    {
                                        indexV = Program.rm.Next(0, maxValue);
                                        maxValue *= 2;
                                    } while (Program.allTeams.ContainsKey(indexV));

                                    Program.allTeams.Add(indexV, new Team()
                                    {
                                        captain = teamCreate,
                                        CreateTime = DateTime.Now,
                                        TeamID = indexV,
                                        member = new List<CommonClass.TeamJoin>(),
                                        IsBegun = false
                                    });

                                    //Program.allTeams.Add()
                                }
                                var teamCreateFinish = new CommonClass.TeamCreateFinish()
                                {
                                    c = "TeamCreateFinish",
                                    CommandStart = teamCreate.CommandStart,
                                    TeamNum = indexV,
                                    WebSocketID = teamCreate.WebSocketID,
                                    PlayerName = teamCreate.PlayerName
                                };
                                await sendMsg(teamCreate.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(teamCreateFinish));
                                //await (prot)
                                // await sendInmationToUrl(addItem.FromUrl, notifyJson);
                                CommonClass.TeamResult t = new CommonClass.TeamResult()
                                {
                                    c = "TeamResult",
                                    FromUrl = teamCreate.FromUrl,
                                    TeamNumber = indexV,
                                    WebSocketID = teamCreate.WebSocketID
                                };
                                await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(t));
                            }; break;
                    }
                }
            });
        }

        private async Task dealWithCreateTeam(System.Net.WebSockets.WebSocket webSocketFromGameHandler)
        {
            WebSocketReceiveResult Wrr;
            do
            {
                var returnResult = await ReceiveStringAsync(webSocketFromGameHandler, 1024 * 1024 * 10);

                Wrr = returnResult.wr;
                //returnResult.wr;
                string outPut = "haveNothingToReturn";
                {
                    var notifyJson = returnResult.result;

                    // var notifyJson = getBodyStr(context);

                    Console.WriteLine($"createTeam receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamCreate":
                            {
                                CommonClass.TeamCreate teamCreate = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamCreate>(notifyJson);
                                int indexV;
                                lock (Program.teamLock)
                                {
                                    int maxValue = 10;
                                    //int indexV;
                                    do
                                    {
                                        indexV = Program.rm.Next(0, maxValue);
                                        maxValue *= 2;
                                    } while (Program.allTeams.ContainsKey(indexV));

                                    Program.allTeams.Add(indexV, new Team()
                                    {
                                        captain = teamCreate,
                                        CreateTime = DateTime.Now,
                                        TeamID = indexV,
                                        member = new List<CommonClass.TeamJoin>(),
                                        IsBegun = false
                                    });

                                    //Program.allTeams.Add()
                                }
                                var teamCreateFinish = new CommonClass.TeamCreateFinish()
                                {
                                    c = "TeamCreateFinish",
                                    CommandStart = teamCreate.CommandStart,
                                    TeamNum = indexV,
                                    WebSocketID = teamCreate.WebSocketID,
                                    PlayerName = teamCreate.PlayerName
                                };
                                await sendMsg(teamCreate.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(teamCreateFinish));
                                //await (prot)
                                // await sendInmationToUrl(addItem.FromUrl, notifyJson);
                                CommonClass.TeamResult t = new CommonClass.TeamResult()
                                {
                                    c = "TeamResult",
                                    FromUrl = teamCreate.FromUrl,
                                    TeamNumber = indexV,
                                    WebSocketID = teamCreate.WebSocketID
                                };
                                outPut = Newtonsoft.Json.JsonConvert.SerializeObject(t);
                            }; break;
                    }
                }
                {
                    var sendData = Encoding.UTF8.GetBytes(outPut);
                    await webSocketFromGameHandler.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            } while (!Wrr.CloseStatus.HasValue);
        }

        public class ReceiveObj
        {
            public WebSocketReceiveResult wr { get; set; }
            public string result { get; set; }
        }
        public static async Task<ReceiveObj> ReceiveStringAsync(System.Net.WebSockets.WebSocket socket, int size, CancellationToken ct = default(CancellationToken))
        {
            var buffer = new ArraySegment<byte>(new byte[size]);
            WebSocketReceiveResult result;
            using (var ms = new MemoryStream())
            {
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if (result.MessageType != WebSocketMessageType.Text)
                {
                    return new ReceiveObj()
                    {
                        result = null,
                        wr = result
                    };
                }
                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    var strValue = await reader.ReadToEndAsync();
                    return new ReceiveObj()
                    {
                        result = strValue,
                        wr = result
                    };
                }
            }
        }


        private void teambegain(IApplicationBuilder app)
        {
            //app.Run(async context =>
            //{

            //});
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await dealWithTeamBegain(webSocket);
                }
            });
            return;

            app.Run(async context =>
            {
                if (context.Request.Method.ToLower() == "post")
                {
                    // await context.Response.WriteAsync("ok");
                    var notifyJson = getBodyStr(context);

                    Console.WriteLine($"teambegain receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamBegain":
                            {
                                CommonClass.TeamBegain teamBegain = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamBegain>(notifyJson);

                                Team t = null;
                                lock (Program.teamLock)
                                {

                                    if (Program.allTeams.ContainsKey(teamBegain.TeamNum))
                                    {
                                        t = Program.allTeams[teamBegain.TeamNum];
                                    }
                                    //Program.allTeams.Add()
                                }
                                if (t == null)
                                {
                                    await context.Response.WriteAsync("ng");
                                }
                                else
                                {
                                    for (var i = 0; i < t.member.Count; i++)
                                    {
                                        var secret = CommonClass.AES.AesEncrypt("team:" + teamBegain.RoomIndex.ToString(), t.member[i].CommandStart);
                                        CommonClass.TeamNumWithSecret teamNumWithSecret = new CommonClass.TeamNumWithSecret()
                                        {
                                            c = "TeamNumWithSecret",
                                            WebSocketID = t.member[i].WebSocketID,
                                            Secret = secret
                                        };
                                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(teamNumWithSecret);
                                        await sendMsg(t.captain.FromUrl, json);
                                    }
                                    t.IsBegun = true;
                                    await context.Response.WriteAsync("ok");
                                }
                            }; break;
                    }
                }
            });
        }

        private async Task dealWithTeamBegain(WebSocket webSocketFromGameHandler)
        {
            WebSocketReceiveResult Wrr;
            do
            {
                var returnResult = await ReceiveStringAsync(webSocketFromGameHandler, 1024 * 1024 * 10);

                Wrr = returnResult.wr;
                //returnResult.wr;
                string outPut = "haveNothingToReturn";
                {
                    var notifyJson = returnResult.result;

                    // var notifyJson = getBodyStr(context);

                    Console.WriteLine($"createTeam receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamBegain":
                            {
                                CommonClass.TeamBegain teamBegain = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamBegain>(notifyJson);

                                Team t = null;
                                lock (Program.teamLock)
                                {

                                    if (Program.allTeams.ContainsKey(teamBegain.TeamNum))
                                    {
                                        t = Program.allTeams[teamBegain.TeamNum];
                                    }
                                    //Program.allTeams.Add()
                                }
                                if (t == null)
                                {
                                    outPut = "ng";
                                }
                                else
                                {
                                    for (var i = 0; i < t.member.Count; i++)
                                    {
                                        var secret = CommonClass.AES.AesEncrypt("team:" + teamBegain.RoomIndex.ToString(), t.member[i].CommandStart);
                                        CommonClass.TeamNumWithSecret teamNumWithSecret = new CommonClass.TeamNumWithSecret()
                                        {
                                            c = "TeamNumWithSecret",
                                            WebSocketID = t.member[i].WebSocketID,
                                            Secret = secret
                                        };
                                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(teamNumWithSecret);
                                        await sendMsg(t.captain.FromUrl, json);
                                    }
                                    t.IsBegun = true;
                                    outPut = "ok";
                                }
                            }; break;
                    }
                }
                {
                    var sendData = Encoding.UTF8.GetBytes(outPut);
                    await webSocketFromGameHandler.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            } while (!Wrr.CloseStatus.HasValue);
        }

        private void findTeam(IApplicationBuilder app)
        {
            //app.Run(async context =>
            //{

            //});
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await dealWithFindTeam(webSocket);
                }
            });
            return;

            app.Run(async context =>
            {
                if (context.Request.Method.ToLower() == "post")
                {
                    //  await context.Response.WriteAsync("ok");
                    var notifyJson = getBodyStr(context);

                    Console.WriteLine($"findTeam receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamJoin":
                            {
                                /*
                                 * TeamJoin,如果传入的字段不是数字，返回 is not number
                                 * TeamJoin,如果传入的字段如果是数字，不存在这个队伍 返回not has the team
                                 * TeamJoin,如果队伍中人数已满，不存在这个队伍 返回team is full
                                 *  
                                 */
                                CommonClass.TeamJoin teamJoin = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamJoin>(notifyJson);
                                int teamIndex;
                                if (int.TryParse(teamJoin.TeamIndex, out teamIndex))
                                {
                                    bool memberIsFull = false;
                                    bool notHasTheTeam = false;
                                    Team t = null;
                                    lock (Program.teamLock)
                                    {
                                        if (Program.allTeams.ContainsKey(teamIndex))
                                        {
                                            if (Program.allTeams[teamIndex].member.Count >= 4)
                                            {
                                                memberIsFull = true;
                                            }
                                            else
                                            {
                                                Program.allTeams[teamIndex].member.Add(teamJoin);
                                                t = Program.allTeams[teamIndex];
                                            }

                                        }
                                        else
                                        {
                                            notHasTheTeam = true;
                                        }
                                    }
                                    if (memberIsFull)
                                    {
                                        await context.Response.WriteAsync("team is full");
                                    }
                                    else if (notHasTheTeam)
                                    {
                                        await context.Response.WriteAsync("not has the team");
                                    }
                                    else if (t.IsBegun)
                                    {
                                        //t.IsBegun 必须在判断 notHasTheTeam 之后。否则t可能为null
                                        await context.Response.WriteAsync("game has begun");
                                    }
                                    else
                                    {

                                        var PlayerNames = new List<string>();
                                        CommonClass.TeamJoinFinish teamJoinFinish = new CommonClass.TeamJoinFinish()
                                        {
                                            c = "TeamJoinFinish",
                                            PlayerNames = new List<string>(),
                                            TeamNum = t.TeamID,
                                            WebSocketID = teamJoin.WebSocketID
                                            //  PlayerNames = 
                                        };
                                        {
                                            CommonClass.TeamJoinBroadInfo addInfomation = new CommonClass.TeamJoinBroadInfo()
                                            {
                                                c = "TeamJoinBroadInfo",
                                                PlayerName = teamJoin.PlayerName,
                                                WebSocketID = t.captain.WebSocketID
                                            };
                                            await sendMsg(t.captain.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(addInfomation));
                                        }
                                        teamJoinFinish.PlayerNames.Add(t.captain.PlayerName);
                                        for (var i = 0; i < t.member.Count; i++)
                                        {
                                            teamJoinFinish.PlayerNames.Add(t.member[i].PlayerName);
                                            if (t.member[i].FromUrl == teamJoin.FromUrl && t.member[i].WebSocketID == teamJoin.WebSocketID)
                                            {

                                            }
                                            else
                                            {
                                                CommonClass.TeamJoinBroadInfo addInfomation = new CommonClass.TeamJoinBroadInfo()
                                                {
                                                    c = "TeamJoinBroadInfo",
                                                    PlayerName = teamJoin.PlayerName,
                                                    WebSocketID = t.member[i].WebSocketID
                                                };
                                                await sendMsg(t.member[i].FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(addInfomation));
                                            }
                                        }

                                        await sendMsg(teamJoin.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(teamJoinFinish));

                                        await context.Response.WriteAsync("ok");
                                        // t.captain.
                                        //await context.Response.WriteAsync("not has the team");
                                    }
                                }
                                else
                                {
                                    await context.Response.WriteAsync("is not number");
                                }
                            }; break;
                    }
                    //switch (c.c)
                    //{
                    //    case "TeamCreate":
                    //        {
                    //            CommonClass.TeamCreate teamCreate = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamCreate>(notifyJson);
                    //            int indexV;
                    //            lock (Program.teamLock)
                    //            {
                    //                int maxValue = 10;
                    //                //int indexV;
                    //                do
                    //                {
                    //                    indexV = Program.rm.Next(0, maxValue);
                    //                    maxValue *= 2;
                    //                } while (Program.allTeams.ContainsKey(indexV));

                    //                Program.allTeams.Add(indexV, new Team()
                    //                {
                    //                    captain = teamCreate,
                    //                    CreateTime = DateTime.Now,
                    //                    TeamID = indexV
                    //                });

                    //                //Program.allTeams.Add()
                    //            }
                    //            var teamCreateFinish = new CommonClass.TeamCreateFinish()
                    //            {
                    //                c = "TeamCreateFinish",
                    //                CommandStart = teamCreate.CommandStart,
                    //                TeamNum = indexV,
                    //                WebSocketID = teamCreate.WebSocketID,
                    //                PlayerName = teamCreate.PlayerName
                    //            };
                    //            await sendMsg(teamCreate.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(teamCreateFinish));
                    //            //await (prot)
                    //            // await sendInmationToUrl(addItem.FromUrl, notifyJson);
                    //            CommonClass.TeamResult t = new CommonClass.TeamResult()
                    //            {
                    //                c = "TeamResult",
                    //                FromUrl = teamCreate.FromUrl,
                    //                TeamNumber = indexV,
                    //                WebSocketID = teamCreate.WebSocketID
                    //            };
                    //            await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(t));
                    //        }; break;
                    //}
                }
            });
        }

        private async Task dealWithFindTeam(WebSocket webSocketFromGameHandler)
        {
            WebSocketReceiveResult Wrr;
            do
            {
                var returnResult = await ReceiveStringAsync(webSocketFromGameHandler, 1024 * 1024 * 10);

                Wrr = returnResult.wr;
                //returnResult.wr;
                string outPut = "haveNothingToReturn";
                {
                    var notifyJson = returnResult.result;

                    // var notifyJson = getBodyStr(context);

                    Console.WriteLine($"createTeam receive:{notifyJson}");
                    CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);

                    switch (c.c)
                    {
                        case "TeamJoin":
                            {
                                /*
                                 * TeamJoin,如果传入的字段不是数字，返回 is not number
                                 * TeamJoin,如果传入的字段如果是数字，不存在这个队伍 返回not has the team
                                 * TeamJoin,如果队伍中人数已满，不存在这个队伍 返回team is full
                                 *  
                                 */
                                CommonClass.TeamJoin teamJoin = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.TeamJoin>(notifyJson);
                                int teamIndex;
                                if (int.TryParse(teamJoin.TeamIndex, out teamIndex))
                                {
                                    bool memberIsFull = false;
                                    bool notHasTheTeam = false;
                                    Team t = null;
                                    lock (Program.teamLock)
                                    {
                                        if (Program.allTeams.ContainsKey(teamIndex))
                                        {
                                            if (Program.allTeams[teamIndex].member.Count >= 4)
                                            {
                                                memberIsFull = true;
                                            }
                                            else
                                            {
                                                Program.allTeams[teamIndex].member.Add(teamJoin);
                                                t = Program.allTeams[teamIndex];
                                            }

                                        }
                                        else
                                        {
                                            notHasTheTeam = true;
                                        }
                                    }
                                    if (memberIsFull)
                                    {
                                        outPut = "team is full";
                                        // await context.Response.WriteAsync("");
                                    }
                                    else if (notHasTheTeam)
                                    {
                                        outPut = "not has the team";
                                        //await context.Response.WriteAsync("");
                                    }
                                    else if (t.IsBegun)
                                    {
                                        outPut = "game has begun";
                                        //t.IsBegun 必须在判断 notHasTheTeam 之后。否则t可能为null
                                        //  await context.Response.WriteAsync("");
                                    }
                                    else
                                    {

                                        var PlayerNames = new List<string>();
                                        CommonClass.TeamJoinFinish teamJoinFinish = new CommonClass.TeamJoinFinish()
                                        {
                                            c = "TeamJoinFinish",
                                            PlayerNames = new List<string>(),
                                            TeamNum = t.TeamID,
                                            WebSocketID = teamJoin.WebSocketID
                                            //  PlayerNames = 
                                        };
                                        {
                                            CommonClass.TeamJoinBroadInfo addInfomation = new CommonClass.TeamJoinBroadInfo()
                                            {
                                                c = "TeamJoinBroadInfo",
                                                PlayerName = teamJoin.PlayerName,
                                                WebSocketID = t.captain.WebSocketID
                                            };
                                            await sendMsg(t.captain.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(addInfomation));
                                        }
                                        teamJoinFinish.PlayerNames.Add(t.captain.PlayerName);
                                        for (var i = 0; i < t.member.Count; i++)
                                        {
                                            teamJoinFinish.PlayerNames.Add(t.member[i].PlayerName);
                                            if (t.member[i].FromUrl == teamJoin.FromUrl && t.member[i].WebSocketID == teamJoin.WebSocketID)
                                            {

                                            }
                                            else
                                            {
                                                CommonClass.TeamJoinBroadInfo addInfomation = new CommonClass.TeamJoinBroadInfo()
                                                {
                                                    c = "TeamJoinBroadInfo",
                                                    PlayerName = teamJoin.PlayerName,
                                                    WebSocketID = t.member[i].WebSocketID
                                                };
                                                await sendMsg(t.member[i].FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(addInfomation));
                                            }
                                        }

                                        await sendMsg(teamJoin.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(teamJoinFinish));
                                        outPut = "ok";
                                        //  await context.Response.WriteAsync("ok");
                                        // t.captain.
                                        //await context.Response.WriteAsync("not has the team");
                                    }
                                }
                                else
                                {
                                    outPut = "is not number";
                                    // await context.Response.WriteAsync("");
                                }
                            }; break;
                    }
                }
                {
                    var sendData = Encoding.UTF8.GetBytes(outPut);
                    await webSocketFromGameHandler.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            } while (!Wrr.CloseStatus.HasValue);
        }

        public static string getBodyStr(HttpContext context)
        {
            string requestContent;
            using (var requestReader = new StreamReader(context.Request.Body, Encoding.UTF8))
            {
                requestContent = requestReader.ReadToEnd();

            }
            return requestContent;

        }
        static Dictionary<string, ClientWebSocket> _sockets = new Dictionary<string, ClientWebSocket>();

        private static async Task sendMsg(string fromUrl, string json)
        {

#warning 这里必须要处理，防止 websocket服务挂了，导致此处退不出报错！
            for (var i = 0; i < 3; i++)
            {
                {
                    if (_sockets.ContainsKey(fromUrl))
                    {
                        if ((!_sockets[fromUrl].CloseStatus.HasValue) && _sockets[fromUrl].State == WebSocketState.Open)
                        {
                        }
                        else
                        {
                            _sockets[fromUrl] = null;
                            _sockets[fromUrl] = new ClientWebSocket();


                            await _sockets[fromUrl].ConnectAsync(new Uri(fromUrl), CancellationToken.None);
                        }
                    }
                    else
                    {
                        _sockets.Add(fromUrl, new ClientWebSocket());
                        await _sockets[fromUrl].ConnectAsync(new Uri(fromUrl), CancellationToken.None);

                        //if (result)
                        //{ }
                        //else
                        //{
                        //    _sockets.Remove(roomUrl);
                        //}
                        // await _sockets[roomUrl].ConnectAsync(new Uri(roomUrl), CancellationToken.None);

                    }
                }
                //  while (!_sockets[roomUrl].CloseStatus.HasValue);
                try
                {
                    var sendData = Encoding.UTF8.GetBytes(json);
                    await _sockets[fromUrl].SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                    break;
                }
                catch (Exception e)
                {
                    _sockets.Remove(fromUrl);
                    Console.WriteLine($"{fromUrl}连接失败！");
                    continue;
                }
                return;
            }
            if (_sockets.ContainsKey(fromUrl))
            {
                if (_sockets[fromUrl].State == WebSocketState.Open)
                {
                }
                else
                {
                    _sockets[fromUrl] = null;
                    _sockets[fromUrl] = new ClientWebSocket();
                    await _sockets[fromUrl].ConnectAsync(new Uri(fromUrl), CancellationToken.None);
                }
            }
        }

        //private void sendMsg(Microsoft.Extensions.Primitives.StringValues fromUrl, string json)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
