/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A0E1A',
          light: '#141929',
          dark: '#060810',
        },
        teal: {
          DEFAULT: '#00B7C7',
          light: '#00CED1',
          dark: '#009AA8',
          glow: 'rgba(0, 183, 199, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 183, 199, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 183, 199, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(10, 14, 26, 0.85) 0%, rgba(10, 14, 26, 0.6) 50%, rgba(0, 183, 199, 0.15) 100%)',
        'teal-gradient': 'linear-gradient(135deg, #00B7C7 0%, #00CED1 100%)',
      },
    },
  },
  plugins: [],
};
