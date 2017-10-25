class Validate{
    constructor(cohorts,students){
        this.cohorts = cohorts || Cohort.all; //hacky solution for testing
        this.students = students || Student.all;
    }

    main(){
        if(this.dupStudentsCheck()){
            console.log("There are duplicate students!");
            console.log("Duplicates:");
            let dups = this.getDups()
            for(let i = 0; i < dups.length; i++){
                console.log(`${dups[i].name} was supposed to be in ${dups[i].cohort}`);
            }
        };
    }

    dupStudentsCheck(){
        //number in cohorts don't match number wth cohorts
        let count = 0;
        for(let i = 0; i < this.cohorts.length; i++){
            count += this.cohorts[i].class.length;
        }

        return count!=this.students.filter(x=>!!x.cohort).length;
    }

    getDups(){
        //find any student who is in the wrong cohort
        let output = [];
        for(let i = 0; i < this.cohorts.length; i++){
            for(let k of this.cohorts[i].class){
                if(k.cohort!=this.cohorts[i].name){
                    output.push(k);
                }
            }
        }
        return output;
    }
}

// Export node module.
if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
{
    module.exports = Validate;
}