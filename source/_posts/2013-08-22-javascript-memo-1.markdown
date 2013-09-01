---
layout: post
title: "Javascript奇技淫巧之（一）"
date: 2013-08-22 20:21
comments: true
css: 
 - jquery-ui.css
 - jsmemo/imagecrop.css
 - jsmemo/photodrag.css
javascript:
 - jquery.js
 - jsmemo/jquery.photodrag.js
 - jsmemo/photodrag.js
 - jquery-ui.js
 - jsmemo/jquery.imagecrop.js
 - jsmemo/imagecrop.js
categories: 
 - 技术{technique}
 - Javascript{javascript}
---

这个系列只是一个备忘录，主要是讲述平时编程遇到的一些奇怪的问题。
其实这种奇怪的问题一般都出在IE上，所以重点就放在IE上了。

这次的主题是图片拖拽的问题，主要情景有几种，第一种是可以在网页上面拖拽的图片，另一种是在可拖动的元素下面有一张图。
当然还有一种是浏览器默认的图片拖拽，使用浏览器默认的图片拖拽可以直接将图片拖出浏览器，在新网页中打开，或者拖到其他软件中处理。
但是，往往我们都不希望出现默认的情况，尤其是想制造出前面两种效果的时候。

<!--more-->

##可以在网页上面拖拽的图片

下面这里有一个例子:

<div class="photo">
	<img class="photo_drag" src="{{ site_root }}/images/jsmemo/enako.jpg" alt="enako" />
</div>

点击图片可以拖动，如果你在IE之外支持canvas的浏览器中打开，还会有旋转的效果。
但是，如果只添加了拖动相关的代码的话，一开始会是下面这样：

<div class="photo">
	<img src="{{ site_root }}/images/jsmemo/enako.jpg" alt="enako" />
</div>

没错，就跟没添加没什么区别（实际上我懒得再写一份没做处理的javascript了，所以上面这个确实没添加-_-|||，嘛效果是一样的）。

好了，区别在于前者在处理在图片上的`mousedown`事件时，做了如下操作:

``` javascript
e.preventDefault();
e.stopPropagation(); 
```

`e`是传进jQuery事件处理函数的jQuery事件参数，前者阻止了浏览器使用默认方法对事件的处理，后者阻止事件冒泡。
于是事件传递到此结束，浏览器也就不会产生拖拽图片的操作。
其他浏览器事件都支持preventDefault()方法，IE是比较奇淫的，通过返回值来判断是否执行默认操作。
所以jQuery事件的preventDefault()方法类似下面：

``` javascript
var e = this.originalEvent;

this.isDefaultPrevented = returnTrue;
if ( !e ) {
	return;
}

// If preventDefault exists, run it on the original event
if ( e.preventDefault ) {
	e.preventDefault();

// Support: IE
// Otherwise set the returnValue property of the original event to false
} else {
	e.returnValue = false;
}
```

而停止冒泡基本就是方法名不一样了。

##可以在图片上面拖拽的元素

上面的解决方案可能很多人都知道。
不过在图片上拖拽元素这个可能就比较少实现。
一个比较常见的应用就是截图插件：

<div id="photo">
	<img id="scene" src="{{ site_root }}/images/jsmemo/scene.jpg" alt="scene"/> 
</div>

如果你想做出来选中内容跟未选中内容表现得不一样的效果，如上面的模糊与清晰的差别，那么很幸运，你将不会遇到奇怪的问题。
一旦你选择做出下面这种没有差别的效果，那就跪了，在IE你几乎无法移动那个小框（点小框的边框就可以）。

<div id="photo2">
	<img id="scene2" src="{{ site_root }}/images/jsmemo/scene.jpg" alt="scene"/> 
</div>

一开始我百思不得其解，因为点选框内，却产生了默认拖拽图片的操作，于是按上面的方法来修改onmouse事件，却无效。
最令人想不明白的是，明明小框显示在图片之上，为什么图片反而拦截到了点击事件？

其实答案却非常简单，只要仔细想想为什么点小框的边框就可以移动就明白了，点小框可以移动，证明小框获取消息的等级确实是比背景图要高。
而点击中间部分却无法移动，因为我们没有点到小框上的任何东西！是真的没有任何东西，直接穿透了小框，点到了图片上。
然后你就会发现，在IE中，原来元素里面没有任何东西，包括背景的话，点击的消息传递时是会直接跳过这个元素的。
IE在这里耍了点小聪明，以为这样可以方便消息的穿透，谁知道却适得其反。
不过好在解决方法是简单的，希望保持透明的话，加一层透明的背景就行了，这就不是没内容，而只是内容看不见而已。

<div id="photo3">
	<img id="scene3" src="{{ site_root }}/images/jsmemo/scene.jpg" alt="scene"/> 
</div>

而第一个效果分离的截图插件之所以不会遇到问题是因为这种效果一般是在小框内再包含一幅图像来实现的，就不再是透明的小框了。

##总结

其实这里还有一个技巧，就是实现模糊效果的方法。
目前只有Chrome支持高斯模糊滤镜，为了在其他浏览器实现模糊效果，只能进行模拟。
我们知道高斯模糊可以通过横向模糊加纵向模糊叠加实现，于是我们就可以用多张半透明图像进行错位叠加实现。

总而言之，在做前端开发中会遇到很多神奇的问题，以后我将一一记录在这里。另外吐槽一下，IE你为什么那么傲娇啊，看到IE就想哭啊有木有啊。

