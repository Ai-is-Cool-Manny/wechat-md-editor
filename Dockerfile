# 使用轻量级的 Nginx 官方镜像作为基础镜像
FROM nginx:alpine

# 将当前的网页静态文件复制到 Nginx 的默认托管目录下
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# 暴露 80 端口（你可以随后在启动容器时映射到任意端口）
EXPOSE 80

# Nginx 在前台运行
CMD ["nginx", "-g", "daemon off;"]
