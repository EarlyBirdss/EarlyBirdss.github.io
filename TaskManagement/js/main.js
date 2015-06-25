/**
 * Created by Administrator on 2015/6/9.
 */


function Management(){
    this.oCateLeft = $('.classLeft')[0];
    this.oTaskCenter = $('.taskCenter')[0];
    this.oDetailRight = $('.detailRight')[0];
}

Management.prototype.init = function(){

    this.addCate();
    this.removeCate();
    this.clickActive();
    this.showDetail();
    this.addTask();
    this.finishTask();
    this.amendTask();
    this.removeTask();
    this.selectedOptions();

};
//新增分類
Management.prototype.addCate = function(){

    var that = this;

    var oAddNewIcon = $('.addNewCate',this.oCateLeft)[0];
    var oPop = $('#popover');
    var oConfirm = oPop.getElementsByClassName('confirm')[0];
    //弹出层
    oAddNewIcon.onclick = function() {
        //在默认列表上点击新增分类
        var oC = data.getCurrentCate();
        if(oC.id == 'default'){
            method.popTip('提示','默认分类不可添加子分类');
            method.showPopover();
            oConfirm.onclick = function(){
                method.hidePopover();
            };
            return;
        }
        //在已有任务的一级分类下不可添加子分类
        if(oC.tasks.length){
            method.popTip('提示','已有任务的一级分类不可添加子分类');
            method.showPopover();
            oConfirm.onclick = function(){
                method.hidePopover();
            };
            return;
        }
        //二级分类不可添加子分类
        if(oC.parent){
            method.popTip('提示','二级分类不可添加子分类');
            method.showPopover();
            oConfirm.onclick = function(){
                method.hidePopover();
            };
            return;
        }
        //可以添加类别
        else{
            method.popAddNew('新增分类','请输入类别名');
            method.showPopover();


            var oInput = oPop.getElementsByTagName('input')[0];
            oConfirm.onclick = function() {
                var val = oInput.value;
                var id, isSub;
                //dom元素
                var ul = that.oCateLeft.getElementsByTagName('ul')[0];
                var html = '';
                var arr = [];

                //存入localStorage
                var cate;            //当前新增类别 > 对象

                var cates = data.getCateArray();
                var curCate = data.getCurrentCate();
                var i = 0, n = cates.length;

                //判断是否已存在名字相同的任务
                if( method.isExistedTitle(val,true)){
                    return;
                }

                cate = curCate.id == 'all' ? new Cate(val, null, false) : new Cate(val, curCate.id, true);
                data.setItem(cate);
                isSub = cate.isSub;
                id = cate.id;
                data.pushSub(id);

                //关闭弹出层
                method.hidePopover();
                //顯示在界面中
                //第一級分類的情況
                if( !isSub) {
                    var li = document.createElement('li');
                    addClass(li,'classList');
                    arr = [];
                    arr.push('<h3 id=');
                    arr.push(cate.id + '>');
                    arr.push('<i class="icon-folder-open"></i>');
                    arr.push(val);
                    arr.push('(<span class="task-num">0</span>)');
                    arr.push('<i class="icon-remove removeTask"></i>');
                    arr.push('</h3>');
                    html = arr.join('');
                    li.innerHTML = html;
                    ul.appendChild(li);
                }
                //二級分類的情況
                if(isSub) {
                    var oParent = $('#' + cate.parent).parentNode;
                    //该列表下存在其他二级分类 >> 需创建 dd
                    if(oParent.getElementsByTagName('dl').length){
                        var dd = document.createElement('dd');
                        arr = [];
                        arr.push('<h4 id="');
                        arr.push(cate.id + '"');
                        arr.push('><i class="icon-file"></i>');
                        arr.push(val);
                        arr.push('(<span class="task-num">0</span>)');
                        arr.push('<i class="icon-remove removeTask"></i></h4>');
                        html = arr.join('');
                        dd.innerHTML = html;
                        oParent.getElementsByTagName('dl')[0].appendChild(dd);
                    }
                    //该列表下不存在其他二级分类 >> 需创建 dl
                    else{
                        var dl = document.createElement('dl');
                        dl.className = 'sub-task';
                        arr = [];
                        arr.push('<dd><h4 id="');
                        arr.push(cate.id + '"');
                        arr.push('><i class="icon-file"></i>');
                        arr.push(val);
                        arr.push('(<span class="task-num">0</span>)');
                        arr.push('<i class="icon-remove removeTask"></i></h4></dd>');
                        html = arr.join('');
                        dl.innerHTML = html;
                        oParent.appendChild(dl);
                    }
                   addClass(oParent.getElementsByTagName('dl')[0],'show');
                }
                method.updateCurrentCate(cate.id);
            };
        }
    };

};

