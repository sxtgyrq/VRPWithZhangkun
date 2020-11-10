using System;
using System.Collections.Generic;
using System.Text;

namespace WsOfWebClient
{
    public class State
    {
        public int WebsocketID { get; set; }
        public LoginState Ls { get; set; }

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
