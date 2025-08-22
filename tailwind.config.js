/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fly-1': 'fly1 8s ease-in-out infinite',
        'fly-2': 'fly2 10s ease-in-out infinite',
        'fly-3': 'fly3 12s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fly1: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(100px, -50px) rotate(90deg)' },
          '50%': { transform: 'translate(200px, 20px) rotate(180deg)' },
          '75%': { transform: 'translate(50px, 100px) rotate(270deg)' },
        },
        fly2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(-80px, 60px) rotate(120deg)' },
          '66%': { transform: 'translate(150px, -30px) rotate(240deg)' },
        },
        fly3: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(120px, 80px) rotate(72deg)' },
          '40%': { transform: 'translate(-50px, -70px) rotate(144deg)' },
          '60%': { transform: 'translate(80px, -20px) rotate(216deg)' },
          '80%': { transform: 'translate(-100px, 40px) rotate(288deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(147, 51, 234, 0.8), 0 0 40px rgba(147, 51, 234, 0.3)' },
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}