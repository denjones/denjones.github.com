---
layout: post
title: "IOS Safari 浏览器的点击事件问题"
date: 2014-09-03 16:11
comments: true
categories: 
 - 技术{technique}
 - Javascript{javascript}
 - IOS{ios}
---

今天碰到一个问题，在IOS的Safari浏览器中，一个网页的div元素在绑定了click事件后点击时有变暗的闪烁。在其他浏览器均无出现此现象，即使是桌面的Safari也没有。

我于是清空了click事件中的所有代码，仍然会出现此状况，但是直接去掉时间绑定则不会变暗，于是确定是因为绑定click事件引起的变暗。

后面我又在事件处理中写了个alert()，发现在提示框弹出的时候，那个div已经变暗了，也就是说在处理事件之前，浏览器已经给div附加了变暗效果。那基本上可以确定是IOS Safari的默认样式效果了。

于是StackOverflow了一下问题迎刃而解：

``` css
html {
  -webkit-tap-highlight-color:transparent;
}
```

参考：[http://stackoverflow.com/questions/2355154/iphone-darkens-div-on-click](http://stackoverflow.com/questions/2355154/iphone-darkens-div-on-click)