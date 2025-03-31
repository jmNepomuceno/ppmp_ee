const fetchIncomingOrder_navBar = () => {
    $.ajax({
        url: '../php/fetch_incoming_order.php',
        method: "GET",
        success: function(response) {
            response = parseInt(response);
            if(response >= 1){
                $('#navbar-bell').css('opacity', '1');
                $('#navbar-span-val').text(response); 
            }
        }
    });
};

// Run the function every 5 minutes (300000ms)
// setInterval(fetchIncomingOrder, 300000);

// Run immediately on page load
fetchIncomingOrder_navBar();

document.addEventListener("websocketMessage", function(event) {
    let data = event.detail;

    if (data.action === "refreshNavbar") {
        fetchIncomingOrder_navBar()
    }
});