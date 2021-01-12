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
                        others = new Dictionary<string, OtherPlayers>(),
                        PromoteState = new Dictionary<string, int>()
                        {
                            {"mile",-1},
                            {"bussiness",-1 },
                            {"volume",-1 },
                            {"speed",-1 }
                        },
                        Collect = -1,
                        Debts = new Dictionary<string, long>(),
                        Money = 500 * 100,
                        Bust = false,
                        TaxInPosition = new Dictionary<int, long>(),
                        returningRecord = new Dictionary<string, List<Model.MapGo.nyrqPosition>>()
                        {
                            {"carA",new List<Model.MapGo.nyrqPosition>() },
                            {"carB",new List<Model.MapGo.nyrqPosition>() },
                            {"carC",new List<Model.MapGo.nyrqPosition>() },
                            {"carD",new List<Model.MapGo.nyrqPosition>() },
                            {"carE",new List<Model.MapGo.nyrqPosition>() }
                        },
                        OpenMore = 0
                    });
                    this._Players[addItem.Key].initializeCars(addItem.CarsNames);
                    //System.Random rm = new System.Random(DateTime.Now.GetHashCode());

                    int fpIndex = this.GetRandomPosition(); // this.rm.Next(0, Program.dt.GetFpCount());

                    this._FpOwner.Add(fpIndex, addItem.Key);
                    this._Players[addItem.Key].StartFPIndex = fpIndex;
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
