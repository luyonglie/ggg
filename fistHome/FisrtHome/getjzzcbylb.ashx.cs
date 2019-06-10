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
    /// getjzzcbylb 的摘要说明
    /// </summary>
    public class getjzzcbylb : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var categorid = context.Request.Params["categorid"];
            var categorName = context.Request.Params["categorName"];
            var rowcount = context.Request.Params["rowcount"];


            string cmdText = $@"select top {rowcount} _AutoID,IssueDept,Title ,IssueTime,attachId from T_R_Note_Jzzc  
 where NewsType='{categorid}'  and _IsDel=0 order by IssueTime desc";
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

            string json = JsonConvert.SerializeObject(new { code = 0, categorid = categorid, msg = cmdText, total = dtMsg.Rows.Count, rows = dtMsg });
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