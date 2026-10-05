/**
 * NOURIVA — Global Search Engine
 * Search across Knowledge, Videos, Resources, Discussions, and Glossary
 */

(function () {
  'use strict';

  const SEARCH_DATABASE = [
    // Knowledge
    {
      id: 'know-1',
      type: 'Knowledge',
      title: 'Understanding Macronutrients & Muscle Protein Synthesis',
      category: 'Nutrition Fundamentals',
      description: 'A comprehensive guide into proteins, carbohydrates, fats and their metabolic recovery roles.',
      url: 'knowledge-details.html',
      icon: 'bi-journal-text'
    },
    {
      id: 'know-2',
      type: 'Knowledge',
      title: 'Building a Balanced Post-Training Recovery Meal',
      category: 'Recovery Nutrition',
      description: 'The optimal 3:1 carbohydrate-to-protein ratio and micronutrient synergy for tissue restoration.',
      url: 'knowledge-details.html',
      icon: 'bi-journal-text'
    },
    {
      id: 'know-3',
      type: 'Knowledge',
      title: 'Hydration Dynamics: Fluid Retention & Electrolytes',
      category: 'Hydration',
      description: 'Understanding osmolality, sodium replenishment, and cellular fluid balance during recovery.',
      url: 'knowledge-details.html',
      icon: 'bi-droplet-half'
    },
    {
      id: 'know-4',
      type: 'Knowledge',
      title: 'Micronutrient Synergies: Zinc, Magnesium & Vitamin D',
      category: 'Micronutrients',
      description: 'Exploring how essential trace minerals support cellular recovery, sleep quality, and immune function.',
      url: 'knowledge-details.html',
      icon: 'bi-capsule'
    },
    {
      id: 'know-5',
      type: 'Knowledge',
      title: 'Reading & Interpreting Nutritional Food Labels Accurately',
      category: 'Healthy Habits',
      description: 'How to decode serving sizes, ingredient lists, added sugars, and hidden preservatives.',
      url: 'knowledge-details.html',
      icon: 'bi-upc-scan'
    },
    // Videos
    {
      id: 'vid-1',
      type: 'Videos',
      title: 'How Recovery Nutrition Works: Cellular Repair & Glycogen',
      category: 'Video Lecture',
      description: '14 min breakdown by Dr. Elena Rostova on metabolic recovery pathways.',
      url: 'video-details.html',
      icon: 'bi-play-circle'
    },
    {
      id: 'vid-2',
      type: 'Videos',
      title: 'Building a Balanced Plate: Real-time Kitchen Prep',
      category: 'Practical Tutorial',
      description: '18 min practical meal preparation demonstrating balanced macronutrient distribution.',
      url: 'video-details.html',
      icon: 'bi-play-circle'
    },
    {
      id: 'vid-3',
      type: 'Videos',
      title: 'Hydration Fundamentals: Water, Salt & Osmotic Pressure',
      category: 'Science Deep Dive',
      description: '11 min visual guide into electrolyte balance and avoiding exercise-induced dehydration.',
      url: 'video-details.html',
      icon: 'bi-play-circle'
    },
    // Resources
    {
      id: 'res-1',
      type: 'Resources',
      title: 'Weekly Nutrition & Recovery Planning Template',
      category: 'Templates',
      description: 'Printable PDF & spreadsheet template for structuring high-recovery weekly meals.',
      url: 'resources.html',
      icon: 'bi-file-earmark-pdf'
    },
    {
      id: 'res-2',
      type: 'Resources',
      title: 'Whole-Foods Nutrient Density Grocery Checklist',
      category: 'Checklists',
      description: 'Organized shopping checklist categorized by produce, lean proteins, and complex grains.',
      url: 'resources.html',
      icon: 'bi-check2-square'
    },
    {
      id: 'res-3',
      type: 'Resources',
      title: 'Daily Fluid & Electrolyte Intake Tracker',
      category: 'Trackers',
      description: 'Visual logging sheet for tracking water, sodium, and potassium balance.',
      url: 'resources.html',
      icon: 'bi-water'
    },
    {
      id: 'res-4',
      type: 'Resources',
      title: 'Post-Activity Recovery Routine Reference Sheet',
      category: 'Reference Sheets',
      description: 'A 1-page quick reference card for optimal 30-min and 2-hour nutritional timing.',
      url: 'resources.html',
      icon: 'bi-file-earmark-ruled'
    },
    // Discussions
    {
      id: 'com-1',
      type: 'Discussions',
      title: 'What is your most reliable whole-food post-training meal?',
      category: 'Recovery Experiences',
      description: 'Community members sharing fast, nutrient-dense recovery recipes with minimal prep.',
      url: 'discussion-details.html',
      icon: 'bi-chat-left-text'
    },
    {
      id: 'com-2',
      type: 'Discussions',
      title: 'Electrolyte supplementation vs. natural sodium in meals: preferences?',
      category: 'Hydration',
      description: 'Discussion comparing whole foods (broths, citrus, sea salt) vs packaged hydration packets.',
      url: 'discussion-details.html',
      icon: 'bi-chat-left-text'
    },
    {
      id: 'com-3',
      type: 'Discussions',
      title: 'How do you structure complex carbs around evening training without disrupting sleep?',
      category: 'Meal Planning',
      description: 'Community discussion on glycemic indexing, digestion speeds, and sleep architecture.',
      url: 'discussion-details.html',
      icon: 'bi-chat-left-text'
    },
    // Glossary
    {
      id: 'glo-1',
      type: 'Glossary',
      title: 'Muscle Protein Synthesis (MPS)',
      category: 'Terminology',
      description: 'The biological process where protein is produced to repair muscle damage from exercise.',
      url: 'glossary.html#mps',
      icon: 'bi-book'
    },
    {
      id: 'glo-2',
      type: 'Glossary',
      title: 'Glycogen Replenishment',
      category: 'Terminology',
      description: 'The resynthesis of stored carbohydrates in liver and muscular tissue post-depletion.',
      url: 'glossary.html#glycogen',
      icon: 'bi-book'
    },
    {
      id: 'glo-3',
      type: 'Glossary',
      title: 'Electrolyte Osmolality',
      category: 'Terminology',
      description: 'The concentration of solute particles per kilogram of solvent in human blood and cellular fluids.',
      url: 'glossary.html#osmolality',
      icon: 'bi-book'
    }
  ];

  let currentCategory = 'all';
  const RECENT_KEY = 'nouriva_recent_searches';

  function getRecentSearches() {
    try {
      const data = localStorage.getItem(RECENT_KEY);
      return data ? JSON.parse(data) : ['Protein', 'Electrolytes', 'Recovery meals', 'Meal planning'];
    } catch (e) {
      return ['Protein', 'Electrolytes'];
    }
  }

  function addRecentSearch(query) {
    if (!query || query.trim().length < 2) return;
    let recents = getRecentSearches();
    recents = recents.filter(item => item.toLowerCase() !== query.toLowerCase());
    recents.unshift(query.trim());
    if (recents.length > 6) recents.pop();
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
  }

  function createSearchModal() {
    if (document.querySelector('.search-modal-backdrop')) return;

    const modalHTML = `
      <div class="search-modal-backdrop" id="searchModalBackdrop" role="dialog" aria-modal="true" aria-label="Global Search">
        <div class="search-modal-container">
          <div class="search-modal-header">
            <i class="bi bi-search text-muted fs-5"></i>
            <input type="text" class="search-modal-input" id="searchModalInput" placeholder="Search knowledge, videos, templates, discussions, terminology..." autocomplete="off">
            <button class="search-modal-close" id="searchModalClose" aria-label="Close search"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="search-modal-tabs">
            <button class="search-tab-btn active" data-filter="all">All Results</button>
            <button class="search-tab-btn" data-filter="Knowledge">Knowledge</button>
            <button class="search-tab-btn" data-filter="Videos">Videos</button>
            <button class="search-tab-btn" data-filter="Resources">Resources</button>
            <button class="search-tab-btn" data-filter="Discussions">Discussions</button>
            <button class="search-tab-btn" data-filter="Glossary">Glossary</button>
          </div>
          <div class="search-modal-body" id="searchModalBody">
            <!-- Results or Suggestions injected here -->
          </div>
          <div class="search-modal-footer">
            <span>Tip: Use <kbd style="background: var(--bg-surface-elevated); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-subtle)">↑</kbd> <kbd style="background: var(--bg-surface-elevated); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-subtle)">↓</kbd> to navigate, <kbd style="background: var(--bg-surface-elevated); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-subtle)">ESC</kbd> to close</span>
            <span>NOURIVA Knowledge Network</span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const backdrop = document.getElementById('searchModalBackdrop');
    const input = document.getElementById('searchModalInput');
    const closeBtn = document.getElementById('searchModalClose');
    const tabs = document.querySelectorAll('.search-tab-btn');

    closeBtn.addEventListener('click', closeSearchModal);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSearchModal();
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-filter');
        performSearch(input.value);
      });
    });

    input.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstResult = document.querySelector('.search-result-item');
        if (firstResult) {
          addRecentSearch(input.value);
          firstResult.click();
        }
      }
    });
  }

  function openSearchModal(initialQuery = '') {
    createSearchModal();
    const backdrop = document.getElementById('searchModalBackdrop');
    const input = document.getElementById('searchModalInput');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (initialQuery) {
      input.value = initialQuery;
      performSearch(initialQuery);
    } else {
      renderRecentAndTrending();
    }

    setTimeout(() => input.focus(), 50);
  }

  function closeSearchModal() {
    const backdrop = document.getElementById('searchModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function highlightMatches(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  function renderRecentAndTrending() {
    const body = document.getElementById('searchModalBody');
    const recents = getRecentSearches();

    let html = `
      <div class="search-group-title">Recent Searches</div>
      <div class="d-flex flex-wrap gap-2 mb-3">
        ${recents.map(r => `<button class="chip-tag recent-chip" data-query="${r}"><i class="bi bi-clock-history me-1 text-muted"></i>${r}</button>`).join('')}
      </div>
      <div class="search-group-title mt-3">Suggested Topics</div>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <button class="chip-tag recent-chip" data-query="Macronutrients">Macronutrients</button>
        <button class="chip-tag recent-chip" data-query="Hydration">Hydration</button>
        <button class="chip-tag recent-chip" data-query="Protein">Protein & Synthesis</button>
        <button class="chip-tag recent-chip" data-query="Meal Planning">Meal Planning</button>
        <button class="chip-tag recent-chip" data-query="Checklist">Recovery Checklists</button>
      </div>
    `;

    body.innerHTML = html;

    body.querySelectorAll('.recent-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        const input = document.getElementById('searchModalInput');
        input.value = query;
        performSearch(query);
      });
    });
  }

  function performSearch(query) {
    const trimmed = query.trim().toLowerCase();
    const body = document.getElementById('searchModalBody');

    if (!trimmed) {
      renderRecentAndTrending();
      return;
    }

    let filtered = SEARCH_DATABASE.filter(item => {
      const matchCategory = currentCategory === 'all' || item.type.toLowerCase() === currentCategory.toLowerCase();
      const matchText = item.title.toLowerCase().includes(trimmed) ||
                        item.description.toLowerCase().includes(trimmed) ||
                        item.category.toLowerCase().includes(trimmed);
      return matchCategory && matchText;
    });

    if (filtered.length === 0) {
      body.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-search text-muted fs-1 mb-3 d-block"></i>
          <h5 class="fw-semibold mb-1">No matching resources found</h5>
          <p class="text-muted small">We couldn't find anything matching "${query}". Try searching for broader terms like "Protein", "Hydration", or "Templates".</p>
        </div>
      `;
      return;
    }

    // Group results by type
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    let html = '';
    for (const [type, items] of Object.entries(groups)) {
      html += `<div class="search-group-title">${type} (${items.length})</div>`;
      items.forEach(item => {
        html += `
          <a href="${item.url}" class="search-result-item" data-url="${item.url}" data-title="${item.title}">
            <div class="search-result-info">
              <div class="search-result-icon">
                <i class="bi ${item.icon}"></i>
              </div>
              <div class="search-result-text">
                <h6>${highlightMatches(item.title, query)}</h6>
                <p>${highlightMatches(item.description, query)}</p>
              </div>
            </div>
            <span class="badge-nouriva badge-sand ms-2">${item.category}</span>
          </a>
        `;
      });
    }

    body.innerHTML = html;

    body.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', () => {
        addRecentSearch(query);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    createSearchModal();

    // Trigger buttons
    document.querySelectorAll('.search-trigger-btn, .hero-search-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });

    // Hero search input
    const heroInput = document.getElementById('heroSearchInput');
    const heroForm = document.getElementById('heroSearchForm');
    if (heroForm && heroInput) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openSearchModal(heroInput.value);
      });
    }

    // Keyboard shortcut CMD+K or CTRL+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const backdrop = document.getElementById('searchModalBackdrop');
        if (backdrop && backdrop.classList.contains('active')) {
          closeSearchModal();
        } else {
          openSearchModal();
        }
      }

      if (e.key === 'Escape') {
        closeSearchModal();
      }
    });
  });

  window.NourivaSearch = {
    open: openSearchModal,
    close: closeSearchModal
  };
})();
