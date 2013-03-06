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
      "click .remove-option-tag": "removeOption"},

    show: function () {
        this.el.html(this.template());
    },

    initRadioCreator: function () {
      this.questionTextCreator();
      var optionCreatorTemp = $($("#radio-option-creator-template").html()).tmpl({"optionTag": "A"});
      $(this.creatorArea).append(optionCreatorTemp);
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
        $("#creator-area").droppable({
            drop: function (e, ui) {
                $("#creator-area").empty();
                var drag = ui.draggable.attr("id");
                switch (drag) {
                    case "single-select":
                        that.initRadioCreator();
                        break;
                    case "multi-select":
                        //TODO:create multi select question
                        break;
                    case "matrix":
                        //TODO:create matrix question
                        break;
                    case "open":
                        //TODO:create open question
                        break;
                    case "area":
                        //TODO:create region question
                        break;
                }
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
                                .find("#option-creators").tmpl({"optionTag": indexTag});
        $("#option-creators").append(optionCreatorTemp);
    },

    removeOption: function (e) {
      e.target.parentElement.remove();
      var optionCreators = $('#option-creators .option-creator');
      optionCreators.each(function (item, element) {
          $(element).find("span").html((String.fromCharCode(65 + item)));
      });
    }
});
