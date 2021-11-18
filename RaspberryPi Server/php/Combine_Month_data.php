<?php

$dir = '../SummaryData/MonthlyData/';
// $files = scandir($dir);
$Files = glob('../SummaryData/MonthlyData/*.csv', GLOB_BRACE);
//echo json_encode($files);

$Data = array();
//$N = 1;
foreach ($Files as $file) {
  $data = array_map('str_getcsv', file($file));
  $keys = array_shift($data);
  $newArray = array_map(function($values) use ($keys){
    return array_combine($keys, $values);
  }, $data);

  $Data = array_merge($Data,$newArray);
  //$N++;
};
echo json_encode($Data);
?>
