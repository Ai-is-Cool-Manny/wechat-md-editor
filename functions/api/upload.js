// Cloudflare Pages Function: /api/upload
// 白嫖 Cloudflare R2 免费对象存储实现自建图床

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // 检查是否绑定了 R2 Bucket (变量名为 R2 或 BUCKET)
    const bucket = env.R2 || env.BUCKET || env.R2_BUCKET;
    if (!bucket) {
      return new Response(
        JSON.stringify({
          error: "Cloudflare R2 尚未绑定。请在 Pages 控制台 -> Settings -> Functions -> R2 Bucket 绑定为 'R2'。"
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "未检测到有效图片文件" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 生成唯一文件名 (如: 202610/abc123xyz.png)
    const ext = file.name ? file.name.split(".").pop().toLowerCase() : "png";
    const datePrefix = new Date().toISOString().slice(0, 7).replace("-", "");
    const randomHash = Math.random().toString(36).substring(2, 10);
    const key = `uploads/${datePrefix}/${Date.now()}_${randomHash}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();

    await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "image/png"
      }
    });

    // 如果用户配置了 R2 自定义公共域名 (env.R2_PUBLIC_URL)，优先使用
    // 否则直接使用 Pages 自带的 /api/image 路由对外免备案分发！
    let imageUrl = "";
    if (env.R2_PUBLIC_URL) {
      const base = env.R2_PUBLIC_URL.replace(/\/+$/, "");
      imageUrl = `${base}/${key}`;
    } else {
      const origin = new URL(request.url).origin;
      imageUrl = `${origin}/api/image?key=${encodeURIComponent(key)}`;
    }

    return new Response(JSON.stringify({ url: imageUrl, key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "上传至 R2 失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
