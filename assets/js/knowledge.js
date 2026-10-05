/**
 * NOURIVA — Knowledge & Documentation Controller
 * Handles article reading progress, TOC scrollspy, and library filter system
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar on Article Pages
  function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    const articleContent = document.querySelector('.article-content');
    if (!progressBar || !articleContent) return;

    window.addEventListener('scroll', () => {
      const totalHeight = articleContent.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollPos = window.scrollY - articleContent.offsetTop;

      if (scrollPos <= 0) {
        progressBar.style.width = '0%';
      } else {
        const progress = Math.min(100, Math.max(0, (scrollPos / (totalHeight - windowHeight + 200)) * 100));
        progressBar.style.width = `${progress}%`;
      }
    });
  }

  // 2. Table of Contents Scrollspy
  function initTOCScrollspy() {
    const tocItems = document.querySelectorAll('.toc-item a');
    if (!tocItems.length) return;

    const headings = Array.from(tocItems).map(item => {
      const id = item.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    if (!headings.length) return;

    const observerOptions = {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              item.parentElement.classList.add('active');
            } else {
              item.parentElement.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
  }

  // 3. Knowledge Library Multi-Filter System
  function initKnowledgeFilters() {
    const filterForm = document.getElementById('knowledgeFilterForm');
    const cardsContainer = document.getElementById('knowledgeCardsGrid');
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.querySelectorAll('.knowledge-card-col'));
    const countBadge = document.getElementById('filterResultCount');

    function applyFilters() {
      const topic = document.querySelector('input[name="filterTopic"]:checked')?.value || 'all';
      const type = document.querySelector('input[name="filterType"]:checked')?.value || 'all';
      const difficulty = document.querySelector('input[name="filterDifficulty"]:checked')?.value || 'all';
      const searchInput = document.getElementById('knowledgeInlineSearch')?.value.toLowerCase().trim() || '';

      let visibleCount = 0;

      cards.forEach(card => {
        const cardTopic = card.getAttribute('data-topic') || '';
        const cardType = card.getAttribute('data-type') || '';
        const cardDifficulty = card.getAttribute('data-difficulty') || '';
        const cardText = card.textContent.toLowerCase();

        const matchTopic = topic === 'all' || cardTopic.toLowerCase() === topic.toLowerCase();
        const matchType = type === 'all' || cardType.toLowerCase() === type.toLowerCase();
        const matchDiff = difficulty === 'all' || cardDifficulty.toLowerCase() === difficulty.toLowerCase();
        const matchSearch = !searchInput || cardText.includes(searchInput);

        if (matchTopic && matchType && matchDiff && matchSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = `${visibleCount} Resources`;
      }

      // Handle empty state
      let emptyMsg = document.getElementById('knowledgeEmptyState');
      if (visibleCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'knowledgeEmptyState';
          emptyMsg.className = 'col-12 text-center py-5';
          emptyMsg.innerHTML = `
            <div class="py-4">
              <i class="bi bi-filter-circle text-muted fs-1 mb-3 d-block"></i>
              <h5 class="fw-semibold">No resources match your active filters</h5>
              <p class="text-muted small">Try broadening your topic selection or clearing search keywords.</p>
              <button class="btn btn-nour-secondary btn-sm mt-2" id="resetFiltersBtn">Reset All Filters</button>
            </div>
          `;
          cardsContainer.appendChild(emptyMsg);
          document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
      }
    }

    function resetFilters() {
      document.querySelectorAll('#knowledgeFilterForm input[type="radio"]').forEach(radio => {
        if (radio.value === 'all') radio.checked = true;
      });
      const search = document.getElementById('knowledgeInlineSearch');
      if (search) search.value = '';
      applyFilters();
    }

    if (filterForm) {
      filterForm.addEventListener('change', applyFilters);
    }

    const inlineSearch = document.getElementById('knowledgeInlineSearch');
    if (inlineSearch) {
      inlineSearch.addEventListener('input', applyFilters);
    }

    const resetBtn = document.getElementById('btnResetKnowledgeFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilters();
      });
    }

    // Check URL query param for preselected topic
    const urlParams = new URLSearchParams(window.location.search);
    const queryTopic = urlParams.get('topic');
    if (queryTopic) {
      const targetRadio = document.querySelector(`input[name="filterTopic"][value="${queryTopic}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
      }
    }

    applyFilters();
  }

  // 4. Share Article / Copy Link
  function initShareButtons() {
    document.querySelectorAll('.btn-share-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
            window.NourivaBookmarks.showToast('Article link copied to clipboard!', 'success');
          } else {
            alert('Article link copied!');
          }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initTOCScrollspy();
    initKnowledgeFilters();
    initShareButtons();
  });
})();
