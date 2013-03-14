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
        "click #save-answer": "saveAnswer",
        "change ul dl dd select": "areaSelectChange",
        "click .btn_blue_3": "pagingSurvey"
    },

    show: function () {
       this.pagingSurvey();
    },

    init: function () {
        this.currentIndex = 0;
        // page step
        $("#main>div").hide();
        $($("#main>div")[0]).show();
        $(".page_next").click(function () {
            $("#main>div").hide();
            $(this).parents(".paper_next_container").next().show();
        });

        this.show();
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
    },

    pagingSurvey: function () {
        var that = this;
        $("#page_cont").empty();
        $(json.question_html).each(function(index, element) {
            if( index >= that.currentIndex ) {
                $("#page_cont").append("<dl>" + $(element).html() +"</dl>" );
                if ($(element).find(".questionary_list_opera").size() !== 0) {
                    that.currentIndex = index + 1;
                    return false;
                };
            }
            if(index + 1 === $(json.question_html).size()){
                $("#save-answer").show();
                $(".btn_blue_3").hide();
            } else {
                $("#save-answer").hide();
            }
        });
        $("#page_cont").find(".questionary_list_opera").remove();
    },

    saveAnswer: function() {
        var answerlist = [];
        var aa = [];
        $(json.topic_list).each(function (index, element) {
            var obj = $('#page_cont>ul').find('dl')[index];
            var question_no = element.question_no;
            var question_type = element.question_type;
            var answer_detail_list = [];
            switch (question_type) {
                case "0":
                case "1":
                    $(obj).find('dd>input').each(function (i, e) {
                        if (e.checked === true) {
                            if ($(e).parent().find('textarea')) {
                                answer_detail_list.push({
                                    question_value: element.options[i].item_num,
                                    open_question_value: $(e).parent().find('textarea').val(),
                                    province: "",
                                    city: "",
                                    area: ""
                                });
                            }
                            else {
                                answer_detail_list.push({
                                    question_value: element.options[i].item_num,
                                    open_question_value: "",
                                    province: "",
                                    city: "",
                                    area: ""
                                });
                            }
                        }
                    });
                    break;
                case "3":
                    var bb = "";
                    if ($(obj).find('textarea').val()) {
                        bb = $(obj).find('textarea').val();
                    }
                    else {
                        bb = $(obj).find('input').val();
                    }
                    answer_detail_list.push({
                        question_value: "",
                        open_question_value: bb,
                        province: "",
                        city: "",
                        area: ""
                    });
                    break;
                case "4":
                    answer_detail_list.push({
                        question_value: "",
                        open_question_value: "",
                        province: $(obj).find('.province').val(),
                        city: $(obj).find('.city').val(),
                        area: $(obj).find('.district').val()
                    });
                    break;
            };
            aa.push({
                result_id: json.result_id, //--->result_id,
                question_no: question_no,
                question_type: question_type,
                answer_detail_list: answer_detail_list
            });
        });

        var answer = {
            exam_id: "513efa775558883fbc56ce3c",
            start_time:"11/3/2013",
            end_time: "11/3/2013",
            is_effective: "Y",//('Y':有效，'N':无效,(默认'Y'))
            email: json.email,
            answer_list:aa
        };
        console.log(JSON.stringify(answer));
//        $.ajax({
//            url: "http://172.16.134.57:30403/surveyPlatform/examination/saveAnswer",
//            type: "POST",
//            data: JSON.stringify(answer),
//            success: function (response, option) {

//            }
//        });
    }
});