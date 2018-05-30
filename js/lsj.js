/**
 * Max amounts of results returned by the server
 */
var LIMIT = 20;
/**Contains the HTML for a single result entry */
var RESULT_TEMPLATE = "";

/**By default disable cookies untill explicit consent has been given */
var ALLOW_COOKIES = false;

//If we're currently limiting our results to only the lemmata
const LIMIT_LEMMATA = '<i class="fas fa-check"></i>&nbsp;Search only for lemmata';
const NO_LIMIT_LEMMATA = '<i class="fas fa-times"></i>&nbsp;Search in complete body';
const NO_RESULTS = "<div class='text-center'><h1 class='text-center'>In all the time we spent searching for your query we came up empty handed...</h1>"
+ '<i class="far fa-frown fa-4x"></i>'
+ "<h4 class='text-center'>You might want to try a different query</h4></div>";

/**Contains the spinner for when we're searching */
const SPINNER = '<i class="fas fa-sync-alt fa-2x"></i>';
/**Contains the search icon for when we're not searching */
const SEARCH = '<i class="fas fa-search fa-2x"></i>';
/**The last timestamp we've applied */
var TIME_STAMP = 0;
/**Number to see if we just pressed a key, we need 500ms of silence before we continue */
var JUST_PRESSED = 0
/**The previous search value, don;t update if it is still the same */
var prevSearch = "";

/**
 * Entry point for the code
 */
$(document).ready(function () {
    //Prevent chacing for this website
    $.ajaxSetup({ cache: false });

    //Start to prepare the conversion data
    initConversion();

    //Load the result template
    $.get('templates/result.html', function (data) {
        RESULT_TEMPLATE = data;
    });

    //Add the changelistener to the searchfield
    $('#search').keyup(function () {
        //Don't do a new search if the value is still the same
        if(prevSearch == $(this).val()) return;

        //If it isn't start to prepare for a new search
        prevSearch = $(this).val();
        JUST_PRESSED++;
        //Lower the value after 300 ms again, and check if we are ready to search
        setTimeout(function(){JUST_PRESSED --; doSearch();}, 500);
    });
    //And do first search
    doSearch();
    //Also update limit when you search
    $('#limitSelect').change(function () {
        doSearch();
    });

    //Now if you update the column thingy, the search is re-done
    $('#columnClass').change(function(){
        doSearch();
    })
});

/**
 * Handles the searching while inputing the correct data
 */
function doSearch(){
    //Only if we didn't just press a key
    if(JUST_PRESSED > 0) return;
    search($('#search').val(), $('#limitSelect').val());
}

/**
 * Passes the query on to the server for processing
 * @param {String} query 
 */
function search(query, limit) {
    //Start spinning the spinner
    $('#searchLogo').addClass('rotating').html(SPINNER);
    //If limit is not defined, use the global LIMIT
    if (!limit) limit = LIMIT;
    //Make sure no illegal chracters are in there
    query = query.replace(/\s/g, '');
    //Also remove any kind of accenting in the betatype, we don't want that
    query = query.replace('/', '').replace(String.fromCharCode(92), '').replace('=', '');
    //If query is no length, query an asterisk
    if (query.length < 1) query = "*";
    //Translate the query into ASCII
    query = convertASCII(query);
    let limitLemmata = $('#limitLemmata').attr('checked');
    //Send the query to the server
    $.get("search.php?q=" + query + "&m=" + limit + "&l=" + (limitLemmata == 'true'), function (data) {
        let lines = data.split("\n");
        let ts = lines.shift();
        //Don't do anything with this data if we already applied a newer update
        if (ts < TIME_STAMP) return;
        //Else if we make it to here, we're applying this update, so update timestamp
        TIME_STAMP = ts;
        if(lines.length > 1){
            let results = [];
            for (var i = 0; i < lines.length; i++) {
                let parts = lines[i].split("#");
                //Ignore empty lines
                if (parts.length < 3) continue;
                //Add new result
                results.push({
                    id: parts[1],
                    lemma: parts[2],
                    lemmaASCII: parts[0],
                });
                //Now shows the results
                showResults(results, query);
            };
        }else{
            $('#resultHolder').html(NO_RESULTS);
        }
        //And stop spinning
        $('#searchLogo').removeClass('rotating').html(SEARCH);
    });
}

