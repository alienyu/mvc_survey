// this is used for defining model of question
var Question = Spine.Model.sub();
Question.configure('Question', 'type', 'description', 'necessary', 'options', 'arrangement', 'maxSelection', 'minSelection', 'valid_type', 'input_type', 'area', "xOptions", "yOptions", "matrixType");
Question.include({
    aaa: function () {
        alert(this.type);
    }
});
