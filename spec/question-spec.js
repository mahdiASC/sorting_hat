let question = require("../js/question.js");

describe('Question',()=>{
    let testQ;
    beforeEach(()=>{
        let data = {
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
        testQ = new question(data);
    })

    afterEach(()=>{
        delete question.all;
    });

    it('should extend from _base',()=>{
        expect(testQ instanceof question).toBeTruthy();
        expect(testQ instanceof _base).toBeTruthy();
    });
    
    it('',()=>{
        
    });
    it('',()=>{
        
    });

    describe('.outcome()',()=>{
        it('',()=>{
            
        });
        it('',()=>{
            
        });
        it('',()=>{
            
        });
    })
    describe('.first()',()=>{
        it('',()=>{
            
        });
        it('',()=>{
            
        });
        it('',()=>{
            
        });
    })
    describe('.next()',()=>{
        it('',()=>{
            
        });
        it('',()=>{
            
        });
        it('',()=>{
            
        });
    })
    describe('.rootq()',()=>{
        it('',()=>{

        });        
        it('',()=>{

        });        
        it('',()=>{

        });        
    })
    describe('.find()',()=>{
        it('',()=>{

        });
        it('',()=>{

        });
    })
    describe('.createFromJSON()',()=>{
        
        it('',()=>{

        });
        it('',()=>{

        });
        it('',()=>{

        });
    })
})