/**
 * KALA YATRA: A Timeline of Indian Art
 * Application UI & Interaction Logic
 * 
 * Features:
 * - Dynamic dual-mode timeline rendering (Horizontal & Vertical)
 * - Real-time Era filtering & full-text search
 * - Drag-to-scroll & mouse wheel navigation
 * - Deep dive modal with Vector vs Archival photo toggle
 * - Keyboard navigation (Arrows, Escape, Enter)
 * - Web Audio API synthesized Indian meditative ambiance drone
 * - Fully accessible & responsive
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. State Management
  // -------------------------------------------------------------------------
  const state = {
    artifacts: window.ART_DATA || [],
    filteredArtifacts: window.ART_DATA || [],
    currentArtifactIndex: 0,
    currentEra: 'all',
    searchQuery: '',
    isModalOpen: false,
    viewMode: 'horizontal', // 'horizontal' or 'vertical'
    showVectorInModal: true,
    isAudioPlaying: false,
    audioCtx: null,
    audioNodes: null
  };

  // DOM Elements
  const horizontalTrack = document.getElementById('horizontalTimelineTrack');
  const horizontalContainer = document.getElementById('horizontalScrollContainer');
  const verticalTrack = document.getElementById('verticalTimelineTrack');
  const meterFill = document.getElementById('timelineMeterFill');
  const searchInput = document.getElementById('searchInput');
  const eraFilterTrack = document.getElementById('eraFilterTrack');
  const filterChips = document.querySelectorAll('.filter-chip');
  const viewModeToggle = document.getElementById('viewModeToggle');
  const viewModeText = document.getElementById('viewModeText');
  const scrollLeftBtn = document.getElementById('timelineScrollLeft');
  const scrollRightBtn = document.getElementById('timelineScrollRight');
  const userHintBanner = document.getElementById('userHintBanner');
  const dismissHintBtn = document.getElementById('dismissHintBtn');
  const startJourneyBtn = document.getElementById('startJourneyBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioBtnText = document.getElementById('audioBtnText');

  // Modal Elements
  const modal = document.getElementById('artifactModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalVisualContainer = document.getElementById('modalVisualContainer');
  const btnShowVector = document.getElementById('btnShowVector');
  const btnShowPhoto = document.getElementById('btnShowPhoto');
  const modalCreditText = document.getElementById('modalCreditText');
  const modalEraBadge = document.getElementById('modalEraBadge');
  const modalDateLabel = document.getElementById('modalDateLabel');
  const modalTitle = document.getElementById('modalTitle');
  const modalPeriodVal = document.getElementById('modalPeriodVal');
  const modalRegionVal = document.getElementById('modalRegionVal');
  const modalMediumVal = document.getElementById('modalMediumVal');
  const modalCultureVal = document.getElementById('modalCultureVal');
  const modalFullStory = document.getElementById('modalFullStory');
  const modalWhyItMatters = document.getElementById('modalWhyItMatters');
  const modalFunFact = document.getElementById('modalFunFact');
  const modalCounterText = document.getElementById('modalCounterText');
  const btnPrevArtifact = document.getElementById('btnPrevArtifact');
  const btnNextArtifact = document.getElementById('btnNextArtifact');

  // -------------------------------------------------------------------------
  // 2. Timeline Rendering
  // -------------------------------------------------------------------------
  
  /**
   * Render both horizontal and vertical timeline tracks
   */
  function renderTimelines() {
    renderHorizontalTrack();
    renderVerticalTrack();
    updateProgressMeter();
    setupCardIntersections();
  }

  /**
   * Render horizontal timeline track with alternating top/bottom cards
   */
  function renderHorizontalTrack() {
    if (!horizontalTrack) return;

    // Preserve central line
    horizontalTrack.innerHTML = '<div class="timeline-center-line"></div>';

    // Render century ticks across the line
    const centuryTicks = [
      { year: -2500, label: "2500 BCE", pos: 350 },
      { year: -1000, label: "1000 BCE", pos: 950 },
      { year: -250,  label: "250 BCE",  pos: 1550 },
      { year: 1,     label: "1 CE",     pos: 2100 },
      { year: 500,   label: "500 CE",   pos: 2750 },
      { year: 1000,  label: "1000 CE",  pos: 3450 },
      { year: 1500,  label: "1500 CE",  pos: 4200 },
      { year: 1800,  label: "1800 CE",  pos: 4950 },
      { year: 1950,  label: "Modern",   pos: 5750 }
    ];

    centuryTicks.forEach(tick => {
      const tickEl = document.createElement('div');
      tickEl.className = 'century-ticker';
      tickEl.style.left = `${tick.pos}px`;
      tickEl.innerHTML = `
        <div class="century-tick"></div>
        <span class="century-label">${tick.label}</span>
      `;
      horizontalTrack.appendChild(tickEl);
    });

    // Render Artifact Nodes
    state.artifacts.forEach((artifact, index) => {
      const positionClass = index % 2 === 0 ? 'pos-top' : 'pos-bottom';
      const eraColor = window.getEraColor(artifact.era);

      const nodeEl = document.createElement('div');
      nodeEl.className = `timeline-node ${positionClass}`;
      nodeEl.dataset.id = artifact.id;
      nodeEl.dataset.era = artifact.era;
      nodeEl.dataset.index = index;

      nodeEl.innerHTML = `
        <div class="timeline-pin" style="border-color: ${eraColor};"></div>
        <div class="timeline-marker" style="border-color: ${eraColor}; color: ${eraColor};" title="Click to view ${artifact.title}"></div>
        
        <article class="timeline-card" tabindex="0" role="button" aria-label="Inspect ${artifact.title}">
          <div class="card-visual-wrapper">
            <span class="card-era-badge" style="color: ${eraColor}; border-color: ${eraColor};">${artifact.era}</span>
            <img src="${artifact.visual}" alt="${artifact.title} stylized replica" loading="lazy">
            <div class="card-inspect-badge" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <div class="card-date" style="color: ${eraColor};">${artifact.dateLabel}</div>
            <h3 class="card-title">${artifact.title}</h3>
            <div class="card-region">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${artifact.region.split(',')[0]}</span>
            </div>
            <p class="card-summary">${artifact.shortSummary}</p>
            <div class="card-action-link" style="color: ${eraColor};">
              <span>Explore History</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </article>
      `;

      // Event listeners for card and marker
      const card = nodeEl.querySelector('.timeline-card');
      const marker = nodeEl.querySelector('.timeline-marker');

      const triggerOpen = () => openModal(index);

      card.addEventListener('click', triggerOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });
      marker.addEventListener('click', triggerOpen);

      horizontalTrack.appendChild(nodeEl);
    });
  }

  /**
   * Render vertical timeline track for mobile / responsive view
   */
  function renderVerticalTrack() {
    if (!verticalTrack) return;
    verticalTrack.innerHTML = '';

    state.artifacts.forEach((artifact, index) => {
      const eraColor = window.getEraColor(artifact.era);

      const vNode = document.createElement('div');
      vNode.className = 'v-node';
      vNode.dataset.id = artifact.id;
      vNode.dataset.era = artifact.era;
      vNode.dataset.index = index;

      vNode.innerHTML = `
        <div class="v-marker" style="border-color: ${eraColor}; color: ${eraColor};"></div>
        <article class="timeline-card" tabindex="0" role="button" aria-label="Inspect ${artifact.title}">
          <div class="card-visual-wrapper">
            <span class="card-era-badge" style="color: ${eraColor};">${artifact.era}</span>
            <img src="${artifact.visual}" alt="${artifact.title} stylized replica" loading="lazy">
          </div>
          <div class="card-body">
            <div class="card-date" style="color: ${eraColor};">${artifact.dateLabel}</div>
            <h3 class="card-title">${artifact.title}</h3>
            <div class="card-region">${artifact.region}</div>
            <p class="card-summary">${artifact.shortSummary}</p>
            <div class="card-action-link" style="color: ${eraColor};">
              <span>Explore History</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </article>
      `;

      const card = vNode.querySelector('.timeline-card');
      const marker = vNode.querySelector('.v-marker');
      const triggerOpen = () => openModal(index);

      card.addEventListener('click', triggerOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });
      marker.addEventListener('click', triggerOpen);

      verticalTrack.appendChild(vNode);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  function setupCardIntersections() {
    const cards = document.querySelectorAll('.timeline-card');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 100px 0px 100px'
      });

      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.6s var(--ease-smooth) ${index % 4 * 0.1}s, transform 0.6s var(--ease-smooth) ${index % 4 * 0.1}s`;
        observer.observe(card);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Filtering & Search Logic
  // -------------------------------------------------------------------------
  
  function applyFilters() {
    const query = state.searchQuery.trim().toLowerCase();
    const era = state.currentEra;

    const allNodes = document.querySelectorAll('.timeline-node, .v-node');

    let visibleCount = 0;

    allNodes.forEach(node => {
      const artifactId = node.dataset.id;
      const artifact = state.artifacts.find(a => a.id === artifactId);
      if (!artifact) return;

      const matchesEra = (era === 'all' || artifact.era.toLowerCase() === era.toLowerCase());
      
      const matchesSearch = !query || (
        artifact.title.toLowerCase().includes(query) ||
        artifact.period.toLowerCase().includes(query) ||
        artifact.region.toLowerCase().includes(query) ||
        artifact.medium.toLowerCase().includes(query) ||
        artifact.artistOrCulture.toLowerCase().includes(query) ||
        artifact.shortSummary.toLowerCase().includes(query) ||
        artifact.dateLabel.toLowerCase().includes(query)
      );

      if (matchesEra && matchesSearch) {
        node.style.display = '';
        visibleCount++;
        // Fade in
        requestAnimationFrame(() => {
          node.style.opacity = '1';
          node.style.transform = 'scale(1)';
        });
      } else {
        node.style.opacity = '0';
        node.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (node.style.opacity === '0') {
            node.style.display = 'none';
          }
        }, 250);
      }
    });

    // Dismiss hint banner on first filter/search action
    dismissHint();
  }

  // Filter Chips Click
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');

      state.currentEra = chip.dataset.era;
      applyFilters();

      // In horizontal view, scroll back smoothly toward the first matching item
      if (state.currentEra !== 'all' && horizontalContainer) {
        const firstMatch = horizontalTrack.querySelector(`.timeline-node[data-era="${state.currentEra}"]`);
        if (firstMatch) {
          const scrollTarget = firstMatch.offsetLeft - 120;
          horizontalContainer.scrollTo({
            left: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Search Input Handler (Debounced)
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value;
        applyFilters();
      }, 150);
    });
  }

  // -------------------------------------------------------------------------
  // 5. Horizontal Scrolling & Drag Navigation
  // -------------------------------------------------------------------------
  
  if (horizontalContainer) {
    // Update progress meter on scroll
    horizontalContainer.addEventListener('scroll', () => {
      updateProgressMeter();
      highlightActiveEraByScroll();
    });

    // Left & Right Scroll Buttons
    if (scrollLeftBtn) {
      scrollLeftBtn.addEventListener('click', () => {
        horizontalContainer.scrollBy({ left: -450, behavior: 'smooth' });
        dismissHint();
      });
    }

    if (scrollRightBtn) {
      scrollRightBtn.addEventListener('click', () => {
        horizontalContainer.scrollBy({ left: 450, behavior: 'smooth' });
        dismissHint();
      });
    }

    // Convert Vertical Mouse Wheel to Horizontal Scroll
    horizontalContainer.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        horizontalContainer.scrollLeft += e.deltaY * 1.5;
        dismissHint();
      }
    }, { passive: false });

    // Drag-to-Scroll Functionality
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    horizontalContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      horizontalContainer.classList.add('is-dragging');
      startX = e.pageX - horizontalContainer.offsetLeft;
      scrollLeft = horizontalContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      horizontalContainer.classList.remove('is-dragging');
    });

    horizontalContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - horizontalContainer.offsetLeft;
      const walk = (x - startX) * 1.8;
      horizontalContainer.scrollLeft = scrollLeft - walk;
      dismissHint();
    });
  }

  function updateProgressMeter() {
    if (!horizontalContainer || !meterFill) return;
    const maxScroll = horizontalContainer.scrollWidth - horizontalContainer.clientWidth;
    if (maxScroll <= 0) {
      meterFill.style.width = '100%';
      return;
    }
    const percent = Math.min(100, Math.max(0, (horizontalContainer.scrollLeft / maxScroll) * 100));
    meterFill.style.width = `${percent}%`;
  }

  // Sticky Era Highlight during scrolling
  function highlightActiveEraByScroll() {
    if (!horizontalContainer || state.currentEra !== 'all') return;
    const scrollPos = horizontalContainer.scrollLeft + horizontalContainer.clientWidth / 2;
    const nodes = horizontalTrack.querySelectorAll('.timeline-node');
    
    let closestNode = null;
    let minDistance = Infinity;

    nodes.forEach(node => {
      const nodeCenter = node.offsetLeft + node.clientWidth / 2;
      const dist = Math.abs(scrollPos - nodeCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = node;
      }
    });

    if (closestNode) {
      const era = closestNode.dataset.era;
      filterChips.forEach(chip => {
        if (chip.dataset.era === era) {
          chip.style.borderColor = window.getEraColor(era);
        } else if (chip.dataset.era !== 'all') {
          chip.style.borderColor = '';
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6. View Mode Toggle (Horizontal Pan vs Vertical Story)
  // -------------------------------------------------------------------------
  if (viewModeToggle) {
    viewModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('force-vertical');
      const isVertical = document.body.classList.contains('force-vertical');
      state.viewMode = isVertical ? 'vertical' : 'horizontal';

      if (viewModeText) {
        viewModeText.textContent = isVertical ? 'Horizontal View' : 'Vertical View';
      }
      dismissHint();
    });
  }

  // -------------------------------------------------------------------------
  // 7. Modal / Artifact Deep Dive Panel
  // -------------------------------------------------------------------------
  
  function openModal(index) {
    if (index < 0 || index >= state.artifacts.length) return;
    state.currentArtifactIndex = index;
    state.isModalOpen = true;

    const artifact = state.artifacts[index];
    const eraColor = window.getEraColor(artifact.era);

    // Populate metadata
    modalEraBadge.textContent = artifact.era;
    modalEraBadge.style.backgroundColor = eraColor;
    modalDateLabel.textContent = artifact.dateLabel;
    modalDateLabel.style.color = eraColor;
    modalTitle.textContent = artifact.title;

    modalPeriodVal.textContent = artifact.period;
    modalRegionVal.textContent = artifact.region;
    modalMediumVal.textContent = artifact.medium;
    modalCultureVal.textContent = artifact.artistOrCulture;

    // Narrative paragraphs
    modalFullStory.innerHTML = artifact.fullDescription
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('');

    modalWhyItMatters.textContent = artifact.whyItMatters;
    modalFunFact.textContent = artifact.funFact;
    modalCounterText.textContent = `${index + 1} / ${state.artifacts.length}`;

    // Render visual (Vector or Archival Photo)
    state.showVectorInModal = true;
    updateModalVisual();

    // Show modal
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    modalCloseBtn.focus();
    dismissHint();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.isModalOpen = false;
  }

  function updateModalVisual() {
    const artifact = state.artifacts[state.currentArtifactIndex];
    if (!artifact) return;

    if (state.showVectorInModal) {
      modalVisualContainer.innerHTML = `<img src="${artifact.visual}" alt="${artifact.title} Stylized Vector Replica">`;
      btnShowVector.classList.add('is-active');
      btnShowPhoto.classList.remove('is-active');
      modalCreditText.textContent = artifact.imageCredit;
    } else {
      modalVisualContainer.innerHTML = `<img src="${artifact.photoUrl}" alt="${artifact.title} Archival Photograph" onerror="this.src='${artifact.visual}'">`;
      btnShowPhoto.classList.add('is-active');
      btnShowVector.classList.remove('is-active');
      modalCreditText.textContent = `Archival photograph (Public Domain / Wikimedia Commons) · ${artifact.region}`;
    }
  }

  // Modal Toggle Visual Switchers
  if (btnShowVector) {
    btnShowVector.addEventListener('click', () => {
      state.showVectorInModal = true;
      updateModalVisual();
    });
  }

  if (btnShowPhoto) {
    btnShowPhoto.addEventListener('click', () => {
      state.showVectorInModal = false;
      updateModalVisual();
    });
  }

  // Modal Close Events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Previous & Next Artifact in Modal
  if (btnPrevArtifact) {
    btnPrevArtifact.addEventListener('click', () => {
      const prevIdx = (state.currentArtifactIndex - 1 + state.artifacts.length) % state.artifacts.length;
      openModal(prevIdx);
    });
  }

  if (btnNextArtifact) {
    btnNextArtifact.addEventListener('click', () => {
      const nextIdx = (state.currentArtifactIndex + 1) % state.artifacts.length;
      openModal(nextIdx);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Keyboard Navigation
  // -------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // If modal is open
    if (state.isModalOpen) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (state.currentArtifactIndex - 1 + state.artifacts.length) % state.artifacts.length;
        openModal(prevIdx);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (state.currentArtifactIndex + 1) % state.artifacts.length;
        openModal(nextIdx);
      }
      return;
    }

    // Timeline arrow navigation when modal closed
    if (e.key === 'ArrowLeft' && horizontalContainer) {
      horizontalContainer.scrollBy({ left: -300, behavior: 'smooth' });
      dismissHint();
    } else if (e.key === 'ArrowRight' && horizontalContainer) {
      horizontalContainer.scrollBy({ left: 300, behavior: 'smooth' });
      dismissHint();
    }
  });

  // -------------------------------------------------------------------------
  // 9. Hint Banner & Smooth CTA
  // -------------------------------------------------------------------------
  function dismissHint() {
    if (userHintBanner && userHintBanner.style.display !== 'none') {
      userHintBanner.style.opacity = '0';
      setTimeout(() => {
        userHintBanner.style.display = 'none';
      }, 300);
    }
  }

  if (dismissHintBtn) {
    dismissHintBtn.addEventListener('click', dismissHint);
  }

  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const timelineSection = document.getElementById('timeline');
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: 'smooth' });
      }
      dismissHint();
    });
  }

  // -------------------------------------------------------------------------
  // 10. Web Audio API Meditative Sound Drone (Tanpura-inspired)
  // -------------------------------------------------------------------------
  function toggleAmbianceSound() {
    if (!state.isAudioPlaying) {
      startAmbiance();
    } else {
      stopAmbiance();
    }
  }

  function startAmbiance() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!state.audioCtx) {
        state.audioCtx = new AudioContext();
      }

      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      // Synthesize soothing Tanpura Sa-Pa drone (Fundamental ~136.1 Hz Indian Sa + 204.1 Hz Pa)
      const masterGain = state.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, state.audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, state.audioCtx.currentTime + 3);
      masterGain.connect(state.audioCtx.destination);

      // Low Pass filter for warm organic resonance
      const filter = state.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, state.audioCtx.currentTime);
      filter.connect(masterGain);

      // Oscillators (Sa and Pa notes with gentle chorus detuning)
      const osc1 = state.audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, state.audioCtx.currentTime); // Sa (OM frequency)

      const osc2 = state.audioCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(204.15, state.audioCtx.currentTime); // Pa (Fifth)

      const osc3 = state.audioCtx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(272.2, state.audioCtx.currentTime); // High Sa octave

      // LFO for slow breathing vibrato / swell
      const lfo = state.audioCtx.createOscillator();
      const lfoGain = state.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2, state.audioCtx.currentTime); // 5-second breath cycle
      lfoGain.gain.setValueAtTime(8, state.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      osc1.start();
      osc2.start();
      osc3.start();
      lfo.start();

      state.audioNodes = { masterGain, osc1, osc2, osc3, lfo };
      state.isAudioPlaying = true;

      audioToggleBtn.classList.add('is-playing');
      audioBtnText.textContent = 'Pause Ambiance';
    } catch (err) {
      console.warn('Web Audio initialization note:', err);
    }
  }

  function stopAmbiance() {
    if (state.audioNodes && state.audioCtx) {
      state.audioNodes.masterGain.gain.setValueAtTime(state.audioNodes.masterGain.gain.value, state.audioCtx.currentTime);
      state.audioNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 1.2);
      setTimeout(() => {
        try {
          state.audioNodes.osc1.stop();
          state.audioNodes.osc2.stop();
          state.audioNodes.osc3.stop();
          state.audioNodes.lfo.stop();
        } catch (e) {}
        state.isAudioPlaying = false;
        audioToggleBtn.classList.remove('is-playing');
        audioBtnText.textContent = 'Sound Ambiance';
      }, 1300);
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAmbianceSound);
  }

  // -------------------------------------------------------------------------
  // 11. Initialization
  // -------------------------------------------------------------------------
  renderTimelines();
  applyFilters();
});
