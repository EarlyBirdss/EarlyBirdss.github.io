/**
 * Created by Administrator on 2015/4/3.
 */
$(function(){
    $(".link .button").hover(function(){
        var title = $(this).attr('data');
        $('.tip em').text(title);
        var pos = $(this).position().left+20;
        var dis = ($('.tip').outerWidth()-$(this).outerWidth())/2;
        var l = pos-dis;
        $('.tip').css({'left':l+'px'}).animate({'top':145,'opacity':1},500);

    },function(){
        if(!$('.tip').is(':animated')){
        $('.tip').animate({'top':100,'opacity':0},500)}
    })
});