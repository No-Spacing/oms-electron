import { ref, watch } from 'vue';

// Declared OUTSIDE the function, making it a singleton (shared globally)
const isDark = ref(true);

export function useTheme() {
    // Initialize from localStorage once
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
    };

    // Watch and apply changes to DOM & localStorage automatically
    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('my-app-dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('my-app-dark');
            localStorage.setItem('theme', 'light');
        }
    }, { immediate: true });

    return {
        isDark,
        initTheme
    };
}