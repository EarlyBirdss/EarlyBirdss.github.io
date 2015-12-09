/**
 * Created by Administrator on 2015/5/29.
 */

var $ = function(id){
    return document.getElementById(id);
};
/*var $ = function(arg,context){
    context = context || document;
    var sub = arg.substr(1);
    var all = [], i,len,cls = [];
    if(typeof(arg) == 'string'){
        switch (arg.charAt(0)){
            case '#':
                return context.getElementById(sub);
            break;
            case '.':
                if(context.getElementsByClassName){
                    return context.getElementsByClassName(sub);
                }
                all = context.getElementsByTagName('*');
                len = all.length;
                for(i = 0; i < len; i++){
                    if( all[i].className.indexOf(sub) > -1
                        || all[i].className.indexOf( ' '+ sub) > -1
                        || all[i].className.indexOf( sub + '') > -1
                    ){
                        cls.push(all[i]);
                    }
                }
                return cls;
                break;
            case '':
                return context.getElementsByTagName(sub);
        }
    }
};*/




window.onload = function(){
    init();
    removeCate();
    handleClick();
    addCate();
    getTotalUnfinished();
    classByIsFinished();
    addTask();
    showDetail();

    sortByDate();
};

function init(){
    var allTask = $('allTask');
    var subTaskLists = allTask.getElementsByTagName('dd');
    for(var n = 0;n < subTaskLists.length; n++) {
        subTaskLists[n].index = n;
    }
}
/**
 * 移除分类
 */
function removeCate(){
    //移除任务
    var allTask = $('allTask');
    var taskList = allTask.getElementsByTagName('li');
    for(var i = 0; i < taskList.length; i++){
        taskList[i].getElementsByClassName('removeTask')[0].onclick = function(){
            var con = confirm('确定要删除此分类吗？');
            if(con){
                var parent = this.parentNode;
                if(parent.getElementsByTagName('a')[0].className == 'defaultTask'){
                    alert('不能删除默认分类！');
                }else {
                    parent.parentNode.removeChild(parent);
                }
            }
        }
    }
}
/**
 * 点击分类查看分类下的所有任务，点击任务在中间栏显示具体任务
 */
function handleClick(){
    var allTask = $('allTask');
    var titles = allTask.getElementsByTagName('h1');
    //点击任一分类，添加current,
    for(var i = 0; i < titles.length; i++){
        titles[i].onclick = function() {
            var list = this.parentNode;
            if (list.getElementsByTagName('dl')[0]) {
                list.getElementsByTagName('dl')[0].className == 'sub-task show' ? list.getElementsByTagName('dl')[0].className = 'sub-task hidden' :
                    list.getElementsByTagName('dl')[0].className = 'sub-task show';
             }
            for(var j = 0; j < titles.length; j++){
                titles[j].parentNode.className = '';
            }
            list.className = 'cur';
        }
    }
    var subTaskLists = allTask.getElementsByTagName('dd');
    for(var m = 0;m < subTaskLists.length; m++){
        var that = this;
        subTaskLists[m].onclick = function(){
            for(var n = 0;n < subTaskLists.length; n++) {
                subTaskLists[n].className = '';
            }
            this.className = 'current';
            var centerTaskLists = $('likeTab').getElementsByTagName('dd');
            var thisIndex = this.index;
            for(var p = 0; p < centerTaskLists.length; p++){
                centerTaskLists[p].className = 'hidden';
            }
            if(thisIndex < centerTaskLists.length) {
                centerTaskLists[thisIndex].className = 'show';
                classByIsFinished();
            }
            showDetail();
        }
    }
}
/**
 * 新增分类
 */
