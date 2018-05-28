<?php
/**
 * This simple script will look for the provided search query and return the id's of the 
 * objects that match in their lemma
 */
header('Content-type:text/plain; charset=UTF-8');
//See if any query data is set
if(!isset($_GET['q'])){
    echo "What are you doing here?";
    exit();
}

//Get the query data from the GET url variable
$query = $_GET['q'];

//Read through the file using an iterator
$handle = fopen('data/lsj-combined.cex', 'r');
//Read every line
while(($line = fgets($handle)) !== false) {
    //Only echo back the ones we need
    if(strpos(strtolower($line), strtolower($query)) !== FALSE){
        echo substr($line, 0, strpos($line, '#')) . ',';
    }
}

//Close the file again
fclose($handle);