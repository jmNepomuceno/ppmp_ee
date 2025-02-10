<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

$date = date('Y-m-d H:i:s');

try {
    $sql = "SELECT cart FROM user_cart WHERE bioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION["user"]]);
    $fetch_cart = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($fetch_cart && !empty($fetch_cart['cart'])) {
        $decodedCart = json_decode($fetch_cart['cart'], true);

        // Ensure valid JSON decoding
        if (json_last_error() === JSON_ERROR_NONE) {
            $fetch_cart['cart'] = $decodedCart;
        } else {
            $fetch_cart['cart'] = []; // Fallback to an empty array if decoding fails
        }
    } else {
        $fetch_cart = ["cart" => []]; // Handle case where no data is found
    }

    $orderID = "";
    $sql = "SELECT orderID FROM ppmp_request ORDER BY orderID DESC LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $last_id = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($last_id && isset($last_id['orderID'])) {
        // Extract numeric part (assuming format ORDER00002)
        $num = (int) substr($last_id['orderID'], 5); // Get '00002' and convert to int (2)
        $new_num = str_pad($num + 1, 5, "0", STR_PAD_LEFT); // Increment and pad to 5 digits
        $orderID = "ORDER" . $new_num; // Concatenate with 'ORDER'
    } else {
        $orderID = "ORDER00001"; // Default if no record exists
    }

    $sql = "INSERT INTO ppmp_request (orderID, order_date, order_item, order_by, order_by_section, order_status) VALUES (?,?,?,?,?,'Pending')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $orderID,
        $date,
        json_encode($fetch_cart['cart']),
        $_SESSION["user"],      
        $_SESSION["section"],      
    ]);


    // $sql = "DELETE cart FROM user_cart WHERE bioID=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION["user"]]);
    $sql = "UPDATE user_cart SET cart=NULL WHERE bioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION["user"]]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
