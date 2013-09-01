---
layout: post
title: "Dust.js语法简介（三）"
date: 2013-08-19 15:53
comments: true
categories: 
 - 技术{technique}
 - Javascript{javascript}
---

[上一篇]({{site_root}}/blog/2013/08/17/introduction-dustjs-2/)介绍了Dust的最基本的语法，已经足够应付一般的模板翻译。这一章将介绍一些涉及逻辑的Dust语法以及介绍如何在前端应用模板。

<!--more-->

##逻辑区段

###?标签

用`?`来代替区段标签中的`#`时，仅当`name`的值为真时，才执行区段主体部分。

``` html
{?name} body {/name}
```

###^标签

用`^`来代替`#`时，仅当`name`的值为假时，才执行区段主体部分。

``` html
{^name} body {/name}
```

###{:else}标签

当一个区段标签（包括`#`、`?`、`^`、以及逻辑标签等）的值为假时，若区段主体中包含{:else}标签，则执行`{:else}`标签以及区段结束标签之间的内容，否则忽略这些内容。

``` html
<ul>
{#friends}
	<li>{name}, {age}{~n}</li>
{:else}
	<p>You have no friends!</p>
{/friends}
</ul>
```

若friend为空，则仅仅输出：

``` html
<ul>
	<p>You have no friends!</p>
</ul>
```

###值的真假

在区段中判断标签的真假的方法与Javascript本身稍有不同，Dust将以下值判断为假：

- 空字符串`’’`、`””`
- 布尔`false`
- `null`
- `undefined`
- 空列表`[]`
	
其余值均为真值，包括数字“0”，空对象`{}`。

##拆分（Partials）

拆分是一种将重复使用的模板抽取出来，并在使用到这段模板的模板中直接导入该模板，避免重复劳动的方法。在服务端，一个名为“xxx”的Dust模板通常通常保存在一个名为xxx.dust的模板文件中。我们可以利用模板名来在模板中插入一段来自其他模版文件的模板：

``` html
{>name /}
```

以上是一个自封闭的区段标签，代表将name.dust中的模版插入到当前位置。若文件包含路径，则用双引号包裹：

``` html
{>”dust/name” /}
```

标签中也可以填写参数：

``` html
{>”dust/name” foo=”Hello” bar=” World”/}
```

甚至可以使用动态路径：

``` html
{>”dust/{pathName}” /}
```

##区块（Blocks）

通过拆分可以重用一个模版，但是用这种方法来派生模版有一个缺点，就是你需要记得需要在什么位置插入哪个模版，并且对每一个派生出来的模版都要重新布局一次。区块可以解决这个问题，在父模板中使用区块可以方便地在子模板中替换区块中的内容。区块也是一种特殊的区段，定义方法如下：

``` html
{+name /}
```

或者在区段中填写默认内容，当区块没有被替换时，将显示默认内容：

``` html
{+name}default Content{/name}
```

使用区块替换需要在子模板中使用拆分区段（`>`）导入父模板，并使用替换区段（`<`）进行替换：

``` html
{>father/}
{<name}Content{/name}
```

比如一个父模板可以写成这样：

``` html
<div class="page">
	<h1>{+pageHeader}PayPal{/pageHeader}</h>
	<div class="bodyContent">
  		{+bodyContent/}
	</div>
	<div class="footer">
 	{+pageFooter}Contact Us	{/pageFooter}
	</div>
</div>
```

然后保存为shared/base_template.dust文件，然后定义子模板：

``` html
{! 首先导入父模板 !}
{>"shared/base_template"/}

{! 然后定义对应的部分 !}
{<bodyContent}
<p>These are your current settings:</p>
<ul>
  <li>xxxx</li>
  <li>yyy</li>
</ul>
{/bodyContent}
{<pageFooter}
       <hr>
       <a href="/contactUs">About Us</a> |
       <a href="/contactUs">Contact Us</a>
{/pageFooter}
```

##应用Dust模板

至此，Dust自带的基本功能语法已经介绍完毕，目前大家可能只在测试器中使用过模板，以下将介绍如何直接在前端中应用模板。

###编译

