// Cloudflare Pages Function: /api/ai
// 白嫖 Cloudflare 官方免费提供的 Workers AI 大模型能力

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { prompt, type, content } = await request.json();

    // 检查 Cloudflare 边缘端是否绑定了 AI 服务 (env.AI)
    if (!env.AI) {
      return new Response(
        JSON.stringify({
          error: "Cloudflare Workers AI 尚未绑定。请在 Cloudflare Pages 控制台的 Settings -> Functions -> Workers AI 绑定 AI 变量名为 'AI'。"
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = "你是一名顶级商业科技媒体（类似《晚点 LatePost》、《连线 Wired》）的主编与特约记者。你的语言风格冷静、克制、富有商业洞察力和现场感，绝不堆砌空话套话，善于用精准的细节和逻辑打动读者。输出请直接给出结果，使用标准 Markdown 格式。";

    let userMessage = prompt || "";

    if (type === "polish") {
      systemPrompt += " 你的任务是对用户提供的文段进行润色，提升其节奏感、商业深度与文学质感，保持原意但语言更加凝练有力。";
      userMessage = `请润色以下内容：\n\n${content}`;
    } else if (type === "quote") {
      systemPrompt += " 你的任务是从用户的文字中提炼出 1~2 句最具穿透力、最能引发读者深思的核心金句，并格式化为《晚点》风格的金句卡片格式（即 :::card 嘉宾职务 姓名\\n“金句内容”\\n:::）。";
      userMessage = `请提炼金句：\n\n${content}`;
    } else if (type === "title") {
      systemPrompt += " 你的任务是为文章生成 5 个具有商业穿透力、吸引高端读者且不低俗的爆款微信公众号标题。";
      userMessage = `文章内容如下：\n\n${content}`;
    } else if (type === "outline") {
      systemPrompt += " 你的任务是根据用户的想法，梳理一份深度特写专访或商业深度报道的文章大纲（包含一级长方块、二级中方块和小方块）。";
      userMessage = `主题/想法：\n\n${content}`;
    }

    // 调用 Cloudflare 免费模型库 (Qwen 1.5 14B 中文极佳，或 Llama 3)
    const model = "@cf/qwen/qwen1.5-14b-chat";

    const response = await env.AI.run(model, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    return new Response(JSON.stringify({ result: response.response || "" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "AI 请求处理失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
