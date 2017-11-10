class Question{
    constructor(params) {
        if (!Question.all){
            Question.all = []
        }
        Question.all.push(this);
        for (let i in params) {
            this[i] = params[i];
        }

        for (let k = 0; k<this.answers.length; k++){
            let answer = this.answers[k];
            if(answer.sub_q){
                answer.sub_q = new Question(answer.sub_q);
                answer.sub_q.parent = this.id;
            }
        }
    }

    get all(){
        return constructor.all;
    }

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
    if(found){
        if ( Object.keys(found).some(key => key == "sub_q")) {
            return found.sub_q;
        }else{
            let root = Question.rootq(q);
            if(root){
                return Question.find(Number(root.id) + 1);
            }
        }
    }
}

Question.rootq = q => {
    //finds root main question (with an id) of input Question object
    if (q.parent){
        // return Question.find(Number(q.parent.id));
        return Question.find(q.parent);
    }
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
        let output = [];
        //multiple questions
        for (let i of Object.keys(obj)) {
            output.push(Question.createFromJSON(obj[i]));
        }

        return output.length>1 ? output : output[0];
    }
}

Question.createFromJSONPromise = function(obj){
    return new Promise((resolve, reject)=>{
        Question.createFromJSON(obj);
        resolve();
    });  
}