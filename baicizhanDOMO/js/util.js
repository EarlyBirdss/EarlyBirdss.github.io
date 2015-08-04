/**
 * Created by Administrator on 2015/6/7.
 */
//查找指定的元素在数组中的位置
//判断arr是否为一个数组，返回一个bool值
function isArray(arr){
    return arr instanceof  Array;
}
//判断fn是否为一个函数，返回一个bool值
function isFunction(func){
    return func instanceof  Function;
}
//了解值类型和引用类型的区别，了解各种对象的读取、遍历方式
//使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
//被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object
//对象。不包含函数、正则对象等
function cloneObject(src){
    var res = null;
    switch (typeof src){
        case 'number':
            res = + src;
            break;
        case 'string':
            res = '' + src;
            break;
        case 'boolean':
            res = src;
            break;
        case 'undefined':
            res = undefined;
            break;
        case 'object':
            if( src === null ){
                res = null;
            }else if( src instanceof Array ){
                res = [];
                var i = 0;
                for( ; i < src.length; i++){
                    res.push(src[i]);
                }
            }else if( src instanceof Date ){
                res = new Date(src);
            }else if( src instanceof Object ){
                res = {};
                var key;
                for(key in src){
                    if(src.hasOwnProperty(key)) {
                        res.key = cloneObject(src.key);
                    }
                }
            }else{
                return;
            }
            break;
    }
    return res;
}
//学习数组、字符串、数字等相关方法
//对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function duplRemove(arr){
    var res = [];

    var i = 0;
    var len = arr.length;
    for( ; i < len; i++){
        if( arr[i] && res.indexOf(arr[i]) < 0 ){
            res.push(arr[i]);
        }
    }
    return res;
}

//非正则，对字符串头尾进行空格字符串的去除，包括拳脚半角空格、Tab等，返回一个字符串
function trim(str){
    return str.replace(/^\s+|\s+$/g,'');
}

//实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr,fn){
    var i = 0;
    var len = arr.length;
    for( ; i < len; i++){
        fn(i,arr[i]);
    }
}
//获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj){
    if( !obj instanceof Object) {
        console.log("not a Object");
        return;
    }
        var len = 0;
        var key;
        for(key in obj){
            if( obj.hasOwnProperty(key)){
                len++;
            }
        }
        return len;
}

//学习正则表达式
//判断是否为邮箱地址
function isEmail(email){
/*
    if( typeof(email) !== 'string'){
        console.log("not a String");
        return;
    }
*/
    email = email + '';
    var reg = /^\w+@[a-z]+(\.com)$/i;
    return reg.test(email);
}
//判断是否为手机号
function isPhoneNumber(phoneNumber){
    phoneNumber = phoneNumber + '';
    var reg = /1[3,5,7,8]\d{9}/i;
    return reg.test(phoneNumber);
}

//为dom增加一个样式名为newClassName的样式
function addClass(dom,newClassName){
    if(!dom){
        return;
    }
    var classArray = dom.className.split(' ');
    classArray.push(newClassName);
    dom.className = classArray.join(' ');
}

//移除dom中的样式oldClassName
function removeClass(dom,oldClassName){

    if( !dom.className || dom.className.indexOf( oldClassName ) < 0){
        return;
    }

    var newCls = null;
    oldClassName = oldClassName + '';

    if(dom.className.indexOf( ' ' + oldClassName ) > -1) {
        oldClassName = ' ' + oldClassName;
    }else if( dom.className.indexOf( oldClassName + ' ') > -1){
        oldClassName = oldClassName + ' ';
    }else if( dom.className.indexOf( oldClassName ) > -1){
        oldClassName = oldClassName + '';
    }

    newCls = dom.className.split(oldClassName).join('');
    dom.className = newCls;
}
//判断siblingNode和dom是否为同一父元素下的同一级元素，返回bool值
function isSiblingNode( dom,siblingNode ){
    if( !dom.parentNode || !siblingNode.parentNode ){
        return false;
    }

    return dom.parentNode === siblingNode.parentNode;
}

//获取dom相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(dom){

   /* return {
        x:dom.getBoundingClientRect().left - document.documentElement.clientTop,
        y:dom.getBoundingClientRect().top
    };*/
    var top = dom.offsetTop;
    var left = dom.offsetLeft;
    while( dom.parentNode ){
        top += dom.parentNode.offsetTop;
        left += dom.parentNode.offsetLeft;
        dom = dom.parentNode;
    }
    return {
        x : left,
        y : top
    };
}

//IE8不支持根据class进行搜索
if( !document.getElementsByClassName){
    document.getElementsByClassName = function(cls){
        var res = [];
        var all = document.getElementsByTagName('*');
        var i = 0,len = all.length;
        for( ; i < len; i++){
            if( all[i].className.indexOf(cls) > -1 ){
                res.push(all[i]);
            }
        }
        return res;
    };
}

