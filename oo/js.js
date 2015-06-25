/**
 * Created by Administrator on 2015/5/22.
 */
var person={};
Object.defineProperty(person,'name',{writable:false,configurable:false,enumerable:true,value:'Mr Hundred'});
Object.defineProperty(person,'type',{writable:false,configurable:false,enumerable:false,value:'Object'});
console.log(Object.keys(person));


var toString=Object.prototype.toString;
function getType(o){
    return toString.call(o).slice(8,-1);
}
toString.call(null);
getType(null);

//extensible 对象是否可扩展
var obj={x:1,y:2};
Object.isExtensible(obj);//true
Object.preventExtensions(obj);//阻止对象扩展
Object.isExtensible(obj);//false
obj.z=1;
console.log(obj.z);//undefined;
Object.getOwnPropertyDescriptor(obj,'x');//Object {value: 1, writable: true, enumerable: true, configurable: true}
//Object.seal(obj)  configurable:false
Object.seal(obj);
Object.getOwnPropertyDescriptor(obj,'x');//Object {value: 1, writable: true, enumerable: true, configurable: false}
Object.isSealed(obj);//true;
//Object.freeze(obj)  configurable:false,writable:false;
Object.freeze(obj);
Object.getOwnPropertyDescriptor(obj,'x');//Object {value: 1, writable: false, enumerable: true, configurable: false}
Object.isFrozen(obj);//true;
               //seal().freeze(),只影响对象并不会影响到原型链

//提交数据给后台  序列化对象  JSON.stringify()
var obj1={x:1,y:true,z:[1,2,3],nullVar:null};
JSON.stringify(obj1);  //"{"x":1,"y":true,"z":[1,2,3],"nullVar":null}"
var obj2={val:undefined,a:NaN,b:Infinity,c:new Date()};
JSON.stringify(obj2);  //"{"a":null,"b":null,"c":"2015-05-22T14:24:51.467Z"}"
                      //如果对象中有undefined序列化以后不会出现在字符串中  如果值为NaN或Infinity会直接转换为null
//处理后台返回的数据  JSON.parse()
var obj3 = JSON.parse('{"x":1}');
//定制序列化过程
var obj4={
    x:1,
    y:2,
    o:{
        o1:1,
        o2:2,
        toJSON:function(){
            return this.o1+this.o2;
        }
    }
};
JSON.stringify(obj4);//"{"x":1,"y":2,"o":3}"

//toString()和valueOf()
var obj5={x:1,y:2};
obj5.toString();//"[object Object]"
obj5.toString=function(){
    return this.x+this.y;
};
console.log(+obj5);//3
console.log("Result"+obj);//"Result3"
//valueOf()尝试转换为基本类型
obj5.valueOf=function(){
    return this.x+this.y+100;
};
console.log(+obj5);//103
console.log("Result"+obj5);//"Result103"
                                //有toString()和valueOf()时不管是数据+还是字符串+都会尝试把对象转换为基本类型，也就是说使用valueOf()方法
                                //一般都不会我们自己去调用，一般是系统自动调用
//数组
var arr1=[1,true,null,undefined,{x:1},[1,1,1]];//[1, true, null, undefined,Object,Array[3]]
arr1.length-=1;                                  //[1, true, null, undefined,Object
                                                    //length属性是可写的
var student=[{name:'Bosn',age:27},{name:'Nunnly',age:3}];
console.log(student);                                //
                                                        //var arr = new Array();new可以省略
var arr2=[1,2,3,4,5];
delete arr2[0];
console.log(arr2[0]);// undefined
console.log(arr2.length);//5
                                   //delete操作符只能将元素置为undefined，不改变数组长度
var arr3=[];
arr3[0]=1;
arr3[1]=2;
arr3.push(3);
arr3[arr3.length]=4;//equal to push
console.log(arr3); //[1, 2, 3, 4]
arr3.unshift(0);  //[0，1, 2, 3, 4]
                    //在数组开始位置插入
delete arr3[1];  //true,  length:5    [0，undefined, 2, 3, 4]
console.log(1 in arr3);  //false;
arr3.length-=1;
console.log(arr3);// [0，undefined, 2, 3]
arr3.pop();
console.log(arr3);//[0，undefined, 2]
arr3.shift();
                    //弹出数组第一个元素  var a=arr3.shift();a:0==>被弹出的元素
console.log(arr3);//[undefined, 2]

var arr4=[1,2,3,4,5];
var i=0,n=10;for(;i<n;i++){
    console.log(arr4[i]);
}//1 2 3 4 5 {5{ undefined}}
for(i in arr4){
    console.log(arr4[i]);
}
Array.prototype.x='inherited';
for(i in arr4){
    console.log(arr4[i]);
} //1 2 3 4 5 inherited
  //原型链上数据也会被枚举出来