//弹出或收起下级分类  显示中间任务列表
Management.prototype.clickActive = function() {

    var classLeft = $('.classLeft')[0];
    var ul = classLeft.getElementsByTagName('ul')[0];

    var tasks;  //当前点中任务Dom在localStorage中取得的task对象数组
    var task;
    //点击所有分类
    classLeft.getElementsByTagName('h2')[0].onclick = function(){
        var id;
        id = 'all';
        //在localStorage中重设isCurrent属性
        method.updateCurrentCate(id);
        tasks = data.getTaskArray();
        method.setTaskListPanel(tasks);
    };

    //点击分类列表
    addEvent(ul,'click',function(e){

        e = e || window.event;
        var el = e.srcElement || e.target;

        var li = el.parentNode.nodeName.toLowerCase() == 'li' ? el.parentNode : el.parentNode.parentNode;
        var dd = el.parentNode.nodeName.toLowerCase() == 'dd' ? el.parentNode : el.parentNode.parentNode;
        var dl = li.getElementsByTagName('dl')[0];
        var id;   //cateId

        var taskCenter = $('.taskCenter')[0];


        //如果点中的是一级分类
        if(li.nodeName.toLowerCase() == 'li') {
            id = li.getElementsByTagName('h3')[0].getAttribute('id');
            //在localStorage中重设isCurrent属性
            method.updateCurrentCate(id);
            if(dl){
                dl.className =  dl.className.indexOf('hidden') > -1 ? '' : 'hidden';
            }
        }
        //点中二级分类
        if(dd.nodeName.toLowerCase() == 'dd'){
            id = dd.getElementsByTagName('h4')[0].getAttribute('id');
            method.updateCurrentCate(id);
        }


        tasks =  data.getCurCateObjTaskArray(id);
        task = data.getCurrentCate();
        method.setTaskListPanel(tasks);

    });
};

//点击中间任务雷边，在右边显示任务细节
Management.prototype.showDetail = function() {
    var taskCenter = $('.taskCenter')[0];
    var taskList = taskCenter.getElementsByClassName('taskList')[0];
    addEvent(taskList, 'click', function(e){

        e = e || window.event;
        var el = e.srcElement || e.target;
        var dd;
        var id;
        var task;

        if(el.nodeName.toLowerCase() == 'strong'){
            dd = el.parentNode;
            id = dd.getAttribute('id');
            task = data.getItem(id);
            method.updateCurrentTask(id);
            method.setDetailPanel(id);
        }
    });
};

//删除类别
Management.prototype.removeCate = function() {
    var classLeft = $('.classLeft')[0];
    var ul = classLeft.getElementsByTagName('ul')[0];

    addEvent(ul,'click',function(e){
        e = e || window.event;
        var el = e.srcElement || e.target;

        var oPop = $('#popover');
        var oConfirm = oPop.getElementsByClassName('confirm')[0];

        if(el.className.indexOf('removeTask') > -1){
            method.popTip('提示','确认删除此分类及其所有任务吗？');
            method.showPopover();

            oConfirm.onclick = function(){

                method.hidePopover();
                //el.parentNode为当前li 或 dd
                //一级分类
                if(el.parentNode.nodeName.toLowerCase() == 'h3' || el.parentNode.nodeName.toLowerCase() == 'h4' ) {
                    el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode);
                }
                var id = el.parentNode.getAttribute('id');
                data.removeCate(id);
                method.updateCurrentCate('default');
                method.updateUnfinishedNum('all');
            };
        }
    });


};

