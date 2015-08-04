/**
 * Created by Administrator on 2015/7/13.
 */

window.onload = function() {
    init();
    handleActiveClick();
    handleMove();
    handleChoiceClick();
    handleSubmit();
};

var arti = {
    content: 'It\'s the first question parents ask when their child is diagnosed with autism (自闭症). Will his future brothers or sisters have a higher risk of 1 <span class="" data-num="1">_____ </span> it, too? According to the largest study of siblings (兄弟姐妹) in families with autism, the answer is yes. Among 664 children who had at least one older sibling with the developmental disorder, the 2 <span class="" data-num="2">_____ </span>risk of autism was nearly 19%,  3 <span class="" data-num="3">_____ </span> higher than previous sibling-recurrence estimates that were anywhere from 3% to 10%. Kids with more than one older autistic sibling had an even higher risk of the disorder: 32%. '
              + 'The 4<span class="" data-num="4">_____ </span> suggest that genes play a key role in autism risk. But they also hint that other environmental factors 5 <span class="" data-num="5">_____ </span> by siblings, like influences in the womb (子宫), may be important as well. '
              + 'On the 6<span class="" data-num="6">_____ </span> of the findings, the researchers recommend that doctors closely 7 <span class="" data-num="7">_____ </span> younger siblings of autistic children to pick up any early signs of the disorder, 8 <span class="" data-num="8">_____ </span> an unusually large head or delayed language development and communication skills. Evidence suggests that early 9 <span class="" data-num="9">_____ </span> and diagnosis of autism can help children take advantage of therapies that can treat some of its 10  <span class="" data-num="10">_____ </span>',
    options: ['common','results','consequently','basis','detection','monitor','symbols','average','dramatically','symptoms','reason','distributed','including','developing','shared'],
    answers: ['developing', 'average', 'dramatically', 'results', 'shared', 'basis', 'monitor', 'including', 'detection', 'symptoms' ],
    analysis: ['第1题的文字解析', '第2题的文字解析' ,'第3题的文字解析' ,'第4题的文字解析', '第5题的文字解析', '第6题的文字解析', '第7题的文字解析' ,'第8题的文字解析','第9题的文字解析','第10题的文字解析']
};


function init() {
    var article = document.getElementById('article');
    var i, j, rows, len;
    //文章
    article.innerHTML = arti.content;
    //导航栏
    var nav = document.getElementById('qus_num');
    var trN = document.createElement('tr');
    for(i = 0, len = arti.answers.length; i < len; i++) {
        var tdN = document.createElement('td');
        tdN.innerHTML = (i + 1) + '';
        tdN.setAttribute('data-num',(i+1) + '');
        trN.appendChild(tdN);
    }
    nav.appendChild(trN);

    //选项
    for(i = 0,rows = Math.ceil(arti.options.length/3); i < rows; i++) {
        var answers = document.getElementById('answers');
        var tr = document.createElement('tr');
        for(j = 0; j < 3; j++) {
            var td = document.createElement('td');
            td.innerHTML = arti.options[i*3+j];
            tr.appendChild(td);
        }
        answers.appendChild(tr);
    }
}

function handleActiveClick() {
    var article = document.getElementById('article');
    var navNum = document.getElementById('qus_num');
    addEvent(article, 'click', function(e) {
        e = e || window.event;
        var el = e.target || e.srcElement;
        if(el.nodeName.toLowerCase() === 'span') {
            var num = el.getAttribute('data-num');
            updateActive(num);
            updatePointed(num);
            scrollToActive(num);
        }
    });
    addEvent(navNum, 'click', function(e) {
        e = e || window.event;
        var el = e.target || e.srcElement;
        if(el.nodeName.toLowerCase() === 'td') {
            var num = el.getAttribute('data-num');
            updateActive(num);
            updatePointed(num);
            scrollToActive(num);
        }
    });
}
function scrollToActive(num){
    var activeDom = findDomByNum(num)[0];
    console.log(activeDom.offsetTop);
    var offsetTop = activeDom.offsetTop;
    if(offsetTop > 250) {
        console.log(activeDom);
        console.log(activeDom.scrollTop);
    }

}

/**
 * 根据序号找到对应的元素  空白格[0]以及导航栏[1]
 * @param num
 */
function findDomByNum(num) {
    var res = [];
    var article = document.getElementById('article');
    var spans = article.getElementsByTagName('span');
    var tds = document.getElementById('qus_num').rows[0].cells;
    var i, len;
    for(i = 0, len = spans.length; i < len; i++) {
        if(spans[i].getAttribute('data-num') === num) {
            res.push(spans[i]);
        }
    }

    for(i = 0, len = tds.length; i < len; i++) {
        if(tds[i].getAttribute('data-num') === num) {
            res.push(tds[i]);
        }
    }

    return res;
}

/**
 * 激活蓝色padding
 * @param num 空白处span
 */
function updateActive(num) {
    var activeDom = findDomByNum(num)[0];
    var article = document.getElementById('article');
    if(activeDom && activeDom.className.indexOf('blue-back') > -1) {
        return;
    }

    var spans = article.getElementsByTagName('span');
    var i, len;
    for( i = 0, len = spans.length; i < len; i++) {
        removeClass(spans[i], 'blue-back');
    }
    addClass(activeDom, 'blue-back');
}

/**
 * 激活中间导航栏的对应序号，加小三角形
 * @param num  对应序号
 */
