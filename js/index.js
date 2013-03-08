$(function () {
    var GloablApp = Spine.Controller.sub({
        el: $("body"),
        init: function () {
            //tab initial
            $("#tabs").tabs({ disabled: [1, 2, 3] });

            this.baseinfo = new BaseInfo({ el: $("#add-base-info") });
            this.surveycreate = new SurveyCreate({ el: $("#build-survey-questions") });
            this.questionPreview = new QuestionPreview({ el: $("#survey-preview") });

            window.surveyInstance = new Survey({ questions: [] });
            surveyInstance.bind("questionChange", this.questionPreview.renderQuestions);
        }
    });

    window.App = new GloablApp();

});
