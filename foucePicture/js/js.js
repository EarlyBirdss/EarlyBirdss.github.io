/**
 * Created by Administrator on 2015/5/12.
 */
window.onload = function(){
    var container = document.getElementById("container");
    var list = document.getElementById("list");
    var buttons = document.getElementById("buttons").getElementsByTagName('span');
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var index = 1;
    var timmer;

    var addEvent = function(obj,event,fn){
        if(obj.addEventListener){
            return obj.addEventListener(event,fn,false);
        }else if(obj.attachEvent){
            return obj.attachEvent('on' + event,fn);
        }
    };

    var animate = function(offset){
        var time = 300;
        var interval = 10;
        var speed = offset / ( time / interval);
        var newLeft = parseInt( list.style.left) + offset;

        function start() {
            if ((speed > 0 &&  newLeft > parseInt(list.style.left) ) || (speed < 0 && newLeft <  parseInt(list.style.left) )) {
                list.style.left = parseInt(list.style.left) + speed + 'px';
                setTimeout(start,interval);
            }else{
                list.style.left = parseInt(list.style.left) + 'px';
                if (parseInt(list.style.left) < -3600) {
                    list.style.left = -600 + 'px';
                } else if (parseInt(list.style.left) > 0) {
                    list.style.left = -3000 + 'px';
                }
            }
        }
        start();
    };

    var showButton = function(){
        for( var i = 0 ;i < buttons.length ;i++){
            buttons[i].className = '';
        }
        index = ( index == 6 ) ? 1 :index;
        index = ( index == 0) ? 5 :index;
        buttons[index - 1].className = 'on';
    };


    for(var i = 0 ;i < buttons.length;i++){
        buttons[i].onclick = function(){
            var myIndex = this.getAttribute('index');
            var offsetW = ( index - myIndex ) * 600;
            index = myIndex;
            showButton();
            animate(offsetW);
        }
    }

    next.onclick = function(){
        animate(-600);
        index += 1;
        showButton();
    };
    prev.onclick = function(){
        animate(600);
        index -= 1;
        showButton();
    };

    var play = function(){
        timmer = setInterval(function(){
            next.onclick();
        },3000);
    };
    var stop = function(){
        clearInterval(timmer);
    };
     list.onmouseover  = stop;
     list.onmouseout = play;
   play();
};