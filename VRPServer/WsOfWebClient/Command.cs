using System;
using System.Collections.Generic;
using System.Text;

namespace WsOfWebClient
{

    public class CheckSession : CommonClass.Command
    {
        public string session { get; set; }
    }

    public class MapRoadAndCrossMd5 : CommonClass.Command
    {
        public string mapRoadAndCrossMd5 { get; set; }
    }

    public class JoinGameSingle : CommonClass.Command
    {
    }

    public class CreateTeam : CommonClass.Command
    {
    }

    public class JoinTeam : CommonClass.Command
    {
    }

    public class SetPlayerName : CommonClass.Command
    {
        public string Name { get; set; }
    }
    public class SetCarsName : CommonClass.Command
    {
        public string[] Names { get; set; }
    }

    //public class SetCarName : CommonClass.Command
    //{
    //    public string Name { get; set; }
    //    public int CarIndex { get; set; }
    //}
    public class Promote : CommonClass.Command
    {
        public string pType { get; set; }
        //public string car { get; set; }
    }

    public class Collect : CommonClass.Command
    {
        public string cType { get; set; }
        //public string car { get; set; }
        public string fastenpositionID { get; set; }
        public int collectIndex { get; set; }
    }
    public class Attack : CommonClass.Command
    {
        public int Target { get; set; }
        public string TargetOwner { get; set; }
        //public string car { get; set; }
    }

    public class Bust : Attack
    {
        public int Target { get; set; }
        public string TargetOwner { get; set; }
        //public string car { get; set; }
    }
    public class BuyDiamond : CommonClass.Command
    { 
        public string pType { get; set; } 
         
    }
    public class Tax : CommonClass.Command
    {
        public int Target { get; set; }
        //public string car { get; set; }
    }
    public class Ability : CommonClass.Command
    {
        //  public int Target { get; set; }
        public string pType { get; set; }
        //public string car { get; set; }
    }

    public class SetCarReturn : CommonClass.Command
    {
        //public string car { get; set; }
    }

    public class Donate : CommonClass.Command
    {
        //    objMain.ws.send(JSON.stringify({ c: 'Donate', dType: type, address: address }));
        public string dType { get; set; }
        public string address { get; set; }

    }

    public class GetSubsidize : CommonClass.Command
    {
        //    objMain.ws.send(JSON.stringify({ c: 'Donate', dType: type, address: address }));
        public string signature { get; set; }
        public string address { get; set; }
        public long value { get; set; }

    }

    public class Collect1 : CommonClass.Command
    {
        public string cType { get; set; }
        public string car { get; set; }
    }
    public class Msg : CommonClass.Command
    {
        public string MsgPass { get; set; }
        public string To { get; set; }
    }

}
