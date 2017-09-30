let p;

function newStudent(){
    p = [];
    p.push(randName(2));
    p.push(randName()+"@gmail.com");
    p.push(randPhone());
    p.push(randName(2));
    p.push(randName()+"@gmail.com");
    p.push(randPhone());
    p.push(Math.random()>.5 ? 11 : 10);
    p.push(myRandom(["CTE","public","private","charter"]));
    p.push(Math.random()>.5 ? "yes" : "no");
    p.push(myRandom(10));
    p.push(myRandom(10));
    p.push(myRandom(10));
    p.push(myRandom(10));
    p.push(myRandom(10));
    p.push(myRandom(["c1","c2","c3","c4"]));
    p.push(myRandom(["c1","c2"]));
    p.push(myRandom(["c1","c2","c3","c4"]));
    p.push(myRandom(["c1","c2"]));
    return p.join(",");
}

function newCohort(){
    let p =[];
    p.push(randName());
    p.push(myRandom(15,25));
    p.push(myRandom(1,10));
    p.push(myRandom(1,10));
    p.push(myRandom(1,10));
    p.push(myRandom(1,10));
    return p.join(",");
}

function setup(){
    noCanvas();
    for (let i = 0; i < 20 ; i ++){
        // createP(newStudent());
        createP(newCohort());
    }
}

function draw(){

}