function addCate(){
    var addNewCate = document.getElementsByClassName('addNewCate')[0];
    var allTask = $('allTask');
    addNewCate.onclick = function(){
        var html = '';
        var li = document.createElement('li');
        var pro = prompt('请输入类别名');
        if(pro) {
            html += '<li><h1><a href="#" class="defaultTask"><i class="icon-folder-open"></i>' + pro + ' (<span class="task-num" id="defaultNum">0</span>)</a></h1>'
                + '<a href="#" class="removeTask"><i class=" icon-remove"></i></a></li>';
            li.innerHTML = html;
            allTask.appendChild(li);
        }else{
            alert('请输入类别名！');
        }
    }
}
/**
 * 计算未完成任务数
 */
function getTotalUnfinished(){
    var allTask = $('allTask');
    var cateLists = allTask.getElementsByTagName('li');
    for( var i= 0; i < cateLists.length; i++){
        var taskNum = cateLists[i].getElementsByClassName('task-num')[0];
        var unfinishedSum = 0;
        if(cateLists[i].getElementsByTagName('dd')) {
            var subTaskLists = cateLists[i].getElementsByTagName('dd');
            for(var j = 0; j < subTaskLists.length; j++){
                var subTaskNum = subTaskLists[j].getElementsByClassName('task-num')[0];
                var thisIndex = subTaskLists[j].index;
                var centerTaskList = $('likeTab').getElementsByTagName('dd')[thisIndex];
                var unfinished = centerTaskList.getElementsByTagName('li').length;
                for(var k = 0; k < centerTaskList.getElementsByTagName('li').length; k++){
                    if( centerTaskList.getElementsByTagName('li')[k].className == 'finished'){
                        unfinished --;
                    }
                    subTaskNum.innerHTML = unfinished;
                }
                unfinishedSum += parseInt(subTaskLists[j].getElementsByClassName('task-num')[0].innerHTML);
            }
            taskNum.innerHTML = unfinishedSum;

        }else{
            taskNum.innerHTML = '0';
        }
    }
}

/**
 * 任务列表按日期（升序或者降序，自行设定）进行聚类
 */
function sortByDate(){
    var centerTaskLists = $('likeTab').getElementsByTagName('dd');
    var len = centerTaskLists.length;
    for(var i = 0; i < len; i++){
        var taskItems  = centerTaskLists[i].getElementsByClassName('taskItem');
        var taskList = centerTaskLists[i].getElementsByClassName('taskList')[0];
        var sortArr = [];
        for(var j = 0; j < taskItems.length; j++) {
            sortArr.push(taskItems[j]);
            //taskItems[j] = sortArr.map(taskItems[j], function(o){ return o; });
        }
        sortArr.sort(function(date1,date2){
            var a1 = parseInt(date1.getElementsByClassName('taskTime')[0].innerHTML.toString().split('-').join(''));
            var a2 = parseInt(date2.getElementsByClassName('taskTime')[0].innerHTML.toString().split('-').join(''));
            return a2 - a1;
        });
        for( var k = 0; k < sortArr.length; k++){
            taskList.appendChild(sortArr[k]);
            centerTaskLists[i].appendChild(taskList);
        }
    }
}
function classByIsFinished(){
    var cateList = document.getElementsByClassName('cateList')[0];
    var all = cateList.getElementsByTagName('a')[0];
    var unfinished = cateList.getElementsByTagName('a')[1];
    var finished = cateList.getElementsByTagName('a')[2];
    var centerTaskList = $('likeTab').getElementsByClassName('show')[0];
    var allHtml = centerTaskList.innerHTML;
    all.className = finished.className = unfinished.className = '';
    all.className = 'cur';
    cateList.addEventListener('click',function(e){
        var e = e || window.event;
        var el = e.srcElement;
        all.className = finished.className = unfinished.className = '';
        switch (el){
            case all:
                all.className = 'cur';
                centerTaskList.innerHTML = allHtml;
                break;
            case unfinished:
                isFinished(allHtml,unfinished,'finished');
                break;
            case finished:
                isFinished(allHtml,finished,'');
                break;
        }
    });
}
function isFinished(allHtml,el,cls){
    var centerTaskList = $('likeTab').getElementsByClassName('show')[0];
    centerTaskList.innerHTML = allHtml;
   // console.log(allHtml);
    var lis = centerTaskList.getElementsByTagName('li');
    el.className = 'cur';
    for(var i = 0; i < lis.length; i++){
        if(lis[i].className == cls || lis[i].className == cls + 'cur'){
            lis[i].parentNode.removeChild(lis[i]);
            i--;
        }
    }
    var lists = centerTaskList.getElementsByClassName('taskItem');
    for(var i = 0;i < lists.length; i++){
        if( !lists[i].getElementsByTagName('li')[0]){
            lists[i].parentNode.removeChild(lists[i]);
            i--;
        }
    }
}

