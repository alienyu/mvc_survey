// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
    template: function () {
        return $("#survey-create-template").html();
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        Spine.trigger("show_control_bar", this.el);
    }
});