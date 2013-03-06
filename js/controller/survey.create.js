// this is for the survey create page
var SurveyCreate = Spine.Controller.sub({
  template: function () {
    return $("#survey-create-template").html();
  },
//events: {"":""},
  show: function () {
    this.el.html(this.template());
    $('#ul_serveyList').sortable({
      containment: "parent",
      items: "li:not(.question_editor)",
      deactivate: function (event, ui) {
        $("#ul_serveyList li").each(function (index, element) {
          $(element).find(".view-question-content").children("span").html(index + 1);
        });
      }
    });
    $('#ul_serveyList').disableSelection();
  },
  init: function () {
    //show template
    this.show();
    //init widgets
    Spine.trigger("show_control_bar", this.el);
  },
  _sortQuestion: function () {
  }
});