//新增任务
Management.prototype.addTask = function() {

    var oTaskCenter = $('.taskCenter')[0];
    var oDetailRight = $('.detailRight')[0];
    var oAddNewIcon = oTaskCenter.getElementsByClassName('addNewTask')[0];

    oAddNewIcon.onclick = function() {

        var cate = data.getCurrentCate();

        //在已有子分类的父级分类不可添加任务
        if(cate.subcates.length){
            method.popTip('提示','已有子分类的一级分类不可添加任务');
            method.showPopover();
            var oPopConfirm = $('#popover').getElementsByClassName('confirm')[0];
            oPopConfirm.onclick = function(){
                method.hidePopover();
            };
            return;
        }

        method.setEditPanel();

        var oConfirm = oDetailRight.getElementsByClassName('confirm')[0];
        var oCancel = oDetailRight.getElementsByClassName('cancel')[0];
        var oTitle = oDetailRight.getElementsByTagName('input')[0];
        var oDate = oDetailRight.getElementsByTagName('input')[1];
        var oContent = oDetailRight.getElementsByTagName('textarea')[0];
        var oTitleTip = oDetailRight.getElementsByClassName('editTip')[0];
        var oDateTip = oDetailRight.getElementsByClassName('editTip')[1];
        var oContentTip = oDetailRight.getElementsByClassName('editTip')[2];
        var title;
        var date = oDate.value;
        var content;

        var oAllDom = oTaskCenter.getElementsByTagName('a')[0];

        var task;  //新建任务对象
        var curTask = data.getCurrentTask();

        oTitle.onblur = function(){
            title = oTitle.value;
            oTitleTip.innerHTML = !method.isRightTitle(title) ? '<i class="icon-bell-alt"></i>标题字数在2到15之间' : '';
        };
        oDate.onblur = function(){
            date = oDate.value;
            oDateTip.innerHTML = !method.isRightDate(date) ? '<i class="icon-bell-alt"></i>不符合日期规范' : '';
        };

        oContent.onkeyup = function(){
            content = oContent.value;
            oContentTip.innerHTML = method.getContentLength(content) + '个字';
        };

        oContent.onblur = function(){
            content = oContent.value;
            oContentTip.innerHTML = !method.getContentLength(content) ?
                                '<i class="icon-bell-alt"></i>内容可不为空' : method.getContentLength(content) + '个字';
        };

        addEvent(oConfirm,'click',function() {

            if(method.isRightTitle(title) && method.isRightDate(date) && method.getContentLength(content)){
                task = new Task(title,date,content,cate.id);
                data.setItem(task);
                method.updateCurrentTask(task.id);
                method.changeCur(oAllDom);
                data.addUnfinishedNum(cate.id);
                data.pushTask(task.id);
                method.setDetailPanel(task.id);
                method.updateUnfinishedNum(cate.id);
                method.setTaskListPanel(data.getCurCateObjTaskArray(cate.id));
            }
        });

        addEvent(oCancel, 'click',function(){
            method.setDetailPanel(curTask.id);
        });
    };

};

//完成任务
Management.prototype.finishTask = function() {

    var that = this;

    var detailRight = document.getElementsByClassName('detailRight')[0];

    addEvent(detailRight,'click',function(e){

        e = e || window.event;
        var el = e.srcElement || e.target;

        if(!this.getElementsByClassName('editIcon')[0]){
            return;
        }

        var finishIcon = this.getElementsByClassName('editIcon')[0].getElementsByTagName('i')[0];
        var finishDom = $('.taskCenter')[0].getElementsByTagName('a')[2];
        var curTask = data.getCurrentTask();
        var cateId = curTask.cate;
        var oFinishedTasks;

        if(el == finishIcon) {

            var oPop = $('#popover');
            var oConfirm = oPop.getElementsByClassName('confirm')[0];

            if(curTask.isFinished){
                method.popTip('提示','此项任务已完成');
                method.showPopover();

                oConfirm.onclick = function(){
                    method.hidePopover();
                }

            }
            else{
                method.popTip('提示','要完成该项任务吗？');
                method.showPopover();

                addEvent(oConfirm,'click',function(){

                    method.hidePopover();

                    curTask.isFinished = true;
                    data.setItem(curTask);

                    oFinishedTasks = data.getCurCateFinishObjTaskArray(cateId);
                    method.changeCur(finishDom);
                    data.subtractUnfinishedNum(cateId);
                    method.setTaskListPanel(oFinishedTasks);
                    method.updateUnfinishedNum(cateId);
                });
            }

        }

    });
};