//实现一个简单的Query
function $(arg,dom){
    var flag = arg.charAt(0);
    arg = arg.substr(1);
    dom = dom || document;
    switch (flag){
        case '.':
            return dom.getElementsByClassName(arg);
            break;
        case '#':
            return dom.getElementById(arg);
            break;
        default :
            return dom.getElementsByTagName(arg);
            break;
    }
}

//给一个dom绑定一个针对event事件的响应，响应函数为listener
function addEvent( el,event,listener ){
    if(el.addEventListener){
        return el.addEventListener(event,listener,false);
    }else if(el.attachEvent){
        return el.attachEvent( 'on'+event,listener );
    }
}

//移除dom对象对于event事件发生时执行listener的相应，当listener为空时，移出所有响应函数
function removeEvent( el,event,listener){
    if( !listener){
        el['on' + event] = null;
    }else if( el.removeEventListener ){
        el.removeEventListener( event,listener,false );
    }else if( el.detachEvent ){
        el.detachEvent( 'on' + event,listener );
    }
}
//实现对click事件的绑定
function addClickEvent( el,listener ){
    return addEvent(el,'click',listener);
}

//实现对于按Enter键时的事件绑定
function addEnterEvent( el,listener){
    return addEvent( el,
                      'keydown',
                      function(event){
                            if(event.keyCode === 13){
                                listener;
                            }
    });
}

//事件代理
function delegateEvent( el, tags, eventName, listener){
    addEvent( el, eventName, function(event){
        event = event || window.event;
        var target = event.srcElement || event.target;

        var allTags = tags.split(' ');
        var i = 0,len = allTags.length;
        for( ; i < len; i++){
            if( allTags.indexOf( '.' ) < 0 ){
                var tagName = target.nodeName.toLowerCase();
                if( tagName === allTags[i]){
                    listener(event);
                }
            }else{
                var tagClassName = target.className;
                var cls = allTags[i].replace('.','');
                if( tagClassName.indexOf(cls) > -1 ){
                    listener(event);
                }
            }
        }

    });
}
//封装处理
$.on = function( selector, event, listener){
    var el = $(selector);
    addEvent(el,event,listener);
    return this;
};

$.click = function( selector, listener){
    var el = $(selector);
    addClickEvent( el, listener);
    return this;
};

$.un = function( selector,event, listener){
    var el = $(selector);
    removeEvent( el, event, listener);
    return this;
};

$.delegate = function( selector, tag, eventName, listener){
    var el = $(selector);
    delegateEvent( el, tag, eventName, listener);
    return this;
};

//5. BOM:浏览器对象模型 browser object model
//判断是否为IE浏览器，返回-1或者版本号
function isIE(){
    if(navigator.userAgent.match(/msie ([\d.]+)/i)) {
        return navigator.userAgent.match(/msie ([\d.]+)/i)[1];
    }
    else return -1;
}


//6. ajax
function ajax(url, options) {

    options.type = options.type || "GET";
    options.data = options.data || "hello=world&fucn=2";
    options.onsuccess = options.onsuccess || function(msg) {};
    options.onfail = options.onsuccess || function(msg) {};

    var request;
    var target = url;
    //ie7+及其他浏览器支持XMLHttpRequest
    if(window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    }
    //老ie....
    else {
        request = window.ActiveXObject("Microsoft.XMLHTTP");
    }

    //编码数据
    var encodeFromData = function(data) {
        var pairs = [];
        if(typeof data === "string") {
            return data;
        }
        else if(typeof data === "object") {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    pairs.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i].toString()));
                }
            }
            return pairs.join("&");
        }
    };
    if (options.type === "GET") {
        target = target + "?" + encodeFromData(options.data);
        request.open(options.type, target, true);
        request.onreadystatechange = function(){
            if (request.readyState === 4 && request.status === 200) {
                options.onsuccess(request.responseText);
            }
            else if (request.readyState === 4 && request.status !== 200) {
                options.onfail();
            }
        };
        request.send();
    }
    else if (options.type === "POST") {
        request.open(options.type, url, true);
        request.onreadystatechange = function(){
            if (request.readyState === 4 && request.status === 200) {
                options.onsuccess(request.responseText);
            }
            else if (request.readyState === 4 && request.status !== 200) {
                options.onfail();
            }
        };
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(encodeFromData(options.data));
    }
}

function bubbleSort(arr) {
    var i = arr.length ,j;
    var tempExchangVal;
    while (i > 0) {
        for (j = 0; j < i-1; j++) {
            if (arr[j]._date > arr[j+1]._date) {
                tempExchangVal = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = tempExchangVal;
            }
        }
        i--;
    }
    return arr;
}
function getTarget(e) {
    e = e || window.event;
    return e.srcElement ? e.srcElement : e.target;
}

