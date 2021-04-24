using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using System;

namespace ConsoleAppOtherFunc
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine($"请选择功能！{Environment.NewLine}" +
                $"A.启动微信校验！{Environment.NewLine}" +
                $"B.微信自动对话！{Environment.NewLine}" +
                $"");
            var input = Console.ReadLine().Trim().ToUpper();
            switch (input)
            {
                case "A":
                    {
                        Console.WriteLine("将要部署微信网页授权功能!");
                        var ip = "127.0.0.1";
                        Console.WriteLine($"输入ip,如“{ip}”");
                        var inputIp = Console.ReadLine();
                        if (string.IsNullOrEmpty(inputIp)) { }
                        else
                        {
                            ip = inputIp;
                        }
                        int port = 13301;
                        Console.WriteLine($"输入端口≠15000,如“{port}”");
                        var inputWebsocketPort = Console.ReadLine();
                        if (string.IsNullOrEmpty(inputWebsocketPort)) { }
                        else
                        {
                            int num;
                            if (int.TryParse(inputWebsocketPort, out num))
                            {
                                port = num;
                            }
                        }
                        CreateWebHostBuilder(new string[] { $"http://{ip}:{port}" }).UseStartup<WechatWebStartup>().Build().Run();
                    }; break;
                case "B":
                    {
                        Console.WriteLine("将要部署微信自动回复功能!");
                        var ip = "127.0.0.1";
                        Console.WriteLine($"输入ip,如“{ip}”");
                        var inputIp = Console.ReadLine();
                        if (string.IsNullOrEmpty(inputIp)) { }
                        else
                        {
                            ip = inputIp;
                        }
                        int port = 14301;
                        Console.WriteLine($"输入端口≠15000,如“{port}”");
                        var inputWebsocketPort = Console.ReadLine();
                        if (string.IsNullOrEmpty(inputWebsocketPort)) { }
                        else
                        {
                            int num;
                            if (int.TryParse(inputWebsocketPort, out num))
                            {
                                port = num;
                            }
                        }
                        CreateWebHostBuilder(new string[] { $"http://{ip}:{port}" }).UseStartup<WechatDialog>().Build().Run();
                    }; break;

            }








        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
WebHost.CreateDefaultBuilder(args).Configure(item => item.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
})).UseKestrel(options =>
{
    options.AllowSynchronousIO = true;
})
.UseUrls(args[0]);
    }
}
