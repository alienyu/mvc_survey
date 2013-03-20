var QuotaSettings = Spine.Controller.sub({
    template: function () {
        return $("#quota-template").tmpl();
    },

    events: {
        "click #save_quota": "saveQuota",
        "click #delete_quota_condition": "deleteCondition",
        "click #logic_result": "addCondition",
        "click #add_quota": "addQuota",
        "change #quota_questions": "changeOption"
    },
    show: function () {
        this.el.html(this.template());
    },
    init: function () {
        this.quota_condition_index = 0;
        this.conditions = [];
        //show template
        this.show();
        //init widgets
    },

    addQuota: function() {
        $('#quota_setting').empty();
        $('#quota-setting-template').tmpl().appendTo($('#quota_setting'));
        $(surveyInstance.questions).each(function(i,e) {
            $('#quota-question-list-template').tmpl({"index":i+1,"question":e.description}).appendTo($('#quota_questions'));
            if (i==0) {
                $('#quota_question_options').append("<option>全部</option>");
                $(e.options).each(function(i,e) {
                    var option = "<option value=" + i + ">" + e.index + "." + e.content + "</option>";
                    var answer = "<option value='0'>回答</option><option value='1'>不回答</option>"
                    $('#quota_question_options').append(option);
                    $('#is_answer').html(answer);
                })
            }
        })
    },

    changeOption: function() {
        $('#quota_question_options').empty();
        $('#quota_question_options').append("<option>全部</option>")
        var i = parseInt($('#quota_questions').find("option:selected").val()) - 1;
        $(surveyInstance.questions[i].options).each(function(i,e) {
            var option = "<option value=" + i + ">" + e.index + "." + e.content + "</option>";
            var answer = "<option value='0'>回答</option><option value='1'>不回答</option>";
            $('#quota_question_options').append(option);
            $('#is_answer').html(answer);
        })
    },

    addCondition: function() {
        var question_name = $('#quota_questions').find("option:selected").text();
        var option_name = $('#quota_question_options').find("option:selected").text();
        var answer = $('#is_answer').find("option:selected").text();
        var result = question_name + '选项' + option_name + answer;
        $('#select_result').append('<div>' + result + '<a href="#" id="delete_quota_condition" class="delete' + " condition" + this.quota_condition_index + '"></a></div>');
        //缓存条件
        var quota_question_index = question_name.split('.')[0];
        var option_index = option_name !== "全部" ? option_name.split('.')[0].charCodeAt() - 64 : 0;
        var condition = answer == "回答" ? option_index : option_index * (-1);
        var each_condition = {};
        each_condition[quota_question_index] = condition;
        this.conditions.push(each_condition);
        this.quota_condition_index++;
        console.log(this.conditions);
    },

    deleteCondition: function(e) {
        var index = parseInt(e.target.classList[1].match(/\d/)[0]);
        delete this.conditions[index];
        e.target.parentElement.remove();
    },

    saveQuota: function() {
        $(this.conditions).each(function(i,e) {
            e;
        })
    }
});
