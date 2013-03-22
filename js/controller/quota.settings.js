var QuotaSettings = Spine.Controller.sub({
    template: function () {
        return $("#quota-template").tmpl();
    },

    events: {
        "click .one_quota": "showQuota",
        "click .delete_quota": "deleteQuota",
        "click #save_quota": "saveQuota",
        "click #quota_result": "addCondition",
        "click #add_quota": "addQuota",
        "change #quota_questions": "changeOption"
    },

    show: function () {
        this.el.html(this.template());
    },

    init: function () {
        this.update_index = 0;
        this.is_update = 0;
        this.quota_list = [];
        //show template
        this.show();
        //init widgets
    },

    addQuota: function() {
        this.is_update = 0;
        $('#quota_setting').empty();
        $('#quota-setting-template').tmpl().appendTo($('#quota_setting'));
        $(surveyInstance.questions).each(function(i,e) {
            $('#question-list-template').tmpl({"index":i+1,"question":e.description}).appendTo($('#quota_questions'));
            if (i==0) {
                $('#quota_question_options').append("<option>全部</option>");
                $(e.options).each(function(i,e) {
                    var value = i+1;
                    var option = "<option value=" + value + ">" + e.index + "." + e.content + "</option>";
                    var answer = "<option value='0'>回答</option><option value='1'>不回答</option>"
                    $('#quota_question_options').append(option);
                    $('#quota_is_answer').html(answer);
                })
            }
        });
        this.query = Ext.create('yiengine.Query',{
            height:80,
            width:600,
            renderTo: 'quota_select_result'
        });
    },

    changeOption: function() {
        $('#quota_question_options').empty();
        $('#quota_question_options').append("<option>全部</option>")
        var i = parseInt($('#quota_questions').find("option:selected").val()) - 1;
        $(surveyInstance.questions[i].options).each(function(i,e) {
            var value = i+1;
            var option = "<option value=" + value + ">" + e.index + "." + e.content + "</option>";
            var answer = "<option value='0'>回答</option><option value='1'>不回答</option>";
            $('#quota_question_options').append(option);
            $('#quota_is_answer').html(answer);
        })
    },

    addCondition: function() {
        var question_name = $('#quota_questions').find("option:selected").text();
        var option_name = $('#quota_question_options').find("option:selected").text();
        var answer = $('#quota_is_answer').find("option:selected").text();
        var quota_question_index = question_name.split('.')[0];
        var option_index = option_name !== "全部" ? option_name.split('.')[0].charCodeAt() - 64 : 0;
        var is_answer = answer == "回答" ? 1 : 0;
        if(!this.query){
            this.query = Ext.create('yiengine.Query',{
                        height:80,
                        width:600,
                        renderTo: 'quota_select_result'
                  });
        }
        this.query.addValue({
            question:question_name,
            option:option_name,
            answer:answer,
            description:question_name + option_name + answer,
            question_index: quota_question_index,
            option_index: option_index,
            is_answer: is_answer
        });
    },

    saveQuota: function() {
        var quota_name = $('#quota_name').val();
        var quota_num = $('#quota_num').val();
        var quota_action = $('#quota_action').find("option:selected").val();
        var quota_message = $('#quota_message').val();
        var quotaOne =  new Quota ({
            quota_name: quota_name,
            condition:this.query.getValue(),
            quota_MaxNum: quota_num,
            quota_action: quota_action,
            quota_message: quota_message
        });
        if (this.is_update === 0) {
            this.quota_list.push(quotaOne);
        }
        else {
            this.quota_list[this.update_index] = quotaOne;
        }
        surveyInstance.quota_control_js = JSON.stringify(this.quota_list);
        console.log(surveyInstance);
        $('#quota_setting').empty();
        $('#quota_show>ul').empty();
        $(this.quota_list).each(function(i,e) {
            if (e !== undefined) {
                $('#quota_show>ul').append( '<li><span class="one_quota">' + e.quota_name + '</span><a href="#" class="delete_quota delete quota' + i + '"></a></li>');
            }
        })
    },

    deleteQuota: function(e) {
        var index = parseInt(e.target.classList[2].match(/\d/)[0]);
        delete this.quota_list[index];
        e.target.parentElement.remove();
        console.log(this.quota_list);
    },

    showQuota: function(e) {
        this.addQuota();
        this.is_update = 1;
        var that = this;
        this.update_index = parseInt($(e.target.parentElement).find('a').attr('class').split(' ')[2].match(/\d/)[0]);
        var one_quota = this.quota_list[this.update_index];
        var quota_name = one_quota.quota_name;
        var quota_MaxNum = one_quota.quota_MaxNum;
        var quota_action = one_quota.quota_action;
        var quota_message = one_quota.quota_message;
        //回显
        $('#quota_name').val(quota_name);
        $('#quota_num').val(quota_MaxNum);
        $('#quota_message').val(quota_message);
        $('#quota_action').find('option')[quota_action].selected = true;
        //show conditions
        $('#quota_select_result').empty();
        this.query = Ext.create('yiengine.Query',{
            height:80,
            width:600,
            renderTo: 'quota_select_result'
        });
        $(this.quota_list[this.update_index].condition).each(function(i,e){
            that.query.addValue(e);
        })
    }
});
