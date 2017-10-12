let p;
let locations = [
    "348 Cruisers Dr Polk City, FL 33868-5127",
    "8325 Broadway St 202-66 Pearland, TX 77581-5772",
    "100 S Main St Southampton, NY 11968-4804",
    "349 Rte 31 Flemington, NJ 08822-5777",
    "1016 Clemmons St Jupiter, FL 33477-3305",
    "1218 7th Ave E Bradenton, FL 34208-2197",
    "112 Kehl St Connersville, IN 47331-3339",
    "78 Spring Ln Hackettstown, NJ 07840-5644",
    "120 Aurora St Stockton, CA 95202-3127",
    "2507 Edgecliff Dr Farmington, NM 87402-4523",
    "425 Roslyn Rd Roslyn Hts, NY 11577-2620",
    "800 Main St La Crosse, WI 54601-4122",
    "49 Johns Valley Dr Fishersville, VA 22939-2049",
    "1402 Enid St # B Muldrow, OK 74948-4002",
    "9 Evans Ln Cherry Hill, NJ 08003-1805",
    "95 Rowland Way Novato, CA 94945-5001",
    "201 S Santa Fe Ave Los Angeles, CA 90012-4338",
    "933 Main St Alexandria, LA 71301-8322",
    "327 Quaker Mtg Hse Rd East Sandwich, MA 02537-1300",
    "990 S Milledge Ave Athens, GA 30605-1334",
    "10210 Genetic Center Dr San Diego, CA 92121-4362",
    "2361 Nw 33rd St Oakland Park, FL 33309-6447",
    "35 Highland Ave Malden, MA 02148-6630",
    "2126 Wilshire Dr Enid, OK 73703-6622",
    "661 Main St Unit C Falmouth, MA 02540-3299",
    "2837 Glade Aster Ct Raleigh, NC 27604-5468",
    "1937 Jackson St Alexandria, LA 71301-6438",
    "121 Plain St Taunton, MA 02780-4970",
    "1401 Genesee St Utica, NY 13501-4343",
    "1722 Easterling St Prichard, AL 36610-3102",
    "20 N Silver St Mt Pleasant, PA 15666-1506",
    "10707 Corporate Dr Stafford, TX 77477-4001",
    "01 S Weber St Colorado Springs, CO 80903-2156",
    "2401 Silver Holly Ln Richardson, TX 75082-4209",
    "Mech And Aero Engr Dept Rolla, MO 65409-0001",
    "213 Elmwood Dr Colorado Spgs, CO 80907-4355",
    "1945 Grand Pheasant Lane Lincoln, CA 95648-0000",
    "727 E 11th St Chattanooga, TN 37403-3104",
    "817 Kuhlman Rd Houston, TX 77024-3105",
    "33504 Shorewood Dr Avon, MN 56310-8506",
    "340 W 85th St New York, NY 10024-6265"
];

let ethnicities = [
    'African American',
    'African',
    'Caribbean',
    'West Indian',
    'Hispanic/Latino',
    'White',
    'Native American',
    'Middle Eastern',
    'East Asian',
    'South Asian',
    'Southeast Asian'
];

function newStudent(){
    p = [];
    p.push(randName(2));
    p.push(randName()+"@gmail.com");
    p.push(myRandom(locations));
    p.push(randPhone());
    p.push(randName(2));
    p.push(randName()+"@gmail.com");
    p.push(randPhone());
    p.push(myRandom(ethnicities));
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
    return p.join("+");
}

function newCohort(){
    let p =[];
    p.push(randName());
    p.push(myRandom(15,25));
    p.push(myRandom(locations));
    p.push(myRandom(1,8));
    p.push(myRandom(1,8));
    p.push(myRandom(1,8));
    p.push(myRandom(1,8));
    return p.join("+");
}

function setup(){
    noCanvas();
    for (let i = 0; i < 1 ; i ++){
        createP(newCohort());
    }
    for (let i = 0; i < 30 ; i ++){
        createP(newStudent());
    }
}