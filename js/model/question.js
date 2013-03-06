// this is used for defining model of question
var Question = Spine.Model.sub();
Question.configure('Question', 'type', 'options');
Question.include({
    aaa: function () {
        alert(this.type);
    }
});
