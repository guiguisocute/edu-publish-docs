// https://vitepress.dev/guide/custom-theme
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/style.css'
import './styles/custom-block.css'
import Layout from './components/Layout.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(Layout)
  },
  setup() {
    const route = useRoute()
    let viewer;
    
    const initViewer = async () => {
      if (!inBrowser) return
      
      // Dynamic import to avoid SSR errors
      const Viewer = (await import('viewerjs')).default
      await import('viewerjs/dist/viewer.min.css')

      if (viewer) {
        viewer.destroy()
      }
      const el = document.querySelector('.vp-doc')
      if (el) {
        viewer = new Viewer(el, {
          toolbar: true,
          navbar: true,
          title: true, // Display image alt text as title
        })
      }
    }
    
    onMounted(() => {
      initViewer()
    })
    watch(
      () => route.path,
      () => nextTick(() => initViewer())
    )
  }
}
