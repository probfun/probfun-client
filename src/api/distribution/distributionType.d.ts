export interface NodeOptions {
  label: string
  position: { x: number, y: number }
  chineseTranslation: string
  pdf: string | null
  expId?: string
  description?: string
}
