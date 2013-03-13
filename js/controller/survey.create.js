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
        "change .type-select": "changeSelectionView",
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
                    optionCreatorTemp = $("#radio-option-creator-template").tmpl(element.type === "0" ? { "optionTag": "A", "type": "0", "optionValue": element.content } : { "optionTag": "A", "type": "1", "optionValue": element.content, "optionUnit": element.unit, "optionValid": element.is_valid ? "checked":'', "select":"selected" });
                }
                else {
                    $(optionCreatorTemp).find("#option-creators")
                    .append($("#radio-option-creator-template").tmpl(element.type === "0" ? { "optionTag": element.index, "type": "0", "optionValue": element.content } : { "optionTag": element.index, "type": "1", "optionValue": element.content, "optionUnit": element.unit, "optionValid": element.is_valid ? "checked":'', "select":"selected" }).find("#option-creators .option-creator"));
                }
            });
        }
        else {
            optionCreatorTemp = $("#radio-option-creator-template").tmpl({ "optionTag": "A", "type": "0" });
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
        var optionCreatorTemp = $("#area-option-creator-template").tmpl({"areaType": this.question.area});
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
        $("#question-tool-bar img").each(function (index, element) {
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
        $("#add-option-tag").parent().before(this.optionCreatorTemplate(indexTag));
    },

    optionCreatorTemplate: function (indexTag, type) {
        type = typeof type !== 'undefined' ? type : "0";
        return $("#radio-option-creator-template").tmpl({ "optionTag": indexTag, "type": type }).find(".option-creator");
    },

    removeOption: function (e) {
        $(e.target).parents(".option-creator").remove();
        var optionCreators = $('#option-creators .option-creator');
        optionCreators.each(function (item, element) {
            $(element).find(".option-tag").html((String.fromCharCode(65 + item)));
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
            surveyInstance.activeQustIndex = null;
        } else {
            alert("No question has been created!");
        }
    },

    getOptions: function (options) {
        $('.option-creator').each(function () {
            optionIndex = $(this).find('.option-tag').text();
            optionType = $(this).find("option:selected").val();
            optionContent = $(this).find('.option-content').val();
            optionUnit = $(this).find('.option-unit').val() || '';
            optionValid = $(this).find('.option-valid')[0] ? $(this).find('.option-valid')[0].checked : '';
            option = new Option({ index: optionIndex, type: optionType, content: optionContent, unit: optionUnit, is_valid: optionValid });
            options.push(option);
        });
        this.question.options = options;
        this.question.arrangement = $('#arrangement').find("option:selected").text();
    },

    getArea: function () {
        //return the last checked checkbox id
        if($("#areaType").find("input:checked").toArray().pop()){
            return $("#areaType").find("input:checked").toArray().pop().id;
        }
    },

    changeSelectionView: function (e) {
        var changeTempalete = $(e.target).parent();
        var indexTag = changeTempalete.find("span").first().text();
        var optionType = $(e.target).val();
        var template = this.optionCreatorTemplate(indexTag, optionType);
        changeTempalete.html(template.html());
        changeTempalete.find('.option-unit').val('');
        changeTempalete.find(".type-select").val(optionType);
        //TODO: need to be refactor


    }
});
