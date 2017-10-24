var timer = require("../js/timer.js");

describe("timer", function(){
    let easy_timer;
    beforeEach(function(){
        easy_timer = new timer(4);
    })

    it("should have a .total_count",function(){
        expect(easy_timer.total_count).toBeDefined();
    });

    it("should have a .total_count equal to parameter input",function(){
        expect(easy_timer.total_count).toBe(4);
    });

    
    it("should have a .current",function(){
        expect(easy_timer.current).toBeDefined();
    });

    it("should have a .current equal to 0 by default",function(){
        expect(easy_timer.current).toBe(0);
    });

    describe("update()",function(){
        it("should increase .current by parameter", function(){
            easy_timer.update(1);
            expect(easy_timer.current).toBe(1);
        });

        it("should call .addStudentDownload() if .current is more than or equal to .total_count", function(){
            spyOn(easy_timer,'addStudentDownload');
            easy_timer.current = 100;
            easy_timer.total_count = 100;
            easy_timer.update(1);
            expect(easy_timer.addStudentDownload).toHaveBeenCalled();
        });
    });
});