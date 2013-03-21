var LogicSettings = Spine.Controller.sub({
    template: function () {
        return $("#logic-template").tmpl();
    },

    events: {
        "click .one_logic": "showLogic",
        "click .delete_logic": "deleteLogic",
        "click #save_logic": "saveLogic",
        "click .closer": "deleteCondition",
        "click #logic_result": "addCondition",
        "click #add_logic": "addLogic",
        "change #logic_questions": "changeOption",
        "change #action_questions": "changeActionOption"
    },

    show: function () {
        this.el.html(this.template());
    },

    init: function () {
        this.logic_condition_index = 0;
        this.conditions = [];
        this.logic_list = [];
        //show template
        this.show();
        //init widgets
    },

    addLogic: function() {
        $('#logic-settings-container').empty();
        $('#logic-settings-template').tmpl().appendTo($('#logic-settings-container'));
        this.conditions = [];
        this.logic_condition_index = 0;
        $(surveyInstance.questions).each(function(i,e) {
            $('#question-list-template').tmpl({"index":i+1,"question":e.description}).appendTo($('#logic_questions'));
            $('#question-list-template').tmpl({"index":i+1,"question":e.description}).appendTo($('#action_questions'));
            if (i==0) {
                $('#logic_question_options').append("<option>全部</option>");
                $(e.options).each(function(i,e) {
                    var value = i + 1;
                    var option = "<option value=" + value + ">" + e.index + "." + e.content + "</option>";
                    var answer = "<option value='0'>回答</option><option value='1'>不回答</option>"
                    $('#logic_question_options').append(option);
                    $('#action_options').append(option);
                    $('#logic_is_answer').html(answer);
                })
            }
        })
        this.query = Ext.create('yiengine.Query',{
            height:80,
            width:600,
            renderTo: 'logic_select_result'
        });
    },

    changeOption: function() {
        $('#logic_question_options').empty();
        $('#logic_question_options').append("<option>全部</option>")
        var i = parseInt($('#logic_questions').find("option:selected").val()) - 1;
        $(surveyInstance.questions[i].options).each(function(i,e) {
            var value = i + 1;
            var option = "<option value=" + value + ">" + e.index + "." + e.content + "</option>";
            var answer = "<option value='0'>回答</option><option value='1'>不回答</option>";
            $('#logic_question_options').append(option);
            $('#logic_is_answer').html(answer);
        })
    },

    changeActionOption: function() {
        $('#action_options').empty();
        var i = parseInt($('#action_questions').find("option:selected").val()) - 1;
        $(surveyInstance.questions[i].options).each(function(i,e) {
            var option = "<option value=" + i + ">" + e.index + "." + e.content + "</option>";
            var show = '<option value="0">显示</option><option value="1">不显示</option>'
            $('#action_options').append(option);
            $('#actionType').html(show);
        })
    },

    addCondition: function() {
        var question_name = $('#logic_questions').find("option:selected").text();
        var option_name = $('#logic_question_options').find("option:selected").text();
        var answer = $('#logic_is_answer').find("option:selected").text();
        if(!this.query){
            this.query = Ext.create('yiengine.Query',{
                height:80,
                width:600,
                renderTo: 'logic_select_result'
            });
        }
        this.query.addValue({
            question:question_name,
            option:option_name,
            answer:answer,
            description:question_name + option_name + answer
        });
        //缓存条件
        var logic_question_index = question_name.split('.')[0];
        var option_index = option_name !== "全部" ? option_name.split('.')[0].charCodeAt() - 64 : 0;
        var condition = answer == "回答" ? option_index : option_index * (-1);
        var each_condition = {};
        each_condition[logic_question_index] = condition;
        this.conditions.push(each_condition);
        this.logic_condition_index++;
        console.log(this.conditions);
    },

    deleteCondition: function(e) {
        var minus = parseInt($('#logic_select_result').children().attr('id').split('-')[1]);
        var index = parseInt($(e.target.parentElement.parentElement).attr('id').split('-')[1])-minus-2;
        delete this.conditions[index];
        e.target.parentElement.remove();
    },

    unique: function(data) {
        data = data || [];
        var a = {};
        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            if (typeof(a[v]) == 'undefined') {
                a[v] = 1;
            }
        };
        data.length = 0;
        for (var i in a) {
            data[data.length] = i;
        }
        return data;
    },

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
        });
        for(i in map) {
            map[i] = this.unique(map[i]);
        };
        return map;
    },

    saveLogic: function() {
        var map = this.getMap();
        var logic_name = $('#logic_name').val();
        var logic_type = $('#logic_type').find("option:selected").val();
        var logic_action_question = $('#action_questions').find("option:selected").val();
        var logic_action_option = $('#action_options').find("option:selected").val();
        var action_type = $('#actionType').find("option:selected").val();
        var logicOne =  new Logic ({
            logicName: logic_name,
            logicType: logic_type,
            map:map,
            action: {
                type: action_type,
                queN: logic_action_question,
                optN: logic_action_option
            }
        });
        this.logic_list.push(logicOne);
        surveyInstance.logic_control_js = JSON.stringify(this.logic_list);
        console.log(surveyInstance);
        $('#logic-settings-container').empty();
        $('#logicList').empty();
        $(this.logic_list).each(function(i,e) {
            if (e !== undefined) {
                $('#logicList').append( '<li><div class="one_logic">' + e.logicName + '</div><a href="#" class="delete_logic delete quota' + i + '"></a></li>');
            }
        })
        this.conditions = [];
        this.logic_condition_index = 0;
    },

    deleteLogic: function(e) {
        var index = parseInt(e.target.classList[2].match(/\d/)[0]);
        delete this.logic_list[index];
        e.target.parentElement.remove();
        console.log(this.logic_list);
    },

    showLogic: function(e) {
        this.addLogic();
        var index = parseInt($(e.target.parentElement).find('a').attr('class').split(' ')[2].match(/\d/)[0]);
        var one_logic = this.logic_list[index];
        var logic_name = one_logic.logicName;
        var logic_type = one_logic.logicType;
        var map = one_logic.map;
        var action_type = one_logic.action.type;
        var action_qu = one_logic.action.queN;
        var action_op = one_logic.action.optN;
        //回显
        $('#action_options').empty();
        $(surveyInstance.questions[action_qu-1].options).each(function(i,e) {
            var option = "<option value=" + i + ">" + e.index + "." + e.content + "</option>";
            var show = '<option value="0">显示</option><option value="1">不显示</option>'
            $('#action_options').append(option);
            $('#actionType').html(show);
        })
        $('#logic_name').val(logic_name);
        $('#logic_type').find('option')[logic_type].selected = true;
        $('#action_questions').find('option')[action_qu-1].selected = true;
        $('#action_options').find('option')[action_op-1].selected = true;
        $('#actionType').find('option')[action_type].selected = true;
        //TODO:map
    }
});
