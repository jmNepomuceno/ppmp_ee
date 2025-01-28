$(document).ready(function(){
    $('.add-btn').click(function(){
        const index = $(this).index('.add-btn'); 
        $('.current-total-span').eq(index).text(parseInt($('.current-total-span').eq(index).text()) + 1)
    });
})