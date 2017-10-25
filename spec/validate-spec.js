let validate = require("../js/validate.js");

describe("validate", ()=>{
    let myValidate,student1,student2,student3,cohort1,cohort2;
    
    beforeEach(()=>{
        student1 = {"cohort": "cohort1"};
        student2 = {"cohort": "cohort1"};
        student3 = {"cohort": "cohort2"};

        cohort1 = {
            "name":"cohort1",
            "class":[student1,student2]
        }
        cohort2 = {
            "name":"cohort2",
            "class":[student3]
        }
        
        myValidate = new validate(
            [cohort1,cohort2],
            [student1,student2,student3]
        );
    });
    
    it('should have .cohorts defined',()=>{
        expect(myValidate.cohorts).toBeDefined();
    });

    it('should store value of Cohort.all in .cohorts',()=>{
        expect(myValidate.cohorts).toEqual([cohort1,cohort2]);
    });

    describe("dupStudentsCheck",()=>{
        it("should return false if no duplicate students",()=>{
            expect(myValidate.dupStudentsCheck()).toBeFalsy();
        })

        it("should return true if duplicate students exist",()=>{
            cohort1 = {
                "name":"cohort1",
                "class":[student1,student2]
            }
            cohort2 = {
                "name":"cohort2",
                "class":[student3,student1]
            }
            
            let tempVal = new validate(
                [cohort1,cohort2],
                [student1,student2,student3]
            );
            expect(tempVal.dupStudentsCheck()).toBeTruthy();
        })
    })

    describe("getDups",()=>{
        it("should return empty array when no duplicate students",()=>{
            expect(myValidate.getDups()).toEqual([]);
        })

        it("should return array of duplicate students",()=>{
            cohort1 = {
                "name":"cohort1",
                "class":[student1,student2]
            }
            cohort2 = {
                "name":"cohort2",
                "class":[student3,student1]
            }
            
            let tempVal = new validate(
                [cohort1,cohort2],
                [student1,student2,student3]
            );

            expect(tempVal.getDups()).toEqual([student1]);
        })
        it("",()=>{
            
        })
    })
});
