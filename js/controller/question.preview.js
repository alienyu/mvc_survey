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
        "click .edit-question": "editQuestion"
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

    initRadioCheckPreview: function (question, questionTag) {
        var optionsValue = [];
        var questionOptions = "";
        $(question.options).each(function (index, element) {
            var radioValue = {};
            radioValue.name = questionTag + 1;
            radioValue.index = element.index;
            radioValue.content = element.content;
            var typeValue = parseInt(element.type);
            radioValue.type = [question.type == "single-select" ? "radio" : "checkbox", "textarea"][typeValue];
            $("#radio-option-template").tmpl(radioValue).appendTo(".option-list:last");
        });

    },

    initMatrixPreview: function () {
        //TODO:for matrix
    },

    initOpenPreview: function () {

        var editArea = '<textarea></textarea>';
        $(".option-list:last").append(editArea);
    },
    renderQuestions: function (e) {
        $(this.surveyPreviewList).empty();
        var that = this;
        var previewContent = this.surveyPreviewList;
        $(e.questions).each(function (index, element) {
            $("#question-priview-template").tmpl({ "questionIndex": index + 1, "questionDescription": element.description }).appendTo($(previewContent));
            switch (element.type) {
                case "single-select": case "multi-select":
                    that.initRadioCheckPreview(element, index);
                    break;
                case "matrix":
                    that.initMatrixPreview();
                    break;
                case "open":
                    that.initOpenPreview(index + 1);
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
    }
});
