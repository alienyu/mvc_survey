// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
    template: function () {
        return $("#survey-preview-template").html();
    },
    elements: {
        "#survey-preview-list": "surveyPreviewList"
    },
    events: {
        "click .remove-question": "removeQuestion",
        "click .edit-question": "editQuestion",
        "click #submit-survey": "submitSurvey"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        this.sortableList();
        //init widgets
        surveyInstance.bind("questionChange", this.proxy(this.renderQuestions));
    },
    sortableList: function () {
        $(this.surveyPreviewList).sortable({
            items: "li",
            activate: function (event, ui) {
                this.oldindex = ui.item.index();
            },
            deactivate: function (event, ui) {
                if (this.oldindex != ui.item.index()) {
                    ui.item.parent().find("li").each(function (index, element) {
                        $(element).find("span").html(index + 1);
                    });
                    surveyInstance.sortQuestion(this.oldindex, ui.item.index());
                }
            }
        });
        $(this.surveyPreviewList).disableSelection();
    },

    initRadioPreview: function (options, questionTag) {
        var optionsValue = [];
        var questionOptions = "";
        $(options).each(function (index, element) {
            if (element.type === "选项") {
                var radioValue = {};
                radioValue.name = questionTag;
                radioValue.index = element.index;
                radioValue.content = element.content;
                $("#radio-option-template").tmpl(radioValue).appendTo(".option-list:last");
            }
            else {
                $("#open-option-template").tmpl({ "index": element.index }).appendTo(".option-list:last");
            }
        });

    },

    initMultiPreview: function (options, questionTag) {
        var optionsValue = [];
        var questionOptions = '';
        $(options).each(function (index, element) {
            if (element.type === "选项") {
                var multiValue = {};
                multiValue.name = questionTag;
                multiValue.index = element.index;
                multiValue.content = element.content;
                $("#multi-option-template").tmpl(multiValue).appendTo(".option-list:last");
            }
            else {
                $("#open-option-template").tmpl({ "index": element.index }).appendTo(".option-list:last");
            }
        });

        //TODO:max and min restrict
    },

    initMatrixPreview: function () {
        //TODO:for matrix
    },

    initOpenPreview: function (element) {
        var editArea = element.input_type === "文本域" ? '<textarea></textarea>' : '<input type="text" />';
        $(".option-list:last").append(editArea);
    },
    renderQuestions: function (e) {
        $(this.surveyPreviewList).empty();
        var that = this;
        var previewContent = this.surveyPreviewList;
        $(e.questions).each(function (index, element) {
            $("#question-preview-template").tmpl({ "questionIndex": index + 1, "questionDescription": element.description }).appendTo($(previewContent));
            switch (element.type) {
                case "single-select":
                    that.initRadioPreview(element.options, index + 1);
                    break;
                case "multi-select":
                    that.initMultiPreview(element.options, index + 1);
                    break;
                case "matrix":
                    that.initMatrixPreview();
                    break;
                case "open":
                    that.initOpenPreview(element);
                    break;
            }
        });
    },

    removeQuestion: function (e) {
        var index = $(e.target).parents("li").index();
        surveyInstance.deleteQuestion(index);
    },

    editQuestion: function (e) {
        var index = $(e.target).parents("li").index();
        $('#tabs').tabs('option', 'active', 1);
        Spine.trigger("clickEdit", index);
    },

    submitSurvey: function () {
        surveyInstance.submitSurvey();
    }
});
