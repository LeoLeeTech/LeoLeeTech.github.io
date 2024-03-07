---
title: move 语言开发环境搭建| try to web3 系列 (一)
sidebar: auto
---

>  概要: 
> 此文章主要内容是一个web2开发老鸟, **在mac OS上搭建 move 开发环境过程中遇到的问题, 以及解决方案**, 并在文章下方提供了一些在Linux/Ubuntu及windows上如何做的建议.
> macos和ubuntu的terminal操作日志已上传到[github仓库](https://github.com/lijileiGood/move-study/tree/main/001), 需要请查看

## 本地环境介绍

每个人经验不同, 请先容我介绍一下自己, 以便你能更准确的类比到自己

### 个人履历

> 鄙人6年开发经验, 以下描述是重叠的时间线

- 开发经验
  - 6年Java经验, 具体来说就是spring全家桶
  - 2年Js经验, 具体来说就是react + ts
  - 一点pythoh经验, 具体来说就是最近在微调大模型, 学了一点点python语法以便读懂开源项目的代码

- 操作系统经验
  - n年使用windows, 一点WSL经验
  - 半年使用ubuntu desktop, 2年ubuntu server
  - 2年使用macos 经验

### 硬件及基础环境

-  2020款 13寸 MacbookPro M1
- mac OS Sonoma  14.3
- node
- python 3.8
- clash X Pro (科学上网工具, 默认你也可以科学上网)
- brew (macos 上安装软件的工具, 类比Debian系的apt, Redhat系的rpm)

## Move 简单介绍

朋友, 既然你能点开该文章, 那么说明你已经知道这个世界上有一门叫做move的开发语言啦
它是由Meta(原facebook)公司为了做Libra项目开发的, 底层是rust语言
现在move有两个大方向

- **move on aptos:** Libra项目先是更名为Diem, 又更名为aptos, 也就是更根正苗红一些, 生态更好一些
- **move on sui:** 某人相中了move这个语言, 在此基础上又完善/封装了一下用到了自己的项目sui上

以上讲的十分简略, 我也是刚接触了解也不多, 按理说我没资格讲的.  但是你是新手的话(我就是), 搜索move时, 它总是和aptos/sui一起出现, 让人很迷惑, 所以在此解释一下.

我选择的是基础版[move](https://github.com/move-language/move), 因为不管什么方向它都得是在基础上搞, **就像TypeScript之于JavaScript.**

## 开始安装

### 安装文档

在安装环境阶段, [这篇文章](https://github.com/move-language/move/tree/main/language/documentation/tutorial#Step0)是最重要的, 它在官方文档中藏得很深, 正常google是不可能搜出来, 只有阅读[move官方文档](https://move-language.github.io/move/introduction.html), 然后依照第二章的提示, 再跳转github才可以. 市面上所有的教程/文章都是基于此的.

摘录并翻译如下:

```sh
# 克隆仓库
git clone https://github.com/move-language/move.git

# 进入文件夹并执行脚本
cd move
./scripts/dev_setup.sh -ypt

# 刷新环境
source ~/.profile

# 安装move-cli
cargo install --path language/tools/move-cli

# 确认是否成功
move --help

# 看到如下显示就是成功了
move-cli 0.1.0
Diem Association <opensource@diem.com>
MoveCLI is the CLI that will be executed by the `move-cli` command The `cmd` argument is added here
rather than in `Move` to make it easier for other crates to extend `move-cli`

USAGE:
    move [OPTIONS] <SUBCOMMAND>

OPTIONS:
        --abi                          Generate ABIs for packages
...
```

### 踩坑之需要安装python3.12

```sh
# 执行脚本
(base) ➜  move git:(main) ./scripts/dev_setup.sh -ypt
Welcome to Move!
.....
# 输入 y 确认
Proceed with installing necessary dependencies? (y/N) > y
                    

# 提示python3.12没有, 请安装
(base) ➜  move git:(main) brew install --build-from-source python@3.12
```

### 踩坑之需要安装xcode-select

> 需要断开科学上网工具, 否则会安装失败

mac上很多工具编译需要依赖xcode, 我一开始以为是xcode版本不行呢, 一是我是xcodes安装的, 二是不是最新版.
所以我开始卸载xcode, 卸载xcodes -> app store 安装, 但最终发现是科学上网的事.

```sh

# 失败, 使用提示安装xcode-select --install
Error: python@3.12: the bottle needs the Apple Command Line Tools to be installed.
  You can install them, if desired, with:
    xcode-select --install

If you're feeling brave, you can try to install from source with:
  brew install --build-from-source python@3.12

# 需要断开科学上网工具, 否则会安装失败
(base) ➜  move git:(main) xcode-select --install


# 安装成功后继续安装python3.12, 成功
(base) -> brew install python@3.12
```

### 踩坑之科学上网

> 需要打开**真正全局代理**, 真正的系统层面的代理, 能代理到terminal命令的那种.
>
> 一般软件上显示的全局代理只是代理浏览器访问的页面, 请注意!

```sh
# 进入文件夹并执行脚本, 等很长时间....
cd move
./scripts/dev_setup.sh -ypt

# 刷新环境
source ~/.profile
```



### 踩坑之安装rust

> cargo是rust的工具, 需要先安装rust

```sh
# 安装move-cli
(base) ➜  move git:(main) cargo install --path language/tools/move-cli 

# 失败, cargo是rust的工具, 而我从没有装过rust, 所以需要先安装rust
brew install rust

# 再次执行
(base) ➜  move git:(main) cargo install --path language/tools/move-cli 
```



### 终于成功啦

```sh
# 确认是否成功
move --help

# 看到如下显示就是成功了
move-cli 0.1.0
Diem Association <opensource@diem.com>
MoveCLI is the CLI that will be executed by the `move-cli` command The `cmd` argument is added here
rather than in `Move` to make it easier for other crates to extend `move-cli`

USAGE:
    move [OPTIONS] <SUBCOMMAND>

OPTIONS:
        --abi                          Generate ABIs for packages
...
```



## Linux/Ubuntu 失败

> ubuntu 18 , 国内的服务器, 没有上网工具, 失败

- macos 和 Linux/Ubuntu 同宗同源, 参照上方教程即可
- 如果你需要了解linux基础知识, 欢迎查看我的这篇[鸟哥的Linux私房菜 Ubuntu版](https://lijilei.com/linux/bird-linux.html)
- 如果你需要了解ubuntu上安装软件方式方法, 请查看上述教程中的[第三章-ubuntu软件安装-更新-卸载]



## windows怎么办

目前move还不支持windows, 但是windows上有WSL啊, 即windows下的linux 子系统,  请查看[WSL官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/)并善用搜索引擎.
