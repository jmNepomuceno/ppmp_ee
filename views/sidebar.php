<?php 

    $section;
    try {
        $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['section']]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $section = $data[0]['sectionName'];
        $_SESSION["sectionName"] = $section;

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }

    $sql = "SELECT permission FROM permission WHERE role=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['role']]);
    $permission_account = $stmt->fetch(PDO::FETCH_ASSOC);
    $permissions = json_decode($permission_account['permission'], true);

    // print_r($permissions);
?>


    <div class="left-container">
        <div class="home-name-div">
            <img id="home-img" src="../source/landing_css/logo.PNG" alt="logo-img" >
        </div>

        <div class="side-bar-route">
            <div class="side-bar-routes" id="inventory-list-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Inventory List</span>
            </div>

            <div class="side-bar-routes" id="order-management-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Order Management</span>
            </div>

            <?php if ($permissions['admin_function'] != false) { ?>
                <div class="side-bar-routes" id="incoming-order-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Incoming Order</span>
                </div>
                
                <div class="side-bar-routes" id="imiss-inventory-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>IMISS Inventory</span>
                </div>

                <div class="side-bar-routes" id="imiss-ppmp-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>IMISS PPMP</span>
                </div>
            <?php } ?>

        </div>

        <div class="user-acc-div">
            <span id="user-section-span"><?php echo $section ?></span>
            <div class="vl"></div>
            <span id="user-name-span"><?php echo $_SESSION["name"] ?></span>
            <i class="fa-solid fa-right-from-bracket" id="logout-btn"></i>
        </div>
    </div>

    <script> 
        var view = "<?php echo $view ?>";
    </script>
</body>