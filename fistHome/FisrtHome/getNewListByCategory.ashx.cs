using EIS.DataAccess;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace FisrtHome
{
    /// <summary>
    /// getNewListByCategory 的摘要说明
    /// </summary>
    public class getNewListByCategory : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            string where = "";
             
            var pageNumStr = context.Request.Params["page"];
            var pageSizeStr = context.Request.Params["rows"];
            var pageNum = 1;
            var pageSize = 20;
            if (!string.IsNullOrWhiteSpace(pageNumStr))
            {
                pageNum = int.Parse(pageNumStr);
            }
            if (!string.IsNullOrWhiteSpace(pageSizeStr))
            {
                pageSize = int.Parse(pageSizeStr);
            }

            DataTable dtMsg = null;
            DataSet ds = null; string para = "";
            int totalCount = 0;
            try
            {
                SqlCommand sqlCommand = new SqlCommand
                {

                    CommandType = CommandType.StoredProcedure,
                    CommandText = "GSIDPPUB_PAGETOPKEYPROC",

                };
                sqlCommand.Parameters.Add(new SqlParameter("PK", "_AutoID"));
                sqlCommand.Parameters.Add(new SqlParameter("ordfld", "IssueTime desc"));
                sqlCommand.Parameters.Add(new SqlParameter("selfld", ""));
                sqlCommand.Parameters.Add(new SqlParameter("table", "T_OA_News"));
                sqlCommand.Parameters.Add(new SqlParameter("wherestr", "where 1=1 " + where));
                sqlCommand.Parameters.Add(new SqlParameter("pageSize", pageSize));
                sqlCommand.Parameters.Add(new SqlParameter("pageIndex", pageNum));


                para += "where 1=1 " + where;
                para += ";pageSize" + pageSize;
                para += ";pageIndex" + pageNum;

                SqlParameter returnpara = new SqlParameter()
                {
                    Direction = ParameterDirection.ReturnValue,


                };


                ds = SysDatabase.ExecuteDataSet(sqlCommand);
                dtMsg = ds.Tables[0];
                para += ";tablecount:" + ds.Tables.Count;
                totalCount = Convert.ToInt32(ds.Tables[1].Rows[0][0]);
            }
            catch (Exception ex)
            {


                context.Response.Write(ex.Message + ex.Source + ex.StackTrace);
                context.Response.End();
                return;
            }

            string json = JsonConvert.SerializeObject(new { code = 0, msg = para, total = totalCount, rows = dtMsg });
            context.Response.Write(json);
            context.Response.End();
        }
        /*
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var categorid = context.Request.Params["categorid"];
            var categorName = context.Request.Params["categorName"];
            var rowcount = context.Request.Params["rowcount"];
            string wheretem = "";
            if (!string.IsNullOrEmpty(categorName))
            {
                wheretem = $"and  Catalog='{categorName}'";
            }
            string cmdText = $@"select top {rowcount} _AutoID,IssueDept,Title ,IssueTime from T_OA_News  
 where 1=1  {wheretem} and _IsDel=0 order by IssueTime desc";
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

            string json = JsonConvert.SerializeObject(new { code = 0, categorid= categorid, msg = cmdText, total = dtMsg.Rows.Count, rows = dtMsg });
            context.Response.Write(json);
            context.Response.End();
        }
        */

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}