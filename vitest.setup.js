import { config } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import TDesignChat from '@tdesign-vue-next/chat' // 引入chat组件

config.global.plugins = [TDesign, TDesignChat]
