using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal async Task<string> SetAbility(SetAbility sa)
        {
            if (string.IsNullOrEmpty(sa.car))
            {
                return "wrong car";
            }
            else if (!(sa.car == "carA" || sa.car == "carB" || sa.car == "carC" || sa.car == "carD" || sa.car == "carE"))
            {
                return $"wrong car:{sa.car}";
            }
            else if (string.IsNullOrEmpty(sa.pType))
            {
                return $"wrong pType:{sa.pType}";
            }
            else if (!(sa.pType == "mile" || sa.pType == "business" || sa.pType == "volume" || sa.pType == "speed"))
            {
                return $"wrong pType:{sa.pType}"; ;
            }
            else
            {

                List<string> notifyMsg = new List<string>();
                lock (this.PlayerLock)
                {
                    if (this._Players.ContainsKey(sa.Key))
                    {
                        var carIndex = getCarIndex(sa.car);
                        var player = this._Players[sa.Key];
                        var car = player.getCar(carIndex);
                        if (player.Bust)
                        {
                            WebNotify(player, "您已破产");
                            return $"{player.Key} go bust!";
#warning 这里要提示前台，已经进行破产清算了。
                        }
                        else
                        {
                                switch (sa.pType)
                                {
                                    case "mile":
                                    case "business":
                                    case "volume":
                                    case "speed":
                                        {
                                            if (player.PromoteDiamondCount[sa.pType] > 0)
                                            {
                                                car.ability.AbilityAdd(sa.pType, player, car, ref notifyMsg);
                                                player.PromoteDiamondCount[sa.pType]--;
                                                SendPromoteCountOfPlayer(sa.pType, player, ref notifyMsg);
                                            }
                                        }; break;
                                }
                        }
                    }
                    else 
                    {
                         return $"not has player-{sa.Key}!";
                    }

                }
                for (var i = 0; i < notifyMsg.Count; i += 2)
                {
                    var url = notifyMsg[i];
                    var sendMsg = notifyMsg[i + 1];
                    Console.WriteLine($"url:{url}");

                    await Startup.sendMsg(url, sendMsg);
                }
                return "ok";
            }
        }

        //  enum CostOrSum { Cost, Sum }
        /// <summary>
        /// 这里要通知前台，值发生了变化。
        /// </summary>
        /// <param name="player"></param>
        /// <param name="car"></param>
        /// <param name="notifyMsgs"></param>
        /// <param name="pType"></param>
        public static void AbilityChanged2_0(Player player, Car car, ref List<string> notifyMsgs, string pType)
        {
            var carIndexStr = car.IndexString;
            long costValue = 0;
            long sumValue = 1;
            switch (pType)
            {
                case "mile":
                    {
                        costValue = car.ability.costMiles;
                        sumValue = car.ability.mile;
                    }; break;
                case "business":
                    {
                        costValue = car.ability.costBusiness;
                        sumValue = car.ability.Business;
                    }; break;
                case "volume":
                    {
                        costValue = car.ability.costVolume;
                        sumValue = car.ability.Volume;
                    }; break;
                case "speed":
                    {
                        sumValue = car.ability.Speed;
                        costValue = car.ability.Speed;
                    }; break;
            }
            var obj = new BradCastAbility
            {
                c = "BradCastAbility",
                WebSocketID = player.WebSocketID,
                pType = pType,
                carIndexStr = carIndexStr,
                costValue = costValue,
                sumValue = sumValue
            };
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            notifyMsgs.Add(player.FromUrl);
            notifyMsgs.Add(json);
        }

    }
}
