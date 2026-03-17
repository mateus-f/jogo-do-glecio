import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState(
        typeof window !== "undefined" ? (document.documentElement.classList.contains("dark") ? "dark" : "light") : "light"
    );

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return { theme, toggleTheme };
}