之前也介绍过，Dust是编译型模板，意思则是若需应用模板，首先要将模板可执行化，即将模板变成可执行的代码。如果你使用过Dust测试器，那么你会发现在你输入模板后，会在2号框中显示一个函数定义，那就是编译生成的代码。使用编译型模板有一个好处，就是当模板编译好之后，若需要重复使用模板，不需要每次都对模板重新进行分析，加快模板解析的速度，而且，模板可以预先编译好保存在服务器，甚至让前端连第一次编译的时间都节省了。

因此Dust库有两种发行版本：

- dust-core-2.0.2.js
- dust-full-2.0.2.js

前者为核心（Core）版本，其只包含模板解析的相关代码，大小只有十几k，而完全版（Full）则包含Dust的所有代码，包括编译器，大小有一百多k。对于不需要在前端进行编译的项目，仅仅需要使用核心版本即可，这也是速度比较快的做法。但是对于需要在前端动态编译的项目，则只能使用包含编译器的完全版。

编译模板的方法很简单，使用完全版的dust.compile()方法：

``` javascript
var compiled = dust.compile("Hello {name}!", "intro");
```

其中第一个参数为模板字符串，第二个参数为模板名，函数将返回包含编译好的可执行代码的字符串。这个操作不会注册这个模板，仅进行编译，此时仍不可通过模板名来调用这段代码。

###注册

如果直接执行一遍compiled中的代码，则模板会按之前指定的名字注册到dust，从而可以通过模板名来调用该模板。但若compiled代码未被执行过，则需要在渲染前手动将其注册到dust中，注册的方法很简单：

``` javascript
dust.loadSource(compiled);
```

###渲染

通过编译注册可以让多套模板处于就绪状态，对于这些模板，我们可以直接用它将JSON对象渲染成HTML文本，通过调用dust.render()方法。

``` javascript
dust.render("intro", {name: "Fred"}, function(err, out) {
	console.log(out);
});
```

这个方法接受3个参数，第一个为模板名，第二个为JSON对象，第三个是一个接受两个参数的回调函数。执行这个方法后Dust会使用注册好的对应模板对JSON对象进行处理，得出一个渲染结果字符串，然后调用回调函数，其中第一个参数包含了在处理过程中出现的错误信息，第二个参数就是渲染结果字符串。一般会在回调函数中将渲染结果插入到当前的DOM结构中，以便在浏览器中显示渲染结果。

###区块和拆分

一般使用文件来保存模板并且使用区块和拆分是让Dust作为服务端模板时应用的技术，因为在客户端Javascript中无法很方便地对分布式文件进行操作。但是我们可以通过在本地部署模板数据，编译成可执行代码并用一个js文件来保存的方式来使用区块和拆分。

若在Linux平台则直接在终端安装npm和dust并使用dustc命令编译成代码，得到js文件。

``` sh
$ npm install dustjs-linkedin
$ dustc input.dust output.js
```

或者在js引擎中使用dust.compile()，将模板复制到第一个参数，指定第二参数为其不带后缀的文件名，并将结果输出到js文件。

``` javascript
var output1 = dust.compile(partialStr, "partial");
var output2 = dust.compile(baseStr, "base");
var output3 = dust.compile(childStr, "child");
```

最后在HTML中导入所有生成的js文件即可使用。

``` html
<script type="text/javascript" src="partial.js"></script>
<script type="text/javascript" src="base.js"></script>
<script type="text/javascript" src="child.js"></script>
```

注意此时不再需要使用dust.loadSource()来注册，因为script标签将js文件执行了一次，已经将模板注册好了。此时已可使用dust.render()进行渲染。

##结语

至此，我们已经可以在前端中使用模板了，但是还有一些高级功能这里并未涉及，包括`@`辅助标签以及自定义扩展标签，如果有动力写Dust.js语法简介（四）的话，我将会在那介绍。除此之外，这里只提供了在Linux编译模板的一些官方方法，若需要在Windows下编译模板，则比较麻烦，有机会再写一篇如何在Windows下编译模板的教程吧。

##文章链接
- [Dust.js语法简介（一）]({{site_root}}/blog/2013/08/16/introduction-dustjs-1)
- [Dust.js语法简介（二）]({{site_root}}/blog/2013/08/17/introduction-dustjs-2)
- [Dust.js语法简介（三）]({{site_root}}/blog/2013/08/19/introduction-dustjs-3)