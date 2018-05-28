/**
 * Max amounts of results returned by the server
 */
var LIMIT = 20;
/**Contains the HTML for a single result entry */
var RESULT_TEMPLATE = "";
/**
 * Entry point for the code
 */
$(document).ready(function(){
    //Prevent chacing for this website
    $.ajaxSetup({cache:false});

    //Load the result template
    $.get('templates/result.html', function(data){
        RESULT_TEMPLATE = data;
    });
});

/**
 * Passes the query on to the server for processing
 * @param {String} query 
 */
function search(query, limit){
    //If limit is not defined, use the global LIMIT
    if(!limit) limit = LIMIT;
    //Make sure no illegal chracters are in there
    query = query.replace(/\s/g, '');
    //Send the query to the server
    $.get("search.php?q=" + query + "&l=" + limit, function(data){
       let lines = data.split("\n");
       let results = [];
       for(var i = 0; i < lines.length; i++){
           let parts = lines[i].split("#");
           //Ignore empty lines
           if(parts.length < 4) continue;
           //Add new result
           results.push({
                id: parts[0],
                lemma: parts[2],
                lemmaASCII: parts[1],
                desc: parts[3]
           });
           //Now shows the results
           showResults(results);
       };
       console.log(results);
    });
}

/**
 * Shows the provided results array
 * @param {Array} results 
 */
function showResults(results){
    //Go through every result and add it to the div
    var lines = [];
    $.each(results, function(index, result){
        let rTemp = RESULT_TEMPLATE.replace(/%LEMMA%/g, result.lemma);
        rTemp = rTemp.replace(/%DESC%/g, result.desc);
        lines.push(rTemp);
    });

    //Now finally update the DOM
    $('#resultHolder').html(lines.join());
}