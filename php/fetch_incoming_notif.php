<?php
include ('../session.php');
include('../assets/connection/sqlconnection.php');


try {
    $notifReceiever = ($_SESSION["role"] == "admin") ? "admin" : (int)$_SESSION["section"];

    $sql = "SELECT * FROM ppmp_notification WHERE notifReceiver=? and isRead=0";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$notifReceiever]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $notifCount = count($data);
    $notifHtml = "";

    foreach ($data as $notif) {
        $dateTime = new DateTime($notif['created_at']);
        $formattedTime = $dateTime->format("g:ia");

        $notifTitle = "";
        $iconValue = "";

        switch ($notif['notifStatus']) {
            case "incoming_request":
                $notifTitle = "Incoming Request";
                $iconValue = '<i class="fa-solid fa-clipboard-list"></i>';
                break;
            case "updated":
                $notifTitle = "Update Request";
                $iconValue = '<i class="fa-solid fa-arrows-rotate"></i>';
                break;
            case "cancelled":
                $notifTitle = "Cancelled Request";
                $iconValue = '<i class="fa-solid fa-ban"></i>';
                break;
            case "rejected":
                $notifTitle = "Rejected Request";
                $iconValue = '<i class="fa-solid fa-circle-xmark"></i>';
                break;
            case "approved":
                $notifTitle = "Approved Request";
                $iconValue = '<i class="fa-solid fa-circle-check"></i>';
                break;
        }

        $notifHtml .= '
            <div class="navbar-notif-row unread">
                '.$iconValue.'
                <div class="navbar-notif-main-container">
                    <span class="navbar-notif-time">'.$formattedTime.'</span>
                    <div class="navbar-notif-sub-main-container">
                        <span class="navbar-notif-title">'.$notifTitle.'</span>
                        <span class="navbar-notif-desc">'.$notif['notifMessage'].'</span>    
                    </div>
                </div>
            </div>
        ';
    }

    // Send JSON response
    echo json_encode([
        "html" => $notifHtml,
        "count" => $notifCount,
        "data" => $data, // raw notification data
    ]);
}  catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
