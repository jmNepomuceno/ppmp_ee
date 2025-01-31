<?php 
    session_start();
    include('../assets/connection/sqlconnection.php');
    date_default_timezone_set('Asia/Manila');

    // echo '<pre>'; print_r($_SESSION["section"]); echo '</pre>';

    $section;
    try {
        $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['section']]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $section = $data[0]['sectionName'];
        $_SESSION["sectionName"] = $section;

        $sql = "SELECT * FROM imiss_inventory";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $item_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        for($i = 0; $i < count($item_data); $i++) {
            if (isset($item_data[$i]['itemName']) && strlen($item_data[$i]['itemName']) > 75) {
                $item_data[$i]['itemName'] = substr($item_data[$i]['itemName'], 0, 75) . "...";
            }
        }


    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }

    // // echo $section;
    // try {
    //     $cart = json_encode(["itemID" => new stdClass()]);  // Outputs {"itemID":{}}
    //     $sql = "INSERT INTO user_cart (bioID, fullName, divisionID, divisionName, cart) VALUES (?,?,?,?,?)";
    //     $stmt = $pdo->prepare($sql);
    //     $stmt->execute([$_SESSION["user"] , $_SESSION["name"] , $_SESSION["section"] , $section, $cart]);
    // } catch (PDOException $e) {
    //     die("Database error: " . $e->getMessage());
    // }

    // <?php $item_data[$i]['itemName'] 

    // $sql = "SELECT bioID,cart FROM user_cart WHERE bioID=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION["user"]]);
    // $duplicate = $stmt->fetch(PDO::FETCH_ASSOC);

    // echo '<pre>'; print_r($duplicate); echo '</pre>';
    // echo isset($duplicate);

    // $sql = "DELETE FROM user_cart ";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHOP-PPMPee</title>
    <link rel="stylesheet" href="../css/home.css">

    <?php require "../links/header_link.php" ?>
    <!-- <style>
        .custom-modal-width {
            max-width: 75vw; /* Adjust the width as per your requirements */
            width: 100%;
        }

        /* @media only screen and (max-height: 800px){
            #myModal-hospitalAndUsers #modal-body-main{
                height: 500px;
            }

            .custom-modal-width {
                max-width: 90vw;
                width: 100%;
            }
        } */
    </style> -->
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

            <div class="side-bar-routes" id="order-management">
                <i class="fa-solid fa-box"></i>
                <span>Order Management</span>
            </div>

            <div class="side-bar-routes" id="sample_2">
                <i class="fa-solid fa-box"></i>
                <span>Sample</span>
            </div>
        </div>

        <div class="user-acc-div">
            <span id="user-section-span"><?php echo $section ?></span>
            <div class="vl"></div>
            <span id="user-name-span"><?php echo $_SESSION["name"] ?></span>
            <i class="fa-solid fa-right-from-bracket" id="logout-btn"></i>
        </div>
    </div>


    <div class="right-container">

        <div class="function-bar">
            <div class="search-bar">
                <input type="text" id="search-input"/>
                <button id="search-btn">Search</button>
            </div>
            
            <div class="cart-div">
                <img id="item-img-animation" src="../source/inventory_image/item_1.png" alt="item-1-img">
                <span id="notif-value">0</span>
                <!-- <img id="cart-icon" src="../source/home_css/cart.png" alt="cart-icon" data-bs-toggle="modal" data-bs-target="#modal-place-order"> -->
                <i class="fa-solid fa-cart-shopping" id="cart-icon" data-bs-toggle="modal" data-bs-target="#modal-place-order"></i>
            </div>
        </div>

        <div class="inventory-div">
            <?php for($i = 0; $i < count($item_data); $i++){?>
                <div class="tiles-div" id="tile-div-1">
                    <img class="item-img" src="../source/inventory_image/item_1.png" alt="item-1-img">
                    
                    <p class="item-description"><?php echo $item_data[$i]['itemName'] ?> <span style="display:none" class="item-id"><?php echo $item_data[$i]['itemID'] ?></span></p>
                    <span class="item-price">P 80,000.00</span>
                    
                    <div class="function-div">
                        <div class="add-div">
                            <button class="minus-btn">-</button>
                            <span class="current-total-span">0</span>
                            <button class="add-btn">+</button>
                        </div>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>

    <div class="modal fade" id="modal-place-order" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered custom-modal-width modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Your Cart</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    <table id="cart-table" class="display">
                        <thead>
                            <tr >
                                <th>IMAGE</th>
                                <th>PRODUCT</th>
                                <th>PRICE</th>
                                <th>QUANTITY</th>
                                <th>SUBTOTAL</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            <!-- <tr >
                                <td><img src="../source/inventory_image/item_1.png" alt="item-1-img"></td>
                                <td>Brand New Desktop Computer</td>
                                <td>P 80,000.00</td>
                                <td>1</td>
                                <td>P 80,000.00</td>
                                <td><button id="remove-item-btn">Remove</button></td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                    <button id="placeorder-modal-btn-incoming" type="button">PLACE ORDER</button>
                </div>
            </div>
        </div>
    </div>



    <?php require "../links/script_links.php" ?>
    <script> 
        var section = "<?php echo $section ?>";
    </script>
    <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/home_function.js?v=<?php echo time(); ?>"></script>

</body>
</html>
 