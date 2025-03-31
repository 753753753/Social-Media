/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
        },
        secondary: {
          500: 'var(--secondary-500)',
        },
        offWhite: 'var(--off-white)',
        red: 'var(--red)',
        dark: {
          1: 'var(--dark-1)',
          2: 'var(--dark-2)',
          3: 'var(--dark-3)',
          4: 'var(--dark-4)',
        },
        light: {
          1: 'var(--light-1)',
          2: 'var(--light-2)',
          3: 'var(--light-3)',
          4: 'var(--light-4)',
        },
      },
    },
  },
};

