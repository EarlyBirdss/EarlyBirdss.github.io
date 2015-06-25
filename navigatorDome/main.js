/**
 * Created by Administrator on 2015/5/5.
 */
window.onload = function(){
    var liL = document.getElementsByTagName("li");
    for(var i = 0;i < liL.length;i++){
        liL[i].onmouseover = function(){
            this.className = "liHover";
        };
        liL[i].onmouseout = function(){
            this.className = "";
        };
        liL[i].i = i;
        var titleHeight = 42;
        var liHeight = titleHeight + 30*this.i;
        var subHeight = this.getElementsByTagName("div")[0].style.top + this.getElementsByTagName("div")[0].offsetHeight;
        if(liHeight>subHeight){
            this.getElementsByTagName("div")[0].style.top = liHeight + "px";
        }
    }
};