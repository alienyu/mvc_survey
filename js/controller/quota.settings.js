var QuotaSettings = Spine.Controller.sub({
    template: function () {
        return $("#quota-template").tmpl();
    },

    events: {
        "click .delete_quota": "deleteQuota",
        "click #save_quota": "saveQuota",
        "click .delete_quota_condition": "deleteCondition",
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
        this.quota_list = [];
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
        $('#select_result').append('<div>' + result + '<a href="#" class="delete_quota_condition delete' + " condition" + this.quota_condition_index + '"></a></div>');
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
        var index = parseInt(e.target.classList[2].match(/\d/)[0]);
        delete this.conditions[index];
        e.target.parentElement.remove();
    },

    //TODO:logic has something bad
    getMap: function() {
        var options = [];
        var map = {};
        var is_exist = 0;
        $(this.conditions).each(function(i,e) {
            options = [];
            is_exist = 0;
            for (item in e) {
                var key = item;
                var value = e[item];
                if ($.isEmptyObject(map)) {
                    options.push(value);
                    map[key] = options;
                }
                else {
                    for (i in map) {
                        if (item === i) {
                            is_exist = 1;
                        }
                    }
                    if (is_exist === 0) {
                        //添加新项
                        options.push(value);
                        map[key] = options;
                    }
                    else {
                        //存在Key,push值
                        map[key].push(value);
                    }
                }
            }
        })
        return map;
    },

    saveQuota: function() {
        var map = this.getMap();
        var quota_name = $('#quota_name').val();
        var quota_num = $('#quota_num').val();
        var quota_action = $('#quota_action').find("option:selected").val();
        var quota_message = $('#quota_message').val();
        var quotaOne =  new Quota ({
            quota_name: quota_name,
            map:map,
            quota_num: quota_num,
            quota_action: quota_action,
            quota_message: quota_message
        });
        this.quota_list.push(quotaOne);
        surveyInstance.quota_control_js = JSON.stringify(this.quota_list);
        console.log(surveyInstance);
        $('#quota_setting').empty();
        $('#quota_show>ul').empty();
        $(this.quota_list).each(function(i,e) {
            if (e !== undefined) {
                $('#quota_show>ul').append( '<li>' + e.quota_name + '<a href="#" class="delete_quota delete quota' + i + '"></a></li>');
            }
        })
        this.conditions = [];
    },

    deleteQuota: function(e) {
        var index = parseInt(e.target.classList[2].match(/\d/)[0]);
        delete this.quota_list[index];
        e.target.parentElement.remove();
        console.log(this.quota_list);
    }
});
