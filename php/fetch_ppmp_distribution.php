<?php
session_start();
include('../assets/connection/sqlconnection.php');
date_default_timezone_set('Asia/Manila');


try {
    // Fetch all necessary data with JOINs to avoid multiple queries
    $sql = "
        SELECT 
            f.*, 
            pr.order_by_section, 
            s.sectionName
        FROM imiss_ppmp_finaldraft f
        LEFT JOIN ppmp_request pr ON f.orderID = pr.orderID
        LEFT JOIN pgssection s ON pr.order_by_section = s.sectionID
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $groupedItems = [];

    foreach ($data as $row) {
        $itemID = $row['itemID'];
        $sectionName = $row['sectionName'];
        $quantity = $row['itemTotalQuantity'];

        // Initialize the item if it does not exist in groupedItems
        if (!isset($groupedItems[$itemID])) {
            $groupedItems[$itemID] = [
                'itemID' => $itemID,
                'itemDescription' => $row['itemDescription'],
                'itemUnit' => $row['itemUnit'],
                'itemUnitPrice' => $row['itemUnitPrice'],
                'sections' => [],
                'totalQuantity' => 0
            ];
        }

        // If section exists, sum the quantity; otherwise, add the section
        if (!isset($groupedItems[$itemID]['sections'][$sectionName])) {
            $groupedItems[$itemID]['sections'][$sectionName] = $quantity;
        } else {
            $groupedItems[$itemID]['sections'][$sectionName] += $quantity;
        }

        // Add to total quantity of the item
        $groupedItems[$itemID]['totalQuantity'] += $quantity;
    }

    // Convert sections into a proper array format
    foreach ($groupedItems as &$item) {
        $item['sections'] = array_map(function ($section, $qty) {
            return ['section' => $section, 'total_quantity' => $qty];
        }, array_keys($item['sections']), $item['sections']);
    }

    // Convert associative array to indexed array
    $finalData = array_values($groupedItems);

    echo json_encode($finalData, JSON_PRETTY_PRINT);
    // echo '<pre>'; print_r($finalData); echo '</pre>';  
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}


// e/i ka wo/u lo/u ngo/u
// i ka wa la nga
?>
