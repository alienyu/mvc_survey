/**
 * Created with JetBrains WebStorm.
 * User: ChuwaJack
 * Date: 13-3-13
 * Time: 上午10:31
 * To change this template use File | Settings | File Templates.
 */
var SurveyDo = Spine.Controller.sub({
    elements: {
        "#page_cont": "page_cont"
    },

    events: {
        "change ul dl dd select": "areaSelectChange"
    },

    show: function () {
        $(json.question_html).find(".pagingTag").index()
        this.el.html(json.question_html);
    },

    init: function () {
        // page step
        $("#main>div").hide();
        $($("#main>div")[0]).show();
        $(".page_next").click(function () {
            $("#main>div").hide();
            $(this).parents(".paper_next_container").next().show();
        });

        //$("#page_cont").find("div").remove();

        this.show();
        //$(".pagingTag").css("display", "none")

    },

    areaSelectChange: function (e) {
        var options = "";
        switch ($(e.target).next().attr('class')) {
            case "province" :
                for (var i = 0; i < data_province.length; i++){
                    var option = "<option value='" + data_province[i].code + "'>" + data_province[i].name + "</option>";
                    options += option;
                }
                break;
            case "city":
                for (var i = 0; i < data_city.length; i++){
                    if(data_city[i].code.substring(0,2) === e.target.value.substring(0,2)) {
                        var option = "<option value='" + data_city[i].code + "'>" + data_city[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            case  "district":
                for (var i = 0; i < data_district.length; i++){
                    if(data_district[i].code.substring(0,4) === e.target.value.substring(0,4)) {
                        var option = "<option value='" + data_district[i].code + "'>" + data_district[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            default :
                break;
        }
        $(e.target.nextElementSibling).empty().append("<option>请选择</option>" + options );
    }
});