//过滤原型链上的元素
for(i in arr4){
    if(arr4.hasOwnProperty(i)){
        console.log((arr4[i]));
    }
}
var arr5=[undefined];
var arr6=new Array(1);
console.log(0 in arr5);//true;
console.log(0 in arr6);//false;
arr5.length=100;
arr5[99]=123;
console.log(99 in arr5);//true;
console.log(98 in arr5);//false;
var arr7=[,,];
console.log(0 in arr7);//false;
var arr8=[1,2,3];
arr8.join();//"1,2,3"
arr8.join('_');//"1_2_3"
function repeatString(str,n){
    return new Array(n+1).join(str);
}
repeatString("a",3);//aaa
arr8.reverse();  //[3, 2, 1]
                    //倒置数组  ==>会对原数组进行修改
var arr9=['a','d','b','c'];
arr9.sort(); //["a", "b", "c", "d"]
var arr10=[13,24,51,3];
arr10.sort();//[13, 24, 3, 51]
arr10.sort(function(a,b){
    return a-b;
});//[3, 13, 24, 51]
arr11=[{age:25},{age:39},{age:99}];
arr11.sort(function(a,b){
    return a.age-b.age;
});
arr11.forEach(function(item){
    console.log('age',item.age);
});//age 25  age 39  age 99
var arr12=[1,2,3];
arr12.concat(4,5);//[1, 2, 3, 4, 5]
console.log(arr12);//[1, 2, 3]
                    //concat()原数组不被修改
arr12.concat([10,11],13);//[1, 2, 3, 10, 11, 13]
                            //加入的数组会被拉平
//slice()切割数组元素  不修改数字元素  [ ）左闭右开
var arr13=[1,2,3,4,5];
arr13.slice(1,3);//[2, 3]
console.log(arr13);//[1, 2, 3, 4, 5]
arr13.slice(1,-1);//[2, 3, 4]
                    //负数表示从数组末端倒数。-1表示最后一个元素

////splice()强大的功能，能添加数组元素也能删除数组元素，并且能直接修改数组元素
arr13.splice(2);//[3, 4, 5]
                //一个参数表示从参数位置删除其后元素，并返回删除元素
console.log(arr13);//[1,2];
var arr14=[1,2,3,4,5];
arr14.splice(1,2);  //[2, 3]
console.log(arr14);//[1, 4, 5]
var arr15=[1,2,3,4,5];arr15.splice(1,1,'1','2');//[2]
                                                    //splice(start,num,a,b，…)从start位置删除num 个元素，并在在删除位置补入a,b等等，返回并删除元素
console.log(arr15);//[1, "1", "2", 3, 4, 5]
arr15.splice(1,0,'0');//[]
                        //第二个参数为0表示在第一个参数后面插入‘0’
console.log(arr15); //[1, "0", "1", "2", 3, 4, 5]
var arr16=[1,2,3,4,5];
//forEach()循环遍历数组
arr16.forEach(
    function(x,index,a){
        console.log(x+'---'+index+'---'+(a===arr16));
    });//1---0---true :22---1---true :23---2---true :24---3---true :25---4--true

//map()数组映射  不改变原数组
arr16.map(
    function(x){
        return x+10;
    });//[11, 12, 13, 14, 15]
console.log(arr16);//[1, 2, 3, 4, 5]

//filter()数组过滤  不改变原数组
arr16.filter(
    function(x,index){
        return x%3===0||index>=4;
    });//[3, 5]
console.log(arr16);//[1, 2, 3, 4, 5]

//数组判断  some() every() 返回"boolean"值
arr16.every(
    function(x){
        return x<3;
    });//false
arr16.some(
    function(x){
        return x>3;
    });//true

//reduce()讲数组前后两个相邻元素进行操作  reduceRight()从右边开始操作
var sum=arr16.reduce(
    function(x,y){
        return x+y;
    });//15
arr16.reduce(
    function(x,y){
        return x+y;
    },0);   //带有参数0，表示x的值，如果不传第二个参数表示x从第一个元素开始
arr16.reduce(
    function(x,y){
        return x+y;
    },3);//18
console.log(sum);//15
var max=arr16.reduceRight(
    function(x,y){
        return x>y?x:y;
    });//5

//判断是否为数组的几个方法
Array.isArray(arr16);//true;
console.log(arr16 instanceof Array);
console.log(({}).toString.apply(arr16)==='[object Array]');
console.log(arr16.constructor===Array);

//数组是对象 其他对象
var str='Hello World!';str.charAt(0);//"H"
console.log(str[0]);//"H"
Array.prototype.join.call(str,'_');//"H_e_l_l_o_ _W_o_r_l_d_!"
//数组 字符串（可以理解为字符串是不可改写的数组）


//函数
//函数表达式  函数声明
add(1,3);//4合法

function add(a,b){
    a=+a;b=+b;
    if(isNaN(a) || isNaN(b)){
        return;}return a+b;
}

addd(1,3);//报错

var addd = function (a,b){
    a=+a;b=+b;
    if(isNaN(a) || isNaN(b)){
        return;}return a+b;
};
//匿名函数
var func = function nfe(){};
console.log(func===nfe);  //报错  ReferenceError: nfe is not defined     IE会返回false

//  匿名函数可以进行递归调用
//var func = function nfe(){  /* do something */ nfe();};
//函数构造器
var func1=new Function('a','b','console.log(a+b);');
func1(2,3);//5;

