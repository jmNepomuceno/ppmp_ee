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
                $_POST['items'][$i],
                $_POST['orderItem'][$i]['itemQuantity'],      
                "set",      
                $itemPrice,      
                $itemPrice * (int)$_POST['orderItem'][$i]['itemQuantity'],      
                "Public Bidding",
                $quarterly
            ]);
    }

    echo json_encode($_POST);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
