/**
 * Created by Administrator on 2015/6/19.
 */
/*countDown();
function countDown(){
    var box = document.getElementById('loading');
    var wel = document.getElementById('welContent');
    var countdown = document.getElementById('countdown');
    var pagepiling = document.getElementById('pagepiling');
    var interval = 1000;
    countdown.innerHTML = '5';
    var i = setInterval(handleCountdownNumber(), interval);
    handleCountdownNumber();
    function handleCountdownNumber() {
        console.log(countdown.innerHTML);
        countdown.innerHTML = (countdown.innerHTML - 1) + '';
        console.log(countdown.innerHTML);
        if (countdown.innerHTML == 0) {
            console.log(countdown.innerHTML);
            clearInterval(i);
            box.style.display = 'none';
            wel.style.display = 'block';
            document.onclick = function () {
                pagepiling.style.display = 'block';
            }
        }
    }
}*/
function handleCountdown() {
    var countdown = $('#countdown');
    var pagepiling = $('#pagepiling');
    var wel = $('wel');
    var mask = $('mask');
    countdown.html('5');
    mask.width(document.width());
    mask.height(document.height());
    var i = window.setInterval(setCount,1000);

    function setCount() {
        if(countdown.html() > 0) {
            countdown.html(countdown.html() - 1 + '');
        }
        else{
            window.clearInterval(i);
            wel.css('display','block');
            mask.bind('click',function(){
                mask.animation({
                    opacity:'0'
                },2000,function(){
                    mask.remove()

                })
            });
        }
    }
}