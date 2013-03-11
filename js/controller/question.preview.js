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
        var selectors = "";
        var prov = "<select class='area_prov'><option>请选择</option><option>北京</option><option>上海</option><option>广州</option></select>";
        var city = "<select class='area_city'><option>请选择</option><option>北京</option><option>上海</option><option>广州</option></select>";
        var district = "<select class='area_district'><option>请选择</option><option>朝阳</option><option>海淀</option><option>玄武</option></select>";
        switch (areaType) {
            case "province":
                selectors = prov;
                break;
            case "city":
                selectors = prov;
                selectors += city;
                break;
            case "district":
                selectors = prov;
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
        Spine.trigger("clickEdit", index);
    },

    selectAreaChange: function (e) {
        alert(e.target.value);
    },

    submitSurvey: function () {
        surveyInstance.submitSurvey();
    }
});
