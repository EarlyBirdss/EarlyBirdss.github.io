/**
 * Created by Administrator on 2015/6/20.
 */
window.onload = function(){
    handlePage1();
    handlePage2();
    handlePage3();
};
function handlePage1(){
    var oIntroBox = document.getElementById('introBox');
    oIntroBox.onclick = function(e) {
        e = e || window.event;
        var el = e.srcElement || e.target;
        oIntroBox.className = el.className == 'btn-close' ? 'introBox' : 'introBox folded';
    }
}
function handlePage2(){
    var oSkillBox = document.getElementsByClassName('skill-box');
    var oShowCard = document.getElementById('showCard');
    var oMore = document.getElementById('more');
    var i, n;
    oShowCard.onclick = function(){
        for(i = 0, n = oSkillBox.length; i < n; i++){
            oSkillBox[i].className = 'skill-box skill-box-'+ (i + 1)+ '-after';
        }
        oShowCard.style.display = 'none';
        oMore.style.opacity = '1';
    };
}
function handlePage3(){
    var oSpot1 = document.getElementById('spot-1');
    var oSpot2 = document.getElementById('spot-2');
    oSpot1.onmouseover = oSpot2.onmouseover = function(){
        this.className = 'spot';
        this.parentNode.className = 'spotWrap spotWrap-after'
    };
    oSpot1.onmouseout  = oSpot2.onmouseout= function(){
        this.className = 'spot shake shake-constant';
        this.parentNode.className = 'spotWrap spotWrap-after'
    };
}