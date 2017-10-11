let fs = require("fs"); //filesystem
// let Papa = require("./papaparse.js");

// //Checking files for students location
// fs.readdir(".", (err, files) => {
//     if(!files.includes("studentsL.csv")){
//         addLocations();
//     }else{
//         console.log("Fi: 'studentsL.csv' already exists")//     },
// })
// let x;

// function addLocations(){
//     fs.readFile('students.csv','utf8',  (err, data) => {
//         if (err) throw err;
//         parseData(data);
//       });
// }

// function parseData(data){
//     // splitting by new line
//     let splits=data.split("\r\n");
//     // finding location

//     // looping through each location and adding to end of string
//     // also pinging API for location distance
// }

student = {
  address:"348 Cruisers Dr Polk City, FL 33868-5127",
  email:"Ado@gmail.com",
  grade:"10",
  name:"Ufene Ber",
  parent_email:"Jas@gmail.com",
  parent_name:"Non Padus",
  parent_phone:"753-469-9164",
  phone:"154-682-1159",
  prev_cs:"no",
  q1:"5",
  q2:"2",
  q3:"3",
  q4:"1",
  q5:"1",
  s1:"c1",
  s2:"c2",
  s3:"c4",
  s4:"c2",
  school_type:"charter",
  scores:[]
}

fs.writeFile("students.json",JSON.stringify([student,student,student]), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});