// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
    template: function () {
        return $("#survey-preview-template").html();
    },
    elements: {
        "#survey-preview-list": "surveyPreviewList"
    },
    events: {
        "click .remove-question": "removeQuestion",
        "click .edit-question": "editQuestion",
        "click #submit-survey": "submitSurvey",
        "change select": "selectAreaChange"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        this.sortableList();
        //init widgets
        surveyInstance.bind("questionChange", this.proxy(this.renderQuestions));
    },
    sortableList: function () {
        $(this.surveyPreviewList).sortable({
            items: "li",
            activate: function (event, ui) {
                this.oldindex = ui.item.index();
            },
            deactivate: function (event, ui) {
                if (this.oldindex != ui.item.index()) {
                    ui.item.parent().find("li").each(function (index, element) {
                        $(element).find("span").html(index + 1);
                    });
                    surveyInstance.sortQuestion(this.oldindex, ui.item.index());
                }
            }
        });
        $(this.surveyPreviewList).disableSelection();
    },

    initRadioCheckPreview: function (question, questionTag) {
        var optionsValue = [];
        var questionOptions = "";
        $(question.options).each(function (index, element) {
            var radioValue = {};
            radioValue.name = questionTag + 1;
            radioValue.index = element.index;
            radioValue.content = element.content;
            var typeValue = parseInt(element.type);
            radioValue.type = [question.type == "single-select" ? "radio" : "checkbox", "textarea"][typeValue];
            $("#radio-option-template").tmpl(radioValue).appendTo(".option-list:last");
        });

    },

    initMatrixPreview: function () {
        //TODO:for matrix
    },

    initOpenPreview: function (element) {
        var editArea = element.input_type === "文本域" ? '<textarea></textarea>' : '<input type="text" />';
        $(".option-list:last").append(editArea);
    },

    initAreaPreview: function (areaType) {
     var selectors = "", options;
     var prov = $("#area-province-preview-template").html();
     var city = $("#area-city-preview-template").html();
     var district = $("#area-district-preview-template").html();
        switch (areaType){
                case "province":
                      options = this.initSelectList("province");
                      selectors = "<select class='province'><option>请选择</option>" + options + "</select>省";
                      break;
                  case "city":
                      options = this.initSelectList("province");
                      selectors = "<select class='province'><option>请选择</option>" + options + "</select>省";
                      selectors += city;
                      break;
                  case "district":
                      options = this.initSelectList("province");
                      selectors = "<select class='province'><option>请选择</option>" + options + "</select>省";
                      selectors += city;
                      selectors += district;
                      break;
                  default:
                      break;
              }
        $(".option-list:last").append(selectors);
    },

    renderQuestions: function (e) {
        $(this.surveyPreviewList).empty();
        var that = this;
        var previewContent = this.surveyPreviewList;
        $(e.questions).each(function (index, element) {
            $("#question-preview-template").tmpl({ "questionIndex": index + 1, "questionDescription": element.description }).appendTo($(previewContent));
            switch (element.type) {
                case "single-select": case "multi-select":
                    that.initRadioCheckPreview(element, index);
                    break;
                case "matrix":
                    that.initMatrixPreview();
                    break;
                case "open":
                    that.initOpenPreview(element);
                    break;
                case "area":
                    that.initAreaPreview(element.area);
                    break;
            }
        });
    },

    removeQuestion: function (e) {
        var index = $(e.target).parents("li").index();
        surveyInstance.deleteQuestion(index);
    },

    editQuestion: function (e) {
        var index = $(e.target).parents("li").index();
        $('#tabs').tabs('option', 'active', 1);
        Spine.trigger("clickEdit", index);
    },

    selectAreaChange: function (e) {
        var options = this.initSelectList($(e.target).next().attr('class'), e.target.value);
        $(e.target.nextElementSibling).empty().append("<option>请选择</option>" + options );
    },

    submitSurvey: function () {
        surveyInstance.submitSurvey();
    },

    initSelectList: function (areaType, parentCode){
        var options = "";
        switch (areaType) {
            case "province" :
                for (var i = 0; i < data_province.length; i++){
                    var option = "<option value='" + data_province[i].code + "'>" + data_province[i].name + "</option>";
                    options += option;
                }
                break;
            case "city":
                for (var i = 0; i < data_city.length; i++){
                    if(data_city[i].code.substring(0,2) === parentCode.substring(0,2)) {
                        var option = "<option value='" + data_city[i].code + "'>" + data_city[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            case  "district":
                for (var i = 0; i < data_district.length; i++){
                    if(data_district[i].code.substring(0,4) === parentCode.substring(0,4)) {
                        var option = "<option value='" + data_district[i].code + "'>" + data_district[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            default :
                break;
        }
        return options;
    }
});
