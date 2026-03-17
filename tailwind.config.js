/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                purple: "var(--purple)",
                darkPurple: "var(--dark-purple)",
                purpleSecondary: "var(--purple-secondary)",
                greenColor: "var(--green)",
                darkGreen: "var(--dark-green)",
                redColor: "var(--red)", //"redColor" ao invés de "red" para não entrar en conflito com as cores do tailwind
                darkRed: "var(--dark-red)",
                surface: "var(--surface)",
                borderColor: "var(--border-color)",
                grayColor: "var(--gray)",
                darkGray: "var(--dark-gray)",
                purpleGray: "var(--purple-gray)",
                purpleDarkGray: "var(--purple-dark-gray)",
                skeletonLoadingBase: "var(--skeleton-loading-base)",
                skeletonLoadingHighlight: "var(--skeleton-loading-highlight)",
            },
        },
    },
    plugins: [],
};
