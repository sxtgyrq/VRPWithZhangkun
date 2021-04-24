using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace DalOfAddress
{
    public class Diamoudcount
    {
        public static int GetCount(string v)
        {
            using (MySqlConnection con = new MySqlConnection(Connection.ConnectionStr))
            {
                con.Open();
                using (MySqlTransaction tran = con.BeginTransaction())
                {
                    try
                    {
                        int countValue;
                        {
                            string sQL = @"SELECT
                            	countValue 
                            FROM
                            	diamoudcount WHERE diamondType=@diamondType";
                            // long moneycount;
                            using (MySqlCommand command = new MySqlCommand(sQL, con, tran))
                            {
                                command.Parameters.AddWithValue("@diamondType", v);
                                using (var reader = command.ExecuteReader())
                                {
                                    reader.Read();
                                    {
                                        countValue = Convert.ToInt32(reader["countValue"]);
                                    }
                                }
                            }
                        }
                        return countValue;



                    }
                    catch (Exception e)
                    {
                        throw e;
                        throw new Exception("新增错误");
                    }
                }
            }

        }

        public static void UpdateItem(string pType, int countValue)
        {
            using (MySqlConnection con = new MySqlConnection(Connection.ConnectionStr))
            {
                con.Open();
                using (MySqlTransaction tran = con.BeginTransaction())
                {
                    try
                    {
                        {
                            string sQL = @"UPDATE diamoudcount SET countValue=@countValue WHERE diamondType=@diamondType";
                            using (MySqlCommand command = new MySqlCommand(sQL, con, tran))
                            {
                                command.Parameters.AddWithValue("@countValue", countValue);
                                command.Parameters.AddWithValue("@diamondType", pType);
                                command.ExecuteNonQuery();
                            }
                        } 
                    }
                    catch (Exception e)
                    {
                        throw e;
                        throw new Exception("新增错误");
                    }
                }
            }
        }
    }
}
