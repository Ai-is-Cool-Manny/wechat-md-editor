const markdownInput = document.querySelector("#markdownInput");
const preview = document.querySelector("#preview");
const articleTheme = document.querySelector("#articleTheme");
const customCssInput = document.querySelector("#customCss");
const accentColor = document.querySelector("#accentColor");
const fontSize = document.querySelector("#fontSize");
const lineHeight = document.querySelector("#lineHeight");
const themePreset = document.querySelector("#themePreset");
const brandName = document.querySelector("#brandName");
const bannerNote = document.querySelector("#bannerNote");
const brandTagline = document.querySelector("#brandTagline");
const stats = document.querySelector("#stats");
const copyStatus = document.querySelector("#copyStatus");
const fileInput = document.querySelector("#fileInput");
const layoutStyle = document.querySelector("#layoutStyle");

let currentDraftId = localStorage.getItem("wechat-md-current-id") || Date.now().toString();

function getDrafts() {
  try { return JSON.parse(localStorage.getItem("wechat-md-drafts") || "[]"); } catch (e) { return []; }
}
function saveDrafts(drafts) {
  localStorage.setItem("wechat-md-drafts", JSON.stringify(drafts));
}
function renderDrafts() {
  const draftList = document.querySelector("#draftList");
  if (!draftList) return;
  const drafts = getDrafts();
  draftList.innerHTML = "";
  drafts.sort((a, b) => b.updatedAt - a.updatedAt).forEach(draft => {
    const li = document.createElement("li");
    li.className = "draft-item" + (draft.id === currentDraftId ? " active" : "");
    const date = new Date(draft.updatedAt);
    li.innerHTML = `<div class="draft-title">${escapeHtml(draft.title || "无标题")}</div><div class="draft-time">${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}</div><button class="draft-delete" data-id="${draft.id}">删除</button>`;
    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("draft-delete")) {
        e.stopPropagation();
        if (confirm("确定删除此草稿？")) {
          const newDrafts = drafts.filter(d => d.id !== draft.id);
          saveDrafts(newDrafts);
          if (draft.id === currentDraftId) {
            if (newDrafts.length > 0) loadDraft(newDrafts[0].id);
            else {
              currentDraftId = Date.now().toString();
              markdownInput.value = "# 新文章\n";
              updatePreview();
            }
          } else renderDrafts();
        }
        return;
      }
      loadDraft(draft.id);
    });
    draftList.appendChild(li);
  });
}
function loadDraft(id) {
  currentDraftId = id;
  localStorage.setItem("wechat-md-current-id", id);
  const draft = getDrafts().find(d => d.id === id);
  if (draft) {
    markdownInput.value = draft.content;
    updatePreview();
  }
}

const sampleMarkdown = `# AI 工具真正改变工作的地方

> 很多工具看起来都很酷，但真正值得留下来的，是那些能让你少做重复劳动、把注意力还给判断力的东西。

## 先说结论

AI 不该只是一个聊天窗口。它更像一个**可调用的工作层**：能读材料、改稿子、跑流程、记住你的偏好，并且在关键节点帮你检查。

:::cool 适合放进公众号的重点
把 AI 当成“能力接口”，而不是“万能答案机”。你会更容易设计自己的工作流，也更容易判断一个工具值不值得长期用。
:::

## 一个实用判断框架

- 它是否减少了重复输入？
- 它是否保留了你的判断权？
- 它是否能融入已有流程，而不是制造新的负担？
- 它的输出是否可追踪、可修改、可复用？

## 小例子

| 场景 | 低价值用法 | 高价值用法 |
| --- | --- | --- |
| 写作 | 让 AI 直接写全文 | 让 AI 帮你整理结构、补盲点 |
| 学习 | 复制答案 | 追问推理过程和反例 |
| 工作流 | 多一个聊天窗口 | 嵌入固定步骤，自动处理材料 |

## 一段代码

\`\`\`js
const idea = "AI is cool when it removes friction.";
console.log(idea);
\`\`\`

## 最后

酷不是炫技，酷是一个东西真的让生活变轻了一点。
`;

const latepostSampleMarkdown = `# 独家对话美的方洪波：我只是一个过客，不需要被任何人记住

:::card 美的集团董事长 方洪波
“企业想要生生不息，依靠的是完善的公司治理，而不是一个人。”
:::

文丨宋玮

13 年前，70 岁的美的公司创始人何享健把公司交给了 45 岁的方洪波。在那场意义非凡的交班仪式上，方洪波仅说了两句话，他说，“千里马常有，而伯乐不常有”，第二句话是，“我只是美的发展历史中的一个过客”。

方洪波清晰知道自己是谁，一个过客。

正是这名过客，创造了中国商业史上罕见的增长奇迹。在他接任美的董事长这十三年，美的收入增长了 4 倍，从 1000 亿到 4000 亿；市值翻了 8 倍，上涨了超过 5000 亿。

## 我不加班，也不鼓励员工加班

晚点：那个时候含金量很高是吧？

方洪波：非常高，空中有一颗星用的就是他的名字。当年我骑着摩托车每天路过他家，豪华的奔驰 600 停在门口，大家都是非常仰望在看。

晚点：听闻你喜欢研究商业变迁，美国 200 年商业变迁，能找到的资料你基本都看了。你从中看到的规律是什么？

方洪波：摸着发达国家企业的发展经验过河。美的今天做的没有新鲜事，都是从发达国家的跨国企业经历过的事情中总结出来的。常识是跨越时间、空间，被检验证明不会变的。

## 混乱是阶梯，美的的两次关键转型

晚点：新时代的秩序、规则和底层技术都在动态变化，那老公司的护城河到底是什么？

方洪波：它在不断的动态变化当中。过去 10 年美的护城河是效率。我们的现金周期是负的，家电行业里我估计目前只有美的实现了——我们做生意，不用自己拿本钱，都是用别人的钱在做生意。我们去年现金周期是 -9 天——这就是我的护城河，但这个护城河在不断地被侵蚀。

题图来源：美的集团

- FIN -
`;