/**
 * Shows the provided results array
 * @param {Array} results 
 * @param {String} query the search query that we will highlight
 */
function showResults(results, query) {
    //Go through every result and add it to the div
    var lines = [];
    $.each(results, function (index, result) {
        let rTemp = RESULT_TEMPLATE.replace(/%LEMMA%/g, result.lemma);
        rTemp = rTemp.replace('%CLASS%', $('#columnClass').val().trim( ));
        rTemp = rTemp.replace(/%ID%/g, result.id);
        lines.push(rTemp);
    });

    //Now finally update the DOM
    $('#resultHolder').html(lines.join(''));

    //Add a copy listener to all id's
    $('.badge-info').click(function () {
        copyTextToClipboard($(this).text());
        var backup = $(this).html();
        var self = this;
        $(this).html("Copied!");
        setTimeout(function () {
            $(self).html(backup)
        }, 1000);
    });

    /**If you think about clicking on show more, the stuff gets requested */
    $('.showBtn').mouseover(function(){
        request($(this).attr('href').replace('#', '').replace('Collapse', ''));
        $(this).unbind('mouseover');
    }).click(function(){
        if($(this).text() == "Show more"){
            $(this).html("Hide").removeClass('badge-secondary').addClass('badge-primary');
        }else{
            $(this).html("Show More").removeClass('badge-primary').addClass('badge-secondary');
        }
    });

    //Check if we only have one entry to show, if so show it after 300ms
    setTimeout(function(){
        //If there are less than 3 entries, show their full contents
        if($('.showBtn').length < 3){
            $('.showBtn').mouseover().click();
        }
    }, 300);
}

/**
 * Untill the user has given permission, we don't use any cookies,
 * after that we do. 
 */
function allowCookies(allow){
    ALLOW_COOKIES = allow;
    //Nothing todo if we don't get permission for cookies
    if(!allow) return;

    //First hide the cookieHolder
    $('#cookieHolder').fadeOut();

    //Else we make the cookie
}

/**
 * Requests the entry with the provided ID
 * @param {String} id 
 */
function request(id){
    $.get('request.php?id=' + id, function(data){
        $('#' + id + "Collapse .card-text").html(decorate(data.split('#')[3]));
    });
}

/**
 * Used to highligh a strings occurences of the query
 * @param {String} text 
 */
function decorate(text) {
    let query = $('#search').val().trim();
    //Remove any special characters rom the query
    query = query.replace(/[^\w\s]/gi, '')
    //First remove first two characters, if they are ', '
    if (text.substr(0, 2) == ', ') text = text.substr(2);
    //Empty query means nothing to highlight
    if (query.length < 1 || query == "*") return text;
    //Now perform the regex
    text = text.replace(new RegExp(query, 'gi'), "<span class='bg-info'>" + query + "</span>");
    return text;
}

/**
 * Limits this text to a length of 100 characters, showing
 * dots when truncated
 * @param {String} text 
 */
function truncate(text) {
    //The dots used
    const dots = "...";
    //See if we're longer
    if (text.length > 99) {
        return text.substring(0, 97) + dots;
    } else {
        return text;
    }
}

/**
 * This function copies the provided text into your clipboard
 * @param {String} copyText 
 */
function copyTextToClipboard(copyText) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = copyText.trim();
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if (msg != 'successful') {
            copyText = "ERROR: UNABLE TO COPY";
        } else {
            copyText = 'Copied: ' + copyText;
        }
    } catch (err) {
    }
    document.body.removeChild(textArea);
}