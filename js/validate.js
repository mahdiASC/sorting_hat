class Validate{
    constructor(){
    }

    main(){
        let dups = this.getDups();
        if(dups.length>0){
            this.reportDups(dups);
            throw new Error("Found duplicate entries!");
        }else{
            console.log("No duplicates found")
        }
    }

    getDups(){
        let output = [];
        for(let i = 0; i < Cohort.all.length; i++){
            let cohort = Cohort.all[i];
            output.concat(cohort.class.filter(x=>x.cohort!=cohort.name));
            output.concat(findDuplicates(cohort.class));
        }
        return output;
    }

    reportDups(dups){
        //dups is array of duplicate students
        console.log("Duplicates:");
        for(let i = 0; i < dups.length; i++){
            console.log(`${dups[i].name} was supposed to be in ${dups[i].cohort}`);
        }
    }
}
