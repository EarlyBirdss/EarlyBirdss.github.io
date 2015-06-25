/**
 * Created by Administrator on 2015/5/18.
 */
window.onload = function(){

    if( !document.getELementsByClassName ){
        document.getElementsByClassName = function(className){
            var res = [];
            var all = document.getElementsByTagName("*");
            for( var i = 0;i < all.length; i++){
                if(all[i].className === className || all[i].className.indexOf(" " + className) > -1 || all[i].className.indexOf(className + " ") > -1){
                    res.push(all[i]);
                }
            }
            return res;
        }
    }

    var addEvent = function(obj,event,fn){
        if(obj.addEventListener){
            return obj.addEventListener(event,fn,false);
        }else if (obj.attachEvent){
            return obj.attachEvent('on' + event,fn);
        }
    };

    var carTable = document.getElementById('carTable');
    var trs = carTable.children[1].rows;
    var checks = document.getElementsByClassName('check');
    var checkAlls = document.getElementsByClassName('check-all');
    var selected = document.getElementById('selected');                //已选商品 点击弹出层
    var selectedTotal = document.getElementById('selectedTotal');     //已选商品数量
    var priceTotal = document.getElementById('priceTotal');
    var deleteAll = document.getElementById('deleteAll');

    var getTotal = function(){
        var num = 0;   //已选商品
        var price = 0;  //总计价格
        for(var i = 0;i < trs.length;i++){
            if(trs[i].getElementsByTagName('input')[0].checked){
                num += parseInt(trs[i].getElementsByTagName('input')[1].value);
                price += parseFloat(trs[i].getElementsByClassName('subTotal')[0].innerHTML);
            }
            selectedTotal.innerHTML = num;
            priceTotal.innerHTML = (price.toFixed(2));
        }
        if(num === 0){
            document.getElementsByClassName('selected-view')[0].style.display = 'none';
        }
    };

    //小计
    var getSubTotal = function(trBox){
        var num = parseInt(trBox.getElementsByTagName('input')[1].value);
        var price = parseFloat(trBox.getElementsByTagName('span')[1].innerHTML);
        var subTotal = trBox.getElementsByClassName('subTotal')[0];
        subTotal.innerHTML = (( num * price ).toFixed(2));
    };

    //减1处理
    var handleReduce = function(trBox,el){
        var reduce = el;
        var input = trBox.getElementsByTagName('input')[1];
        if(input.value>1){
            input.value = parseInt(input.value) - 1;
        }else{
            el.innerHTML = '';
        }
    };
    //加1处理
    var handleAdd = function(trBox,el){
        var add = el;
        var input = trBox.getElementsByTagName('input')[1];
        input.value = parseInt(input.value) + 1;
        trBox.getElementsByClassName('reduce')[0].innerHTML = '-';
    };
    //单行删除
    var handleOperation = function(trBox,el){
        trBox.parentNode.removeChild(trBox);
    };
    //删除全部
    deleteAll.onclick = function(){
        for(var i = 0;i < trs.length ; i++) {
            if (trs[i].getElementsByTagName('input')[0].checked) {
                trs[i].parentNode.removeChild(trs[i]);
                i--;
            }
        }
        getTotal();
    };

    for(var i = 0; i < trs.length;i++){
        addEvent(trs[i],'click',function(e){
            var e = e || window.event;
            var el = e.srcElement;
            switch(el.className){
                case 'reduce':
                    handleReduce(el.parentNode.parentNode,el);
                    getSubTotal(el.parentNode.parentNode);
                    getTotal();
                    break;
                case 'add':
                    handleAdd(el.parentNode.parentNode,el);
                    getSubTotal(el.parentNode.parentNode);
                    getTotal();
                    break;
                case 'operation':
                    handleOperation(el.parentNode,el);
                    getTotal();
                    break;
                default:
                    break;
            }
        });
    }

    getTotal();

    for(var i = 0 ;i < checks.length ;i++){
        checks[i].onclick = function(){
            if(this.className == 'check-all check'){
                for(var j = 0;j < checks.length;j++){
                    checks[j].checked = true;
                }
            }else{
                for(var j = 0;j < checkAlls.length;j++){
                    checkAlls[j].checked = false;
                }
            }
            getTotal();
        };
    }
    selected.onclick = function(){
        var listBox = document.getElementsByClassName('selected-view')[0];
        listBox.style.display = 'block';
        var html = '';
        var div = document.createElement('div');
        div.id = 'selectedViewList';
        div.class = 'clearfix';
        for(var i = 0;i<trs.length;i++){
            trs.i = i;
            if(trs[i].getElementsByTagName('input')[0].checked){
                html += '<div><img src="images/'+(trs.i+1)+'.jpg"><span class="del"  index = '+ trs.i +'>取消选择</span></div>';
            }
        }
        div.innerHTML = html;
        listBox.appendChild(div);
        listBox.onclick = function(e){
            var e = e || window.event;
            var el = e.srcElement;
            if(el.className == 'del'){
                el.parentNode.parentNode.removeChild(el.parentNode);
                var thisIndex = el.getAttribute('index');
                console.log(thisIndex);
                for(var m = 0 ;m < trs.length; m++){
                    if( m == thisIndex){
                        trs[m].getElementsByTagName('input')[0].checked = false;
                        console.log(trs[m]);
                    }
                }
                getTotal();
            }
        };
    };
    checkAlls[0].onclick();
};