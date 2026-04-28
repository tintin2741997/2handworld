
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {                                                                                         
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        background: 'var(--color-bg)',
        card: 'var(--color-card)',
        heading: 'var(--color-text-heading)',
        body: 'var(--color-text-body)',
        muted: 'var(--color-text-muted)',
        success: 'var(--color-success)',
        sale: 'var(--color-sale)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(45, 24, 16, 0.05)',
        'warm-lg': '0 10px 30px -5px rgba(45, 24, 16, 0.08)',
      }
    },
  },
  plugins: [],
}
