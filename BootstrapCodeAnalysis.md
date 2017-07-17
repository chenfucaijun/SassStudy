# 从前端小白到分析前端框架(UI部分)
>聊一聊前端之————————————样式！
>我们很多人C++，php代码写的很好，但是，前端样式有时候真的写的惨不忍睹，为什么？
>原因绝对不是学习能力，编程能力。


* **css本身的局限性**
   * 代码**可阅读性不强**
   * **可维护性不强**
   * **逻辑很杂乱**

* 使用前端框架，**Bootstrap,AdminLTE**等开发周期虽然短了，但是缺点也很多
    *  **延续框架中的弊端**
    *  **限制开发思路**
    *  **臃肿的代码**



## 目标
> 本文会针对bootstrap源码中的button和grid部分进行源码分析（SASS编写的），讲解当中原理和思想。

* 使用媒体查询，了解**响应式网站**的开发过程
* 不再局限于纯css开发，**使用sass，less**等达到前端样式工程化，规模化
*  解读**前端框架中的部分技术原理**，剖析**bootstrap**的**栅格系统**源码 ，**按钮**源码



## css基本知识
> 在开始前，考虑到前端小白，还是有必要讲下css的最基础知识，倘若你是已经对css轻车熟路了，**可以略过这部分**


* 盒子模型
* ![标准盒子模型](http://p1.bpimg.com/576036/2804203f1eb259ea.png)


* ![IE盒子模型](http://p1.bpimg.com/576036/fca23445687e4151.png)


* 块元素和内联元素
	* 块元素如
	```
	<div> <p>、<ul>、<ol>、<h1>-<h5>
	```
	等，默认是独自占据一行的，可以为它去设置上下左右的margin,padding,width,height
	* 内联元素如
	```
	<a> <i> <img>
	```
		* 和其他元素都在一行上；
		* 高，行高及外边距和内边距不可改变；
		* 宽度就是它的文字或图片的宽度，不可改变
		* 内联元素只能容纳文本或者其他内联元素


* css相对布局
 * 相对定位是一个非常容易掌握的概念。如果对一个元素进行相对定位，它将出现在它所在的位置上。然后，可以通过设置垂直或水平位置，让这个元素“相对于”它的起点进行移动。
如果将 top 设置为 20px，那么框将在原位置顶部下面 20 像素的地方。如果 left 设置为 30 像素，那么会在元素左边创建 30 像素的空间，也就是将元素向右移动。


```
#box_relative {
  position: relative;
  left: 30px;
  top: 20px;
}
```
![x相对定位](http://p1.bpimg.com/576036/a72cbf24b2ac6c3c.png)


* css绝对定位
 * 使元素的位置与文档流无关，因此不占据空间。这一点与相对定位不同，相对定位实际上被看作普通流定位模型的一部分，因为元素的位置相对于它在普通流中的位置。


```
#box_relative {
  position: absolute;
  left: 30px;
  top: 20px;
}
```
![绝对定位](http://p1.bqimg.com/576036/58709db468977533.png)
      绝对定位的元素的位置相对于最近的已定位祖先元素，如果元素没有已定位的祖先元素，那么它的位置相对于最初的包含块。


* CSS 浮动
浮动的框可以向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。
由于浮动框不在文档的普通流中，所以文档的普通流中的块框表现得就像浮动框不存在一样。

![float1](http://p1.bqimg.com/576036/f3546150b862206a.png)


![float2](http://p1.bqimg.com/576036/c946159d952c9722.png)


![float3](http://p1.bqimg.com/576036/5c42d069bedca0e4.png)


* 浮动出现的问题(盒子坍塌)
```
<div class="outer">
    <div class="div1">1</div>
    <div class="div2">2</div>
    <div class="div3">3</div>
</div>
.outer{border: 1px solid #ccc;background: #fc9;color: #fff; margin: 50px auto;padding: 50px;}
.div1{width: 80px;height: 80px;background: red;float: left;}
.div2{width: 80px;height: 80px;background: blue;float: left;}
.div3{width: 80px;height: 80px;background: sienna;float: left;}
```
![盒子坍塌](http://p1.bqimg.com/576036/6363547e4e9b085c.png)
* 可以看出来这个父元素div没有被浮动元素撑起来


* 清除浮动
<pre>
.outer:before, .outer:after {
                     content: " ";
                     display: table;
                 }
                 .outer:after {
                     clear: both;
                 }
</pre>
* 目前比较常用的解决方法是在为父元素设置伪元素属性
![clearxfix](http://i1.piimg.com/576036/111620e2023cec3b.png)


* css选择器
   * 标签选择器
   ```
   p{},div{}
   ```

   * id选择器
    ```
    #header {}
    ```
   * 类选择器
	 ```
	  .header.dark{} //同时包含class header和 class dark

	  ```
   ```
   .header .dark{}  //header类的子类dark类
   ```
   * 伪类选择器和伪元素选择器
	   ```
	   a:hover   a:active a:before a:after
	   ```


* 媒体查询（css3中的属性）
 * 根据不同的媒体使用不同的css样式
```
@media mediatype and|not|only (media feature) {
    CSS-Code;
}
```

 * 举例：
```
@media only screen and (min-width: 400px) and (max-width: 1024px){
body{background:#000;}
}
```
这里的媒体类型有 `print`,`screen`,`speech`，`all`四种，这里的逻辑操作符and



-------

## SASS
>**啥是SASS?**
> **SASS**：Syntactically Awesome Style Sheets，语法极好的一种样式表。
> Sass 是一个 CSS 的扩展，它在 CSS 语法的基础上，允许您**使用变量 (variables), 嵌套规则 (nested rules), 混合 (mixins), 导入 (inline imports) 等功能**，令 CSS 更加强大与优雅。使用 Sass 以及 [Compass](http://www.ruanyifeng.com/blog/2012/11/compass.html)样式库有助于更好地组织管理样式文件，以及更高效地开发项目。
>  其实就是sass的一个语法改进过的一个版本。



## 安装SASS环境
* [Sass官网](http://sass-lang.com/install)
* Linux环境下首先安装ruby,然后通过包管理器安装`sass`
	```
	sudo su -c "gem install sass"
	```
* Windows环境下安装sass官网的[ruby集成环境](http://rubyinstaller.org/),即可使用ruby库，当中已经包含了sass
* Mac环境下预安装了ruby环境，使用gem安装sass,
	```
	gem install sass
	```



## SASS基本命令
* 执行sass命令，预处理scss文件，生成css文件
	```
	sass --watch input.scss:output.css //	预处理input.scss生成output.css文件

	```

* 监听app/sass路径下的所有sass文件，一旦有变动就生成css文件到public/stylesheets路径中
```
sass --watch app/sass:public/stylesheets
```

	* 如果scss文件的命名方式为`_input.scss`（下划线开头），那么该路径下的`_input.scss`（下划线开头）文件不会被预处理为CSS文件，这样的目的是啥呢？埋个伏笔，后面再讲。



## SCSS基本语法
*  **变量$**

```
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

```


*  **MIXIN**
	* MIXIN字面意思`混合 杂糅`等，深层的话是一种编程思想（利用语言特性来更简洁的地实现**组合模式**,追溯MIXIN根源的话是为了解决多重继承(一个子类继承多个父类)中出现的问题....
	* SCSS中的Mixin有点像C代码中的**函数**，是可以重用的代码块。


<pre>
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }

//css代码
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px;
}

</pre>


*  嵌套规则：

```
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}

```


对应的css代码
```
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;
}

nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```


*  引用父选择符： &

```
.header{
	&:hover{
		color:red;
	}
}

//css代码
.header:hover{
	color:red;
}
```


*  插值

```
#{} interpolation
```
为mixin传递参数，连接变量举个栗子

```
//css
.box-bor {
  border-width: 2px;
  border-style: dashed;
  border-color: green;
}
//可以看到共同前缀border-

来写个mixin封装下
@mixin set-one($side){
	//这样去写的话，是错误的，因为假如传的参数是带引号的"width"，border-$side:就变成了border-"width"
	border-$side:2px;
	//正确写法
	border-#{$side}:2px;

}
.box{
@include set-one(width);
@include set-one(dashed);
@include set-one("color");  //变量引号会被去掉
}

//css
.box {
  border-width: 2px;
  border-dashed: 2px;
  border-color: 2px;
}

```


*  `if、else、while、for`控制指令

```
@mixin calc-grid-column($index, $class, $type) {
  @if ($type == width) and ($index > 0) {
    .col-#{$class}-#{$index} {
      width: percentage(($index / $grid-columns));
    }
  }
}
```

```
@mixin make($i: 1, $list: ".col-xs-#{$i}, .col-sm-#{$i}, .col-md-#{$i}, .col-lg-#{$i}") {
  @for $i from (1 + 1) through 12 {
    $list: "#{$list}, .col-xs-#{$i}, .col-sm-#{$i}, .col-md-#{$i}, .col-lg-#{$i}";
  }
  .class{
    a:$list;
  }
  
  @include make();
  
  //css代码
  .class {
    a: ".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12";
  }

```


* 支持一些数学运算

```
floor(向下取整),ceil(向上取证)
```
* 颜色运算如
 
```
 lighten($backcolor,10%)，darken($backcolor,10%)
```


* 变量默认值：` !default`,就是该值为默认值，未设置的情况，使用默认值
```
    $backcolor:#ffffff !default;
	.header{
		//$backcolor:red;
		color:$backcolor;
	}
```			


* @import编译时会将@import的scss文件合并进来只生成一个CSS文件
 * 举个例子：
```
//a.scss
body {
  background: #eee;
}
```
```
@import "a";
```
那么就会生成对应的css文件
```
body {
  background: #eee;
}
```


* 现在大家想一想，如果`a.scss`和`b.scss`放在一个目录`scss/`里，执行
```
sass --watch scss/:css/
```
将会把`a.scss`和`b.scss`都生成一个css文件，在`css/`目录中会出现`a.css`和`b.css`文件，那么内容就会重复！实际上我们只需要生成`b.css`，它已经包含了`a.css`的内容了。

所以就引入了下划线`_`开头不被编译的方案，只有将`a.scss`改为`_a.scss`，那么`sass --watch `命令不会去编译`a.scss`生成重复的css文件



## bootstrap---按钮源码分析


* 首先使用**纯css**来生成一下button，对应的代码在 [button分析.html](https://github.com/chencaijun1992/SassStydy/blob/master/button%E5%88%86%E6%9E%90.html)中，在查看效果的时候要先注释掉button.scss生成的样式

```
    <!--<link rel="stylesheet" href="button/css/button.css">-->

```


* 一个primary样式的button

    <div class="btn btn-primary btn-lg">button lg</div>
    <style>
        .btn {
            display: inline-block;
            font-weight: normal;
            text-align: center;
            vertical-align: middle;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid transparent;
            padding: 6px 12px;

            /*考虑兼容性*/
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

        }

        .btn-primary {
            color: #fff;
            background-color: #337ab7;
            border-color: #2e6da4;
        }

        .btn-primary:hover {
            color: #fff;
            background-color: #286090;
            border-color: #204d74;

        }

        .btn-primary:active {
            color: #fff;
            background-color: #286090;
            border-color: #204d74;
            outline: 0;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
        }

        .btn-primary:active:hover {
            color: #fff;
            background-color: #204d74;
            border-color: #122b40;
        }

        </style>

```
对应的样式
 .btn {
            display: inline-block;    //设置内联块显示方式
            font-weight: normal;     //字体大小
            text-align: center;      //文本水平居中
            vertical-align: middle;   //文本垂直居中
            border-radius: 4px;       //设置圆角轮廓
            cursor: pointer;          //悬浮鼠标为指针
            border: 1px solid transparent;      //添加一个透明的边框
            padding: 6px 12px;                //控制内边距

            /*还未考虑兼容性*/
            //设置文本是否能把被选中
            user-select: none;

        }

        .btn-primary {
            color: #fff;
            background-color: #337ab7;
            border-color: #2e6da4;
        }
   
        .btn-primary:hover {           //鼠标悬浮的样式
            color: #fff;
            background-color: #286090;
            border-color: #204d74;

        }

        .btn-primary:active {         //鼠标点击的样式
            color: #fff;
            background-color: #286090;
            border-color: #204d74;
            outline: 0;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);  //向内阴影
        }

        .btn-primary:active:hover {    //鼠标点击后仍然悬浮
            color: #fff;
            background-color: #204d74;
            border-color: #122b40;
        }

```


* 下面来看bootstrap源码中的[button.scss](SassStydy/button/button.scss),它是使用scss来编写button的代码的

```
$btn-font-weight:                normal !default;
$btn-default-color:              #333 !default;

.btn {
  display: inline-block;
  font-weight: $btn-font-weight;    //$表示变量
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;

 <!-- @include button-size($padding-base-vertical, $padding-base-horizontal, $font-size-base, $line-height-base, $border-radius-base);
  @include user-select(none);   
  
  //button-size设置大小，包括内外边距,行高，边框，等
  //user-select考虑兼容性，去设置user-select属性
-->

	//&代表它的父元素，这里就是.btn
  &:hover,     
  &:focus
  {
    color: $btn-default-color;
    text-decoration: none;
  }

  &:active
  {
    @include box-shadow(inset 0 3px 5px rgba(0,0,0,.125));
  }

  &.disabled,      
  &[disabled],   //[]代表属性，如<div class='btn' disabled>或者<div class='btn' disabled="">
 
 //fieldset[disabled]指的是表单元素中含有disable属性也会使用该样式，如<form><div class='btn' disabled>  </form>
  fieldset[disabled] & {
    cursor: $cursor-disabled;
    pointer-events: none; // 阻止点击事件
    @include opacity(.65);
    @include box-shadow(none);
  }

}
```
* 可以看出使用上述代码使用了scss中的变量，嵌套，mixin等用法，大幅加快css开发效率。


* 为不同风格的按钮定义一个通用的方法button-variant

```

@mixin button-variant($color, $background, $border) {
  color: $color;
  background-color: $background;  
  border-color: $border;

  &:hover,
  &:focus{
    color: $color;
    background-color: darken($background, 10%);  //darken就是加深颜色 $background 10%
    border-color: darken($border, 12%);
  }

  &:active:hover{
    background-color: darken($background, 30%);
    border-color: darken($border, 20%);
  }

  &.disabled,
  &[disabled],
  fieldset[disabled] & {
    &,
    &:hover,
    &:focus,
    &.focus,
    &:active,
    &.active {
      background-color: $background;
      border-color: $border;
    }
  }
}

```


* 当生成一个primary的按钮的时候，仅仅需要调用button-varian，传递给它按钮的内容颜色，背景色，边框色

```
$btn-default-color:              #333 !default;
$btn-default-bg:                 #fff !default;
$btn-default-border:             #ccc !default;
.btn-default {
  @include button-variant($btn-default-color, $btn-default-bg, $btn-default-border);
}

```


* 同时还可以批量生成多种风格的按钮,加入自己需要的风格的按钮

```
.btn-primary {
  @include button-variant($btn-primary-color, $btn-primary-bg, $btn-primary-border);
}
.btn-success {
  @include button-variant($btn-success-color, $btn-success-bg, $btn-success-border);
}
.btn-info {
  @include button-variant($btn-info-color, $btn-info-bg, $btn-info-border);
}
.btn-warning {
  @include button-variant($btn-warning-color, $btn-warning-bg, $btn-warning-border);
}
.btn-danger {
  @include button-variant($btn-danger-color, $btn-danger-bg, $btn-danger-border);
}
//加入私人定制的按钮
$btn-mine-color:#ffffff;   //字体颜色
$btn-mine-bg:#1ABC9C;     //背景色
$btn-mine-border:    darken($btn-mine-bg, 5%) !default;  //边框色
.btn-mine {
  @include button-variant($btn-mine-color, $btn-mine-bg, $btn-mine-border);
}

```


* 下面运行下[button分析.html](https://github.com/chencaijun1992/SassStydy/blob/master/button%E5%88%86%E6%9E%90.html)
可以看到批量生成了所有的button，包括自己的button
![buttons](http://p1.bqimg.com/576036/26a5b8c7187767d9.png)



## BOOTSTRAP---栅格系统源码分析


* [简单的使用bootstrap的栅格系统](http://v3.bootcss.com/css/#grid)
	* “行（row）”必须包含在 .container （固定宽度）或 .container-fluid （100% 宽度）中，以便为其赋予合适的排列（aligment）和内补（padding）
	* 通过“行（row）”在水平方向创建一组“列“
	* 你的内容应当放置于“列（column）”内，并且，只有“列（column）”可以作为行（row）”的直接子元素。
类似 .row 和 .col-xs-4 这种预定义的类，可以用来快速创建栅格布局。Bootstrap 源码中定义的 mixin 也可以用来创建语义化的布局。


* 来看栅格系统例子
[grid分析.html](https://github.com/chencaijun1992/SassStydy/blob/master/grid%E5%88%86%E6%9E%90.html)

```
<!--格子系统-->
<div class="row">
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
    <div class="col-md-1">.col-md-1</div>
</div>
<div class="row">
    <div class="col-md-8">.col-md-8</div>
    <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
    <div class="col-md-4">.col-md-4</div>
    <div class="col-md-4">.col-md-4</div>
    <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
    <div class="col-md-6">.col-md-6</div>
    <div class="col-md-6">.col-md-6</div>
</div>

```


![栅格系统](http://i1.piimg.com/576036/f3c3728b4680bade.png)
* 可以看出一个row就是一行，每行高度按照内容自适应，宽度按照col-md- 后面的数字分配，占当前页面100%宽度则是col-md-12，占50%宽度则是col-md-6，按照比例划分宽度。


* 下面我们来看一看其对应的css代码其实很简单

```

//媒体查询，自适应多种屏幕宽度
@media (min-width: 1200px)
.container {
    width: 1170px;
}
@media (min-width: 992px)
.container {
    width: 970px;
}
@media (min-width: 768px)
.container {
    width: 750px;
}
.container {
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
}
//row中的内容居中
.row {
    margin-left: -15px;
    margin-right: -15px;
}
//清除浮动
.row:after {
    clear: both;
}
.row:before, .row:after {
    content: " ";
    display: table;
}
//为.col-md-1 到.col-md-12都设置width,这里可以看出工作量极大，传统css编程肯定不能满足需求了
//还需要设置xs,sm,lg三种屏幕的width
@media (min-width: 992px)
.col-md-1 {
    width: 8.33333%;
}
@media (min-width: 992px)
.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
    float: left;
}
.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

```
* 可以看出，要想可扩展性好，工程化css代码，使用传统的css代码是不行的。


* 下面来看一下栅格系统的scss代码是如何编写的
* 为container,row(行),coloum（列）写个mixin，确定其宽度，内边距和外边距

```
@mixin container-fixed($gutter: $grid-gutter-width) {
  margin-right: auto;
  margin-left: auto;
  padding-left:  ($gutter / 2);
  padding-right: ($gutter / 2);
  @include clearfix;
}
//设置行的左右外边距，清除浮动
@mixin make-row($gutter: $grid-gutter-width) {  
  margin-left:  ($gutter / -2);
  margin-right: ($gutter / -2);
  @include clearfix;
}

```


* 生成container 和row的样式

```
.container {
  @include container-fixed;

  @media (min-width: $screen-sm-min) {
    width: $container-sm;
  }
  @media (min-width: $screen-md-min) {
    width: $container-md;
  }
  @media (min-width: $screen-lg-min) {
    width: $container-lg;
  }
}
.container-fluid {
  @include container-fixed;
}
.row {
  @include make-row;
}
```


* 为col-xs-1~12、col-sm-1~12、col-md-1~12、col-lg-1~12、设置通用样式，写一个mixin

```
//list类似于数组，不需要指定类型和大小

@mixin make-grid-columns($i: 1, $list: ".col-xs-#{$i}, .col-sm-#{$i}, .col-md-#{$i}, .col-lg-#{$i}") {
  @for $i from (1 + 1) through $grid-columns {                  
    $list: "#{$list}, .col-xs-#{$i}, .col-sm-#{$i}, .col-md-#{$i}, .col-lg-#{$i}";
  }
  #{$list} {
    position: relative;
    // Prevent columns from collapsing when empty
    min-height: 1px;
    // Inner gutter via padding
    padding-left:  ($grid-gutter-width / 2);
    padding-right: ($grid-gutter-width / 2);
  }
}

	//从$i=1开始循环，循环$grid-columns次，其中（1+1）指的是至少循环$i=1,$=2，纵使$grid-columns=1
  	 //这里的#{$list}用来保存上次循环的生成数组，传递到下次循环中去
  	 //因为$list："..."相当于每次为数组赋值，循环到第12次的时候，仅仅会$list为col-xs-12，而没有保存之前循环的内容

```


* 为col-xs-1~12、col-sm-1~12、col-md-1~12、col-lg-1~12设置媒体查询，自适应屏幕

```
$screen-xs:                  480px !default;
$screen-sm-min:              768px !default;
$screen-md-min:              992px !default;
$screen-lg-min:              120px !default;

@include make-grid(xs);
@media (min-width: $screen-sm-min) {
  @include make-grid(sm);
}
@media (min-width: $screen-md-min) {
  @include make-grid(md);
}
@media (min-width: $screen-lg-min) {
  @include make-grid(lg);
}

```


* 下面来看下make-grid()

```
@mixin make-grid($class) {
  @include float-grid-columns($class);     
  @include loop-grid-columns($grid-columns, $class, width);
  @include loop-grid-columns($grid-columns, $class, pull);
  @include loop-grid-columns($grid-columns, $class, push);
  @include loop-grid-columns($grid-columns, $class, offset);
}
//为所有col-xs|sm|sm|lg-1~12 添加 float:left
@mixin float-grid-columns($class, $i: 1, $list: ".col-#{$class}-#{$i}") {
  @for $i from (1 + 1) through $grid-columns {
    $list: "#{$list}, .col-#{$class}-#{$i}";
  }
  #{$list} {
    float: left;
  }
}
//loop-grid-columns为所有col-xs|sm|sm|lg-1~12分配百分比宽度
//如
@media (min-width: 992px)
.col-md-1 {
    width: 8.33333%;
}
@mixin loop-grid-columns($columns, $class, $type) {
  @for $i from 0 through $columns {
    @include calc-grid-column($i, $class, $type);
  }
}
```



##来看一个完全使用sass编写的[demo](https://github.com/chencaijun1992/SassStydy/blob/master/template_index.html)
* 该demo是一个响应式的网站，自适应从320px-1200px各种屏幕（自响应式布局）
* 当中的button和grid系统是单独取出bootstrp的源码编译而成（减少代码臃肿）
* 加入多主题，可以切换多种网站主题（模块化css代码，适应弹性需求）



## 总结

* SCSS能使CSS代码模块化，使css代码重用性增强，便于阅读，维护，扩展。
* 前端框架并木有我们想的那么神秘高深，多加努力和实践，你也可以动手去写框架(UI部分)！













 




