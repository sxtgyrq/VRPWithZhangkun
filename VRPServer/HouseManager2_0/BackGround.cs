namespace HouseManager2_0
{
    public class BackGround 
    {
        public BackGround() { }

        internal string getPathByRegion(string region)
        {
            switch (region)
            {
              
                case "太谷区": { return "regiontaigu"; }; 
                default:
                    {
                        return "";
                    }
            }
        }
    }
}
