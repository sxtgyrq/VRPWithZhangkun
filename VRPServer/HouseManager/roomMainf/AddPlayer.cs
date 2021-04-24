using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal string AddPlayer(PlayerAdd addItem)
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
                            addItem.PlayerName += "A";
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
                        //others = new Dictionary<string, OtherPlayers>(),
                        PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"business",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        },
                        Collect = -1,
                        //Debts = new Dictionary<string, long>(),
                        //Money = 500 * 100,
                        //  Bust = false,
                        //TaxInPosition = new Dictionary<int, long>(),
                        returningRecord = new Dictionary<string, List<Model.MapGo.nyrqPosition>>()
                        {
                            {"carA",new List<Model.MapGo.nyrqPosition>() },
                            {"carB",new List<Model.MapGo.nyrqPosition>() },
                            {"carC",new List<Model.MapGo.nyrqPosition>() },
                            {"carD",new List<Model.MapGo.nyrqPosition>() },
                            {"carE",new List<Model.MapGo.nyrqPosition>() }
                        },
                        OpenMore = 0,
                        PromoteDiamondCount = new Dictionary<string, int>()
                        {
                            {"mile",0},
                            {"business",0 },
                            {"volume",0 },
                            {"speed",0 }
                        }
                    });
                    this._Players[addItem.Key].initializeCars(addItem.CarsNames, this);
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


    }
}
