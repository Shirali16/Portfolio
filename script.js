/**
 * PORTFOLIO OF SHIRALI S - INTERACTIVE SCRIPTS
 * Includes: Web Audio 8-bit Synthesizer, Arcade Cabinet Mechanics (Buttons A, B, C),
 * Interactive Hair Clips Navigator, Project Modals, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. WEB AUDIO API - 8-BIT RETRO CHIPTUNE SOUND ENGINE (FAIL-SAFE)
  // ==========================================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {
      // Audio context policy fallback
    }
  }

  // Play synthesized retro tones safely
  function playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1, pitchDecay = 0) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (pitchDecay !== 0) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(10, freq + pitchDecay),
          audioCtx.currentTime + duration
        );
      }

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio silent fallback
    }
  }

  // Preset Arcade Sound Effects (All wrapped in fail-safe try-catch)
  const SFX = {
    coin: () => {
      try {
        playTone(987.77, 'square', 0.08, 0.12);
        setTimeout(() => playTone(1318.51, 'square', 0.28, 0.15), 80);
      } catch (e) {}
    },
    start: () => {
      try {
        const notes = [330, 392, 523, 659, 784];
        notes.forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 'triangle', 0.14, 0.18), idx * 75);
        });
      } catch (e) {}
    },
    chime: () => {
      try {
        const notes = [587.33, 739.99, 880];
        notes.forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 'sine', 0.16, 0.14), idx * 70);
        });
      } catch (e) {}
    },
    blip: () => {
      try {
        playTone(600, 'square', 0.05, 0.06);
      } catch (e) {}
    },
    deny: () => {
      try {
        playTone(220, 'sawtooth', 0.12, 0.15);
        setTimeout(() => playTone(165, 'sawtooth', 0.22, 0.15), 110);
      } catch (e) {}
    }
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        soundToggleBtn.classList.remove('muted');
        soundToggleBtn.querySelector('.sound-icon').textContent = '🔊';
        soundToggleBtn.querySelector('.sound-label').textContent = 'SFX: ON';
        SFX.coin();
        showToast('8-BIT SFX: ACTIVATED');
      } else {
        soundToggleBtn.classList.add('muted');
        soundToggleBtn.querySelector('.sound-icon').textContent = '🔇';
        soundToggleBtn.querySelector('.sound-label').textContent = 'SFX: MUTED';
        showToast('8-BIT SFX: MUTED');
      }
    });
  }

  // ==========================================================================
  // 2. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ==========================================================================
  // 3. SMOOTH NAVIGATION HELPER (CROSS-BROWSER RELIABILITY)
  // ==========================================================================
  function smoothScrollTo(elementId) {
    const target = document.getElementById(elementId);
    if (!target) return;
    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      window.scrollTo({
        top: target.offsetTop - 30,
        behavior: 'smooth'
      });
    }

    // Flash a pink halo on the destination section
    target.style.transition = 'outline 0.3s ease';
    target.style.outline = '2px solid var(--arcade-pink)';
    setTimeout(() => {
      target.style.outline = '';
    }, 1200);
  }

  // ==========================================================================
  // 4. ARCADE CABINET BUTTONS A, B, C & SCREEN INTERACTIONS
  // ==========================================================================
  const btnKeyA = document.getElementById('btn-key-a');
  const btnKeyB = document.getElementById('btn-key-b');
  const btnKeyC = document.getElementById('btn-key-c');
  const btnArcadeYes = document.getElementById('btn-arcade-yes');
  const btnArcadeNo = document.getElementById('btn-arcade-no');
  const coinSlotBtn = document.getElementById('insert-coin-btn');
  const coinStatus = document.getElementById('coin-status');
  let coinCount = 1;

  // Button A: Go to Slide 2 (Portfolio Story)
  if (btnKeyA) {
    btnKeyA.addEventListener('click', (e) => {
      e.preventDefault();
      SFX.chime();
      showToast('BUTTON A ➔ PORTFOLIO STORY');
      smoothScrollTo('editorial-bio');
    });
  }

  // Button B: Go to Slide 3 (Hair Clips Navigator)
  if (btnKeyB) {
    btnKeyB.addEventListener('click', (e) => {
      e.preventDefault();
      SFX.chime();
      showToast('BUTTON B ➔ HAIR CLIPS NAVIGATOR');
      smoothScrollTo('hairclips-nav');
    });
  }

  // Button C: Go to Connect & Resume Slide
  if (btnKeyC) {
    btnKeyC.addEventListener('click', (e) => {
      e.preventDefault();
      SFX.start();
      showToast('BUTTON C ➔ CONNECT, RESUME & SOCIALS');
      smoothScrollTo('contact');
    });
  }

  // Screen YES Button
  if (btnArcadeYes) {
    btnArcadeYes.addEventListener('click', (e) => {
      e.preventDefault();
      SFX.start();
      showToast('PLAYER 1 READY! EXPLORING PORTFOLIO...');
      const crtScreen = document.querySelector('.crt-screen');
      if (crtScreen) {
        crtScreen.style.filter = 'brightness(1.5)';
        setTimeout(() => (crtScreen.style.filter = ''), 250);
      }
      setTimeout(() => {
        smoothScrollTo('editorial-bio');
      }, 300);
    });
  }

  // Screen NO Button
  if (btnArcadeNo) {
    btnArcadeNo.addEventListener('click', (e) => {
      e.preventDefault();
      SFX.deny();
      showToast('ARCADE PROMPT: PRESS "YES" OR BUTTON [A] TO PLAY!');
      const cabinet = document.querySelector('.cabinet-chassis');
      if (cabinet) {
        cabinet.style.transform = 'translateX(-6px)';
        setTimeout(() => (cabinet.style.transform = 'translateX(6px)'), 70);
        setTimeout(() => (cabinet.style.transform = ''), 140);
      }
    });
  }

  // Coin Slot Click
  if (coinSlotBtn) {
    coinSlotBtn.addEventListener('click', () => {
      coinCount++;
      SFX.coin();
      if (coinStatus) {
        coinStatus.textContent = `[ ${coinCount} COINS INSERTED • CREDITS ACTIVE ]`;
        coinStatus.style.color = '#38ef7d';
        setTimeout(() => {
          coinStatus.style.color = '';
        }, 1500);
      }
      showToast(`COIN INSERTED! CREDITS: ${coinCount}`);
    });
  }

  // Joystick Tilt Animation
  const joystick = document.getElementById('joystick-left');
  if (joystick) {
    const stick = joystick.querySelector('.joystick-stick');
    joystick.addEventListener('click', () => {
      SFX.blip();
      if (stick) {
        stick.style.transform = 'rotate(-22deg)';
        setTimeout(() => (stick.style.transform = 'rotate(22deg)'), 150);
        setTimeout(() => (stick.style.transform = ''), 300);
      }
    });
  }

  // ==========================================================================
  // 5. INTERACTIVE HAIR CLIPS NAVIGATOR (5 CLIPS - HOVER ONLY, NO PERSISTENT PINK CIRCLE)
  // ==========================================================================
  const clipHotspots = document.querySelectorAll('.clip-hotspot');

  clipHotspots.forEach((spot) => {
    spot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = spot.getAttribute('data-target');
      const title = spot.getAttribute('data-title') || targetId;

      SFX.chime();
      showToast(`HAIR CLIP ACTIVATED ➔ ${title.toUpperCase()}`);

      // Blur immediately so no browser focus ring or pseudo-active circle stays behind
      spot.blur();

      if (targetId) {
        smoothScrollTo(targetId);
      }
    });
  });

  // ==========================================================================
  // 6. PROJECT MODAL SPECIFICATIONS
  // ==========================================================================
  const projectSpecs = {
    prism: {
      badge: 'FLAGSHIP AI SYSTEM',
      title: 'PRISM AI : Multi-Agent AI Research System',
      content: `
        <p><strong>Overview:</strong> PRISM AI is an autonomous, multi-agent AI research pipeline engineered to streamline complex research synthesis and technical report creation.</p>
        <br>
        <h4>Key Technical Architecture:</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem;">
          <li><strong>Agent Orchestration:</strong> Coordinated specialist agents (Retrieval Agent, Fact-Verification Agent, Synthesis Agent, and Report Formatting Agent) communicating via structured prompts and contextual memory.</li>
          <li><strong>Quality & Bias Scorecard:</strong> Proprietary algorithmic scoring mechanism that parses multi-PDF documents, evaluates assertion corroboration across sources, and detects skewed citations or lack of consensus.</li>
          <li><strong>Interactive Web Platform:</strong> Developed in Python with Streamlit, providing client-side key storage, asynchronous job progress bars, and one-click export into formatted, professional PDF reports.</li>
        </ul>
        <p><strong>Impact:</strong> Reduces hours of manual literature review and source verification into automated, defensible multi-page research dossiers with verifiable citations.</p>
      `
    },
    forex: {
      badge: 'FINANCIAL ANALYTICS ENGINE',
      title: 'Watch How Global Currencies Move',
      content: `
        <p><strong>Overview:</strong> An interactive quantitative analytics application designed to turn raw, messy daily foreign exchange rates into defensible observations for traders and analysts.</p>
        <br>
        <h4>Pipeline Details:</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem;">
          <li><strong>Tick Data Ingestion:</strong> Handles messy international currency exports for 4 major currency pairs against the US Dollar (USD).</li>
          <li><strong>Noise Reduction & Signal Extraction:</strong> Filters out micro-fluctuations and erroneous ticks to reveal true macro price momentum and volatility boundaries.</li>
          <li><strong>Interactive Streamlit UI:</strong> Provides dynamic date slicing, moving average envelopes, rate-of-change indicators, and exportable summary tables.</li>
        </ul>
        <p><strong>Stack:</strong> Python, Streamlit, Pandas, NumPy, Time-Series Data Wrangling.</p>
      `
    },
    divide: {
      badge: 'DATA VISUALIZATION & SOCIAL IMPACT',
      title: 'The Digital Divide Dashboard',
      content: `
        <p><strong>Overview:</strong> An interactive data storytelling web platform transforming raw World Bank development metrics into an engaging visual study on global inequality in technology access.</p>
        <br>
        <h4>Key Highlights:</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem;">
          <li><strong>Data Cleaning & Synthesis:</strong> Cleaned large-scale, sparse historical datasets across multiple continents, handling missing indicators and regional aggregates.</li>
          <li><strong>Visual Narrative:</strong> Users can interactively compare internet adoption rates, mobile infrastructure density, and GDP per capita to understand socio-economic correlations.</li>
          <li><strong>Accessible Streamlit Deployment:</strong> Highly responsive charts and intuitive comparative sliders designed for researchers and policymakers.</li>
        </ul>
        <p><strong>Stack:</strong> Python, Streamlit, Data Wrangling, Plotly Visualizations.</p>
      `
    },
    records: {
      badge: 'SYSTEMS PROGRAMMING & AUTO UI',
      title: 'Student Record System (Modular C & HTML)',
      content: `
        <p><strong>Overview:</strong> A high-performance systems engineering project combining low-level C memory management with modern automated web visualization.</p>
        <br>
        <h4>System Components:</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem;">
          <li><strong>Modular C Backend:</strong> Custom struct implementations, dynamic memory allocation, binary file persistence, and logarithmic sorting/searching routines.</li>
          <li><strong>Automated Dashboard Synthesis:</strong> The C backend directly serializes memory records into an interactive, beautifully formatted HTML5/CSS3 web dashboard for direct browser inspection without external web servers.</li>
          <li><strong>Data Integrity & Error Handling:</strong> Rigorous validation against data corruption, duplicate student IDs, and corrupted file records.</li>
        </ul>
        <p><strong>Stack:</strong> C Language, Algorithms, Data Structures, File I/O Persistence, HTML5, CSS3.</p>
      `
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const modalDismiss = document.getElementById('modal-dismiss');

  function openProjectModal(key) {
    const spec = projectSpecs[key];
    if (!spec || !projectModal) return;

    modalBadge.textContent = spec.badge;
    modalTitle.textContent = spec.title;
    modalContent.innerHTML = spec.content;
    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    SFX.blip();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    SFX.blip();
  }

  document.querySelectorAll('.btn-project-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      openProjectModal(key);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalDismiss) modalDismiss.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // ==========================================================================
  // 7. CONTACT FORM TRANSMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      SFX.start();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value || 'Portfolio Inquiry';
      const message = document.getElementById('contact-message').value;

      showToast(`TRANSMISSION DISPATCHED! THANK YOU, ${name.toUpperCase()}!`, 4000);
      contactForm.reset();

      // Open mailto fallback
      const mailtoUrl = `mailto:shiralishashikumar2007@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 900);
    });
  }

  // ==========================================================================
  // 8. INTERACTIVE WALKING PIXEL GIRL COMPANION (PERSISTENT & DYNAMIC)
  // Walks when scrolling, bobs when idle, jumps on click, comments per section
  // ==========================================================================
  const companionWidget = document.getElementById('pixel-companion-widget');
  const companionSprite = document.getElementById('companion-sprite');
  const companionSpeech = document.getElementById('companion-speech');

  // Walking state: triggered dynamically while user scrolls
  let scrollTimeout = null;
  window.addEventListener('scroll', () => {
    if (!companionSprite) return;
    companionSprite.classList.add('walking');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      companionSprite.classList.remove('walking');
    }, 160);
  }, { passive: true });

  // Dynamic contextual dialogue tailored to each section
  const sectionSpeeches = {
    'hero': "Hi! I'm Shirali 🎧 Welcome! Press [A], [B], or [C]!",
    'editorial-bio': "Building practical AI tools that make life safer & easier ✨",
    'hairclips-nav': "Click any hair clip to jump straight to a section! 🌸",
    'skills': "Multi-Agent AI, Python, C & Cybersecurity 💻",
    'projects': "Check out PRISM AI, Forex Engine & Data Dashboards 🚀",
    'experience': "Deloitte Simulation & Heritage Club Leadership 💼",
    'education': "IIT Roorkee AI Minor ('26-'27) & GSSSIETW 9.0 CGPA 🎓",
    'achievements': "Infosys & Cisco Certified in AI & Cyber Defense 🏆",
    'contact': "Let's connect! Bridged right here between the hands 🤝"
  };

  let currentSection = '';
  function updateCompanionSpeech(text) {
    if (!companionSpeech) return;
    const span = companionSpeech.querySelector('span');
    if (span && span.textContent !== text) {
      companionSpeech.style.animation = 'none';
      void companionSpeech.offsetWidth; // trigger reflow
      companionSpeech.style.animation = 'bubblePop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      span.textContent = text;
    }
  }

  // Observe active section to update companion dialogue seamlessly
  const sectionsToObserve = Object.keys(sectionSpeeches)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionsToObserve.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          const id = entry.target.id;
          if (sectionSpeeches[id] && currentSection !== id) {
            currentSection = id;
            updateCompanionSpeech(sectionSpeeches[id]);
          }
        }
      });
    }, { threshold: [0.25, 0.5, 0.75] });

    sectionsToObserve.forEach((sec) => observer.observe(sec));
  }

  // Interactive Click on Companion: Jump animation + fun remark
  const funRemarks = [
    "You clicked me! (＾▽＾) Thanks for visiting!",
    "Did you know? My academic CGPA is 9.0/10 at GSSSIETW! 🌟",
    "PRISM AI features automated bias & fact-check scoring! 🔮",
    "Studying AI Foundations with IIT Roorkee & Masai School! 🎓",
    "Don't forget to dispatch a transmission below! 💌"
  ];
  let remarkIdx = 0;

  if (companionSprite) {
    companionSprite.addEventListener('click', () => {
      SFX.chime();
      companionSprite.classList.remove('jumping');
      void companionSprite.offsetWidth;
      companionSprite.classList.add('jumping');
      setTimeout(() => {
        companionSprite.classList.remove('jumping');
      }, 550);

      const remark = funRemarks[remarkIdx % funRemarks.length];
      remarkIdx++;
      updateCompanionSpeech(remark);
      showToast('COMPANION: (◕‿◕) HOORAY!');
    });
  }
});
