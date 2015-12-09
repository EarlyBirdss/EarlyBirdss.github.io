/**
 * Created by Administrator on 2015/6/9.
 * 初始化，从本地存储出拿出数据
 * 左列显示全部分类
 * 中间列显示默认分类所有任务
 * 右列显示排列最前任务细节
 * 不存在任务则不显示
 *
 */
window.onload = function() {
    
    
    //window.localStorage.clear();
    if( !data.getItem('all') || !data.getItem('default')) {
        var allTask = new Cate('全部分类', null, false, 'all');
        data.setItem(allTask);

        var defaultCate = new Cate('默认分类', null, false, 'default');
        data.setItem(defaultCate);
    }

    method.updateCurrentCate('default');
    method.updateUnfinishedNum('default');
    
    
    var cates = data.getCateArray();
    var defaultTasks = data.getCurCateObjTaskArray('default');

    var taskCenter = $('.taskCenter')[0];
    var ul = $('.classLeft')[0].getElementsByTagName('ul')[0];
    var html = '';
    var arr = [];

    var i, n;




    var st = window.localStorage;
    for(var k = 0; k < st.length; k++){
        var key = st.key(k);
        var value = st.getItem(key);
        console.log(key);
        console.log(value);
    }



    //类别列表
    for(i = 0, n = cates.length; i < n; i++) {
        if( !cates[i].isSub && cates[i].id != 'all' && cates[i].id != 'default') {
            var li = document.createElement('li');
            addClass(li,'classList');
            arr = [];
            arr.push('<h3 id="');
            arr.push(cates[i].id + '');
            arr.push('"><i class="icon-folder-open"></i>');
            arr.push(cates[i].title);
            arr.push('(<span class="task-num">' + cates[i].unfinishedNum + '</span>)');
            arr.push('<i class=" icon-remove removeTask"></i>');
            arr.push('</h3>');
            html = arr.join('');
            li.innerHTML = html;
            ul.appendChild(li);
        }
        //二级分类
        else if(cates[i].isSub){
            //该列表下存在其他二级分类 >> 需创建 dd
            var oParent = document.getElementById(cates[i].parent).parentNode;
            if(oParent.getElementsByTagName('dl').length){
                var dd = document.createElement('dd');
                arr = [];
                arr.push('<h4 id="');
                arr.push(cates[i].id + '"');
                arr.push('><i class="icon-file"></i>');
                arr.push(cates[i].title);
                arr.push('(<span class="task-num">' + cates[i].unfinishedNum + '</span>)');
                arr.push('<i class="icon-remove removeTask"></i></h4>');
                html = arr.join('');
                dd.innerHTML = html;
                oParent.getElementsByTagName('dl')[0].appendChild(dd);
            }
            //该列表下不存在其他二级分类 >> 需创建 dl
            else{
                var dl = document.createElement('dl');
                dl.className = 'sub-task hidden';
                arr = [];
                arr.push('<dd><h4 id="');
                arr.push(cates[i].id + '"');
                arr.push('><i class="icon-file"></i>');
                arr.push(cates[i].title);
                arr.push('(<span class="task-num">' + cates[i].unfinishedNum + '</span>)');
                arr.push('<i class="icon-remove removeTask"></i></h4></dd>');
                html = arr.join('');
                dl.innerHTML = html;
                oParent.appendChild(dl);
            }
        }
    }
    //任务列表
    defaultTasks = method.sortByDate(defaultTasks);
    method.setTaskListPanel(defaultTasks);

    //任务细节
    if(defaultTasks[0]){
        defaultTasks[0].isCurrent = true;
        data.setItem(defaultTasks[0]);
        method.setDetailPanel(defaultTasks[0].id);
    }

};
