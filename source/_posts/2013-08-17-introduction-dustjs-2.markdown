---
layout: post
title: "Dust.js语法简介（二）"
date: 2013-08-17 16:26
comments: true
categories: 
 - 技术{technique}
 - Javascript{javascript}
---

从这篇文章开始我将介绍Dust的语法，其实内容基本上和Dust的[Tutorial](https://github.com/linkedin/dustjs/wiki/Dust-Tutorial)差不多，可能还要简化一点。

<!--more-->

##Dust在线测试器

首先要介绍一下Dust项目中的一个[在线测试器](http://linkedin.github.io/dustjs/test/test.html)，在了解Dust语法的同时，在这个测试器上尝试应用学到的语法，既可以验证语法是否正确，也可以加强对语法的记忆。进入测试器后可以见到四个框，从左上、左下、右上、右下分别编号为1、2、3、4。测试时在1号框中填入一个Dust模板，然后2号框将显示该模板编译后的结果，再在3号框填入一个JSON对象，4号框中将显示最终的渲染结果。

##标签（Tag）

Dust模板以一种嵌入到HTML中的标签的形式存在。Dust标签使用一对花括号包裹，类似于HTML标签使用一对尖括号包裹：

``` html
{name}
```

##注释

以下标签将不会产生任何内容，即可用作注释（感叹后之间）：

``` html
{! Comment syntax !}
```


##键（Key）

一般Dust标签的表示只有两种形式，一种是键，另一种是区段。键是一个最简单的Dust标签，其中包含的花括号中的值称之为键，对应于JSON对象的属性名，对应的属性值一般为简单类型，比如字符串，渲染后将直接以属性值代替整个标签。如果搜索不到任何匹配值，则不会返回任何数据。

``` html
{name}
```

在键名后面可以跟随过滤器，使用竖线分隔，一般用于选择处理“<”，“>”等特殊符号的转义：

- {name|s} 禁用自动转码
- {name|h} 强制使用HTML转码
- {name|j} 强制使用Javascript转码
- {name|u} 使用encodeURI编码
- {name|uc} 使用encodeURIComponent编码
- {name|js} 将JSON对象转换为字符串
- {name|jp} 将JSON 字符串转换为JSON对象

过滤器也可以进行组合：
	
	{name|jp|h}
	
一些特殊字符也可以键的形式直接取值输出：

- {~n}	换行
- {~r} 	CR换行
- {~lb} 	左花括号
- {~rb} 	右花括号
- {~s} 	空格

	
##区段（Section）

以下两个标签及其包裹的部分称之为区段，用于循环显示数据。其中“#”为开始标签，“/”为结束标签，其后的键值同样对应于JSON对象的属性名，对应的属性值一般为数组或单个对象，单个对象将被当做一个只有一个元素的数组来对待。模板会按下标对数组中的每个元素调用一次区段包裹着的模板。上一篇中的例子就是利用了区段来循环输出列表元素。

``` html
{#names}....{/names}
```

在区段中可以使用两个特殊的键：

- {$idx}	表示当前迭代的序号（从0开始）
- {$len}	表示数组长度

	
##上下文（Context）

Dust对键或区段值的查询与javascript中对作用域链中变量值的查询类似，换而言之使用区段时会临时改变当前的上下文。

例如一个嵌套的JSON对象：

``` javascript
{
	"name": "root",
	"anotherName": "root2",
	"A":{
		"name":"Albert",
		"B":{
			"name":"Bob"
		}
	}
}
```

使用区段索值：

``` html
{#A}{name}{/A}
```

则会得到这个对象的`A.name`的值：

``` html
Albert
```

因为使用区段时将上下文转移到A属性对应的对象中。

而使用以下区段索值：

``` html
{#A}{anotherName}{/A}
```

因为在对象A的属性中不存在“anotherName”属性，于是Dust会向上查询A所处的上下文，发现存在“anotherName”属性，于是得到：

```
root2
```

若往上查找到JSON对象根部间的所有的上下文均无对应属性时将返回空白，索值不会向下查找。


##路径（Path）

若使用不带路径的区段索值，那么相当于从JSON对象的根部开始定位区段上下文。而使用路径可以指定开始搜索的位置。路径使用标志“.”来标记标签，跟javascript语法类似。依然是这个JSON对象：

``` javascript
{
	"name": "root",
	"anotherName": "root2",
	"A":{
		"name":"Albert",
		"B":{
			"name":"Bob"
		}
	}
}
```

若我们需要取A属性下的B属性的name则可以表达成这样：

``` html
{A.B.name}
```

或者使用路径标记区块：

``` html
{#A.B}{name}{/A.B}
```

或者使用单个“.”表示当前上下文对象（当前为字符串）：

``` html
{#A.B.name}{.}{/A.B.name}
```

规定路径后，首先在指定的上下文进行查找name的值，找不到时不会向上追溯，而是从根部开始查找。

``` html
{#A.B}{A.name}{/A.B}
```

上面这个模板将会在A.B中搜索A，因为B并无A属性，所以从JSON对象根部开始找到A属性，从而找到A.name，返回“Albert”，若从根部也无法找到，则返回空白。


##修改上下文

我们也可以在一定程度上修改上下文的关系。通过使用冒号“:”可以用冒号后面的键值代替前面的键值的父级上下文：

``` html
{#A:A2} ... {/A}
```

以上这个区段会屏蔽掉A的父级上下文，临时将A2作为A的父级上下文，即在A中找不到目标时不会往上回溯，而去搜索A2下的属性。

##区段参数

在区段中可以设置参数：

``` javascript
{#A.B foo="Hi" bar=" Good to see you"}
	{foo} {name} {bar}
{/A.B}
```

模板会将参数值替代键值标签，结果为：

``` html
Hi Bob Good to see you
```

参数也可以是键名，但是赋值时的上下文在区段之外：

``` javascript
{#A.B foo=A.name bar=anotherName}
	{foo} {name} {bar}
{/A.B}
```

## 

至此，我们已经可以简单地将模板付诸应用了。下一节将介绍一些逻辑相关的语法。

##文章链接
- [Dust.js语法简介（一）]({{site_root}}/blog/2013/08/16/introduction-dustjs-1)
- [Dust.js语法简介（二）]({{site_root}}/blog/2013/08/17/introduction-dustjs-2)
- [Dust.js语法简介（三）]({{site_root}}/blog/2013/08/19/introduction-dustjs-3)