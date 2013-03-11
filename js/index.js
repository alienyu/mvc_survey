$(function () {
    var GloablApp = Spine.Controller.sub({
        el: $("body"),
        init: function () {
            //tab initial
            $("#tabs").tabs({ disabled: [1, 2, 3] });
            this.initAreaDelegate();

            window.surveyInstance = new Survey({ questions: [] });

            this.baseinfo = new BaseInfo({ el: $("#add-base-info") });
            this.surveycreate = new SurveyCreate({ el: $("#build-survey-questions") });
            this.questionPreview = new QuestionPreview({ el: $("#survey-preview") });
        },
        initAreaDelegate: function(){
            $("div").delegate("input[type=checkbox]", "click", function(e){
                if(e.target.checked) {
                    $("#" + e.target.id).next().attr("disabled", false);
                } else {
                    $("#" + e.target.id).next().attr("checked", false);
                    $("#" + e.target.id).next().attr("disabled", true);
                    $("#" + e.target.id).next().next().attr("checked", false);
                    $("#" + e.target.id).next().next().attr("disabled", true);
                }
            });
        }
    });

    Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    window.App = new GloablApp();
});
