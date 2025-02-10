<?php 
    session_start();
    include('../assets/connection/sqlconnection.php');
    date_default_timezone_set('Asia/Manila');
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="../css/imiss_inventory.css">
    <?php require "../links/header_link.php" ?>
</head>
<body>
    <?php 
        $view = "incoming-order-sub-div";
        include("./sidebar.php")
    ?>


    <div class="right-container">
        <h1>Incoming PPMP Request</h1>
        <div class="table-div">
            <table id="cart-table" class="display">
                <thead>
                    <tr >
                        <th>REQUEST NO.</th>
                        <th>NAME</th>
                        <th>SECTION</th>
                        <th>REQUEST ITEM</th>
                    </tr>
                </thead>

                <tbody>
                   
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal fade" id="modal-view-request" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered custom-modal-width modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel"></h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    <table id="cart-table-request" class="display">
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
                    <button id="approve-request-btn" type="button">APPROVE REQUEST</button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Your Cart</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <?php require "../links/script_links.php" ?>
    <script> 
        var section = "<?php echo $section ?>";
    </script>
    <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/incoming_order_function.js?v=<?php echo time(); ?>"></script>
</body>
</html>