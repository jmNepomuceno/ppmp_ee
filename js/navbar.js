const fetchIncomingOrder_navBar = () => {
    $.ajax({
        url: '../php/fetch_incoming_notif.php',
        method: "GET",
        dataType: "json",
        success: function(response) {
            // Inject HTML into container
            $('.navbar-notif-div').html(response.html);
    
            // Access raw data
            let data = response.data;
            console.log("🔍 Raw notification data:", data);
    
            const notifCount = response.count;
    
            if (notifCount > 0) {
                $('#navbar-bell').css('opacity', '1');
                $('#navbar-span-val').text(notifCount);
            } else {
                $('#navbar-bell').css('opacity', '0.5');
                $('#navbar-span-val').text('');
            }
        },
        error: function(xhr, status, error) {
            console.error("❌ Error fetching notifications:", error);
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

$(document).ready(function(){
    $('#navbar-bell').click(function(){
        if($('.navbar-notif-div').css('display') == 'flex'){
            $('.navbar-notif-div').css('display', 'none');
        }else{
            $('.navbar-notif-div').css('display', 'flex');
        }
    });

    $('.navbar-notif-row').click(function () {
        let $row = $(this);
    
        $row.removeClass('unread').addClass('read');
    
        // Add temporary click feedback animation
        $row.css({ transform: 'scale(0.97)' });
    
        setTimeout(() => {
            $row.css({ transform: 'scale(1)' });
        }, 150);
    });
})