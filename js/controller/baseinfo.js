var BaseInfo = Spine.Controller.sub({
    template: function () {
        return $("#base-info-template").html();
    },
    events: {
        "change input[type=file]": "preImg"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        //show template
        this.show();
        //init widgets
        $("#end-date").datepicker();
    },
    preImg: function (e) {
        var sourceId = $(e.target).attr("id");
        var targetId = sourceId.replace("upload", "imgPre");
        if (typeof FileReader === 'undefined') {
            alert('Your browser does not support FileReader...');
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.getElementById(targetId);
            img.src = this.result;
        };
        reader.readAsDataURL(document.getElementById(sourceId).files[0]);
    }
});
