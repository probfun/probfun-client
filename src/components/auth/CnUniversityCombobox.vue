<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface University {
  name: string;
  province?: string;
  pinyin?: string;
  alias?: string;
  code?: string | number;
}

const props = withDefaults(defineProps<{
  modelValue?: string;
  options?: University[];
  src?: string;
  placeholder?: string;
  minChars?: number;
}>(), {
  modelValue: '',
  options: undefined,
  src: '',
  placeholder: '选择大学',
  minChars: 1,
});

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void; (e: 'select', v: University): void }>();

const query = ref('');
const data = ref<University[]>(props.options ?? []);
const open = ref(false);
const isLoading = ref(false);

const ready = computed(() => query.value.trim().length >= props.minChars);

watch(ready, async (ok) => {
  if (ok && !props.options && props.src && !data.value.length) {
    isLoading.value = true;
    try {
      const res = await fetch(props.src);
      if (res.ok) {
        const json = await res.json();
        data.value = (json as any[]).map(x => ({
          name: x.name || x.label || x.university || x.school || '',
          province: x.province || x.prov || x.region,
          pinyin: x.pinyin || x.py,
          alias: x.alias || x.short || x.abbr,
          code: x.code || x.id,
        })).filter(x => x.name);
      }
    }
    catch (e) {
      console.warn('fetch failed', e);
    }
    finally {
      isLoading.value = false;
    }
  }
});

const filtered = computed(() => {
  if (!ready.value)
    return [];
  const q = query.value.trim().toLowerCase();
  return data.value.filter((u) => {
    const fields = [u.name, u.pinyin, u.alias, u.province]
      .filter(Boolean)
      .map(s => String(s).toLowerCase());
    return fields.some(s => s.includes(q));
  });
});

function onSelect(u: University) {
  emit('update:modelValue', u.name);
  emit('select', u);
  query.value = u.name;
  open.value = false;
}

function handleClickOutside(e: MouseEvent) {
  const root = (e.target as HTMLElement).closest('.relative');
  if (!root)
    open.value = false;
}

onMounted(() => {
  query.value = props.modelValue || '';
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <Input
      id="universitySearch"
      v-model="query"
      :disabled="isLoading"
      type="text"
      :placeholder="placeholder"
      class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
      autocomplete="off"
      @focus="open = true"
    />
    <Label
      for="universitySearch"
      class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
      -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
    >
      {{ placeholder }}
    </Label>

    <div
      v-show="open"
      class="absolute z-50 mt-2 w-full max-h-[300px] overflow-auto rounded-xl border bg-background shadow"
      @mousedown.stop
    >
      <template v-if="ready && filtered.length">
        <div
          v-for="u in filtered"
          :key="u.code || u.name"
          class="px-3 py-2 cursor-pointer hover:bg-accent flex items-center gap-2"
          @mousedown.prevent="onSelect(u)"
        >
          <p class="truncate flex-1">
            {{ u.name }}
          </p>
          <span class="text-xs text-muted-foreground">{{ u.province }}</span>
        </div>
      </template>
      <template v-else-if="ready && !filtered.length">
        <div class="p-3 text-sm text-muted-foreground">
          未找到匹配的大学
        </div>
      </template>
      <template v-else>
        <div class="p-3 text-sm text-muted-foreground">
          请输入关键词搜索大学
        </div>
      </template>
    </div>
  </div>
</template>
