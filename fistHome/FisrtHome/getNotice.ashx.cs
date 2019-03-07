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
    /// getNotice 的摘要说明
    /// </summary>
    public class getNotice : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.QueryString["type"];
            string where = "";
            switch (type)
            {
                case "0":
                    where = "and d.BizType='救济难' ";
                    break;
                case "1":
                    where = "and d.BizType='临时救助' ";
                    break;
                case "2":
                    where = "and d.BizType='转办' ";
                    break;
                case "3":
                    where = "and d.BizType='转介' ";
                    break;
                default:
                    break;
            }

            string cmdText = $@"  select  _AutoID,Title,IssueTime,IssueDept   from T_OA_Note where _isdel=0 and NewsState='是'";
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

            string json = JsonConvert.SerializeObject(new { code = 0, msg = "", count = dtMsg.Rows.Count, data = dtMsg });
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