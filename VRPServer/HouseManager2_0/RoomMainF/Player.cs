using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        Dictionary<string, Player> _Players { get; set; }
        internal string UpdatePlayer(PlayerCheck checkItem)
        {
            //   try
            {
                bool success;
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(checkItem.Key))
                    {
                        Program.rm._Players[checkItem.Key].FromUrl = checkItem.FromUrl;
                        Program.rm._Players[checkItem.Key].WebSocketID = checkItem.WebSocketID;

                        //BaseInfomation.rm._Players[checkItem.Key].others = new Dictionary<string, OtherPlayers>();
                        Program.rm._Players[checkItem.Key].initializeOthers();
                        //this.sendPrometeState(checkItem.FromUrl, checkItem.WebSocketID);
                        success = true;
                        Program.rm._Players[checkItem.Key].PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"business",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        };
                        Program.rm._Players[checkItem.Key].CollectPosition = new Dictionary<int, int>()  {
                            { 0,-1},
                            { 1,-1},
                            { 2,-1},
                            { 3,-1},
                            { 4,-1},
                            { 5,-1},
                            { 6,-1},
                            { 7,-1},
                            { 8,-1},
                            { 9,-1},
                            { 10,-1},
                            { 11,-1},
                            { 12,-1},
                            { 13,-1},
                            { 14,-1},
                            { 15,-1},
                            { 16,-1},
                            { 17,-1},
                            { 18,-1},
                            { 19,-1},
                            { 20,-1},
                            { 21,-1},
                            { 22,-1},
                            { 23,-1},
                            { 24,-1},
                            { 25,-1},
                            { 26,-1},
                            { 27,-1},
                            { 28,-1},
                            { 29,-1},
                            { 30,-1},
                            { 31,-1},
                            { 32,-1},
                            { 33,-1},
                            { 34,-1},
                            { 35,-1},
                            { 36,-1},
                            { 37,-1}
                        };
                        Program.rm._Players[checkItem.Key].OpenMore++;
                        Program.rm._Players[checkItem.Key].clearUsedRoad();
                    }
                    else
                    {
                        success = false;
                    }
                }
                if (success)
                {
                    return "ok";
                }
                else
                {
                    return "ng";
                }
            }
            //catch
            //{
            //    return "ng";
            //}
        }

        string AddSuffix = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        internal string AddPlayer(PlayerAdd_V2 addItem)
        {
            bool success;

            List<string> carsState = new List<string>();
            lock (this.PlayerLock)
            {
                addItem.Key = addItem.Key.Trim();
                if (this._Players.ContainsKey(addItem.Key))
                {
                    success = false;
                    return "ng";
                }
                else
                {
                    success = true;

                    bool hasTheSameName = false;
                    do
                    {
                        hasTheSameName = false;
                        foreach (var item in this._Players)
                        {
                            if (item.Value.PlayerName == addItem.PlayerName)
                            {
                                hasTheSameName = true;
                                break;
                            }
                        }
                        if (hasTheSameName)
                        {
                            addItem.PlayerName += AddSuffix[this.rm.Next(0, AddSuffix.Length)];
                        }

                    } while (hasTheSameName);

                    // BaseInfomation.rm.AddPlayer
                    this._Players.Add(addItem.Key, new Player()
                    {
                        Key = addItem.Key,
                        FromUrl = addItem.FromUrl,
                        WebSocketID = addItem.WebSocketID,
                        PlayerName = addItem.PlayerName,

                        CreateTime = DateTime.Now,
                        ActiveTime = DateTime.Now,
                        StartFPIndex = -1,
                        PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"business",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        },
                        //Collect = -1,
                        CollectPosition = new Dictionary<int, int>()
                        {
                            {0,-1},
                            {1,-1},
                            {2,-1},
                            {3,-1},
                            {4,-1},
                            {5,-1},
                            {6,-1},
                            {7,-1},
                            {8,-1},
                            {9,-1},
                            {10,-1},
                            {11,-1},
                            {12,-1},
                            {13,-1},
                            {14,-1},
                            {15,-1},
                            {16,-1},
                            {17,-1},
                            {18,-1},
                            {19,-1},
                            {20,-1},
                            {21,-1},
                            {22,-1},
                            {23,-1},
                            {24,-1},
                            {25,-1},
                            {26,-1},
                            {27,-1},
                            {28,-1},
                            {29,-1},
                            {30,-1},
                            {31,-1},
                            {32,-1},
                            {33,-1},
                            {34,-1},
                            {35,-1},
                            {36,-1},
                            {37,-1}
                        },
                        returningRecord = new List<Model.MapGo.nyrqPosition>(),
                        OpenMore = 0,
                        PromoteDiamondCount = new Dictionary<string, int>()
                        {
                            {"mile",0},
                            {"business",0 },
                            {"volume",0 },
                            {"speed",0 }
                        },
                        positionInStation = this.rm.Next(0, 5)
                    });
                    this._Players[addItem.Key].initializeCar(this);
                    this._Players[addItem.Key].initializeOthers();
                    // this._Players[addItem.Key].SysRemovePlayerByKeyF = BaseInfomation.rm.SysRemovePlayerByKey;
                    //System.Random rm = new System.Random(DateTime.Now.GetHashCode());

                    int fpIndex = this.GetRandomPosition(false); // this.rm.Next(0, Program.dt.GetFpCount());

                    // this._FpOwner.Add(fpIndex, addItem.Key);
                    this._Players[addItem.Key].StartFPIndex = fpIndex;

                    this._Players[addItem.Key].TaxChanged = RoomMain.TaxAdded;
                    this._Players[addItem.Key].TaxInPositionInit();// = RoomMain.TaxAdded;
                    this._Players[addItem.Key].InitializeDebt();


                    //SetMoneyCanSave 在InitializeDebt 之后，MoneySet之前
                    this._Players[addItem.Key].SetMoneyCanSave = RoomMain.SetMoneyCanSave;
                    this._Players[addItem.Key].MoneyChanged = RoomMain.MoneyChanged;
                    var notifyMsgs = new List<string>();
                    this._Players[addItem.Key].MoneySet(500 * 100, ref notifyMsgs);

                    // this._Players[addItem.Key].SupportChangedF = RoomMain.SupportChanged;

                    this._Players[addItem.Key].TheLargestHolderKeyChanged = this.TheLargestHolderKeyChanged;
                    this._Players[addItem.Key].InitializeTheLargestHolder();

                    // this._Players[addItem.Key].Money

                    this._Players[addItem.Key].BustChangedF = this.BustChangedF;
                    this._Players[addItem.Key].SetBust(false, ref notifyMsgs);

                    this._Players[addItem.Key].DrawSingleRoadF = this.DrawSingleRoadF;
                    this._Players[addItem.Key].addUsedRoad(Program.dt.GetFpByIndex(fpIndex).RoadCode, ref notifyMsgs);

                    this._Players[addItem.Key].brokenParameterT1RecordChanged = this.brokenParameterT1RecordChanged;
                    //  this._Players[addItem.Key].DrawSingleRoadF = this.DrawSingleRoadF;
                }
            }

            if (success)
            {

                return "ok";
            }
            else
            {
                return "ng";
            }
            //  throw new NotImplementedException();
        }

        private List<Player> getGetAllPlayer()
        {
            List<Player> players = new List<Player>();
            foreach (var item in this._Players)
            {
                players.Add(item.Value);
            }
            return players;
        }
    }
}
