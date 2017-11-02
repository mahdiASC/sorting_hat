// inherits from _base
let Student = require("../js/student.js");
let Question = require("../js/question.js");
describe("Student",function(){
    let student1;
    let student2;

    beforeEach(function(){
        student1 = new Student();
        student1.name = "Ovogeb Isesin";
        student1.email = "Xak@gmail.com";
        student1.address = "1945 Grand Pheasant Lane Lincoln, CA 95648-0000";
        student1.phone = "681-344-1856";
        student1.parent_name = "Seb Anehi";
        student1.parent_email = "Vun@gmail.com";
        student1.parent_phone = "284-593-4353";
        student1.ethnicity = "Hispanic/Latino";
        student1.gpa = 68;
        student1.grade = 10;
        student1.school_type = "public";
        student1.prev_cs = "yes";
        student1.q1 = 1;
        student1.q2 = 3;
        student1.q3 = 3;
        student1.q4 = 7;
        student1.q5 = 3;
        student1.s1 = "c2";
        student1.s2 = "c1";
        student1.s3 = "c1";
        student1.s4 = "c1";
    });

    afterEach(function(){
        delete Student.all;
    });
    
    it("inherits from _base",function(){
        expect(student1 instanceof Student).toBeTruthy();
    });

    it("has an empty array as default .scores property when one not privides in parameters upon creation",function(){
        expect(Array.isArray(student1.scores)).toBeTruthy();
        expect(student1.scores.length).toBe(0);
    });
    
    it("has an empty array as default .distances property when one not privides in parameters upon creation",function(){
        expect(Array.isArray(student1.distances)).toBeTruthy();
        expect(student1.distances.length).toBe(0);
        
    })
    
    it(".techScore returns students tech score (sum of all parameters named in the convention q#)",function(){
        expect(student1.techScore).toBe(17);
    })

    it(".stats properly navigates Questions to return object of stats",function(){
        // new Question();

    })

    describe(".selfSort()", function(){
        it("should arrange objects in .scores array in order of lowest score first",function(){
            
        })
    })

    describe(".fullSort()",function(){
        it("should arrange all Student objects' .scores array in order of lowest score first",function(){

        })
    })

    describe(".creatFromJSON()",function(){
        it("properly creates Student objects from input JSON",function(){

        })

        it("properly assigns .scores property when one privided in parameters upon creation",function(){
            
        })

        it("properly assigns .distances property when one privided in parameters upon creation",function(){
            
        })
    })
})