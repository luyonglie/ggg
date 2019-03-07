using EIS.DataAccess;
using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Web;

namespace FisrtHome
{
    /// <summary>
    /// 救急难提交事件
    /// 1.救急难 选择家庭id时，
    /// 向T_R_FamilyInfo_JZMX 插入一条数据，本身主键就是guid   ,此表的主表ID字段写救急难上的家庭档案ID,
    /// 救急难的id对应T_R_FamilyInfo_JZMX 表的SQID
    /// 2.救急难提交时，同步更新家庭档案资料 根据救急难上的家庭档案ID, 先删后增。
    /// </summary>
    public class JJNWfEvent
    {
        private Logger fileLogger = LogManager.GetCurrentClassLogger();
        /// <summary>
            /// 保存后事件
            /// </summary>
            /// <param name="tblName">表名</param>
            /// <param name="mainRow">主表数据</param>
            /// <param name="flag">1为新建，2为修改</param>
            /// <param name="tran"></param>
            /// <returns></returns>
        public string JJNAfterSave(string tablName, DataRow mainRow, int flag, DbTransaction tran)
        {


            string result = string.Empty;
            string sql = string.Empty;
            DataTable dtMx = null;
            try
            {
                string jtid = mainRow["FamilyID"] as string;//家庭ID
                string ZBID = mainRow["_AutoID"] as string;//主表ID
                if (!string.IsNullOrWhiteSpace(jtid))
                {
                    //在此处处理业务逻辑
                    //1.获取家庭成员信息
                    sql = $"select * from T_R_ERescue_JTMX where _MainID='{ZBID}'";
                    dtMx = SysDatabase.ExecuteTable(sql, tran);

                    //先删T_R_FamilyInfo_JZMX
                    sql = $"delete T_R_FamilyInfo_JZMX  where _MainID='{jtid}'";
                    SysDatabase.ExecuteNonQuery(sql, tran);

                    //删T_R_FamilyInfo_JTMX
                    sql = $"delete  T_R_FamilyInfo_JTMX  where _MainID='{jtid}'";
                    SysDatabase.ExecuteNonQuery(sql, tran);

                    //删T_R_FamilyInfo
                    sql = $"delete  T_R_FamilyInfo  where _AutoID='{jtid}'";
                    SysDatabase.ExecuteNonQuery(sql, tran);


                    //插入T_R_FamilyInfo
                    sql = $@"INSERT INTO  T_R_FamilyInfo 
           ([_AutoID]
           ,[_UserName]
           ,[_OrgCode]
           ,[_CreateTime]
           ,[_UpdateTime]
           ,[_IsDel]
           ,[_CompanyID]
           ,[_WFState]
           ,[_GDState]
           ,[_WFCurNode]
           ,[_WFCurUser]
           ,[OperatorID]
           ,[Operator]
           ,[AreaID]
           ,[AreaName]
           ,[CorpID]
           ,[CorpName]
           ,[DeptID]
           ,[DeptName]
           ,[PosID]
           ,[PosName]
           ,[CreateDate]
           ,[ApplyDate]
           ,[Street]
           ,[SheetNo]
           ,[ApplyMan]
           ,[Sex]
           ,[CardID]
           ,[JTLX]
           ,[Tel]
           ,[RescueCode]
           ,[Addr]
           ,[PAddr]
           ,[Income]
           ,[AccountName]
           ,[BankName]
           ,[AccountNo]
           ,[Cause]
           ,[JE]
           ,[JEDX]
           ,[FileId]
           ,[CommunityID]
           ,[Nation]
           ,[Apanage]
           ,[IDType]
           ,[PostCode]
           ,[CSRQ]
           ,[StreetID]
           ,[ModiDate]
           ,[Modifier]
          
           ,[Community])values('{jtid}','{HttpContext.Current.Session["EmployeeName"]}','{HttpContext.Current.Session["CompanyCode"]}',getdate(),getdate(),0,'{HttpContext.Current.Session["CompanyId"]}','未发起',null,
            '','','{HttpContext.Current.Session["EmployeeId"]}','{HttpContext.Current.Session["EmployeeName"]}','{mainRow["AreaID"]}','{mainRow["AreaName"]}','{mainRow["CorpID"]}','{mainRow["CorpName"]}','{mainRow["DeptID"]}','{mainRow["DeptName"]}',
'{mainRow["PosID"]}','{mainRow["PosName"]}',getdate(),getdate(),'{mainRow["Street"]}','{mainRow["SheetNo"]}','{mainRow["ApplyMan"]}','{mainRow["Sex"]}','{mainRow["CardID"]}'
,'{mainRow["JTLX"]}','{mainRow["Tel"]}','{mainRow["RescueCode"]}','{mainRow["Addr"]}','{mainRow["PAddr"]}','{mainRow["Income"]}','{mainRow["AccountName"]}','{mainRow["BankName"]}','{mainRow["AccountNo"]}'
,'{mainRow["Cause"]}','{mainRow["JE"]}','{mainRow["JEDX"]}','{mainRow["FileId"]}','{mainRow["CommunityID"]}','{mainRow["Nation"]}','{mainRow["Apanage"]}'
,'{mainRow["IDType"]}','{mainRow["PostCode"]}','{mainRow["CSRQ"]}','{mainRow["StreetID"]}',getdate(),'{HttpContext.Current.Session["EmployeeName"]}','{mainRow["Community"]}' 
)";
                    SysDatabase.ExecuteNonQuery(sql, tran);
                    //插入T_R_FamilyInfo_JTMX
                    sql = $@"INSERT INTO [T_R_FamilyInfo_JTMX]
           ([_AutoID]
           ,[_UserName]
           ,[_OrgCode]
           ,[_CreateTime]
           ,[_UpdateTime]
           ,[_IsDel]
           ,[_MainID]
           ,[_MainTbl]
           ,[_RowNo]
           ,[Name]
           ,[Relation]
           ,[CardID]
           ,[Income]
           ,[Memo])
      select [_AutoID]
           ,[_UserName]
           ,[_OrgCode]
           ,[_CreateTime]
           ,[_UpdateTime]
           ,[_IsDel]
           ,'{jtid}'
           ,'T_R_FamilyInfo'
           ,[_RowNo]
           ,[Name]
           ,[Relation]
           ,[CardID]
           ,[Income]
           ,[Memo] from T_R_ERescue_JTMX where _MainID='{ZBID}'";
                    SysDatabase.ExecuteNonQuery(sql, tran);

                    //插入T_R_FamilyInfo_JZMX
                    sql = $@"INSERT INTO  [T_R_FamilyInfo_JZMX]
           ([_AutoID]
           ,[_UserName]
           ,[_OrgCode]
           ,[_CreateTime]
           ,[_UpdateTime]
           ,[_IsDel]
           ,[_MainID]
           ,[_MainTbl]
           ,[_RowNo]
           ,[ApplyDate]
           ,[SQLB]
           ,[KNLB]
           ,[KNLX]
           ,[SheetNo]
           ,[JE]
           ,[PayDate]
           ,[SQID]
           ,[SQState])  
SELECT newid() 
      ,[_UserName]
      ,[_OrgCode]
      ,[_CreateTime]
      ,[_UpdateTime]
      ,[_IsDel]
      ,'{jtid}'
 ,'T_R_FamilyInfo'
      ,1
  ,[ApplyDate]
 ,[SQLB]
 ,[KNLB]
  ,[KNLX]
  ,[SheetNo]
 ,[JE]
,[_AutoID]
,PayDate
      ,[_WFState]
    
  FROM  [T_R_ERescue] where _AutoID='{ZBID}'";
                    SysDatabase.ExecuteNonQuery(sql, tran);

                }

            }
            catch (Exception error)
            {
                fileLogger.Error(error);
                throw new Exception(error.Message+error.Source+error.StackTrace);
            }
            return result;
        }
    }
}