function updatePointed(num) {

    var pointedNumDom = findDomByNum(num)[1];

    if(pointedNumDom && pointedNumDom.getElementsByTagName('span').length) {
        return;
    }

    var pointedArtDom = document.createElement('span');
    var tds = document.getElementById('qus_num').rows[0].cells;
    var i, len;
    for(i = 0, len = tds.length; i < len; i++) {
        if(tds[i].getElementsByClassName('pointed').length) {
            tds[i].removeChild(tds[i].getElementsByClassName('pointed')[0]);
        }
    }

    pointedArtDom.className = 'pointed';
    pointedNumDom.appendChild(pointedArtDom);
}
/**
 * 获取激活状态的空格
 */
function getActiveBlank() {
    var article = document.getElementById('article');
    var spans = article.getElementsByTagName('span');
    var i, len;

    var res = null;
    for(i = 0, len = spans.length; i < len; i++) {
        if(spans[i].className.indexOf('blue-back') > -1 ) {
            res =  spans[i];
        }
    }
    return res;
}
function handleMove() {
    var answers = document.getElementById('answers');
    addEvent(answers, 'mousemove', function(e) {
        e = e || window.event;
        var el = e.srcElement || e.target;
        if(el.nodeName.toLowerCase() === 'td') {
            var blankDom = getActiveBlank();
            if(blankDom) {
                blankDom.innerHTML = ' ' + el.innerHTML + ' ';
            }
        }
    });
}
function handleChoiceClick() {
    var answers = document.getElementById('answers');
    addEvent(answers, 'click', function(e) {
        e = e || window.event;
        var el = e.srcElement || e.target;
        if(el.nodeName.toLowerCase() === 'td') {
            var blankDom = getActiveBlank();
            if(blankDom) {
                blankDom.innerHTML = el.innerText;
                removeClass(blankDom, 'blue-back');
                addClass(blankDom, 'blue-font');
                var num = blankDom.getAttribute('data-num');
                var navNum = findDomByNum(num)[1];
                addClass(navNum, 'blue');
                addClass(el,'line-though');
            }
        }
    });
}

function handleSubmit() {
    var submit = document.getElementById('submit');
    var mask = document.getElementById('mask');
    var report = document.getElementById('report');
    addEvent(submit,'click',listener);
    function listener() {
        createTable();
        addClass(mask, 'mask');
        removeClass(report, 'hide');

        checkAnswers();
        removeEvent(submit, 'click', listener);
    }
}

function getCorrectArray() {
    var article = document.getElementById('article');
    var spans = article.getElementsByTagName('span');
    var correctRate = document.getElementById('correct_rate');
    var i, len;
    var myAnswers = [], tableArray = [];
    var correctNum = 0;
    for(i = 0, len = spans.length; i < len; i++) {
        if(spans[i].innerText.indexOf('__') > -1) {
            myAnswers.push('');
        }
        else{
            myAnswers.push(trim(spans[i].innerText));
        }
    }
    var correctAnswers = arti.answers;
    for(i = 0, len = myAnswers.length; i < len; i++) {
        if(myAnswers[i] === correctAnswers[i]) {
            tableArray.push(true);
            correctNum ++;
        }
        else {
            tableArray.push(false);
        }
    }
    //更新正确率
    correctRate.innerText = parseInt(((correctNum/correctAnswers.length) * 100)) + '%';
    return tableArray;
}
function createTable() {
    var tableArray = getCorrectArray();
    var i, j, rows;
    var table = document.getElementById('check_table');
    //创建表格
    for(i = 0, rows = Math.ceil(tableArray.length/5); i < rows; i++) {
        var tr = document.createElement('tr');
        for(j = 0; j < 5; j++) {
            var td = document.createElement('td');
            td.innerHTML = (i*5 + j + 1) + '';
            if(tableArray[i*5+j]){
                addClass(td,'green-font');
            }
            else{
                addClass(td,'red-font');
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function hideMask() {
    var mask = document.getElementById('mask');
    var report = document.getElementById('report');
    var answers = document.getElementById('answers');
    removeClass(mask, 'mask');
    addClass(report, 'hide');
    addClass(answers, 'hide');
}

function updateNav() {
    var correctArray = getCorrectArray();
    var nav = document.getElementById('qus_num');
    var tds = nav.rows[0].cells;
    var i, len;
    for(i = 0, len = tds.length; i < len; i++) {
        removeClass(tds[i],'blue');
        if(correctArray[i]) {
            addClass(tds[i],'green');
        }
        else {
            addClass(tds[i],'red');
        }
    }
}
function checkAnswers() {
    var checkButton = document.getElementById('check_answer');
    addEvent(checkButton, 'click', function() {

        hideMask();
        updateNav();
        handleAnalysis();

        var i, len;
        var correctArray = getCorrectArray();
        var spans = document.getElementById('article').getElementsByTagName('span');
        var article = document.getElementById('article');
        for(i = 0, len = correctArray.length; i < len; i++) {
            if(correctArray[i]) {
                addClass(spans[i],'green-font');
            }
            else{
                var html = '<strong class="red-back line-though">' + spans[i].innerText + '</strong>' + '<strong class="green-back">'+ arti.answers[i] +'</strong>';
                var span = document.createElement('span');
                span.innerHTML = html;
                article.replaceChild(span, spans[i]);
            }
        }
    } );

}
function handleAnalysis() {
    var nav = document.getElementById('qus_num');
    var analysis = document.getElementById('analysis');
    console.log(analysis);

    addEvent(nav, 'click', function(e) {
        e = e || window.event;
        var el = e.target || e.srcElement;
        if(el.nodeName.toLowerCase() === 'td') {
            var num = el.getAttribute('data-num');
            analysis.innerHTML = arti.analysis[num-1];
            console.log(arti.analysis[num-1]);
        }
    });
}