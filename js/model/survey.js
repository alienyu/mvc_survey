// this is used to defined the survey model
var Survey = Spine.Model.sub();
Survey.configure('Survey', 'questions', 'activeQustIndex');
Survey.include({
    deleteQuestion: function (index) {
        if (this.activeQustIndex != index) {
            this.questions.splice(index, 1);
            this.trigger("questionChange", this.questions);
        }
        else {
            alert("You are editing this question now!");
        }
    },
    // insert or edit question
    updateQuestion: function (item) {
        //To do: update item
        if (this.activeQustIndex != null) {
            this.questions[this.activeQustIndex] = item;
        }
        else {
            this.questions.push(item);
        }
        this.trigger("questionChange", this.questions);
    },

    sortQuestion: function (oldIndex, newIndex) {
        this.questions.move(oldIndex, newIndex);
    },

    submitSurvey: function () {
        if (this.questions && this.questions.length > 0) {
            var surveyModel = {};
            surveyModel.ID = ""; //编号
            surveyModel.question_no = $("#question-no").val(); //问卷编号
            surveyModel.question_name = $("#question-name").val(); //问卷名
            surveyModel.client_id = $("#client-id").val(); //客户编号
            surveyModel.public_pic = $("#upload-public-pic").val(); //问卷宣传图
            surveyModel.end_date = $("#end-time").val(); //结束时间
            surveyModel.face_page = $("#upload-face-page").val(); //封面
            surveyModel.logo = $("#upload-logo").val(); //logo
            surveyModel.bottom_page = $("#upload-bottom-age").val(); //封底
            surveyModel.template_id = $("#template-id").val(); //问卷模板
            surveyModel.join_point = parseInt($("#join-point").val()); //参与问卷给与积分
            surveyModel.complate_point = parseInt($("#complate-point").val()); //完成问卷给予积分
            surveyModel.examination_type = $("#examination-type").val(); //"问卷类型",[0趣味1试用2商务]
            surveyModel.examination_detail = $("#examination-detail").val(); //问卷说明
            surveyModel.quota = 0; //配额
            surveyModel.ques_count = this.questions.length; //总试题量
            surveyModel.company = ""; //所属公司
            surveyModel.remark = $("#remark").val(); //备注
            surveyModel.status = ""; //状态
            surveyModel.question_html = this._getQuestionHtml(); //问题HTML
            surveyModel.logic_control_js = ""; //逻辑js
            surveyModel.quota_control_js = ""; //配额js
            surveyModel.topic_list = null;
            surveyModel.result_id = ""; //答题ID
            surveyModel.email = ""; //答题人email
        }
    },

    _getQuestionHtml: function () {
        var question_html = "";
        var tmpl = $("#survey-preview-list").tmpl();

        $(tmpl).find("input[class='add-break']").each(function (index, element) {
            alert(element);
            //            if ($(element).val() === "checked") {
            //                $(element).parent(".question_set").replaceWith("<div class='page'>分页</div>");
            //            }
            //            else {
            //                $(element).parent(".question_set").remove();
            //            }
        });

        question_html += "<ul style='list-style-type: none'>";
        question_html += $(tmpl).html();
        question_html += "</ul>";

        return question_html;
    }
});
