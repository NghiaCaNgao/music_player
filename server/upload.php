<?php
function get_client_ip()
{
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

function upload()
{
    $base_link = "http://localhost/a/data/";
    $base_link_path = "data/";
    $data = $_POST['data'];
    $id = $_POST['id'];
    $ip = get_client_ip();

    $servername = "localhost";
    $username = "nghia123";
    $password = "nghia123";
    $dbname = "data";

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
       die("loi");
    }

    date_default_timezone_set("Asia/Bangkok");
    $sql = "INSERT INTO list_music(id,ip,timer,link) VALUES ('" . $id . "','" . $ip . "','" . date('Y-m-d H:i:s') . "','" . $base_link . $id . ".json" . "')";
    // echo $sql;
    $f = fopen($base_link_path . $id . ".json", "w");
    fwrite($f, $data);
    fclose($f);

    $conn->query($sql);

    $status = [
        "status" => [
            "msg" => "success",
            "code" => 0
        ]
    ];
    echo (json_encode($status));
}

upload();
