using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        int GetRandomPosition(bool withWeight)
        {
            int index;
            do
            {
                index = rm.Next(0, Program.dt.GetFpCount());
                if (withWeight)
                    if (Program.dt.GetFpByIndex(index).Weight + 1 < rm.Next(100))
                    {
                        continue;
                    }
            }
            while (this.FpIsUsing(index));
            return index;
        }


        private bool FpIsUsing(int fpIndex)
        {

            var A = false
                  || fpIndex == this._promoteMilePosition
                  || fpIndex == this._promoteBusinessPosition
                  || fpIndex == this._promoteVolumePosition
                  || fpIndex == this._promoteSpeedPosition
                  || this._collectPosition.ContainsValue(fpIndex);
            ;
            foreach (var item in this._Players)
            {

                A = item.Value.StartFPIndex == fpIndex || A;
                A = item.Value.getCar().targetFpIndex == fpIndex || A;
            }
            return A;
        }


        public class GetPositionResult
        {
            public bool Success { get; set; }
            public string FromUrl { get; set; }
            public int WebSocketID { get; set; }
            public Model.FastonPosition Fp { get; set; }
            //public string[] CarsNames { get; set; }
            public List<string> NotifyMsgs { get; set; }
            public string PlayerName { get; set; }
            public int positionInStation { get; set; }
        }
        /// <summary>
        /// 用于自己位置的初始化，实际上这个才是真正的初始化！在AddNewPlayer或者update以前，需要将self的others初始化
        /// </summary>
        /// <param name="getPosition">传入参数</param>
        /// <param name="fromUrl">返回的url</param>
        /// <param name="webSocketID">websocketID</param>
        /// <param name="fp">地点</param>
        /// <param name="carsNames"></param>
        /// <returns></returns>
        internal async Task<GetPositionResult> GetPosition(GetPosition getPosition)
        {
            GetPositionResult result;

            int OpenMore = -1;//第一次打开？
            var notifyMsgs = new List<string>();
            lock (this.PlayerLock)
            {
                if (this._Players.ContainsKey(getPosition.Key))
                {
                    var fp = Program.dt.GetFpByIndex(this._Players[getPosition.Key].StartFPIndex);
                    var fromUrl = this._Players[getPosition.Key].FromUrl;
                    var webSocketID = this._Players[getPosition.Key].WebSocketID;
                    //var carsNames = this._Players[getPosition.Key].CarsNames;
                    var playerName = this._Players[getPosition.Key].PlayerName;
                    /*
                     * 这已经走查过，在AddNewPlayer、UpdatePlayer时，others都进行了初始化
                     */
                    AddOtherPlayer(getPosition.Key, ref notifyMsgs);
                    this.brokenParameterT1RecordChanged(getPosition.Key, getPosition.Key, this._Players[getPosition.Key].brokenParameterT1, ref notifyMsgs);
                    GetAllCarInfomationsWhenInitialize(getPosition.Key, ref notifyMsgs);
                    //getAllCarInfomations(getPosition.Key, ref notifyMsgs);
                    OpenMore = this._Players[getPosition.Key].OpenMore;

                    var player = this._Players[getPosition.Key];
                    //var m2 = player.GetMoneyCanSave();

                    //    MoneyCanSaveChanged(player, m2, ref notifyMsgs);

                    SendPromoteCountOfPlayer("mile", player, ref notifyMsgs);
                    SendPromoteCountOfPlayer("business", player, ref notifyMsgs);
                    SendPromoteCountOfPlayer("volume", player, ref notifyMsgs);
                    SendPromoteCountOfPlayer("speed", player, ref notifyMsgs);

                    BroadCoastFrequency(player, ref notifyMsgs);
                    player.SetMoneyCanSave(player, ref notifyMsgs);

                    // player.RunSupportChangedF(ref notifyMsgs);
                    //player.this._Players[addItem.Key].SetMoneyCanSave = RoomMain.SetMoneyCanSave;
                    //MoneyCanSaveChanged(player, player.MoneyForSave, ref notifyMsgs);

                    SendMaxHolderInfoMation(player, ref notifyMsgs);

                    var players = this._Players;
                    foreach (var item in players)
                    {
                        if (item.Value.TheLargestHolderKey == player.Key)
                        {
                            player.TheLargestHolderKeyChanged(item.Key, item.Value.TheLargestHolderKey, item.Key, ref notifyMsgs);
                        }
                    }
                    var list = player.usedRoadsList;
                    for (var i = 0; i < list.Count; i++)
                    {
                        this.DrawSingleRoadF(player, list[i], ref notifyMsgs);
                    }

                    //this._Players[getPosition.Key];
                    this._Players[getPosition.Key].MoneyChanged(this._Players[getPosition.Key], this._Players[getPosition.Key].Money, ref notifyMsgs);

                    result = new GetPositionResult()
                    {
                        Success = true,
                        //CarsNames = carsNames,
                        Fp = fp,
                        FromUrl = fromUrl,
                        NotifyMsgs = notifyMsgs,
                        WebSocketID = webSocketID,
                        PlayerName = playerName,
                        positionInStation = this._Players[getPosition.Key].positionInStation
                    };
                }
                else
                {
                    result = new GetPositionResult()
                    {
                        Success = false
                    };
                }
            }

            if (OpenMore == 0)
            {
                await CheckAllPromoteState(getPosition.Key);
                await CheckCollectState(getPosition.Key);
                await sendCarAbilityState(getPosition.Key);
                await sendCarStateAndPurpose(getPosition.Key);
                await TellOtherPlayerMyFatigueDegree(getPosition.Key);
                await TellMeOtherPlayersFatigueDegree(getPosition.Key);
                await TellMeOthersRightAndDuty(getPosition.Key);
            }
            else if (OpenMore > 0)
            {
                await CheckAllPromoteState(getPosition.Key);
                await CheckCollectState(getPosition.Key);
                await SendAllTax(getPosition.Key);

                await sendCarAbilityState(getPosition.Key);
                await sendCarStateAndPurpose(getPosition.Key);
                await TellOtherPlayerMyFatigueDegree(getPosition.Key);
                await TellMeOtherPlayersFatigueDegree(getPosition.Key);
                await TellMeOthersRightAndDuty(getPosition.Key);
                //   await sendPlayerFatigueDegree(getPosition.Key);
                //for(var i=0;i<)
                //AbilityChanged(player, car, ref notifyMsg, "business");
                //AbilityChanged(player, car, ref notifyMsg, "volume");
                //AbilityChanged(player, car, ref notifyMsg, "mile");
            }
            return result;
        }
    }
}
