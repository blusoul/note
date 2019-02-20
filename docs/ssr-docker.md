## SSR Docker

### Docker 安装（centOS 7)

1. 安装 Docker

   wget -qO- get.docker.com | bash

1. 安装完成后，验证是否安装成功

   docker version

1. 启动 Docker

   systemctl start docker

1. 查看 Docker 启动状态

   systemctl status docker

1. 允许 Docker 开机自启

   systemctl enable docker

### 镜像

1. 拉取镜像

   docker pull teddysun/shadowsocks-libev

1. 或者拉取以 alpine 镜像制作的，其特点就是文件容量非常小

   docker pull teddysun/shadowsocks-libev:alpine

1. 创建 config 文件，比如在目录 /etc/shadowsocks-r 下创建 config.json

```json
{
  "server": "0.0.0.0",
  "server_ipv6": "::", // ipv6地址
  "server_port": 9000, // 端口
  "local_address": "127.0.0.1",
  "local_port": 1080,
  "password": "password0", // 密码
  "timeout": 120,
  "method": "auth_chain_a",
  "protocol": "origin",
  "protocol_param": "",
  "obfs": "plain",
  "obfs_param": "",
  "redirect": "",
  "dns_ipv6": false,
  "fast_open": true,
  "workers": 1
}
```

1. 启动容器

   docker run -d -p 9000:9000 -p 9000:9000/udp --name ssr -v /etc/shadowsocks-r:/etc/shadowsocks-r teddysun/shadowsocks-r

   或者启动 Tag 为 alpine 的镜像命令：

   docker run -d -p 9000:9000 -p 9000:9000/udp --name ssr -v /etc/shadowsocks-r:/etc/shadowsocks-r teddysun/shadowsocks-r:alpine

1. 多端口版配置

```json
{
  "server": "0.0.0.0",
  "ipv6": "2001:19f1:5421:368::", // ipv6
  //   "server_port_1": 8888,
  "local_address": "127.0.0.1",
  "local_port": 1080,
  //   "password_i": "131231",
  "port_password": {
    // 端口：密码
    "11111": "1111",
    "11112": "11112",
    "11113": "11113"
  },
  "timeout": 120,
  "method": "none",
  "protocol": "auth_chain_a",
  "protocol_param": "",
  "obfs": "plain",
  "obfs_param": "",
  "redirect": "",
  "dns_ipv6": false,
  "fast_open": false,
  "workers": 1
}
```

1. 多端口启动，增加 tcp 和 udp 端口映射

   docker run --restart=always -d -p 11111:11111 -p 11111:11111/udp -p 11112:11112 -p 11112:11112/udp -p 11113:11113 -p 11113:11113/udp --name ssr -v /etc/shadowsocks-r:/etc/shadowsocks-r teddysun/shadowsocks-r

> --restart=always 添加开机自启

### 开启 BBR

    BBR: Google 开源了其 TCP BBR 拥塞控制算法，提高了网速，BBR不建议安装在容器里，确保使用最新内核，linux 内核版本4.9

#### 使用方法

1.  使用 root 用户登录，运行以下命令：

    wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh

1.  安装完成后，脚本会提示需要重启 VPS，输入 y 并回车后重启

1.  重启成功进入 VPS，验证一下是否成功安装最新内核并开启 TCP BBR

    uname -r

1.  验证并开启 BBR

        1. sysctl net.ipv4.tcp_available_congestion_control

        返回值一般为：

        net.ipv4.tcp_available_congestion_control = bbr cubic reno

        或者为：

        net.ipv4.tcp_available_congestion_control = reno cubic bbr

        2. sysctl net.ipv4.tcp_congestion_control

        返回值一般为：

        net.ipv4.tcp_congestion_control = bbr

        3. sysctl net.core.default_qdisc

        返回值一般为：

        net.core.default_qdisc = fq

        4. lsmod | grep bbr

        返回值有 tcp_bbr 模块即说明 bbr 已启动。注意：并不是所有的 VPS 都会有此返回值，若没有也属正常。

### 相关链接

1. [ShadowsocksR 协议插件文档](https://github.com/shadowsocksr-rm/shadowsocks-rss/blob/master/ssr.md)

1. [介绍几款 Docker 镜像](https://teddysun.com/536.html)

1. [一键安装最新内核并开启 BBR 脚本](https://teddysun.com/489.html)

1. [CentOS 安装 Docker CE](https://yeasy.gitbooks.io/docker_practice/install/centos.html)
