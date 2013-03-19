var LogicSettings = Spine.Controller.sub({
    template: function () {
        return $("#logic-settings-template").tmpl();
    },
    events: {
        "click .delete": "logicDelete",
        "click #init_editor": "initEditor",
        "click #addCondition": "addCondition",
        "click #save_logic": "addLogic",
        "change #questionList": "_initOptionList"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        this.condition = {
            map: [],
            action: {
                type : "",
                queN : "",
                optN : ""}
        };
    },
    logicDelete: function (e) {
        var index = $(e.target).parents("li").index();
        console.log(index);
    },
    initEditor: function () {
        $("#logic-settings-container").html($("#logic-settings-edit-template").tmpl());
        this._initQuestionList();
    },
    addCondition: function () {
        this.condition.map.push({
            questionIndex : $("#questionList").val(),
            questionOption : [($("#condition_type").val() === "0" ? "-" : "") + parseInt($("#condition_questionOption").val())]
        });
        $("#conditions").val(JSON.stringify(this.condition.map));
    },
    addLogic: function () {
        var logicModel = {
        };
        console.log("addLogic");
    },
    _initQuestionList: function () {
        $(surveyInstance.questions).each(function (index, element) {
            var optionStr = "<option value=" + index + ">" + index + element.description + "</option>";
            $("#questionList").append(optionStr);
            $("#action_question").append(optionStr);
        });
    },
    _initOptionList: function (e) {
        var index =$(e.target).val();
        console.log(surveyInstance.questions[index].type);
        switch(surveyInstance.questions[index].type) {
            case "single-select" :
            case "multi-select" :
                $("#condition_questionOption").empty().append("<option value='-1'>全部</option>");
                $(surveyInstance.questions[index].options).each(function (index, element){
                    $("#condition_questionOption").append("<option value=" + index + ">" + element.index + element.content + "</option>");
                });
                break;
            case  "open":
                $("#condition_questionOption")._hide();
                break;
            case  "area":
                $("#condition_questionOption")._hide();
                $("#condition_type")._hide();
                break;
        }
    }
});
