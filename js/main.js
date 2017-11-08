// let max_seconds = max_travel_time *3600;
let max_seconds = 1936026; //OMIT THIS (just for testing)
let priority_list = priorities.map(x => Priority.find_by_name(x));

var store_file = function (file, func) {
    //helper method for making ajax request on local files
    let re = new RegExp(".csv");
    let _type = re.exec(file) ? "text" : "json";
    $.get({
        url: file,
        async: false,
        dataType: _type,
        success: func
    });
}

let x,y;
function startSort() {
    x = new Sort;
    y = new Statistic;
    y.visualize_stats();
}