Function('var localVal = "local";console.log(localVal);')();//local
console.log(typeof localVal);//undefined
                                //Function构造器内部变量外部不可访问
var globalVal='global';
(
    function(){
        var localVal='local';
        Function('console.log(typeof localVal,typeof globalVale)();')
    })();//undefined string
        //function内部变量不可访问，全局变量可访问

//this全局下指向window  全局严格模式下指向undefined

//this有时候不是看定义，而是调用时候的对象
//var o={prop:37,f:function(){return this.prop;}};console.log(o.f());37
var o={prop:37};
function independent() {
    return this.prop;
}
o.f=independent;
console.log(o.f());//37
var o2={
    f:function()
    {return this.a+this.b;
    }
};
var p=Object.create(o2);
p.a=1;
p.b=4;
console.log(p.f());//5
//argument
function foo(x,y,z){
    console.log(arguments.length); //2  arguments.length:实参个数
    arguments[0]=10;
    console.log(x);//10                严格模式下仍为1
    arguments.length-=1;
    console.log(arguments.length); //1
    console.log(arguments[2]);      //undefined
    arguments[2]=200;
    console.log(z);                 //undefined
    console.log(arguments.callee === true);    //true    //严格模式下报错

}
foo(1,2);
console.log(foo.length);//3              foo.length 形参个数

//call()  apply()   apply第二个参数为数组（原函数参数列表）
//函数预设的prototype属性一般为对象{}
function abc(){}
console.log(abc);//function abc(){}
console.log(typeof abc.prototype);//"object"

function Foo1(){
    this.y=2;
}
Foo1.prototype.x=1;
var obj6=new Foo1();
console.log(obj6.y);      //x是object6对象上的//y是Foo1 原型链上的
console.log(obj6.x);

//继承
function Person(name,age){
    this.name=name;this.age=age;
}
Person.prototype.hi=function(){
    console.log('Hi,my name is'+this.name+',I am'+this.age+'years old now.');
};
Person.prototype.LEGS_NUM=2;
Person.prototype.ARMS_NUM=2;
Person.prototype.walk=function(){
    console.log(this.name+'is walking!');
};
function Student(name,age,className){
    Person.call(this,name,age);
    this.className=className;
}
Student.prototype=Object.create(Person.prototype);
Student.prototype.constructor=Student;
Student.prototype.hi=function(){
    console.log('Hi,my name is'+this.name+'I am'+this.age+'years old now,and from'+this.className+'.');
};
Student.prototype.learn=function(subject){
    console.log(this.name+'is learning'+subject+'at'+this.className+'.');
};
var bosn=new Student('Bosn',27,'Class 3,Grade 2');
bosn.hi();
console.log(bosn.LEGS_NUM);
bosn.walk();
bosn.learn('math');

//链式调用
//链式调用
function classManager(){};
classManager.prototype.addClass=function(str){
    console.log('class:'+str+' added;');
    return this;//this 总是指向实例对象
};
var manager=new classManager();
manager.addClass('classA').addClass('classB').addClass('classC');
//class:classA added;    class:classB added;    class:classCa dded;

//实践====>探测器

(function(global){
    function DetectorBase(configs){
        throw new Error('Do not invoke without new.');
    }
    this.configs=configs;
    this.analyze();

DetectorBase.prototype.detect=function(){
    throw new Error('Not implemented.');
};
DetetorBase.prototype.analyze=function(){
    console.log('analyzing…');
    this.data='###data###';
};
function LinkDetector(links){
    if(!this instanceof LinkDetector){
        throw new Error('Do not invoke without new.');
    }
    this.links=links;
    DetectorBase.apply(this,arguments);
}
function ContainerDetector(containers){
    if(!this instanceof ContainerDetector){
    throw new Error('Do not invoke without new.');
    }
    this.containers=containers;
    DetectorBase.apply(this,arguments);
}
inherit(LinkDetector,DetectorBase);
inherit(ContainerDetector,DetectorBase);
LinkDetector.prototype.detect=function(){
    console.log('Loading data'+this.data);
    console.log('Link detection started.');
    console.log('Scanning links:'+this.links);
};
ContainerDetector.prototype.detect=function(){
    console.log('Loading data:'+this.data);
    console.log('Container detection started.');
    console.log('Scanning containers:'+this.containers);
};
Object.freeze(DetectorBase);
Object.freeze(DetectorBase.prototype);
Object.freeze(LinkDetector);
Object.freeze(LinkDetector.prototype);
Object.freeze(ContainerDetector);
Object.freeze(ContainerDetector.prototype);
Object.defineProperties(global,
    {
        LinkDetector:{value:LinkDetector},
        ContainerDetector:{value:ContainerDetector},
        DetectorBase:{value:DetectorBase}
    });
function inherit(subClass,superClass){
    subClass.prototype=Object.create(superClass.prototype);
    subClass.prototype.constructor=subClass;
}
})(this);
//test
var cd=new ContainerDetector('#abc #def #ghi');
var ld=new LinkDetector('http://www.imooc.com/video/7680/0');
cd.detect();
ld.detect();