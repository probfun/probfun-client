import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const visible = ref(false)
  const theme = ref<'dark' | 'light'>('light')
  const isManualThemeChange = ref<boolean>(false)

  function setTheme(mode: 'dark' | 'light') {
    theme.value = mode === 'dark' ? 'dark' : 'light'
  }

  function reset() {
    visible.value = false
  }

  return {
    visible,
    theme,
    isManualThemeChange,
    setTheme,
    reset,
  }
}, {
  persist: true,
})