const themePresets = {
  latepost: {
    accent: "#ee0000",
    bg: "#ffffff",
    ink: "#000000",
    muted: "#737373",
    soft: "#f2f3f3",
    line: "#ee0000",
    banner: "#ffffff",
    codeBg: "#1f1f1f",
    codeText: "#f5f5f5",
    font: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    mono: 'Consolas, "SFMono-Regular", Menlo, monospace',
    css: `.wechat-article { font-size: 15px; line-height: 1.75; letter-spacing: 0.8px; color: #000000; text-align: justify; }
.wechat-article h1 { font-size: 24px; line-height: 1.35; font-weight: 700; letter-spacing: 0.5px; margin: 0 0 20px; color: #000000; }
.wechat-article h2 { font-size: 20px; line-height: 1.25; font-weight: 700; letter-spacing: 0.5px; margin: 36px 0 16px; color: #000000; }
.wechat-article h3 { font-size: 17px; line-height: 1.35; font-weight: 700; margin: 26px 0 12px; color: #000000; }
.wechat-article p { margin: 16px 0; line-height: 1.75; letter-spacing: 0.8px; text-align: justify; color: #000000; }
.wechat-article blockquote { margin: 20px 0; padding: 12px 16px; border-left: 3px solid #ee0000; background: #fbfbfb; color: #333333; }`
  },
  appleClean: {
    accent: "#0071e3",
    bg: "#ffffff",
    ink: "#1d1d1f",
    muted: "#86868b",
    soft: "#f5f5f7",
    line: "#d2d2d7",
    banner: "linear-gradient(135deg, #ffffff 0%, #fbfbfd 100%)",
    codeBg: "#1d1d1f",
    codeText: "#f5f5f7",
    font: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    mono: '"SF Mono", "SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article h1, .wechat-article h2, .wechat-article h3 { font-weight: 600; letter-spacing: -0.015em; }\n.wechat-article blockquote { background: #fbfbfd; border-left: 3px solid #d2d2d7; }`
  },
  morandiMist: {
    accent: "#7895a3",
    bg: "#fdfdfb",
    ink: "#27343a",
    muted: "#6f7c80",
    soft: "#eef3f2",
    line: "#d9e3e1",
    banner: "linear-gradient(135deg, #ffffff 0%, #f4f7f6 52%, #e8f0ef 100%)",
    codeBg: "#38464c",
    codeText: "#f5f1ea",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article .brand-banner {
  border-color: #d9e3e1;
}`
  },
  morandiSage: {
    accent: "#8a9a7b",
    bg: "#fffefb",
    ink: "#30362f",
    muted: "#777b70",
    soft: "#f1f3ed",
    line: "#dedfD4",
    banner: "linear-gradient(135deg, #ffffff 0%, #f6f7f2 56%, #ecefe4 100%)",
    codeBg: "#3d4439",
    codeText: "#f7f4ec",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article strong {
  color: #7f8e70;
}`
  },
  morandiClay: {
    accent: "#b58f7a",
    bg: "#fffdfb",
    ink: "#3b302b",
    muted: "#7f716a",
    soft: "#f6efeb",
    line: "#eadbd2",
    banner: "linear-gradient(135deg, #ffffff 0%, #f8f2ee 56%, #f0e3db 100%)",
    codeBg: "#473934",
    codeText: "#fbf4ee",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article blockquote {
  background: #faf3ef;
}`
  },
  morandiInk: {
    accent: "#6f7f8d",
    bg: "#fefefe",
    ink: "#252b31",
    muted: "#6b7280",
    soft: "#f0f2f4",
    line: "#dce1e5",
    banner: "linear-gradient(135deg, #ffffff 0%, #f4f5f6 58%, #e9ecef 100%)",
    codeBg: "#2e343b",
    codeText: "#f3f4f6",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article h1 {
  color: #20262c;
}`
  },
  limeGreen: {
    accent: "#6ECC54",
    bg: "#fcfffb",
    ink: "#2a3328",
    muted: "#7a8578",
    soft: "#f0f7ef",
    line: "#dce6db",
    banner: "linear-gradient(135deg, #ffffff 0%, #f4fbf3 56%, #e7f5e5 100%)",
    codeBg: "#323b30",
    codeText: "#f4f7f3",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article strong {
  color: #5eb047;
}`
  },
  hermesOrange: {
    accent: "#EB5C20",
    bg: "#fffdfc",
    ink: "#332724",
    muted: "#857470",
    soft: "#f7efec",
    line: "#e6d6d1",
    banner: "linear-gradient(135deg, #ffffff 0%, #fcf3f0 56%, #f7e4dd 100%)",
    codeBg: "#3b2c28",
    codeText: "#fcf5f3",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article h1 i {
  background: linear-gradient(90deg, #EB5C20, #f58451);
}`
  },
  titianRed: {
    accent: "#D34947",
    bg: "#fffcfc",
    ink: "#332626",
    muted: "#857171",
    soft: "#f7eeee",
    line: "#e6d3d3",
    banner: "linear-gradient(135deg, #ffffff 0%, #fcf0f0 56%, #f5e1e1 100%)",
    codeBg: "#3b2929",
    codeText: "#fcf3f3",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article blockquote {
  border-left-color: #D34947;
  background: #fff5f5;
}`
  },
  marrsGreen: {
    accent: "#018B8D",
    bg: "#fcfdfd",
    ink: "#233333",
    muted: "#6e8282",
    soft: "#edf5f5",
    line: "#d5e3e3",
    banner: "linear-gradient(135deg, #ffffff 0%, #f2f8f8 56%, #e3f0f0 100%)",
    codeBg: "#2b3d3d",
    codeText: "#f2f7f7",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article h2 b {
  border-color: #018B8D;
  color: #018B8D;
  background: #f0f7f7;
}`
  },
  kleinBlue: {
    accent: "#002FA7",
    bg: "#fcfcfd",
    ink: "#1a202c",
    muted: "#64748b",
    soft: "#f1f5f9",
    line: "#e2e8f0",
    banner: "linear-gradient(135deg, #ffffff 0%, #f0f4f8 56%, #e1eaf2 100%)",
    codeBg: "#1e293b",
    codeText: "#f8fafc",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article a {
  border-bottom-color: #002FA7;
}`
  },
  veryPeri: {
    accent: "#6667AB",
    bg: "#fefeff",
    ink: "#292938",
    muted: "#7a7a93",
    soft: "#f5f5fa",
    line: "#e8e8f2",
    banner: "linear-gradient(135deg, #ffffff 0%, #f7f7fc 56%, #ececf6 100%)",
    codeBg: "#2d2d42",
    codeText: "#f5f5fa",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article h1 span {
  color: #535496;
}`
  },
  obsidianBlack: {
    accent: "#111111",
    bg: "#ffffff",
    ink: "#1f1f1f",
    muted: "#767676",
    soft: "#f5f5f5",
    line: "#eaeaea",
    banner: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 56%, #f0f0f0 100%)",
    codeBg: "#171717",
    codeText: "#ffffff",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article blockquote {
  background: #fafafa;
  border-left-color: #111111;
}`
  },
  sunsetYellow: {
    accent: "#F59E0B",
    bg: "#fffdfa",
    ink: "#332a1f",
    muted: "#857462",
    soft: "#fff8f0",
    line: "#f0e4d8",
    banner: "linear-gradient(135deg, #ffffff 0%, #fffbf5 56%, #ffebd6 100%)",
    codeBg: "#382a1c",
    codeText: "#fcfaf8",
    font: '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, Menlo, monospace',
    css: `.wechat-article strong {
  color: #d97706;
}`
  }
};

const defaultCustomCss = themePresets.morandiMist.css;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  let text = escapeHtml(value);
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure><img src="$2" alt="$1"><figcaption>$1</figcaption></figure>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return text;
}

function renderTable(lines, index) {
  const header = lines[index].split("|").slice(1, -1).map((cell) => cell.trim());
  const separator = lines[index + 1] || "";
  if (!/^\s*\|?[\s:-]+\|[\s|:-]+\|?\s*$/.test(separator)) return null;

  const rows = [];
  let cursor = index + 2;
  while (cursor < lines.length && /^\s*\|.*\|\s*$/.test(lines[cursor])) {
    rows.push(lines[cursor].split("|").slice(1, -1).map((cell) => cell.trim()));
    cursor += 1;
  }

  const thead = `<thead><tr>${header.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return { html: `<table>${thead}${tbody}</table>`, next: cursor };
}

function renderCallout(lines, index) {
  const start = lines[index].match(/^:::(\w+)?\s*(.*)$/);
  if (!start) return null;

  const type = start[1] || "note";
  const title = start[2] || (type === "cool" ? "AI is cool." : "提示");
  const body = [];
  let cursor = index + 1;

  while (cursor < lines.length && !/^:::\s*$/.test(lines[cursor])) {
    body.push(lines[cursor]);
    cursor += 1;
  }

  if (type === "card" || type === "latepost" || type === "quote-card") {
    const author = title || "核心观点";
    const quoteHtml = body.map(l => inlineMarkdown(l.trim())).join("<br>");
    return {
      html: `<section class="latepost-card" style="background-color: rgb(242, 243, 243); padding: 20px; margin: 24px 0; text-align: justify; box-sizing: border-box;"><div class="latepost-card-author" style="font-size: 14px; margin: 0 0 10px; color: #000000; font-weight: 700;"><strong>${escapeHtml(author)}</strong></div><div class="latepost-card-divider" style="background-color: rgb(238, 0, 0); height: 1px; margin: 10px 0 16px; line-height: 0;"></div><div class="latepost-card-quote" style="font-size: 14px; line-height: 1.75; color: #111111;">${quoteHtml}</div></section>`,
      next: cursor + 1
    };
  }

  if (type === "byline" || type === "author") {
    const author = title || body.join(" ");
    return {
      html: `<section class="latepost-byline" style="text-align: right; font-size: 13px; margin: 40px 0; color: #000000; font-weight: 700;"><strong>文<span class="latepost-byline-bar" style="color: rgb(238, 0, 0); margin: 0 2px; font-weight: 700;">丨</span>${inlineMarkdown(author)}</strong></section>`,
      next: cursor + 1
    };
  }

  if (type === "ref" || type === "reference") {
    const paras = [];
    let currentPara = [];
    for (const line of body) {
      if (!line.trim()) {
        if (currentPara.length > 0) {
          paras.push(`<p>${currentPara.join("<br>")}</p>`);
          currentPara = [];
        }
      } else {
        currentPara.push(inlineMarkdown(line.trim()));
      }
    }
    if (currentPara.length > 0) {
      paras.push(`<p>${currentPara.join("<br>")}</p>`);
    }

    return {
      html: `<section class="reference-block">${paras.join("")}</section>`,
      next: cursor + 1
    };
  }

  return {
    html: `<section class="callout callout-${escapeHtml(type)}"><strong>${inlineMarkdown(title)}</strong><p>${inlineMarkdown(body.join(" "))}</p></section>`,
    next: cursor + 1
  };
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const callout = renderCallout(lines, i);
    if (callout) {
      html.push(callout.html);
      i = callout.next;
      continue;
    }

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const code = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      const rawCode = code.join("\n");
      let highlighted = escapeHtml(rawCode);
      if (lang && window.hljs && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(rawCode, { language: lang }).value;
      }
      const label = lang.toUpperCase() || "CODE";
      html.push(`<section class="code-card"><div class="code-mac-header"><span></span><span></span><span></span></div><div class="code-label">${escapeHtml(label)}</div><pre><code class="hljs ${lang ? 'language-'+escapeHtml(lang) : ''}">${highlighted}</code></pre></section>`);
      continue;
    }

    const table = renderTable(lines, i);
    if (table) {
      html.push(table.html);
      i = table.next;
      continue;
    }

    if (/^\s*(?:-\s*FIN\s*-|---\s*FIN\s*---|--\s*FIN\s*--)\s*$/i.test(line)) {
      html.push('<section class="latepost-fin" style="text-align: center; margin: 45px 0 30px; font-size: 12px; line-height: 1.2;"><strong style="color: #1d1d1d; font-weight: 700;"><span style="color: rgb(238, 0, 0); margin-right: 4px; font-weight: 700;">-</span>FIN<span style="color: rgb(238, 0, 0); margin-left: 4px; font-weight: 700;">-</span></strong></section>');
      i += 1;
      continue;
    }

    const bylineMatch = line.match(/^\s*(?:文丨|文\|)\s*(.+)$/);
    if (bylineMatch) {
      html.push(`<section class="latepost-byline" style="text-align: right; font-size: 13px; margin: 40px 0; color: #000000; font-weight: 700;"><strong>文<span class="latepost-byline-bar" style="color: rgb(238, 0, 0); margin: 0 2px; font-weight: 700;">丨</span>${inlineMarkdown(bylineMatch[1].trim())}</strong></section>`);
      i += 1;
      continue;
    }

    const creditMatch = line.match(/^\s*(?:题图来源|图源)[：:]\s*(.+)$/);
    if (creditMatch) {
      html.push(`<p class="latepost-credit" style="color: rgb(115, 115, 115); font-size: 13px; margin: 8px 0 20px; line-height: 1.4; letter-spacing: 0;">${escapeHtml(line.trim())}</p>`);
      i += 1;
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      html.push("<hr>");
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const title = inlineMarkdown(heading[2].trim());
      const isLatepost = themePreset.value === "latepost";
      if (level === 1) {
        html.push(isLatepost ? `<h1><span>${title}</span></h1>` : `<h1><span>${title}</span><i></i></h1>`);
      } else if (level === 2) {
        html.push(isLatepost ? `<h2><span>${title}</span></h2>` : `<h2><b>AI</b><span>${title}</span></h2>`);
      } else if (level === 3) {
        html.push(isLatepost ? `<h3><span>${title}</span></h3>` : `<h3><b></b><span>${title}</span></h3>`);
      } else {
        html.push(`<h${level}>${title}</h${level}>`);
      }
      i += 1;
      continue;
    }

    const qMatch = line.match(/^(?:(?:\*\*晚点[：:]\*\*|晚点[：:]|\*\*Q[：:]\*\*|Q[：:]|问[：:])\s*)(.+)$/);
    if (qMatch) {
      html.push(`<p class="latepost-q" style="margin: 16px 0; line-height: 1.75; letter-spacing: 0.8px; text-align: justify;"><strong class="latepost-tag" style="background-color: #ee0000; color: #ffffff; padding: 1px 4px; margin-right: 5px; font-size: 14px; font-weight: 700; border-radius: 2px; display: inline-block; vertical-align: baseline; line-height: 1.2;">晚点</strong><strong style="font-weight: 700; color: #000000;">：${inlineMarkdown(qMatch[1].trim())}</strong></p>`);
      i += 1;
      continue;
    }

    const aMatch = line.match(/^(\*\*([^\*]+)[：:]\*\*|([^：:\s]{2,8})[：:])\s*(.+)$/);
    if (aMatch && !line.startsWith("http") && !/^\d+\./.test(line)) {
      const speaker = aMatch[2] || aMatch[3];
      const speech = aMatch[4];
      html.push(`<p class="latepost-a" style="margin: 16px 0; line-height: 1.75; letter-spacing: 0.8px; text-align: justify;"><strong class="latepost-speaker" style="font-weight: 700; color: #000000;">${escapeHtml(speaker)}</strong>：${inlineMarkdown(speech.trim())}</p>`);
      i += 1;
      continue;
    }

    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = Array.from(line.matchAll(imageRegex));
    if (matches.length > 0) {
      const remaining = line.replace(imageRegex, '').trim();
      if (remaining === '') {
        if (matches.length === 1) {
          const caption = escapeHtml(matches[0][1]);
          const src = escapeHtml(matches[0][2]);
          html.push(`<figure><img src="${src}" alt="${caption}">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`);
        } else {
          const figures = matches.map(m => {
            const caption = escapeHtml(m[1]);
            const src = escapeHtml(m[2]);
            return `<figure><img src="${src}" alt="${caption}">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
          }).join('');
          html.push(`<div class="image-grid">${figures}</div>`);
        }
        i += 1;
        continue;
      }
    }

    if (/^>\s?/.test(line)) {
      const quotes = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quotes.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      html.push(`<blockquote>${quotes.map(inlineMarkdown).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^:::\w?/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*---+\s*$/.test(lines[i]) &&
      !/^\s*(?:-\s*FIN\s*-|---\s*FIN\s*---|--\s*FIN\s*--)\s*$/i.test(lines[i]) &&
      !/^\s*(?:文丨|文\|)\s*/.test(lines[i]) &&
      !/^\s*(?:题图来源|图源)[：:]/.test(lines[i]) &&
      !/^(?:(?:\*\*晚点[：:]\*\*|晚点[：:]|\*\*Q[：:]\*\*|Q[：:]|问[：:])\s*)/.test(lines[i]) &&
      !/^(\*\*([^\*]+)[：:]\*\*|([^：:\s]{2,8})[：:])\s*/.test(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function getPreset() {
  return themePresets[themePreset.value] || themePresets.latepost || themePresets.morandiMist;
}

function renderArticle(markdown) {
  const name = escapeHtml(brandName.value || "AI is cool.");
  const note = escapeHtml(bannerNote.value || "LOCAL NOTE");
  const tagline = escapeHtml(brandTagline.value || "关于 AI、工具与更好工作的冷静观察。");
  const body = renderMarkdown(markdown);

  if ((layoutStyle && layoutStyle.value === "minimal") || themePreset.value === "latepost") {
    return `<section class="article-body">${body}</section>`;
  }

  return `
<section class="brand-banner">
  <section class="banner-top">
    <span style="font-weight: 900; -webkit-text-stroke: 0.5px currentColor;">${name}</span>
    <em>${note}</em>
  </section>
  <section class="banner-title" style="font-weight: 900; -webkit-text-stroke: 1.2px currentColor;">${name}</section>
  <p>${tagline}</p>
  <section class="banner-tags">
    <span>AI</span>
    <span>Tools</span>
    <span>Better Work</span>
  </section>
</section>
<section class="article-body">
${body}
</section>
<section class="brand-footer">
  <p>本文来自 <strong>${name}</strong></p>
  <p>Keep thinking. Stay cool.</p>
</section>`;
}

function buildThemeCss() {
  const preset = getPreset();
  const accent = accentColor.value;
  const size = `${fontSize.value}px`;
  const lh = lineHeight.value;

  return `
.wechat-article {
  --wechat-accent: ${accent};
  --wechat-bg: ${preset.bg};
  --wechat-ink: ${preset.ink};
  --wechat-muted: ${preset.muted};
  --wechat-soft: ${preset.soft};
  --wechat-line: ${preset.line};
  --wechat-banner: ${preset.banner};
  --wechat-code-bg: ${preset.codeBg};
  --wechat-code-text: ${preset.codeText};
  --wechat-font: ${preset.font};
  --wechat-mono: ${preset.mono};
  box-sizing: border-box;
  background: var(--wechat-bg);
  color: var(--wechat-ink);
  font-family: var(--wechat-font);
  font-size: ${size};
  line-height: ${lh};
  letter-spacing: 0;
  word-break: break-word;
}
.wechat-article * {
  box-sizing: border-box;
}
.brand-banner {
  margin: 0 0 28px;
  padding: 24px 16px 22px;
  border-bottom: 1px solid var(--wechat-line);
  background: var(--wechat-banner);
}
.banner-top {
  display: block;
  margin: 0 0 18px;
}
.banner-top span {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid var(--wechat-accent);
  border-radius: 999px;
  color: var(--wechat-accent);
  font-size: 13px;
  line-height: 1.2;
  font-weight: 900;
  -webkit-text-stroke: 0.5px currentColor;
}
.banner-top em {
  display: block;
  margin-top: 8px;
  color: var(--wechat-muted);
  font-size: 11px;
  line-height: 1.2;
  font-style: normal;
  letter-spacing: 0;
}
.banner-title {
  margin: 0 0 10px;
  color: var(--wechat-ink);
  font-size: 31px;
  line-height: 1.12;
  font-weight: 900;
  -webkit-text-stroke: 1.2px currentColor;
}
.brand-banner p {
  margin: 0;
  color: var(--wechat-muted);
  font-size: 14px;
  line-height: 1.75;
}
.banner-tags {
  display: block;
  margin: 18px 0 0;
}
.banner-tags span {
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ffffff;
  color: var(--wechat-accent);
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
}
.article-body {
  padding: 0 4px 10px;
}
.wechat-article h1 {
  margin: 0 0 24px;
  color: var(--wechat-ink);
  font-size: 25px;
  line-height: 1.38;
  font-weight: 800;
}
.wechat-article h1 span {
  display: block;
}
.wechat-article h1 i {
  display: block;
  width: 56px;
  height: 4px;
  margin-top: 14px;
  border-radius: 99px;
  background: var(--wechat-accent);
  font-style: normal;
}
.wechat-article h2 {
  display: block;
  margin: 36px 0 16px;
  padding: 0;
  color: var(--wechat-ink);
  font-size: 20px;
  line-height: 1.45;
  font-weight: 800;
}
.wechat-article h2 b {
  display: inline-block;
  margin: 0 8px 0 0;
  padding: 2px 7px;
  border: 1px solid var(--wechat-accent);
  border-radius: 999px;
  color: var(--wechat-accent);
  font-size: 11px;
  line-height: 1.35;
  font-weight: 900;
}
.wechat-article h2 span {
  display: inline;
}
.wechat-article h3 {
  display: block;
  margin: 28px 0 12px;
  color: var(--wechat-ink);
  font-size: 18px;
  line-height: 1.45;
  font-weight: 800;
}
.wechat-article h3 b {
  display: inline-block;
  margin: 0 8px 0 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--wechat-accent);
}
.wechat-article h3 span {
  display: inline;
}
.wechat-article h4,
.wechat-article h5,
.wechat-article h6 {
  margin: 22px 0 10px;
  color: var(--wechat-ink);
}
.wechat-article p {
  margin: 17px 0;
  text-align: justify;
}
.wechat-article strong {
  color: var(--wechat-accent);
  font-weight: 800;
}
.wechat-article em {
  color: var(--wechat-muted);
}
.wechat-article a {
  color: var(--wechat-accent);
  text-decoration: none;
  border-bottom: 1px solid rgba(18, 179, 168, 0.35);
}
.wechat-article blockquote {
  margin: 20px 0;
  padding: 14px 16px;
  border-left: 4px solid var(--wechat-accent);
  border-radius: 0 8px 8px 0;
  color: var(--wechat-muted);
  background: var(--wechat-soft);
}
.wechat-article ul,
.wechat-article ol {
  margin: 16px 0;
  padding-left: 1.35em;
}
.wechat-article li {
  margin: 8px 0;
  padding-left: 2px;
}
.wechat-article code {
  padding: 2px 6px;
  border-radius: 5px;
  color: var(--wechat-accent);
  background: var(--wechat-soft);
  font-family: var(--wechat-mono);
  font-size: 0.92em;
}
.code-card {
  margin: 22px 0;
  border-radius: 8px;
  background: var(--wechat-code-bg);
  color: var(--wechat-code-text);
  overflow: hidden;
}
.code-label {
  display: block;
  padding: 12px 15px 0;
  color: var(--wechat-accent);
  font-size: 11px;
  line-height: 1.2;
  font-weight: 800;
}
.wechat-article pre {
  margin: 0;
  padding: 12px 15px 16px;
  overflow: auto;
  background: transparent;
  color: inherit;
}
.wechat-article pre code {
  padding: 0;
  color: inherit;
  background: transparent;
  font-size: 13px;
  line-height: 1.7;
}
.wechat-article table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
  font-size: 14px;
}
.wechat-article th,
.wechat-article td {
  border: 1px solid #e4e7ec;
  padding: 10px;
  text-align: left;
}
.wechat-article th {
  background: var(--wechat-soft);
  color: var(--wechat-ink);
  font-weight: 800;
}
.wechat-article figure {
  margin: 22px 0;
}
.wechat-article img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 8px;
}
.wechat-article figcaption {
  margin-top: 9px;
  text-align: center;
  color: var(--wechat-muted);
  font-size: 13px;
}
.wechat-article hr {
  height: 1px;
  margin: 30px 0;
  border: 0;
  background: #e5e7eb;
}
.callout {
  margin: 22px 0;
  padding: 16px;
  border: 1px solid var(--wechat-line);
  border-radius: 8px;
  background: var(--wechat-soft);
}
.callout strong {
  display: block;
  margin-bottom: 8px;
  color: var(--wechat-accent);
  font-size: 15px;
}
.callout p {
  margin: 0;
}
.reference-block {
  margin: 22px 0;
  padding: 18px 20px;
  border-radius: 12px;
  background: var(--wechat-soft);
  color: var(--wechat-muted);
  font-family: "KaiTi", "Kaiti SC", STKaiti, "BiauKai", serif;
  font-size: 0.85em;
  line-height: 1.65;
}
.reference-block p {
  margin: 0 0 10px !important;
  text-align: left !important;
}
.reference-block p:last-child {
  margin-bottom: 0 !important;
}
.brand-footer {
  margin: 30px 16px 0;
  padding: 20px 0 26px;
  border-top: 1px solid var(--wechat-line);
  color: var(--wechat-muted);
  text-align: center;
  font-size: 13px;
}
.brand-footer p {
  margin: 6px 0;
}
/* 晚点组件通用样式 */
.latepost-q {
  margin: 16px 0;
  line-height: 1.75;
  letter-spacing: 0.8px;
  text-align: justify;
}
.latepost-tag {
  background-color: #ee0000;
  color: #ffffff;
  padding: 1px 4px;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 2px;
  display: inline-block;
  vertical-align: baseline;
  line-height: 1.2;
}
.latepost-a {
  margin: 16px 0;
  line-height: 1.75;
  letter-spacing: 0.8px;
  text-align: justify;
}
.latepost-speaker {
  font-weight: 700;
  color: #000000;
}
.latepost-card {
  background-color: rgb(242, 243, 243);
  padding: 20px;
  margin: 24px 0;
  text-align: justify;
  box-sizing: border-box;
}
.latepost-card-author {
  font-size: 14px;
  margin: 0 0 10px;
  color: #000000;
  font-weight: 700;
}
.latepost-card-divider {
  background-color: rgb(238, 0, 0);
  height: 1px;
  margin: 10px 0 16px;
  line-height: 0;
}
.latepost-card-quote {
  font-size: 14px;
  line-height: 1.75;
  color: #111111;
}
.latepost-byline {
  text-align: right;
  font-size: 13px;
  margin: 40px 0;
  color: #000000;
  font-weight: 700;
}
.latepost-byline-bar {
  color: rgb(238, 0, 0);
  margin: 0 2px;
  font-weight: 700;
}
.latepost-fin {
  text-align: center;
  margin: 45px 0 30px;
  font-size: 12px;
  line-height: 1.2;
}
.latepost-fin span {
  color: rgb(238, 0, 0);
  font-weight: 700;
}
.latepost-fin strong {
  color: #1d1d1d;
  font-weight: 700;
}
.latepost-credit {
  color: rgb(115, 115, 115);
  font-size: 13px;
  margin: 8px 0 20px;
  line-height: 1.4;
  letter-spacing: 0;
}
${preset.css}
${customCssInput.value}
`;
}

function updatePreview() {
  const markdown = markdownInput.value;
  preview.innerHTML = renderArticle(markdown);
  articleTheme.textContent = buildThemeCss();
  document.documentElement.style.setProperty("--accent", accentColor.value);
  stats.textContent = `${markdown.replace(/\s+/g, "").length} 字`;
  localStorage.setItem("wechat-md-content", markdown);
  localStorage.setItem("wechat-md-css", customCssInput.value);
  localStorage.setItem("wechat-md-accent", accentColor.value);
  localStorage.setItem("wechat-md-font-size", fontSize.value);
  localStorage.setItem("wechat-md-line-height", lineHeight.value);
  localStorage.setItem("wechat-md-preset", themePreset.value);
  localStorage.setItem("wechat-md-layout", layoutStyle ? layoutStyle.value : "brand");
  localStorage.setItem("wechat-md-brand", brandName.value);
  localStorage.setItem("wechat-md-note", bannerNote.value);
  localStorage.setItem("wechat-md-tagline", brandTagline.value);

  const drafts = getDrafts();
  const existingIndex = drafts.findIndex(d => d.id === currentDraftId);
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : (markdown.slice(0, 20).replace(/\n/g, ' ') || "空草稿");
  const draftObj = { id: currentDraftId, title, content: markdown, updatedAt: Date.now() };
  if (existingIndex >= 0) drafts[existingIndex] = draftObj;
  else drafts.push(draftObj);
  saveDrafts(drafts);
  clearTimeout(updatePreview.renderTimer);
  updatePreview.renderTimer = setTimeout(renderDrafts, 1000);
}

const essentialProperties = [
  "display", "box-sizing", "margin", "padding",
  "background-color", "color", "font-family", "font-size", "font-weight",
  "font-style", "line-height", "letter-spacing", "text-align", "text-decoration",
  "vertical-align", "white-space", "word-break", "border", "border-top",
  "border-right", "border-bottom", "border-left", "border-radius"
];

function inlineStyles(source, target) {
  if (source.nodeType !== Node.ELEMENT_NODE || target.nodeType !== Node.ELEMENT_NODE) return;
  const computed = getComputedStyle(source);
  
  const stylesArr = [];
  const tag = source.tagName.toLowerCase();

  for (const prop of essentialProperties) {
    const val = computed.getPropertyValue(prop);
    if (!val || val === "normal" || val === "auto" || val === "none") continue;
    
    // 过滤透明背景
    if (prop === "background-color" && (val === "rgba(0, 0, 0, 0)" || val === "transparent")) continue;
    // 过滤无边框
    if (prop.startsWith("border") && (val.includes("none") || val.startsWith("0px"))) continue;
    // 过滤无内外边距
    if ((prop === "margin" || prop === "padding") && (val === "0px" || val === "0px 0px 0px 0px")) continue;

    // 清理 font-family 中的双引号，防止 HTML 属性引号破损
    if (prop === "font-family") {
      stylesArr.push(`${prop}:${val.replace(/"/g, "'")}`);
      continue;
    }

    stylesArr.push(`${prop}:${val}`);
  }

  // 微信专用增强：保证图片和表格自适应
  if (tag === "img") {
    stylesArr.push("max-width:100%", "height:auto", "display:block", "margin:12px auto");
  } else if (tag === "table") {
    stylesArr.push("width:100%", "border-collapse:collapse");
  } else if (tag === "p") {
    stylesArr.push("box-sizing:border-box", "text-align:justify");
  }

  // 合并原有的 inline style（如果已经有特设的内联样式）
  const existingStyle = target.getAttribute("style");
  if (existingStyle) {
    stylesArr.push(existingStyle);
  }

  target.setAttribute("style", stylesArr.join(";"));

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);
  sourceChildren.forEach((child, index) => {
    if (targetChildren[index]) {
      inlineStyles(child, targetChildren[index]);
    }
  });
}

function getInlineHtml() {
  const preset = getPreset();
  const rootSection = document.createElement("section");
  rootSection.className = "wechat-article-container";

  // 1. 获取预览容器自身的全局计算样式，直接内联到顶层根容器，彻底防止微信后台剥除样式
  const computedRoot = getComputedStyle(preview);
  const isLatepost = themePreset.value === "latepost";
  
  const rootStyles = [
    "box-sizing: border-box",
    `font-family: ${preset.font.replace(/"/g, "'")}`,
    `font-size: ${fontSize.value}px`,
    `line-height: ${lineHeight.value}`,
    `letter-spacing: ${isLatepost ? "0.8px" : "0px"}`,
    `color: ${computedRoot.color || preset.ink}`,
    `background-color: ${computedRoot.backgroundColor !== "rgba(0, 0, 0, 0)" ? computedRoot.backgroundColor : "#ffffff"}`,
    "text-align: justify",
    "word-break: break-word",
    "padding: 0px 4px",
    "margin: 0px auto",
    "width: 100%"
  ].join(";");
  rootSection.setAttribute("style", rootStyles);

  // 2. 遍历克隆并内联每个子元素
  Array.from(preview.children).forEach((child) => {
    const clone = child.cloneNode(true);
    inlineStyles(child, clone);
    rootSection.appendChild(clone);
  });

  return rootSection.outerHTML;
}

function setStatus(message) {
  copyStatus.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    copyStatus.textContent = "准备就绪";
  }, 2200);
}

async function copyRichText() {
  const phoneShell = document.querySelector(".phone-shell");
  const isDark = phoneShell.classList.contains("dark-preview");
  if (isDark) phoneShell.classList.remove("dark-preview");

  const html = getInlineHtml();
  const plain = preview.innerText;

  if (isDark) phoneShell.classList.add("dark-preview");

  let copied = false;

  // 1. 优先使用原生 copy 事件 (对微信公众号后台富文本粘贴支持度最好，100%保留内联格式)
  try {
    const copyHandler = (e) => {
      e.clipboardData.setData("text/html", html);
      e.clipboardData.setData("text/plain", plain);
      e.preventDefault();
    };
    document.addEventListener("copy", copyHandler);
    copied = document.execCommand("copy");
    document.removeEventListener("copy", copyHandler);
  } catch (e) {
    console.warn("execCommand copy failed, trying navigator.clipboard...", e);
  }

  // 2. 如果 execCommand 没生效，使用现代 Clipboard API
  if (!copied && navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" })
        })
      ]);
      copied = true;
    } catch (e) {
      console.warn("ClipboardItem write failed, using DOM fallback...", e);
    }
  }

  // 3. 兜底方案
  if (!copied) {
    fallbackCopy(html);
  }

  setStatus("已成功复制完整样式（可直接粘贴到公众号后台）");
}

function fallbackCopy(html) {
  const box = document.createElement("div");
  box.contentEditable = "true";
  box.style.position = "fixed";
  box.style.left = "-9999px";
  box.innerHTML = html;
  document.body.appendChild(box);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  box.remove();
}

function exportHtml() {
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(brandName.value)} 文章</title>
</head>
<body>
${getInlineHtml()}
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wechat-article.html";
  link.click();
  URL.revokeObjectURL(link.href);
}

