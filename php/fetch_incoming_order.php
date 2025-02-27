<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');


try {
    $sql = "SELECT COUNT(*) AS pending_count FROM ppmp_request WHERE order_status = 'Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    $pending_count = $count['pending_count'];

    echo $pending_count;
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
