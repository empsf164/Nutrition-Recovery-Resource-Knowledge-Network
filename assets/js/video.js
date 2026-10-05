/**
 * NOURIVA — Video Player & Transcript Controller
 * Handles interactive video playback simulation, chapters, and searchable transcript
 */

(function () {
  'use strict';

  function initVideoPlayer() {
    const player = document.getElementById('nourivaVideoPlayer');
    if (!player) return;

    const playCenterBtn = document.getElementById('videoPlayCenter');
    const playBarBtn = document.getElementById('videoPlayToggle');
    const playIcon = playBarBtn ? playBarBtn.querySelector('i') : null;
    const progressFill = document.getElementById('videoProgressFill');
    const progressTrack = document.getElementById('videoProgressTrack');
    const timeDisplay = document.getElementById('videoTimeDisplay');
    const speedBtn = document.getElementById('videoSpeedBtn');
    const chapterItems = document.querySelectorAll('.chapter-item');
    const transcriptLines = document.querySelectorAll('.transcript-line');

    let isPlaying = false;
    let currentTime = 45; // seconds
    const totalDuration = 840; // 14 min = 840s
    let playInterval = null;
    let playbackRate = 1.0;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTimeUI() {
      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
      }
      if (progressFill) {
        const percentage = (currentTime / totalDuration) * 100;
        progressFill.style.width = `${percentage}%`;
      }
      updateActiveChapter();
    }

    function updateActiveChapter() {
      chapterItems.forEach(item => {
        const startSec = parseInt(item.getAttribute('data-seconds') || '0', 10);
        const endSec = parseInt(item.getAttribute('data-end-seconds') || '9999', 10);

        if (currentTime >= startSec && currentTime < endSec) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (playIcon) playIcon.className = 'bi bi-pause-fill';
        if (playCenterBtn) playCenterBtn.style.opacity = '0';
        playInterval = setInterval(() => {
          if (currentTime < totalDuration) {
            currentTime += playbackRate;
            updateTimeUI();
          } else {
            pauseVideo();
          }
        }, 1000);
      } else {
        pauseVideo();
      }
    }

    function pauseVideo() {
      isPlaying = false;
      if (playIcon) playIcon.className = 'bi bi-play-fill';
      if (playCenterBtn) playCenterBtn.style.opacity = '1';
      clearInterval(playInterval);
    }

    function seekTo(seconds) {
      currentTime = Math.min(totalDuration, Math.max(0, seconds));
      updateTimeUI();
    }

    if (playCenterBtn) playCenterBtn.addEventListener('click', togglePlay);
    if (playBarBtn) playBarBtn.addEventListener('click', togglePlay);

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const fraction = clickX / rect.width;
        seekTo(fraction * totalDuration);
      });
    }

    // Chapters click jump
    chapterItems.forEach(item => {
      item.addEventListener('click', () => {
        const sec = parseInt(item.getAttribute('data-seconds') || '0', 10);
        seekTo(sec);
        if (!isPlaying) togglePlay();
      });
    });

    // Transcript timestamp click jump
    transcriptLines.forEach(line => {
      line.addEventListener('click', () => {
        const sec = parseInt(line.getAttribute('data-seconds') || '0', 10);
        seekTo(sec);
        if (!isPlaying) togglePlay();
        if (window.NourivaBookmarks && window.NourivaBookmarks.showToast) {
          window.NourivaBookmarks.showToast(`Jumped to ${formatTime(sec)}`, 'info');
        }
      });
    });

    // Speed toggle (1.0x -> 1.25x -> 1.5x -> 2.0x -> 1.0x)
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (playbackRate === 1.0) playbackRate = 1.25;
        else if (playbackRate === 1.25) playbackRate = 1.5;
        else if (playbackRate === 1.5) playbackRate = 2.0;
        else playbackRate = 1.0;

        speedBtn.textContent = `${playbackRate}x`;
      });
    }

    // Transcript inline filter search
    const transcriptSearch = document.getElementById('transcriptSearchInput');
    if (transcriptSearch) {
      transcriptSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        transcriptLines.forEach(line => {
          const text = line.textContent.toLowerCase();
          line.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
    }

    updateTimeUI();
  }

  // Videos Library Filter
  function initVideoLibraryFilters() {
    const filterContainer = document.getElementById('videoCardsGrid');
    if (!filterContainer) return;

    const cards = Array.from(filterContainer.querySelectorAll('.video-card-col'));
    const topicRadios = document.querySelectorAll('input[name="videoTopicFilter"]');
    const durationRadios = document.querySelectorAll('input[name="videoDurationFilter"]');
    const searchInput = document.getElementById('videoSearchInput');

    function applyVideoFilters() {
      const topic = document.querySelector('input[name="videoTopicFilter"]:checked')?.value || 'all';
      const duration = document.querySelector('input[name="videoDurationFilter"]:checked')?.value || 'all';
      const search = searchInput?.value.toLowerCase().trim() || '';

      cards.forEach(card => {
        const cTopic = card.getAttribute('data-topic') || '';
        const cDuration = card.getAttribute('data-duration-category') || '';
        const cText = card.textContent.toLowerCase();

        const matchTopic = topic === 'all' || cTopic.toLowerCase() === topic.toLowerCase();
        const matchDur = duration === 'all' || cDuration.toLowerCase() === duration.toLowerCase();
        const matchSearch = !search || cText.includes(search);

        if (matchTopic && matchDur && matchSearch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    topicRadios.forEach(r => r.addEventListener('change', applyVideoFilters));
    durationRadios.forEach(r => r.addEventListener('change', applyVideoFilters));
    if (searchInput) searchInput.addEventListener('input', applyVideoFilters);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayer();
    initVideoLibraryFilters();
  });
})();