function applyPreset(presetName) {
  const preset = themePresets[presetName] || themePresets.latepost || themePresets.morandiMist;
  accentColor.value = preset.accent;
  customCssInput.value = preset.css;
  if (presetName === "latepost") {
    fontSize.value = "15";
    lineHeight.value = "1.75";
    if (layoutStyle) layoutStyle.value = "minimal";
  }
}

function loadSavedState() {
  const savedPreset = localStorage.getItem("wechat-md-preset");
  const hasKnownPreset = Boolean(savedPreset && themePresets[savedPreset]);
  themePreset.value = hasKnownPreset ? savedPreset : "latepost";
  const preset = getPreset();
  if (layoutStyle) {
    layoutStyle.value = localStorage.getItem("wechat-md-layout") || (themePreset.value === "latepost" ? "minimal" : "brand");
  }
  markdownInput.value = localStorage.getItem("wechat-md-content") || (themePreset.value === "latepost" ? latepostSampleMarkdown : sampleMarkdown);
  customCssInput.value = hasKnownPreset ? (localStorage.getItem("wechat-md-css") || preset.css) : preset.css;
  accentColor.value = hasKnownPreset ? (localStorage.getItem("wechat-md-accent") || preset.accent) : preset.accent;
  fontSize.value = localStorage.getItem("wechat-md-font-size") || (themePreset.value === "latepost" ? "15" : "16");
  lineHeight.value = localStorage.getItem("wechat-md-line-height") || (themePreset.value === "latepost" ? "1.75" : "1.9");
  brandName.value = localStorage.getItem("wechat-md-brand") || "AI is cool.";
  bannerNote.value = localStorage.getItem("wechat-md-note") || "LOCAL NOTE";
  brandTagline.value = localStorage.getItem("wechat-md-tagline") || "关于 AI、工具与更好工作的冷静观察。";
  if (brandTagline.value === "Cool ideas about AI, tools, and better work.") {
    brandTagline.value = "关于 AI、工具与更好工作的冷静观察。";
  }
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    markdownInput.value = String(reader.result || "");
    updatePreview();
  };
  reader.readAsText(file, "utf-8");
});

