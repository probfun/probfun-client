<script setup lang="ts">
import renderMathInElement from 'katex/contrib/auto-render';
import { convertToHtml } from 'mammoth/mammoth.browser';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
  title: string;
  description?: string[];
  markdownUrl?: string; // e.g. /weekly-thoughts/2025-10-18.md under public
  docxUrl?: string; // e.g. /每周一思10.18.docx under public
  pdfUrl?: string; // e.g. /WeekQuiz.pdf under public
  // 预览模式（如首页卡片）：若为 true 且是 PDF，则不内嵌预览，仅显示“在新窗口打开”的链接
  previewOnly?: boolean;
}
const props = defineProps<Props>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});
md.use(markdownItKatex);

const html = ref<string>('');
const contentEl = ref<HTMLElement | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
// 控制 PDF 的挂载时机，避免在容器尺寸未稳定时渲染导致空白
const pdfReady = ref(false);
// 为 PDF 生成一次性地址，避免浏览器缓存造成的空白或不刷新问题
const pdfSrc = ref<string | null>(null);

// 预览模式下用于显示的简略文本（尽量多一些但不撑大卡片）
const previewText = computed(() => {
  const desc = (props.description && props.description.length) ? props.description.join(' ') : '';
  if (desc) {
    const prefix = props.title ? `${props.title}：` : '';
    return `${prefix}${desc}`;
  }
  return props.title || '';
});

async function loadMarkdown() {
  if (!props.markdownUrl) {
    return false;
  }
  try {
    loading.value = true;
    error.value = null;
    const res = await fetch(props.markdownUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    html.value = md.render(text);
    return true;
  }
  catch (e) {
    console.error('Failed to load weekly thought markdown:', e);
    error.value = '无法加载 Markdown 内容';
    html.value = '';
    return false;
  }
  finally {
    loading.value = false;
  }
}

async function loadDocx() {
  if (!props.docxUrl) {
    return false;
  }
  try {
    loading.value = true;
    error.value = null;
    const res = await fetch(props.docxUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const result = await convertToHtml({ arrayBuffer });
    // mammoth returns HTML string in result.value
    html.value = result.value;
    await nextTick();
    // Auto-render LaTeX inside the generated HTML if using DOCX source
    if (contentEl.value) {
      try {
        renderMathInElement(contentEl.value, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
        });
      }
      catch (err) {
        console.error('KaTeX auto-render failed:', err);
      }
    }
    return true;
  }
  catch (e) {
    console.error('Failed to load weekly thought DOCX:', e);
    error.value = '无法加载文档内容';
    html.value = '';
    return false;
  }
  finally {
    loading.value = false;
  }
}

async function loadContent() {
  html.value = '';
  error.value = null;
  // 每次准备切换内容时，先暂停 PDF 挂载，等待下一帧再恢复
  pdfReady.value = false;
  pdfSrc.value = null;
  // Prefer DOCX if provided; fallback to Markdown; PDF is embedded directly in template
  if (props.docxUrl) {
    const ok = await loadDocx();
    if (ok) {
      // 使用 DOCX 时，不需要 PDF
      pdfReady.value = false;
      pdfSrc.value = null;
      return;
    }
  }
  if (props.markdownUrl) {
    await loadMarkdown();
    pdfReady.value = false;
    pdfSrc.value = null;
    return;
  }
  // 若为 PDF，延迟到下一帧再允许挂载，确保容器已完成布局
  if (props.pdfUrl) {
    await nextTick();
    // 添加时间戳避免使用到失败的缓存或旧渲染
    pdfSrc.value = `${props.pdfUrl}?v=${Date.now()}`;
    setTimeout(() => {
      pdfReady.value = true;
    }, 0);
  }
}

onMounted(loadContent);
// 任何来源变化都触发重置（尤其是从 DOCX 切换到 PDF 时需要清空 html 才能走到 PDF 分支）
watch(() => [props.markdownUrl, props.docxUrl, props.pdfUrl], loadContent);
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader class="p-4 pb-2">
      <CardTitle class="text-base">
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="px-4 pb-4 pt-0 space-y-3">
      <!-- Render DOCX/Markdown when available -->
      <div v-if="html" ref="contentEl" class="prose prose-sm max-w-none dark:prose-invert prose-headings:mt-3 prose-p:my-2 prose-li:my-1">
        <!-- This section is intentionally left blank to avoid displaying code in the UI -->
        <div v-html="html" />
      </div>
      <!-- Render PDF embed when provided and no HTML content -->
      <div v-else-if="props.pdfUrl" class="w-full space-y-2">
        <div class="flex items-center justify-end gap-3 text-xs text-muted-foreground">
          <a :href="props.pdfUrl" target="_blank" rel="noopener" class="underline hover:text-foreground">在新窗口打开</a>
        </div>
        <template v-if="!props.previewOnly">
          <!-- 使用 <embed> 作为首选渲染，部分浏览器（如 iOS Safari）不支持内嵌，将显示上方链接 -->
          <embed
            v-if="pdfReady"
            :key="props.pdfUrl"
            :src="pdfSrc || props.pdfUrl"
            type="application/pdf"
            class="w-full h-[70vh] min-h-72 rounded-md border"
          >

          <!-- 备用：<object> 渲染方式 -->
          <object
            v-if="pdfReady"
            :key="`obj-${props.pdfUrl}`"
            :data="pdfSrc || props.pdfUrl"
            type="application/pdf"
            class="w-full h-[70vh] min-h-72 rounded-md border hidden"
          >
            <p class="text-sm text-muted-foreground p-2">
              无法内嵌预览 PDF，
              <a :href="props.pdfUrl" target="_blank" rel="noopener" class="underline">点此在新窗口打开</a>
            </p>
          </object>
        </template>
        <template v-else>
          <!-- 预览模式：不内嵌 PDF，保持卡片高度紧凑，简略展示更多文字，避免留白 -->
          <div class="space-y-1">
            <Label class="leading-relaxed font-normal text-muted-foreground line-clamp-4">
              {{ previewText }}
            </Label>
          </div>
        </template>
      </div>
      <div v-else-if="loading" class="text-sm text-muted-foreground">
        加载中…
      </div>
      <div v-else-if="error" class="text-sm text-red-500">
        {{ error }}
      </div>
      <!-- Fallback: description array -->
      <div v-else>
        <div v-for="(item, i) in description" :key="i">
          <Label class="leading-relaxed font-normal text-muted-foreground">{{ item }}</Label>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
@import 'katex/dist/katex.min.css';
</style>
