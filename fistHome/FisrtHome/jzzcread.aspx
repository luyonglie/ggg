<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="jzzcread.aspx.cs" Inherits="FisrtHome.jzzcread" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>救助政策详细信息</title>
    <link rel="stylesheet" href="../../css/newsStyle.css" />
    <script type="text/javascript" src="../../js/jquery-1.7.min.js"></script>
    <script type="text/javascript" src="../../js/swfobject.js"></script>

     <script type="text/javascript">
         $(function () {
             $("#viewlink").click(function () {
                 $(".readdiv").toggle();
             });
         });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="cbox">
        <table>
        <tr>
            <td>
                <div class="ctitle"><%=newstitle %></div>

                <div class="ccontent">
                <%=newscontent %>
				<script type="text/javascript">
				    jQuery("embed").each(function (i) {
				        var panelId = "video" + i;
				        var src = $(this).attr("src");
				        var w = $(this).attr("width");
				        var h = $(this).attr("height");
				        var a = $(this).attr("autostart") == "true" ? "1" : "0";
				        $(this).after("<div id='" + panelId + "'></div><div><a href='" + src + "' target='_blank'>【点击下载】</a></div>").remove();

				        var flashvars = {}; var attributes = {};
				        var params = { "menu": "false", "wmode": "window", "FlashVars": "vcastr_file=" + src + "&amp;LogoText=&amp;BufferTime=1&amp;IsAutoPlay=" + a, "AllowFullScreen": "true", "bgcolor": "676767" };

				        swfobject.embedSWF("../../js/flvplayer.swf", panelId, w, h, "9.0.0", "expressInstall.swf", flashvars, params, attributes);
				        swfobject.registerObject("mngspsx1");

				    });

				</script>
                </div>
            </td>
        </tr>
        <tr>
            <td>
            <br/>
                <div style="border-top:1px #999 dashed;padding-top:20px;">
                <span>相关附件：</span><br/>
                <%=fjlist %>
                </div>
	    </td>
	</tr><tr><td>
                <div style="border-top:1px #999 dashed;padding-top:20px;clear:both;">
                    <span class="label">接收情况：</span><span><%=total %></span>&nbsp;&nbsp;<a id='viewlink' href="javascript:"><b>[查看详情]</b></a>
		     <div class="readdiv" style="display:none;">
                    <div class="green"><%=ReadedList %></div>
                    <div class="red"><%=UnReadList%></div>
                     </div>
                </div>
		</td></tr>
	<tr><td>
                <div class="ccomment">
                <h3>相关评论</h3>

                <%=commentlist %>
                    <div class="cwrite">
                        <h4>我来说两句</h4>
                        <asp:TextBox ID="TextBox1" runat="server" TextMode="MultiLine"></asp:TextBox>
                        <div class="cwrite_btns">
                        <input type="submit" value="提 交" class="h_submit" id="Submit1" onserverclick="Submit1_ServerClick" runat="server"/>
                        <input type="reset" value="清 空" class="h_submit" />&nbsp;&nbsp;&nbsp;&nbsp;
                        <asp:TextBox ID="TextBox2" runat="server" style="display:none"></asp:TextBox>&nbsp;&nbsp;</div>
                    </div>
                </div>
            </td>
        </tr>
        </table>
    </div>
    </form>
</body>
</html>

