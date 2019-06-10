String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                } else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    } else {
        return this;
    }
};
(function ($) {

    var templage = '<li class="summary-stock">'
            + '<div class="dd">'
            + '<div class="store-selector hover">'
            + '<div class="text">'
            + ' <div title="请选择">'
            + ' 请选择'
            + ' </div>'
            + '<b></b>'
            + ' </div>'
            + '<div class="content">'
            + ' <div data-widget="tabs" class="m JD-stock">'
            + '   <div class="mt">'
            + '     <ul class="tab">'
            + '    {tabheader}   '
            // +'         <li data-index="0" data-widget="tab-item" class=""><a href="#none" class="hover"><em>北京</em><i></i></a></li>'
            //  +'        <li data-index="1" data-widget="tab-item" style="" class=""><a href="#none" class=""><em>朝阳区</em><i></i></a></li>'
            //  +'        <li data-index="2" data-widget="tab-item" style="" class="curr"><a href="#none" class=""><em>请选择</em><i></i></a></li>'
            //  +'        <li data-index="3" data-widget="tab-item" style="display:none;"><a href="#none" class=""><em>请选择</em><i></i></a></li>'
            + '    </ul>'
            + '    <div class="stock-line"></div>'
            + ' </div>'
            + '    {tabcontent}   '
            //   +' <div class="mc" data-area="0" data-widget="tab-content" style="display: none;">'
            // +'     <ul class="area-list">'
            //  +'         <li><a href="#none" data-value="84">钓鱼岛</a></li>'
            //  +'     </ul>'
            // +'  </div>'
            // +' <div class="mc" data-area="1" data-widget="tab-content" style="display: none;">'
            // +'     <ul class="area-list">'
            // +'         <li><a href="#none" data-value="72">朝阳区</a></li>'

            // +'     </ul>'
            // +' </div>'
            //  +' <div class="mc" data-area="2" data-widget="tab-content" style="display: block;">'
            //  +'     <ul class="area-list">'
            //  +'         <li><a href="#none" data-value="4137">管庄</a></li>'
            //  +'         <li class="long-area"><a href="#none" data-value="2819">三环到四环之间</a></li>'
            //  +'     </ul>'
            // +'  </div>'
            // +'  <div class="mc" data-area="3" data-widget="tab-content" style="display: none;"></div>'
            + '</div>'
            + ' </div>'
            + ' <div class="close"></div>'
            + ' </div> '
            + '<div class="store-prompt">'
            + '   <strong></strong>'
            + '</div>'
            + '</div>'
            + '</li>';
    var tabheadertempl = '<li data-index="{level}" data-widget="tab-item" {hideElement} class="{curr}"><a href="#none" class="hover"><em>{levelText}</em><i></i></a></li>';
    var tabcontenttempl = '<li {areaClass}><a href="#none"  data-path="{path}"  data-value="{id}">{text}</a></li>';
    var areaClass = 'class="long-area"';
    var hideElement = 'style="display: none;"';
    var curr = "curr";
    function chooseNexeLevel(element, id, path, name) {
        element = $(element);
        var childs = findChilds(element, id, path);
        var currentIndex = element.find(".curr").attr("data-index") * 1;
        var currendArrayIndex = 0;
        var fullName = "请选择";
        element.find("[data-index]").each(function (index) {
            var thisIndex = $(this).attr("data-index");
            var varname = $(this).find("em").text();
            if (fullName == "请选择") {
                fullName = "";
            }
            if (thisIndex == currentIndex) {
                fullName += name;
                currendArrayIndex = index;
                return false;
            }

            if (varname != "请选择") {
                fullName += varname;
            }
        });

        $(element).data(fullValKey, { id: id, path: path, name: name });
        $(element).data(valKey, id);

        $(element).find(".text").children().first().text(fullName);
        if (childs.length > 0) {

            //查找当前显示的面板，并隐藏 
            element.find("[data-index]").each(function (index) {
                if (index < currendArrayIndex) {

                } else if ((index == currendArrayIndex)) {
                    $(this).removeClass("curr").find("em").html(name);

                } else if ((index == (currendArrayIndex + 1))) {
                    $(this).addClass("curr").find("em").html("请选择");
                    $(this).show();
                } else if ((index > (currendArrayIndex + 1))) {
                    $(this).hide();
                }

            });
            count = childs.length;
            var firstLevleContent = '<ul class="area-list">';
            for (var i = 0; i < childs.length; i++) {
                var one = childs[i];
                var val = { id: one.id, text: one.name, areaClass: '', path: one.path };
                if (one.name.length > 4) {
                    val.areaClass = areaClass;
                }
                firstLevleContent += tabcontenttempl.format(val);

            }

            firstLevleContent += "</ul>";
            var nextContent = element.find("[data-area='" + (currentIndex + 1) + "']").html(firstLevleContent);
            //锁定当前显示面板的下一个，并填充和显示

            element.find("[data-area='" + currentIndex + "']").hide();
            nextContent.show();


        } else {
            element.find(".close").click();
        }




    }
    function loadServerChilds(element, parentID) {
        var element = $(element);
        var opts = element.data(datacachKey);
        var url = "";
        if ($.isFunction(opts.url)) {
            url = opts.url();
        } else {
            url = opts.url;
        }
        var result = [];
        $.ajax({
            url: url,
            type: "GET",
            data: { id: parentID },
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.IsSuccess) {
                    if (data.Data || data.Data.length > 0) {
                        result = data.Data;

                    }

                }
            }
        });
        return result;
    }
    function findChilds(element, id, path, options) {
        var opts = options;
        if (!opts) {
            opts = $(element).data(datacachKey);
        }

        var paths = path.split("|");

        var source = opts.source;
        var count = opts.source;
        var result = null;
        var isFind = false;
        var newpath = "";
        for (var i = 0; i < paths.length; i++) {
            if (i > 0) {
                newpath += "|";
            }
            newpath += paths[i];
            var count = source.length;
            for (var k = 0; k < count; k++) {
                if (source[k].id == id) {
                    result = source[k];
                    isFind = true;
                    break;
                } else if (source[k].path == newpath) {
                    //沿着这条线找 

                    if (opts.maxLevel <= paths.length) {

                    } else {
                        if (source[k].childs === undefined) {
                            var child = loadServerChilds(element, source[k].id);
                            source[k].childs = child;
                            $(element).data(datacachKey, opts);
                        }
                    }

                    source = source[k].childs;
                    break;
                }
            }
            if (isFind) {
                break;
            }
        }
        if (result.childs === undefined) {

            //需要去后端加载了
            var child = [];
            if (opts.maxLevel <= paths.length) {

            } else {
                child = loadServerChilds(element, source[k].id);
            }

            result.childs = child;

        }
        return result.childs;


    }
    // 级联联动控件
    var datacachKey = "sfCascade";
    var fullValKey = "sfCascadefullVal";
    var valKey = "sfCascadeVal";
    var defaults = {
        readOnly: false, //输入框是否只读
        enable: true, //控件帮助按钮是否可以
        placeholder: "请选择",
        url: "", //可以是字符串，也可以是function 
        pathUrl: "", //根据id查找返回{id,"",path:"",name:""} 的url
        source: [{ "childs": [{ "childs": [{ "id": 36, "name": "市辖区", "path": "1|2|36" }, { "id": 37, "name": "县", "path": "1|2|37" }], "id": 2, "name": "北京市", "path": "1|2" }, { "childs": [{ "id": 38, "name": "市辖区", "path": "1|3|38" }, { "id": 39, "name": "县", "path": "1|3|39" }], "id": 3, "name": "天津市", "path": "1|3" }, { "childs": [{ "id": 40, "name": "石家庄市", "path": "1|4|40" }, { "id": 41, "name": "唐山市", "path": "1|4|41" }, { "id": 42, "name": "秦皇岛市", "path": "1|4|42" }, { "id": 43, "name": "邯郸市", "path": "1|4|43" }, { "id": 44, "name": "邢台市", "path": "1|4|44" }, { "id": 45, "name": "保定市", "path": "1|4|45" }, { "id": 46, "name": "张家口市", "path": "1|4|46" }, { "id": 47, "name": "承德市", "path": "1|4|47" }, { "id": 48, "name": "沧州市", "path": "1|4|48" }, { "id": 49, "name": "廊坊市", "path": "1|4|49" }, { "id": 50, "name": "衡水市", "path": "1|4|50" }], "id": 4, "name": "河北省", "path": "1|4" }, { "childs": [{ "id": 51, "name": "太原市", "path": "1|5|51" }, { "id": 52, "name": "大同市", "path": "1|5|52" }, { "id": 53, "name": "阳泉市", "path": "1|5|53" }, { "id": 54, "name": "长治市", "path": "1|5|54" }, { "id": 55, "name": "晋城市", "path": "1|5|55" }, { "id": 56, "name": "朔州市", "path": "1|5|56" }, { "id": 57, "name": "晋中市", "path": "1|5|57" }, { "id": 58, "name": "运城市", "path": "1|5|58" }, { "id": 59, "name": "忻州市", "path": "1|5|59" }, { "id": 60, "name": "临汾市", "path": "1|5|60" }, { "id": 61, "name": "吕梁市", "path": "1|5|61" }], "id": 5, "name": "山西省", "path": "1|5" }, { "childs": [{ "id": 62, "name": "呼和浩特市", "path": "1|6|62" }, { "id": 63, "name": "包头市", "path": "1|6|63" }, { "id": 64, "name": "乌海市", "path": "1|6|64" }, { "id": 65, "name": "赤峰市", "path": "1|6|65" }, { "id": 66, "name": "通辽市", "path": "1|6|66" }, { "id": 67, "name": "鄂尔多斯市", "path": "1|6|67" }, { "id": 68, "name": "呼伦贝尔市", "path": "1|6|68" }, { "id": 69, "name": "巴彦淖尔市", "path": "1|6|69" }, { "id": 70, "name": "乌兰察布市", "path": "1|6|70" }, { "id": 71, "name": "兴安盟", "path": "1|6|71" }, { "id": 72, "name": "锡林郭勒盟", "path": "1|6|72" }, { "id": 73, "name": "阿拉善盟", "path": "1|6|73" }], "id": 6, "name": "内蒙古", "path": "1|6" }, { "childs": [{ "id": 74, "name": "沈阳市", "path": "1|7|74" }, { "id": 75, "name": "大连市", "path": "1|7|75" }, { "id": 76, "name": "鞍山市", "path": "1|7|76" }, { "id": 77, "name": "抚顺市", "path": "1|7|77" }, { "id": 78, "name": "本溪市", "path": "1|7|78" }, { "id": 79, "name": "丹东市", "path": "1|7|79" }, { "id": 80, "name": "锦州市", "path": "1|7|80" }, { "id": 81, "name": "营口市", "path": "1|7|81" }, { "id": 82, "name": "阜新市", "path": "1|7|82" }, { "id": 83, "name": "辽阳市", "path": "1|7|83" }, { "id": 84, "name": "盘锦市", "path": "1|7|84" }, { "id": 85, "name": "铁岭市", "path": "1|7|85" }, { "id": 86, "name": "朝阳市", "path": "1|7|86" }, { "id": 87, "name": "葫芦岛市", "path": "1|7|87" }], "id": 7, "name": "辽宁省", "path": "1|7" }, { "childs": [{ "id": 88, "name": "长春市", "path": "1|8|88" }, { "id": 89, "name": "吉林市", "path": "1|8|89" }, { "id": 90, "name": "四平市", "path": "1|8|90" }, { "id": 91, "name": "辽源市", "path": "1|8|91" }, { "id": 92, "name": "通化市", "path": "1|8|92" }, { "id": 93, "name": "白山市", "path": "1|8|93" }, { "id": 94, "name": "松原市", "path": "1|8|94" }, { "id": 95, "name": "白城市", "path": "1|8|95" }, { "id": 96, "name": "延边朝鲜族自治州", "path": "1|8|96" }], "id": 8, "name": "吉林省", "path": "1|8" }, { "childs": [{ "id": 97, "name": "哈尔滨市", "path": "1|9|97" }, { "id": 98, "name": "齐齐哈尔市", "path": "1|9|98" }, { "id": 99, "name": "鸡西市", "path": "1|9|99" }, { "id": 100, "name": "鹤岗市", "path": "1|9|100" }, { "id": 101, "name": "双鸭山市", "path": "1|9|101" }, { "id": 102, "name": "大庆市", "path": "1|9|102" }, { "id": 103, "name": "伊春市", "path": "1|9|103" }, { "id": 104, "name": "佳木斯市", "path": "1|9|104" }, { "id": 105, "name": "七台河市", "path": "1|9|105" }, { "id": 106, "name": "牡丹江市", "path": "1|9|106" }, { "id": 107, "name": "黑河市", "path": "1|9|107" }, { "id": 108, "name": "绥化市", "path": "1|9|108" }, { "id": 109, "name": "大兴安岭地区", "path": "1|9|109" }], "id": 9, "name": "黑龙江省", "path": "1|9" }, { "childs": [{ "id": 110, "name": "市辖区", "path": "1|10|110" }, { "id": 111, "name": "县", "path": "1|10|111" }], "id": 10, "name": "上海市", "path": "1|10" }, { "childs": [{ "id": 112, "name": "南京市", "path": "1|11|112" }, { "id": 113, "name": "无锡市", "path": "1|11|113" }, { "id": 114, "name": "徐州市", "path": "1|11|114" }, { "id": 115, "name": "常州市", "path": "1|11|115" }, { "id": 116, "name": "苏州市", "path": "1|11|116" }, { "id": 117, "name": "南通市", "path": "1|11|117" }, { "id": 118, "name": "连云港市", "path": "1|11|118" }, { "id": 119, "name": "淮安市", "path": "1|11|119" }, { "id": 120, "name": "盐城市", "path": "1|11|120" }, { "id": 121, "name": "扬州市", "path": "1|11|121" }, { "id": 122, "name": "镇江市", "path": "1|11|122" }, { "id": 123, "name": "泰州市", "path": "1|11|123" }, { "id": 124, "name": "宿迁市", "path": "1|11|124" }], "id": 11, "name": "江苏省", "path": "1|11" }, { "childs": [{ "id": 125, "name": "杭州市", "path": "1|12|125" }, { "id": 126, "name": "宁波市", "path": "1|12|126" }, { "id": 127, "name": "温州市", "path": "1|12|127" }, { "id": 128, "name": "嘉兴市", "path": "1|12|128" }, { "id": 129, "name": "湖州市", "path": "1|12|129" }, { "id": 130, "name": "绍兴市", "path": "1|12|130" }, { "id": 131, "name": "金华市", "path": "1|12|131" }, { "id": 132, "name": "衢州市", "path": "1|12|132" }, { "id": 133, "name": "舟山市", "path": "1|12|133" }, { "id": 134, "name": "台州市", "path": "1|12|134" }, { "id": 135, "name": "丽水市", "path": "1|12|135" }], "id": 12, "name": "浙江省", "path": "1|12" }, { "childs": [{ "id": 136, "name": "合肥市", "path": "1|13|136" }, { "id": 137, "name": "芜湖市", "path": "1|13|137" }, { "id": 138, "name": "蚌埠市", "path": "1|13|138" }, { "id": 139, "name": "淮南市", "path": "1|13|139" }, { "id": 140, "name": "马鞍山市", "path": "1|13|140" }, { "id": 141, "name": "淮北市", "path": "1|13|141" }, { "id": 142, "name": "铜陵市", "path": "1|13|142" }, { "id": 143, "name": "安庆市", "path": "1|13|143" }, { "id": 144, "name": "黄山市", "path": "1|13|144" }, { "id": 145, "name": "滁州市", "path": "1|13|145" }, { "id": 146, "name": "阜阳市", "path": "1|13|146" }, { "id": 147, "name": "宿州市", "path": "1|13|147" }, { "id": 148, "name": "六安市", "path": "1|13|148" }, { "id": 149, "name": "亳州市", "path": "1|13|149" }, { "id": 150, "name": "池州市", "path": "1|13|150" }, { "id": 151, "name": "宣城市", "path": "1|13|151" }], "id": 13, "name": "安徽省", "path": "1|13" }, { "childs": [{ "id": 152, "name": "福州市", "path": "1|14|152" }, { "id": 153, "name": "厦门市", "path": "1|14|153" }, { "id": 154, "name": "莆田市", "path": "1|14|154" }, { "id": 155, "name": "三明市", "path": "1|14|155" }, { "id": 156, "name": "泉州市", "path": "1|14|156" }, { "id": 157, "name": "漳州市", "path": "1|14|157" }, { "id": 158, "name": "南平市", "path": "1|14|158" }, { "id": 159, "name": "龙岩市", "path": "1|14|159" }, { "id": 160, "name": "宁德市", "path": "1|14|160" }], "id": 14, "name": "福建省", "path": "1|14" }, { "childs": [{ "id": 161, "name": "南昌市", "path": "1|15|161" }, { "id": 162, "name": "景德镇市", "path": "1|15|162" }, { "id": 163, "name": "萍乡市", "path": "1|15|163" }, { "id": 164, "name": "九江市", "path": "1|15|164" }, { "id": 165, "name": "新余市", "path": "1|15|165" }, { "id": 166, "name": "鹰潭市", "path": "1|15|166" }, { "id": 167, "name": "赣州市", "path": "1|15|167" }, { "id": 168, "name": "吉安市", "path": "1|15|168" }, { "id": 169, "name": "宜春市", "path": "1|15|169" }, { "id": 170, "name": "抚州市", "path": "1|15|170" }, { "id": 171, "name": "上饶市", "path": "1|15|171" }], "id": 15, "name": "江西省", "path": "1|15" }, { "childs": [{ "id": 172, "name": "济南市", "path": "1|16|172" }, { "id": 173, "name": "青岛市", "path": "1|16|173" }, { "id": 174, "name": "淄博市", "path": "1|16|174" }, { "id": 175, "name": "枣庄市", "path": "1|16|175" }, { "id": 176, "name": "东营市", "path": "1|16|176" }, { "id": 177, "name": "烟台市", "path": "1|16|177" }, { "id": 178, "name": "潍坊市", "path": "1|16|178" }, { "id": 179, "name": "济宁市", "path": "1|16|179" }, { "id": 180, "name": "泰安市", "path": "1|16|180" }, { "id": 181, "name": "威海市", "path": "1|16|181" }, { "id": 182, "name": "日照市", "path": "1|16|182" }, { "id": 183, "name": "莱芜市", "path": "1|16|183" }, { "id": 184, "name": "临沂市", "path": "1|16|184" }, { "id": 185, "name": "德州市", "path": "1|16|185" }, { "id": 186, "name": "聊城市", "path": "1|16|186" }, { "id": 187, "name": "滨州市", "path": "1|16|187" }, { "id": 188, "name": "菏泽市", "path": "1|16|188" }], "id": 16, "name": "山东省", "path": "1|16" }, { "childs": [{ "id": 189, "name": "郑州市", "path": "1|17|189" }, { "id": 190, "name": "开封市", "path": "1|17|190" }, { "id": 191, "name": "洛阳市", "path": "1|17|191" }, { "id": 192, "name": "平顶山市", "path": "1|17|192" }, { "id": 193, "name": "安阳市", "path": "1|17|193" }, { "id": 194, "name": "鹤壁市", "path": "1|17|194" }, { "id": 195, "name": "新乡市", "path": "1|17|195" }, { "id": 196, "name": "焦作市", "path": "1|17|196" }, { "id": 197, "name": "濮阳市", "path": "1|17|197" }, { "id": 198, "name": "许昌市", "path": "1|17|198" }, { "id": 199, "name": "漯河市", "path": "1|17|199" }, { "id": 200, "name": "三门峡市", "path": "1|17|200" }, { "id": 201, "name": "南阳市", "path": "1|17|201" }, { "id": 202, "name": "商丘市", "path": "1|17|202" }, { "id": 203, "name": "信阳市", "path": "1|17|203" }, { "id": 204, "name": "周口市", "path": "1|17|204" }, { "id": 205, "name": "驻马店市", "path": "1|17|205" }, { "id": 206, "name": "省直辖县", "path": "1|17|206" }], "id": 17, "name": "河南省", "path": "1|17" }, { "childs": [{ "id": 207, "name": "武汉市", "path": "1|18|207" }, { "id": 208, "name": "黄石市", "path": "1|18|208" }, { "id": 209, "name": "十堰市", "path": "1|18|209" }, { "id": 210, "name": "宜昌市", "path": "1|18|210" }, { "id": 211, "name": "襄阳市", "path": "1|18|211" }, { "id": 212, "name": "鄂州市", "path": "1|18|212" }, { "id": 213, "name": "荆门市", "path": "1|18|213" }, { "id": 214, "name": "孝感市", "path": "1|18|214" }, { "id": 215, "name": "荆州市", "path": "1|18|215" }, { "id": 216, "name": "黄冈市", "path": "1|18|216" }, { "id": 217, "name": "咸宁市", "path": "1|18|217" }, { "id": 218, "name": "随州市", "path": "1|18|218" }, { "id": 219, "name": "恩施土家族苗族自治州", "path": "1|18|219" }, { "id": 220, "name": "省直辖县", "path": "1|18|220" }, { "id": 46829, "name": "神农架林区", "path": "1|18|46829" }], "id": 18, "name": "湖北省", "path": "1|18" }, { "childs": [{ "id": 221, "name": "长沙市", "path": "1|19|221" }, { "id": 222, "name": "株洲市", "path": "1|19|222" }, { "id": 223, "name": "湘潭市", "path": "1|19|223" }, { "id": 224, "name": "衡阳市", "path": "1|19|224" }, { "id": 225, "name": "邵阳市", "path": "1|19|225" }, { "id": 226, "name": "岳阳市", "path": "1|19|226" }, { "id": 227, "name": "常德市", "path": "1|19|227" }, { "id": 228, "name": "张家界市", "path": "1|19|228" }, { "id": 229, "name": "益阳市", "path": "1|19|229" }, { "id": 230, "name": "郴州市", "path": "1|19|230" }, { "id": 231, "name": "永州市", "path": "1|19|231" }, { "id": 232, "name": "怀化市", "path": "1|19|232" }, { "id": 233, "name": "娄底市", "path": "1|19|233" }, { "id": 234, "name": "湘西土家族苗族自治州", "path": "1|19|234" }], "id": 19, "name": "湖南省", "path": "1|19" }, { "childs": [{ "id": 235, "name": "广州市", "path": "1|20|235" }, { "id": 236, "name": "韶关市", "path": "1|20|236" }, { "id": 237, "name": "深圳市", "path": "1|20|237" }, { "id": 238, "name": "珠海市", "path": "1|20|238" }, { "id": 239, "name": "汕头市", "path": "1|20|239" }, { "id": 240, "name": "佛山市", "path": "1|20|240" }, { "id": 241, "name": "江门市", "path": "1|20|241" }, { "id": 242, "name": "湛江市", "path": "1|20|242" }, { "id": 243, "name": "茂名市", "path": "1|20|243" }, { "id": 244, "name": "肇庆市", "path": "1|20|244" }, { "id": 245, "name": "惠州市", "path": "1|20|245" }, { "id": 246, "name": "梅州市", "path": "1|20|246" }, { "id": 247, "name": "汕尾市", "path": "1|20|247" }, { "id": 248, "name": "河源市", "path": "1|20|248" }, { "id": 249, "name": "阳江市", "path": "1|20|249" }, { "id": 250, "name": "清远市", "path": "1|20|250" }, { "id": 251, "name": "东莞市", "path": "1|20|251" }, { "id": 252, "name": "中山市", "path": "1|20|252" }, { "id": 253, "name": "潮州市", "path": "1|20|253" }, { "id": 254, "name": "揭阳市", "path": "1|20|254" }, { "id": 255, "name": "云浮市", "path": "1|20|255" }, { "id": 46814, "name": "吴川市", "path": "1|20|46814" }], "id": 20, "name": "广东省", "path": "1|20" }, { "childs": [{ "id": 256, "name": "南宁市", "path": "1|21|256" }, { "id": 257, "name": "柳州市", "path": "1|21|257" }, { "id": 258, "name": "桂林市", "path": "1|21|258" }, { "id": 259, "name": "梧州市", "path": "1|21|259" }, { "id": 260, "name": "北海市", "path": "1|21|260" }, { "id": 261, "name": "防城港市", "path": "1|21|261" }, { "id": 262, "name": "钦州市", "path": "1|21|262" }, { "id": 263, "name": "贵港市", "path": "1|21|263" }, { "id": 264, "name": "玉林市", "path": "1|21|264" }, { "id": 265, "name": "百色市", "path": "1|21|265" }, { "id": 266, "name": "贺州市", "path": "1|21|266" }, { "id": 267, "name": "河池市", "path": "1|21|267" }, { "id": 268, "name": "来宾市", "path": "1|21|268" }, { "id": 269, "name": "崇左市", "path": "1|21|269" }], "id": 21, "name": "广西", "path": "1|21" }, { "childs": [{ "id": 270, "name": "海口市", "path": "1|22|270" }, { "id": 271, "name": "三亚市", "path": "1|22|271" }, { "id": 272, "name": "省直辖县", "path": "1|22|272" }, { "id": 273, "name": "三沙市", "path": "1|22|273" }], "id": 22, "name": "海南省", "path": "1|22" }, { "childs": [{ "id": 274, "name": "市辖区", "path": "1|23|274" }, { "id": 275, "name": "县", "path": "1|23|275" }], "id": 23, "name": "重庆市", "path": "1|23" }, { "childs": [{ "id": 276, "name": "成都市", "path": "1|24|276" }, { "id": 277, "name": "自贡市", "path": "1|24|277" }, { "id": 278, "name": "攀枝花市", "path": "1|24|278" }, { "id": 279, "name": "泸州市", "path": "1|24|279" }, { "id": 280, "name": "德阳市", "path": "1|24|280" }, { "id": 281, "name": "绵阳市", "path": "1|24|281" }, { "id": 282, "name": "广元市", "path": "1|24|282" }, { "id": 283, "name": "遂宁市", "path": "1|24|283" }, { "id": 284, "name": "内江市", "path": "1|24|284" }, { "id": 285, "name": "乐山市", "path": "1|24|285" }, { "id": 286, "name": "南充市", "path": "1|24|286" }, { "id": 287, "name": "眉山市", "path": "1|24|287" }, { "id": 288, "name": "宜宾市", "path": "1|24|288" }, { "id": 289, "name": "广安市", "path": "1|24|289" }, { "id": 290, "name": "达州市", "path": "1|24|290" }, { "id": 291, "name": "雅安市", "path": "1|24|291" }, { "id": 292, "name": "巴中市", "path": "1|24|292" }, { "id": 293, "name": "资阳市", "path": "1|24|293" }, { "id": 294, "name": "阿坝藏族羌族自治州", "path": "1|24|294" }, { "id": 295, "name": "甘孜藏族自治州", "path": "1|24|295" }, { "id": 296, "name": "凉山彝族自治州", "path": "1|24|296" }], "id": 24, "name": "四川省", "path": "1|24" }, { "childs": [{ "id": 297, "name": "贵阳市", "path": "1|25|297" }, { "id": 298, "name": "六盘水市", "path": "1|25|298" }, { "id": 299, "name": "遵义市", "path": "1|25|299" }, { "id": 300, "name": "安顺市", "path": "1|25|300" }, { "id": 301, "name": "毕节市", "path": "1|25|301" }, { "id": 302, "name": "铜仁市", "path": "1|25|302" }, { "id": 303, "name": "黔西南布依族苗族自治州", "path": "1|25|303" }, { "id": 304, "name": "黔东南苗族侗族自治州", "path": "1|25|304" }, { "id": 305, "name": "黔南布依族苗族自治州", "path": "1|25|305" }], "id": 25, "name": "贵州省", "path": "1|25" }, { "childs": [{ "id": 306, "name": "昆明市", "path": "1|26|306" }, { "id": 307, "name": "曲靖市", "path": "1|26|307" }, { "id": 308, "name": "玉溪市", "path": "1|26|308" }, { "id": 309, "name": "保山市", "path": "1|26|309" }, { "id": 310, "name": "昭通市", "path": "1|26|310" }, { "id": 311, "name": "丽江市", "path": "1|26|311" }, { "id": 312, "name": "普洱市", "path": "1|26|312" }, { "id": 313, "name": "临沧市", "path": "1|26|313" }, { "id": 314, "name": "楚雄彝族自治州", "path": "1|26|314" }, { "id": 315, "name": "红河哈尼族彝族自治州", "path": "1|26|315" }, { "id": 316, "name": "文山壮族苗族自治州", "path": "1|26|316" }, { "id": 317, "name": "西双版纳傣族自治州", "path": "1|26|317" }, { "id": 318, "name": "大理白族自治州", "path": "1|26|318" }, { "id": 319, "name": "德宏傣族景颇族自治州", "path": "1|26|319" }, { "id": 320, "name": "怒江傈僳族自治州", "path": "1|26|320" }, { "id": 321, "name": "迪庆藏族自治州", "path": "1|26|321" }], "id": 26, "name": "云南省", "path": "1|26" }, { "childs": [{ "id": 322, "name": "拉萨市", "path": "1|27|322" }, { "id": 323, "name": "昌都地区", "path": "1|27|323" }, { "id": 324, "name": "山南地区", "path": "1|27|324" }, { "id": 325, "name": "日喀则地区", "path": "1|27|325" }, { "id": 326, "name": "那曲地区", "path": "1|27|326" }, { "id": 327, "name": "阿里地区", "path": "1|27|327" }, { "id": 328, "name": "林芝地区", "path": "1|27|328" }], "id": 27, "name": "西藏", "path": "1|27" }, { "childs": [{ "id": 329, "name": "西安市", "path": "1|28|329" }, { "id": 330, "name": "铜川市", "path": "1|28|330" }, { "id": 331, "name": "宝鸡市", "path": "1|28|331" }, { "id": 332, "name": "咸阳市", "path": "1|28|332" }, { "id": 333, "name": "渭南市", "path": "1|28|333" }, { "id": 334, "name": "延安市", "path": "1|28|334" }, { "id": 335, "name": "汉中市", "path": "1|28|335" }, { "id": 336, "name": "榆林市", "path": "1|28|336" }, { "id": 337, "name": "安康市", "path": "1|28|337" }, { "id": 338, "name": "商洛市", "path": "1|28|338" }], "id": 28, "name": "陕西省", "path": "1|28" }, { "childs": [{ "id": 339, "name": "兰州市", "path": "1|29|339" }, { "id": 340, "name": "嘉峪关市", "path": "1|29|340" }, { "id": 341, "name": "金昌市", "path": "1|29|341" }, { "id": 342, "name": "白银市", "path": "1|29|342" }, { "id": 343, "name": "天水市", "path": "1|29|343" }, { "id": 344, "name": "武威市", "path": "1|29|344" }, { "id": 345, "name": "张掖市", "path": "1|29|345" }, { "id": 346, "name": "平凉市", "path": "1|29|346" }, { "id": 347, "name": "酒泉市", "path": "1|29|347" }, { "id": 348, "name": "庆阳市", "path": "1|29|348" }, { "id": 349, "name": "定西市", "path": "1|29|349" }, { "id": 350, "name": "陇南市", "path": "1|29|350" }, { "id": 351, "name": "临夏回族自治州", "path": "1|29|351" }, { "id": 352, "name": "甘南藏族自治州", "path": "1|29|352" }], "id": 29, "name": "甘肃省", "path": "1|29" }, { "childs": [{ "id": 353, "name": "西宁市", "path": "1|30|353" }, { "id": 354, "name": "海东地区", "path": "1|30|354" }, { "id": 355, "name": "海北藏族自治州", "path": "1|30|355" }, { "id": 356, "name": "黄南藏族自治州", "path": "1|30|356" }, { "id": 357, "name": "海南藏族自治州", "path": "1|30|357" }, { "id": 358, "name": "果洛藏族自治州", "path": "1|30|358" }, { "id": 359, "name": "玉树藏族自治州", "path": "1|30|359" }, { "id": 360, "name": "海西蒙古族藏族自治州", "path": "1|30|360" }], "id": 30, "name": "青海省", "path": "1|30" }, { "childs": [{ "id": 361, "name": "银川市", "path": "1|31|361" }, { "id": 362, "name": "石嘴山市", "path": "1|31|362" }, { "id": 363, "name": "吴忠市", "path": "1|31|363" }, { "id": 364, "name": "固原市", "path": "1|31|364" }, { "id": 365, "name": "中卫市", "path": "1|31|365" }], "id": 31, "name": "宁夏", "path": "1|31" }, { "childs": [{ "id": 366, "name": "乌鲁木齐市", "path": "1|32|366" }, { "id": 367, "name": "克拉玛依市", "path": "1|32|367" }, { "id": 368, "name": "吐鲁番地区", "path": "1|32|368" }, { "id": 369, "name": "哈密地区", "path": "1|32|369" }, { "id": 370, "name": "昌吉回族自治州", "path": "1|32|370" }, { "id": 371, "name": "博尔塔拉蒙古自治州", "path": "1|32|371" }, { "id": 372, "name": "巴音郭楞蒙古自治州", "path": "1|32|372" }, { "id": 373, "name": "阿克苏地区", "path": "1|32|373" }, { "id": 374, "name": "克孜勒苏柯尔克孜自治州", "path": "1|32|374" }, { "id": 375, "name": "喀什地区", "path": "1|32|375" }, { "id": 376, "name": "和田地区", "path": "1|32|376" }, { "id": 377, "name": "伊犁哈萨克自治州", "path": "1|32|377" }, { "id": 378, "name": "塔城地区", "path": "1|32|378" }, { "id": 379, "name": "阿勒泰地区", "path": "1|32|379" }, { "id": 380, "name": "自治区直辖县", "path": "1|32|380" }], "id": 32, "name": "新疆", "path": "1|32" }, { "id": 33, "name": "台湾省", "path": "1|33" }, { "id": 34, "name": "香港", "path": "1|34" }, { "id": 35, "name": "澳门", "path": "1|35" }], "id": 1, "name": "中国", "path": "1" }],
        startRootPath: "1", // 1|36 则只查山东省
        maxLevel: 5,
        beforeOpen: function () { }, //返回false时，停止打开 
        afterOpen: function () { },
        beforeLoadData: function () { },
        afterLoadData: function () { },
        onClosing: function () {

        }, //返回false时，停止关闭  也可以用在帮助返回值前的校验工作
        onClosed: function () { },
    };
    function innit(element, options) {
        // 执行代码
        if (element[0].tagName !== "UL") {
            sf.Notify.error("Html元素必须是UL");
            return this;
        } else {
            var elementid = element.attr("id");
            if (!elementid) {
                sf.Notify.error("Html元素必须包含ID属性");
                return this;
            }
            element.empty();
            //element.addClass("input-group form-control");
            element.addClass(datacachKey);

            //获取数据
            if (!options.source || options.source.length == 0) {
                var url = "";
                if ($.isFunction(options.url)) {
                    url = options.url();
                } else {
                    url = options.url;
                }
                $.ajax({
                    url: url,
                    type: "GET",
                    data: data,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.IsSuccess) {
                            options.source = data.Data;
                        }
                    }
                });
            }
            if (options.source) {
                var startPath = options.startRootPath.split("|");

                var startLevle = startPath.length + 1;
                var tabHead = "";
                for (var i = startLevle; i <= options.maxLevel; i++) {
                    var val = { level: i, levelText: "请选择", curr: "", };
                    if (i == startLevle) {
                        val.hideElement = "";
                        val.curr = curr;
                    } else {
                        val.hideElement = hideElement;
                    }

                    tabHead += tabheadertempl.format(val);
                }
                var firstChilds = findChilds(element, startPath[startPath.length - 1], options.startRootPath, options);
                var firstLevleContent = "";
                if (firstChilds.length > 0) {


                    firstLevleContent = '<ul class="area-list">';
                    for (var i = 0; i < firstChilds.length; i++) {
                        var one = firstChilds[i];
                        var val = { id: one.id, text: one.name, areaClass: '', path: one.path };
                        if (one.name.length > 4) {
                            val.areaClass = areaClass;
                        }
                        firstLevleContent += tabcontenttempl.format(val);

                    }
                    firstLevleContent += "</ul>";
                }
                var tabContent = "";
                for (var i = startLevle; i <= options.maxLevel; i++) {
                    var style = hideElement;
                    if (i == startLevle) {
                        style = 'style="display: block;"';
                    }

                    tabContent += ' <div class="mc" data-area="' + i + '" data-widget="tab-content" ' + style + '>';
                    if (i == startLevle) {
                        tabContent += firstLevleContent;
                    }
                    tabContent += '</div>';
                }
                content = templage.format({ tabheader: tabHead, tabcontent: tabContent });
                element.append(content);
            }
        }
    }

    function bindEvent(element, options) {
        var elementid = "#" + element.attr("id");
        $(elementid).on("click", ".close", function (envent) {
            $(this).closest('ul').removeClass('hover');
            $(envent.delegateTarget).trigger("input.update.bv");

        });

        $(elementid).find(".text b").off("mouseover").on("mouseover", function () {
            $(this).closest("." + datacachKey).addClass('hover');
            $(elementid + " .content,.JD-stock").show();
        }).find("dl").remove();
        $(elementid + "  .tab li").on("click", function () {
            var curentIndex = $(this).attr("data-index");
            if (!$(this).hasClass("curr")) {
                $(elementid + "  .tab li").not(this).removeClass("curr");
                $(this).addClass("curr");
                $(elementid + "  .mc").each(function () {
                    var index = $(this).attr("data-area");
                    if (curentIndex === index) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }

                });
            }

        });
        $(elementid).on("click", "a[data-value]", function () {

            var id = $(this).attr("data-value");
            var path = $(this).attr("data-path");
            chooseNexeLevel(elementid, id, path, $(this).text());
            if (options.onClosed) {
                options.onClosed();
            }

        });


    }
    function getVal(container) {
        var element = $(container);
        return element.data(valKey);
    }
    function getFullVal(container) {
        var element = $(container);
        return element.data(fullValKey);
    }
    function setVal(container, val) {
        var mustServer = false;
        var element = $(container);
        var id = "";
        var opts = element.data(datacachKey);
        if ($.type(val) === "string" || $.type(val) === "number") {
            mustServer = true;
            id = val;
        } else if ($.isPlainObject(val)) {
            if (!val.id || !val.path || !val.name) {
                mustServer = true;
                id = val.id;
            }
        }

        if (mustServer && id) {
            $.ajax({
                url: opts.pathUrl,
                type: "GET",
                data: { id: id, ctrlID: element.attr("id") },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.IsSuccess) {
                        if (data.Data) {
                            var ctrolID = data.Data.ctrlID;
                            $("#" + ctrolID).find(".curr").removeClass("curr");
                            $("#" + ctrolID).find("[data-widget='tab-item']").first().addClass("curr");
                            var data = data.Data.data[0];
                            var paths = data.path.split('|');
                            var fullNames = data.FullName.split('/');
                            var startPath = opts.startRootPath;
                            var startPaths = startPath.split('|');
                            paths = paths.slice(startPaths.length);
                            if (paths.length > 0) {
                                var newpath = startPath;
                                for (var i in paths) {
                                    newpath += "|" + paths[i];
                                    chooseNexeLevel($("#" + ctrolID), paths[i], newpath, fullNames[i * 1 + startPaths.length]);

                                }
                            }

                        }
                    }
                }
            });
        }
    }
    function getOption() {

        return $(this).data(datacachKey);
    }

    var methods = {
        val: function (val) {
            if (val === undefined) {
                //获取值
                return getVal(this[0]);
            } else {
                //设置值
                setVal(this[0], val)
            }
        },
        fullVal: function (val) {
            //获取值
            return getFullVal(this[0]);

        },
        getOption: getOption,
    };
    $.fn.sfCascade = function (options) {
        var method = arguments[0];
        if ($.type(method) === "string") {

            if (methods[method]) {
                method = methods[method];
                arguments = Array.prototype.slice.call(arguments, 1);
                return method.apply(this, arguments);
            } else {

                sf.Notify.error("当前方法" + method + "不存在");
                return this;
            }
        } else {
            var opts = $.extend({}, defaults, options || {});
            // 遍历匹配的元素||元素集合，并返回this，以便进行链式调用。
            return this.each(function () {

                // 此处可通过this来获得每个单独的元素(jQuery对象)
                var $this = $(this);
                innit($this, opts);
                bindEvent($this, opts);
                $(this).data(datacachKey, opts);

            });
        }


    }

})(jQuery);



