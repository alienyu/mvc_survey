$(function () {
    var GloablApp = Spine.Controller.sub({
        el: $("body"),
        init: function () {
            //tab initial
            $("#tabs").tabs({ disabled: [1, 2, 3] });

            Spine.bind('show_control_bar', this.showControlBar);

            this.baseinfo = new BaseInfo({ el: $("#add-base-info") });
            this.surveycreate = new SurveyCreate({ el: $("#build-survey-questions") });

        },
        showControlBar: function (obj) {
            alert($(obj).index());
        }
    });

    window.App = new GloablApp();

});
