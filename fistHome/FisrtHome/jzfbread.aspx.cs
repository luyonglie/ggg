using EIS.AppBase;
using EIS.DataAccess;
using EIS.DataModel.Model;
using EIS.DataModel.Service;
using EIS.Permission.Service;
using EIS.WebBase.App_Code;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace FisrtHome
{ 
    public partial class jzfbread : PageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bool logged = default(bool);

            newsId = this.GetParaValue("newsId");
            bool flag = !base.IsPostBack;
            if (flag)
            {
                logged = base.Logged;

                if (!logged)
                {
                    Button1.Enabled = false;
                    string text = "update " + appName + " set ReadCount=IsNull(ReadCount,0) + 1 where _Autoid='" + newsId + "'";
                    SysDatabase.ExecuteNonQuery(text);
                }
                else
                {
                    WebTools.UpdateRead(this.EmployeeID, appName, newsId);
                    string text = "update " + appName + "  set ReadCount=IsNull(ReadCount,0) + 1 where _Autoid='" + newsId + "'";
                    SysDatabase.ExecuteNonQuery(text);
                    readContentᜀ();
                }
            }

        }
        public string appName = "T_R_Note_Jzfb";
        public string newstitle = "救助发布";

        public string newsHeader = "";

        public string newscontent = "";

        public string commentlist = "";

        public string fjlist = "";

        public string newsId = "";

        protected HtmlHead Head1;

        protected HtmlForm form1;

        protected TextBox TextBox1;

        protected Button Button1;
        public int Readed = 0;

        public int Unread = 0;

        public string ReadedList = "";

        public string UnReadList = "";
        public string total = "";

        public jzfbread()
        {
            base.AutoRedirect = false;
        }


        protected void Submit1_ServerClick(object sender, EventArgs e)
        {
            OAComment oAComment = new OAComment(base.UserInfo);
            oAComment.EmployeeName = base.EmployeeName;
            oAComment.AddTime = DateTime.Now;
            oAComment.Content = TextBox1.Text;
            oAComment.AppID = newsId;
            oAComment.AppName = appName;
            WebTools.InsertComment(oAComment);
            readContentᜀ();
        }
        private void readContentᜀ()
        {

            string text = "select * from " + appName + " where _Autoid='" + newsId + "'";
            DataTable dataTable = SysDatabase.ExecuteTable(text);
            if (dataTable.Rows.Count > 0)
            {
                DataRow dataRow4 = dataTable.Rows[0];
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.AppendFormat("{0}<span>发布人：{1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发布日期：{2:yyyy-MM-dd HH:mm}&nbsp;&nbsp;&nbsp;&nbsp;阅读次数：{3}&nbsp;次</span>", dataRow4["Title"], dataRow4["Creator"], dataRow4["IssueTime"], dataRow4["ReadCount"]);
                newstitle = stringBuilder.ToString();

                newscontent = dataTable.Rows[0]["Content"].ToString();
                FileService val = new FileService();
                string attachid = dataTable.Rows[0]["attachId"] as string;
                IList<AppFile> files = val.GetFiles(appName, attachid);
                stringBuilder = new StringBuilder();
                stringBuilder.Append("<ul style='list-style-type:disc'>");

                foreach (var current in files)
                {
                    stringBuilder.AppendFormat("<li style='list-style-type:disc'><a href='../../SysFolder/Common/FileDown.aspx?fileId={0}' target='_blank'>{1}</a>({2})</li>", current._AutoID, current.FactFileName, Utility.GetFriendlySize((long)current.FileSize));

                }
                stringBuilder.Append("</ul>");
                fjlist = stringBuilder.ToString();
                text = "select * from T_OA_Comment where AppID='" + newsId + "' order by AddTime";
                DataTable dataTable2 = SysDatabase.ExecuteTable(text);
                stringBuilder = new StringBuilder();
                int i = 1;
                foreach (DataRow dataRow3 in dataTable2.Rows)
                {
                    stringBuilder.AppendFormat("<div class=\"c_list\"><span class=\"c_writer\">评论人：{0}</span><span class=\"c_time\">{3}楼 {1}</span><p>{2}</p></div>", dataRow3["EmployeeName"], dataRow3["AddTime"], dataRow3["Content"], i++);

                }
                commentlist = stringBuilder.ToString();
            }

        }


    }
}