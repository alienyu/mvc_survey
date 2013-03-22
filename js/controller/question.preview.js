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
            items: "dl",
            activate: function (event, ui) {
                this.oldindex = ui.item.index();
            },
            deactivate: function (event, ui) {
                if (this.oldindex != ui.item.index()) {
                    ui.item.parent().find("dl").each(function (index, element) {
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
            if (typeValue ==1) {radioValue.unit = element.unit}
            radioValue.type = [question.type == "single-select" ? "radio" : "checkbox", "textarea"][typeValue]
            radioValue.questionType = [question.type == "single-select" ? "radio" : "checkbox", "textarea"][0]
            radioValue.arrangement = question.arrangement === "0" ? "option_horizontal" :"";
            $("#radio-option-template").tmpl(radioValue).appendTo(".option-list:last");
        });
    },

    initMatrixPreview: function (matrixQuestion) {
        //TODO:for matrix
        $(".option-list:last").append('<table><thead></thead></table>');
        var matrixType = matrixQuestion.matrixType;
        var xOptions = matrixQuestion.xOptions;
        var yOptions = matrixQuestion.yOptions;
        var rowTitle = "";
        var columnTitle = "";
        var column = '';
        var row = '';
        var content = '';
        $(xOptions).each(function(i,row) {
            rowTitle += "<td>" + row.text + "</td>'";
        })
        $('.option-list:last').find('table>thead').append("<td></td>" + rowTitle);
        $(yOptions).each(function(rowIndex,rowElement) {
            $(xOptions).each(function(columnIndex,columnElement) {
                if (matrixType === 0 ) {
                    column += "<td><input type='radio' name='" + rowIndex + "'/></td>"
                }
                else {
                    column += "<td><input type='checkbox' name='" + rowIndex + "'/></td>"
                }
                columnTitle = "<td>" + rowElement.text + "</td>"
                row = "<tr>" + columnTitle + column + "</tr>";
            })
            content += row;
            column = '';
        });
        content = "<tbody>" + content + "</tbody>"
        $('.option-list:last').find('thead').after(content);
    },

    getValue: function () {
        var answer = [];
        var each_answer = '';
        $('#table').find('tbody>tr').each(function(rowIndex,rowElement) {
            $(rowElement).find('td').slice(1,100).each(function(columnIndex,columnElement) {
                if ($(columnElement).find('input')[0].checked === true) {
                    each_answer = "(" + rowIndex + "," + columnIndex + ")";
                    answer.push(each_answer);
                }
            })
        })
        console.log(answer);
    },

    initOpenPreview: function (element) {
        var editArea = element.input_type === "1" ? '<textarea></textarea>' : '<input type="text" />';
        $(".option-list:last").append(editArea);
    },

    initAreaPreview: function (areaType) {
     var provSelectTmpl = $("#area-province-preview-template").tmpl();
     var citySelectTmpl = $("#area-city-preview-template").html();
     var districtSelectTmpl = $("#area-district-preview-template").html();
     var allTempl = provSelectTmpl.append(this.initSelectList("province"));
        switch (areaType){
                case "province":
                      break;
                  case "city":
                    allTempl = allTempl.after(citySelectTmpl);
                      break;
                  case "district":
                    allTempl = allTempl.after(citySelectTmpl).after(districtSelectTmpl);
                      break;
                  default:
                      break;
              }
        $(".option-list:last").append(allTempl);
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
                    that.initMatrixPreview(element);
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
        var index = $(e.target).parents("dl").index();
        surveyInstance.deleteQuestion(index);
    },

    editQuestion: function (e) {
        var index = $(e.target).parents("dl").index();
        Spine.trigger("clickEdit", index);
    },

    selectAreaChange: function (e) {
        if (e.target.nextElementSibling !== null) {
            var options = this.initSelectList($(e.target).next().attr('class'), e.target.value);
            $(e.target.nextElementSibling).append(options);
        }
    },

    submitSurvey: function () {
        surveyInstance.submitSurvey();
    },

    initSelectList: function (areaType, parentCode){
        optionsValues = areaData[areaType].map(function(item, index){
            return {code: item.code, name: item.name};
        });
        return $("#area-options-template").tmpl(optionsValues);
    }
});
