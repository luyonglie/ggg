using EIS.DataAccess;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace FisrtHome
{
    /// <summary>
    /// getCategory 的摘要说明
    /// </summary>
    public class getCategory : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
           
            
           

            string cmdText = $@"select _AutoID,ItemCode,ItemName  from T_E_Sys_DictEntry 
 where DictID='9cd72492-c34c-4288-bc44-e6ca5007ee47'  and _IsDel=0 order by ItemOrder" ;
            DataTable dtMsg = null;
            try
            {
                dtMsg = SysDatabase.ExecuteTable(cmdText);
            }
            catch (Exception ex)
            {

                context.Response.Write(cmdText);
                context.Response.Write(ex.Message + ex.Source + ex.StackTrace);
                context.Response.End();
                return;
            }

            string json = JsonConvert.SerializeObject(new { code = 0, msg = "", total = dtMsg.Rows.Count, rows = dtMsg });
            context.Response.Write(json);
            context.Response.End();
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}