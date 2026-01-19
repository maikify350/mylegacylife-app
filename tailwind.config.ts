import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Core Colors
                background: {
                    DEFAULT: "#1C1410",
                    light: "#2A1F1A",
                },
                card: {
                    DEFAULT: "#3D2E25",
                    hover: "#4A3830",
                },
                // Accent Colors
                accent: {
                    DEFAULT: "#C4956A",
                    light: "#D4A574",
                },
                // Text Colors
                foreground: "#F5E6D3", // Cream
                "text-muted": "#A89080",
                "warm-gray": "#8B7355",
                // Semantic Colors
                success: "#7DB36E",
                danger: "#C97B6B",
                info: "#6A9EC4",
                // Derived
                primary: "#C4956A",
                border: "#4A3830",
                input: "#3D2E25",
                ring: "#C4956A",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                serif: ["Playfair Display", "Georgia", "serif"],
            },
            fontSize: {
                base: "1.125rem", // 18px
                lg: "1.25rem", // 20px
                xl: "1.5rem", // 24px
                "2xl": "2rem", // 32px
                "3xl": "2.5rem", // 40px
                "4xl": "3rem", // 48px
            },
            borderRadius: {
                DEFAULT: "0.75rem",
            },
        },
    },
    plugins: [],
};

export default config;
