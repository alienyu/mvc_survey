// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
    template: function () {
        return $("#survey-create-template").tmpl();
    },

    elements: {
        "#creator-area": "creatorArea"
    },

    events: {
        "click #add-option-tag": "addOption",
        "click .remove-option-tag": "removeOption",
        "click #question-save": "saveQuestion",
        "change #areaType input[type='checkbox']": "areaLinkage"
    },

    show: function () {
        this.el.html(this.template());
    },

    initQuestionCreator: function () {
        $(this.creatorArea).empty().height("auto");
        this.questionTextCreator();
        var creatorTemplate;
        switch (this.question.type) {
            case "single-select":
                creatorTemplate = this.initRadioCreator();
                break;
            case "multi-select":
                creatorTemplate = this.initCheckCreator();
                break;
            case "matrix":
                //TODO:create matrix question
                break;
            case "open":
                creatorTemplate = this.initOpenCreator();
                break;
            case "area":
                creatorTemplate = this.initAreaCreator();
                break;
            default:
                //TODO:others
                break;
        }
        $(this.creatorArea).append(creatorTemplate);
    },

    initRadioCreator: function () {
        var optionCreatorTemp;
        if (this.question.options != null) {
            $(this.question.options).each(function (index, element) {
                if (index === 0) {
                    optionCreatorTemp = $("#radio-option-creator-template").tmpl({ "optionTag": "A", "optionValue": element.content });
                }
                else {
                    $(optionCreatorTemp).find("#option-creators")
                    .append($("#radio-option-creator-template").tmpl({ "optionTag": element.index, "optionValue": element.content }).find("#option-creators .option-creator"));
                }
            });
        }
        else {
            optionCreatorTemp = $("#radio-option-creator-template").tmpl({ "optionTag": "A" });
        }
        return optionCreatorTemp;
    },

    initCheckCreator: function () {
        var optionCreatorTemp = $("#check-option-creator-template").tmpl().before(this.initRadioCreator());
        return optionCreatorTemp;
    },

    initOpenCreator: function () {
        var optionCreatorTemp = $("#open-option-creator-template").tmpl();
        return optionCreatorTemp;
    },

    initAreaCreator: function () {
        var optionCreatorTemp = $("#area-option-creator-template").tmpl();
        return optionCreatorTemp;
    },

    areaLinkage: function (e) {
        if (e.target.checked) {
            $("#" + e.target.id).next().attr("disabled", false);
        } else {
            $("#" + e.target.id).next().attr("checked", false);
            $("#" + e.target.id).next().attr("disabled", true);
            $("#" + e.target.id).next().next().attr("checked", false);
            $("#" + e.target.id).next().next().attr("disabled", true);
        }
    },

    questionTextCreator: function () {
        var questionTextCreator = $("#question-text-creator-template").tmpl();
        $(this.creatorArea).append(questionTextCreator);
        $("#question-text").wysiwyg();
        $('#question-textIFrame').contents().find('body').html(this.question.description);
    },

    bindDraggable: function () {
        var that = this;
        $("#question-tool-bar div").each(function (index, element) {
            $(element).draggable({ opacity: 0.7, helper: "clone", cursor: "move" });
        });

        //add question
        $(this.creatorArea).droppable({
            drop: function (e, ui) {
                that.question = new Question({ "type": ui.draggable.attr("id") });
                that.initQuestionCreator();
            }
        });
    },

    init: function () {
        //show template
        this.show();
        //inital the question creator draggable
        this.bindDraggable();

        Spine.bind("clickEdit", this.proxy(this.editQuestion));
    },

    addOption: function () {
        var indexTag = String.fromCharCode(65 + $("#option-creators .option-creator").size());
        var optionCreatorTemp = $("#radio-option-creator-template").tmpl({ "optionTag": indexTag }).find("#option-creators .option-creator");
        $("#option-creators").append(optionCreatorTemp);
    },

    removeOption: function (e) {
        e.target.parentElement.remove();
        var optionCreators = $('#option-creators .option-creator');
        optionCreators.each(function (item, element) {
            $(element).find("span").html((String.fromCharCode(65 + item)));
        });
    },

    editQuestion: function (e) {
        surveyInstance.activeQustIndex = e;
        this.question = surveyInstance.questions[surveyInstance.activeQustIndex];
        this.initQuestionCreator();
    },

    saveQuestion: function () {
        if (this.question) {
            this.question.description = $('#question-textIFrame').contents().find('body').html();
            this.question.necessary = $('input[type=checkbox]').filter('#necessary')[0].checked;
            var options = [];
            switch (this.question.type) {
                case "single-select":
                    this.getOptions(options);
                    break;
                case "multi-select":
                    this.getOptions(options);
                    this.question.maxSelection = $('#max-select-num').find("option:selected").text();
                    this.question.minSelection = $('#min-select-num').find("option:selected").text();
                    break;
                case "open":
                    this.question.valid_type = $('input[type=checkbox]').filter('#valid')[0].checked ? $('#validation').find("option:selected").text() : '';
                    this.question.input_type = $('#input-type').find("option:selected").text();
                    break;
                case "area":
                    this.question.area = this.getArea();
            }
            surveyInstance.updateQuestion(this.question);
            $(this.creatorArea).empty().height(200);
            this.question = null;
            surveyInstance.questionIndex = null;
            $('#tabs').tabs('option', 'active', 4);
        } else {
            alert("No question has been created!");
        }
    },

    getOptions: function (options) {
        $('.option-creator').each(function () {
            optionIndex = $(this).find('span').html();
            optionType = $(this).find("option:selected").text();
            optionContent = $(this).find("input").val();
            option = new Option({ index: optionIndex, type: optionType, content: optionContent });
            options.push(option);
        });
        this.question.options = options;
        this.question.arrangement = $('#arrangement').find("option:selected").text();

    },

    getArea: function () {
        var area;
        var array = $('#areaType').children().filter('input');
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i].checked) {
                area = array[i].id;
                break;
            }
        }
        return area;
    }
})
