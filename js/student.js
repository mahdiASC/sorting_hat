class Student extends _base {
    constructor(params) {
        super(params);
        this.scores = params.scores || [];
        this.durations = params.durations || [];
        this.img = params.img || "placeholder.png";
    }
    get techScore() {
        if (this._ts !== undefined) {
            return this._ts;
        } else {
            //specifically finds anything with a "q" followed by a number
            let re = new RegExp('q[0-9]+');
            return this._ts = Object.getOwnPropertyNames(this).filter(x => x.match(re)).reduce((sum, val) => sum + Number(this[val]), 0);
        }
    }

    //needed in order to reassign getter
    set techScore(param) {
        delete this.techScore;
    }

    get stats() {
        if (this._s !== undefined) {
            return this._s;
        } else {
            //traverses question links to get final stats (shouldn't change)
            //questions taken in order (starts with s + ##)
            let q = Question.first();
            let i = 1;
            while (q) {
                let result = q.outcome(this[`s${i}`]);
                if (!this._s) {
                    this._s = {};
                }

                for (let w of Object.keys(result)) {
                    let k = result[w];
                    if (!this._s[w]) {
                        this._s[w] = 0;
                    }
                    this._s[w] += k;
                }

                q = Question.next(q, this[`s${i}`]);
                i++;
            }
            return this._s;
        }

    }

    //needed in order to reassign getter
    set stats(params) {}

    //sorts list of cohorts by lowest priority
    selfSort() {
        this.scores = this.scores.sort((a, b) => a.score - b.score);
    }

    //for randomly reassinging non-vital parameters
    modifiedWith(params){
        for(let param of Object.keys(params)){
            this[param]= params[param];
        }
        return this;
    }
}

Student.fullSort = function () {
    Student.all.forEach(x => x.selfSort());
}

Student.waitlist = function(){
    return Student.all.filter(x=>!x.cohort);
}
