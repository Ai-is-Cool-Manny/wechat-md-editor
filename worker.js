// Cloudflare Worker 全栈服务端入口
// 负责处理 R2 图床上传与分发，并将所有静态网页请求代理至前端页面

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 上传图片到 Cloudflare R2 存储桶
    if (url.pathname === "/api/upload" && request.method === "POST") {
      const bucket = env.R2 || env.BUCKET;
      if (!bucket) {
        return new Response(
          JSON.stringify({
            error: "Cloudflare R2 尚未绑定。请检查 wrangler.toml 中的 R2 配置。"
          }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
          return new Response(JSON.stringify({ error: "未接收到有效图片文件" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 生成唯一路径: uploads/202610/timestamp_random.ext
        const ext = file.name ? file.name.split(".").pop().toLowerCase() : "jpg";
        const datePrefix = new Date().toISOString().slice(0, 7).replace("-", "");
        const randomHash = Math.random().toString(36).substring(2, 10);
        const key = `uploads/${datePrefix}/${Date.now()}_${randomHash}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        await bucket.put(key, arrayBuffer, {
          httpMetadata: {
            contentType: file.type || "image/jpeg"
          }
        });

        // 拼接永久图床链接
        let imageUrl = "";
        if (env.R2_PUBLIC_URL) {
          imageUrl = `${env.R2_PUBLIC_URL.replace(/\/+$/, "")}/${key}`;
        } else {
          imageUrl = `${url.origin}/api/image?key=${encodeURIComponent(key)}`;
        }

        return new Response(JSON.stringify({ url: imageUrl, key }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || "上传失败" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 2. 从 R2 极速读取图片并进行 Cloudflare 边缘节点永久 CDN 缓存
    if (url.pathname === "/api/image" && request.method === "GET") {
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }

      const bucket = env.R2 || env.BUCKET;
      const key = url.searchParams.get("key");

      if (!key || !bucket) {
        return new Response("Image Not Found or R2 not bound", { status: 404 });
      }

      try {
        const object = await bucket.get(key);
        if (!object) {
          return new Response("Image Not Found in R2", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        // 全球永久强缓存 1 年
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        // 允许微信爬虫与任何源跨域抓取，彻底避免防盗链拦截
        headers.set("Access-Control-Allow-Origin", "*");
        if (!headers.has("Content-Type") || headers.get("Content-Type") === "application/octet-stream") {
          const isPng = key.toLowerCase().endsWith(".png");
          headers.set("Content-Type", isPng ? "image/png" : "image/jpeg");
        }

        const response = new Response(object.body, { headers });
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(cache.put(request, response.clone()));
        }
        return response;
      } catch (err) {
        return new Response("Error fetching image from R2", { status: 500 });
      }
    }

    // 3. 所有网页静态资源 (HTML, CSS, JS) 自动走静态资产引擎分发
    return env.ASSETS.fetch(request);
  }
};
