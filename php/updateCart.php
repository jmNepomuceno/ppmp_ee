<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

$itemID = (int)$_POST['itemID']; 
$itemQuantity = $_POST['itemQuantity']; 

try {
    $sql = "SELECT cart FROM user_cart WHERE bioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION["user"]]);
    $current_cart = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($current_cart && !empty($current_cart['cart'])) {
        $decodedCart = json_decode($current_cart['cart'], true);

        // Ensure valid JSON decoding
        if (json_last_error() === JSON_ERROR_NONE) {
            $current_cart['cart'] = $decodedCart;
        } else {
            $current_cart['cart'] = []; // Fallback to an empty array if decoding fails
        }
    } else {
        $current_cart = ["cart" => []]; // Handle case where no data is found
    }


    for($i = 0; $i < count($current_cart['cart']); $i++) {
        if($current_cart['cart'][$i]['itemID'] == $itemID){
            $current_cart['cart'][$i]['itemQuantity'] = $itemQuantity;
        }
    }

    print_r($current_cart);

    $sql = "UPDATE user_cart SET cart=? WHERE bioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        json_encode($current_cart['cart']), // Store as JSON
        $_SESSION["user"],
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
