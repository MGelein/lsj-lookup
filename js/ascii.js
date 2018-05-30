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
    //First turn it into NFC string, because NFD can break the system
    input = input.normalize('NFC');
    //Make sure the input is lowercase
    input = input.toLocaleLowerCase();
    //The output array, will be joined on return
    let output = [];
    //Split the input into characters
    const chars = input.split('');
    //For every character, check if we have an entry in the conversionTable
    chars.forEach(function(char){
        //Add the unconverted character if no entry was fuond
        output.push((conversionTable[char] ? conversionTable[char] : char));  
    });
    //Check the ouput for breathing marks
    output = checkBreathing(output.join(''));
    //Return the result
    return output;
}

/**
 * Returns a breathing corrected version. If no breathing
 * is found, spiritus lenis is assumed.
 * @param {String} input 
 */
function checkBreathing(input){
    //Nothing needs to be done if breathing is already found
    if(input.indexOf('(') > -1 || input.indexOf(')') > -1 || input == '*'){
        //Hide the error message
        $('#searchLabel').hide();
        return input;
    }   
    //If it is not found, see if we need to add it
    //See if the first two characters are a diphtong
    if(['ai', 'au', 'ei', 'eu'].indexOf(input.substr(0, 2)) > -1){
        //This is a dihptong (or at least we think so), add a breathing mark after it. 
        input = input.substr(0, 2) + ")" + input.substr(2);
        $('#searchLabel').show().html("No breathing mark found, assumed spiritus lenis after second character");
        return input;
    }
    //Here we can be sure it is at least not a diphtong, if the first character is a vowel, add it after that
    if(['a', 'e', 'i' , 'o', 'u', 'h', 'w'].indexOf(input.charAt(0)) > -1){
        input = input.substr(0, 1) + ")" + input.substr(1);
        $('#searchLabel').show().html("No breathing mark found, assumed spiritus lenis after first character");
        return input;
    }else{
        //Hide the error message
        $('#searchLabel').hide();
        //This does not start with a vowel and thus needs no breathing mark
        return input;
    }    
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
    let def = parts[1].trim();
    keys.forEach(function(key){
        conversionTable[key] = def;
    });
}