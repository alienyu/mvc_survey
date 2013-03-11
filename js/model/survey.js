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
            var surveyModel = {
                ID: "", //���
                question_no: $("#question-no").val(), //�ʾ���
                question_name: $("#question-name").val(), //�ʾ���
                client_id: $("#client-id").val(), //�ͻ����
                public_pic: $("#upload-public-pic").val(), //�ʾ�����ͼ
                end_date: $("#end-time").val(), //����ʱ��
                face_page: $("#upload-face-page").val(), //����
                logo: $("#upload-logo").val(), //logo
                bottom_page: $("#upload-bottom-age").val(), //���
                template_id: $("#template-id").val(), //�ʾ�ģ��
                join_point: parseInt($("#join-point").val()), //�����ʾ�������
                complate_point: parseInt($("#complate-point").val()), //����ʾ�������
                examination_type: $("#examination-type").val(), //"�ʾ�����",[0Ȥζ1����2����]
                examination_detail: $("#examination-detail").val(), //�ʾ�˵��
                quota: 0, //���
                ques_count: this.questions.length, //��������
                company: "", //������˾
                remark: $("#remark").val(), //��ע
                status: "", //״̬
                question_html: this._getQuestionHtml(), //����HTML
                logic_control_js: "", //�߼�js
                quota_control_js: "", //���js
                topic_list: this._getTopicList(),
                result_id: "", //����ID
                email: "" //������email
            };

//            $.ajax({
//                url: "http://172.16.134.57:30403/surveyPlatform/examination/saveExam",
//                type: "POST",
//                contentType: "application/json",
//                headers: { accept: "application/json" },
//                data: JSON.stringify(surveyModel),
//                success: function (response, option) {
//                    //alert(response);
//                },
//                complete: function (response, option) {
//                    //alert(response.responseText);
//                }
//            });
        }
    },

    _getQuestionHtml: function () {
        var question_html = "";

        $("#survey-preview-list").find("input[class='add-break']").each(function (index, element) {
            //            if ($(element).val() === "checked") {
            //                $(element).parent(".question_set").replaceWith("<div class='page'>��ҳ</div>");
            //            }
            //            else {
            //                $(element).parent(".question_set").remove();
            //            }
        });

        question_html += "<ul style='list-style-type: none'>";
        question_html += $("#survey-preview-list").html();
        question_html += "</ul>";

        return question_html;
    },

    _getTopicList: function () {
        var topic_list = [];
        $(this.questions).each(function (index, element) {
            var topic = {
                question_no: index + 1, //������
                question_context: element.description, //��������
                question_type: "", //"��������",[0��ѡ1��ѡ2����3����4����]
                allow_bland: "N", //"�Ƿ����ش��ʶ",[Y/N]
                max_num: 0, //����ѡ����
                min_num: 0, //���ٿ�ѡ����
                area_type: "", //"��������",[0ʡ1��2��]
                options: null
            };

            var question_type = "";
            switch (element.type) {
                case "single-select":
                    question_type = "0";
                    break;
                case "multi-select":
                    question_type = "1";
                    break;
                case "matrix":
                    //TODO:create matrix question
                    break;
                case "open":
                    question_type = "3";
                    break;
                case "area":
                    question_type = "4";
                default:
                    //TODO:others
                    break;
            }
            topic.question_type = question_type;

            var ops = [];
            $(element.options).each(function (i, e) {
                var op = {
                    item_num: e.index, //ѡ����
                    item_type: e.type, //"ѡ������",[0ѡ��1����]
                    item_value: e.content, //ѡ��ֵ
                    item_pic: "", //ѡ��ͼƬ
                    unit: "", //��λ
                    validate_flag: "", //�Ƿ���֤
                    validate_type: "" //��֤����
                };
                ops.push(op);
            });
            topic.options = ops;
            topic_list.push(topic);
        });
        return topic_list;
    }
});
