/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./assets/**/*.{html,js}",
    "./dist/**/*.{html,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VSCode-inspired theme colors
        'vscode': {
          'bg': '#1e1e1e',
          'sidebar': '#252526',
          'panel': '#2d2d30',
          'border': '#3e3e42',
          'text': '#cccccc',
          'text-secondary': '#969696',
          'hover': '#2a2d2e',
          'selected': '#094771',
          'blue': '#007acc',
          'input': '#3c3c3c',
          'button': '#0e639c',
          'button-hover': '#1177bb',
        }
      },
      fontFamily: {
        'ui': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'mono': ['Consolas', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#9ca3af #f3f4f6',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          'width': '8px',
          'height': '8px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          'background': '#f3f4f6',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background': '#9ca3af',
          'border-radius': '9999px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background': '#6b7280',
        },
      });
    },
  ],
  // Safelist critical classes that might be added dynamically
  safelist: [
    'hidden',
    'collapsed',
    'expanded',
    'selected',
    'dragging',
    'resizing',
    'dark',
    // Dynamic color classes for file types
    {
      pattern: /^(bg|text|border)-(gray|blue|green|red|yellow)-(100|200|300|400|500|600|700|800|900)$/,
      variants: ['hover', 'focus', 'dark'],
    },
    // Dynamic spacing classes
    {
      pattern: /^(w|h)-(4|8|12|16|20|24|32|40|48|64|80|96)$/,
    },
    // Tree item indentation
    {
      pattern: /^(ml|pl)-(4|8|12|16|20|24|32)$/,
    },
  ],
  // Optimize for production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html',
      './assets/**/*.{html,js}',
      './dist/**/*.{html,js}'
    ],
    options: {
      safelist: [
        'hidden',
        'collapsed',
        'expanded',
        'selected',
        'dragging',
        'resizing'
      ]
    }
  }
};
