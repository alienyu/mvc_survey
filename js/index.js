$(function(){
  var GloablApp = Spine.Controller.sub({
    el: $("body"),
    init: function () {
      //tab initial
      $("#tabs").tabs({ disabled: [1, 2, 3] });
      this.baseinfo = new BaseInfo({el: $("#edit_servey")});
    }
  });
  window.App = new GloablApp();
  // alert(App.test);
});
