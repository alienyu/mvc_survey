// this is used to defined the survey model
var Survey = Spine.Model.sub();
Survey.configure('Survey', 'questions', 'questionIndex');
Survey.include({
    deleteQuestion: function (index) {
        if (this.questionIndex != index) {
            this.questions.splice(index, 1);
            this.trigger("questionChange", this.questions);
        }
        else {
            alert("You are editing this question now!");
        }
    },
    // insert or edit question
    updateQuestion: function (item) {
        //To do: update item
        if (this.questionIndex != null) {
            this.questions[this.questionIndex] = item;
        }
        else {
            this.questions.push(item);
        }
        this.trigger("questionChange", this.questions);
    },
    editQuestion: function (index) {
        this.questionIndex = index;
        this.trigger("editQuestion", this.questions[index]);
    },
    sortQuestion: function (oldIndex, newIndex) {
        this.questions.move(oldIndex, newIndex);
    }
});
