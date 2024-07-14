import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import legacy from '@vitejs/plugin-legacy';
import postCssPxToRem from 'postcss-pxtorem';
// @ts-ignore
export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#4868c1', // 更改主题颜色
          'link-color': '#1890ff' // 更改链接颜色
          // 添加更多自定义变量...
        },
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          selectorBlackList: [],
          rootValue: 108, // 1rem的大小
          propList: ['*'] // 需要转换的属性，这里选择全部都进行转换
        }),
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()]
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', 'vuex']
    }),
    legacy({
      targets: ['Chrome 64'],
      renderModernChunks: false
    })
  ],
  build: {
    target: 'Chrome 64',
    rollupOptions: {
      output: {
        // 配置固定的文件名
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
    // cssCodeSplit: false
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    },
    exclude: [
      '@antv/x6',
      '@antv/x6-plugin-stencil',
      '@antv/x6-plugin-dnd',
      '@antv/x6-plugin-history',
      '@antv/x6-plugin-keyboard',
      '@antv/x6-plugin-selection',
      '@antv/x6-plugin-snapline',
      '@antv/x6-plugin-clipboard',
      '@antv/x6-plugin-keyboard'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@views': path.resolve(__dirname, 'src/views')
    },
    dedupe: ['vue']
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
});
