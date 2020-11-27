using System;
using System.Collections.Generic;
using System.Text;

namespace WsOfWebClient
{
    public class State
    {
        public int WebsocketID { get; set; }
        public LoginState Ls { get; set; }
        public int roomIndex { get; set; }
        public string mapRoadAndCrossMd5 { get; internal set; }
        
        /// <summary>
        /// AddPlayer产生的唯一ID
        /// </summary>
        public string Key { get; internal set; }
    }
    public enum LoginState
    {
        empty,
        selectSingleTeamJoin,
        OnLine,
        WaitingToStart,
        WaitingToGetTeam
    }
}
