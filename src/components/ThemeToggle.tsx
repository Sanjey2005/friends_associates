'use client';

import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function isTheme(value: string | null): value is Theme {
    return value === 'light' || value === 'dark';
}

function getCurrentTheme(): Theme {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (isTheme(currentTheme)) return currentTheme;

    const stored = localStorage.getItem('theme');
    if (isTheme(stored)) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
    const toggle = () => {
        const theme = getCurrentTheme();
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle color theme"
            title="Toggle color theme"
            className="btn btn-ghost"
            style={{
                padding: '0.5rem',
                width: '2.5rem',
                height: '2.5rem',
            }}
        >
            <span className="theme-icon theme-icon-sun" aria-hidden="true">
                <Sun size={18} />
            </span>
            <span className="theme-icon theme-icon-moon" aria-hidden="true">
                <Moon size={18} />
            </span>
        </button>
    );
}
