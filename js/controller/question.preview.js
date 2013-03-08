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
        //this.proxyAll("renderQuestions");
        surveyInstance.bind("questionChange", this.proxy(this.renderQuestions));
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

    initRadioPreview: function (options, questionTag) {
        var questionOptions = "";
        $(options).each(function (index, element) {
            questionOptions += '<input type="radio" name=' + questionTag + '/> ' + element.index + '.' + element.content
        });
        $(".option-list:last").append(questionOptions);
    },

    renderQuestions: function (e) {
        $(this.surveyPreviewList).empty();
        var that = this;
        var previewContent = this.surveyPreviewList;
        $(e.questions).each(function (index, element) {
            $(previewContent).append($($("#question-priview-template").html()).tmpl({ "questionIndex": index + 1, "questionDescription": element.description }));
            switch (element.type) {
                case "single-select":
                    that.initRadioPreview(element.options, index + 1);
                    break;
            };
        });
    }
});