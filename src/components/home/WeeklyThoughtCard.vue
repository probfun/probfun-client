<script setup lang="ts">
import renderMathInElement from 'katex/contrib/auto-render';
import { convertToHtml } from 'mammoth/mammoth.browser';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import { nextTick, onMounted, ref, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
  title: string;
  description?: string[];
  markdownUrl?: string; // e.g. /weekly-thoughts/2025-10-18.md under public
  docxUrl?: string; // e.g. /每周一思10.18.docx under public
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
  // Prefer DOCX if provided; fallback to Markdown, then description
  if (props.docxUrl) {
    const ok = await loadDocx();
    if (ok) {
      return;
    }
  }
  if (props.markdownUrl) {
    await loadMarkdown();
  }
}

onMounted(loadContent);
watch(() => [props.markdownUrl, props.docxUrl], loadContent);
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader class="p-4 pb-2">
      <CardTitle class="text-base">
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="px-4 pb-4 pt-0 space-y-3">
      <!-- Render Markdown when available -->
      <div v-if="html" ref="contentEl" class="prose prose-sm max-w-none dark:prose-invert prose-headings:mt-3 prose-p:my-2 prose-li:my-1">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="html" />
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
