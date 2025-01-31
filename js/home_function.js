let modal_placeorder = new bootstrap.Modal(document.getElementById('modal-place-order'));
// modal_placeorder.show()

const dataTable = () =>{

    // var dataSet = [
    //     [1, "Brand New Desktop Computer", "80,000", "<input class='quantity-input' type='text' value='2' />", "160,000", "<button class='btn btn-danger'>Remove</button>"],
    //     [2, "Brand New Desktop Computer", "80,000", "<input class='quantity-input' type='text' value='2' />", "160,000", "<button class='btn btn-danger'>Remove</button>"],
    //     [3, "Brand New Desktop Computer", "80,000", "<input class='quantity-input' type='text' value='2' />", "160,000", "<button class='btn btn-danger'>Remove</button>"],
    //     [4, "Brand New Desktop Computer", "80,000", "<input class='quantity-input' type='text' value='2' />", "160,000", "<button class='btn btn-danger'>Remove</button>"],
    // ];


    $.ajax({
        url: '../php/checkCurrentCart.php',
        method: "POST",
        dataType : 'JSON',
        success: function(response) {
            console.log(response)

            // Separate indexed array and object
            let indexedArray = [];
            let cartObject = {};

            for (const key in response) {
                if (!isNaN(key)) {
                    indexedArray[parseInt(key)] = response[key]; // Store in an array
                } else {
                    cartObject[key] = response[key]; // Store non-numeric keys in an object
                }
            }

            // Output results
            // console.log("Indexed Array:", indexedArray);
            // console.log("Cart Object:", cartObject.length);

            let dataSet = []
            for (let i = 0; i < indexedArray.length; i++) {
                let item = cartObject.cart[i];

                // Remove "P" and commas, then convert to a float
                let cleanPrice = parseFloat(item.itemPrice.replace(/P|\s|,/g, '')) * parseInt(item.itemQuantity);
                let formattedPrice = "P " + cleanPrice.toLocaleString();
                console.log(formattedPrice)
                dataSet.push([
                    // `<img src="../images/${item.itemImage}" alt="item-image" class="img-fluid" style="width: 100px; height: 100px;" />`,
                    item.itemID,
                    indexedArray[i],
                    "P " + cleanPrice.toLocaleString(), // Now it's a number
                    `<input class='quantity-input' type='text' value='${item.itemQuantity}' />`,
                    formattedPrice, // Multiply as a number
                    `<button class='btn btn-danger'>Remove</button>`
                ]);
            }
            console.log(dataSet)
            // $('#cart-table').DataTable({
            //     data: dataSet,
            //     columns: [
            //         { title: "IMAGE" },
            //         { title: "PRODUCT" },
            //         { title: "PRICE" },
            //         { title: "QUANTITY" },
            //         { title: "SUBTOTAL" },
            //         { title: "ACTION" },
            //     ],
            //     // "paging": false,
            //     // "info": false,
            //     // "ordering": false,
            //     // "stripeClasses": []
            // });
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
            }
        }
    });
}

$(document).ready(function(){
    
    checkCurrentCart()

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
})