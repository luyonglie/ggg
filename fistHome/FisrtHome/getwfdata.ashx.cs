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
    /// getwfdata 的摘要说明
    /// </summary>
    public class getwfdata : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.QueryString["type"];
            string start = context.Request.QueryString["start"];
            string end = context.Request.QueryString["end"]+"-01";
              end = DateTime.Parse(end).AddMonths(1).ToString("yyyy-MM-dd");
           
            string where = "and ywlx='"+type+"' and ywrq>='"+start+ "-01' and ywrq<'" + end + "'";
          

            string cmdText = $@" select top 5 * from V_ERescue_Sate WHERE 1=1 "+where;
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