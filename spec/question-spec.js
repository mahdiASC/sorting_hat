let question = require("../js/question.js");
describe('Question',()=>{
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
    let sub_q1_obj = {
        "text": "SubQuestion1.1?",
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
    let sub_q2_obj = {
        "text": "SubQuestion1.2?",
        "answers": [
            {
                "text": "c1",
                "outcome": {
                    "trait1": 1,
                    "trait2": 2
                }
            },
            {
                "text": "c2",
                "outcome": {
                    "trait1": 2,
                    "trait2": 1
                }
            }
        ]
    }
    let sub_q3_obj = {
        "text": "SubQuestion1.3?",
        "answers": [
            {
                "text": "c1",
                "outcome": {
                    "trait3": 2,
                    "trait4": 1
                }
            },
            {
                "text": "c2",
                "outcome": {
                    "trait4": 1,
                    "trait3": 2
                }
            }
        ]
    }
    let sub_q4_obj = {
        "text": "SubQuestion1.4?",
        "answers": [
            {
                "text": "c1",
                "outcome": {
                    "trait4": 2,
                    "trait3": 1
                }
            },
            {
                "text": "c2",
                "outcome": {
                    "trait3": 1,
                    "trait4": 2
                }
            }
        ]
    }
    let data_large_obj = {
        "id": 1,
        "text": "Question1?",
        "answers": [
            {
                "text": "c1",
                "outcome": {
                    "trait1": 2,
                    "trait2": 1
                },
                "sub_q": sub_q1_obj
            },
            {
                "text": "c2",
                "outcome": {
                    "trait1": 1,
                    "trait2": 2
                },
                "sub_q": sub_q2_obj
            },
            {
                "text": "c3",
                "outcome": {
                    "trait3": 2,
                    "trait4": 1
                },
                "sub_q": sub_q3_obj
            },
            {
                "text": "c4",
                "outcome": {
                    "trait4": 2,
                    "trait3": 1
                },
                "sub_q": sub_q4_obj
            }
        ]
    }
    
    beforeEach(()=>{
        delete question.all;
    });

    describe('constructor()',()=>{
        it('should create .all class property as an array of newly made objects',()=>{
           expect(question.all).toBeUndefined();
           let small_data = new question(data_small_obj);
           expect(question.all).toBeDefined();
           expect(question.all[0]).toBe(small_data);
        });
    
        it('should create subquestions',()=>{
            let data_large = new question(data_large_obj);
            expect(question.all.length).toBe(5);
        });
    
        it('should set subquestion .parent as main question id',()=>{
            let data_large = new question(data_large_obj);
            let num = data_large.id;
            expect(data_large.answers.every(x=>{
                if(x.sub_q){
                    return x.sub_q.parent==num;
                }else{
                    return false;
                }
            })).toBeTruthy();
        });
    })

    describe('.outcome()',()=>{
        it('given a choice string as input, will return object traits outcome',()=>{
            let data_small = new question(data_small_obj);
            expect(data_small.outcome('c1')).toEqual({
                "trait1": 2,
                "trait2": 1
            });
        });
    })

    describe('.first()',()=>{
        it('returns first question with id==1',()=>{
            let data_small_second_obj = {
                "id":2,
                "text": "blah",
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
            let data_small = new question(data_small_obj);
            let data_small_second = new question(data_small_second_obj);

            expect(question.first()).toEqual(data_small);
        });
    })
    
    describe('.next()',()=>{
        let data_large;
        let data_small_next_obj;
        let data_small_next;
        let sub_q1;
        let sub_q2;
        beforeEach(()=>{
            data_large = new question(data_large_obj);
            data_small_next_obj = {
                "id":2,
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
            data_small_next = new question(data_small_next_obj);
            sub_q1 = new question(sub_q1_obj);
            sub_q2 = new question(sub_q2_obj);
            sub_q1.parent = 1;
            sub_q2.parent = 1;
        });

        it('should properly return the next subquestion based on choice',()=>{
            expect(question.next(data_large,'c1').text).toBe("SubQuestion1.1?");
            expect(question.next(data_large,'c2').text).toBe("SubQuestion1.2?");
        });

        it('should properly return the next main question once a subquestion is answered',()=>{
            expect(question.next(sub_q1,'c1').text).toBe('test question');
            expect(question.next(sub_q1,'c2').text).toBe('test question');
            expect(question.next(sub_q2,'c1').text).toBe('test question');
            expect(question.next(sub_q2,'c2').text).toBe('test question');
        });
        
        it('should properly return undefined if there is no next main question',()=>{
            expect(question.next(data_small_next_obj)).toBeUndefined();
        });
    })
    describe('.rootq()',()=>{
        let sub_q1 = new question(sub_q1_obj);
        let sub_q2 = new question(sub_q2_obj);
        sub_q2.parent = 1;
        it('returns the .parent question',()=>{
            expect(sub_q1)

        });        
    })
    describe('.find()',()=>{
        it('',()=>{

        });
    })
    describe('.createFromJSON()',()=>{
        it('should properly create a Question object from one JSON',()=>{

        });
        
        it('should properly create multiple Question objects from a JSON with multiple objects',()=>{
            
        });
    })
})