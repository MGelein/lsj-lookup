/**
 * Max amounts of results returned by the server
 */
var limit = 50;
/**
 * Entry point for the code
 */
$(document).ready(function(){
    //Prevent chacing for this website
    $.ajaxSetup({cache:false});
});

/**
 * Passes the query on to the server for processing
 * @param {String} query 
 */
function search(query){
    //Make sure no illegal chracters are in there
    query = query.replace(/\s/g, '');
    //Send the query to the server
    $.get("search.php?q=" + query + "&l=" + limit, function(response){
        console.log(response);
    });
}