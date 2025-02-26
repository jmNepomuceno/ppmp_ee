$(document).ready(function(){
    // Function to handle login
    function handleLogin() {
        const username_input = $('#username-txt').val();
        const password_input = $('#password-txt').val();

        console.log(username_input, password_input);

        $.ajax({
            url: '../php/login.php',
            method: "POST",
            data: {
                username: username_input,
                password: password_input
            },
            success: function(response) {
                // console.log(response)
                window.location.href = response;
            }
        });
    }

    // Trigger login on button click
    $('#login-btn').click(function() {
        handleLogin();
    });

    // Trigger login on Enter key press
    $('#username-txt, #password-txt').keydown(function(event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            handleLogin();
        }
    });

})