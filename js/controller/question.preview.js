// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
    template: function () {
        return $("#survey-preview-template").html();
    },
    elements: {
        "#survey-preview-list": "surveyPreviewList"
    },
    show: function () {
        //this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        this.sortableList();
        this.showQuestions();
        //init widgets
    },
    sortableList: function () {
        $(this.surveyPreviewList).sortable({
            containment: "parent",
            items: "li",
            deactivate: function (event, ui) {
                ui.item.parent().find("li").each(function (index, element) {
                    $(element).find(".view-question-content").children("span").html(index + 1);
                });
            }
        });
        $(this.surveyPreviewList).disableSelection();
    },

    showQuestions: function() {
        var that = this;
        $(Question.all()).each(function(index,element){
            //set arguments for each type
            var preview = {
            type: this.type,
            description: this.description,
            necessary: this.necessary,
            arrangement: this.arrangement,
            options: this.options
            };
            var previewTemplate;
            switch(preview.type) {
                case "single-select":
                    previewTemplate = that.initRadioPreview(preview,index+1);
            };
            $(that.surveyPreviewList).append('<li>' + previewTemplate.html().trim() + '</li>');

        });
    },

    initRadioPreview: function(preview, index) {
        var question = $($("#survey-preview-template").html()).tmpl({"questionIndex": index, "questionDescription": preview.description});
        var questionOptions = '';
        $(preview.options).each(function() {
            questionOptions += '<input type="radio" name=' + index+ '/> '+ this.index + '.' + this.content
        });
        question.find('.option-list').append(questionOptions);
        return question
    }
});