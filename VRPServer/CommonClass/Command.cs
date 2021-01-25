using System;
using System.Collections.Generic;
using System.Text;

namespace CommonClass
{
    public class Command
    {
        public string c { get; set; }
    }
    public class Register : Command
    {
        public string ControllerUrl { get; set; }
    }
    public class Map : Command
    {
        public string DataType { get; set; }
    }

    public class CommandNotify : Command
    {
        public int WebSocketID { get; set; }
    }

    public class GetPositionNotify : CommandNotify
    {
        public Model.FastonPosition fp { get; set; }
        public string[] carsNames { get; set; }
        public string key { get; set; }
        public string PlayerName { get; set; }
    }
    public class GetOthersPositionNotify : CommandNotify
    {
        public Model.FastonPosition fp { get; set; }
        public string[] carsNames { get; set; }
        public string key { get; set; }
        public string PlayerName { get; set; }
        public int fPIndex { get; set; }
    }

    public class TaxNotify : CommandNotify
    {
        public Model.FastonPosition fp { get; set; }
        public long tax { get; set; }
        public int target { get; set; }
    }

    public class BradCastAnimateOfCar : CommandNotify
    {
        public string carID;

        public object Animate { get; set; }
    }
    public class BradCastAnimateOfOthersCar : CommandNotify
    {
        public string carID;

        public object Animate { get; set; }
        public string parentID { get; set; }


    }

    public class BradCastMoneyForSave : CommandNotify
    {
        public long Money { get; set; }
    }
    public class BradCastPromoteDiamondCount : CommandNotify
    {
        public int count { get; set; }
        public string pType { get; set; }
    }

    public class BradCastAnimateOfSelfCar : CommandNotify
    {
        public string carID;

        public object Animate { get; set; }
        public string parentID { get; set; }
        public decimal CostMile { get; set; }
        public int LeftMile { get; set; }
    }
    public class BradCastPromoteInfoDetail : CommandNotify
    {
        /// <summary>
        /// "mile","business","volume","speed"四种状态
        /// </summary>
        public string resultType { get; set; }
        public Model.FastonPosition Fp { get; set; }
        public decimal Price { get; set; }
    }
    public class BradCastCollectInfoDetail : CommandNotify
    {
        public Model.FastonPosition Fp { get; set; }
        public int collectMoney { get; set; }
    }


    public class PlayerAdd : Command
    {
        public string Key { get; set; }
        public string FromUrl { get; set; }
        public int RoomIndex { get; set; }

        public string Check { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
        public string[] CarsNames { get; set; }
    }

    public class PlayerCheck : PlayerAdd { }

    public class GetPosition : Command
    {
        public string Key { get; set; }
    }

    public class SetPromote : Command
    {
        public string Key { get; set; }
        /// <summary>
        /// 取值如mile
        /// </summary>
        public string pType { get; set; }
        public string car { get; set; }
    }
    public class SetCollect : Command
    {
        public string Key { get; set; }
        /// <summary>
        /// 取值如mile
        /// </summary>
        public string cType { get; set; }
        public string car { get; set; }
    }

    public class SetAttack : Command
    {
        public string Key { get; set; }
        public string car { get; set; }
        public string targetOwner { get; set; }
        public int target { get; set; }
    }
    public class SetTax : Command
    {
        public string Key { get; set; }
        public string car { get; set; }
        public int target { get; set; }
    }
    public class GetTax : Command
    {
        public string Key { get; set; }
        public string car { get; set; }
        public string targetOwner { get; set; }
        public int target { get; set; }
    }
    public class GetBtns : Command
    {
        public string FromUrl { get; set; }
        public int RoomIndex { get; set; }
        public int WebSocketID { get; set; }
    }

    public class TeamCreate : Command
    {
        public string FromUrl { get; set; }
        public string CommandStart { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
    }
    public class GetPromoteMiles : CommonClass.Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }
    }

    public class TeamBegain : Command
    {
        public int TeamNum { get; set; }
        public int RoomIndex { get; set; }
    }

    public class TeamJoin : Command
    {
        public string FromUrl { get; set; }
        public string CommandStart { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
        public string TeamIndex { get; set; }

    }

    public class TeamCreateFinish : CommandNotify
    {
        public string CommandStart { get; set; }
        public int TeamNum { get; set; }
        public string PlayerName { get; set; }
    }
    public class TeamJoinBroadInfo : CommandNotify
    {
        public string PlayerName { get; set; }
    }
    public class TeamJoinFinish : CommandNotify
    {
        public int TeamNum { get; set; }
        public List<string> PlayerNames { get; set; }
    }
    public class TeamNumWithSecret : CommandNotify
    {
        public string Secret { get; set; }
    }
    public class TeamResult : Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }
        /// <summary>
        /// 作为队伍的索引
        /// </summary>
        public int TeamNumber { get; set; }
    }
    public class TeamResultForGameBegain : TeamResult
    {
        public int roomIndex { get; set; }
    }

    public class TeamFoundResult : Command
    {
        public bool HasResult { get; set; }
        /// <summary>
        /// 作为队伍的索引
        /// </summary>
        public int TeamNumber { get; set; }
    }
    //public class TeamBegain : Command
    //{
    //    public int TeamNumber { get; set; }
    //}

    public class RoomNumberResult : Command
    {
        public int RoomIndex { get; set; }
        public string PassMd5 { get; set; }
        public string CheckMd5 { get; set; }

    }

    public class DialogMsg : CommandNotify
    {
        public string Key { get; set; }
        public string To { get; set; }
        public string Msg { get; set; }
    }
    public class PassRoomMd5Check
    {
        public int RoomIndex { get; set; }
        public string StartMd5 { get; set; }
        public string CheckMd5 { get; set; }

        public string RoomIndexWithAes { get; set; }
    }
}
