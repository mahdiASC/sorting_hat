var myRandom = function(min, max){
	//with no arguments, returns myRandom decimal b/t 0 and 1 (exclusive)
	// with 1 argument, return myRandom integer b/t 0 and min (exclusive)
	// with 2 arguments, returns myRandom integer b/w min and max (exclusive)
	// with 1 Array argument, returns a myRandom item in the array
    if(Array.isArray(min)){
		return min[Math.floor(Math.random()*min.length)];
	}else if(max){
		return Math.floor(Math.random()*(max-min))+min;
	}else if(min){
		return Math.floor(Math.random()*min);
	}else{
		return Math.random();
	}
}

var capFirst = function(string, flag = false, split = " "){
	//with 1 string argument, returns a string with first letter capitalized
	//with flag = true, will return string of all first letters after string splitting using split
	if (flag){
		var temp = string.split(split);
		var output = [];
		for(var i in temp){
			output.push(capFirst(temp[i]));
		}
		return output.join(split);
	}else{
		return string[0].toUpperCase() + string.slice(1);
	}
}

var randWord = function(){
  //returns a string of randomly generated letters of myRandom length
  var output = ""
  var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  var length = normRand(8,5);
  while(length>0){
    output = output + myRandom(letters);
    length--;
  }
  return output
}

var randName = function(num = 1){
  var output = [];
  var count = num;
  var cons = "bcdfghjklmnpqrstvwxyz";
  var vowels = "aeiou";
  var temp,counter;
  while (count>0){
    temp="";
    if(myRandom()>.5){
      temp = temp + myRandom(vowels.split(""));
    }
    if(count!=1||num==1){
      counter = myRandom()>.75 ? 2 : 1;
    }else{
      counter = normRand(2,1);
    }
    while(counter>0){
      temp = temp + myRandom(cons.split(""));
      temp = temp + myRandom(vowels.split(""));
      counter--;
    }
    if (temp.length<3){
      temp = temp + myRandom(cons.split(""));
    }else{
      if(myRandom()>.5){
        temp = temp + myRandom(cons.split(""));
      }    
    }
    count--;
    output.push(capFirst(temp));
  }
  output = output.join(" ");
  var temp = ""
  for (var i in output){
    if(output[i].toLowerCase()=="q" && output[Number(i)+1]!="u"){
      temp = temp+output[i]+"u";
    }else{
      temp = temp+output[i];
    }
  }
  return temp;
}

let randPhone = () => {
    let outcome = "";
    for (let i = 0; i < 10 ; i ++){
        if (outcome.length==3 || outcome.length==7){
            outcome+='-';
        }
        outcome += myRandom(1,10);
    }
    return outcome;
}

var randSentence = function(){
  //returns a string of randomly generated words of a myRandom length
  var output = [];
  var length = normRand(10,5);
  while(length>0){
    output.push(randWord());
    length--;
  }
  return capFirst(output.join(" ")+".");
}

var randParagraph = function(){
  var output = [];
  var length = normRand(10,5);
  while(length>0){
    output.push(randSentence());
    length--;
  }
  return output.join(" ")  
}

var randEssay = function(){
   var output = [];
  var length = normRand(5,2);
  while(length>0){
    output.push(randParagraph());
    length--; 
  }
  return output.join("\n") 
}

var sortNumber = function(a,b) {
    return a - b;
}

//array.sort(sortNumber);
var sumArray = function(array){
  // returns sum of array of numbers
  return array.reduce(function(sum, value){
    return sum + value;
  }, 0);
}

var avgArray = function(array){
  // returns average of array of numbers
  return sumArray(array)/array.length;
}

var stdDev = function(array){
  // returns the std dev of an array of numbers
  var avg = avgArray(array);
  var sqDiffs = array.map(function(value){
    return Math.pow(value - avg,2);
  });
  var avgSq = avgArray(sqDiffs);
  return Math.sqrt(avgSq);
}

var normRand = function(mean, std){
  // returns a myRandom number from a normal distribution
  // num is the mean of the distribution
	var val;
	do
	{
		val = randn_bm();
	} while(val < -1 || val > 1);
	return Math.round(val*std+mean);
}

function randn_bm() {
  // generates a normal distribution decimal w/mean of 0, std = 1
  var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
  var v = 1 - Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// Return a string only containing the letters a to z and numbers
function onlyLettersNums(str) {
    return str.toLowerCase().replace(/[^a-z,0-9,-]/g, "");
};

// Removes an item from a given array
function removeArrayItem(arr, item) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] == item) {
            arr.splice(i, 1);
        } else {
            i++;
        }
    }
};


// Does a given array contain a item
function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};


Array.prototype.flatten = function() {
  //adds flatten as an Array method (not a bang method)
    var ret = [];
    for(var i = 0; i < this.length; i++) {
        if(Array.isArray(this[i])) {
            ret = ret.concat(this[i].flatten());
        } else {
            ret.push(this[i]);
        }
    }
    return ret;
};