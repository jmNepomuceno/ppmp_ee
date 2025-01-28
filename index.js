$(document).ready(function(){
    $('#login-btn').click(function(){
        const username_input = $('#username-txt').val();
        const password_input = $('#password-txt').val();

        console.log(username_input, password_input)

        $.ajax({
            url: '../php/login.php',
            method: "POST",
            data : {
                username : username_input,
                password : password_input
            },
            success: function(response) {
                window.location.href = response;
            }
        });
    });
})