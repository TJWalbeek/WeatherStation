<?php

$servername = "localhost";
$dbname = "WeatherDataBase";
$username = "website";
$password = "readonlysql";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT DateTime, Sources.`SourceName`, Locations.`LocationName`,
        Measures.`MeasureType`, Value from EnvironmentalData
        join Sources on Sources.SourceID = EnvironmentalData.Source
        join Locations on Locations.LocationsID = EnvironmentalData.Location
        join Measures on Measures.MeasureTypeID = EnvironmentalData.Measurement
        order by DateTime";

$query = mysqli_query($conn, $sql);
//$query = $conn->query($sql)



    if ( ! $query ) {
        echo "fail";
        echo mysqli_error($conn);
        die;
    }
    //else {
      //echo mysqli_num_rows($query);
    //}

    $data = array();

    // while($r = mysqli_fetch_assoc($query)) {
    //     $data[] = $r;
    // }
    for ($x = 0; $x < mysqli_num_rows($query); $x++) {
        $data[] = mysqli_fetch_assoc($query);
    }

    echo json_encode($data);
    //echo $data;

//$conn->close();
mysqli_close($conn);
?>
