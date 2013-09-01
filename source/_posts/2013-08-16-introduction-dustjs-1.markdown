---
layout: post
title: "Dust.js语法简介（一）"
date: 2013-08-16 9:44
comments: true
categories: 
 - 技术{technique}
 - Javascript{javascript}
---

[经过一轮挣扎]({{site_root}}/blog/2013/08/15/introduction-client-template/)，我作出了与LinkedIn一样的选择，使用Dust.js作为模板，但是因为Dust.js缺少中文文档，导致在国内的普及率比较低。于是我决定在这里对Dust的语法进行一些必要的介绍。

<!--more-->

##为什么要用前端模板？

在静态页面中，包括已经从后台生成的HTML中，一般很少需要应用到模板，但是随着AJAX技术的发展，不刷新页面而动态更新内容的需求越来越高。为了降低通讯成本，这种通讯技术传输的一般是一个JSON对象，而不是一整串HTML字符串，所以在前端接受JSON数据之后，还要经过处理才能按要求显示在浏览器上。若只是用纯javascript进行拼接处理，将是一个比较繁琐的过程，而且写出来的代码不直观，可读性比较低。比如如果一个JSON对象`people`是下面这样的：

``` javascript
{
	"title": "Famous People", 
	"names": [{ "name": "Larry" }, { "name": "Curly" }, { "name": "Moe" }]
}
```

我们要把他渲染成一个HTML列表如下：

``` html
Famous People 
<ul>
　　<li>Larry</li>
　　<li>Curly</li>
　　<li>Moe</li>
</ul>
```

使用纯粹的javascript将是这样的：

``` javascript
var result = people.title + '\n';
result += '<ul>' + '\n';
for (var i = 0; i < people.names.length; i++) {
	result += '<li>' + people.names[i].name + '</li>' + '\n';
}
result += '</ul>'
```

当然了这只是一个比较简单的例子，而且代码具有专用性且不是最简形式，但是为了兼顾可读性和简介性这样写是比较好的。而使用dust模板将只需要一个模板：

``` html
{title}
<ul>
{#names}
　　<li>{name}</li>{~n}
{/names}
</ul>
```

然后将`people`传给编译好的模板则可生成所需要的结果，非常直观。


##什么是Dust.js？

Dustjs、dust.js或者直接叫Dust，是一种模板，一开始是由[Aleksander](https://github.com/akdubya) 编写并于2010发布第一个版本[于Github](https://github.com/akdubya/dustjs)。因为后台编译使用 Node.js 所以延续了在插件名后加.js的传统。Aleksander 很喜欢胡子模板 Mustache 的语法。但是Mustache缺少了Aleksander想要的特性，比如模板块和高性能。

从[dust.js的导引页面](http://akdubya.github.io/dustjs/)看来，这个模板制作者还是很有诚意的。可惜这个项目已于两年前停止更新，版本停留在0.3.0。好消息是大型职业社交网[LinkedIn](http://www.linkedin.com)也了解到了这个模板的优点和潜力，并接手了Dust.js的后续开发，最终出来的就是现在的[Dust.js(LinkedIn)](http://linkedin.github.io/dustjs/)，为了简便起见后面继续称之为Dust。经过不断地更新，Dust目前已经到了2.0版本了。

## 

由于时间关系，我还是决定将真正的语法介绍留到下一篇文章了，敬请期待。

##文章链接
- [Dust.js语法简介（一）]({{site_root}}/blog/2013/08/16/introduction-dustjs-1)
- [Dust.js语法简介（二）]({{site_root}}/blog/2013/08/17/introduction-dustjs-2)
- [Dust.js语法简介（三）]({{site_root}}/blog/2013/08/19/introduction-dustjs-3)