/**
 * Created by Administrator on 2015/6/9.
 * 构造器
 * cate
 * task
 */
function Cate(title, parent, isSub, id) {
    this.title = title;
    this.parent = parent;
    this.id =  id || Date.now();
    this.unfinishedNum = 0;
    this.subcates = [];
    this.tasks = [];
    this.isSub = isSub;
    this.isCurrent = true;
}

Cate.prototype = {
    constructor: Cate
};

function Task(title, finishDate, content,cate){
    this.id = Date.now();
    this.title = title;
    this.finishDate = finishDate;
    this.content = content;
    this.cate = cate;
    this.isFinished = false;
    this.isCurrent = true;
}

Task.prototype = {
    constructor : Task
};


