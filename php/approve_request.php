<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');

$date = date('Y-m-d H:i:s');

$quarterly = '{"Q1": 0, "Jan": 0, "Feb": 0, "Mar": 0, "Q2": 0, "Apr": 0, "May": 0, "June": 0, "Q3": 0, "July": 0, "Aug": 0, "Sept": 0, "Q4": 0, "Oct": 0, "Nov": 0,"Dec": 0}';
try {

    for($i = 0; $i < count($_POST['orderItem']); $i++){
            // $estim_budget = ;
            $itemPrice = $_POST['orderItem'][$i]['itemPrice']; // "P 80,000.00"
            $itemPrice = str_replace(["P", ","], "", $itemPrice); // Remove "P" and commas
            $itemPrice = floatval($itemPrice); // Convert to float

            $sql = "INSERT INTO imiss_ppmp_finaldraft (itemID, orderID, itemDescription, itemTotalQuantity, itemUnit, itemUnitPrice, itemEstimBudget, itemModeOfBac, itemMilestone) VALUES (?,?,?,?,?,?,?,?,?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['orderItem'][$i]['itemID'],
                $_POST['orderID'],
                $_POST['orderItem'][$i]['itemName'],
                $_POST['orderItem'][$i]['itemQuantity'],      
                "set",      
                $itemPrice,      
                $itemPrice * (int)$_POST['orderItem'][$i]['itemQuantity'],      
                "Public Bidding",
                $quarterly
            ]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$orderID = $_POST['orderID'];

try {
    $sql = "UPDATE ppmp_request SET order_status='Approved' WHERE orderID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$orderID]);

    $sql = "SELECT * FROM ppmp_request WHERE order_status='Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
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

        $data[$i]['order_by_name'] = $data_name['fullName'];
        $data[$i]['order_by_sectionName'] = $data_section['sectionName'];
    }

    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
