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
            surveyModel.ID = ""; //���
            surveyModel.question_no = $("#question-no").val(); //�ʾ���
            surveyModel.question_name = $("#question-name").val(); //�ʾ���
            surveyModel.client_id = $("#client-id").val(); //�ͻ����
            surveyModel.public_pic = $("#upload-public-pic").val(); //�ʾ�����ͼ
            surveyModel.end_date = $("#end-time").val(); //����ʱ��
            surveyModel.face_page = $("#upload-face-page").val(); //����
            surveyModel.logo = $("#upload-logo").val(); //logo
            surveyModel.bottom_page = $("#upload-bottom-age").val(); //���
            surveyModel.template_id = $("#template-id").val(); //�ʾ�ģ��
            surveyModel.join_point = parseInt($("#join-point").val()); //�����ʾ�������
            surveyModel.complate_point = parseInt($("#complate-point").val()); //����ʾ�������
            surveyModel.examination_type = $("#examination-type").val(); //"�ʾ�����",[0Ȥζ1����2����]
            surveyModel.examination_detail = $("#examination-detail").val(); //�ʾ�˵��
            surveyModel.quota = 0; //���
            surveyModel.ques_count = this.questions.length; //��������
            surveyModel.company = ""; //������˾
            surveyModel.remark = $("#remark").val(); //��ע
            surveyModel.status = ""; //״̬
            surveyModel.question_html = this._getQuestionHtml(); //����HTML
            surveyModel.logic_control_js = ""; //�߼�js
            surveyModel.quota_control_js = ""; //���js
            surveyModel.topic_list = null;
            surveyModel.result_id = ""; //����ID
            surveyModel.email = ""; //������email
        }
    },

    _getQuestionHtml: function () {
        var question_html = "";
        var tmpl = $("#survey-preview-list").tmpl();

        $(tmpl).find("input[class='add-break']").each(function (index, element) {
            alert(element);
            //            if ($(element).val() === "checked") {
            //                $(element).parent(".question_set").replaceWith("<div class='page'>��ҳ</div>");
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
