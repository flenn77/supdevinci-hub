module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',   // toggle auto
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          600: '#4f46e5',   // indigo-600
          800: '#3730a3',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(.4,0,.6,1) infinite',
      }
    },
  },
  plugins: [],
};
