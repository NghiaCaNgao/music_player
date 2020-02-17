<?php
$id = $_REQUEST["id"];         //id cua list bai hat
$inforGet = $_REQUEST["get"];
/*
 * all...... truy xuat tat ca
 * id....... truy xuat 1 gia tri
 * exist.......xac dinh id ton tai chua
 * 
 * Code 
 * 0............... Thanh cong
 * 1............... 
 * 2............... Khong co du lieu trong csdl
 * 10.............. Khong co du lieu yeu cau
 * 11.............. Đa ton tai du lieu trong csdl
*/

function returnAnswer($result)
{
    if ($result->num_rows > 0) {
        $JsonData = [
            "data" => [],
            "status" => [
                "msg" => "",
                "code" => 0
            ]
        ];
        while ($r = $result->fetch_assoc()) {
            $JsonData['data'][] = $r;
        }
        return json_encode($JsonData);
    } else {
        $status = [
            "status" => [
                "msg" => "Không có dữ liệu",
                "code" => 10
            ]
        ];
        return json_encode($status);
    }
}

function getDataBy($inforGet, $id)
{
    $servername = "localhost";
    $username = "nghia123";
    $password = "nghia123";
    $dbname = "data";

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die('{msg: "' . mysqli_connect_error() . '"');
    }
    switch ($inforGet) {
        case 'all': {
                $sql = 'SELECT * FROM `list_music`';
                break;
            }
        case 'id': {
                $sql = 'SELECT * FROM `list_music` WHERE id = "' . $id . '"';
                break;
            }
        case 'exist': {
                $sql = 'SELECT * FROM `list_music` WHERE id = "' . $id . '"';
                $result = $conn->query($sql);
                if ($result->num_rows > 0){
                    $status = [
                        "status" => [
                            "msg" => "Đã tồn tại",
                            "code" => 11
                        ]
                    ];
                }
                else {
                    $status = [
                        "status" => [
                            "msg" => "Dữ liệu mới",
                            "code" => 2
                        ]
                    ];
                }
                exit(json_encode($status));
            }
        default: {
                echo "[{msg: 'Sai cu phap'}]";
                exit();
            }
    }
    $result = $conn->query($sql);
    echo returnAnswer($result);
}

getDataBy($inforGet, $id);
