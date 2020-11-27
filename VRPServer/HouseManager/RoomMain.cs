using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public class RoomMain
    {
        Dictionary<string, Player> _Players { get; set; }
        public RoomMain()
        {
            lock (PlayerLock)
            {
                this._Players = new Dictionary<string, Player>();
                this._FpOwner = new Dictionary<int, string>();
                //this._PlayerFp = new Dictionary<string, int>();
            }
        }
        object PlayerLock = new object();
        Dictionary<int, string> _FpOwner { get; set; }
        Dictionary<string, int> _PlayerFp { get; set; }

        internal string AddPlayer(PlayerAdd addItem)
        {
            lock (this.PlayerLock)
            {
                addItem.Key = addItem.Key.Trim();
                if (this._Players.ContainsKey(addItem.Key))
                {
                    return "ng";
                }
                else
                {
                    // BaseInfomation.rm.AddPlayer
                    this._Players.Add(addItem.Key, new Player()
                    {
                        Key = addItem.Key,
                        FromUrl = addItem.FromUrl,
                        WebSocketID = addItem.WebSocketID,
                        PlayerName = addItem.PlayerName,
                        CarsNames = addItem.CarsNames,
                        CreateTime = DateTime.Now,
                        ActiveTime = DateTime.Now,
                        StartFPIndex = -1
                    });
                    System.Random rm = new System.Random(DateTime.Now.GetHashCode());

                    var fpIndex = rm.Next(0, Program.dt.GetFpCount());
                    do
                    {
                        fpIndex = rm.Next(0, Program.dt.GetFpCount());
                    }
                    while (this._FpOwner.ContainsKey(fpIndex));
                    this._FpOwner.Add(fpIndex, addItem.Key);
                    this._Players[addItem.Key].StartFPIndex = fpIndex;
                    return "ok";
                }
            }
            //  throw new NotImplementedException();
        }

        internal string UpdatePlayer(PlayerCheck checkItem)
        {
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(checkItem.Key))
                {
                    BaseInfomation.rm._Players[checkItem.Key].FromUrl = checkItem.FromUrl;
                    BaseInfomation.rm._Players[checkItem.Key].WebSocketID = checkItem.WebSocketID;
                    return "ok";
                }
                else
                {
                    return "ng";
                }
            }
        }

        internal bool GetPosition(GetPosition getPosition, out string fromUrl, out int webSocketID, out Model.FastonPosition fp)
        {
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(getPosition.Key))
                {
                    fp = Program.dt.GetFpByIndex(this._Players[getPosition.Key].StartFPIndex);
                    fromUrl = this._Players[getPosition.Key].FromUrl;
                    webSocketID = this._Players[getPosition.Key].WebSocketID;
                    return true;
                }
                else
                {
                    fp = null;
                    fromUrl = null;
                    webSocketID = -1;
                    return false;
                }
            }

        }
    }
}
