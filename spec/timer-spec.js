describe("Timer", function(){
    let easy_Timer;
    beforeEach(function(){
        easy_Timer = new Timer(4);
    })

    it("should have a .total_count",function(){
        expect(easy_Timer.total_count).toBeDefined();
    });

    it("should have a .total_count equal to parameter input",function(){
        expect(easy_Timer.total_count).toBe(4);
    });

    
    it("should have a .current",function(){
        expect(easy_Timer.current).toBeDefined();
    });

    it("should have a .current equal to 0 by default",function(){
        expect(easy_Timer.current).toBe(0);
    });

    describe("update()",function(){
        it("should increase .current by parameter", function(){
            easy_Timer.update(1);
            expect(easy_Timer.current).toBe(1);
        });

        it("should call .addStudentDownload() if .current is more than or equal to .total_count", function(){
            spyOn(easy_Timer,'addStudentDownload');
            easy_Timer.current = 100;
            easy_Timer.total_count = 100;
            easy_Timer.update(1);
            expect(easy_Timer.addStudentDownload).toHaveBeenCalled();
        });
    });
});