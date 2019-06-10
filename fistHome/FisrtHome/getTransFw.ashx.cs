using EIS.DataAccess;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace FisrtHome
{
    /// <summary>
    /// getTransFw 的摘要说明
    /// </summary>
    public class getTransFw : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
          
            string type= context.Session["DeptWbs"] as string;
            string CompanyId = context.Session["CompanyId"] as string;
            string sql = $@"select distinct CompanyId,OrgLBBH,OrgLBMC,LXBH,LXMC,JBBH,JBMC from 
T_E_Org_Department left join
T_R_TransOrgRelex  on OrgLBBH = TypeID
left join T_R_TransOrgRelex_LX on T_R_TransOrgRelex._AutoID = T_R_TransOrgRelex_LX._MainID
where T_E_Org_Department.CompanyId = '{CompanyId}' ";
            DataTable dtMsg = SysDatabase.ExecuteTable(sql);
            string json = JsonConvert.SerializeObject(new { code = 0, msg = "", DeptWbs = type, count = dtMsg.Rows.Count, data = dtMsg });
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