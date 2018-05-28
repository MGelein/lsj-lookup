/**
 * Max amounts of results returned by the server
 */
var LIMIT = 20;
/**Contains the HTML for a single result entry */
var RESULT_TEMPLATE = "";

//If we're currently limiting our results to only the lemmata
var LL = true;
const LIMIT_LEMMATA = '<i class="fas fa-check"></i>&nbsp;Search only for lemmata';
const NO_LIMIT_LEMMATA = '<i class="fas fa-times"></i>&nbsp;Search in complete body'

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

    //Add the changelistener to the searchfield
    $('#search').keyup(function(){
        search($('#search').val(), $('#limitSelect').val());
    });
    //And do first search
    search($('#search').val(), $('#limitSelect').val());
    //Also update limit when you search
    $('#limitSelect').change(function(){
        search($('#search').val(), $('#limitSelect').val());
    });

    //Add the listener to the limitLemmatabutton
    $('#limitLemmata').click(function(){
        //Toggle the button
        LL = !LL;
        if(LL){
            $(this).removeClass('btn-success').addClass('btn-warning').html(NO_LIMIT_LEMMATA);
        }else{
            $(this).removeClass('btn-warning').addClass('btn-success').html(LIMIT_LEMMATA);
        }
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
    //If query is no length, query an asterisk
    if(query.length < 1) query = "*";
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
        rTemp = rTemp.replace(/%DESC%/g, truncate(result.desc));
        rTemp = rTemp.replace(/%ID%/, result.id);
        lines.push(rTemp);
    });

    //Now finally update the DOM
    $('#resultHolder').html(lines.join(''));

    //Add a copy listener to all id's
    $('.badge').click(function(){
        copyTextToClipboard($(this).text());
        var backup = $(this).html();
        var self = this;
        $(this).html("Copied!");
        setTimeout(function(){
            $(self).html(backup)
        }, 1000);
    });
}

/**
 * Limits this text to a length of 100 characters, showing
 * dots when truncated
 * @param {String} text 
 */
function truncate(text){
    //The dots used
    const dots = "...";
    //See if we're longer
    if(text.length > 99){
        return text.substring(0, 97) + dots;
    }else{
        return text;
    }
}

/**
 * This function copies the provided text into your clipboard
 * @param {String} copyText 
 */
function copyTextToClipboard(copyText){
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
        if(msg != 'successful'){
          copyText = "ERROR: UNABLE TO COPY";
        }else{
          copyText = 'Copied: ' + copyText;
        }
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }