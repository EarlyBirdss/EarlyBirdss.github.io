/**
 * Created by Administrator on 2015/5/12.
 */
window.onload = function(){
    var list = document.getElementById('list');
    var lis  = list.children;
    var timer;

    //删除节点
    function removeNode(node){
        node.parentNode.removeChild(node);
    }

    //赞
    function praiseBox(box,el){
        var praiseElement =box.getElementsByClassName('praises-total')[0];
       // console.log(praiseElement);
        var oldTotal = parseInt(praiseElement.getAttribute('total'));
        var newTotal;
        var txt = el.innerHTML;
        if(txt == '赞'){
            praiseElement.innerHTML = oldTotal == 0 ? "我觉得很赞" : "我和"+ oldTotal + "个人觉得很赞";
            newTotal = oldTotal + 1;
            praiseElement.setAttribute('total',newTotal);
            el.innerHTML = '取消赞';
        }else{
            newTotal = oldTotal - 1;
            praiseElement.innerHTML = oldTotal == 1 ? "" : newTotal + "个人觉得很赞";
            praiseElement.setAttribute('total',newTotal);
            el.innerHTML = '赞';
        }
        praiseElement.style.display = (newTotal == 0) ? 'none' :'block';
    }

    //评论
    function commentBox(box){
        var textarea = box.getElementsByTagName('textarea')[0];
        var list = box.getElementsByClassName('comment-list')[0];
        var lis  = document.createElement('div');
        console.log(lis);
        lis.className = 'comment-box clearfix';
        lis.setAttribute('user','self');
        var html = ' <img class="myhead" src="images/my.jpg" alt=""/>'+
            '<div class="comment-content">'+
            '<p class="comment-text"><span class="user">我：</span>'+textarea.value+'</p>'+
            '<p class="comment-time">'+
            getTime()+
            '<a href="javascript:;" class="comment-praise" total="0" my="0" style="" > 赞</a>'+
            '<a href="javascript:;" class="comment-operate">删除</a>'+
            '</p>'+
            '</div>';
        lis.innerHTML = html;
        list.appendChild(lis);
        textarea.value = '';
        textarea.onblur();
    }

    //评论点赞
    function praiseReply(el){
        var ototal  = parseInt(el.getAttribute('total'));
        var ntotal;
        if(el.innerHTML.toString().indexOf('取消赞')>-1){
            ntotal = ototal -  1;
            el.innerHTML = ( ntotal == 0) ? '':ntotal+ ' 赞';
        }else{
            ntotal = ototal + 1;
            el.innerHTML = ntotal + ' 取消赞';
        }
        el.setAttribute('total',ntotal);
        el.style.display = ( ntotal == 0 ) ? '' : 'block';
    }

    //操作--回复/删除
    function operateReply(el){
        if(el.innerHTML == '删除'){
            removeNode(el.parentNode.parentNode.parentNode);
        }
        else{
            var commentBox = el.parentNode.parentNode.parentNode;
            var textarea = commentBox.parentNode.parentNode.getElementsByTagName('textarea')[0];
            var user =  commentBox.getElementsByClassName('user')[0];
            textarea.onfocus();
            textarea.value = '回复' + user.innerHTML ;
            textarea.onkeyup();
        }
    }

    //获取时间
    function getTime(){
        var d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var dy = d.getDate();
        var h = d.getHours();
        var mi = d.getMinutes();

        m = ( m < 10 ) ? '0' + m : m;
        dy = ( dy < 10 ) ? '0' + dy : dy;
        h = ( h < 10 ) ? '0' + h : h;
        mi = ( mi < 10 ) ? '0' + mi : mi;
        return y + '-' + m + '-' + dy + ' ' + h + ':' + mi;
    }

    for(var i = 0;i < lis.length;i++){
        lis[i].onclick = function(e){
            var e = e || window.event;
            var el = e.srcElement;
            switch(el.className){
                case 'close':
                    removeNode(this);
                    break;
                case 'praise':
                    praiseBox(el.parentNode.parentNode.parentNode,el);
                    break;
                case 'btn btn-off':
                    clearTimeout(timer);
                    break;
                case 'btn':
                    commentBox(el.parentNode.parentNode.parentNode);
                    break;
                case 'comment-praise':
                    praiseReply(el);
                    break;
                case 'comment-operate':
                    operateReply(el);
                    break;
            }
        };

        var textarea = lis[i].getElementsByTagName('textarea')[0];
        textarea.onfocus = function(){
            this.parentNode.className = 'text-box text-box-on';
            this.value = ( this.value == '评论…' ) ? '' :this.value;
            this.onkeyup();
        };
        textarea.onblur  = function(){
            var me = this;
            timer = setTimeout(function(){
                if(me.value == '' ){
                    me.parentNode.className = 'text-box';
                    me.value = '评论…';
                }
            },400);

        };
        textarea.onkeyup = function(){
            var leng = this.value.length;
            var p = this.parentNode;
            var btn = p.childNodes[3];
            var word = p.childNodes[5];
            if(leng == 0 || leng > 140 ){
                btn.className = 'btn btn-off';
            }else{
                btn.className = 'btn';
            }
            word.innerHTML = leng +'/140';
        };
    }
};
