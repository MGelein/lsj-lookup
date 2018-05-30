/**
 * This file contains the conversion data to
 * go from unicode back to betatype ascii
 */
var conversionTable = {};

/**
 * This converts a unicode greek input string into a ASCII
 * betacode string, ignoring and removing any accenting
 * @param {String} input 
 */
function convertASCII(input){
    //The output array, will be joined on return
    let output = [];
    //Split the input into characters
    const chars = input.split('');
    //For every character, check if we have an entry in the conversionTable
    chars.forEach(function(char){
        //Add the unconverted character if no entry was fuond
        output.push((conversionTable[char] ? conversionTable[char] : char));  
    });
    //Return the result
    return output.join('');
}

 /**
  * This function will prepare the conversion data. Only after
  * this has run are we ready to convert data
  */
function initConversion(){
    //Empty the table to prevent duplicate entries
    conversionTable = {};
    $.get('data/asciiConversion.cex', function(data){
        //Read and parse the conversionData
        const lines = data.split('\n');
        //Parse every line
        lines.forEach(function(line){
            //Ignore comment lines
            if(line.substr(0, 2) == '//') return;
            //for every def line, populate the conversionTable
            addConvEntry(line);
        });
    });
}

/**
 * This function parses a single line from the conversion file
 * @param {String} line 
 */
function addConvEntry(line){
    //No conversion data if no hash is present
    if(line.indexOf('#') < 0) return;
    //Start splitting the line
    let parts = line.split('#');
    //Split the keys and defs
    let keys = parts[0].split(' ');
    let def = parts[1];
    keys.forEach(function(key){
        conversionTable[key] = def;
    });
}