themePreset.addEventListener("change", () => {
  applyPreset(themePreset.value);
  updatePreview();
});

const latepostTemplateButton = document.querySelector("#latepostTemplateButton");
if (latepostTemplateButton) {
  latepostTemplateButton.addEventListener("click", () => {
    themePreset.value = "latepost";
    applyPreset("latepost");
    markdownInput.value = latepostSampleMarkdown;
    updatePreview();
    setStatus("已载入《晚点》专访完整范例模版");
  });
}

document.querySelector("#copyButton").addEventListener("click", copyRichText);
document.querySelector("#exportButton").addEventListener("click", exportHtml);
document.querySelector("#resetCssButton").addEventListener("click", () => {
  themePreset.value = "latepost";
  applyPreset("latepost");
  brandName.value = "AI is cool.";
  brandTagline.value = "关于 AI、工具与更好工作的冷静观察。";
  fontSize.value = "15";
  lineHeight.value = "1.75";
  updatePreview();
});

[markdownInput, customCssInput, accentColor, fontSize, lineHeight, brandName, bannerNote, brandTagline, layoutStyle].forEach((node) => {
  if (node) node.addEventListener("input", updatePreview);
});

loadSavedState();
updatePreview();

// UI Interactivity
const phoneShell = document.querySelector(".phone-shell");

