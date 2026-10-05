/**
 * NOURIVA — Community & Discussions Controller
 * Manages thoughtful forum discussions, replies, upvotes, and localStorage persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'nouriva_discussions';
  const UPVOTES_KEY = 'nouriva_upvotes';

  const INITIAL_DISCUSSIONS = [
    {
      id: 'disc-1',
      title: 'What is your most reliable whole-food post-training meal for quick digestion?',
      category: 'Recovery Experiences',
      author: 'Marcus Vance, MS',
      role: 'Exercise Nutritionist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: '2 hours ago',
      excerpt: 'Looking to hear from endurance runners and resistance trainees on whole-food options with a 3:1 carb-to-protein ratio that do not cause gastrointestinal distress.',
      repliesCount: 14,
      viewsCount: 342,
      upvotes: 28,
      url: 'discussion-details.html'
    },
    {
      id: 'disc-2',
      title: 'Electrolyte supplementation vs. natural sodium in meals: practical experiences?',
      category: 'Hydration',
      author: 'Dr. Sarah Lin',
      role: 'Clinical Researcher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      date: 'Yesterday',
      excerpt: 'Analyzing the metabolic difference between drinking commercial electrolyte packets vs. salting mineral-rich broths and citrus water during high-heat recovery windows.',
      repliesCount: 22,
      viewsCount: 680,
      upvotes: 45,
      url: 'discussion-details.html'
    },
    {
      id: 'disc-3',
      title: 'Structuring complex carbohydrates around late evening workouts without affecting sleep',
      category: 'Meal Planning',
      author: 'Julian Thorne',
      role: 'Community Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      date: '3 days ago',
      excerpt: 'For those training between 6-8 PM: what carbohydrate sources provide rapid glycogen recovery without triggering nocturnal temperature spikes or delayed sleep onset?',
      repliesCount: 19,
      viewsCount: 512,
      upvotes: 31,
      url: 'discussion-details.html'
    },
    {
      id: 'disc-4',
      title: 'Evidence-informed approaches to plant-based leucine thresholds for recovery',
      category: 'Nutrition Questions',
      author: 'Priya Sharma, RD',
      role: 'Dietitian',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      date: '5 days ago',
      excerpt: 'How do you optimize vegan protein blends (pea, brown rice, pumpkin seed) to reliably hit the 2.7g leucine trigger per feeding window?',
      repliesCount: 34,
      viewsCount: 890,
      upvotes: 56,
      url: 'discussion-details.html'
    }
  ];

  function getDiscussions() {
    try {
      const custom = localStorage.getItem(STORAGE_KEY);
      const customList = custom ? JSON.parse(custom) : [];
      return [...customList, ...INITIAL_DISCUSSIONS];
    } catch (e) {
      return INITIAL_DISCUSSIONS;
    }
  }

  function getUpvotes() {
    try {
      const data = localStorage.getItem(UPVOTES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function toggleUpvote(id, countEl) {
    const upvotes = getUpvotes();
    let isUpvoted = !!upvotes[id];

    if (isUpvoted) {
      delete upvotes[id];
      isUpvoted = false;
    } else {
      upvotes[id] = true;
      isUpvoted = true;
    }

    localStorage.setItem(UPVOTES_KEY, JSON.stringify(upvotes));

    if (countEl) {
      let current = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = isUpvoted ? current + 1 : Math.max(0, current - 1);
    }

    if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
      window.NourivaBookmarks.showToast(isUpvoted ? 'Marked as helpful' : 'Upvote removed', 'info');
    }

    return isUpvoted;
  }

  // Render Discussions List on community.html
  function renderDiscussionsList(filterCat = 'all', searchQuery = '') {
    const container = document.getElementById('communityDiscussionsList');
    if (!container) return;

    const discussions = getDiscussions();
    const upvotesMap = getUpvotes();

    let filtered = discussions.filter(d => {
      const matchCat = filterCat === 'all' || d.category.toLowerCase() === filterCat.toLowerCase();
      const matchSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery) || d.excerpt.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-chat-square-text text-muted fs-1 mb-3 d-block"></i>
          <h5 class="fw-semibold">No discussions found in this category</h5>
          <p class="text-muted small">Be the first to start a conversation or try a different filter.</p>
          <button class="btn btn-nour-primary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#newDiscussionModal">Start a Discussion</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(d => {
      const isUpvoted = !!upvotesMap[d.id];
      return `
        <div class="discussion-card">
          <button class="discussion-upvote-btn ${isUpvoted ? 'upvoted' : ''}" data-upvote-id="${d.id}" title="Mark helpful">
            <i class="bi bi-caret-up-fill"></i>
            <span class="upvote-count">${d.upvotes + (isUpvoted ? 1 : 0)}</span>
          </button>
          <div class="discussion-content-wrap">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="badge-nouriva badge-sand">${d.category}</span>
              <span class="text-muted small">${d.date}</span>
            </div>
            <h5 class="discussion-card-title">
              <a href="${d.url}?id=${d.id}">${d.title}</a>
            </h5>
            <p class="discussion-card-excerpt">${d.excerpt}</p>
            <div class="discussion-meta">
              <span><img src="${d.avatar}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;" alt="${d.author}"> ${d.author}</span>
              <span><i class="bi bi-chat-left-dots"></i> ${d.repliesCount} replies</span>
              <span><i class="bi bi-eye"></i> ${d.viewsCount} views</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach upvote listeners
    container.querySelectorAll('.discussion-upvote-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-upvote-id');
        const countSpan = btn.querySelector('.upvote-count');
        const nowUpvoted = toggleUpvote(id, countSpan);
        btn.classList.toggle('upvoted', nowUpvoted);
      });
    });
  }

  // Reply Composer on discussion-details.html
  function initReplyComposer() {
    const replyForm = document.getElementById('discussionReplyForm');
    const repliesContainer = document.getElementById('discussionRepliesContainer');
    const replyCountBadge = document.getElementById('detailReplyCount');

    if (!replyForm || !repliesContainer) return;

    replyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('replyContent');
      const authorNameInput = document.getElementById('replyAuthorName');
      const text = textarea ? textarea.value.trim() : '';
      const author = authorNameInput && authorNameInput.value.trim() ? authorNameInput.value.trim() : 'You (Community Member)';

      if (!text) {
        alert('Please write your response before posting.');
        return;
      }

      const newReply = document.createElement('div');
      newReply.className = 'discussion-card mb-3 animate__animated animate__fadeIn';
      newReply.style.borderLeft = '3px solid var(--forest-800)';
      newReply.innerHTML = `
        <div class="discussion-content-wrap">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--forest-800); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                ${author.charAt(0)}
              </div>
              <div>
                <span class="fw-semibold small d-block">${author}</span>
                <span class="text-muted" style="font-size: 0.72rem;">Just now</span>
              </div>
            </div>
            <span class="badge-nouriva badge-sage">Verified Post</span>
          </div>
          <p class="mb-0 text-secondary" style="font-size: 0.92rem; line-height: 1.6;">${text.replace(/\n/g, '<br>')}</p>
        </div>
      `;

      repliesContainer.appendChild(newReply);
      textarea.value = '';

      if (replyCountBadge) {
        const count = parseInt(replyCountBadge.textContent, 10) || 0;
        replyCountBadge.textContent = `${count + 1} Responses`;
      }

      if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
        window.NourivaBookmarks.showToast('Your reply was published!', 'success');
      }

      newReply.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Start a Discussion Modal Submission
  function initNewDiscussionModal() {
    const newForm = document.getElementById('newDiscussionForm');
    if (!newForm) return;

    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newDiscTitle').value.trim();
      const category = document.getElementById('newDiscCategory').value;
      const content = document.getElementById('newDiscContent').value.trim();
      const author = document.getElementById('newDiscAuthor').value.trim() || 'Community Member';

      if (!title || !content) {
        alert('Please fill out all required fields.');
        return;
      }

      const newDisc = {
        id: 'disc-' + Date.now(),
        title: title,
        category: category,
        author: author,
        role: 'Community Contributor',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        date: 'Just now',
        excerpt: content.substring(0, 180) + (content.length > 180 ? '...' : ''),
        repliesCount: 0,
        viewsCount: 1,
        upvotes: 1,
        url: 'discussion-details.html'
      };

      try {
        const custom = localStorage.getItem(STORAGE_KEY);
        const list = custom ? JSON.parse(custom) : [];
        list.unshift(newDisc);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }

      // Close modal
      const modalEl = document.getElementById('newDiscussionModal');
      if (modalEl && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }

      newForm.reset();
      renderDiscussionsList();

      if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
        window.NourivaBookmarks.showToast('Your discussion topic is now live!', 'success');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderDiscussionsList();
    initReplyComposer();
    initNewDiscussionModal();

    // Category filter pills
    const categoryPills = document.querySelectorAll('.community-category-pill');
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-category');
        renderDiscussionsList(cat);
      });
    });

    const searchInput = document.getElementById('communitySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activePill = document.querySelector('.community-category-pill.active');
        const cat = activePill ? activePill.getAttribute('data-category') : 'all';
        renderDiscussionsList(cat, e.target.value.toLowerCase().trim());
      });
    }
  });

  window.NourivaCommunity = {
    render: renderDiscussionsList,
    toggleUpvote: toggleUpvote
  };
})();
