describe('_base',()=>{
    afterEach(()=>{
        delete _base.all;
    })

    it('should create .all class property',()=>{
        expect(_base.all).toBeUndefined();
        let testBase = new _base;
        expect(_base.all).toBeDefined();
    })

    it('should add newly created object to .all',()=>{
        let testBase = new _base;
        expect(_base.all[0]).toBe(testBase);
    })

    it('should keep previously created object in .all class property on object construction',()=>{
        let testBase1 = new _base;
        let testBase2 = new _base;
        expect(_base.all.includes(testBase1)).toBeTruthy();
    })

    it('should create .all class property for  inherited constructors of object as emptry array',()=>{
        class TestClass extends _base{}
        let testBase = new TestClass;
        expect(TestClass.all[0]).toBe(testBase);
        expect(_base.all).toBeUndefined();
    })

    it('should take an object parameter for object construction and allocate the same key:value pairs to the object',()=>{
        let params = {
            "something":'is',
            "amazing":"up",
            "in":"here"
        }
        let testBase = new _base(params);
        expect(testBase.something).toEqual(params.something);
        expect(testBase.amazing).toEqual(params.amazing);
        expect(testBase.in).toEqual(params.in);
    })

    //can't test createFromCSVString
})