markdownInput.addEventListener("scroll", () => {
  const scrollPercentage = markdownInput.scrollTop / (markdownInput.scrollHeight - markdownInput.clientHeight);
  if (!isNaN(scrollPercentage)) {
    phoneShell.scrollTop = scrollPercentage * (phoneShell.scrollHeight - phoneShell.clientHeight);
  }
});

const darkModeToggle = document.querySelector("#darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    phoneShell.classList.toggle("dark-preview");
    if (phoneShell.classList.contains("dark-preview")) {
      darkModeToggle.textContent = "浅色预览";
    } else {
      darkModeToggle.textContent = "深色预览";
    }
  });
}

document.querySelectorAll(".editor-toolbar button[data-insert]").forEach(btn => {
  btn.addEventListener("click", () => {
    const template = btn.getAttribute("data-insert").replace(/\\n/g, '\n');
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const current = markdownInput.value;
    const selectedText = current.substring(start, end);

    let replacement = template;
    if (selectedText) {
      if (template.includes("**文本**")) {
        replacement = template.replace("文本", selectedText);
      } else if (template.includes("[链接描述]")) {
        replacement = template.replace("链接描述", selectedText);
      } else if (template.includes("引用文本")) {
        replacement = template.replace("引用文本", selectedText);
      } else if (template.includes("提示内容")) {
        replacement = template.replace("提示内容", selectedText);
      } else if (template.includes("参考文献内容")) {
        replacement = template.replace("参考文献内容", selectedText);
      }
    }

    markdownInput.value = current.substring(0, start) + replacement + current.substring(end);
    markdownInput.focus();
    markdownInput.selectionStart = markdownInput.selectionEnd = start + replacement.length;
    updatePreview();
  });
});

const formatPanguButton = document.querySelector("#formatPanguButton");
if (formatPanguButton) {
  formatPanguButton.addEventListener("click", () => {
    if (window.pangu) {
      const start = markdownInput.selectionStart;
      markdownInput.value = pangu.spacing(markdownInput.value);
      markdownInput.focus();
      markdownInput.selectionStart = markdownInput.selectionEnd = start;
      updatePreview();
    }
  });
}

const toggleDraftsButton = document.querySelector("#toggleDraftsButton");
const newDraftButton = document.querySelector("#newDraftButton");
const workspace = document.querySelector(".workspace");

if (toggleDraftsButton) {
  toggleDraftsButton.addEventListener("click", () => {
    workspace.classList.toggle("has-drawer");
  });
}
if (newDraftButton) {
  newDraftButton.addEventListener("click", () => {
    currentDraftId = Date.now().toString();
    localStorage.setItem("wechat-md-current-id", currentDraftId);
    markdownInput.value = "# 新文章\n\n开始写作...";
    updatePreview();
  });
}
