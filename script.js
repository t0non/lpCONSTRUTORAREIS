/* ===================================================
   CONSTRUTORA REIS â€” JavaScript
   Interactivity, Animations, Conversion Tracking
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  /* â€”â€”â€” NAVBAR: Scroll Effect â€”â€”â€” */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* â€”â€”â€” MOBILE MENU â€”â€”â€” */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* â€”â€”â€” HERO: Ken Burns effect trigger â€”â€”â€” */
  setTimeout(() => {
    document.querySelector('.hero').classList.add('loaded');
  }, 100);

  /* â€”â€”â€” SCROLL ANIMATIONS (Intersection Observer) â€”â€”â€” */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-up elements
  document.querySelectorAll('.animate-fade-up').forEach(el => {
    observer.observe(el);
  });

  // Cards and sections fade in
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, 80 * i);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.emp-card, .diff-card, .dep-card, .step, .value-item').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    cardObserver.observe(el);
  });

  /* === COUNTER ANIMATION === */
  setTimeout(() => {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
    });
  }, 400); // Small delay to let the hero CSS animation start first

  function animateCounter(el, target) {
    const duration = 1800;
    const start    = performance.now();
    const easeOut  = t => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const val      = Math.round(easeOut(progress) * target);
      el.textContent = val;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /* â€”â€”â€” FAQ ACCORDION â€”â€”â€” */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* â€”â€”â€” FORM: WhatsApp Redirect on Submit â€”â€”â€” */
  const form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome      = document.getElementById('form-nome').value.trim();
      const whatsapp  = document.getElementById('form-whatsapp').value.trim();
      const interesse = document.getElementById('form-interesse').value;
      const orcamento = document.getElementById('form-orcamento').value;

      if (!nome || !whatsapp || !interesse) {
        showFormError('Por favor, preencha os campos obrigatórios.');
        return;
      }

      const phone = whatsapp.replace(/\D/g, '');
      if (phone.length < 10) {
        showFormError('Por favor, insira um número de WhatsApp válido.');
        return;
      }

      // Build WhatsApp message
      const interesseMap = {
        construcao:  'construção de casa ou galpão',
        reforma:     'reformas em geral',
        projeto:     'projetos arquitetônicos',
        manutencao:  'manutenção e reparos (elétrica/hidráulica)',
        outro:       'outros serviços'
      };

      const orcamentoMap = {
        'ate200':   'até R$ 200.000',
        '200-400':  'entre R$ 200.000 e R$ 400.000',
        '400-600':  'entre R$ 400.000 e R$ 600.000',
        'acima600': 'acima de R$ 600.000'
      };

      let msg = `Olá! Meu nome é *${nome}* e tenho interesse em ${interesseMap[interesse] || interesse}.`;
      if (orcamento) msg += ` Meu orçamento é ${orcamentoMap[orcamento] || orcamento}.`;
      msg += ` Poderia me ajudar? ðŸ˜Š`;

      const submitBtn = document.getElementById('form-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-spinner"></span> Abrindo WhatsApp...`;

      setTimeout(() => {
        const url = `https://wa.me/5531987778187?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        showFormSuccess();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.533 5.862L.057 23.428a.5.5 0 0 0 .609.61l5.633-1.476A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.371l-.36-.214-3.72.975.993-3.624-.234-.373A9.818 9.818 0 0 1 12 2.182c5.426 0 9.818 4.392 9.818 9.818 0 5.427-4.392 9.818-9.818 9.818z"/></svg> Receber Proposta pelo WhatsApp`;
      }, 600);
    });
  }

  function showFormError(msg) {
    removeAlert();
    const alert = document.createElement('div');
    alert.className = 'form-alert form-alert-error';
    alert.textContent = 'âš ï¸ ' + msg;
    form.insertBefore(alert, form.querySelector('button'));
    setTimeout(removeAlert, 4000);
  }

  function showFormSuccess() {
    removeAlert();
    const alert = document.createElement('div');
    alert.className = 'form-alert form-alert-success';
    alert.textContent = 'âœ… Perfeito! Você será atendido pelo WhatsApp em instantes.';
    form.insertBefore(alert, form.querySelector('button'));
    setTimeout(removeAlert, 6000);
  }

  function removeAlert() {
    document.querySelectorAll('.form-alert').forEach(a => a.remove());
  }

  /* â€”â€”â€” PHONE MASK â€”â€”â€” */
  const phoneInput = document.getElementById('form-whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length <= 11) {
        v = v.replace(/^(\d{2})(\d)/,       '($1) $2');
        v = v.replace(/(\d{4,5})(\d{4})$/,  '$1-$2');
        e.target.value = v;
      }
    });
  }

  /* â€”â€”â€” SMOOTH SCROLL for nav links â€”â€”â€” */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* â€”â€”â€” ACTIVE NAV LINK on scroll â€”â€”â€” */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* â€”â€”â€” WHATSAPP FLOAT: Show after 3 seconds â€”â€”â€” */
  const wppFloat = document.getElementById('btn-whatsapp-float');
  if (wppFloat) {
    wppFloat.style.opacity    = '0';
    wppFloat.style.transform  = 'scale(0.5) translateY(20px)';
    wppFloat.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
      wppFloat.style.opacity   = '1';
      wppFloat.style.transform = 'scale(1) translateY(0)';
    }, 2500);
  }

  /* â€”â€”â€” EXIT INTENT POPUP (desktop only) â€”â€”â€” */
  let exitShown = false;
  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0 && !exitShown) {
      exitShown = true;
      showExitIntent();
    }
  });

  function showExitIntent() {
    const overlay = document.createElement('div');
    overlay.id = 'exit-overlay';
    overlay.innerHTML = `
      <div class="exit-modal">
        <button class="exit-close" id="exit-close">&times;</button>
        <div class="exit-emoji">
          <!-- 3D Exclamation -->
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 8px rgba(180,130,20,0.4))">
            <defs>
              <linearGradient id="ex-g" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#f5e070"/>
                <stop offset="50%" stop-color="#c9a84c"/>
                <stop offset="100%" stop-color="#7a5210"/>
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="url(#ex-g)" opacity="0.2"/>
            <path d="M24 10 L24 28" stroke="url(#ex-g)" stroke-width="6" stroke-linecap="round"/>
            <circle cx="24" cy="36" r="3.5" fill="url(#ex-g)"/>
          </svg>
        </div>
        <h3>Espere! Não vá ainda...</h3>
        <p>Sabemos que obras dão dor de cabeça. Por isso oferecemos <strong style="color: var(--gold-dark); font-weight: 700;">gestão 360°</strong> e garantia em contrato.</p>
        <p class="exit-sub">Clique no botão e agende uma <strong style="color: var(--gold-dark); font-weight: 700;">visita técnica 100% gratuita</strong> agora mesmo!</p>
        <a
          href="https://wa.me/5531987778187?text=Ol%C3%A1%21+Estava+no+site+da+Construtora+Reis+e+gostaria+de+ajuda+para+encontrar+meu+im%C3%B3vel."
          id="exit-cta"
          class="btn btn-lg"
          target="_blank"
          rel="noopener noreferrer"
          style="justify-content:center; width:100%; margin-top:16px; background: #25D366; color: #fff; border: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);"
          onclick="document.getElementById('exit-overlay').remove()"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0; margin-right:8px;">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.533 5.862L.057 23.428a.5.5 0 0 0 .609.61l5.633-1.476A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.371l-.36-.214-3.72.975.993-3.624-.234-.373A9.818 9.818 0 0 1 12 2.182c5.426 0 9.818 4.392 9.818 9.818 0 5.427-4.392 9.818-9.818 9.818z"/>
          </svg>
          Agendar Visita Gratuita
        </a>
        <p class="exit-trust" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <!-- 3D Golden Lock -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lck2-g" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#f5e070"/>
                <stop offset="50%" stop-color="#c9a84c"/>
                <stop offset="100%" stop-color="#7a5210"/>
              </linearGradient>
              <linearGradient id="lck2-body" x1="4" y1="10" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#e8c84a"/>
                <stop offset="100%" stop-color="#9a7020"/>
              </linearGradient>
              <filter id="lck2-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(100,60,0,0.5)"/></filter>
            </defs>
            <rect x="4" y="10" width="16" height="12" rx="3" fill="url(#lck2-body)" filter="url(#lck2-sh)"/>
            <path d="M7 10 V7 C7 4 9 2 12 2 C15 2 17 4 17 7 V10" stroke="url(#lck2-g)" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#lck2-sh)"/>
            <circle cx="12" cy="15" r="2" fill="#7a5210"/>
            <path d="M11 16 L13 16 L12.5 19 L11.5 19 Z" fill="#7a5210"/>
            <rect x="5" y="11" width="14" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
          </svg>
          Sem spam. Atendimento personalizado.
        </p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.querySelector('.exit-modal').style.transform = 'translateY(0) scale(1)';
    });

    document.getElementById('exit-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  }

  /* â€”â€”â€” INJECT DYNAMIC STYLES â€”â€”â€” */
  const dynStyle = document.createElement('style');
  dynStyle.textContent = `
    /* Active Nav */
    .nav-link.active { color: var(--gold) !important; }

    /* Form alerts */
    .form-alert {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      margin-bottom: 16px;
      animation: slide-in 0.3s ease;
    }
    .form-alert-error {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
    }
    .form-alert-success {
      background: rgba(37,211,102,0.1);
      border: 1px solid rgba(37,211,102,0.3);
      color: #86efac;
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Spinner */
    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(0,0,0,0.2);
      border-top-color: var(--dark-bg);
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Exit intent */
    #exit-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .exit-modal {
      background: var(--dark-card);
      border: 1px solid var(--dark-border);
      border-radius: 20px;
      padding: 48px 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      position: relative;
      transform: translateY(40px) scale(0.96);
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    }
    .exit-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.06);
      border: none;
      color: var(--text-secondary);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .exit-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; }
    .exit-emoji { margin-bottom: 16px; }
    .exit-modal h3 {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-primary);
    }
    .exit-modal p {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 8px;
    }
    .exit-sub { font-size: 0.95rem !important; }
    .exit-trust {
      font-size: 0.85rem !important;
      color: var(--text-muted) !important;
      margin-top: 16px;
    }
  `;
  document.head.appendChild(dynStyle);

  console.log('ðŸ—ï¸ Construtora Reis | Site carregado com sucesso!');
});


