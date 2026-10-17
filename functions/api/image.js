// Cloudflare Pages Function: /api/image?key=...
// 直接从 R2 读取图片并提供超高速 CDN 全球永久缓存

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Missing image key", { status: 400 });
    }

    const bucket = env.R2 || env.BUCKET || env.R2_BUCKET;
    if (!bucket) {
      return new Response("R2 bucket not bound", { status: 503 });
    }

    const object = await bucket.get(key);

    if (!object) {
      return new Response("Image Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    // 永久强缓存 1 年，全球 CDN 节点秒开
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  } catch (err) {
    return new Response(err.message || "Error reading image from R2", { status: 500 });
  }
}
