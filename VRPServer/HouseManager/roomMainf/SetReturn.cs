using CommonClass;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HouseManager
{
    public partial class RoomMain
    {
        /// <summary>
        /// set return 本身自带广播功能
        /// </summary>
        /// <param name="startT"></param>
        /// <param name="cmp"></param>
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
                    if (car.state == CarState.waitForCollectOrAttack)
                    {
                        ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                    }
                    else if (car.state == CarState.waitForTaxOrAttack) 
                    {
                        Console.WriteLine("CarState.waitForTaxOrAttack没有编写");
                        throw new Exception("");
                    }
                }
                else if (cmp.changeType == "Attack" && car.state == CarState.roadForAttack && car.purpose == Purpose.attack)
                {
                    if (car.state == CarState.roadForAttack)
                    {
                        ReturnThenSetComeBack(car, cmp, ref notifyMsg);
                    }
                }
                else
                {
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(car);
                    throw new Exception($"遇到未注册的情况--{json}！！！");
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
                var player = this._Players[comeBack.key];
                var car = player.getCar(comeBack.car);
                if (car.state == CarState.returning)
                {
                    player.Money += car.ability.costBusiness;
                    if (car.ability.subsidize > 0)
                    {
                        player.SupportToPlay.Money += car.ability.subsidize;
                    }
                    car.ability.Refresh();
                    car.Refresh();
                }
                else
                {
                    throw new Exception($"{car.name}返回是状态为{this._Players[comeBack.key].getCar(comeBack.car).state}");
                }
            }
        }


    }
}
