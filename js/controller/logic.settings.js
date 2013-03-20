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
            map: {},
            action: {
                type : "",
                queN : "",
                optN : ""
            }
        };
    },
    _initOptionList: function (e) {
        var index =$(e.target).val();
        console.log(surveyInstance.questions[index].type);
        switch(surveyInstance.questions[index].type) {
            case "single-select" :
            case "multi-select" :
                //TODO: refactor here
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
            //TODO: refactor here
            var optionStr = "<option value=" + index + ">" + index + element.description + "</option>";
            $("#questionList").append(optionStr);
            $("#action_question").append(optionStr);
        });
    },
    renderLogicList: function () {
        //TODO: refactor here
        $("#logicList").empty();
        $(surveyInstance.logicList).each(function(index, element) {
            if( index % 2 === 0){
                $("#logicList").append("<li>" + element.logicName + "<a href='#' class='delete'></a></li>");
            } else {
                $("#logicList").append("<li class='color'>" + element.logicName + "<a href='#' class='delete'></a></li>");
            }
        });
    },
    addCondition: function () {
        if(!this.logic.map[ $("#questionList").val()]){
            this.logic.map[ $("#questionList").val()] = [];
        }
        this.logic.map[$("#questionList").val()].push(($("#condition_type").val() === "0" ? "-" : "") + parseInt($("#condition_questionOption").val()));
        //TODO: need confirm here
        $("#conditions").val(JSON.stringify(this.logic.map));
    },
    addLogic: function () {
        this.logic.logicName = $("#logic_name").val();
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
