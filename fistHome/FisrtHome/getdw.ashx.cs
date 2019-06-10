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
    /// getdw 的摘要说明
    /// </summary>
    public class getdw : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.QueryString["type"];
            string rootwbs = "0";
            string cmdText = $@" select T_E_Org_Department._AutoID,DeptWBS,DeptPWBS,DeptName ,DeptCode ,DeptAbbr,TypeID,TypeName  from T_E_Org_Department
 left join T_E_Org_DeptType on TypeCode=TypeID  where T_E_Org_Department._IsDel=0 and T_E_Org_Department.DeptState ='正常'
order by T_E_Org_Department.DeptWBS,T_E_Org_Department.OrderID";
            DataTable dtMsg = null;
            List<dwtree> list = new List<dwtree>();
            List<dwtree> resultList = new List<dwtree>();
            try
            {
                dtMsg = SysDatabase.ExecuteTable(cmdText);
                foreach (DataRow item in dtMsg.Rows)
                {
                    list.Add(new dwtree {
                        autoid = item["_AutoID"] as string,
                        id = item["DeptWBS"] as string,
                        DeptWBS = item["DeptWBS"] as string,
                        parentid = item["DeptPWBS"] as string,
                        typeid  = item["TypeID"] as string,
                        typename = item["TypeName"] as string,
                         DeptAbbr= item["DeptAbbr"] as string,
                        DeptCode = item["DeptCode"] as string,
                        name = item["DeptName"] as string });
                }
                var root = list.Find(p => p.id == rootwbs);
                root.path = root.id;
                loadChild(root,list);
                resultList.Add(root);
            }
            catch (Exception ex)
            {

                context.Response.Write(cmdText);
                context.Response.Write(ex.Message + ex.Source + ex.StackTrace);
                context.Response.End();
                return;
            }

            string json = JsonConvert.SerializeObject(new { code = 0, msg = "",   data = resultList });
            context.Response.Write(json);
            context.Response.End();
        }

        private void loadChild(dwtree parent, List<dwtree> list)
        {
            parent.childs = new List<dwtree>();
            IEnumerable<dwtree> childs = list.Where(p => p.parentid == parent.id);
            foreach (var item in childs)
            {
                item.path = parent.path + "|" + item.id;
                loadChild(item, list);
                parent.childs.Add(item);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        class dwtree
        {
            public string autoid { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public string DeptAbbr { get; set; }
            public string typeid { get; set; }
            public string typename { get; set; }
            public string path { get; set; }
            public string parentid { get; set; }

            public string DeptWBS { get; set; }
            public string DeptCode { get; set; }
            public List<dwtree> childs { get; set; }
        }
    }
}