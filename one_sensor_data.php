<?php
        //$chosenDate = $_POST['date'];
        //$chosenDate = '2016-10-18';
        //$chosenHour =  $_POST['hour'];
        $chosenMonth = $_POST['month'];
        $currentid = $_POST['sensor'];
        $username = "myuser";
        $password = "mypass";
        $host = "localhost";
        $database = "mydb";

        $server = mysql_connect($host, $username, $password);
        $connection = mysql_select_db($database, $server);

        if (!connection)
        {
                echo "Please try later";
        }

        //$sql1 = "select id, name, type, latitude, longitude, max(last_update_hour), update_date from (select id, name, type, max(last_update_date) as update_date, last_update_hour, latitude, longitude from sensors group by name) as subquery where id='$currentid' group by id;";
        $sql1 = "select distinct s1.id, s1.name, s1.type, s1.latitude, s1.longitude from sensors s1 where s1.last_update_date= (select max(s2.last_update_date) from sensors s2 where s2.id = s1.id);";

        //$result = mysql_query($sql, $server);
        $result1 = mysql_query($sql1, $server);
/*
while($row = mysql_fetch_array($result))
{
        //echo $row['sensor_id']." ".$row['date']." ".$row['hour']." ".$row['pm10']." ".$row['pm25']." ".$row['humidity']." ".$row['temperature']." ".$row['wind']." ||| ";
        $sensor_id = $row['sensor_id'];
        $date = $row['date'];
        $hour = $row['hour'];
        $pm10 = $row['pm10'];
        $pm25 = $row['pm25'];
        $humidity = $row['humidity'];
        $temperature = $row['temperature'];
        $wind = $row['wind'];
        $data_array[] = array ('sensor_id'=> $sensor_id, 'date' => $date, 'hour'=> $hour, 'pm10' => $pm10, 'pm25' => $pm25, 'humidity' => $humidity, 'temperature' => $temperature, 'wind' => $wind);

}
*/

while (($row = mysql_fetch_array($result1))) {
        if ($row['id'] == $currentid) {
                
        //echo $row['id']." ".$row['name']." ".$row['type']." ".$row['latitude']." ".$row['longitude']." ".$row['last_update']." ||| ";
        $id = $row['id'];
        $name = $row['name'];
        $type = $row['type'];
        $latitude = $row['latitude'];
        $longitude = $row['longitude'];
        
        //$last_update_date = $row['last_update_date'];
        //$last_update_hour = $row['last_update_hour'];
        $sensor_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude);
        //$sql2 = "select sensor_id, date,hour, pm10, pm25, humidity, temperature, wind from data where date= (select max(date) from data where sensor_id=$id ) and hour like '$chosenHour%' and sensor_id=$id limit 1;";
        $sql2 = "select sensor_id, date,hour, pm10, pm25, humidity, temperature, wind from data where date like '$chosenMonth%' and sensor_id=$id order by date";

        $result2 = mysql_query($sql2, $server);
                while($row = mysql_fetch_array($result2))
                        {
                                $measurment_date = $row['date'];
                                $measurment_hour = $row['hour'];
                                $pm10 = $row['pm10'];
                                $pm25 = $row['pm25'];
                                $humidity = $row['humidity'];
                                $temperature = $row['temperature'];
                                $wind = $row['wind'];

                                $data_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude, 'measurment_date' => $measurment_date, 'measurment_hour' => $measurment_hour, 'pm10' => $pm10, 'pm25' => $pm25, 'humidity' => $humidity, 'temperature' => $temperature, 'wind' => $wind);
                        }

}
}

echo json_encode($data_array);
//echo json_encode($sensor_array);

if (!result) {
die("Error in SQL query: " . mysql_error());
}

?>
