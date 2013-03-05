var BaseInfo = Spine.Controller.sub({
  template: function () {
    return $("#base-info-template").html();
  },

  show: function () {
    this.el.html(this.template());
  },

  init: function() {
    this.show();
  }
});
