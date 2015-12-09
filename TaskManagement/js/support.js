/**
 * Created by Administrator on 2015/6/9.
 * 存储数据
 */

var data = {
	//根据id得到localStorage中元素
	getItem: function(id) {
		return JSON.parse(window.localStorage.getItem(id));
	},
	//localStorage中存储元素
	setItem: function(obj) {
		var str = JSON.stringify(obj);
		var storage = window.localStorage;
		storage.setItem(obj.id, str);
	},
	//localStorage中移除元素,如果该元素有儿子，移除儿子
	removeItem: function(id) {
		var obj = data.getItem(id);
		if (obj.subcates) {
			var subs = obj.subcates;
			var i, n;
			for (i = 0, n = subs.length; i < n; i++) {
				window.localStorage.removeItem(subs[i]);
			}
		}
		window.localStorage.removeItem(id);
	},
	//在localStorage中获取所有的任务
	getTaskArray: function() {
		var storage = window.localStorage;

		var tsArr = [];

		for (var i = 0, len = storage.length; i < len; i++) {
			var key = storage.key(i);
			var value = JSON.parse(storage.getItem(key));
			if (value.cate) {
				tsArr.push(value);
			}
		}
		return tsArr;
	},
	//在localStorage中获取所有的类别
	getCateArray: function() {
		var storage = window.localStorage;

		var ctArr = [];

		for (var i = 0, len = storage.length; i < len; i++) {
			var key = storage.key(i);
			var value = JSON.parse(storage.getItem(key));
			if (value.parent || value.parent === null) {
				ctArr.push(value);
			}
		}
		return ctArr;
	},
	//在localStorage类别栏中获取当前isCurrent = true的对象
	getCurrentCate: function() {
		var cates = data.getCateArray();
		var i, n = cates.length;
		for (i = 0; i < n; i++) {
			if (cates[i].isCurrent) {
				return cates[i];
			}
		}
		return null;
	},
	//在localStorage任务栏中获取当前isCurrent = true的对象
	getCurrentTask: function() {
		var tasks = data.getTaskArray();
		var i, n = tasks.length;
		for (i = 0; i < n; i++) {
			if (tasks[i].isCurrent) {
				return tasks[i];
			}
		}
	},
	//新增一个子类别时，讲该任务放进当前类别的subCate数组中
	pushSub: function(id) {

		if (!id) {
			return;
		}

		var sub = data.getItem(id);
		if (sub.isSub) {
			var parent = data.getItem(sub.parent);
			parent.subcates.push(sub.id);
			data.setItem(parent);
		}
	},
	//新增一个任务时，讲该任务放进当前类别的tasks数组中
	pushTask: function(id) {

		if (!id) {
			return;
		}

		var task = data.getItem(id);
		var cateId = task.cate;
		var cate = data.getItem(cateId);
		cate.tasks.push(id);
		data.setItem(cate);
	},
	//新增一个任务时，当前类别未完成任务数目加一
	addUnfinishedNum: function(id) {

		if (!id) {
			return;
		}

		var cate = data.getItem(id);
		var allCate = data.getItem('all');
		cate.unfinishedNum += 1;
		data.setItem(cate);
		//更新父级
		if (cate.parent) {
			var parentCate = data.getItem(cate.parent);
			parentCate.unfinishedNum += 1;
			data.setItem(parentCate);
		}
		//更新所有任务的未完成数
		allCate.unfinishedNum += 1;
		data.setItem(allCate);
	},
	//点击完成,类别为完成数目减一
	subtractUnfinishedNum: function(id) {

		if (!id) {
			return;
		}

		var cate = data.getItem(id);
		var allCate = data.getItem('all');
		cate.unfinishedNum = cate.unfinishedNum > 0 ? cate.unfinishedNum - 1 : 0;
		data.setItem(cate);
		if (cate.parent) {
			var parentCate = data.getItem(cate.parent);
			parentCate.unfinishedNum = parentCate.unfinishedNum > 0 ? parentCate.unfinishedNum - 1 : 0;
			data.setItem(parentCate);
		}
		allCate.unfinishedNum = allCate.unfinishedNum > 0 ? allCate.unfinishedNum - 1 : 0;
		data.setItem(allCate);
	},
	//获取全部未完成任务数目
	getAllUnfinishedNum: function() {
		var cates = data.getCateArray();
		var i, n, sum = 0;
		for (i = 0, n = cates.length; i < n; i++) {
			sum += cates[i].unfinishedNum;
		}
		return sum;
	},
	//获取当前类别的对象任务数组
	getCurCateObjTaskArray: function(cateId) {

		if (!cateId) {
			return;
		}

		var oTaskArray = [];
		var iTaskArray = data.getItem(cateId).tasks;
		var i, n;
		for (i = 0, n = iTaskArray.length; i < n; i++) {
			var task = data.getItem(iTaskArray[i]);
			oTaskArray.push(task);
		}
		return oTaskArray;
	},
	//获取当前类别所有完成的任务
	getCurCateFinishObjTaskArray: function(cateId) {

		if (!cateId) {
			return;
		}

		var fTask = [];
		var oTask = data.getCurCateObjTaskArray(cateId);
		var i, n;
		for (i = 0, n = oTask.length; i < n; i++) {
			if (oTask[i].isFinished) {
				fTask.push(oTask[i]);
			}
		}
		return fTask;
	},
	//获取当前类别所有未完成任务
	getCurCateUnfObjTaskArray: function(cateId) {

		if (!cateId) {
			return;
		}

		var uTask = [];
		var oTask = data.getCurCateObjTaskArray(cateId);
		var i, n;
		for (i = 0, n = oTask.length; i < n; i++) {
			if (!oTask[i].isFinished) {
				uTask.push(oTask[i]);
			}
		}
		return uTask;
	},
	//删除本地存贮中当下目录所有的子级分类和任务
	removeCate: function(id) {

		if (!id) {
			return;
		}
		var cate = data.getItem(id);
		var subCatesId;
		var tasksId;
		var subCate;
		var parent = cate.parent;
		var parentCate;
		var i, n, j, m;
		var catePos;
		//二级分类
		if (cate.isSub) {
			tasksId = cate.tasks;
			parentCate = data.getItem(parent);
			subCatesId = parentCate.subcates;
			catePos = method.indexOf(subCatesId, id);
			subCatesId.splice(catePos, 1);
			data.setItem(parentCate);
			for (i = 0, n = tasksId.length; i < n; i++) {
				data.removeItem(tasksId[i]);
			}
		}
		//一级分类
		else {
			subCatesId = cate.subcates;
			//删除任务
			if (!subCatesId.length) {
				tasksId = cate.tasks;
				for (i = 0, n = tasksId.length; i < n; i++) {
					data.removeItem(tasksId[i]);
				}
			} else {
				//删除二级分类
				for (i = 0, n = subCatesId.length; i < n; i++) {
					subCate = data.getItem(subCatesId[i]);
					tasksId = subCate.tasks;
					for (j = 0, m = tasksId.length; j < m; j++) {
						data.removeItem(tasksId[j]);
					}
					data.removeItem(subCatesId[i]);
				}
			}
		}
		data.removeItem(id);
	},
	//删除本地存贮，删除所属类别的taskID
	removeTask: function(id) {

		if (!id) {
			return;
		}

		var task = data.getItem(id);
		var cateId = task.cate;
		var cate = data.getItem(cateId);
		var tasksId = cate.tasks;
		var taskPos = method.indexOf(tasksId, id);
		tasksId.splice(taskPos, 1);
		data.setItem(cate);
		data.removeItem(id);
		data.subtractUnfinishedNum(cateId);
		method.updateUnfinishedNum(cateId);
	}
};
var method = {
	//显示弹出层   信息提示框或输入框  isTip的值为true 为信息提示框;false 输入框
	showPopover: function() {
		var oMask = $('#mask');
		var oPop = $('#popover');
		var body = document.body;
		var title = oPop.getElementsByClassName('title')[0];
		var close = oPop.getElementsByTagName('i')[0];
		var cancel = oPop.getElementsByClassName('cancel')[0];
		var confirm = oPop.getElementsByClassName('confirm')[0];

		var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
		var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
		var popWidth = 400;
		var popHeight = 180;

		removeClass(oMask, 'hidden');
		removeClass(oPop, 'hidden');

		body.style.width = cWidth + 'px';
		body.style.height = cHeight + 'px';
		body.style.overflow = 'hidden';

		oMask.style.width = cWidth + 'px';
		oMask.style.height = cHeight + 'px';

		oPop.style.left = (cWidth - popWidth) / 2 > 0 ? (cWidth - popWidth) / 2 + 'px' : 0;
		oPop.style.top = (cHeight - popHeight) / 2 > 0 ? (cHeight - popHeight) / 2 + 'px' : 0;

		cancel.onclick = close.onclick = oMask.onclick = function() {
			addClass(oMask, 'hidden');
			addClass(oPop, 'hidden');
		};
		(function() {
			var offsetX = 0;
			var offsetY = 0;
			var oLeft = oPop.offsetLeft;
			var oTop = oPop.offsetTop;
			var isDraging = false;
			title.onmousedown = function(e) {

				e = e || window.event;
				offsetX = e.pageX - oLeft;
				offsetY = e.pageY - oTop;
				isDraging = true;
			};
			title.onmousemove = function(e) {
				if (isDraging) {
					oPop.style.left = Math.min(cWidth - popWidth, Math.max(0, e.pageX - offsetX)) + 'px';
					oPop.style.top = Math.min(cHeight - popHeight, Math.max(0, e.pageY - offsetY)) + 'px';
				}
			};
			title.onmouseup = function() {
				isDraging = false;
			}
		})();
	},
	//关闭弹出层
	hidePopover: function() {
		var oMask = $('#mask');
		var oPop = $('#popover');

		addClass(oMask, 'hidden');
		addClass(oPop, 'hidden');
	},
	//确定弹出层内容   ==> 输入框 新增分类或新增任务
	popAddNew: function(title, placeholder) {

		var oPop = $('#popover');
		var input = document.createElement('input');
		var oTitle = oPop.getElementsByClassName('title')[0];

		if (oPop.getElementsByTagName('p').length) {
			oPop.removeChild(document.getElementsByTagName('p')[0]);
		}
		if (oPop.getElementsByTagName('input').length) {
			oPop.removeChild(document.getElementsByTagName('input')[0]);
		}

		oTitle.innerHTML = title + '<i class="icon-remove icon-2x"></i>';

		input.setAttribute('type', 'text');
		input.setAttribute('placeholder', placeholder);
		oPop.appendChild(input);
	},
	//确定弹出层内容   ==> 提示框
	popTip: function(title, tip) {

		var oPop = $('#popover');
		var p = document.createElement('p');
		var oTitle = oPop.getElementsByClassName('title')[0];

		if (oPop.getElementsByTagName('p').length) {
			oPop.removeChild(document.getElementsByTagName('p')[0]);
		}
		if (oPop.getElementsByTagName('input').length) {
			oPop.removeChild(document.getElementsByTagName('input')[0]);
		}

		oTitle.innerHTML = title + '<i class="icon-remove icon-2x"></i>';

		p.innerHTML = tip;
		oPop.appendChild(p);
	},
	//更新类别isCurrent属性以及视图
	updateCurrentCate: function(id) {

		if (!id) {
			return;
		}

		var obj = data.getItem(id);
		var cates = data.getCateArray();
		var i, n = cates.length;
		for (i = 0; i < n; i++) {
			cates[i].isCurrent = false;
			data.setItem(cates[i]);
			if (document.getElementById(cates[i].id)) {
				removeClass(document.getElementById(cates[i].id), 'current');
			}
		}
		obj.isCurrent = true;
		data.setItem(obj);
		addClass(document.getElementById(id), 'current');
	},
	//更新任务isCurrent属性以及视图
	updateCurrentTask: function(id) {

		if (!id) {
			return;
		}

		var task = data.getItem(id);
		var cateId = task.cate;
		var cate = data.getItem(cateId);
		var tasksId = cate.tasks;
		var i, n = tasksId.length;
		for (i = 0; i < n; i++) {
			var tasks = data.getItem(tasksId[i]);
			tasks.isCurrent = false;
			data.setItem(tasks);
			if (document.getElementById(tasks.id)) {
				removeClass(document.getElementById(tasks.id), 'current');
			}
		}
		task.isCurrent = true;
		data.setItem(task);
		addClass(document.getElementById(id), 'current');
	},
	//更新类别未完成数目
	updateUnfinishedNum: function(id) {
		var cate = data.getItem(id);
		var oDom = document.getElementById(id);
		if (oDom) {
			oDom.getElementsByClassName('task-num')[0].innerHTML = cate.unfinishedNum;
			//二级分类更新父级
			if (oDom.nodeName.toLowerCase() == 'h4') {
				var parentCate = data.getItem(cate.parent);
				var oParentDom = oDom.parentNode.parentNode.parentNode.getElementsByTagName('h3')[0].getElementsByClassName('task-num')[0];
				oParentDom.innerHTML = parentCate.unfinishedNum;
			}
		}
		var oAll = document.getElementById('all').getElementsByClassName('task-num')[0];
		var allCate = data.getItem('all');
		oAll.innerHTML = allCate.unfinishedNum;
	},
	//更新任务细节部分
	updateTaskListPanel: function(taskId, cateId, finishD, title) {

		if (!taskId || !cateId) {
			return;
		}

		var cate = data.getItem(cateId);
		var tasks = cate.tasks;
		var oTasks = method.sortByDate(data.getCurCateObjTaskArray(cateId));
		var finishDates = [];
		var finishDate = parseInt(finishD.split('-').join(''));
		var i, n;
		var arr = [],
			html = '';

		var position;
		var nextNode; //当前需插入的位置的下一节点
		var nextNodeDate;
		var dd;

		var taskList = $('.taskList')[0];
		var ul = document.createElement('ul');
		ul.className = 'taskItem';
		arr.push('<h5 class="taskTime">');
		arr.push(finishD);
		arr.push('</h5>');
		arr.push('<dl>');
		arr.push('<dd  class="current" id =' + taskId + '><strong>');
		arr.push(title);
		arr.push('</strong>');
		arr.push('<i class="icon-remove removeTask"></i>');
		arr.push('</dd></dl>');
		html = arr.join('');
		ul.innerHTML = html;

		//当前面板为空，直接插入
		if (tasks.length == 0) {
			taskList.appendChild(ul);
		} else {
			//得到finishDate的数值表示数组
			for (i = 0, n = oTasks.length; i < n; i++) {
				finishDates.push(parseInt(oTasks[i].finishDate.split('-').join('')));
			}
			position = method.getPosition(finishDates, finishDate);
			nextNode = position != -1 ? document.getElementById(oTasks[position].id) : document.getElementById(oTasks[0].id);
			nextNodeDate = oTasks[position] ? oTasks[position].finishDate : oTasks[0].finishDate;

			//插入位置的下一个节点完成时间与待插入节点时间不同，新建一个时间标题
			if (nextNodeDate != finishD) {
				nextNode = nextNode.parentNode.parentNode;
				taskList.insertBefore(ul, nextNode);
			}
			//直接插入任务标题
			else {
				arr = [];
				dd = document.createElement('dd');
				dd.className = 'current';
				dd.setAttribute('id', taskId);
				arr.push('<strong>');
				arr.push(title);
				arr.push('</strong>');
				arr.push('<i class="icon-remove removeTask"></i>');
				html = arr.join('');
				dd.innerHTML = html;
				nextNode.parentNode.insertBefore(dd, nextNode);
			}
		}
	},
	//任务列表按日期升序进行聚类
	sortByDate: function(arr) {

		if (!arr) {
			return;
		}

		arr.sort(function(task1, task2) {
			var d1 = parseInt(task1.finishDate.split('-').join(''));
			var d2 = parseInt(task2.finishDate.split('-').join(''));
			return d2 - d1;
		});

		return arr;
	},
	//验证输入类别或任务名是否已存在   返回是否终止添加
	isExistedTitle: function(val, isCate) {
		var i, n;
		var isParse = false;

		var oPop = $('#popover');
		var confirm = oPop.getElementsByClassName('confirm')[0];

		if (isCate) {
			if (!val) {
				method.popTip('提示', '类别名不可为空');
				method.showPopover();
				isParse = true;
			} else {
				var cates = data.getCateArray();
				for (i = 0, n = cates.length; i < n; i++) {
					if (cates[i].title == val) {
						method.popTip('提示', '已存在此分类');
						method.showPopover();
						isParse = true;
					}
				}
			}
		} else {
			if (!val) {
				method.popTip('提示', '任务名不可为空');
				method.showPopover();
				isParse = true;
			} else {
				var tasks = data.getTaskArray();
				for (i = 0, n = tasks.length; i < n; i++) {
					if (tasks[i].title == val) {
						method.popTip('提示', '已存在此任务');
						method.showPopover();
						isParse = true;
					}
				}
			}
		}
		confirm.onclick = function() {
			method.hidePopover();
		};

		return isParse;
	},
	//更改所有未完成已完成的cur属性
	changeCur: function(dom) {
		var cateList = $('.cateList')[0];
		var as = cateList.getElementsByTagName('a');
		var i, n;
		for (i = 0, n = as.length; i < n; i++) {
			as[i].className = '';
		}
		dom.className = 'cur';
	},
	setTaskListPanel: function(oTask) {

		var taskList = $('.taskList')[0];

		if (!oTask.length) {
			taskList.innerHTML = '';
			return;
		}

		var tasks = method.sortByDate(oTask);
		var i, n;
		var html = '',
			arr = [],
			ddCls = '';
		taskList.innerHTML = '';


		if (!taskList.getElementsByTagName('ul').length) {
			taskList.appendChild(createUl(tasks[0]));
		}
		if (tasks.length > 1) {
			for (i = 1, n = tasks.length; i < n; i++) {
				if (tasks[i].finishDate == tasks[i - 1].finishDate) {
					document.getElementById(tasks[i - 1].id).parentNode.appendChild(createDd(tasks[i]))
				} else {
					taskList.appendChild(createUl(tasks[i]));
				}
			}
		}

		function createUl(oT) {
			var Ul = document.createElement('ul');
			ddCls = oT.isFinished ? 'finished' : '';
			Ul.className = 'taskItem';
			arr = [];
			arr.push('<h5 class="taskTime">');
			arr.push(oT.finishDate);
			arr.push('</h5><dl><dd class="current ' + ddCls + '" id = "');
			arr.push(oT.id);
			arr.push('"><strong>');
			arr.push(oT.title);
			arr.push('</strong>');
			arr.push('<i class="icon-remove removeTask"></i>');
			arr.push('</dd></dl></ul>');
			html = arr.join('');
			Ul.innerHTML = html;
			return Ul;
		}

		function createDd(oT) {
			var Dd = document.createElement('dd');
			ddCls = oT.isFinished ? 'finished' : '';
			Dd.className = ddCls;
			Dd.setAttribute('id', oT.id);
			arr = [];
			arr.push('<strong>');
			arr.push(oT.title);
			arr.push('</strong>');
			arr.push('<i class=" icon-remove removeTask"></i>');
			html = arr.join('');
			Dd.innerHTML = html;
			return Dd;
		}
	},
	//任务编辑框
	setEditPanel: function(title, finishDate, content) {
		var arr = [];
		var html = '';
		var RightPanel = $('.detailRight')[0];

		title = title || '';
		finishDate = finishDate || method.getCurrentDate();
		content = content || '';

		arr.push('<div class="detailTitle">');
		arr.push('请输入任务标题：<input type="text" placeholder="标题字数在2到15之间" value="' + title + '"><em class="editTip"></em>');
		arr.push('</div>');
		arr.push('<div class="finishDate">');
		arr.push('请输入完成日期：<input type="text" placeholder="日期格式为YYYY-MM-DD" value="' + finishDate + '"></inpt><em class="editTip"></em>');
		arr.push('</div>');
		arr.push('<div class="detailContent">');
		arr.push('请输入任务内容：<em class="editTip"></em><textarea>' + content + '</textarea>');
		arr.push('</div>');
		arr.push('<div class="btn-group">');
		arr.push('<button class="confirm"><i class="icon-plus"></i>确认</button>');
		arr.push('<button class="cancel"><i class="icon-remove"></i>取消</button>');
		arr.push('</div>');
		html = arr.join('');
		RightPanel.innerHTML = html;
	},
	//任务细节
	setDetailPanel: function(taskId) {

		var RightPanel = $('.detailRight')[0];

		if (!taskId) {
			RightPanel.innerHTML = '';
			return;
		}

		var currentTask = data.getItem(taskId);
		var arr = [];
		var html = '';


		arr.push('<div class="detailTitle">');
		arr.push('<span>' + currentTask.title + '</span>');
		arr.push('<div class="editIcon">');
		arr.push('<i class="icon-check icon-2x"></i><i class="icon-edit icon-2x"></i>');
		arr.push('</div>');
		arr.push('</div>');
		arr.push('<div class="finishDate">');
		arr.push('完成日期：<span>' + currentTask.finishDate + '</span>');
		arr.push('</div>');
		arr.push('<div class="detailContent">');
		arr.push(currentTask.content);
		arr.push('</div>');

		html = arr.join('');
		RightPanel.innerHTML = html;
	},
	//验证标题输入格式====字数在2到10个字符
	isRightTitle: function(title) {
		title = title + '';
		return title.length < 10 && title.length > 2;
	},
	//验证日期输入格式====符合基本日期规范 并且在当前日期之后
	isRightDate: function(date) {
		date = '' + date;
		var reg = /^\d{4}\-\d{2}\-\d{2}$/;
		if (!reg.test(date)) {
			return false;
		}

		var da = date.split('-');
		var y = parseInt(da[0]);
		var m = parseInt(da[1]);
		var d = parseInt(da[2]);
		var now = new Date();
		var nowDate = parseInt(now.getFullYear() + '' + addZero(now.getMonth() + 1) + '' + addZero(now.getDate()));
		var writeDate = parseInt(y + '' + addZero(m) + '' + addZero(d));

		function addZero(d) {
			d = parseInt(d);
			return d < 10 ? '0' + d : d;
		}

		return m <= 12 && d <= 31 && writeDate >= nowDate;

	},
	//返回编辑内容长度
	getContentLength: function(content) {
		if (!content) {
			return 0;
		}
		return content.length;
	},
	//获得当前日期
	getCurrentDate: function() {
		var now = new Date();
		var date = now.getFullYear() + '-' + addZero(now.getMonth() + 1) + '-' + addZero(now.getDate());

		function addZero(d) {
			d = parseInt(d);
			return d < 10 ? '0' + d : d;
		}
		return date;
	},
	//查找指定的元素在数组中的位置
	indexOf: function(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == val) {
				return i;
			}
		}
		return -1;
	},
	//在已从大到小排列好的元素找第一个比之小的元素
	getPosition: function(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] <= val) {
				return i;
			}
		}
		return -1;
	}
};
/*
window.onresize = function(){
    method.showPopover();
};*/