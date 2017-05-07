<?php

header('Content-type: application/json');

$mysql_host = 'localhost';
$mysql_user = 'adtcom_user';
$mysql_pass = 'a4bb475b14';

$mysql_database = 'alexdixontriggcom_traindensity';

$mysql_connection = mysql_connect($mysql_host, $mysql_user, $mysql_pass);

if (!$mysql_connection) {
	echo "Database connection unsuccessful.";
	die(mysql_error());
}
else {
	mysql_select_db($mysql_database,$mysql_connection);
	//echo "Database connection successful!";
	//echo "\n";
}

/* $res = mysql_query("SHOW DATABASES");
while ($row = mysql_fetch_assoc($res)) {
    echo $row['Database'] . "\n";
} */

$get_trainlines_query = "SELECT * FROM trainlines";
$trainlines_table = mysql_query($get_trainlines_query);
$row_count = mysql_numrows($trainlines_table);

$i = 0;

while ($i < $row_count)
{
	$id = mysql_result($trainlines_table, $i, 'id');
	$name = mysql_result($trainlines_table, $i, 'name');
	$direction = mysql_result($trainlines_table, $i, 'direction');
	
	
	$line_subarray = array(
		'id' => $id,
		'name' => $name,
		'direction' => $direction,
	);
	
	$line_array[$i] = $line_subarray;
	
	$i++;
}

echo json_encode($line_array);

mysql_close();

?>

