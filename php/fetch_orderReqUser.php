<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');


try {
    $sql = "SELECT * FROM ppmp_request WHERE order_by=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([(int)$_SESSION['user']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for($i = 0; $i < count($data); $i++){
        if ($data[$i]['order_item'] && !empty($data[$i]['order_item'])) {
            $decodedCart = json_decode($data[$i]['order_item'], true);

            // Ensure valid JSON decoding
            if (json_last_error() === JSON_ERROR_NONE) {
                $data[$i]['order_item'] = $decodedCart;
            } else {
                $data[$i]['order_item'] = []; // Fallback to an empty array if decoding fails
            }
        } else {
            $data[$i]['order_item'] = ["order_item" => []]; // Handle case where no data is found
        }

        $sql = "SELECT fullName FROM user_cart WHERE bioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([(int)$data[$i]['order_by']]);
        $data_name = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT sectionName FROM pgsSection WHERE sectionID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([(int)$data[$i]['order_by_section']]);
        $data_section = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT * FROM request_history WHERE orderID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data[$i]['orderID']]);
        $history_orderID = $stmt->fetchAll(PDO::FETCH_ASSOC);

        for($j = 0; $j < count($history_orderID); $j++){
            if ($history_orderID[$j]['previousOrder'] && !empty($history_orderID[$j]['previousOrder'])) {
                $decodedCart = json_decode($history_orderID[$j]['previousOrder'], true);
    
                // Ensure valid JSON decoding
                if (json_last_error() === JSON_ERROR_NONE) {
                    $history_orderID[$j]['previousOrder'] = $decodedCart;
                } else {
                    $history_orderID[$j]['previousOrder'] = []; // Fallback to an empty array if decoding fails
                }
            } else {
                $history_orderID[$j]['previousOrder'] = ["previousOrder" => []]; // Handle case where no data is found
            }

            if ($history_orderID[$j]['updatedOrder'] && !empty($history_orderID[$j]['updatedOrder'])) {
                $decodedCart = json_decode($history_orderID[$j]['updatedOrder'], true);
    
                // Ensure valid JSON decoding
                if (json_last_error() === JSON_ERROR_NONE) {
                    $history_orderID[$j]['updatedOrder'] = $decodedCart;
                } else {
                    $history_orderID[$j]['updatedOrder'] = []; // Fallback to an empty array if decoding fails
                }
            } else {
                $history_orderID[$j]['updatedOrder'] = ["updatedOrder" => []]; // Handle case where no data is found
            }
        }

        $data[$i]['order_by_name'] = $data_name['fullName'];
        $data[$i]['order_by_sectionName'] = $data_section['sectionName'];
        $data[$i]['history_update'] = $history_orderID;
    }

    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

// e/i ka wo/u lo/u ngo/u
// i ka wa la nga
?>
