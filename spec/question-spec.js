describe('Question',()=>{
    let data_small_obj = {
        "id":1,
        "text": "test Question",
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
    
    beforeEach(function(){
        delete Question.all;
    });

    describe('constructor()',()=>{
        it('should create .all class property as an array of newly made objects',()=>{
           expect(Question.all).toBeUndefined();
           let small_data = new Question(data_small_obj);
           expect(Array.isArray(Question.all)).toBeTruthy();
           expect(Question.all[0]).toBe(small_data);
        });
    
        it('should create subQuestions',()=>{
            let data_large = new Question(data_large_obj);
            expect(Question.all.length).toBe(5);
        });
    
        it('should set subQuestion .parent as main Question id',()=>{
            let data_large = new Question(data_large_obj);
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
            let data_small = new Question(data_small_obj);
            expect(data_small.outcome('c1')).toEqual({
                "trait1": 2,
                "trait2": 1
            });
        });
    })

    describe('.first()',()=>{
        it('returns first Question with id==1',()=>{
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
            let data_small = new Question(data_small_obj);
            let data_small_second = new Question(data_small_second_obj);

            expect(Question.first()).toEqual(data_small);
        });
    })
    
    describe('.next()',()=>{
        let data_large;
        let data_small_next_obj;
        let data_small_next;
        let sub_q1;
        let sub_q2;
        beforeEach(()=>{
            data_large = new Question(data_large_obj);
            data_small_next_obj = {
                "id":2,
                "text": "test Question",
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
            data_small_next = new Question(data_small_next_obj);
            sub_q1 = new Question(sub_q1_obj);
            sub_q2 = new Question(sub_q2_obj);
            sub_q1.parent = 1;
            sub_q2.parent = 1;
        });

        it('should properly return the next subQuestion based on choice',()=>{
            expect(Question.next(data_large,'c1').text).toBe("SubQuestion1.1?");
            expect(Question.next(data_large,'c2').text).toBe("SubQuestion1.2?");
        });

        it('should properly return the next main Question once a subQuestion is answered',()=>{
            expect(Question.next(sub_q1,'c1').text).toBe('test Question');
            expect(Question.next(sub_q1,'c2').text).toBe('test Question');
            expect(Question.next(sub_q2,'c1').text).toBe('test Question');
            expect(Question.next(sub_q2,'c2').text).toBe('test Question');
        });
        
        it('should properly return undefined if there is no next main Question',()=>{
            expect(Question.next(data_small_next_obj)).toBeUndefined();
        });
    })
    describe('.rootq()',()=>{
        it('returns the .parent Question',()=>{
            let data_small = new Question(data_small_obj);
            let sub_q2 = new Question(sub_q2_obj);
            sub_q2.parent = 1;
            expect(Question.rootq(sub_q2)).toBe(data_small);
        });        
    })
    describe('.find()',()=>{
        it('returns the Question with and .id of a given number',()=>{
            let data_small = new Question(data_small_obj);
            expect(Question.find(1)).toBe(data_small);
        });
    })
    describe('.createFromJSON()',()=>{
        it('should properly create a Question object from JSON input',()=>{
            let json_data = {
                "0": data_small_obj
            };
            let json_q = Question.createFromJSON(json_data);
            expect(json_q instanceof Question).toBeTruthy();
        });
        
        it('should properly return array of Question objects from a JSON with multiple objects',()=>{
            let huge_data = {
                "0":{
                    "id": 1,
                    "text": "Question1?",
                    "answers": [
                        {
                            "text": "c1",
                            "outcome": {
                                "trait1": 2,
                                "trait2": 1
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c2",
                            "outcome": {
                                "trait1": 1,
                                "trait2": 2
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c3",
                            "outcome": {
                                "trait3": 2,
                                "trait4": 1
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c4",
                            "outcome": {
                                "trait4": 2,
                                "trait3": 1
                            },
                            "sub_q": {
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
                        }
                    ]
                },
                "1":{
                    "id": 2,
                    "text": "Question2?",
                    "answers": [
                        {
                            "text": "c1",
                            "outcome": {
                                "trait1": 2,
                                "trait2": 1
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c2",
                            "outcome": {
                                "trait1": 1,
                                "trait2": 2
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c3",
                            "outcome": {
                                "trait3": 2,
                                "trait4": 1
                            },
                            "sub_q": {
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
                        },
                        {
                            "text": "c4",
                            "outcome": {
                                "trait4": 2,
                                "trait3": 1
                            },
                            "sub_q": {
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
                        }
                    ]
                }
            }

            let huge_q = Question.createFromJSON(huge_data);
            expect(Array.isArray(huge_q)).toBeTruthy();
            expect(huge_q.length).toEqual(2);
        });
    })
})