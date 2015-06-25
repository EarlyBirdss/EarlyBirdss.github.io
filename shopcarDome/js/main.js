/**
 * Created by Administrator on 2015/5/6.
 */
window.onload = function(){
    if(!document.getElementsByClassName){
        document.getElementsByClassName = function(cls){
            var res = [];
            var els = document.getElementsByTagName('*');
            for(var i = 0;i<els.length;i++){
                if(els[i].className === cls || els[i].className.indexOf(cls)>-1 || els[i].className.indexOf(cls+" ")>-1 || els[i].className.indexOf(" " +cls)>-1){
                    res.push(els[i]);
                }
            }
            return res;
        }
    }

    var carTable = document.getElementById("carTable");
    var tr = carTable.children[1].rows;
    var checkInputs = document.getElementsByClassName('check');
    var checkAllInputs = document.getElementsByClassName('check-all');
    var selectedTotal = document.getElementById("selectedTotal");
    var priceTotal =document.getElementById("priceTotal");
    var deleteAll = document.getElementById("deleteAll");

    var selected = document.getElementById("selected");
    var foot = document.getElementById("foot");
    var selectedViewList = document.getElementById("selectedViewList");

    getTotal();

    //计算
    function getTotal(){
        var selected = 0;
        var price = 0;
        var HTMLstr = '';
        for(var i = 0;i < tr.length ;i++){
            if(tr[i].getElementsByTagName('input')[0].checked){
                tr[i].className = 'on';
                selected += parseInt(tr[i].getElementsByTagName('input')[1].value);
                price += parseFloat(tr[i].cells[4].innerHTML);
                HTMLstr += '<div><img src="'+ tr[i].getElementsByTagName('img')[0].src +'"><span index='+i+' class="del">取消选择</span></div>';
                //console.log(tr[i].getElementsByClassName('price'));
            }
            else{
                tr[i].className = '';
            }
            selectedViewList.innerHTML = HTMLstr;
        }
        selectedTotal.innerHTML = selected;
        priceTotal.innerHTML = price.toFixed(2);

        if(selectedTotal == 0){
            foot.className = "foot";
        }
    }

    //小计
    function getSubTotal(tr){
        var tds = tr.cells;
        var price = parseFloat(tr.getElementsByTagName('span')[1].innerHTML);
        var count = parseInt(tr.getElementsByTagName('input')[1].value);
        var subTotal = parseFloat(count * price).toFixed(2);
        tds[4].innerHTML = subTotal;
    }
    //
    for(var i = 0;i < checkInputs.length;i++){
        checkInputs[i].onclick = function() {

            if (this.className.indexOf("check-all") > -1) {
                for (var j = 0; j < checkInputs.length; j++) {
                    checkInputs[j].checked = this.checked;
                }
            }
            if (this.checked == false) {
                checkAllInputs[0].checked = false;
                checkAllInputs[1].checked = false;
            }
            getTotal();
        }
    }

    selected.onclick = function(){
        if(selectedTotal.innerHTML != 0){
            if(foot.className == "foot"){
                foot.className = "foot show";
            }
        }else{
            foot.className = "foot";
        }
    };

    selectedViewList.onclick = function(e){
        var event = e || window.event;
        var el = event.target || event.srcElement;
        if(el.className == 'del'){
            var index = el.getAttribute('index');
            var input = tr[index].getElementsByTagName('input')[0];
            input.checked = false;
            input.onclick();
            if(selectedTotal.innerHTML == 0){
                foot.className = "foot";
            }
        }
    };

    for(var i = 0;i<tr.length;i++){
        tr[i].onclick = function(e){
            var event = e || window.event;
            var el = event.srcElement || event.target;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1];
            var val = parseInt(input.value);
            var reduSpan = this.getElementsByTagName('span')[2];
            switch (cls){
                case 'add':
                    input.value = val+1;
                    reduSpan.innerHTML = '-';
                    this.getElementsByTagName('input')[0].checked = true;
                    getSubTotal(this);
                    getTotal();

                    break;
                case 'reduce':
                    if(val > 1){
                        input.value = val - 1;
                    }else{
                        reduSpan.innerHTML = '';
                        this.getElementsByTagName('input')[0].checked = false;
                    }
                    getSubTotal(this);
                    getTotal();

                    break;
                case 'operation':
                    var con = confirm("确定要删除吗？");
                    if(con){
                        this.parentNode.removeChild(this);
                    }
                    break;
                default :
                    break;
            }

        };
        tr[i].getElementsByTagName('input')[1].onkeyup = function(){
            var val = parseInt(this.value);
            var reduSpan = this.parentNode.parentNode.getElementsByTagName('span')[2];

            if(isNaN(val) || typeof(val) != "number" || val < 0){
                val = 1;
            }
            this.value = val;
            if(val > 1){
                reduSpan.innerHTML = '-';
            }
            else{
                reduSpan.innerHTML = '';
            }
            getSubTotal(this.parentNode.parentNode);
            getTotal();
        }
    }

    deleteAll.onclick = function() {
        if (parseInt(selectedTotal.innerHTML) != 0) {
            var con = confirm('确定删除全部已选商品吗？');
            if (con) {
                for (var i = 0; i < tr.length; i++) {
                    if (tr[i].getElementsByTagName('input')[0].checked == true) {
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;
                    }
                }
            }
        }
    };

    checkAllInputs[0].checked = true;
    checkAllInputs[0].onclick();
};