// this is used to defined the survey model
var Survey = Spine.Model.sub();
Survey.configure('Survey', 'questions');
Survey.include({
    insertQuestion: function (item) {
        this.questions.push(item);
        this.trigger("questionChange", this.questions);
    },
    deleteQuestion: function (index) {
        this.questions.splice(index, 1);
        this.trigger("questionChange", this.questions);
    },
    updateQuestion: function (item) {
        //To do: update item
        this.trigger("questionChange", this.questions);
    }
});
