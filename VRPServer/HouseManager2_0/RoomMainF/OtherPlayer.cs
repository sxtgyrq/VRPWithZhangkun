using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager2_0.RoomMainF
{
    public partial class RoomMain
    {
        /// <summary>
        /// 新增其他玩家信息，且这些信息是用于web前台展现的。不能用于战斗计分。
        /// </summary>
        /// <param name="key"></param>
        /// <param name="msgsWithUrl"></param>
        private void AddOtherPlayer(string key, ref List<string> msgsWithUrl)
        {
            var players = getGetAllPlayer();
            for (var i = 0; i < players.Count; i++)
            {
                if (players[i].Key == key)
                {
                    /*
                     * 保证自己不会算作其他人
                     */
                }
                else
                {
                    {
                        /*
                         * 告诉自己，场景中有哪些人！
                         * 告诉场景中的其他人，场景中有我！
                         */
                        {
                            var self = this._Players[key];
                            var other = players[i];
                            addPlayerRecord(self, other, ref msgsWithUrl);

                        }
                        {
                            var self = players[i];
                            var other = this._Players[key];
                            addPlayerRecord(self, other, ref msgsWithUrl);
                        }
                    }
                }
            }


        }

        private void addPlayerRecord(Player self, Player other, ref List<string> msgsWithUrl)
        {
            if (self.Key == other.Key)
            {
                return;
            }
            if (self.othersContainsKey(other.Key))
            {

            }
            else
            {
                var otherPlayer = new OtherPlayers(self.Key, other.Key);
                otherPlayer.brokenParameterT1RecordChangedF = self.brokenParameterT1RecordChanged;
                self.othersAdd(other.Key, otherPlayer);
                otherPlayer.setBrokenParameterT1Record(other.brokenParameterT1, ref msgsWithUrl);

                var fp = Program.dt.GetFpByIndex(other.StartFPIndex);
                // fromUrl = this._Players[getPosition.Key].FromUrl;
                var webSocketID = self.WebSocketID;
                //var carsNames = other.ca;

                //  var fp=  players[i].StartFPIndex
                CommonClass.GetOthersPositionNotify_v2 notify = new CommonClass.GetOthersPositionNotify_v2()
                {
                    c = "GetOthersPositionNotify_v2",
                    fp = fp,
                    WebSocketID = webSocketID,
                    key = other.Key,
                    PlayerName = other.PlayerName,
                    fPIndex = other.StartFPIndex,
                    positionInStation = other.positionInStation
                    // var xx=  getPosition.Key
                };
                msgsWithUrl.Add(self.FromUrl);
                msgsWithUrl.Add(Newtonsoft.Json.JsonConvert.SerializeObject(notify));
            }


        }

        internal async Task TellOtherPlayerMyFatigueDegree(string key)
        {

            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                foreach (var item in this._Players)
                {
                    if (item.Key == key) { }
                    else
                    {
                        brokenParameterT1RecordChanged(item.Key, key, this._Players[key].brokenParameterT1, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                // Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
        }

        internal async Task TellMeOtherPlayersFatigueDegree(string selfKey)
        {
            List<string> notifyMsg = new List<string>();
            lock (this.PlayerLock)
            {
                foreach (var item in this._Players)
                {
                    {
                        brokenParameterT1RecordChanged(selfKey, item.Key, item.Value.brokenParameterT1, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                // Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
        }
        private async Task TellMeOthersRightAndDuty(string key)
        {
            List<string> notifyMsg = new List<string>();
            if (this._Players.ContainsKey(key))
            {
                var self = this._Players[key];
                foreach (var item in this._Players)
                {
                    if (item.Key != key)
                    {
                        tellMyRightAndDutyToOther(item.Value, self, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                await Startup.sendMsg(url, sendMsg);
            }
        }
        private void tellMyRightAndDutyToOther(Player self, Player other, ref List<string> notifyMsg)
        {
            /*
             * 三种情况下应该被调用。
             * 第一种情况，启动。
             * 第二种情况，攻击。
             * 第三种情况，参数变更。
             */
            long right;
            int rightPercent;
            long duty;
            int dutyPercent;
            if (self.DebtsContainsKey(other.Key))
            {
                right = self.DebtsGet(other.Key);
                rightPercent = self.DebtsPercent(other.Key);
            }
            else
            {
                right = 0;
                rightPercent = 0;
            }

            if (other.DebtsContainsKey(self.Key))
            {
                duty = other.DebtsGet(self.Key);
                dutyPercent = other.DebtsPercent(self.Key);
            }
            else
            {
                duty = 0;
                dutyPercent = 0;
            }

            var obj = new BradCastRightAndDuty
            {
                c = "BradCastRightAndDuty",
                right = right,
                duty = duty,
                WebSocketID = other.WebSocketID,
                playerKey = self.Key,
                rightPercent = rightPercent,
                dutyPercent = dutyPercent
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            notifyMsg.Add(other.FromUrl);
            notifyMsg.Add(json);
        }

    }
}
