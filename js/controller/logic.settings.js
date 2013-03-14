var LogicSettings = Spine.Controller.sub({
    template: function () {
        return $("#logic-settings-template").tmpl();
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        
    }
});
