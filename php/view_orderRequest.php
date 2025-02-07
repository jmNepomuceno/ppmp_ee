<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

try {
    $sql = "SELECT order_item FROM ppmp_request WHERE order_by=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_POST['view_bioID']]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    // Decode the JSON string in 'order_item' field
    if ($data && isset($data['order_item'])) {
        $data['order_item'] = json_decode($data['order_item'], true);
    }

    $itemName_arr = [];
    for($i = 0; $i < count($data['order_item']); $i++) {
        $sql = "SELECT itemName FROM imiss_inventory WHERE itemID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['order_item'][$i]['itemID']]);
        $itemName_arr_data = $stmt->fetch(PDO::FETCH_ASSOC);
        array_push($itemName_arr, $itemName_arr_data['itemName']);
    }
    $itemName_arr = array_values($itemName_arr);
    
    // print_r($data);
    // print_r($itemName_arr);
    // Send JSON response
    // echo json_encode($data, JSON_PRETTY_PRINT);
    echo json_encode(array_merge($data , $itemName_arr) , JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
