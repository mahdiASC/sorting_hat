describe("Priority",function(){
    let func;
    let test_priority
    beforeEach(function(){
        delete Priority.all;
        func = jasmine.createSpy('mySpy');
        test_priority = new Priority("Something", func);
    })
    
    it('should have an .all class property that is an array of all created Priority object',function(){
        expect(Array.isArray(Priority.all)).toBeTruthy();
    });

    it('Priority.find_by_name should return Priority object with given name',function(){        
        expect(Priority.find_by_name("Something")).toEqual(test_priority);
    });

    it(".call_func should call on the callback function", function(){
        test_priority.call_func();
        expect(func).toHaveBeenCalled();
    });
})