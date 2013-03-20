var LogicSettings = Spine.Controller.sub({
    template: function () {
        return $("#logic-settings-template").tmpl();
    },
    events: {
        "click .delete": "logicDelete",
        "click #init_editor": "initEditor",
        "change #questionList": "_initOptionList",
        "click #addCondition": "addCondition",
        "click #save_logic": "addLogic"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        this._initLogicObj();
        this.renderLogicList();
    },
    initEditor: function () {
        $("#logic-settings-container").html($("#logic-settings-edit-template").tmpl());
        this._initQuestionList();
    },
    _initLogicObj: function () {
        this.logic = {
            logicName: "",
            logicType: "",
            map: [],
            action: {
                type : "",
                queN : "",
                optN : ""
            }
        };
    },
    _initOptionList: function (e) {
        //TODO: refactor here
        var index =$(e.target).val();
        console.log(surveyInstance.questions[index].type);
        switch(surveyInstance.questions[index].type) {
            case "single-select" :
            case "multi-select" :
                $("#condition_questionOption").empty().append("<option>全部</option>");
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
    },
    _initQuestionList: function () {
        $(surveyInstance.questions).each(function (index, element) {
            var optionStr = "<option value=" + index + ">" + index + element.description + "</option>";
            $("#questionList").append(optionStr);
            $("#action_question").append(optionStr);
        });
    },
    renderLogicList: function () {
//        $("#logicList").empty();
//        $(surveyInstance.logicList).each(function(index, element) {
//
//        });
    },
    addCondition: function () {
        this.logic.map.push({
            questionIndex : $("#questionList").val(),
            questionOption : [($("#condition_type").val() === "0" ? "-" : "") + parseInt($("#condition_questionOption").val())]
        });
        $("#conditions").val(JSON.stringify(this.condition.map));
    },
    addLogic: function () {
        this.logic.action.type = $("#actionType").val();
        this.logic.action.queN = $("#action_question").val();
        this.logic.action.optN = "";
        //console.log(this.condition);
        surveyInstance.logicList.push(this.logic);
        this._initLogicObj();
        this.renderLogicList();
        $("#logic-settings-container").empty();
    },
    logicDelete: function (e) {
        var index = $(e.target).parents("li").index();
        console.log(index);
    }
});
