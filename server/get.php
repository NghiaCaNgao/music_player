<?php
    $id = $_REQUEST["id"];
    $inforGet = $_REQUEST["get"];
    $servername = "localhost";
	$username = "nghia123";
	$password = "nghia123";
    $dbname = "data";
    
    $conn = mysqli_connect($servername, $username, $password,$dbname);
	if (!$conn) {
		die('{msg: "' . mysqli_connect_error().'"');
    }
    
?>