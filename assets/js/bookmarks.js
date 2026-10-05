/**
 * NOURIVA — Bookmarks Controller
 * Handles saving/unsaving across Articles, Videos, Resources, Discussions
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nouriva_bookmarks';

  function getBookmarks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : getDefaultBookmarks();
    } catch (e) {
      return getDefaultBookmarks();
    }
  }

  function saveBookmarks(bookmarks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    updateAllBookmarkButtons();
    updateBookmarkCounts();
  }

  function getDefaultBookmarks() {
    return [
      {
        id: 'know-1',
        type: 'article',
        title: 'Understanding Macronutrients & Muscle Protein Synthesis',
        category: 'Nutrition Fundamentals',
        url: 'knowledge-details.html',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
        savedAt: '2026-10-01'
      },
      {
        id: 'res-1',
        type: 'resource',
        title: 'Weekly Nutrition & Recovery Planning Template',
        category: 'Meal Planning',
        url: 'resources.html',
        format: 'PDF / Spreadsheet',
        savedAt: '2026-10-02'
      }
    ];
  }

  function isBookmarked(id) {
    const bookmarks = getBookmarks();
    return bookmarks.some(item => item.id === id);
  }

  function toggleBookmark(item) {
    let bookmarks = getBookmarks();
    const index = bookmarks.findIndex(b => b.id === item.id);

    if (index > -1) {
      bookmarks.splice(index, 1);
      saveBookmarks(bookmarks);
      showToast(`Removed "${item.title || 'Item'}" from saved items.`, 'info');
      return false;
    } else {
      bookmarks.push({
        ...item,
        savedAt: new Date().toISOString().split('T')[0]
      });
      saveBookmarks(bookmarks);
      showToast(`Saved "${item.title || 'Item'}" to your collection.`, 'success');
      return true;
    }
  }

  function updateAllBookmarkButtons() {
    const buttons = document.querySelectorAll('[data-bookmark-id]');
    buttons.forEach(btn => {
      const id = btn.getAttribute('data-bookmark-id');
      if (isBookmarked(id)) {
        btn.classList.add('saved');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-bookmark-fill';
        }
        btn.setAttribute('title', 'Remove from saved');
      } else {
        btn.classList.remove('saved');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-bookmark';
        }
        btn.setAttribute('title', 'Save to collection');
      }
    });
  }

  function updateBookmarkCounts() {
    const countElements = document.querySelectorAll('.saved-count-badge');
    const total = getBookmarks().length;
    countElements.forEach(el => {
      el.textContent = total;
    });
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.nouriva-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'nouriva-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `nouriva-toast ${type}`;
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill';
    toast.innerHTML = `<i class="bi ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateAllBookmarkButtons();
    updateBookmarkCounts();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bookmark-id]');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const id = btn.getAttribute('data-bookmark-id');
      const title = btn.getAttribute('data-bookmark-title') || 'Educational Resource';
      const category = btn.getAttribute('data-bookmark-category') || 'Nutrition';
      const type = btn.getAttribute('data-bookmark-type') || 'article';
      const url = btn.getAttribute('data-bookmark-url') || 'knowledge-details.html';
      const image = btn.getAttribute('data-bookmark-image') || '';

      const isNowSaved = toggleBookmark({ id, title, category, type, url, image });

      // Animate button bounce
      btn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 200);

      // If on saved.html, refresh list
      if (typeof window.renderSavedItemsList === 'function') {
        window.renderSavedItemsList();
      }
    });
  });

  window.NourivaBookmarks = {
    getAll: getBookmarks,
    isSaved: isBookmarked,
    toggle: toggleBookmark,
    showToast: showToast,
    refreshUI: updateAllBookmarkButtons
  };
})();
