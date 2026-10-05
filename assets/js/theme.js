/**
 * NOURIVA — Theme Controller (Light / Dark Mode)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nouriva_theme';
  const htmlElement = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
      updateToggleIcons('dark');
    } else {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_KEY, 'light');
      updateToggleIcons('light');
    }
  }

  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '<i class="bi bi-sun"></i>';
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        btn.innerHTML = '<i class="bi bi-moon-stars"></i>';
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });
  }

  // Initialize immediately to prevent flash
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleIcons(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    });

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  window.NourivaTheme = {
    getTheme: () => htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    setTheme: setTheme
  };
})();
