class Timer {
    // in charge of keeping count and percent done
    constructor(total_count){
        this.total_count=total_count;
        this.current = 0;
    }

    update(increment){
        this.current+=increment;
        if(this.current>=this.total_count){
            console.log("Done!");
            // this.addStudentDownload();
        }else{
            console.log(Math.round((this.current/this.total_count)*100,2)+"% done...");
        }
    }
    
    // addStudentDownload(){
    //     let url = makeTextFile(JSON.stringify(Student.all));
        
    // }
}
