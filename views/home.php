<?php 
    session_start();
    include('../assets/connection/sqlconnection.php');
    date_default_timezone_set('Asia/Manila');

    // echo print_r($_SESSION);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHOP-PPMPee</title>
    <link rel="stylesheet" href="../css/home.css">

    <?php require "../links/header_link.php" ?>
</head>
<body>
    <div class="left-container">
        <div class="home-name-div">
            <img id="home-img" src="../source/landing_css/logo.PNG" alt="logo-img" >
        </div>

        <div class="side-bar-route">
            <div class="side-bar-routes" id="inventory">
                <i class="fa-solid fa-box"></i>
                <span>Inventory</span>
            </div>

            <div class="side-bar-routes" id="sample">
                <i class="fa-solid fa-box"></i>
                <span>Inventory</span>
            </div>

            <div class="side-bar-routes" id="sample_2">
                <i class="fa-solid fa-box"></i>
                <span>Inventory</span>
            </div>
        </div>

        <div class="user-acc-div">
            <span id="user-section-span">IMISS</span>
            <div class="vl"></div>
            <span id="user-name-span">JOHN MARVIN GOMEZ NEPOMUCENO</span>
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>
    </div>


    <div class="right-container">

        <div class="function-bar">
            <div class="search-bar">
                <input type="text" id="search-input"/>
                <button id="search-btn">Search</button>
            </div>

            <img id="cart-icon" src="../source/home_css/cart.png" alt="cart-icon">
        </div>

        <div class="inventory-div">
            <?php for($i = 1; $i <= 10; $i++){?>
                <div class="tiles-div" id="tile-div-1">
                    <img src="../source/inventory_image/item_1.png" alt="item-1-img">

                    <p id="item-description">Brand New Desktop Computer</p>
                    <span id="item-price">P 80,000.00</span>
                    
                    <div class="function-div">
                        <div class="add-div">
                            <span class="current-total-span">0</span>
                            <button class="add-btn">+</button>
                        </div>
                        <button id="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>



    <?php require "../links/script_links.php" ?>
    <script src="../js/home_traverse.js"></script>
    <script src="../js/home_function.js"></script>
</body>
</html>
 