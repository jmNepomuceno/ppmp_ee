let modal_viewRequest = new bootstrap.Modal(document.getElementById('modal-view-request'));
let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));

let selectedRequest_data = {}
let incoming_orderID_clicked = ""
let orig_quantity_before_update_user = []

const dataTable = (filter) =>{
    console.log(filter)
    try {
        $.ajax({
            url: '../php/fetch_orderRequest.php',
            method: "POST",
            data : {
                filter : filter
            },
            dataType : "json",
            success: function(response) {
                console.log(response)
                try {
                    let dataSet = [];


                    for(let i = 0; i < response.length; i++){
                        let status_style = ""
                        if(response[i].order_status === "Pending"){
                            status_style = "background:#ffcc33;"
                        }else if(response[i].order_status === "Approved"){
                            status_style = "background:#5bd778";
                        }else if(response[i].order_status === "Cancelled" || response[i].order_status === "Rejected"){
                            status_style = "background:#e05260;"
                        }

                        dataSet.push([
                            `<span>${i + 1}</span>`,
                            `<span>${response[i].order_by_name}</span>`,
                            `<span class="request-section-span" id='${response[i].order_by_sectionName}'>${response[i].order_by_sectionName}</span>`,
                            `<span>${response[i].order_date}</span>`,
                            `<span class='view-request-span' id='${response[i].orderID}'> VIEW </span>`,
                            `<span class='span-status-incoming' style="${status_style}"> ${response[i].order_status} </span>`,
                        ])
                    }  
                    console.log(dataSet)

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
                            { title: "DATE", data:3 },
                            { title: "REQUEST ITEM", data:4 },
                            { title: "STATUS", data:5 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-id-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } },
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-price-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
                            { targets: 4, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
                            { targets: 5, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
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

            if(response != false){
                selectedRequest_data['orderID'] = response.orderID
                selectedRequest_data['orderItem'] = response.order_item

                // Truncate long product names
                for (let i = 0; i < response.order_item.length; i++) {
                    if (response.order_item[i].length > 75) {
                        response.order_item[i] = response.order_item[i].substring(0, 35) + "...";
                    }
                }

                if ($.fn.DataTable.isDataTable('#cart-table-request')) {
                    $('#cart-table-request').DataTable().destroy();
                    $('#cart-table-request tbody').empty(); // Clear previous table body
                }

                // populate the data set
                let dataSet = [], total_subtotal = 0;
                for (let i = 0; i < response.order_item.length; i++) {
                    let item = response.order_item[i];

                    // Remove "P" and commas, then convert to a float
                    let cleanPrice = parseFloat(item.itemPrice.replace(/P|\s|,/g, '')) * parseInt(item.itemQuantity);
                    let formattedPrice = "P " + cleanPrice.toLocaleString();
                    total_subtotal += cleanPrice;

                    orig_quantity_before_update_user.push(parseInt(item.itemQuantity))
                    let rowData = []
                    if(response.order_status == 'Pending'){
                        rowData  = [
                            `<span class='item-id-span'>${item.itemID}</span>`,
                            `<span class='item-image-span'><img src="${item.itemImage}" alt="item-1-img"/></span>`,
                            `<span class='item-name-span'>${item.itemName}</span>`,
                            `<span class='item-price-span'>${"P " + parseFloat(item.itemPrice.replace(/P|\s|,/g, '')).toLocaleString()}</span>`,
                            `<input class='item-quantity-span' type='number' value='${item.itemQuantity}' />`,
                            `<span class='item-subtotal-span'>${formattedPrice}</span>`,
                            `<div class='action-btn-div'> 
                                    <button class='btn btn-danger remove-item-btn'>Reject</button>
                                    <button class='btn btn-success update-item-btn'>Update</button>
                                </div>
                            `
                        ];
                    }else{
                        rowData  = [
                            `<span class='item-id-span'>${item.itemID}</span>`,
                            `<span class='item-image-span'><img src="${item.itemImage}" alt="item-1-img"/></span>`,
                            `<span class='item-name-span'>${item.itemName}</span>`,
                            `<span class='item-price-span'>${"P " + parseFloat(item.itemPrice.replace(/P|\s|,/g, '')).toLocaleString()}</span>`,
                            `<input class='item-quantity-span' type='number' value='${item.itemQuantity}' />`,
                            `<span class='item-subtotal-span'>${formattedPrice}</span>`,
                            `<span class='item-price-span'>${response.order_status}</span>`,
                        ];
                    }
                   


                    dataSet.push(rowData);
                }
                

                dataSet.push([
                    "<span style='visibility:hidden;'>asdf</span> ",
                    "<span style='visibility:hidden;'>asdf</span> ",
                    "<span style='visibility:hidden;'>asdf</span> ",
                    "<span style='visibility:hidden;'>asdf</span> ",
                    `<span class="total-subtotal-span">P ${total_subtotal.toLocaleString()}</span>`,
                    "<span style='visibility:hidden;'>asdf</span> ",
                    "<span style='visibility:hidden;'>asdf</span> ",

                ]);

                console.log(dataSet)
                $('#cart-table-request').DataTable({
                    data: dataSet,
                    columns: [
                        { title: "ITEM ID", data:0},
                        { title: "IMAGE", data:1 },
                        { title: "PRODUCT", data:2 },
                        { title: "PRICE", data:3 },
                        { title: "QUANTITY", data:4 },
                        { title: "SUBTOTAL", data:5 },
                        { title: "ACTION", data:6 },
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('item-id-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('item-image-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('item-name-td'); } },
                        { targets: 3, createdCell: function(td) { $(td).addClass('item-price-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('item-quantity-td'); } },
                        { targets: 5, createdCell: function(td) { $(td).addClass('item-subtotal-td'); } },
                        { targets: 6, createdCell: function(td) { $(td).addClass('action-btn-td'); } }
                    ],
                    // "paging": false,
                    // "info": false,
                    // "ordering": false,
                    // "stripeClasses": []
                });
                // 
                $('#modal-view-request #modal-title-incoming').text(`${sectionName} Request`)
            }else{
                if ($.fn.DataTable.isDataTable('#cart-table-request')) {
                    $('#cart-table-request').DataTable().destroy();
                    $('#cart-table-request tbody').empty(); // Clear previous table body
                    dataTable("Pending")
                }
            }
            
        }
    });
}

$(document).ready(function(){
    dataTable("Pending")

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
        incoming_orderID_clicked = orderID
        incoming_sectionName_clicked = sectionName
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
                dataType : "json",
                success: function(response) {
                    console.log(response)

                    dataTable("Pending")
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

    $(document).off('change', '.item-quantity-span').on('change', '.item-quantity-span', function() {        
        const index = $('.item-quantity-span').index(this);

        if (parseInt($(this).val()) < 1 || $(this).val() === '') {
            $(this).val(1); // Reset to 0 if negative
        }

        if($('.item-quantity-span').eq(index).val() != orig_quantity_before_update_user[index]){
            $('.update-item-btn').eq(index).css('opacity', '1');
            $('.update-item-btn').eq(index).css('pointer-events', 'auto');
        }else{
            $('.update-item-btn').eq(index).css('opacity', '0.3');
            $('.update-item-btn').eq(index).css('pointer-events', 'none');
        }
    });

    $(document).off('click', '.update-item-btn').on('click', '.update-item-btn', function() {        
        const index = $('.update-item-btn').index(this);
        // console.log({
        //     orderID : incoming_orderID_clicked,
        //     itemID: $('.item-id-span').eq(index).text(),
        //     itemQuantity: $('.item-quantity-span').eq(index).val(),
        //     action : "update"
        // })

        try {
            $.ajax({
                url: '../php/update_pending_request.php',
                method: "POST",
                data: {
                    orderID : incoming_orderID_clicked,
                    itemID: $('.item-id-span').eq(index).text(),
                    itemQuantity: $('.item-quantity-span').eq(index).val(),
                    action : "update",
                    from : "admin"
                },
                success: function(response) {
                    try {
                        dataTable_viewRequest(incoming_orderID_clicked, incoming_sectionName_clicked)
                        $('#modal-notif .modal-content .modal-header .modal-title-incoming').text("Successfully Updated")
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
                    action : "delete",
                    from : "admin"
                },
                // dataType : 'json',
                success: function(response) {
                    try { 
                        console.log(response)
                        const orderID = incoming_orderID_clicked
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

    // $(document).off('click', '#close-modal-btn-incoming').on('click', '#close-modal-btn-incoming', function() {        
    //     dataTable("Pending")
    // });

    $(document).off('click', '#pending-btn').on('click', '#pending-btn', function() {        
        dataTable("Pending")
    });

    $(document).off('click', '#approved-btn').on('click', '#approved-btn', function() {        
        dataTable("Approved")
    });

    $(document).off('click', '#rejected-btn').on('click', '#rejected-btn', function() {        
        dataTable("Rejected")
    });

    $(document).off('click', '#cancelled-btn').on('click', '#cancelled-btn', function() {        
        dataTable("Cancelled")
    });

    $(document).off('click', '#all-btn').on('click', '#all-btn', function() {        
        dataTable("All")
    });

})