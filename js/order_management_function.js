let modal_viewRequest = new bootstrap.Modal(document.getElementById('modal-view-request'));
let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));
let modal_imiss_update = new bootstrap.Modal(document.getElementById('modal-view-update'));
// modal_imiss_update.show()
// modal_notif.show()

let selectedRequest_data = {}
let incoming_orderID_clicked = ""
let history_update_response = {}
const dataTable = () =>{
    try {
        $.ajax({
            url: '../php/fetch_orderReqUser.php',
            method: "GET",
            dataType : "json",
            success: function(response) {
                console.log(response)
                try {
                    let dataSet = [];
                    for(let i = 0; i < response.length; i++){
                        let imiss_update = (response[i].history_update.length > 0) ? "VIEW" : "NONE"
                        dataSet.push([
                            `<span>${i + 1}</span>`,
                            `<span>${response[i].order_date}</span>`,
                            `<span class="request-section-span" id="${response[i].order_by_sectionName}">${response[i].order_status}</span>`,
                            `<span class='view-request-span' id='${response[i].orderID}'> VIEW </span>`,
                            `<span class='imiss-update-span'> ${imiss_update} </span>`,
                        ])

                        history_update_response[i] = response[i].history_update
                    }  
                    console.log(dataSet)

                    $('#cart-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "DATE", data:1 },
                            { title: "STATUS", data:2 },
                            { title: "REQUEST ITEM", data:3 },
                            { title: "IMISS UPDATE", data:4 },
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
                        <button class='btn btn-danger remove-item-btn'>Cancel</button>
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

const dataTable_viewUpdate = (orderID, sectionName , history_update) =>{
    $.ajax({
        url: '../php/view_orderRequest.php',
        method: "POST",
        data : {
            view_orderID : orderID
        },
        dataType : 'JSON',
        success: function(response) {
            console.log(response)
            console.log(history_update)

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

            if ($.fn.DataTable.isDataTable('#cart-table-update')) {
                $('#cart-table-update').DataTable().destroy();
                $('#cart-table-update tbody').empty(); // Clear previous table body
            }

            // populate the data set
            let dataSet = [], total_subtotal = 0;

            for (let i = 0; i < indexedArray.length; i++) {
                let item = cartObject.order_item[i];
            
                // Remove "P" and commas, then convert to a float
                let cleanPrice = parseFloat(item.itemPrice.replace(/P|\s|,/g, '')) * parseInt(item.itemQuantity);
                let formattedPrice = "P " + cleanPrice.toLocaleString();
                total_subtotal += cleanPrice;
            
                // 🔹 Push current item row first
                let currentRow = [
                    `<span class='item-id-span' style='display:none;'>${item.itemID}</span>`,
                    `<span class='item-name-span'>${indexedArray[i]}</span>`,
                    `<span class='item-price-span'>${"P " + parseFloat(item.itemPrice.replace(/P|\s|,/g, '')).toLocaleString()}</span>`,
                    `<input class='item-quantity-span' type='number' value='${item.itemQuantity}' />`,
                    `<span class="item-subtotal-span">${formattedPrice}</span>`, 
                ];
                dataSet.push(currentRow);
            
                // 🔹 Check history and compare
                if (history_update.length > 0 && history_update[0].previousOrder[i]) {
                    let previousItem = history_update[0].previousOrder[i];
                    let isEqual = JSON.stringify(previousItem) === JSON.stringify(item);
            
                    console.log(`Comparing item ${i}:`, isEqual);
                    console.log("Previous Order:", previousItem);
            
                    // 🔹 Push the previous order as a full row, formatted properly
                    if (!isEqual) {
                        let historyRow = [
                            `<span class='item-id-span' style='display:none;'>${previousItem.itemID}</span>`,
                            `<span class='item-name-span' style='color: red;'>${indexedArray[i]} (Previous)</span>`, 
                            `<span class='item-price-span' style='color: red;'>${"P " + parseFloat(previousItem.itemPrice.replace(/P|\s|,/g, '')).toLocaleString()}</span>`,
                            `<input class='item-quantity-span' type='number' value='${previousItem.itemQuantity}' style='color: red;' disabled />`,
                            `<span class="item-subtotal-span" style='color: red;'>P ${(parseFloat(previousItem.itemPrice.replace(/P|\s|,/g, '')) * parseInt(previousItem.itemQuantity)).toLocaleString()}</span>`, 
                        ];
                        dataSet.push(historyRow); // Always push this AFTER the current row
                    }
                }
            }
            

            // dataSet.push([
            //     "<span style='visibility:hidden;'>asdf</span> ",
            //     "<span style='visibility:hidden;'>asdf</span> ",
            //     "<span style='visibility:hidden;'>asdf</span> ",
            //     "<span style='visibility:hidden;'>asdf</span> ",
            //     `<span class="total-subtotal-span">P ${total_subtotal.toLocaleString()}</span>`,
            // ]);

            console.log(dataSet)
            $('#cart-table-update').DataTable({
                data: dataSet,
                columns: [
                    { title: "IMAGE", data:0 },
                    { title: "PRODUCT", data:1 },
                    { title: "PRICE", data:2 },
                    { title: "QUANTITY", data:3 },
                    { title: "SUBTOTAL", data:4 },
                ]
                
                // "paging": false,
                // "info": false,
                // "ordering": false,
                // "stripeClasses": []
            });
            // 
            $('#modal-view-update #modal-title-incoming').text(`${sectionName} Request`)
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
        console.log(sectionName)
        incoming_orderID_clicked = orderID
        modal_viewRequest.show(
            dataTable_viewRequest(orderID, sectionName)
        )
    });

    $(document).off('click', '.imiss-update-span').on('click', '.imiss-update-span', function() {      
        const index = $('.imiss-update-span').index(this);

        const orderID = $('.view-request-span').eq(index).attr('id')
        const sectionName = $('.request-section-span').eq(index).attr('id')
        incoming_orderID_clicked = orderID
        modal_imiss_update.show(
            dataTable_viewUpdate(orderID, sectionName, history_update_response[index])
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
                dataType : "json",
                success: function(response) {
                    console.log(response)

                    let dataSet = [];
                    for(let i = 0; i < response.length; i++){
                        dataSet.push([
                            `<span>${i + 1}</span>`,
                            `<span>${response[i].order_by_name}</span>`,
                            `<span class="request-section-span" id='${response[i].order_by_sectionName}'>${response[i].order_by_sectionName}</span>`,
                            `<span class='view-request-span' id='${response[i].orderID}'> VIEW </span>`,
                        ])
                    }

                    if ($.fn.DataTable.isDataTable('#cart-table')) {
                        $('#cart-table').DataTable().destroy();
                        $('#cart-table tbody').empty(); // Clear previous table body
                    }

                    $('#cart-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME", data:1 },
                            { title: "SECTION", data:2 },
                            { title: "REQUEST ITEM", data:3 },
                        ]
                    })

                    modal_viewRequest.hide()
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

    $(document).off('change input', '.item-quantity-span').on('change input', '.item-quantity-span', function() {        
        const index = $('.item-quantity-span').index(this);
        
        if (parseInt($(this).val()) < 1 || $(this).val() === '') {
            $(this).val(1); // Reset to 0 if negative
        }

        $('.update-item-btn').eq(index).css('opacity', '1');
        $('.update-item-btn').eq(index).css('pointer-events', 'auto');
    });

    $(document).off('click', '.update-item-btn').on('click', '.update-item-btn', function() {        
        const index = $('.update-item-btn').index(this);
        try {
            $.ajax({
                url: '../php/update_pending_request.php',
                method: "POST",
                data: {
                    orderID : incoming_orderID_clicked,
                    itemID: $('.item-id-span').eq(index).text(),
                    itemQuantity: $('.item-quantity-span').eq(index).val(),
                    action : "update"
                },
                success: function(response) {
                    try {
                        $('#modal-notif .modal-content .modal-header .modal-title-incoming').text("Successfully Updated")
                        modal_notif.show()
                        // console.log(response)
                        // const orderID = $('.view-request-span').eq(index).attr('id')
                        // const sectionName = $('.request-section-span').eq(index).attr('id')
                        // dataTable_viewRequest(orderID, sectionName)

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
    });

    $(document).off('click', '.remove-item-btn').on('click', '.remove-item-btn', function() {        
        const index = $('.remove-item-btn').index(this);
        try {
            $.ajax({
                url: '../php/update_pending_request.php',
                method: "POST",
                data: {
                    orderID : incoming_orderID_clicked,
                    itemID: $('.item-id-span').eq(index).text(),
                    itemQuantity: $('.item-quantity-span').eq(index).val(),
                    action : "delete"
                },
                success: function(response) {
                    try {
                        const orderID = $('.view-request-span').eq(index).attr('id')
                        const sectionName = $('.request-section-span').eq(index).attr('id')
                        dataTable_viewRequest(orderID, sectionName)

                        $('#modal-notif .modal-content .modal-header .modal-title-incoming').text("Successfully Cancelled")
                        modal_notif.show()
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
    });

})