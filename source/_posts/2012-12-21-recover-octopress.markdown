---
layout: post
title: "在新Windows系统中重新部署Octopress"
date: 2012-12-21 19:10
comments: true
categories:  
 - Octopress{octopress}
 - 技术{technique}
---

最近重装Win7 x64后直接在线升级到了Win8 x64，很多东西都要重新部署，包括octopress环境。这里记录一下关键的步骤，以便日后参考。

这个Memo将从安装git开始记录，前提是已经在别的电脑上往github部署好了Octopress。

<!--more-->

<h2>第一步：部署Git</h2>

参考过程：<a href="https://help.github.com/articles/set-up-git">Git hub官网</a>

<h4><a href="http://git-scm.com/downloads">下载并安装最新版Git</a></h4>

（可能需要翻墙，也可以自行搜索下载）

<h4>设置用户名</h4>

```
git config --global user.name "Your Name Here"
```

<h4>设置邮箱</h4>

```
git config --global user.email "your_email@youremail.com"
```

<h4>设置密码缓存（3600秒）</h4>

```
git config --global credential.helper 'cache --timeout=3600'
```

<h4>生成SSH key</h4>

```
ssh-keygen -C 'your_email@youremail.com' -t rsa
```

<h4>拷贝Key</h4>

到<code>C:/Users/用户名/ssh</code>打开并拷贝<code>id_rsa.pub</code>的内容。

<h4>注册SSH Key</h4>

到github页面点右上角的Account Setting，然后点左边的SSH Keys，再点右边的Add SSH key，然后把拷贝的内容粘贴到空白处点Add Key即可。

<h2>第二步：部署Octopress执行环境</h2>

参考过程：<a href="http://sinosmond.github.com/blog/2012/03/12/install-and-deploy-octopress-to-github-on-windows7-from-scratch/">Sinosmond的一篇文章</a>

<h4>安装Ruby</h4>

到 <a href="http://rubyforge.org/frs/?group_id=167">RailsInstaller</a> 查找下载最新版本（当前为1.9.3）。安装完后将安装目录下的bin文件夹添加到系统变量<code>PATH</code>中

<h4>安装DevKit</h4>

下载<a href="https://github.com/downloads/oneclick/rubyinstaller/DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe">RubyInstaller DevKit</a>并解压。在解压目录中用命令行执行：
```
ruby dk.rb init
ruby dk.rb install
```

<h4>安装Python</h4>

下载并安装<a href="http://www.activestate.com/activepython/downloads">ActivePython-2.7 的 x86版本</a>（即使是64位系统也尽量使用本版，其他版本兼容性未知）。
在命令行中执行
```
easy_install pygments
```

<h4>设置语言环境变量</h4>

设置 <code>LANG</code> 和 <code>LC_ALL</code> 两个环境变量，其值均设置为 <code>zh_CN.UTF-8</code>

启动git bash，执行
```
echo "export LANG LC_ALL" > ~/.bash_profile
echo "alias ll='ls -l --color=tty'" >> ~/.bash_profile
echo "alias ls='ls --color=tty'" >> ~/.bash_profile
```

<h4>配置Ruby</h4>

在git bash中执行一下命令配置更新源
```
gem sources --remove http://rubygems.org/
gem sources -a http://ruby.taobao.org/
```

在git bash中执行一下命令安装rdoc和bundler
```
gem install rdoc bundler
```

<h2>第三步：clone Octopress 分支</h2>

<h4>clone source 分支</h4>

在git bash中进入到需要存放本地分支的目录，然后执行
```
git clone -b source username:username.github.com.git username.github.com
```
以便将“source”分支clone到username.github.com文件夹下。其中以上所有“username”改为真正的用户名。

如果出现错误尝试使用
```
git clone -b source git@github.com:username/username.github.com username.github.com
```

<h4>clone master 分支</h4>

在git bash中继续执行
```
cd username.github.com #进入到source分支目录
git clone -b master username:username.github.com.git _deploy
```
以便将“master”分支clone到username.github.com文件夹下的_deploy文件夹。其中以上所有“username”改为真正的用户名。
如果出现错误尝试使用
```
git clone -b master git@github.com:username/username.github.com username.github.com
```

<h4>完成部署</h4>

至此，Octopress重新部署完毕，可以继续写博客咯。太久没动过这个博客了，差点就忘了怎么写博客了，如果有哪里有问题忘提醒。