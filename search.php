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
/**Max amount of responses */
if(!isset($_GET['l'])){
    $limit = 10;    
}else{
    $limit = $_GET['l'];
}

//Get the query data from the GET url variable
$query = $_GET['q'];

//Read through the file using an iterator
$handle = fopen('data/lsj-combined.cex', 'r');
$counter = 0;
//Read every line
while(($line = fgets($handle)) !== false) {
    //Only echo back the ones we need
    if(strpos(strtolower($line), strtolower($query)) !== FALSE){
        echo $line;
        $counter ++;
        if($counter >= $limit) break;
    }
}
//Close the file again
fclose($handle);

//Exit
exit();