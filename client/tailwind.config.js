/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🏛️ LUXURY INDIAN EDITORIAL LIGHT JOURNAL BASE (NEW)
        'journal-bg': '#fdfbf7',       // Rich warm ivory background
        'journal-surface': '#faf6f0',  // Structural panels, cards, and navbar
        'journal-text': '#1c1917',     // High-contrast deep stone charcoal for headings
        'journal-muted': '#44403c',    // Soft stone charcoal for body text

        // 🎨 TRADITIONAL INDIAN VIBRANT ACCENTS (NEW)
        'india-saffron': '#d97706',    // Festive Marigold / Saffron
        'india-terracotta': '#be123c', // Deep Sunset Crimson
        'india-emerald': '#047857',    // Palace Green

        // Retaining your original palettes so old code components don't break
        earth: {
          50: '#faf7f2', 100: '#f0e9d8', 200: '#dfd0b0', 300: '#c9b080',
          400: '#b38f55', 500: '#9a7340', 600: '#7d5c33', 700: '#63482a',
          800: '#4e3921', 900: '#3c2c1a',
        },
        forest: {
          50: '#f2f7f2', 100: '#ddeedd', 200: '#b8dcb8', 300: '#88c188',
          400: '#5a9f5a', 500: '#3d7d3d', 600: '#2e6330', 700: '#254f27',
          800: '#1d3d1f', 900: '#152e17',
        },
        stone: {
          50: '#fafaf9', 100: '#f5f4f0', 200: '#e8e5dc', 300: '#d5d0c2',
          400: '#b8b0a0', 500: '#9c9280', 600: '#7d7463', 700: '#635b4d',
          800: '#4a433a', 900: '#342f28',
        },
        amber: {
          DEFAULT: '#d97706',
          light: '#fbbf24',
          dark: '#92400e',
        },
        cream: '#fefce8',
        bark: '#5c3d1e',
        moss: '#4a7c59',
        sand: '#c2a56a',
        dusk: '#2c3e50',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        accent: ['"Josefin Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'texture': "url('/images/texture.png')",
        'earth-gradient': 'linear-gradient(135deg, #3d7d3d 0%, #5c3d1e 50%, #2c3e50 100%)',
        'warm-gradient': 'linear-gradient(135deg, #faf7f2 0%, #f0e9d8 100%)',
        'journal-gradient': 'linear-gradient(135deg, #fdfbf7 0%, #faf6f0 100%)', // Added luxury light gradient
      },
      boxShadow: {
        'earth': '0 4px 24px rgba(92, 61, 30, 0.18)',
        'forest': '0 4px 24px rgba(61, 125, 61, 0.18)',
        'card': '0 8px 40px rgba(44, 62, 80, 0.12)',
        'glow': '0 0 30px rgba(92, 61, 30, 0.3)',
        'journal-shadow': '0 4px 20px rgba(28, 25, 23, 0.05)', // Added clean subtle light shadow
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}