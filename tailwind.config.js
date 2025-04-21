/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            animation: {
                fadeIn: 'fadeIn 1.5s ease-out forwards',
                slideUp: 'slideUp 1s ease-out forwards',
                pulse: 'pulse 3s infinite',
                bounce: 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10%)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["light"],
                    "primary": "#0ea5e9",
                    "primary-rgb": "14, 165, 233",
                    "secondary": "#8b5cf6",
                    "accent": "#f97316",
                },
                dark: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    "primary": "#0ea5e9",
                    "primary-rgb": "14, 165, 233",
                    "secondary": "#8b5cf6",
                    "accent": "#f97316",
                },
            },
        ],
    },
}