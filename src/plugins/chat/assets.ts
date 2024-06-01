import 'katex/dist/katex.min.css'
import '@/styles/chatcss/lib/tailwind.css'
import '@/styles/chatcss/lib/highlight.less'
import '@/styles/chatcss/lib/github-markdown.less'
import '@/styles/chatcss/global.less'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

export function setupAssets() {
  naiveStyleOverride()
}
