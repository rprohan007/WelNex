/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        copper: {
          50: '#FDF7F3',
          100: '#FAECE4',
          200: '#F4D6C6',
          300: '#ECB8A1',
          400: '#DC8E61',
          500: '#C16226', // Primary Accent
          600: '#A84E1A',
          700: '#8A3B12',
          800: '#6D2C0C',
          900: '#4D1E08',
          950: '#2F0F03',
          DEFAULT: '#C16226',
        },
        espresso: {
          50: '#F7F4F2',
          100: '#EDE6E3',
          200: '#DCCEC8',
          300: '#C4AEA4',
          400: '#9E7767',
          500: '#754B37',
          600: '#5C3827',
          700: '#4A2B1D', // Secondary Accent
          800: '#392116',
          900: '#29170E',
          950: '#1B0E09',
          DEFAULT: '#4A2B1D',
        },
        champagne: {
          50: '#FDFCF9',
          100: '#FBF8F2',
          200: '#F5EDE0',
          300: '#EEDDC7',
          400: '#E7CCA9',
          500: '#E2C8A2', // Light Accent
          600: '#C5A67C',
          700: '#A48259',
          800: '#7E603C',
          900: '#553F24',
          DEFAULT: '#E2C8A2',
        },
        sand: {
          50: '#FCFAF7',
          100: '#FAF5EE', // Primary Main Background (Soft Sand Cream)
          200: '#F4EDE2',
          300: '#EDE1D0',
          400: '#E0CEB7',
          500: '#CEB698',
          DEFAULT: '#FAF5EE',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(74, 43, 29, 0.04)',
        'glass-md': '0 8px 30px 0 rgba(74, 43, 29, 0.07)',
        'glass-lg': '0 12px 40px 0 rgba(74, 43, 29, 0.10)',
        'copper-glow': '0 0 25px -4px rgba(193, 98, 38, 0.30)',
        'champagne-glow': '0 0 25px -4px rgba(226, 200, 162, 0.35)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
