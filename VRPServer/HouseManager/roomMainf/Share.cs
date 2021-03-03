using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {
        /*
         *  股份=债务×义务
         */
        //public void getShares()
        //{
        //    var DebtsCopy = player.DebtsCopy;
        //    foreach (var item in DebtsCopy)
        //    {
        //        sumDebet += player.Magnify(item.Value);
        //    }
        //}
        const long ShareBaseValue = 10000;
        /// <summary>
        /// 获取所有债主的股份，这里不包括自己的股份，获取的单位是万分之一
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        private static Dictionary<string, long> GetShares(Player player)
        {
            return player.Shares;

        }

        private void brokenParameterT1RecordChanged(string selfKey, string otherKey, long value, ref List<string> notifyMsg)
        {
            if (this._Players.ContainsKey(selfKey))
            {
                var self = this._Players[selfKey];
                if (this._Players.ContainsKey(otherKey))
                {
                    var other = this._Players[otherKey];
                    var obj = new BradCastSocialResponsibility
                    {
                        c = "BradCastSocialResponsibility",
                        socialResponsibility = value,
                        WebSocketID = self.WebSocketID,
                        otherKey = otherKey
                    };
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    notifyMsg.Add(self.FromUrl);
                    notifyMsg.Add(json);
                }
            }



        }

        /// <summary>
        /// 实际功能是广播责任度。
        /// </summary>
        /// <param name="player"></param>
        /// <param name="value"></param>
        /// <param name="notifyMsg"></param>
        private void SocialResponsibilityChangedF(Player player, long value, ref List<string> notifyMsg)
        {
            var key = player.Key;
            var players = getGetAllPlayer();
            for (var i = 0; i < players.Count; i++)
            {
                if (players[i].Key == key)
                {

                }
                else
                {
                    {
                        /*
                         * 告诉自己，场景中有哪些别人的车！
                         * 告诉别人，场景中有哪些车是我的的！
                         */
                        {
                            //var self = this._Players[key];
                            //var other = players[i];
                            //addPlayerCarRecord(self, other, ref notifyMsg);

                        }
                        {
                            //var self = players[i];
                            //var other = this._Players[key];
                            //addPlayerCarRecord(self, other, ref notifyMsg);
                        }

                    }
                }
            }
            {
                var self = this._Players[key];
                addSelfCarRecord(self, ref notifyMsg);
            }
            //foreach (var item in this._Players)
            //{
            //    var obj = new BradCastSocialResponsibility
            //    {
            //        c = "BradCastSocialResponsibility",
            //        socialResponsibility = value,
            //        WebSocketID = item.Value.WebSocketID,
            //        key = item.Key
            //    };
            //    var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            //    notifyMsg.Add(item.Value.FromUrl);
            //    notifyMsg.Add(json);
            //}
        }
    }
}
