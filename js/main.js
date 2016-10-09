/**
 * Created by chenlei on 16/10/5.
 */

$(document).ready(function () {

    $('.owl-carousel').owlCarousel({
        items:1,
        loop:true,
        margin:10,
        autoHeight:true,
        // nav:true,
        dots: false,
        pagination: false
    });



    //样式修改器
   var style_switcher = $('.style-switcher'),
       panelWidth = style_switcher.outerWidth(true);

    $('.style-switcher .trigger').on("click", function(){
        var $this = $(this);
        if ($(".style-switcher.closed").length>0) {
            style_switcher.animate({"left" : "0px"});
            $(".style-switcher.closed").removeClass("closed");
            $(".style-switcher").addClass("opened");
        } else {
            $(".style-switcher.opened").removeClass("opened");
            $(".style-switcher").addClass("closed");
            style_switcher.animate({"left" : '-' + panelWidth});
        }
        return false;
    });
    
    $('.dark-switch').on("click",function () {
        $(".header-container").removeClass("green").removeClass("blue").addClass("dark");
        $(".btn").attr('class', 'btn');
        $(".btn").addClass('btn-primary');

    });

    $('.green-switch').on("click",function () {
        $(".header-container").removeClass("dark").removeClass("blue").addClass("green");
        $(".btn").attr('class', 'btn');
        $(".btn").addClass('btn-warning');
    });
    $('.blue-switch').on("click",function () {
        $(".header-container").removeClass("green").removeClass("dark").addClass("blue");
        $(".btn").attr('class', 'btn');
        $(".btn").addClass('btn-info');
    });



});
