describe("Student",function(){
    let student1;

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
        let data_small_obj = {
            "id":1,
            "text": "test question",
            "answers": [
                {
                    "text": "c1",
                    "outcome": {
                        "trait1": 2,
                        "trait2": 1
                    }
                },
                {
                    "text": "c2",
                    "outcome": {
                        "trait1": 1,
                        "trait2": 2
                    }
                }
            ]
        }
        new Question(data_small_obj);
        expect(student1.stats).toEqual({
            "trait1":1,
            "trait2":2
        })
    })

    describe(".selfSort()", function(){
        it("should arrange objects in .scores array in order of lowest score first",function(){
            let cohort1 = {
                "cohort":"cohort1",
                "score": 10
            }
            let cohort2 = {
                "cohort":"cohort2",
                "score": 5
            }
            student1.scores = [cohort1,cohort2];
            student1.selfSort();
            expect(student1.scores[0]).toBe(cohort2);
            expect(student1.scores[1]).toBe(cohort1);
        })
    })

    describe(".fullSort()",function(){
        it("should arrange all Student objects' .scores array in order of lowest score first",function(){
            let cohort1 = {
                "cohort":"cohort1",
                "score": 10
            }
            let cohort2 = {
                "cohort":"cohort2",
                "score": 5
            }
            let cohort3 = {
                "cohort":"cohort2",
                "score": 1
            }
            let student2 = new Student();
            student1.scores = [cohort1,cohort2];
            student2.scores = [cohort2,cohort3];
            Student.fullSort();
            expect(student1.scores[0]).toBe(cohort2);
            expect(student1.scores[1]).toBe(cohort1);
            expect(student2.scores[0]).toBe(cohort3);
            expect(student2.scores[1]).toBe(cohort2);
        })
    })

    describe(".creatFromJSON()",function(){
        let student_obj = {"name":"Ovogeb Isesin","email":"Xak@gmail.com","address":"1945 Grand Pheasant Lane Lincoln, CA 95648-0000","phone":"681-344-1856","parent_name":"Seb Anehi","parent_email":"Vun@gmail.com","parent_phone":"284-593-4353","ethnicity":"Hispanic/Latino","gpa":"68","grade":"10","school_type":"public","prev_cs":"yes","q1":"1","q2":"3","q3":"3","q4":"7","q5":"3","s1":"c2","s2":"c1","s3":"c1","s4":"c1","scores":[{"cohort":"Ofum","score":40},{"cohort":"Kim","score":69}],"distances":[{"cohort":"Kim","distance":3143578},{"cohort":"Ofum","distance":4399376}],"_s":{"trait1":6,"trait2":6,"trait3":0,"trait4":0}}
        it("properly creates Student objects from input JSON",function(){
        })
        let json_student;
        beforeEach(function(){
            delete Student.all;
            json_student = Student.createFromJSON([student_obj]);
        })
        
        it("properly creates and returns array of Student objects from array of JSON input",function(){
            expect(Student.all.length).toBe(1);
            expect(Array.isArray(json_student)).toBeTruthy();
            expect(json_student.every(x=>x instanceof Student)).toBeTruthy();
        });

        it("properly assigns .scores property when one privided in parameters upon creation",function(){
            expect(json_student[0].scores.length).toBe(2);
        });

        it("properly assigns .distances property when one privided in parameters upon creation",function(){
            expect(json_student[0].distances.length).toBe(2);
        });
    })
})
