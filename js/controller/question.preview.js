// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
    template: function () {
        return $("#survey-preview-template").html();
    },
    elements: {
        "#survey-preview-list": "surveyPreviewList"
    },
    show: function () {
        this.el.html(this.template());
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

    showQuestions: function(){
      this.questions = Question.all();
        console.log(this.questions);
    }
});