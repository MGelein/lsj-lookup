<?php
/**
 * This simple script will look for the provided search query and return the id's of the 
 * objects that match in their lemma
 */
header('Content-type:application/json; charset=UTF-8');
//See if any query data is set
if(!isset($_GET['q'])){
    echo "What are you doing here?";
    exit();
}

//Get the query data from the GET url variable
$query = $_GET['q'];

//Start of the JSON response
echo '{';

//Read through the file using an iterator
$handle = fopen('data/lsj-combined.cex', 'r');
//Read every line
echo '"ids":[';
while(($line = fgets($handle)) !== false) {
    //Only echo back the ones we need
    if(strpos(strtolower($line), strtolower($query)) !== FALSE){
        echo '"' . substr($line, 0, strpos($line, '#')) . '",';
    }
}
//Close the array
echo '""]';

//Close the file again
fclose($handle);

//End of JSON response
echo '}';