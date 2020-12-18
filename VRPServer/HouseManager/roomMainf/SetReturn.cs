using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace HouseManager
{
    public partial class RoomMain
    {
        private async void setReturn(int startT, commandWithTime.returnning cmp)
        {
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setReturn");
            Thread.Sleep(startT + 1);
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}开始执行setReturn正文");
            List<string> notifyMsg = new List<string>();
            bool needUpdatePromoteState = false;
            lock (this.PlayerLock)
            {
                var player = this._Players[cmp.key];
                var car = this._Players[cmp.key].getCar(cmp.car);
                car.targetFpIndex = this._Players[cmp.key].StartFPIndex;
                if ((cmp.changeType == "mile" || cmp.changeType == "bussiness" || cmp.changeType == "volume" || cmp.changeType == "speed")
                    && car.state == CarState.buying)
                {
                    ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                }
                else if (cmp.changeType == "collect-return" && car.state == CarState.waitForCollectOrAttack)
                {
                    if (car.state != CarState.waitForTaxOrAttack)
                    {
                        ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                    }
                }
            }
            for (var i = 0; i < notifyMsg.Count; i += 2)
            {
                var url = notifyMsg[i];
                var sendMsg = notifyMsg[i + 1];
                Console.WriteLine($"url:{url}");

                await Startup.sendMsg(url, sendMsg);
            }
            Console.WriteLine($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}执行setReturn结束");
            if (needUpdatePromoteState)
            {
                await CheckAllPlayersPromoteState(cmp.changeType);
            }
        }

        private void ReturnThenSetComeBack(Car car, commandWithTime.returnning cmp, ref List<string> notifyMsg)
        {
            var speed = car.ability.Speed;
            int startT = 0;
            var result = new List<Data.PathResult>();
            Program.dt.GetAFromBPoint(cmp.returnPath, Program.dt.GetFpByIndex(cmp.target), speed, ref result, ref startT);
            getEndPositon(Program.dt.GetFpByIndex(this._Players[cmp.key].StartFPIndex), cmp.car, ref result, ref startT);
            result.RemoveAll(item => item.t0 == item.t1);

            car.state = CarState.returning;
            Thread th = new Thread(() => setBack(startT, new commandWithTime.comeBack()
            {
                c = "comeBack",
                car = cmp.car,
                key = cmp.key
            }));
            th.Start();


            car.animateData = new AnimateData()
            {
                animateData = result,
                recordTime = DateTime.Now
            };
            //第二步，更改状态
            car.changeState++;
            getAllCarInfomations(cmp.key, ref notifyMsg);
        }
        private void setBack(int startT, commandWithTime.comeBack comeBack)
        {
            Thread.Sleep(startT);
            lock (this.PlayerLock)
            {
                if (this._Players[comeBack.key].getCar(comeBack.car).state == CarState.returning)
                {


                    this._Players[comeBack.key].getCar(comeBack.car).ability.Refresh();
                    this._Players[comeBack.key].getCar(comeBack.car).Refresh();
                }
                else
                {
                    var car = this._Players[comeBack.key].getCar(comeBack.car);
                    throw new Exception($"{car.name}返回是状态为{this._Players[comeBack.key].getCar(comeBack.car).state}");
                }
            }
        }
    }
}
