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
  "ipv6": "2001:19f0:5401:368::",
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
