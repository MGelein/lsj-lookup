const fs = require('fs');

//Read the unicode version into memory
const unicodeLines = fs.readFileSync("lsj.cex", "utf-8").split("\n");
//Create a table object, with the id number used as key
let table = {};
//Now go through every line and parse it into this table
unicodeLines.forEach(function(line){
    let parts = line.split("#");
    let lemma = parts[1].substring(0, parts[1].indexOf(",")).trim();
    let desc = parts[1].substr(lemma.length);
    table[parts[0]] = {
        unicodeLemma: lemma,
    };
});

//Read the ascii version into memory
const asciiLines = fs.readFileSync("lsj-ascii.cex", "utf-8").split("\n");
//Now go through every line and add the ascii def to the table
asciiLines.forEach(function(line){
    let parts = line.split("#");
    let lemma = parts[1].substring(0, parts[1].indexOf(",")).trim();
    table[parts[0]].asciiLemma = lemma;
});


//Now write it back into a combined file
let data = []
const keys = Object.keys(table);
keys.forEach(function(key){
    data.push([key, table[key].asciiLemma, table[key].unicodeLemma, table[key].description].join("#"));
});
//Join the data on a newline
fs.writeFileSync("lsj-combined-lemmata.cex", data.join("\n"));