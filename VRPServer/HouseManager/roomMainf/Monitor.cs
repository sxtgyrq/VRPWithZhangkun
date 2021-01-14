﻿using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;

namespace HouseManager
{
    public partial class RoomMain
    {
        internal string Monitor(CheckPlayersCarState cpcs)
        {
            return this._Players[cpcs.Key].getCar(cpcs.Car).state.ToString();
        }
        internal string Monitor(CheckPlayersMoney cpcs)
        {
            return this._Players[cpcs.Key].Money.ToString();
        }
        internal string Monitor(CheckPlayerCostBusiness cpcs)
        {
            return this._Players[cpcs.Key].getCar(cpcs.Car).ability.costBusiness.ToString();
        }

        internal string Monitor(CheckPromoteDiamondCount cpcs)
        {
            return this._Players[cpcs.Key].PromoteDiamondCount[cpcs.pType].ToString();
        }
    }
}
