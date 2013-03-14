var QuotaSettings = Spine.Controller.sub({
    template: function () {
        return $("#quota-settings-template").tmpl();
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
