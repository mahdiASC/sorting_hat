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
            addStudentDownload();
        }else{
            console.log(Math.round((this.current/this.total_count)*100,2)+"% done...");
        }
    }
}

addStudentDownload = function(){
    let url = makeTextFile(JSON.stringify(Student.all));
    $("body").append($("<a />", {
        href: url,
        text: "Download",
        download: "students.json"
    }));
}
