# Docker 部署

AstrBot 推荐通过 Docker 进行一键式快速部署。

## 部署步骤

1. **准备环境**: 确保已安装 Docker 和 Docker Compose。
2. **下载配置文件**: 获取 `docker-compose.yml`。
3. **启动容器**: 执行以下命令。

```bash
docker-compose up -d
```

## 默认参数

- **端口**: `6185`
- **默认用户名**: `admin`
- **默认密码**: `password`

::: tip
Docker 部署能显著降低环境兼容性问题。
:::
