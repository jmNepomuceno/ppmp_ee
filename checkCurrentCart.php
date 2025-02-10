<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

try {
    $sql = "SELECT cart FROM user_cart WHERE bioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION["user"]]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data && !empty($data['cart'])) {
        $decodedCart = json_decode($data['cart'], true);

        // Ensure valid JSON decoding
        if (json_last_error() === JSON_ERROR_NONE) {
            $data['cart'] = $decodedCart;
        } else {
            $data['cart'] = []; // Fallback to an empty array if decoding fails
        }
    } else {
        $data = ["cart" => []]; // Handle case where no data is found
    }

    
    $itemName_arr = [];
    for($i = 0; $i < count($data['cart']); $i++) {
        $sql = "SELECT itemName FROM imiss_inventory WHERE itemID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['cart'][$i]['itemID']]);
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
