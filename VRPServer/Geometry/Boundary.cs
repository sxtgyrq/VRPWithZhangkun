using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Geometry
{
    public class Boundary
    {
        long zoom = 1000000;
        public Boundary()
        {
            this.BoundaryDetail = new Dictionary<string, List<List<Position>>>();
        }
        class Data
        {
            public List<string> boundaries { get; set; }
        }
        class Position
        {
            public long x { get; set; }
            public long y { get; set; }
        }
        public void load()
        {

            /*
             * var bdary = new BMap.Boundary();
             * bdary.get('杏花岭区', function(rs){console.log('杏花岭区',JSON.stringify(rs));});
             * 以上为获取某县/区边界的百度js脚本！
             */
            var rootPath = System.IO.Directory.GetCurrentDirectory();
            Console.WriteLine($"path:{rootPath}");
            var regionPath = $"{rootPath}\\config\\region.json";
            var data = File.ReadAllText(regionPath);
            Console.WriteLine(data);
            var regions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(data);
            for (var i = 0; i < regions.Count; i++)
            {
                Console.WriteLine(regions[i]);
                this.BoundaryDetail.Add(regions[i], new List<List<Position>>());
                var filePath = $"{rootPath}\\config\\region_{regions[i]}.json";
                var json = File.ReadAllText(filePath);
                Data dt = Newtonsoft.Json.JsonConvert.DeserializeObject<Data>(json);
                for (var j = 0; j < dt.boundaries.Count; j++)
                {
                    List<Position> boundryItem = new List<Position>();
                    var strItem = dt.boundaries[j];
                    var points = strItem.Split(';');
                    for (var k = 0; k < points.Length; k++)
                    {
                        var point = points[k];
                        var positions = point.Split(',');
                        var x = Convert.ToInt64(double.Parse(positions[0].Trim()) * zoom);
                        var y = Convert.ToInt64(double.Parse(positions[1].Trim()) * zoom);
                        Position p = new Position()
                        {
                            x = x,
                            y = y
                        };
                        boundryItem.Add(p);
                        Console.WriteLine($"x:{x},y:{y}");
                    }
                    this.BoundaryDetail[regions[i]].Add(boundryItem);
                }
                //Console.WriteLine(dt.boundaries[0]);
            }
            Console.ReadLine();
        }

        public string GetBoundry(double longitude, double latitde)
        {
            var x = Convert.ToInt64(longitude * zoom);
            var y = Convert.ToInt64(latitde * zoom);
            foreach (var item in this.BoundaryDetail)
            {
                if (isIN(x, y, item.Value))
                {
                    return item.Key;
                }
            }
            return "";
        }

        private bool isIN(long x, long y, List<List<Position>> values)
        {
            int count = 0;
            for (var i = 0; i < values.Count; i++)
            {
                var boundry = values[i];
                var length = boundry.Count;
                int inputState = 0;
                int state;
                for (var j = 0; j < length; j++)
                {
                    if (ConvertPolygonToTriangles.isSeperated(
                     new ConvertPolygonToTriangles.Line()
                     {
                         start = new ConvertPolygonToTriangles.Point()
                         {
                             x = -1,
                             y = -1
                         },
                         end = new ConvertPolygonToTriangles.Point()
                         {
                             x = x,
                             y = y
                         }
                     },
                     new ConvertPolygonToTriangles.Line()
                     {
                         start = new ConvertPolygonToTriangles.Point()
                         {
                             x = boundry[j].x,
                             y = boundry[j].y,
                         },
                         end = new ConvertPolygonToTriangles.Point()
                         {
                             x = boundry[(j + 1) % length].x,
                             y = boundry[(j + 1) % length].y,
                         },
                     }, inputState, out state
                     ))
                    {

                    }
                    else
                    {
                        count++;
                    }
                    inputState = state;
                }
            }
            if (count % 2 == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        

        Dictionary<string, List<List<Position>>> BoundaryDetail { get; set; }
    }
}
