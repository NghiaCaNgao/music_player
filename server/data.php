<?php
function read($number,$ip,$other) {
	$servername = "localhost";
	$username = "id12282332_btdev";
	$password = "btdev";
	$dbname = "id12282332_btteam";
	$conn = mysqli_connect($servername, $username, $password,$dbname);
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
		echo "error";
	}
	if($other== 1){
		$sql = 'SELECT ip,wish FROM `user_wish` WHERE ip != "' .$ip. '" LIMIT '.$number;
		// echo $sql;

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$JsonData = array();
			while($r = $result->fetch_assoc()) {
				$JsonData[] = $r;
			}
			echo json_encode($JsonData);
		} else {
			echo "error. ko co du lieu";
		}
	}
	elseif($other==2){
		$sql = 'SELECT * FROM `user_wish` LIMIT '.$number;
		// echo $sql;

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$JsonData = array();
			while($r = $result->fetch_assoc()) {
				$JsonData[] = $r;
			}
			echo json_encode($JsonData);
		} else {
			echo "error. ko co du lieu";
		}
	}
	else{
		if ($number == 0){
			$sql = 'SELECT wish FROM `user_wish` WHERE ip = "' .$ip. '"';
		}
		else{
			$sql = 'SELECT wish FROM `user_wish` WHERE ip = "' .$ip. '" LIMIT '.$number;
		}

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$JsonData = array();
			while($r = $result->fetch_assoc()) {
				$JsonData[] = $r;
			}
			echo json_encode($JsonData);
		} else {
			echo "error. ko co du lieu";
		}
	}
	
	$conn->close();
}

function write($ip,$message,$infor){
	$servername = "localhost";
	$username = "id12282332_btdev";
	$password = "btdev";
	$dbname = "id12282332_btteam";

	$conn = mysqli_connect($servername, $username, $password,$dbname);
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
		echo "error";
	}

	$now = date(" D d m Y h:i:s A");

	$sql = 'INSERT INTO user_wish(ip,wish,infor,time_submit) VALUES("'.$ip.'","'.$message.'","'.$infor.'","'.$now.'")';
	echo $sql;
	echo "</br>";
	if ($conn->query($sql) === TRUE) {}
		else{
			echo "error";
		}
		$conn->close();
	}
	date_default_timezone_set("Asia/Bangkok");
	$command = $_REQUEST['r'];
	if ($command == "r"){
		$limit = $_REQUEST["limit"];
		$ip = $_REQUEST["ip"];
		$other = $_REQUEST["other"];
		read($limit,$ip,$other);
	}
	elseif($command == "w"){
		$ip = $_REQUEST["ip"];
		$message = $_REQUEST["mes"];
		$infor = $_REQUEST["infor"];
		write($ip,$message,$infor);
	}
	?>