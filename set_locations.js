let fs = require("fs"); //filesystem
// let Papa = require("./papaparse.js");

// //Checking files for students location
// fs.readdir(".", (err, files) => {
//     if(!files.includes("studentsL.csv")){
//         addLocations();
//     }else{
//         console.log("File: 'studentsL.csv' already exists");
//     }
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



fs.writeFile(JSON.stringify(data), 'students.json', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });