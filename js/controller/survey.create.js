// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
    template: function () {
        return $("#survey-create-template").html();
    },
    //events: {"":""},
    show: function () {
        this.el.html(this.template());
    },
    addQuestion: function () {
        $("#question-tool-bar div").each(function (index, element) {
            $(element).draggable({ opacity: 0.7, helper: "clone", cursor: "move" });
        });

        //add question
        $("#question-template").droppable({
            drop: function (e, ui) {
                $("#question-template").empty();
                var drag = ui.draggable.attr("id");
                switch (drag) {
                    case "single-select":
                        //TODO:create single select question
                        break;
                    case "multi-select":
                        //TODO:create multi select question
                        break;
                    case "matrix":
                        //TODO:create matrix question
                        break;
                    case "open":
                        //TODO:create open question
                        break;
                    case "area":
                        //TODO:create region question
                        break;
                }
            }
        });
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        Spine.trigger("show_control_bar", this.el);
        //add question by drag
        this.addQuestion();
    },
    _sortQuestion: function () {
    }
});