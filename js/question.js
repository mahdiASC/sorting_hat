class Question extends _base {

    outcome(choice) {
        return this.answers.find(c => c.text == choice).outcome;
    }
}

Question.first = () => {
    return Question.all.find(x => Number(x.id) == 1);
};

Question.next = (q, choice) => {
    //accepts arguments of a Question object
    //returns the next logical Question object by traversing linkage backwards
    //handles sub_q
    let found = q.answers.find(x => x.text == choice);
    if (Object.keys(found).some(key => key == "sub_q")) {
        return found.sub_q;
    } else {
        //backtrack 
        let root = Question.rootq(q);
        if (!root) {
            return undefined;
        }
        return Question.find(Number(root.id) + 1);
    }
}

Question.rootq = q => {
    //finds root question (with an id) of input Question object
    let output = q.parent
    if (!output) {
        return undefined;
    }
    let attempt = output.parent;
    while (attempt !== undefined) {
        output = attempt;
        attempt = attempt.parent;
    }
    return output;
}

Question.find = num => {
    //find question with id == num
    return Question.all.find(q => Number(q.id) == num);
}

Question.createFromJSON = function (obj) {
    //linked list styled questions
    //recursively creates questions w/subquestions
    if (obj["text"]) {
        //single question
        let q = new this(obj);

        q.answers.forEach(a => {
            if (a.sub_q) {
                a.sub_q = Question.createFromJSON(a.sub_q);
                a.sub_q.parent = q;
            }
        });
        return q;
    } else {
        //multiple questions
        for (let i of Object.keys(obj)) {
            Question.createFromJSON(obj[i]);
        }
    }
}