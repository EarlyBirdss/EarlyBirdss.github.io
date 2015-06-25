/**
 * Created by Administrator on 2015/5/14.
 */
window.onload  =  function(){

    var btnLogin = document.getElementById('btnLogin');
    var oLogin = document.createElement('div');
    var oMask = document.createElement('div');

    function openNew(){
        oMask.id = 'mask';
        var sWidth  =  document.documentElement.scrollWidth;
        var sHeight  =  document.documentElement.scrollHeight;
        oMask.style.width = sWidth + 'px';
        oMask.style.height = sHeight + 'px';
        document.body.appendChild(oMask);

        oLogin.id = 'login';
        oLogin.innerHTML = '<div class="loginCon"><div id="close"></div></div>';
        document.body.appendChild(oLogin);
        var cHeight = document.documentElement.clientHeight;
        var oWidth = oLogin.offsetWidth;
        var oHeight = oLogin.offsetHeight;
        oLogin.style.position = 'absolute';
        oLogin.style.left = ( sWidth - oWidth ) / 2 +'px';
        oLogin.style.top  = ( ( cHeight - oHeight ) / 2 ) > 0 ?  ( cHeight - oHeight ) / 2 + 'px' :0;
    }


    btnLogin.onclick = function(){
        openNew();
        var oClose = document.getElementById('close');
        oMask.onclick = oClose.onclick = function(){
            document.body.removeChild(oMask);
            document.body.removeChild(oLogin);
        };
    };

};

