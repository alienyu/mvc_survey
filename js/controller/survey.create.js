// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
    template: function () {
        return $("#survey-create-template").tmpl({"surveyName":$('#question-name').val()});
    },

    elements: {
        "#creator-area": "creatorArea"
    },

    events: {
        "click #add-option-tag": "addOption",
        "click #matrix_addSideOpt": "addSideOpt",
        "click #matrix_addHeadOpt": "addHeadOpt",
        "click .remove-option-tag": "removeOption",
        "click #question-save": "saveQuestion",
        "change .type-select": "changeSelectionView",
        "change #areaType input[type='checkbox']": "areaLinkage",
        "change .upload": "uploadImg",
        "change input[name='matrix_type']": "matrixTypeChange"
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
                creatorTemplate = this.initMatrixCreator();
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

        //TODO: refactor here
        if(this.question.matrixType != null) {
             $("#type").children()[this.question.matrixType].checked = true;
            if(this.question.matrixType == 0) {
                $("#matrix_max_min_optionNum").hide();
            }
        }
        if(this.question.xOptions != null) {
            $(this.question.xOptions).each(function (index, element) {
                $("#matrix_HeadOpt").append($("#matrix-option-template").tmpl({"optionIndex": String.fromCharCode(index + 65), "value": "value =" + element.text , "necessary": element.necessary ? "checked" : "" }));
            });
        }
        if(this.question.yOptions != null) {
            $(this.question.yOptions).each(function (index, element) {
                $("#matrix_SideOpt").append($("#matrix-option-template").tmpl({"optionIndex": String.fromCharCode(index + 65), "value": "value =" + element.text , "necessary": element.necessary ? "checked" : "" }));
            });
        }
    },

    initRadioCreator: function () {
        var optionCreatorTemp;
        if (this.question.options != null) {
            var arrangement = this.question.arrangement;
            $(this.question.options).each(function (index, element) {
                if (index === 0) {
                    optionCreatorTemp = $("#radio-option-creator-template").tmpl(element.type === "0" ? { "optionTag": "A", "type": "0", "optionValue": element.content, "show": arrangement === "1" ? "selected" : ''} : { "optionTag": "A", "type": "1", "optionValue": element.content, "optionUnit": element.unit, "optionValid": element.is_valid ? "checked" : '', "select": "selected", "show": arrangement === "1" ? "selected" : '' });
                }
                else {
                    $(optionCreatorTemp).find("#add-option-tag")
                    .parent().before($("#radio-option-creator-template").tmpl(element.type === "0" ? { "optionTag": element.index, "type": "0", "optionValue": element.content, "show": arrangement === "1" ? "selected" : ''} : { "optionTag": element.index, "type": "1", "optionValue": element.content, "optionUnit": element.unit, "optionValid": element.is_valid ? "checked" : '', "select": "selected", "show": arrangement === "1" ? "selected" : '' }).find(".option-creator"));
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

    initMatrixCreator: function () {
        var matrixCreatorTemp = $("#matrix-option-creator-template").tmpl();
        return matrixCreatorTemp;
    },

    initOpenCreator: function () {
        var optionCreatorTemp = $("#open-option-creator-template").tmpl(this.question.input_type === "1" ? { "select": "selected"} : { "": "" });
        return optionCreatorTemp;
    },

    initAreaCreator: function () {
        var optionCreatorTemp = $("#area-option-creator-template").tmpl({ "areaType": this.question.area });
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
        this.changeOptionsNum();
    },

    addSideOpt: function () {
        var sideOption = $("#matrix-option-template").tmpl({"optionIndex": String.fromCharCode($("#matrix_SideOpt").children().size() + 65)});
        $("#matrix_SideOpt").append(sideOption);
    },

    addHeadOpt: function () {
        var sideOption = $("#matrix-option-template").tmpl({"optionIndex": String.fromCharCode($("#matrix_HeadOpt").children().size() + 65)});
        $("#matrix_HeadOpt").append(sideOption);
    },

    matrixTypeChange: function (e) {
        if(e.target.nextElementSibling){
            $("#matrix_max_min_optionNum").hide();
        } else {
            $("#matrix_max_min_optionNum").show();
        }
    },

    optionCreatorTemplate: function (indexTag, type) {
        type = typeof type !== 'undefined' ? type : "0";
        return $("#radio-option-creator-template").tmpl({ "optionTag": indexTag, "type": type }).find(".option-creator");
    },

    removeOption: function (e) {
        $(e.target).parents(".option-creator").remove();
        //var optionCreators = $('#option-creators .option-creator');
        var optionCreators = $('.option-creator'); //updated to adapt matrix question options delete, maybe some bug TODO: modify bug of headOpt change when delete sideOpt
        optionCreators.each(function (item, element) {
            $(element).find(".option-tag").html((String.fromCharCode(65 + item)));
        });
        this.changeOptionsNum();
    },

    editQuestion: function (e) {
        surveyInstance.activeQustIndex = e;
        this.question = surveyInstance.questions[surveyInstance.activeQustIndex];
        this.initQuestionCreator();
        this.changeOptionsNum(this.question);
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
                case "matrix":
                    this.getMatrixOptions();
                    this.question.matrixType = $("input[name='matrix_type']")[0].checked ? 0 : 1; //0 单选 1 多选
                    if(this.question.matrixType == 1){ //if multiSelect
                        this.question.maxSelection = $("#max-select-num").val();
                        this.question.minSelection = $("#min-select-num").val();
                    }
                    break;
                case "open":
                    this.question.valid_type = $('input[type=checkbox]').filter('#valid')[0].checked ? $('#validation').find("option:selected").text() : '';
                    this.question.input_type = $('#input-type').find("option:selected").val();
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
        this.question.arrangement = $('#arrangement').find("option:selected").val();
    },

    getMatrixOptions: function () {
        //TODO: refactor here
        var XOptions = [], YOptions = [];
        $("#matrix_HeadOpt .option-creator").each(function(index, element){
            XOptions.push({
                text: $(element).find("input[type=text]").val(),
                necessary: $(element).find("input[type=checkbox]")[0].checked
            });
        });
        $("#matrix_SideOpt .option-creator").each(function(index, element){
            YOptions.push({
                text: $(element).find("input[type=text]").val(),
                necessary: $(element).find("input[type=checkbox]")[0].checked
            });
        });
        this.question.xOptions = XOptions;
        this.question.yOptions = YOptions;
    },

    getArea: function () {
        //return the last checked checkbox id
        if ($("#areaType").find("input:checked").toArray().pop()) {
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
    },
    changeOptionsNum :function (element) {
        var minOption = "";
        var maxOption = "";
        if (typeof element === "undefined") {
            $('#option-creators').find('.option-creator').each(function(index) {
                maxOption = minOption += "<option value=" + (index+1) + ">" + (index+1) + "</option>";
            })
        }
        else {
            $('#option-creators').find('.option-creator').each(function(index) {
                minOption += ((index+1) === parseInt(element.minSelection)) ? "<option value=" + (index+1) + " selected>" + (index+1) + "</option>" : "<option value=" + (index+1) + ">" + (index+1) + "</option>";
                maxOption += ((index+1) === parseInt(element.maxSelection)) ? "<option value=" + (index+1) + " selected>" + (index+1) + "</option>" : "<option value=" + (index+1) + ">" + (index+1) + "</option>";
            })
        }
        $('#max-select-num').html(maxOption);
        $('#min-select-num').html(minOption);
    },

    uploadImg: function(e) {
        var sourceId = $(e.target).attr("id");
        var targetId = sourceId.replace("upload", "pre");
        imagePreview(sourceId, targetId);
    }
});
