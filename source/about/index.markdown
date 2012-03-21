---
layout: page
title: "關於..."
comments: true
sharing: true
footer: true
---
<img src="/images/logo_long_s.png" alt="SPRABBIT"/>

<h2>簡介</h2>
這是<a href="http://www.sprabbit.com">SPRabbit(超科學兔耳中隊)</a>的博客。主要用於社團動向的發佈，以及社團作品的展示。除此之外還可能用作中隊長的個人博客，和社團技術博客。

<h2>SPRABBIT</h2>
SPRABBIT-超科學兔耳中隊，是我們社團的名字，可以稱作SPRabbit、SPR、超科學兔耳中隊、兔耳中隊……嘛，關於這個名字的由來，我會告訴你們是隨便取的麼！

目前為止，SPRABBIT并沒有吸引到多少人的注意力，社團作品也屈指可數，但是未來是光明的。之前的經驗也奠定了我們走技術道路，希望有朝一日SPRABBIT能成為獨當一面的大社團！

<h2>中文？英文？</h2>
雖然沒有一個富有中文意味的社團名稱，但是社團本身還是一個以東方文字為主導的社團，也希望能創造出具有東方特色的社團作品。既然是中文同人社團，博客也應該是中文的。原本Octopress是一個純英文的框架，對中文乃至UNICODE的支持並不是十分到位，因此我對原有框架做了細微的修改，力求看到的文字，盡是中文。此框架也提供開源代碼，如果需要使用中文Octopress，可以在Github直接<a href="https://github.com/denjones/denjones.github.com">clone本框架</a>，然後將相關博文頁面刪除。另外，我選擇了繁體中文作為顯示語言，其中最主要的原因就是可以使更多中文地區人士可以看得懂(相信能看懂簡體字的童鞋都能看懂繁體吧)。但是地區不同，語言還是有差別的，比如博客，在台灣叫做部落格，在香港直接叫blog，我沒辦法很好的兼顧這些，所以就用我自己習慣使用的語言了。

<h2>Octopress</h2>
以前使用的是<a href="http://sprabbit.blog.163.com/">163的免費博客</a>，但是覺得有太多限制，無法展現一個社團的創造力。有了自己的域名之後，有在主機上假設過<a href="http://www.sprabbit.com/blog">Wordpress的博客</a>，但是免費主機的接口有所限制，Wordpress中的許多插件功能無法實現，於是只好放棄。後來一個嶄新的詞彙引起了我的注意——靜態博客。其中一個比較流行的模板就是我們現在在使用的<a href="http://octopress.org/">Octopress</a>。

Octopress所謂靜態博客，就是只包含靜態頁面的博客。不像Wordpress這樣的動態博客，Octopress沒有php頁面，所有頁面都是由純粹的HTML頁面構成的。博客這種類似于個人門戶網站的不需要太多交互的Web應用，確實比較適合于靜態頁面。至於其中的技術詳情，在此就不詳細多說，感興趣的朋友可以直接到<a href="http://octopress.org/">Octopress</a>的主頁查看架設教程，最好要有編程基礎，否則可能會覺得無從下手，因為Octopress是號稱是為Hacker設計的博客架構。其中涉及了Github版本管理，Ruby編程，還有最基本的html語言。就是說需要用記事本來寫日誌。

比如說上面“簡介”那一段就要寫成：
{% codeblock %}
<h2>簡介</h2>
這是<a href="http://www.sprabbit.com">SPRabbit(超科學兔耳中隊)</a>的博客。主要用於社團動向的發佈，以及社團作品的展示。除此之外還可能用作中隊長的個人博客，和社團技術博客。
{% endcodeblock %}
