$(document).ready(function(){
    $('.side-bar-routes').click(function(){
        const index = $(this).index('.side-bar-routes'); 
        const id = $(this).attr('id');

        for(let i = 0; i < $('.side-bar-routes').length; i++){
            $('.side-bar-routes').eq(i).css('background', '#BA3912');
            $('.side-bar-routes').eq(i).css('border-left', '0');
        }

        $(this).css('background', '#A23210');
        $(this).css('border-left', '5px solid white');
    });
})