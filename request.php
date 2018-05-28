<?php
/**
 * Requests the content for a single entry
 */
header('Content-type:text/plain; charset=UTF-8');
if(!isset($_GET['id'])){
    echo "No ID was provided";
    exit();
}
$id = $_GET['id'];

//Get a handle to the file and read through it
$handle = fopen('data/lsj-combined.cex', 'r');
$idNr = str_replace('n', '', $id);
$idNr -= 100;
//Read every line
while(($line = fgets($handle)) !== false) {
    //Skip this line, we're not even close
    $idNr --;
    if($idNr > 0) continue;
    //Now we're getting close, read every line
    if(substr($line, 0, strpos($line, '#')) == $id){
        echo $line;
        exit();
    }
}
exit(); 
