import katex from 'katex';
import MarkdownIt from 'markdown-it';
import 'katex/dist/katex.css';
import 'katex/dist/katex.min.css';

// 在现有代码后添加 markdown 解析器配置
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// 自定义规则处理 LaTeX 公式
md.inline.ruler.before('text', 'latex', (state, silent) => {
  const start = state.pos;
  const max = state.posMax;

  // 块级公式: $$...$$
  if (start + 1 < max && state.src[start] === '$' && state.src[start + 1] === '$') {
    let pos = start + 2;
    while (pos < max - 1) {
      if (state.src[pos] === '$' && state.src[pos + 1] === '$' && state.src[pos - 1] !== '\\') {
        if (!silent) {
          const token = state.push('latex_block', '', 0);
          token.content = state.src.slice(start + 2, pos);
          token.markup = '$$';
          token.block = true;
        }
        state.pos = pos + 2;
        return true;
      }
      pos++;
    }
    return false;
  }

  // 块级公式: \[...\]
  if (start + 1 < max && state.src[start] === '\\' && state.src[start + 1] === '[') {
    let pos = start + 2;
    while (pos < max - 1) {
      if (state.src[pos] === '\\' && state.src[pos + 1] === ']') {
        if (!silent) {
          const token = state.push('latex_block', '', 0);
          token.content = state.src.slice(start + 2, pos);
          token.markup = '\\[\\]';
          token.block = true;
        }
        state.pos = pos + 2;
        return true;
      }
      pos++;
    }
    return false;
  }

  // 行内公式: $...$
  if (state.src[start] === '$' && !(start + 1 < max && state.src[start + 1] === '$')) {
    let pos = start + 1;
    while (pos < max) {
      if (state.src[pos] === '$' && state.src[pos - 1] !== '\\') {
        if (pos + 1 === max || state.src[pos + 1] !== '$') {
          if (!silent) {
            const token = state.push('latex_inline', '', 0);
            token.content = state.src.slice(start + 1, pos);
            token.markup = '$';
          }
          state.pos = pos + 1;
          return true;
        }
      }
      pos++;
    }
    return false;
  }

  return false;
});

// 渲染器
md.renderer.rules.latex_inline = (tokens, idx) => {
  try {
    return katex.renderToString(tokens[idx].content, {
      throwOnError: false,
      displayMode: false,
    });
  }
  catch (error) {
    console.error('Error rendering inline LaTeX:', error);
    return `<span style="color: red;">${tokens[idx].content}</span>`;
  }
};

md.renderer.rules.latex_block = (tokens, idx) => {
  try {
    return katex.renderToString(tokens[idx].content, {
      throwOnError: false,
      displayMode: true,
    });
  }
  catch (error) {
    console.error('Error rendering block LaTeX:', error);
    return `<div style="color: red;">${tokens[idx].content}</div>`;
  }
};

// 添加渲染函数
function renderMarkdown(text: string) {
  if (!text)
    return '';

  // 如果包含块级公式，使用 render
  if (/\$\$[\s\S]+?\$\$/.test(text)) {
    return md.render(text);
  }

  // 其它情况用 renderInline，避免最开始出现换行
  return md.renderInline(text);
}

export { renderMarkdown };
