<?php 
    session_start();
    include('./assets/connection/sqlconnection.php');
    date_default_timezone_set('Asia/Manila');

    // $sql = "SELECT * FROM request_history";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo '<pre>'; print_r($data); echo '</pre>';

    $sql = "DELETE FROM ppmp_request WHERE orderID='ORDER00011'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $sql = "DELETE FROM request_history WHERE orderID='ORDER00011'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
 
?>