import katex from 'katex';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import 'katex/dist/katex.min.css';

export function toMarkdown(content: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}

export function renderLatex(text: string) {
  try {
    // 查找文本中的 LaTeX 代码（用 \( 和 \) 包裹）
    const latexRegex = /\\\((.*?)\\\)/g;
    return text.replace(latexRegex, (match, latex) => {
      // 使用 katex 渲染 LaTeX 代码
      return katex.renderToString(latex, { throwOnError: false });
    });
  }
  catch (error) {
    console.error('LaTeX 渲染出错:', error);
    return text;
  }
}
