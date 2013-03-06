// this is for the question preview
var QuestionPreview = Spine.Controller.sub({
  template: function () {

  },
  show: function () {
  },
  init: function () {
    //show template
    this.show();
    this.sortableList();
    //init widgets
  },
  sortableList: function () {
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
  }
});