---
title: 'CentOS7 MySQL 数据库安装与卸载'
date: '2023-04-08'
tags: ['Database', 'MySQL']
draft: false
summary: 'CentOS7 中对于数据库操作的学习记录'
images: ['/static/images/blog/202304/CentOS7_MySQL_install/git-notes.jpg']
authors: ['default']
---

import UnsplashPhotoInfo from './UnsplashPhotoInfo.tsx'

![thumbnail-image](/static/images/blog/202304/CentOS7_MySQL_install/git-notes.jpg)
<UnsplashPhotoInfo photoURL="https://unsplash.com/photos/842ofHC6MaI" author="Yancy Min" />


## 安装

### 第一步，如果机器不支持wget，则安装一下wget

```bash
yum -y install wget
```

### 第二步，如果没有MySQL源，则需要下载MySQL源并安装

```bash
wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
rpm -ivh mysql-community-release-el7-5.noarch.rpm
```

### 第三步，正式安装MySQL，如果本身有源，可以跳过前两步。

```bash
yum install mysql-server
# 安装过程如有选项，默认都选y即可。
```

### 第四步，配置账户和权限

```bash
# 启动
service mysqld start
# 运行
mysql_secure_installation
# 运行 mysql_secure_installation 会执行几个设置：
#      a)为root用户设置密码             n（也可以设置root密码）
#      b)删除匿名账号                   y
#      c)取消root用户远程登录            y
#      d)删除test库和对test库的访问权限   y
#      e)刷新授权表使修改生效             y
# 进入mysql，没有root密码可以直接输入mysql，如果有密码则输入mysql -uroot -ppassword
# 创建授权账号，所有ip可以访问。
grant all on *.* to user@'%' identified by 'password';
```

### 其他配置

```bash
# 可以修改/etc/my.cnf，配置文件

# 如果要更改数据库目录，使用mv /var/lib/mysql /opt/mysqldata/ 迁移目录
# 修改my.cnf
socket	    = /opt/mysqldata/mysql/mysql.sock
datadir     = /opt/mysqldata/mysql

# centos7 关闭SElinux，否则会启动异常，可以去查看log
/usr/sbin/setenforce 0
```

## 卸载

### 1. 查询是否安装 MySQL

```bash
rpm -qa | grep -i mysql
# ----------------------
[root@VM-8-17-centos ~]# rpm -qa | grep -i mysql
mysql-community-release-el7-5.noarch
mysql-community-client-5.6.51-2.el7.x86_64
bt-mysql56-5.6.50-1.el7.x86_64
mysql-community-common-5.6.51-2.el7.x86_64
mysql-community-libs-5.6.51-2.el7.x86_64
mysql-community-server-5.6.51-2.el7.x86_64
```

输出结果表示，安装的MySQL Server,Client都是5.6.51的。

### 2. 关闭 MySQL

查询 MySQL 运行状态：

```bash
service mysql status
# ----------------------
[root@VM-8-17-centos ~]# service mysql status
Redirecting to /bin/systemctl status mysql.service
● mysqld.service - MySQL Community Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: failed (Result: start-limit) since 一 2023-04-10 17:54:05 CST; 1min 20s ago
  Process: 12255 ExecStartPost=/usr/bin/mysql-systemd-start post (code=exited, status=0/SUCCESS)
  Process: 12254 ExecStart=/usr/bin/mysqld_safe --basedir=/usr (code=exited, status=1/FAILURE)
  Process: 12236 ExecStartPre=/usr/bin/mysql-systemd-start pre (code=exited, status=0/SUCCESS)
 Main PID: 12254 (code=exited, status=1/FAILURE)
```

关闭 MySQL

```bash
# 服务方式：
service mysql stop
# 命令方式：
mysqladmin -u root shutdown
```

### 3. 查看 MySQL 对应的文件

```bash
find / -name mysql
# ----------------------
[root@VM-8-17-centos ~]# find / -name mysql
/etc/selinux/targeted/tmp/modules/100/mysql
/etc/selinux/targeted/active/modules/100/mysql
/etc/logrotate.d/mysql
/usr/share/mysql
/usr/bin/mysql
/usr/lib64/mysql
/usr/include/mysql
find: ‘/proc/23870’: 没有那个文件或目录
find: ‘/proc/23880’: 没有那个文件或目录
/www/server/mysql
/www/server/mysql/bin/mysql
/www/server/mysql/include/mysql
/www/server/data/mysql
/www/server/panel/pyenv/lib/python3.7/site-packages/sqlalchemy/dialects/mysql
/var/lib/mysql
/var/lib/mysql/mysql
/run/lock/subsys/mysql
```

### 4. 卸载并删除 MySQL 安装的组键服务

- 如果是使用 yum 安装的 MySQL，用以下命令进行卸载：

```bash
rm -rf /var/lib/mysq
rm /etc/my.cnf
# 直至卸载全部
```

- 如果是使用 rpm 方式安装的 MySQL，使用 rpm -qa|grep mysql 命令来查看 rpm 方式安装的 mysql，如果查询结果不为空，需要将这些rpm卸载掉。
    - 查看系统中是否以rpm包安装的mysql：
    
    ```bash
    rpm -qa | grep -i mysql
    # ----------------------
    [root@VM-8-17-centos ~]# rpm -qa | grep -i mysql
    mysql-community-release-el7-5.noarch
    mysql-community-client-5.6.51-2.el7.x86_64
    bt-mysql56-5.6.50-1.el7.x86_64
    mysql-community-common-5.6.51-2.el7.x86_64
    mysql-community-libs-5.6.51-2.el7.x86_64
    mysql-community-server-5.6.51-2.el7.x86_64
    ```
    
    - 使用 rpm -e 命令将上个命令中包列表一一进行卸载。
    
    ```bash
    rpm -e mysql-community-libs-5.6.51-2.el7.x86_64
    ```
    
    - 然后删除mysql相关的服务。
    
    ```bash
    chkconfig --list | grep -i mysql
    chkconfig --del mysql
    ```
    
    - 然后找出OS中分散的mysql文件夹，并删除。
    
    ```bash
    find / -name mysql
    ```
    
    - 清空mysql相关的的所有目录以及文件
    
    ```bash
    rm -rf # ...
    find / -name mysql
    ```