function addTask(){
    var addNewTask = document.getElementsByClassName('addNewTask')[0];
    addNewTask.onclick = function(){
        var editRight = document.getElementsByClassName('editRight')[0];
        document.getElementsByClassName('detailRight')[0].className = 'detailRight hidden';
        editRight.className = 'editRight show';
        var el = document.createElement('li');
        document.getElementsByClassName('taskItem')[0].getElementsByTagName('ul')[0].appendChild(el);
        handleButtonClick(el);
    }
}

function showDetail(){
    var dds = $('likeTab').getElementsByTagName('dd');
    for(var q = 0; q < dds.length; q++){
        if( dds[q].className == 'show' ){

            var centerTaskList = dds[q].getElementsByClassName('taskList')[0];
            var lis = centerTaskList.getElementsByTagName('li');
            var detailRight = document.getElementsByClassName('detailRight')[0];
            for(var i = 0; i < lis.length; i++){
                lis[i].onclick = function(){
                    var el = this;
                    var content = el.getElementsByClassName('detailContent')[0].innerHTML;
                    var taskName = el.innerHTML;
                    var finishDate = el.parentNode.parentNode.getElementsByTagName('h5')[0].innerHTML;
                    var html = '<div class="detailTitle"> '+
                        '<span>'+ taskName+' </span>'+
                        ' <div class="editIcon"><a href="#"><i class="icon-check icon-2x"></i></a><a href="#"><i class="icon-edit icon-2x"></i></a></div>'+
                        ' </div>'+
                        '<div class="finishDate">'+
                        '  完成日期：<span>'+ finishDate+'</span>'+
                        ' </div>'+
                        ' <div class="detailContent show"> '+
                        content +
                        '</div>';

                    detailRight.innerHTML = html;
                    addEditIcon(detailRight,el);

                };
                if(lis[i].className == 'cur'){
                    lis[i].onclick();
                }
            }
        }
    }
}
function addEditIcon(detailRight,el){
    var finishIcon = detailRight.getElementsByTagName('i')[0];
    var editIcon = detailRight.getElementsByTagName('i')[1];
    finishIcon.onclick = function(){
        var con = window.confirm('确定要完成此项任务吗？');
        if(con){
            el.className = 'finished';
            classByIsFinished();
        }
    };
    editIcon.onclick = function(){
        detailRight.className = 'detailRight hidden';
        var editRight = document.getElementsByClassName('editRight')[0];
        editRight.className = 'editRight show';
        var title = editRight.getElementsByTagName('input')[0];
        var date = editRight.getElementsByTagName('input')[1];
        var cont = editRight.getElementsByTagName('textarea')[0];
            title.value = el.getElementsByTagName('strong')[0].innerHTML;
            date.value = el.parentNode.parentNode.getElementsByTagName('h5')[0].innerHTML.toString().trim();
            cont.innerHTML = el.getElementsByClassName('detailContent')[0].getElementsByTagName('p')[0].innerHTML;

        handleButtonClick(el);

    };


}
function handleButtonClick(el){
    var confirm = $('confirm');
    var cancel = $('cancel');

    var editRight = document.getElementsByClassName('editRight')[0];
    var detailRight = document.getElementsByClassName('detailRight')[0];
    var title = editRight.getElementsByTagName('input')[0];
    var date = editRight.getElementsByTagName('input')[1];
    var cont = editRight.getElementsByTagName('textarea')[0];

    date.onblur = function(){
        var reg = /^20\d{2}-(0\d)|11|12-([0-2]\d)|(3[0-1])$/g;
        var reg2 = /\d{4}-[0[1-9]|1[0-2]]-(3[0-1])$/g;
        if(!reg2.test(date.value)){
            editRight.getElementsByClassName('tip')[0].innerHTML = '日期不符合规范！';
            return false;
        }
        return true;
    };
    cont.onkeyup = function(){
        var len = this.value.length;
        editRight.getElementsByClassName('taTip')[0].innerHTML = len + '字';
    };
    cont.onblur = function(){
        if( this.value.length == 0 ){
            alert('内容不可为空！');
            return false;
        }
        return true;
    };

    cont.onkeyup();

    confirm.onclick = function() {
        var ifDate = date.onblur();
        var ifCont = cont.onblur();
        if (ifCont && ifDate ) {
            var con = window.confirm('确定保存此项任务吗？');
            if (con) {
                var html = '';
                var isFound = false;
                if (el.parentNode.parentNode.getElementsByTagName('h5')[0].innerHTML.toString().trim() != date.value.trim()) {
                    var titles = el.parentNode.parentNode.parentNode.getElementsByTagName('h5');
                    for(var m = 0; m < titles.length; m++){
                        if(titles[m].innerHTML.toString().trim() == date.value.trim()){
                            isFound = true;
                            var li = document.createElement('li');
                            //找到centerTaskList
                            var liLen = el.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('li');
                            for(var l = 0; l < liLen.length; l++){
                                if(liLen[l].className.indexOf('finished') > -1){
                                    liLen[l].className = 'finished';
                                }else {
                                    liLen[l].className = '';
                                }
                            }
                            li.className = 'cur';
                            var ul = titles[m].parentNode.getElementsByTagName('ul')[0];
                            html = '<strong>' + title.value+ '</strong>'+
                                '<div class="detailContent hidden">'+
                                '<p>'+ cont.value+'</p>'+
                                '</div>';
                            li.innerHTML = html;
                            ul.appendChild(li);
                        }
                    }
                    if( !isFound ) {
                        var dd = document.createElement('dd');
                        var liLen = el.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('li');
                        for(var l = 0; l < liLen.length; l++){
                            if(liLen[l].className.indexOf('finished') > -1){
                                liLen[l].className = 'finished';
                            }else {
                                liLen[l].className = '';
                            }
                        }
                        html = ' <div class="taskList">' +
                            '<ul class="taskItem">' +
                            '<h5 class="taskTime">' +
                            date.value +
                            '</h5>' +
                            '<ul>' +
                            '<li class="cur"><strong>' + title.value + '</strong>'+
                            '<div class="detailContent hidden">' +
                            '<p>' + cont.value + '</p>' +
                            '</div>' +
                            '</li>' +
                            '</ul>' +
                            '</ul>' +
                            '</div>';
                        dd.innerHTML = html;
                        if(el.className == 'finished'){
                            dd.getElementsByTagName('li')[0].className = 'finished cur';
                            console.log(el);
                        }
                        el.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(dd);
                    }
                    sortByDate();
                } else {
                    el.getElementsByTagName('strong')[0].innerHTML = title.value;
                    el.getElementsByClassName('detailContent')[0].getElementsByTagName('p')[0].innerHTML = cont.innerHTML;
                }
                detailRight.className = 'detailRight show';
                editRight.className = 'editRight hidden';
                showDetail();
                sortByDate();

                var liLen = el.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('li');
                for(var l = 0; l < liLen.length; l++){
                    if( liLen[l].className.indexOf('cur') > -1){
                        liLen[l].onclick();
                    }
                }
            }
        }
    };

    cancel.onclick = function(){
        detailRight.className = 'detailRight show';
        editRight.className = 'editRight hidden';
    }
}