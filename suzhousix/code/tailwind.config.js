/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px'
      },
      lineHeight: {
        80: '80px',
        88: '88px'
      },
      colors: {
        orange: {
          DEFAULT: '#E8730B'
        },
        gray: {
          DEFAULT: '#333'
        },
        blue: {
          DEFAULT: '#4868C1'
        }
      }
    },
    fontFamily: {
      sans: ['SourceHanSansCN', 'sans-serif']
    },
    fontSize: {
      xs: '20px',
      sm: '26px',
      base: '30px',
      lg: '36px',
      '2xl': '44px'
    },
    spacing: {
      px: '1px',
      0: '0',
      4: '4px',
      5: '5px',
      6: '6px',
      7: '7px',
      8: '8px',
      9: '9px',
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      20: '20px',
      24: '24px',
      28: '28px',
      30: '30px',
      32: '32px',
      36: '36px',
      40: '40px',
      44: '44px',
      48: '48px',
      52: '52px',
      56: '56px',
      60: '60px',
      64: '64px',
      72: '72px',
      76: '76px',
      80: '80px',
      88: '88px',
      96: '96px'
    },
    screens: {
      lg: '1080px',
      xl: '1920px'
    }
  },
  plugins: []
};
