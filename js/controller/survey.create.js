// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
  template: function () {
    return $("#survey-create-template").html();
  },
//events: {"":""},
  show: function () {
    this.el.html(this.template());
  },
  addQuestion :function(){
      //add dragable
      $("#single_select").draggable({ opacity: 0.7, helper: "clone", cursor: "move" });
      $("#multi_select").draggable({ opacity: 0.7, helper: "clone" });
      $("#matrix").draggable({ opacity: 0.7, helper: "clone" });
      $("#open").draggable({ opacity: 0.7, helper: "clone" });
      $("#area").draggable({ opacity: 0.7, helper: "clone" });

      //add question
      $("#question-template").droppable({
          drop: function (e, ui) {
              $('#question-template').empty();
              var drag = ui.draggable.text().trim();
              switch (drag) {
                  case '单选':
                      createQuestion(0, 0);
                      break;
                  case '多选':
                      createQuestion(1, 0);
                      break;
                  case '开放':
                      createQuestion(3 ,0);
                      break;
              }
          }
      });
  },
  init: function () {
    //show template
    this.show();
    //init widgets
    Spine.trigger("show_control_bar", this.el);
    //add question by drag
    this.addQuestion();
  },
  _sortQuestion: function () {
  }
});