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
if(!isset($_GET['m'])){
    $limit = 10;    
}else{
    $limit = $_GET['m'];
}

/**Check if we need to limit to lemmata, by default true */
if(!isset($_GET['l'])){
    $lemmata = true;
}else{
    $lemmata = $_GET['l'] === 'true';
}

//Get the query data from the GET url variable
$query = $_GET['q'];
//Echo the time as a stamp
echo round((microtime(true) * 1000)) . "\n";

/**Switch file depending on the provided parameter.
 * IGNORE FOR NOW, may add back later?
*/
$file = 'data/lsj-ascii-unaccented.cex';

//Read through the file using an iterator
$handle = fopen($file, 'r');
$counter = 0;
$qLen = strlen($query);
//Read every line
while(($line = fgets($handle)) !== false) {
    //Only echo back the ones we need
    if(substr($line, 0, $qLen) == $query){
        echo $line;
        $counter ++;
        //Stop reading if we have enough results
        if($counter >= $limit) break;
    }
}
//Close the file again
fclose($handle);

//Exit
exit();