//修改任务
Management.prototype.amendTask = function(){

    var detailRight = document.getElementsByClassName('detailRight')[0];

    addEvent(detailRight,'click',function(e) {

        e = e || window.event;
        var el = e.srcElement || e.target;

        if(!this.getElementsByClassName('editIcon')[0]){
            return;
        }

        var amendIcon = this.getElementsByClassName('editIcon')[0].getElementsByTagName('i')[1];
        var task = data.getCurrentTask();
        var id = task.id;
        var title = task.title;
        var finishDate = task.finishDate;
        var content = task.content;

        if(el == amendIcon){

            //任务为完成状态，不可编辑
                if(task.isFinished){
                    method.popTip('提示','已完成任务不可编辑');
                    method.showPopover();
                    var oPop = $('#popover');
                    var oConfirm = oPop.getElementsByClassName('confirm')[0];

                    oConfirm.onclick = function(){
                        method.hidePopover();
                    }

                }
                //更新右部编辑面板
                else{

                    method.setEditPanel(title,finishDate,content);

                    var detailRight = $('.detailRight')[0];
                    var confirm = detailRight.getElementsByClassName('confirm')[0];
                    var cancel = detailRight.getElementsByClassName('cancel')[0];
                    var tit = detailRight.getElementsByTagName('input')[0];
                    var dat = detailRight.getElementsByTagName('input')[1];
                    var con = detailRight.getElementsByTagName('textarea')[0];

                    addEvent(confirm,'click',function() {

                        var titVal = tit.value;
                        var datVal = dat.value;
                        var conVal = con.value;

                        task.title = titVal;
                        task.finishDate = datVal;
                        task.content = conVal;
                        data.setItem(task);
                        method.updateTaskListPanel(id);
                        method.setDetailPanel(id);
                    });

                    addEvent(cancel,'click',function(){
                        method.setDetailPanel(id);
                    });

                }
        }

    });


};

//删除任务
Management.prototype.removeTask = function(id) {

    var OtaskCenter = $('.taskCenter')[0];
    addEvent(OtaskCenter,'click',function(e){
        e = e || window.event;
        var el = e.srcElement || e.target;

        if(el.className.indexOf('removeTask') > -1){

            method.popTip('提示','确定要删除此项任务吗？');
            method.showPopover();

            var confirm = $('#popover').getElementsByClassName('confirm')[0];
            addEvent(confirm,'click',function(){
                //这里连续多次删除任务，第二次删除时，这些代码执行了两次 ==> dd为前一个删除的dd
                if(!el.parentNode.parentNode) {
                    return;
                }

                method.hidePopover();

                var dd = el.parentNode;
                var ul = dd.parentNode.parentNode;
                var id = dd.getAttribute('id');
                var nextTaskId;
                var cateId = data.getItem(id).cate;
                data.removeTask(id);
                var nextTask = method.sortByDate(data.getCurCateObjTaskArray(cateId))[0];
                nextTaskId = nextTask ? nextTask.id : null;
                method.setDetailPanel(nextTaskId);

                //同完成时间下有多个任务
                if(ul.getElementsByTagName('dd').length > 1){
                    dd.parentNode.removeChild(dd);
                }
                else{
                    ul.parentNode.removeChild(ul);
                }
            });


        }
    });
};

//查看所有、完成、未完成任务分类
Management.prototype.selectedOptions = function(){
    var OtaskCenter = $('.taskCenter')[0];
    var cateList = OtaskCenter.getElementsByClassName('cateList')[0];
    var all = cateList.getElementsByTagName('a')[0];
    var unfinished = cateList.getElementsByTagName('a')[1];
    var finished = cateList.getElementsByTagName('a')[2];

    addEvent(cateList,'click',function(e){
        e = e || window.event;
        var el = e.srcElement || e.target;

        var curCate = data.getCurrentCate();
        var cateId = curCate.id;

        switch (el) {
            case all:
                method.changeCur(all);
                var allTasks = data.getCurCateObjTaskArray(cateId);
                method.setTaskListPanel(allTasks);
                break;
            case unfinished:
                method.changeCur(unfinished);
                var unfTasks = data.getCurCateUnfObjTaskArray(cateId);
                method.setTaskListPanel(unfTasks);
                break;
            case finished:
                method.changeCur(finished);
                var finTasks = data.getCurCateFinishObjTaskArray(cateId);
                method.setTaskListPanel(finTasks);
                break;
        }

    });

};


var manage = new Management();
manage.init();