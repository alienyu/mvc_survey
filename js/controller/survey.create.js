// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
    template: function () {
        return $("#survey-create-template").html();
    },

    elements: {
        "#creator-area": "creatorArea"
    },

    events: {
        "click #add-option-tag": "addOption",
        "click .remove-option-tag": "removeOption",
        "click #question-save": "saveQuestion"
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
        var optionCreatorTemp = $($("#radio-option-creator-template").html()).tmpl({ "optionTag": "A" });
        return optionCreatorTemp;
    },

    initCheckCreator: function () {
        var optionCreatorTemp = $($("#check-option-creator-template").html()).before($($("#radio-option-creator-template").html()).tmpl({ "optionTag": "A" }));
        return optionCreatorTemp;
    },

    initOpenCreator: function () {
        var optionCreatorTemp = $("#open-option-creator-template").html();
        return optionCreatorTemp;
    },

    initAreaCreator: function () {
        var optionCreatorTemp = $("#area-option-creator-template").html();
        return optionCreatorTemp;
    },

    questionTextCreator: function () {
        var questionTextCreator = $("#question-text-creator-template").html();
        $(this.creatorArea).append(questionTextCreator);
        $("#question-text").wysiwyg();
    },

    bindDraggable: function () {
        var that = this;
        $("#question-tool-bar div").each(function (index, element) {
            $(element).draggable({ opacity: 0.7, helper: "clone", cursor: "move" });
        });

        //add question
        $(this.creatorArea).droppable({
            drop: function (e, ui) {
                var drag = ui.draggable.attr("id");
                that.question = new Question();
                that.question.type = drag;
                that.initQuestionCreator();
            }
        });
    },

    init: function () {
        //show template
        this.show();
        //inital the question creator draggable
        this.bindDraggable();
    },

    addOption: function () {
        var indexTag = String.fromCharCode(65 + $("#option-creators .option-creator").size());
        var optionCreatorTemp = $($("#radio-option-creator-template").html())
                                .find("#option-creators").tmpl({ "optionTag": indexTag });
        $("#option-creators").append(optionCreatorTemp);
    },

    removeOption: function (e) {
        e.target.parentElement.remove();
        var optionCreators = $('#option-creators .option-creator');
        optionCreators.each(function (item, element) {
            $(element).find("span").html((String.fromCharCode(65 + item)));
        });
    },

    saveQuestion: function() {
        $('#survey-preview-list').empty();
        this.question.description  =$('#question-textIFrame').contents().find('body').html();
        this.question.necessary = $('input[type=checkbox]').filter('#necessary')[0].checked;
        var options = [];
        $('.option-creator').each(function(){
            optionIndex = $(this).find('span').html();
            optionType = $(this).find("option:selected").text();
            optionContent = $(this).find("input").val();
            option = new Option({index:optionIndex, type:optionType, content:optionContent});
            options.push(option);
        });
        this.question.options = options;
        this.question.arrangement = $('#arrangement').find("option:selected").text();
        //TODO:change logic
        this.question.save();
        new QuestionPreview({ el: $("#survey-preview") });
    }
});
