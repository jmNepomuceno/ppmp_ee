let modal_placeorder = new bootstrap.Modal(document.getElementById('modal-place-order'));
let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));
// modal_placeorder.show()

const dataTable = () =>{
    $.ajax({
        url: '../php/checkCurrentCart.php',
        method: "POST",
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
            

            // Truncate long product names
            for (let i = 0; i < indexedArray.length; i++) {
                if (indexedArray[i].length > 75) {
                    indexedArray[i] = indexedArray[i].substring(0, 35) + "...";
                }
            }

            if ($.fn.DataTable.isDataTable('#cart-table')) {
                $('#cart-table').DataTable().destroy();
                $('#cart-table tbody').empty(); // Clear previous table body
            }

            // populate the data set
            let dataSet = [], total_subtotal = 0;
            for (let i = 0; i < indexedArray.length; i++) {
                let item = cartObject.cart[i];

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
                        <button class='btn btn-danger remove-item-btn'>Remove</button>
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
            $('#cart-table').DataTable({
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
        }
    });

    
}

const checkCurrentCart = () =>{
    $.ajax({
        url: '../php/checkCurrentCart.php',
        method: "POST",
        dataType : 'JSON',
        success: function(response) {
            console.log(response)
            let total_current_addCart = 0
            for(let i = 0; i < response.cart.length; i++){
                total_current_addCart += parseInt(response.cart[i].itemQuantity)
            }

            if(total_current_addCart > 0){
                $('#notif-value').css('display' , 'block')
                $('#notif-value').text(total_current_addCart)
            }else{
                $('#notif-value').css('display' , 'none')
                $('#notif-value').text(0)
            }
        }
    });
}

const pagination = () => {
    let currentPage = 1;

    function showPage(page) {
        let items = $(".item-tile").not(".hidden-item"); // Get only visible items
        totalPages = Math.ceil(items.length / itemsPerPage);
        
        $(".item-tile").hide(); // Hide all items
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;

        items.slice(start, end).show(); // Show only paginated items
        updatePagination(page, totalPages);
    }

    function updatePagination(page, totalPages) {
        let paginationHTML = "";
        let maxVisiblePages = 5;

        $("#prevPage").prop("disabled", page === 1);
        $("#nextPage").prop("disabled", page === totalPages);

        // Always show the first page
        if (page > 3) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button> ... `;
        }

        // Generate page numbers dynamically
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === page ? 'active-page' : ''}" data-page="${i}">${i}</button> `;
        }

        // Always show the last page
        if (page < totalPages - 2) {
            paginationHTML += ` ... <button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        $("#pagination-numbers").html(paginationHTML);
    }

    // Initial page load
    showPage(currentPage);

    // Pagination button events
    $("#prevPage").click(() => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    $("#nextPage").click(() => {
        let totalPages = Math.ceil($(".item-tile").not(".hidden-item").length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    $(document).on("click", ".pagination-btn", function() {
        currentPage = parseInt($(this).attr("data-page"));
        showPage(currentPage);
    });

    return { showPage }; // Return function to use in search
};

let paginationInstance = pagination();

$(document).ready(function(){
    // dataTable()
    checkCurrentCart()
    pagination()

    $('.add-btn').click(function(){
        const index = $(this).index('.add-btn'); 
        let current_total = parseInt($('.current-total-span').eq(index).text()) + 1;
        $('.current-total-span').eq(index).text(current_total)
        
        if(current_total > 0){
            $('.add-to-cart-btn').eq(index).css('opacity', '1');
            $('.add-to-cart-btn').eq(index).css('pointer-events', 'auto');
        }
    });

    $('.minus-btn').click(function(){
        const index = $(this).index('.minus-btn'); 
        if(parseInt($('.current-total-span').eq(index).text()) <= 0) return;
        let current_total = parseInt($('.current-total-span').eq(index).text()) - 1;
        $('.current-total-span').eq(index).text(current_total)
    });

    $('.add-to-cart-btn').click(function(){
        const index = $(this).index('.add-to-cart-btn'); 

        $('#cart-icon').css('border-radius' , '5px')
        $('#cart-icon').css('width' , '150px')
        $('#item-img-animation').css('display' , 'block')
        $('#notif-value').css('display' , 'none')
        setTimeout(() => {
            
            $('#cart-icon').css('width' , '65px')
            $('#item-img-animation').css('display' , 'none')
            $('#cart-icon').css('border-radius' , '50%')
                setTimeout(() => {
                    $('#notif-value').css('display' , 'block')
                    
                }, 300);
        }, 1000);

        // let total_current_addCart = 0
        // for(let i = 0; i < $('.current-total-span').length; i++){
        //     total_current_addCart += parseInt($('.current-total-span').eq(i).text())
        // }
        // $('#notif-value').text(total_current_addCart)


        //find all the non zero current total span
        let non_zero_current_total = []
        for(let i = 0; i < $('.current-total-span').length; i++){
            if(parseInt($('.current-total-span').eq(i).text()) > 0){
                non_zero_current_total.push(i)
            }
        }

        console.log(non_zero_current_total)
        let data = {}

        for(let i = 0; i < non_zero_current_total.length; i++){
            data[i] = {
                'itemID': parseInt($('.item-id').eq(non_zero_current_total[i]).text()),
                'itemQuantity': $('.current-total-span').eq(non_zero_current_total[i]).text(),
                'itemPrice': $('.item-price').eq(non_zero_current_total[i]).text(),
            }
        }

        console.log(data)
        $.ajax({
            url: '../php/addToCart.php',
            method: "POST",
            data: { data: JSON.stringify(data) },
            dataType : 'JSON', 
            success: function(response) {
                console.log(response);

                let total_current_addCart = 0
                for(let i = 0; i < response.cart.length; i++){
                    total_current_addCart += parseInt(response.cart[i].itemQuantity)
                    $('.current-total-span').eq(parseInt(response.cart[i].itemID) - 1).text("0")
                    $('.add-to-cart-btn').eq(parseInt(response.cart[i].itemID) - 1).css("pointer-events", "none")   
                    $('.add-to-cart-btn').eq(parseInt(response.cart[i].itemID) - 1).css("opacity", "0.5")   
                }
                $('#notif-value').text(total_current_addCart)

                // for(let i = 0; i < $('.current-total-span').length; i++){
                //     $('.current-total-span').eq(i).text("0")
                // }

                
            }
        });
    })

    $('#cart-icon').click(function(){
        dataTable() 
    });

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
                url: '../php/updateCart.php',
                method: "POST",
                data: {
                    itemID: $('.item-id-span').eq(index).text(),
                    itemQuantity: $('.item-quantity-span').eq(index).val(),
                    action : "update"
                },
                success: function(response) {
                    try {
                        dataTable()
                        checkCurrentCart()
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

        console.log(index)
        try {
            $.ajax({
                url: '../php/updateCart.php',
                method: "POST",
                data: {
                    itemID: $('.item-id-span').eq(index).text(),
                    itemQuantity: $('.item-quantity-span').eq(index).val(),
                    action : "delete"
                },
                success: function(response) {
                    try {
                        dataTable()
                        checkCurrentCart()
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

    $(document).off('click', '#placeorder-btn').on('click', '#placeorder-btn', function() {        
        try {
            $.ajax({
                url: '../php/placeOrder.php',
                method: "POST",
                
                success: function(response) {
                    try {
                        // reset cart data table
                        $('#cart-table').DataTable().destroy();
                        $('#cart-table tbody').empty(); 

                        // reset the notif value of the inventory
                        $('#notif-value').text(0)
                        $('#notif-value').css('display' , 'none')

                        modal_placeorder.hide()
                        $('.modal-backdrop').remove(); 
                        $('body').removeClass('modal-open');

                        $('#modal-notif #modal-title-incoming').text("Order Request Sent.")
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

    $('#search-btn').on('click', function() {
        let searchInput = $('#search-input').val().toLowerCase();
    
        if (searchInput !== "") {
            $('.item-tile').each(function() {
                var itemName = $(this).find('.item-description').text().toLowerCase();
    
                // If the item name includes the search input, show it; otherwise, mark it as hidden
                if (itemName.includes(searchInput)) {
                    $(this).removeClass("hidden-item");
                } else {
                    $(this).addClass("hidden-item");
                }
            });
        } else {
            $(".item-tile").removeClass("hidden-item"); // Show all items if search is empty
        }
    
        paginationInstance.showPage(1); // Reset pagination after search
    });

    $('#search-input').on('keydown', function(e) {
        if (e.key === "Enter") {
            $('#search-btn').click();
        }
    });
})