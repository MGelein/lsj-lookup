/**
 * Simple utility to set cookies
 */
/**
 * Global variable that holds the cookie
 */

var cookie = {};
/**
 * Returns the cookie associated with the provided key
 * @param {String} key 
 */
function getCookie(key){
    parseCookie();
    return cookie[key];
}

/**
 * Saves the key-value pair as strings to the cookie object.
 * @param {String} key 
 * @param {String} value 
 */
function setCookie(key, value){
    //Save the value to the cookie
    cookie[key] = value;
    //Set the expiry date
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    cookie.expires = d.toUTCString();
    //Save cookie
    saveCookie();
    //Parse cookie 
    parseCookie();
}

/**
 * Parses the cookie from the browser
 */
function parseCookie(){
    if(document.cookie.length < 1) return;
    var cString = document.cookie;
    var parts = cString.split(";");
    parts.forEach(function(part){
        var pp = part.split('=');
        if(pp.length < 2) return;
        cookie[pp[0].trim()] = pp[1].trim();
    });
}

/**
 * Save the cookie to the client browser
 */
function saveCookie(){
    var cString = "";
    //GEt all the keys
    const keys = Object.keys(cookie);
    //Now for every key, add it to the cookie string
    keys.forEach(function(key){
        cString += key + "=" + cookie[key] + ";";
    });
    //Save the cookie
    document.cookie = cString;
}
