/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './static/js/**/*.js',
  ],
  theme: {
    extend: {
        colors: {
            'showroom-white': '#0E1015',
            'graphite-black': '#F4F5F7',
            'steel-grey': '#94A3B8',
            'chrome-silver': '#252A34',
            pearl: '#161922',
            'ignition-gold': '#D4AF37',
            'ignition-gold-light': '#F3C642',
            'nitro-cyan': '#00F0FF',
            'signal-emerald': '#10B981',
            'signal-amber': '#F59E0B',
            'signal-crimson': '#EF4444',
            obsidian: '#08090B',
            'obsidian-card': '#0F1116',
            'obsidian-elevated': '#161922',
            platinum: '#C9CDD3',
        },
        fontFamily: {
            display: ['Cabinet Grotesk', 'Syne', 'sans-serif'],
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        },
        boxShadow: {
            'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
            'nitro-glow': '0 0 25px rgba(0, 240, 255, 0.4)',
            'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        },
        fontSize: {
            'sm': '0.875rem',
            'base': '1rem',
            'xl': '1.25rem',
            '3xl': '1.75rem',
            '4xl': '2.5rem',
            '5xl': '3.5rem',
        },
    }
  },
  plugins: [],
}
