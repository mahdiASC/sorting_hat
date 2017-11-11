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

//returns random element from array
// Array.prototype.random = function(){
//   return myRandom(this);
// }

//accepts random object input with decimal percentages(or counts) of probabilities as values
function randProb(obj){
  // {
  //   "first": 0.5,
  //   "second": 0.25,
  //   "third": 0.25
  // }

  // {
  //   "first": 10,
  //   "second": 5,
  //   "third": 5
  // }
  let temp = [];
  //Getting total to determine if probabilities or counts
  let keys = Object.keys(obj);
  for(let key of keys){
    if(typeof obj[key] != "number"){
      throw new TypeError(`Object value was not a number: ${obj[key]}`);
    }
    temp.push(obj[key]);
  }

  let sum = sumArray(temp);

  if(sum < 1){
      throw new RangeError(`Values totalled ${sum}, instead of 1 or more`);
  }else if(sum!=1){
    temp = temp.map(x=>x/sumArray(temp)); //will set counts to be proper probability
  }

  let pick = Math.random();
  let running_total = 0;
  for(let i = 0; i < keys.length; i++){
    running_total += temp[i];
    if(pick<= running_total){
      return keys[i];
    }
  }
  throw new Error("Something went wrong!");
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
// Array.prototype.sum = function(){
//   return sumArray(this);
// }

var avgArray = function(array){
  // returns average of array of numbers
  return sumArray(array)/array.length;
}

// Array.prototype.avg = function(){
//   return avgArray(this);
// }

var stdDevArray = function(array){
  // returns the std dev of an array of numbers
  var avg = avgArray(array);
  var sqDiffs = array.map(function(value){
    return Math.pow(value - avg,2);
  });
  var variance = avgArray(sqDiffs);
  return Math.sqrt(variance);
}

let z_score = function(x,mean, stdv){
  //x represents the value being assessed
  //mean is mean of the population
  //stdv is standard deviation from the mean
  return (x-mean)/stdv; //returns a number (+/-) representing how many standard deviations the value is from the mean
}

let calc_percentile = function(z_val){
  // returns the percentile 0 -> Z with an input of a z_score
  let val = String((z_val).toFixed(2));
  
  let re_first = new RegExp("([0-9].[0-9])");
  let first = re_first.exec(val)[1];

  let re_second = new RegExp("[0-9].[0-9]([0-9])");
  let second = `0.0${re_second.exec(val)[1]}`;
  
  let table = {"0.0":{"0.00":"0.0000","0.01":"0.0040","0.02":"0.0080","0.03":"0.0120","0.04":"0.0160","0.05":"0.0199","0.06":"0.0239","0.07":"0.0279","0.08":"0.0319","0.09":"0.0359"},"0.1":{"0.00":"0.0398","0.01":"0.0438","0.02":"0.0478","0.03":"0.0517","0.04":"0.0557","0.05":"0.0596","0.06":"0.0636","0.07":"0.0675","0.08":"0.0714","0.09":"0.0753"},"0.2":{"0.00":"0.0793","0.01":"0.0832","0.02":"0.0871","0.03":"0.0910","0.04":"0.0948","0.05":"0.0987","0.06":"0.1026","0.07":"0.1064","0.08":"0.1103","0.09":"0.1141"},"0.3":{"0.00":"0.1179","0.01":"0.1217","0.02":"0.1255","0.03":"0.1293","0.04":"0.1331","0.05":"0.1368","0.06":"0.1406","0.07":"0.1443","0.08":"0.1480","0.09":"0.1517"},"0.4":{"0.00":"0.1554","0.01":"0.1591","0.02":"0.1628","0.03":"0.1664","0.04":"0.1700","0.05":"0.1736","0.06":"0.1772","0.07":"0.1808","0.08":"0.1844","0.09":"0.1879"},"0.5":{"0.00":"0.1915","0.01":"0.1950","0.02":"0.1985","0.03":"0.2019","0.04":"0.2054","0.05":"0.2088","0.06":"0.2123","0.07":"0.2157","0.08":"0.2190","0.09":"0.2224"},"0.6":{"0.00":"0.2257","0.01":"0.2291","0.02":"0.2324","0.03":"0.2357","0.04":"0.2389","0.05":"0.2422","0.06":"0.2454","0.07":"0.2486","0.08":"0.2517","0.09":"0.2549"},"0.7":{"0.00":"0.2580","0.01":"0.2611","0.02":"0.2642","0.03":"0.2673","0.04":"0.2704","0.05":"0.2734","0.06":"0.2764","0.07":"0.2794","0.08":"0.2823","0.09":"0.2852"},"0.8":{"0.00":"0.2881","0.01":"0.2910","0.02":"0.2939","0.03":"0.2967","0.04":"0.2995","0.05":"0.3023","0.06":"0.3051","0.07":"0.3078","0.08":"0.3106","0.09":"0.3133"},"0.9":{"0.00":"0.3159","0.01":"0.3186","0.02":"0.3212","0.03":"0.3238","0.04":"0.3264","0.05":"0.3289","0.06":"0.3315","0.07":"0.3340","0.08":"0.3365","0.09":"0.3389"},"1.0":{"0.00":"0.3413","0.01":"0.3438","0.02":"0.3461","0.03":"0.3485","0.04":"0.3508","0.05":"0.3531","0.06":"0.3554","0.07":"0.3577","0.08":"0.3599","0.09":"0.3621"},"1.1":{"0.00":"0.3643","0.01":"0.3665","0.02":"0.3686","0.03":"0.3708","0.04":"0.3729","0.05":"0.3749","0.06":"0.3770","0.07":"0.3790","0.08":"0.3810","0.09":"0.3830"},"1.2":{"0.00":"0.3849","0.01":"0.3869","0.02":"0.3888","0.03":"0.3907","0.04":"0.3925","0.05":"0.3944","0.06":"0.3962","0.07":"0.3980","0.08":"0.3997","0.09":"0.4015"},"1.3":{"0.00":"0.4032","0.01":"0.4049","0.02":"0.4066","0.03":"0.4082","0.04":"0.4099","0.05":"0.4115","0.06":"0.4131","0.07":"0.4147","0.08":"0.4162","0.09":"0.4177"},"1.4":{"0.00":"0.4192","0.01":"0.4207","0.02":"0.4222","0.03":"0.4236","0.04":"0.4251","0.05":"0.4265","0.06":"0.4279","0.07":"0.4292","0.08":"0.4306","0.09":"0.4319"},"1.5":{"0.00":"0.4332","0.01":"0.4345","0.02":"0.4357","0.03":"0.4370","0.04":"0.4382","0.05":"0.4394","0.06":"0.4406","0.07":"0.4418","0.08":"0.4429","0.09":"0.4441"},"1.6":{"0.00":"0.4452","0.01":"0.4463","0.02":"0.4474","0.03":"0.4484","0.04":"0.4495","0.05":"0.4505","0.06":"0.4515","0.07":"0.4525","0.08":"0.4535","0.09":"0.4545"},"1.7":{"0.00":"0.4554","0.01":"0.4564","0.02":"0.4573","0.03":"0.4582","0.04":"0.4591","0.05":"0.4599","0.06":"0.4608","0.07":"0.4616","0.08":"0.4625","0.09":"0.4633"},"1.8":{"0.00":"0.4641","0.01":"0.4649","0.02":"0.4656","0.03":"0.4664","0.04":"0.4671","0.05":"0.4678","0.06":"0.4686","0.07":"0.4693","0.08":"0.4699","0.09":"0.4706"},"1.9":{"0.00":"0.4713","0.01":"0.4719","0.02":"0.4726","0.03":"0.4732","0.04":"0.4738","0.05":"0.4744","0.06":"0.4750","0.07":"0.4756","0.08":"0.4761","0.09":"0.4767"},"2.0":{"0.00":"0.4772","0.01":"0.4778","0.02":"0.4783","0.03":"0.4788","0.04":"0.4793","0.05":"0.4798","0.06":"0.4803","0.07":"0.4808","0.08":"0.4812","0.09":"0.4817"},"2.1":{"0.00":"0.4821","0.01":"0.4826","0.02":"0.4830","0.03":"0.4834","0.04":"0.4838","0.05":"0.4842","0.06":"0.4846","0.07":"0.4850","0.08":"0.4854","0.09":"0.4857"},"2.2":{"0.00":"0.4861","0.01":"0.4864","0.02":"0.4868","0.03":"0.4871","0.04":"0.4875","0.05":"0.4878","0.06":"0.4881","0.07":"0.4884","0.08":"0.4887","0.09":"0.4890"},"2.3":{"0.00":"0.4893","0.01":"0.4896","0.02":"0.4898","0.03":"0.4901","0.04":"0.4904","0.05":"0.4906","0.06":"0.4909","0.07":"0.4911","0.08":"0.4913","0.09":"0.4916"},"2.4":{"0.00":"0.4918","0.01":"0.4920","0.02":"0.4922","0.03":"0.4925","0.04":"0.4927","0.05":"0.4929","0.06":"0.4931","0.07":"0.4932","0.08":"0.4934","0.09":"0.4936"},"2.5":{"0.00":"0.4938","0.01":"0.4940","0.02":"0.4941","0.03":"0.4943","0.04":"0.4945","0.05":"0.4946","0.06":"0.4948","0.07":"0.4949","0.08":"0.4951","0.09":"0.4952"},"2.6":{"0.00":"0.4953","0.01":"0.4955","0.02":"0.4956","0.03":"0.4957","0.04":"0.4959","0.05":"0.4960","0.06":"0.4961","0.07":"0.4962","0.08":"0.4963","0.09":"0.4964"},"2.7":{"0.00":"0.4965","0.01":"0.4966","0.02":"0.4967","0.03":"0.4968","0.04":"0.4969","0.05":"0.4970","0.06":"0.4971","0.07":"0.4972","0.08":"0.4973","0.09":"0.4974"},"2.8":{"0.00":"0.4974","0.01":"0.4975","0.02":"0.4976","0.03":"0.4977","0.04":"0.4977","0.05":"0.4978","0.06":"0.4979","0.07":"0.4979","0.08":"0.4980","0.09":"0.4981"},"2.9":{"0.00":"0.4981","0.01":"0.4982","0.02":"0.4982","0.03":"0.4983","0.04":"0.4984","0.05":"0.4984","0.06":"0.4985","0.07":"0.4985","0.08":"0.4986","0.09":"0.4986"},"3.0":{"0.00":"0.4987","0.01":"0.4987","0.02":"0.4987","0.03":"0.4988","0.04":"0.4988","0.05":"0.4989","0.06":"0.4989","0.07":"0.4989","0.08":"0.4990","0.09":"0.4990"}};
  let return_val = Number(table[first][second]);
  if (z_val<0){
    return_val = -return_val;
  }
  return return_val + 0.5;
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


//JUST USE .include()
// Does a given array contain a item
// function contains(a, obj) {
//     var i = a.length;
//     while (i--) {
//         if (a[i] === obj) {
//             return true;
//         }
//     }
//     return false;
// };



// Array.prototype.flatten = () => {
//   var ret = [];
//   for(var i = 0; i < this.length; i++) {
//       if(Array.isArray(this[i])) {
//           ret = ret.concat(this[i].flatten());
//       } else {
//           ret.push(this[i]);
//       }
//   }
//   return ret;
// };

// Array.prototype.flatten = function() {
//   //adds flatten as an Array method (not a bang method)
    
// };

// Object.defineProperty(Array.prototype,"last",{get: function(){
//   return this[this.length-1];
// }});

// Object.defineProperty(Array.prototype,"first",{get: function(){
//   return this[0];
// }});

//return copy of array into a new array with same index and pointers to items
// Array.prototype.copy = function() {
//     return  this.map(x=>x);
// };

// Asynchronous loop
// https://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
function asyncLoop(iterations, func, callback) {
  var index = 0;
  var done = false;
  var loop = {
      next: function() {
          if (done) {
              return;
          }

          if (index < iterations) {
              index++;
              func(loop);

          } else {
              done = true;
              callback();
          }
      },

      iteration: function() {
          return index - 1;
      },

      break: function() {
          done = true;
          callback();
      }
  };
  loop.next();
  return loop;
}

// find duplicate elements of input array, returns array of duplicates
function findDuplicates(data) {
  
    let result = [];
  
    data.forEach(function(element, index) {
      
      // Find if there is a duplicate or not
      if (data.indexOf(element, index + 1) > -1) {
        
        // Find if the element is already in the result array or not
        if (result.indexOf(element) === -1) {
          result.push(element);
        }
      }
    });
  
    return result;
  }

// Export node module.
if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
{
    module.exports = capFirst;
}