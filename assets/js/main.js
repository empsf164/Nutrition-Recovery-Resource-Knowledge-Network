/**
 * NOURIVA — Main Coordinator Script
 * Mobile drawer, GSAP motion, personalized recommendations, simulated file downloader, and saved-items renderer
 */

(function () {
  'use strict';

  // 1. Sticky Header & Mobile Drawer
  function initNavigation() {
    const header = document.querySelector('.nouriva-header');
    const mobileToggle = document.querySelector('.mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileClose = document.getElementById('mobileDrawerClose');

    // Sticky shadow
    window.addEventListener('scroll', () => {
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Mobile Drawer Open
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    // Mobile Drawer Close
    if (mobileClose && mobileDrawer) {
      mobileClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Mobile Accordion Dropdowns
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute('data-target');
        const submenu = document.getElementById(targetId);
        const icon = toggle.querySelector('i');
        if (submenu) {
          submenu.classList.toggle('open');
          if (icon) {
            icon.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
      });
    });

    // Active page link highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link-custom, .mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // 2. Motion Transitions (Clean & Safe)
  function initAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (typeof gsap !== 'undefined') {
      // Subtle Hero entrance only
      const heroContent = document.querySelector('.hero-content-reveal');
      if (heroContent) {
        gsap.from(heroContent.children, {
          y: 16,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    }
  }

  // 3. Simulated Realistic File Downloader
  function initDownloadSimulations() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-download-resource]');
      if (!btn) return;

      e.preventDefault();
      const title = btn.getAttribute('data-download-resource') || 'Nutrition-Recovery-Template';
      const format = btn.getAttribute('data-download-format') || 'PDF';

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span> Generating...';

      if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
        window.NourivaBookmarks.showToast(`Preparing ${format} document for "${title}"...`, 'info');
      }

      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check2"></i> Downloaded';
        btn.classList.add('btn-success');

        // Create a realistic downloadable text file
        const fileContent = `================================================================================
NOURIVA — NUTRITION RECOVERY RESOURCE & KNOWLEDGE NETWORK
Resource: ${title}
Format: ${format}
Generated: ${new Date().toLocaleString()}
Educational Disclaimer: NOURIVA provides educational resources and is not a substitute for professional medical advice.
================================================================================

KEY RECOVERY CHECKPOINTS:
1. Hydration Replenishment: Consume 500-750ml fluid per kg weight lost during exertion.
2. Carbohydrate-to-Protein Ratio: Aim for a 3:1 or 4:1 ratio within the first 45-90 minutes.
3. Micronutrient Support: Include magnesium, potassium, and sodium-dense whole foods.
4. Sleep & Rest: Support tissue regeneration with a 7-9 hour sleep opportunity.

For interactive guides, video tutorials, and templates, visit:
https://nouriva.org
================================================================================`;

        const blob = new Blob([fileContent], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-nour-resource.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
          window.NourivaBookmarks.showToast(`Downloaded "${title}" successfully!`, 'success');
        }

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          btn.classList.remove('btn-success');
        }, 2500);
      }, 1000);
    });
  }

  // 4. Personalized Recommendations Engine
  function initPersonalizedContent() {
    const interests = window.NourivaAuth ? window.NourivaAuth.getInterests() : ['Nutrition Fundamentals'];
    const cards = document.querySelectorAll('[data-topic]');
    if (!cards.length) return;

    cards.forEach(card => {
      const topic = card.getAttribute('data-topic');
      if (topic && interests.some(i => i.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(i.toLowerCase()))) {
        // Highlight matching card with curated badge
        const badgeWrap = card.querySelector('.card-meta-top');
        if (badgeWrap && !badgeWrap.querySelector('.badge-curated')) {
          const curatedBadge = document.createElement('span');
          curatedBadge.className = 'badge-nouriva badge-amber badge-curated';
          curatedBadge.innerHTML = '<i class="bi bi-stars"></i> Curated for You';
          badgeWrap.appendChild(curatedBadge);
        }
      }
    });
  }

  // 5. Saved Page List Renderer (saved.html)
  window.renderSavedItemsList = function () {
    const container = document.getElementById('savedItemsGrid');
    if (!container) return;

    const bookmarks = window.NourivaBookmarks ? window.NourivaBookmarks.getAll() : [];
    const activeTab = document.querySelector('.saved-tab-btn.active')?.getAttribute('data-type') || 'all';

    const filtered = bookmarks.filter(item => {
      if (activeTab === 'all') return true;
      return (item.type || 'article').toLowerCase() === activeTab.toLowerCase();
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="py-4">
            <i class="bi bi-bookmark text-muted" style="font-size: 3rem;"></i>
            <h4 class="mt-3 mb-2 font-editorial">Your collection is currently empty</h4>
            <p class="text-secondary small max-w-md mx-auto">Explore our knowledge library, video tutorials, or downloadable templates and click the bookmark icon to save resources for easy reference.</p>
            <div class="d-flex justify-content-center gap-2 mt-3">
              <a href="explore.html" class="btn btn-nour-primary btn-sm">Explore Knowledge</a>
              <a href="resources.html" class="btn btn-nour-secondary btn-sm">Browse Resources</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="nour-card knowledge-card">
          <div class="card-img-wrap" style="height: 180px;">
            <img src="${item.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'}" alt="${item.title}">
            <button class="card-save-btn saved" data-bookmark-id="${item.id}" data-bookmark-title="${item.title}" title="Remove from saved">
              <i class="bi bi-bookmark-fill"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="card-meta-top">
              <span class="badge-nouriva badge-sage">${item.category || 'Education'}</span>
              <span class="text-muted small">${item.type ? item.type.toUpperCase() : 'ARTICLE'}</span>
            </div>
            <h4 class="card-title">
              <a href="${item.url || 'knowledge-details.html'}">${item.title}</a>
            </h4>
            <div class="card-meta-bottom mt-auto">
              <span>Saved on ${item.savedAt || 'Recent'}</span>
              <a href="${item.url || 'knowledge-details.html'}" class="fw-semibold small">View <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    if (window.NourivaBookmarks && window.NourivaBookmarks.refreshUI) {
      window.NourivaBookmarks.refreshUI();
    }
  };

  function initSavedTabs() {
    const tabs = document.querySelectorAll('.saved-tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.renderSavedItemsList();
      });
    });

    window.renderSavedItemsList();
  }

  // 6. Glossary Filter & Alphabet Nav
  function initGlossary() {
    const searchInput = document.getElementById('glossarySearchInput');
    const alphabetBtns = document.querySelectorAll('.alphabet-btn');
    const termCards = document.querySelectorAll('.glossary-card');
    const letterSections = document.querySelectorAll('.glossary-letter-section');

    if (!termCards.length) return;

    function filterGlossary() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

      termCards.forEach(card => {
        const title = card.querySelector('h5')?.textContent.toLowerCase() || '';
        const def = card.querySelector('p')?.textContent.toLowerCase() || '';
        const isMatch = !q || title.includes(q) || def.includes(q);
        card.style.display = isMatch ? '' : 'none';
      });

      // Hide empty letter sections
      letterSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.glossary-card:not([style*="display: none"])');
        section.style.display = visibleCards.length ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterGlossary);
    }

    alphabetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        alphabetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const letter = btn.getAttribute('data-letter');
        const targetSection = document.getElementById(`glossary-section-${letter}`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Back to Top Button Coordinator
  function initBackToTop() {
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 280) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Global DOM Init
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initDownloadSimulations();
    initPersonalizedContent();
    initSavedTabs();
    initGlossary();
    initBackToTop();
  });
})();
