import { defineNuxtModule, addPlugin, createResolver, useLogger } from '@nuxt/kit'
import { addCustomTab } from '@nuxt/devtools-kit'
import type { AosOptions } from 'aos'
import { name, version } from '../package.json'

export type ModuleOptions = Partial<AosOptions>

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'aos',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  hooks: {},
  setup(options, nuxt) {
    const logger = useLogger('nuxt-aos')
    const resolver = createResolver(import.meta.url)

    logger.info('🚀 Setting up nuxt-aos')

    nuxt.options.runtimeConfig.public.aos = options || {}

    nuxt.options.build.transpile ||= []
    nuxt.options.build.transpile.push('aos')

    nuxt.options.alias['#aos'] = resolver.resolve('./runtime')

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'client',
    })

    // Ensure Vite optimizeDeps includes aos for faster dev startup
    nuxt.options.vite ||= {}
    nuxt.options.vite.optimizeDeps ||= { include: [] }
    nuxt.options.vite.optimizeDeps.include ||= []
    if (!nuxt.options.vite.optimizeDeps.include.includes('aos')) {
      nuxt.options.vite.optimizeDeps.include.push('aos')
    }

    addCustomTab(() => ({
      name,
      title: 'AOS Docs',
      icon: 'https://media.licdn.com/dms/image/D4D12AQEYCFvOjhb8rQ/article-cover_image-shrink_600_2000/0/1679941246531?e=2147483647&v=beta&t=A3azwRlUOpX_tBCILj49HMVojFrvGUZO8vC_yBi_dkQ',
      view: {
        type: 'iframe',
        src: 'https://michalsnik.github.io/aos/',
      },
    }))
  },
})
