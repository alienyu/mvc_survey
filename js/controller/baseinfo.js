var isValid = 0;
var BaseInfo = Spine.Controller.sub({
    template: function () {
        return $("#base-info-template").html();
    },
    events: {
        "change input[type=file]": "preImg",
        "click .next_step": "baseInfoValid"
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
        imagePreview(sourceId, targetId);
    },
    baseInfoValid: function() {
        isValid = 0;
        //valid text type info
//        $('#add-base-info').find('input[type="text"]').each(function(index, element) {
//            if (!($(element).val())) {
//                alert($(element.parentNode).find('label').text() + "不能为空");
//                isValid = 1;
//            }
//            else {
//                if ((element.id === "join-point" && !(/^[1-9]\d*$/.test($(element).val())))|| (element.id === "complete-point" && !(/^[1-9]\d*$/.test($(element).val())))){
//                    alert ($(element.parentNode).find('label').text() + "要填写正整数");
//                    isValid = 1
//                }
//            }
//        });
//
//        //valid select type info
//        $('#add-base-info').find("option:selected").each(function(index, element) {
//            if ($(element).text() === "请选择") {
//                alert ($(element.parentNode.parentNode).find('label').text() + "未选择");
//                isValid = 1;
//            };
//        });
//        if (isValid == 1) {return}
//        $('.survey_name').find('div>span').text($('#question-name').val());
        //turn to next page
        $('#tabs').tabs('enable', 1);
        $('#tabs').tabs('option', 'active', 1 );
    }
});
