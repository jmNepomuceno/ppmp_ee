<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

try {
    $sql = "SELECT order_item, orderID, order_status FROM ppmp_request WHERE orderID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_POST['view_orderID']]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    // Decode the JSON string in 'order_item' field
    if ($data && isset($data['order_item'])) {
        $data['order_item'] = json_decode($data['order_item'], true);
    }

    if (!empty($data['order_item'])) {
        foreach ($data['order_item'] as &$orderItem) {
            $sql = "SELECT itemName, itemImage FROM imiss_inventory WHERE itemID=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$orderItem['itemID']]);
            $itemData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($itemData) {
                $orderItem['itemName'] = $itemData['itemName'];

                if (!empty($itemData['itemImage'])) {
                    $orderItem['itemImage'] = 'data:image/jpeg;base64,' . base64_encode($itemData['itemImage']);
                } else {
                    $orderItem['itemImage'] = 'path/to/default-image.jpg';
                }
            }
        }
        unset($orderItem); // Break reference to avoid unexpected issues
    }

    // Send JSON response
    echo json_encode($data, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
