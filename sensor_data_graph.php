<?php   
        if ($_POST['action'] === 'one_day') {
                $username = "myuser";
                $password = "mypass";
                $host = "localhost";
                $database = "mydb";
                
                $server = mysql_connect($host, $username, $password);
                $connection = mysql_select_db($database, $server);
                if (!connection) {
                        echo "Please try later";
                }
        
                $sql1 = "select distinct s1.id, s1.name, s1.type, s1.latitude, s1.longitude from sensors s1 where s1.last_update_date= (select max(s2.last_update_date) from sensors s2 where s2.id = s1.id);";
                $result1 = mysql_query($sql1, $server);
                $currentid = $_POST['sensor'];
                $chosenDate = $_POST['date'];
                
                $file = fopen('data.csv', 'w');
                while (($row = mysql_fetch_array($result1))) {
                        if ($row['id'] == $currentid) {
                                $id = $row['id'];
                                $name = $row['name'];
                                $type = $row['type'];
                                $latitude = $row['latitude'];
                                $longitude = $row['longitude'];
                                $sensor_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude);
                                $sql2 = "select sensor_id, date,hour, pm10, pm25, humidity, temperature, wind from data where date='$chosenDate' and sensor_id=$id order by hour";
                        
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
                                                fputcsv($file, $row);
                                                $data_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude, 'measurment_date' => $measurment_date, 'measurment_hour' => $measurment_hour, 'pm10' => $pm10, 'pm25' => $pm25, 'humidity' => $humidity, 'temperature' => $temperature, 'wind' => $wind);
                                        }
                        }

                }
                fclose($file);
                echo json_encode($data_array);
                if (!result) {
                        die("Error in SQL query: " . mysql_error());
                }
        } else if ($_POST['action'] === 'custom_days') {
                $chosenDate = $_POST['date'];
                $chosenDateTo = $_POST['date2'];
                $currentid = $_POST['sensor'];
                $username = "myuser";
                $password = "mypass";
                $host = "localhost";
                $database = "mydb";
                
                $server = mysql_connect($host, $username, $password);
                $connection = mysql_select_db($database, $server);
                if (!connection) {
                        echo "Please try later";
                }
        
                $sql1 = "select distinct s1.id, s1.name, s1.type, s1.latitude, s1.longitude from sensors s1 where s1.last_update_date= (select max(s2.last_update_date) from sensors s2 where s2.id = s1.id);";
                $result1 = mysql_query($sql1, $server);
                $file = fopen('data.csv', 'w');
                while ($row = mysql_fetch_array($result1)) {

                        if ($row['id'] == $currentid) {
                                $id = $row['id'];
                                $name = $row['name'];
                                $type = $row['type'];
                                $latitude = $row['latitude'];
                                $longitude = $row['longitude'];
                                $sensor_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude);
                                $sql2 = "select sensor_id, date,hour, pm10, pm25, humidity, temperature, wind from data where (date between '$chosenDate' and '$chosenDateTo') and sensor_id=$id order by hour";
                        
                                $result2 = mysql_query($sql2, $server);
                
                                while($row = mysql_fetch_array($result2)) {
                                        $measurment_date = $row['date'];
                                        $measurment_hour = $row['hour'];
                                        $pm10 = $row['pm10'];
                                        $pm25 = $row['pm25'];
                                        $humidity = $row['humidity'];
                                        $temperature = $row['temperature'];
                                        $wind = $row['wind'];
                                        fputcsv($file, $row);
                                        $data_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude, 'measurment_date' => $measurment_date, 'measurment_hour' => $measurment_hour, 'pm10' => $pm10, 'pm25' => $pm25, 'humidity' => $humidity, 'temperature' => $temperature, 'wind' => $wind);
                                }
                        }
                }
                fclose($file);
                echo json_encode($data_array);
                if (!result) {
                        die("Error in SQL query: " . mysql_error());
                }
                
        } else if ($_POST['action'] === 'one_month') {
                
                $chosenDate = $_POST['date'];
                $currentid = $_POST['sensor'];
                $username = "myuser";
                $password = "mypass";
                $host = "localhost";
                $database = "mydb";
                
                $server = mysql_connect($host, $username, $password);
                $connection = mysql_select_db($database, $server);
                if (!connection) {
                        echo "Please try later";
                }
        
                $sql1 = "select distinct s1.id, s1.name, s1.type, s1.latitude, s1.longitude from sensors s1 where s1.last_update_date= (select max(s2.last_update_date) from sensors s2 where s2.id = s1.id);";
                $result1 = mysql_query($sql1, $server);
                $file = fopen('data.csv', 'w');
                while ($row = mysql_fetch_array($result1)) {
                        if ($row['id'] == $currentid) {
                                $id = $row['id'];
                                $name = $row['name'];
                                $type = $row['type'];
                                $latitude = $row['latitude'];
                                $longitude = $row['longitude'];
                                $sensor_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude);
                                $sql2 = "select sensor_id, date,hour, pm10, pm25, humidity, temperature, wind from data where date like '$chosenDate%' and sensor_id=$id order by date";
        
                                
                                $result2 = mysql_query($sql2, $server);
                
                                while($row = mysql_fetch_array($result2)) {
                                        $measurment_date = $row['date'];
                                        $measurment_hour = $row['hour'];
                                        $pm10 = $row['pm10'];
                                        $pm25 = $row['pm25'];
                                        $humidity = $row['humidity'];
                                        $temperature = $row['temperature'];
                                        $wind = $row['wind'];
                                        fputcsv($file, $row);
                                        $data_array[] = array ('id'=> $id, 'name'=> $name, 'type'=> $type, 'latitude' => $latitude, 'longitude' => $longitude, 'measurment_date' => $measurment_date, 'measurment_hour' => $measurment_hour, 'pm10' => $pm10, 'pm25' => $pm25, 'humidity' => $humidity, 'temperature' => $temperature, 'wind' => $wind);
                                }
                    }
                }
                fclose($file);
                echo json_encode($data_array);
                if (!result) {
                        die("Error in SQL query: " . mysql_error());
                }

        }



?>
