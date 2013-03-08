// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
    template: function () {
        return $("#survey-preview-template").html();
    },
    elements: {
        "#survey-preview-list": "surveyPreviewList"
    },
    proxied: ["renderQuestions"],
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        this.sortableList();
        //init widgets
        this.proxyAll("renderQuestions");
    },
    sortableList: function () {
        $(this.surveyPreviewList).sortable({
            containment: "parent",
            items: "li",
            deactivate: function (event, ui) {
                ui.item.parent().find("li").each(function (index, element) {
                    //$(element).find(".view-question-content").children("span").html(index + 1);
                });
            }
        });
        $(this.surveyPreviewList).disableSelection();
    },

    initRadioPreview: function (preview, index) {
        var question = $($("#question-priview-template").html()).tmpl({ "questionIndex": index, "questionDescription": preview.description });
        var questionOptions = '';
        $(preview.options).each(function () {
            questionOptions += '<input type="radio" name=' + index + '/> ' + this.index + '.' + this.content
        });
        question.find('.option-list').append(questionOptions);
        return question
    },

    renderQuestions: function (e) {
        $(this.surveyPreviewList).empty();

        var that = this;
        var previewContent = this.surveyPreviewList;
        $(e.questions).each(function (index, element) {
            $(previewContent).append($($("#question-priview-template").html()).tmpl({ "questionIndex": index + 1, "questionDescription": element.description }));
            switch (element.type) {
                case "single-select":
                    //previewTemplate = that.initRadioPreview(preview, index + 1);
            };
            //$(that.surveyPreviewList).append('<li>' + previewTemplate.html().trim() + '</li>');
        });
        $(this.surveyPreviewList).append(previewContent);
    }
});