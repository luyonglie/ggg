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
    /// getFirstHomeInfo 的摘要说明
    /// </summary>
    public class getFirstHomeInfo : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
          string type=  context.Request.QueryString["type"];
          string employid=  context.Session["EmployeeId"] as string;
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
            where += $" and (ownerId='{employid}' or agentId='{employid}') ";
            string countsql = "BizType,COUNT(1) ct", datasql = " top 20 instanceName +'     '+  CreateUser +'     '++CONVERT(varchar(10), ArriveTime,111)  title  ,BizType,uTaskId taskId";
            string cmdText = $@" from  (select  d.BizType as BizType /*业务分类*/,i.employeeName as CreateUser ,i._createtime,i.deptName,i.instanceName /*流程名称*/,i._autoid as instanceId,i.AppName,i.AppId,d.WorkflowCode
            ,t._AutoId as taskId,t.TaskName,t.ArriveTime /*到达时间*/,u.IsRead /*是否已读  0 未 1 已读  */ ,u.OwnerId,u.isshare,u.taskState,d.workflowname,i.companyname,u._autoId as uTaskId
            ,e.employeeName agentName,isnull(u.agentId,'') agentId,t.CanBatch,i.InstanceState
             from t_e_wf_instance i with(nolock) inner join t_e_wf_task t with(nolock) on i._AutoId=t.instanceId
            inner join t_e_wf_usertask u with(nolock) on t._AutoId=u.taskid
            inner join t_e_wf_define d with(nolock) on d._autoid=i.workflowid
            left join t_e_org_employee e with(nolock) on isnull(u.agentId,'')=e._autoId where u._IsDel=0 {where}
            )  t where (InstanceState = '处理中' or InstanceState = '未发起' ) and (TaskState ='0'or TaskState ='1')   ";
            string sql = $"select {datasql} {cmdText}";
            string sql2 = $"select {countsql} {cmdText} group by BizType";
            DataTable dtMsg = null,dtcount=null;
            try
            {
                dtMsg = SysDatabase.ExecuteTable(sql);
                dtcount = SysDatabase.ExecuteTable(sql2);
            }
            catch (Exception ex)
            {

                context.Response.Write(cmdText);
                context.Response.Write(ex.Message+ex.Source+ex.StackTrace);
                context.Response.End();
                return;
            }
           
            string json = JsonConvert.SerializeObject(new { code = 0, msg = "", count = dtcount, data = dtMsg });
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