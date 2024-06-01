import SvgIcon from '@/components/custom/svg-icon.vue'
import { h } from 'vue'
export const useIconRender = () => {
  interface IconConfig {
    icon?: string
    color?: string
    fontSize?: number
  }

  interface IconStyle {
    color?: string
    fontSize?: string
  }

  const iconRender = (config: IconConfig) => {
    const { color, fontSize, icon } = config

    const style: IconStyle = {}

    if (color)
      style.color = color

    if (fontSize)
      style.fontSize = `${fontSize}px`

    if (!icon)
      window.console.warn('iconRender: icon is required')

    return () => h(SvgIcon, { icon, style })
  }

  return {
    iconRender,
  }
}
