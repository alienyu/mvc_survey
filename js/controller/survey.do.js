var answer_list = [];
var answer_current_list = []; //当前页面答案缓存
var questionIndex = 0; //当前页面题目在集合中的位置
var pushAnswerNum = 0; //验证不通过时将questionIndex恢复当前页面初始值；
var SurveyDo = Spine.Controller.sub({
    elements: {
        "#page_cont": "page_cont"
    },

    events: {
        "click #save-answer": "saveAnswer",
        "change div dl dd select": "areaSelectChange",
        "click #next-page": "pagingSurvey",
        "click .page_next": "pageNext"
    },

    show: function () {
        $(".paper_next_container:gt(0)").hide();
        this._initQuestion();
    },

    init: function () {
        this.currentPage = 0;
        this.show();
        this.quotaResult = true;
        this.logicList = JSON.parse(json.logic_control_js);
        this.quotaList = JSON.parse(json.quota_control_js);
        console.log(this.logicList);
        console.log(this.quotaList);
    },

    _initQuestion: function () {
        isValid = 0;
        var that = this;
        $("#page_cont").empty();
        $("#page_cont").append($("<div></div>"));
        var lastDiv = $("#page_cont div:last").hide();
        $(json.question_html).each(function(index, element) {
            lastDiv.append(element);
            if ($(element).find(".questionary_list_opera").size() !== 0) {
                $("#page_cont").append($("<div></div>"));
                lastDiv = $("#page_cont div:last").hide();
            };
            that._initAreaOptions(element);
        });
        $($("#page_cont").children()[0]).show();
        this._submitButtonShow();
        $("#page_cont").find(".questionary_list_opera").remove();
    },

    pageNext: function (e) {
        if(isValid == 1) {return}
        $(".paper_next_container").hide();
        $(e.target).parents(".paper_next_container").next().show();
    },

    areaSelectChange: function (e) {
        var areaType = $(e.target).next().attr('class');
        $(e.target.nextElementSibling).empty().append("<option value='0'>请选择</option>");
        $(areaData[areaType]).each(function(index, element) {
            var parentCode = e.target.value;
            if((element.code.substring(0,2) === parentCode.substring(0,2) && areaType === "city") || (element.code.substring(0,4) === parentCode.substring(0,4) && areaType === "district")) {
                $(e.target.nextElementSibling).append($("#area-option-template").tmpl([element]));
            }
        });
    },

    pagingSurvey: function () {
        pushAnswerNum = questionIndex;
        if (answer_current_list.length !== 0) {
            $(answer_current_list).each(function(i,e) {
                answer_list.push(e);
            });
            answer_current_list = [];
        };
        isValid = 0;
        this.pushAnswer();
        if (isValid == 1) { return;}

        //TODO: run logic
        this._runLogic();
        this._runQuota();

        if(this.quotaResult) {
            $($("#page_cont").children()[this.currentPage]).hide();
            this.currentPage += 1;
            $($("#page_cont").children()[this.currentPage]).show();
            this._submitButtonShow();
        }
    },

    validTextArea: function(selected, question, element) {
        var no = question.question_no;
        //select a option included text area, then input text area
        $(element).find('dd input').each(function(i,e){
            if (e.checked === true) {
                selected ++;
                if (typeof $(e.parentNode).find('textarea')[0] !== "undefined" && $(e.parentNode).find('textarea').val() === ''){
                    alert("第" + no + "题补充选项未填");
                    isValid = 1;
                }
            }
        });
        //input a text area but not select option
        if (typeof $(element).find('textarea')[0] !== "undefined" && $(element).find('textarea').val() !== '' && $(element).find('textarea').parent().find('input')[0].checked === false) {
            alert("第" + no + "题" + "未勾选补充选项");
            isValid = 1;
        };
        //nothing has been chosen
        if (selected === 0) {
            alert("第" + no + "题未选择");
            isValid = 1;
        }
        return selected;
    },

    validMaxMinSelect: function(chosen, question) {
        var no =question.question_no;
        var max = parseInt(question.max_num);
        var min = parseInt(question.min_num);
        if ( chosen > max ) {
            alert("第" + no +"题" + "最多可选" + max + "个");
            isValid = 1;
        };
        if ( chosen < min ) {
            alert("第" + no +"题" + "最少应选" + min + "个");
            isValid = 1;
        };
    },

    validAnswer: function(question, element) {
        var selected = 0;
        var no = question.question_no;
        var type = question.question_type;
        switch(type) {
            case "0":
                this.validTextArea(selected, question, element);
                break;
            case "1":
                var chosen = this.validTextArea(selected, question, element);
                //max selection validation
                this.validMaxMinSelect(chosen, question);
                break;
            case "3":
                if ($(element).find('input').val() === '' || $(element).find('textarea').val() === '') {
                    alert("第" + no + "题未填写内容")
                    isValid = 1;
                };
                break;
            case "4":
                $(element).find("option:selected").each(function(i,e){
                    var regionType = (typeof [i==0 ? "省" : "市", "区县"][i] !== "undefined") ? i==0 ? "省" : "市" : "区县";
                    if ($(e).val() === "0") {
                        alert("第" + no + "题" + regionType + "未选");
                        isValid = 1;
                    };
                });
                break;
        };
    },

    pushAnswer: function() {
        var questionNum = $($($('#page_cont').children())[this.currentPage]).find('dl').length;
        var questionCurrentIndex = 0;
        var that = this;
        for(i=0;i<questionNum;i++) {
            var obj = $($($('#page_cont').children())[this.currentPage]).find('dl')[questionCurrentIndex];
            var question = json.topic_list[questionIndex];
            var question_no = json.topic_list[questionIndex].question_no;
            var question_type = json.topic_list[questionIndex].question_type;
            that.validAnswer(question, obj);
            var answer_detail_list = [];
            if (isValid == 1){questionIndex = pushAnswerNum;answer_current_list = [];return};
            switch (question_type) {
                case "0":
                case "1":
                    $(obj).find('dd input').each(function (i, e) {
                        if (e.checked === true) {
                            if ($(e).parent().find('textarea').length !== 0) {
                                answer_detail_list.push({
                                    question_value: json.topic_list[questionIndex].options[i].item_num,
                                    open_question_value: $(e).parent().find('textarea').val(),
                                    province: "",
                                    city: "",
                                    area: ""
                                });
                            }
                            else {
                                answer_detail_list.push({
                                    question_value: json.topic_list[questionIndex].options[i].item_num,
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
                    var text = "";
                    if ($(obj).find('textarea').val()) {
                        text = $(obj).find('textarea').val();
                    }
                    else {
                        text = $(obj).find('input').val();
                    }
                    answer_detail_list.push({
                        question_value: "",
                        open_question_value: text,
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
            answer_current_list.push({
                result_id: json.result_id, //--->result_id,
                question_no: question_no,
                question_type: question_type,
                answer_detail_list: answer_detail_list
            });
            questionCurrentIndex++;
            questionIndex++;
        }
    },

    saveAnswer: function() {
        if (answer_current_list.length !== 0) {
            $(answer_current_list).each(function(i,e) {
                answer_list.push(e);
            });
            answer_current_list = [];
        };
        pushAnswerNum = questionIndex;
        isValid = 0;
        this.pushAnswer();
        if (isValid == 1) {return};
        $(answer_current_list).each(function(i,e) {
            answer_list.push(e);
        });
        var answer = {
            ID: json.result_id,
            exam_id: "513efa775558883fbc56ce3c",
            start_time: "11/3/2013",
            end_time: "11/3/2013",
            is_effective: "Y", //('Y':有效，'N':无效,(默认'Y'))
            email: json.email,
            answer_list: answer_list
        };
        console.log(JSON.stringify(answer));
        //        $.ajax({
        //            url: "http://172.16.134.57:30403/surveyPlatform/examination/saveAnswer",
        //            type: "POST",
        //            data: JSON.stringify(answer),
        //            success: function (response, option) {

        //            }
        //        });
    },

    _runLogic: function () {
        //console.log($(this.logicList));
        for(var obj in answer_current_list) {
            for(var index in this.logicList) {
                var questionIndex = answer_current_list[obj].question_no - 1;//要查找的问题对象序号
                if(this.logicList[index].map[questionIndex]) { //查找问题有无对应逻辑条件
                    var currentLogic = this.logicList[index];
                    console.log(currentLogic);
                    var optionArray = currentLogic.map[questionIndex]; //获得逻辑条件集合
                    var condition = false;

                    var selectValues = answer_current_list[obj].answer_detail_list; //该问题当前已选答案
                    //开始遍历条件选项 若每个选项都满足 则触发条件
                    for(var index2 in optionArray) {
                        console.log(optionArray[index2]);
                        if(optionArray[index2].charAt(0) != "-"){ //正数 表示回答该项 触发条件
                            for(var value in selectValues){
                                var selectQuestionValue = "0";
                                switch(selectValues[value].question_value) {
                                    case "A":
                                        selectQuestionValue = "0";
                                        break;
                                    case "B":
                                        selectQuestionValue = "1";
                                        break;
                                    case "C":
                                        selectQuestionValue = "2";
                                        break;
                                    case "D":
                                        selectQuestionValue = "3";
                                        break;
                                }
                                if(optionArray[index2] === selectQuestionValue){
                                    condition = true;
                                    break;
                                }
                            }
                        } else {//负数 表示不回答该项 触发条件
                            condition = true;
                            for(var value in selectValues){
                                var selectQuestionValue = "0";
                                switch(selectValues[value].question_value){
                                    case "A":
                                        selectQuestionValue = "0";
                                        break;
                                    case "B":
                                        selectQuestionValue = "1";
                                        break;
                                    case "C":
                                        selectQuestionValue = "2";
                                        break;
                                    case "D":
                                        selectQuestionValue = "3";
                                        break;
                                }
                                if(optionArray[index2].substr(1) === selectQuestionValue){
                                    condition = false;
                                    break;
                                }
                            }
                        }
                    }
//                    console.log(this.logicList[index].action);

                    if(condition){ //满足触发条件
                        var queN = this.logicList[index].action.queN;
                        var optN =this.logicList[index].action.optN;
                        if(this.logicList[index].logicType === "0" && this.logicList[index].action.type === "0" && condition){ //控制逻辑  不显示
                            //$($("#page_cont>div>dl")[this.logicList[index].action.queN]).hide();
                            $($($("#page_cont>div>dl")[queN]).find("div")[optN]).hide();
                        } else if(this.logicList[index].logicType === "0" && this.logicList[index].action.type === "1" && condition){//控制逻辑  显示
                            $($($("#page_cont>div>dl")[queN]).find("div")[optN]).show();
                        }
                    }
                }
            }
        }
    },

    _detectCondition: function () {

    },

    _triggerAction : function () {

    },

    _runQuota: function () {
//console.log($(this.logicList));
        for(var obj in answer_current_list) {
            for(var index in this.quotaList) {
                var questionIndex = answer_current_list[obj].question_no - 1;//要查找的问题对象序号
                if(this.quotaList[index].map[questionIndex]) { //查找问题有无对应配额条件
                    var currentQuota = this.quotaList[index];
                    console.log(currentQuota);
                    var optionArray = currentQuota.map[questionIndex]; //获得配额条件集合
                    var condition = false;

                    var selectValues = answer_current_list[obj].answer_detail_list; //该问题当前已选答案
                    //开始遍历条件选项 若每个选项都满足 则触发条件
                    for(var index2 in optionArray) {
                        console.log(optionArray[index2]);
                        if(optionArray[index2].charAt(0) != "-"){ //正数 表示回答该项 触发条件
                            for(var value in selectValues){
                                var selectQuestionValue = "0";
                                switch(selectValues[value].question_value) {
                                    case "A":
                                        selectQuestionValue = "0";
                                        break;
                                    case "B":
                                        selectQuestionValue = "1";
                                        break;
                                    case "C":
                                        selectQuestionValue = "2";
                                        break;
                                    case "D":
                                        selectQuestionValue = "3";
                                        break;
                                }
                                if(optionArray[index2] === selectQuestionValue){
                                    condition = true;
                                    break;
                                }
                            }

                            if(condition && (currentQuota.number + 1) <= currentQuota.quota_MaxNum){
                                this.quotaList[index].number += 1;
                                condition = false;
                            }
                        } else {//负数 表示不回答该项 触发条件
                            condition = true;
                            for(var value in selectValues) {
                                var selectQuestionValue = "0";
                                switch(selectValues[value].question_value) {
                                    case "A":
                                        selectQuestionValue = "0";
                                        break;
                                    case "B":
                                        selectQuestionValue = "1";
                                        break;
                                    case "C":
                                        selectQuestionValue = "2";
                                        break;
                                    case "D":
                                        selectQuestionValue = "3";
                                        break;
                                }
                                if(optionArray[index2].substr(1) === selectQuestionValue){
                                    condition = false;
                                    break;
                                }
                            }

                            if(condition && (currentQuota.number + 1) <= currentQuota.quota_MaxNum){
                                this.quotaList[index].number += 1;
                            }
                        }
                    }

                    if(condition){ //满足触发条件
                        if(this.quotaList[index].quota_action === "0" && condition) { //配额  终止答题
                            alert(currentQuota.quota_message);
                            this.quotaResult = false;
                        } else if(this.quotaList[index].quota_action === "1" && condition) {//配额  继续答题

                        } else if(this.quotaList[index].quota_action === "2" && condition) {//配额  跳转

                        }
                    }
                }
            }
        }
    },

    _initAreaOptions: function(element) {

        if($(element).find('.province').size() !== 0) {
            $(areaData["province"]).each(function(index, element2) {
                $(element).find('.province').append($("#area-option-template").tmpl([element2]));
            });
        }

    },

    _submitButtonShow: function() {

        if (this.currentPage + 1 === $($("#page_cont").children()).size()) {
            $("#save-answer").show();
            $(".btn_blue_3").hide();
        } else {
            $("#save-answer").hide();
        }

    }
});