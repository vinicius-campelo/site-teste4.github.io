// ===================== ALTO NÍVEL — script.js (modelo fotográfico) =====================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Ano dinâmico no rodapé ----
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // ---- Cabeçalho sólido ao rolar ----
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // ---- Menu mobile ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Carrossel de imagens do hero (troca automática) ----
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  let current = 0;
  let timer;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Mostrar imagem ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('button');

    function goToSlide(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      resetTimer();
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 5000);
    }

    resetTimer();
  }

  // ---- Abas Missão / Visão / Valores com troca de imagem dinâmica ----
  const tabs = document.querySelectorAll('.mvv-tab');
  const panels = document.querySelectorAll('.mvv-panel');
  const mvvImage = document.getElementById('mvvImage');
  const tabImages = {
    missao: 'img/img12.jpg',
    visao: 'img/img14.jpg',
    valores: 'img/img13.jpg',
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));

      if (mvvImage && tabImages[target]) {
        mvvImage.style.opacity = '0';
        setTimeout(() => {
          mvvImage.src = tabImages[target];
          mvvImage.style.opacity = '1';
        }, 180);
      }
    });
  });

  // ---- Cards de serviço: troca de foto A/B ao passar o mouse ----
  document.querySelectorAll('.photo-card').forEach(card => {
    const img = card.querySelector('.photo-card-img');
    const imgA = card.dataset.imgA;
    const imgB = card.dataset.imgB;
    if (!img || !imgB) return;

    card.addEventListener('mouseenter', () => { img.style.opacity = '0.001'; setTimeout(() => { img.src = imgB; img.style.opacity = '1'; }, 120); });
    card.addEventListener('mouseleave', () => { img.style.opacity = '0.001'; setTimeout(() => { img.src = imgA; img.style.opacity = '1'; }, 120); });
  });

  // ---- Reveal suave ao rolar ----
  const revealTargets = document.querySelectorAll('.photo-card, .info-card');
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ---- Máscara simples de telefone ----
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2})/, '($1');
      }
      telInput.value = v;
    });
  }

  // ---- Validação + envio dinâmico do formulário de contato ----
  const form = document.getElementById('contatoForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  const validators = {
    nome: v => v.trim().length >= 3 ? '' : 'Informe seu nome completo.',
    telefone: v => v.replace(/\D/g, '').length >= 10 ? '' : 'Informe um telefone válido com DDD.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail válido.',
    servico: v => v ? '' : 'Selecione um serviço.'
  };

  function validateField(field) {
    const rule = validators[field.name];
    if (!rule) return true;
    const message = rule(field.value);
    const row = field.closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (message) {
      row.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    row.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  if (form) {
    ['nome', 'telefone', 'email', 'servico'].forEach(name => {
      const field = form.elements[name];
      if (field) field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let valid = true;
      ['nome', 'telefone', 'email', 'servico'].forEach(name => {
        const field = form.elements[name];
        if (field && !validateField(field)) valid = false;
      });

      if (!valid) {
        feedback.textContent = 'Confira os campos destacados antes de enviar.';
        feedback.className = 'form-feedback error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (response.ok) {
          feedback.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
          feedback.className = 'form-feedback success';
          form.reset();
        } else {
          throw new Error('Falha no envio');
        }
      } catch (err) {
        feedback.textContent = 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp (61) 98672-6059.';
        feedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Solicitar orçamento';
      }
    });
  }

});
