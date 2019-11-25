<?php

$servername = "localhost";
$dbname = "WeatherDataBase";
$username = "root";
$password = "myfirstsql";

$conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
} 

$Source = $_GET["Source"];
$Location = $_GET["Location"];
$Measurement = $_GET["Measurement"];
$Value = $_GET["Value"];
$sql = "INSERT INTO EnvironmentalData (Source,Location,Measurement, Value) 
        VALUES ($Source,$Location,$Measurement,$Value)";     
           
if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
}else {
   echo "Error: " . $sql . "<br>" . $conn->error;
}
    
$conn->close();

?>