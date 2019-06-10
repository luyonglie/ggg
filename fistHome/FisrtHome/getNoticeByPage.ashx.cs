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
    /// getNoticeByPage 的摘要说明
    /// </summary>
    public class getNoticeByPage : IHttpHandler
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
                sqlCommand.Parameters.Add(new SqlParameter("table", "T_OA_Note"));
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
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}