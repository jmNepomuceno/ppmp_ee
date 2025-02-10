let modal_viewRequest = new bootstrap.Modal(document.getElementById('modal-view-request'));
// modal_viewRequest.show()

let selectedRequest_data = {}
const dataTable = () =>{
    try {
        $.ajax({
            url: '../php/fetch_orderRequest.php',
            method: "GET",
            dataType : "json",
            success: function(response) {
                console.log(response)
                try {
                    let dataSet = [];
                    for(let i = 0; i < response.length; i++){
                        dataSet.push([
                            `<span>${i + 1}</span>`,
                            `<span>${response[i].order_by_name}</span>`,
                            `<span class="request-section-span" id='${response[i].order_by_sectionName}'>${response[i].order_by_sectionName}</span>`,
                            `<span class='view-request-span' id='${response[i].orderID}'> VIEW </span>`,
                        ])
                    }
                    console.log(dataSet)

                    $('#cart-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME", data:1 },
                            { title: "SECTION", data:2 },
                            { title: "REQUEST ITEM", data:3 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-id-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } },
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-price-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
                        ],
                        // "paging": false,
                        // "info": false,
                        // "ordering": false,
                        // "stripeClasses": [],
                        // "search": false
                    });

                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });
    } catch (ajaxError) {
        console.error("Unexpected error occurred:", ajaxError);
    }
   
}

const dataTable_viewRequest = (orderID, sectionName) =>{
    $.ajax({
        url: '../php/view_orderRequest.php',
        method: "POST",
        data : {
            view_orderID : orderID
        },
        dataType : 'JSON',
        success: function(response) {
            console.log(response)
            // Separate indexed array and object from the response object
            let indexedArray = [];
            let cartObject = {};

            for (const key in response) {
                if (!isNaN(key)) {
                    indexedArray[parseInt(key)] = response[key]; // Store in an array
                } else {
                    cartObject[key] = response[key]; // Store non-numeric keys in an object
                }
            }
            
            selectedRequest_data['items'] = indexedArray
            selectedRequest_data['orderID'] = response.orderID
            selectedRequest_data['orderItem'] = response.order_item

            // Truncate long product names
            for (let i = 0; i < indexedArray.length; i++) {
                if (indexedArray[i].length > 75) {
                    indexedArray[i] = indexedArray[i].substring(0, 35) + "...";
                }
            }

            if ($.fn.DataTable.isDataTable('#cart-table-request')) {
                $('#cart-table-request').DataTable().destroy();
                $('#cart-table-request tbody').empty(); // Clear previous table body
            }

            // populate the data set
            let dataSet = [], total_subtotal = 0;
            for (let i = 0; i < indexedArray.length; i++) {
                let item = cartObject.order_item[i];

                // Remove "P" and commas, then convert to a float
                let cleanPrice = parseFloat(item.itemPrice.replace(/P|\s|,/g, '')) * parseInt(item.itemQuantity);
                let formattedPrice = "P " + cleanPrice.toLocaleString();
                total_subtotal += cleanPrice;

                dataSet.push([
                    // gawin mo na lanag div sa susunod
                    `<span class='item-id-span' style='display:none;'>${item.itemID}</span>`,
                    // `<img src="../images/${item.itemImage}" alt="item-image" class="img-fluid" style="width: 100px; height: 100px;" />`,
                    // item.itemID,
                    `<span class='item-name-span'>${indexedArray[i]}</span>`,
                    `<span class='item-price-span'>${ "P " + parseFloat(item.itemPrice.replace(/P|\s|,/g, '')).toLocaleString()}</span>`,
                    `<input class='item-quantity-span' type='number' value='${item.itemQuantity}' />`,
                    `<span class="item-subtotal-span">${formattedPrice}</span>`, 
                    `<div class="action-btn-div"> 
                        <button class='btn btn-danger remove-item-btn'>Reject</button>
                        <button class='btn btn-success update-item-btn'>Update</button>
                    </div>`
                ]);
            }
            

            dataSet.push([
                "<span style='visibility:hidden;'>asdf</span> ",
                "<span style='visibility:hidden;'>asdf</span> ",
                "<span style='visibility:hidden;'>asdf</span> ",
                "<span style='visibility:hidden;'>asdf</span> ",
                `<span class="total-subtotal-span">P ${total_subtotal.toLocaleString()}</span>`,
                ""
            ]);

            console.log(dataSet)
            $('#cart-table-request').DataTable({
                data: dataSet,
                columns: [
                    { title: "IMAGE", data:0 },
                    { title: "PRODUCT", data:1 },
                    { title: "PRICE", data:2 },
                    { title: "QUANTITY", data:3 },
                    { title: "SUBTOTAL", data:4 },
                    { title: "ACTION", data:5 },
                ],
                columnDefs: [
                    { targets: 0, createdCell: function(td) { $(td).addClass('item-id-td'); } },
                    { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } },
                    { targets: 2, createdCell: function(td) { $(td).addClass('item-price-td'); } },
                    { targets: 3, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
                    { targets: 4, createdCell: function(td) { $(td).addClass('item-subtotal-td'); } },
                    { targets: 5, createdCell: function(td) { $(td).addClass('action-btn-td'); } }
                ]
                // "paging": false,
                // "info": false,
                // "ordering": false,
                // "stripeClasses": []
            });
            // 
            $('#modal-view-request #modal-title-incoming').text(`${sectionName} Request`)
        }
    });
}

$(document).ready(function(){
    dataTable()

    $('#inventory-list-sub-div').click(function(){
        window.location.href = "../views/home.php";
    });

    $('#logout-btn').click(function(){
        $.ajax({
            url: '../php/logout.php',
            method: "GET",
            
            success: function(response) {
                window.location.href = response;
            }
        });
    });

    $(document).off('click', '.view-request-span').on('click', '.view-request-span', function() {      
        const index = $('.view-request-span').index(this);
        const orderID = $('.view-request-span').eq(index).attr('id')
        const sectionName = $('.request-section-span').eq(index).attr('id')
        modal_viewRequest.show(
            dataTable_viewRequest(orderID, sectionName)
        )
    });

    // approve-request-btn
    $(document).off('click', '#approve-request-btn').on('click', '#approve-request-btn', function() {    
        console.log(selectedRequest_data)
        try {
            $.ajax({
                url: '../php/approve_request.php',
                data : selectedRequest_data,
                method: "POST",
                // dataType : "json",
                success: function(response) {
                    console.log(response)
                    try {
                    } catch (innerError) {
                        console.error("Error processing response:", innerError);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX request failed:", error);
                }
            });
        } catch (ajaxError) {
            console.error("Unexpected error occurred:", ajaxError);
        }
    }) 

})