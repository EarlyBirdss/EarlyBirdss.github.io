/**
 * Created by Administrator on 2015/5/9.
 */
function getLength(str){
    return str.replace(/[^x00-xff]/g,'xx').length;
}
//判断是否同一个字符
function findStr(str,n){
    var temp = 0;
    for(var i = 0;i<str.length;i++){
        if(str.charAt(i) == n){
            temp ++ ;
        }
    }
    return temp;
}

window.onload = function(){
    var aInput = document.getElementsByTagName('input');
    var oName = aInput[0];
    var pwd = aInput[1];
    var pwd2 = aInput[2];
    var aP = document.getElementsByTagName('p');
    var name_msg = aP[0];
    var pws_msg = aP[1];
    var pws2_msg = aP[2];
    var count = document.getElementById('count');
    var aEm = document.getElementsByTagName('em');
    var name_length = 0;

    var re = /[^\w\u4e00-\u9fa5]/g;

    /*var str = "17687910163";
     var re = /1[3|5|7|8](\d){9}/g;
     alert(re.test(str));*/

    oName.onfocus = function(){
        name_msg.style.display = 'block';
        this.innerHTML = '<i class="ati">5-25个字符，一个汉字为两个字符，推荐使用中文字符名</i>'
    };
    oName.onkeyup = function(){
        count.style.visibility = 'visible';
        name_length = getLength(this.value);
        count.innerHTML = name_length+'个字符';
        if(name_length == 0){
            count.style.visibility = 'hidden';
        }
    };
    oName.onblur = function(){

        //非法字符
        if(re.test(this.value)){
            name_msg.innerHTML = '<i class="err"></i>含有非法字符';
        }
        //空字符
        else if(this.value == ''){
            name_msg.innerHTML = '<i class="err"></i>不能为空';
        }
        //长度超过25个字符
        else if(name_length > 25){
            name_msg.innerHTML = '<i class="err"></i>长度超过25个字符';
        }

        //长度小于5个字符
        else if(name_length < 5){
            name_msg.innerHTML = '<i class="err"></i>长度小于5个字符';
        }

        //ok
        else{
            name_msg.innerHTML = '<i class="ok"></i>OK';
        }
    };

    pwd.onfocus = function(){
        pws_msg.style.display = 'block';
        pws_msg.innerHTML = '<i class="ati"></i>6-16个字符，请使用字母加数字或符号额组合密码，不能单独使用字母、数字或符号';
    };
    pwd.onkeyup = function(){
        for(var i = 0;i<aEm.length;i++) {
            aEm[i].style.visibility = 'visible';
        }
        //5个以上为中
        if(this.value.length>5){
            aEm[1].className = 'active';
            pwd2.removeAttribute('disabled');
            pws2_msg.style.display = 'block';
            pws2_msg.innerHTML = '<i class="ati"></i>请再次输入密码！';
        }else{
            pwd2.setAttribute('disabled','disabled');
            aEm[1].className = '';
            pws2_msg.style.display = 'none';
        }
        //10个以上为强
        if(this.value.length>10){
            aEm[2].className = 'active';
        }else{
            aEm[2].className = '';
        }
    };
    pwd.onblur = function(){
        pws_msg.style.display = 'block';
        var m = findStr(this.value,this.value[0]);
        var re_n = /[^\d]/g;
        var re_t = /[^a-zA-Z]/g;
        //6-16个字符
        if(this.value.length < 6 || this.value.length >16){
            pws_msg.innerHTML = '<i class="err"></i>长度必须为6-16个字符';
        }
        //不能为空
        else if(this.value == ''){
            pws_msg.innerHTML = '<i class="err"></i>不能为空';
        }
        //不能是同一个字符
        else if(m == this.value.length){
            pws_msg.innerHTML = '<i class="err"></i>不能用相同字符';
        }
        //不能单独是数字
        else if( !re_n.test(this.value)){
            pws_msg.innerHTML = '<i class="err"></i>不能全是数字';
        }
        //不能全是字母
        else if( !re_t.test(this.value)){
            pws_msg.innerHTML = '<i class="err"></i>不能全是字母';
        }
        //ok
        else{
            pws_msg.innerHTML = '<i class="ok"></i>OK';
        }
    };

    pwd2.onfocus = function(){

    };
    pwd2.onkeyup = function(){

    };
    pwd2.onblur = function(){
        if(this.value != pwd.value){
            pws2_msg.innerHTML = '<i class="err"></i>两次输入密码不一致！！';
        }
        else{
            pws2_msg.innerHTML = '<i class="ok"></i>OK';
        }
    };

};