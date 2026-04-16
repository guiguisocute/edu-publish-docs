// https://vitepress.dev/guide/custom-theme
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'
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
    
    const initViewer = () => {
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
