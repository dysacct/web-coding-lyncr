import { defineConfig } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'
import presetIcons from '@unocss/preset-icons'
import { transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['src/**/*.{vue,ts,js,tsx,jsx}'],
  },
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        carbon: () =>
          import('@iconify-json/carbon/icons.json').then((module) => module.default),
      },
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerVariantGroup()],
  theme: {
    animation: {
      keyframes: {
        'fade-in':
          '{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
      },
      durations: {
        200: '200ms',
      },
    },
  },
  shortcuts: {
    'animate-fade-in': 'animate-[fade-in] animate-duration-200',
    'glass-card': 'rounded-xl bg-zinc-900/50 backdrop-blur-xl border border-white/10',
    'glass-card-hover': 'glass-card hover:border-white/15 transition-colors',
    'glass-input':
      'bg-zinc-800/40 border border-white/5 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all',
    'glass-btn-primary':
      'bg-[#007aff] hover:bg-blue-500 active:bg-blue-600 text-white font-medium rounded-xl transition-all active:scale-[0.99]',
    'glass-btn-ghost':
      'bg-zinc-800/60 hover:bg-zinc-800 border border-white/5 text-blue-400 font-medium rounded-xl transition-all',
  },
})
