using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Xml;

namespace ConsoleAppOtherFunc
{
    class WechatDialog
    {

        /// <summary>
        /// 微信接口XmlModel
        /// XML解析
        /// </summary>
        class WxXmlModel
        {
            /// <summary>
            /// 消息接收方微信号
            /// </summary>
            public string ToUserName { get; set; }
            /// <summary>
            /// 消息发送方微信号
            /// </summary>
            public string FromUserName { get; set; }
            /// <summary>
            /// 创建时间
            /// </summary>
            public string CreateTime { get; set; }
            /// <summary>
            /// 信息类型 地理位置:location,文本消息:text,消息类型:image
            /// </summary>
            public string MsgType { get; set; }
            /// <summary>
            /// 信息内容
            /// </summary>
            public string Content { get; set; }
            /// <summary>
            /// 地理位置纬度
            /// </summary>
            public string Location_X { get; set; }
            /// <summary>
            /// 地理位置经度
            /// </summary>
            public string Location_Y { get; set; }
            /// <summary>
            /// 地图缩放大小
            /// </summary>
            public string Scale { get; set; }
            /// <summary>
            /// 地理位置信息
            /// </summary>
            public string Label { get; set; }
            /// <summary>
            /// 图片链接，开发者可以用HTTP GET获取
            /// </summary>
            public string PicUrl { get; set; }
            /// <summary>
            /// 事件类型，subscribe(订阅/扫描带参数二维码订阅)、unsubscribe(取消订阅)、CLICK(自定义菜单点击事件) 、SCAN（已关注的状态下扫描带参数二维码）
            /// </summary>
            public string Event { get; set; }
            /// <summary>
            /// 事件KEY值
            /// </summary>
            public string EventKey { get; set; }
            /// <summary>
            /// 二维码的ticket，可以用来换取二维码
            /// </summary>
            public string Ticket { get; set; }
        }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy(name: "MyPolicy",
                    builder =>
                    {
                        builder.WithOrigins("http://*");
                    });
            });
        }

        const int webWsSize = 1024 * 3;
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            // app.Run()
            app.Map("/wechatDialog", WebF);

        }
        private static void WebF(IApplicationBuilder app)
        {
            app.Run(async context =>
            {

                //context.Request.Body
                using (var s = context.Request.Body)
                {
                    using (StreamReader reader = new StreamReader(s))
                    {
                        string text = reader.ReadToEnd();
                        Console.WriteLine(text);

                        XmlDocument xml = new XmlDocument();
                        xml.LoadXml(text);

                        XmlElement rootElement = xml.DocumentElement;
                        WxXmlModel WxXmlModel = new WxXmlModel();
                        WxXmlModel.ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText;
                        WxXmlModel.FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText;
                        WxXmlModel.CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText;
                        WxXmlModel.MsgType = rootElement.SelectSingleNode("MsgType").InnerText;

                        switch (WxXmlModel.MsgType)
                        {
                            case "text"://文本
                                {
                                    WxXmlModel.Content = rootElement.SelectSingleNode("Content").InnerText;

                                    Console.WriteLine(WxXmlModel.Content);

                                    if (BitCoin.CheckAddress.CheckAddressIsUseful(WxXmlModel.Content))
                                    {
                                        var value = DalOfAddress.MoneyAdd.GetMoney(WxXmlModel.Content);
                                        var priceStr = $"{value / 100}.{(value % 100) / 10}{value % 10}";
                                        string msg = string.Format(
                                          Message_Text,
                                          WxXmlModel.FromUserName,
                                          WxXmlModel.ToUserName,
                                          DateTime.Now.Ticks,
                                          $"查询到{WxXmlModel.Content}有{priceStr}金币！");
                                        Console.WriteLine(msg);
                                        await context.Response.WriteAsync(msg, Encoding.UTF8);
                                    }
                                    else
                                    {
                                        // if(BitCoin.Base58.)
                                        string msg = string.Format(
                                            Message_Text,
                                            WxXmlModel.FromUserName,
                                            WxXmlModel.ToUserName,
                                            DateTime.Now.Ticks,
                                            $"你好，现在是{DateTime.Now.ToString("yyyy年MM月dd日 HH时mm分ss秒")}，我是要瑞卿。我现在接收到了你的消息，还不知道要回复你什么！");
                                        Console.WriteLine(msg);
                                        await context.Response.WriteAsync(msg, Encoding.UTF8);
                                    }
                                }

                                break;
                            case "image"://图片
                                         //  WxXmlModel.PicUrl = rootElement.SelectSingleNode("PicUrl").InnerText;
                                break;
                            case "event"://事件
                                //WxXmlModel.Event = rootElement.SelectSingleNode("Event").InnerText;
                                //if (WxXmlModel.Event == "subscribe")//关注类型
                                //{
                                //    WxXmlModel.EventKey = rootElement.SelectSingleNode("EventKey").InnerText;
                                //}
                                break;
                            default:
                                break;
                        }

                    }
                }

                //                < xml >< ToUserName >< ![CDATA[gh_36a2a769194c]] ></ ToUserName >
                //< FromUserName >< ![CDATA[o6YIy6PwPcXEwcrq - hzSgbJFQubU]] ></ FromUserName >
                //< CreateTime > 1621346633 </ CreateTime >
                //< MsgType >< ![CDATA[text]] ></ MsgType >
                //< Content >< ![CDATA[现在]] ></ Content >
                //< MsgId > 23212102767046389 </ MsgId >
                //</ xml >

                #region 验证服务器所需
                // context.Request.Body
                // context.typ
                //Console.WriteLine("我被调用了");
                //cont
                //string token = "yrqIsAGenius";

                //var echoStr = context.Request.Query["echoStr"];
                //Console.WriteLine($"echoStr:{echoStr}");

                //var signature = context.Request.Query["signature"];
                //Console.WriteLine($"signature :{signature}");

                //var timestamp = context.Request.Query["timestamp"];
                //Console.WriteLine($"timestamp :{timestamp}");

                //var nonce = context.Request.Query["nonce"];
                //Console.WriteLine($"nonce:{nonce}");

                //if (CheckSignature(token, signature, timestamp, nonce))
                //{
                //    if (!string.IsNullOrEmpty(echoStr))
                //    {
                //        await context.Response.WriteAsync(echoStr, Encoding.UTF8);
                //    }
                //}
                #endregion

            });
        }

        private static string Message_Text
        {
            get
            {
                return @"<xml>
                            <ToUserName><![CDATA[{0}]]></ToUserName>
                            <FromUserName><![CDATA[{1}]]></FromUserName>
                            <CreateTime>{2}</CreateTime>
                            <MsgType><![CDATA[text]]></MsgType>
                            <Content><![CDATA[{3}]]></Content>
                            </xml>";
            }
        }
        public static bool CheckSignature(string token, string signature, string timestamp, string nonce)
        {
            string[] ArrTmp = { token, timestamp, nonce };
            //字典排序
            Array.Sort(ArrTmp);
            //拼接
            string tmpStr = string.Join("", ArrTmp);
            //sha1验证
            var data = SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(tmpStr));

            StringBuilder sub = new StringBuilder();
            foreach (var t in data)
            {
                sub.Append(t.ToString("X2"));
            }
            //tmpStr = Membership.CreateUser(tmpStr, "SHA1");
            Console.WriteLine($"计算所得:{sub.ToString().ToLower()}");
            tmpStr = sub.ToString().ToLower();
            if (tmpStr == signature)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
