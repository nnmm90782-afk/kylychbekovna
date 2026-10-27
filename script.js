/* ============================================================
   ROMANTIC SITE — script.js
   ============================================================ */

/* ───────────────────────────────────────────────
   1. PARTICLES
─────────────────────────────────────────────── */
const SYMBOLS = ['❤️','🌹','💕','🌸','💖','🥀','💗','✨','💝','🌺'];
const particlesContainer = document.getElementById('particles-container');

function randomBetween(min, max) { return Math.random() * (max - min) + min; }

function createParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const size     = randomBetween(0.8, 2);
  const left     = randomBetween(0, 100);
  const duration = randomBetween(6, 16);
  const delay    = randomBetween(0, 8);
  el.style.cssText = `left:${left}%;font-size:${size}rem;animation-duration:${duration}s;animation-delay:${delay}s;opacity:0;`;
  particlesContainer.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
for (let i = 0; i < 20; i++) createParticle();
setInterval(createParticle, 900);

/* ───────────────────────────────────────────────
   2. CLICK BURST
─────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const angle = (i / 8) * 360;
    const dist  = randomBetween(60, 130);
    const rad   = (angle * Math.PI) / 180;
    const dx    = Math.cos(rad) * dist;
    const dy    = Math.sin(rad) * dist;
    const size  = randomBetween(1, 2);
    Object.assign(el.style, {
      position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
      fontSize: size + 'rem', pointerEvents: 'none', zIndex: 9999,
      transition: `transform ${randomBetween(0.5,1)}s ease-out, opacity 0.8s ease`,
      transform: 'translate(-50%,-50%)', opacity: 1,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`;
      el.style.opacity   = '0';
    }));
    setTimeout(() => el.remove(), 1000);
  }
});

/* ───────────────────────────────────────────────
   3. NAV scroll
─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ───────────────────────────────────────────────
   4. SCROLL REVEAL
─────────────────────────────────────────────── */
document.querySelectorAll(
  '.message-card, .music-player, .section-header, .finale-title, .finale-subtitle, .finale-hearts'
).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ───────────────────────────────────────────────
   5. HERO TYPING EFFECT
─────────────────────────────────────────────── */
const tagline = document.querySelector('.hero__tagline');
if (tagline) {
  const text = tagline.textContent.trim();
  tagline.textContent = '';
  tagline.style.opacity  = '1';
  tagline.style.animation = 'none';
  let idx = 0;
  function typeChar() {
    if (idx < text.length) { tagline.textContent += text[idx++]; setTimeout(typeChar, 55); }
  }
  setTimeout(typeChar, 1600);
}

/* ───────────────────────────────────────────────
   6. PARALLAX розы в hero
─────────────────────────────────────────────── */
const roseDecos = document.querySelectorAll('.rose-decoration');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  roseDecos.forEach((r, i) => {
    const spd = i % 2 === 0 ? 0.25 : -0.25;
    r.style.transform = `translateY(${s * spd}px) rotate(${i % 2 === 0 ? -5 : 5}deg)`;
  });
}, { passive: true });

/* ───────────────────────────────────────────────
   7. 3D PHOTO CAROUSEL
─────────────────────────────────────────────── */
(function () {
  const carousel  = document.getElementById('carousel3d');
  const btnPrev   = document.getElementById('c3dPrev');
  const btnNext   = document.getElementById('c3dNext');
  const dotsWrap  = document.getElementById('c3dDots');
  const items     = Array.from(carousel.querySelectorAll('.c3d-item'));
  const count     = items.length;
  let   current   = 0;
  let   autoTimer = null;

  const angleStep = 360 / count;
  const radius    = Math.round(300 / Math.tan(Math.PI / count));

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'c3d-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Фото ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function updateCarousel() {
    items.forEach((item, i) => {
      const angle   = angleStep * (i - current);
      const rad     = (angle * Math.PI) / 180;
      const x       = Math.sin(rad) * radius;
      const z       = Math.cos(rad) * radius - radius;
      const scale   = 0.6 + 0.4 * ((Math.cos(rad) + 1) / 2);
      const opacity = 0.3 + 0.7 * ((Math.cos(rad) + 1) / 2);
      item.style.transform  = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      item.style.opacity    = opacity;
      item.style.zIndex     = Math.round(scale * 10);
      item.style.transition = 'transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.85s ease';
      item.classList.toggle('active', i === current);
    });
    dotsWrap.querySelectorAll('.c3d-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = ((index % count) + count) % count;
    updateCarousel();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  btnNext.addEventListener('click', () => { next(); resetAuto(); });
  btnPrev.addEventListener('click', () => { prev(); resetAuto(); });
  items.forEach((item, i) => {
    item.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetAuto(); }
  });

  function startAuto() { autoTimer = setInterval(next, 3500); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  updateCarousel();
  startAuto();

  const wrapper = carousel.closest('.carousel-3d-wrapper');
  wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
  wrapper.addEventListener('mouseleave', startAuto);
})();

/* ───────────────────────────────────────────────
   8. MUSIC PLAYER — YouTube IFrame API
─────────────────────────────────────────────── */
(function () {
  const TRACKS = [
    { title: 'Сени сагынам',             id: 'EjtfkyhdRjE' },
    { title: 'Акыркы жолугуу',            id: 'SMfd5Y5YijE' },
    { title: 'Ты словно целая вселенная', id: 'dwC6U1AodRs' },
    { title: 'Весенний снегопад',         id: 'X4JDmfx_rMA' },
    { title: 'Кетким келбей',             id: '7tWSH3gqM18' },
  ];

  let currentTrack = 0;
  let isPlaying    = false;
  let ytPlayer     = null;
  let ytReady      = false;
  // Ожидаем действие пользователя пока API не готов
  let pendingPlay  = false;

  const vinyl      = document.getElementById('vinyl');
  const needle     = document.getElementById('vinylNeedle');
  const trackTitle = document.getElementById('trackTitle');
  const trackNum   = document.getElementById('trackNum');
  const trackSub   = document.getElementById('trackSub');
  const ctrlPlay   = document.getElementById('ctrlPlay');
  const ctrlPrev   = document.getElementById('ctrlPrev');
  const ctrlNext   = document.getElementById('ctrlNext');
  const trackItems = document.querySelectorAll('.track-item');

  /* ── Загрузка YouTube IFrame API ── */
  const tag    = document.createElement('script');
  tag.src      = 'https://www.youtube.com/iframe_api';
  const first  = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(tag, first);

  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    ytPlayer = new YT.Player('ytPlayer', {
      width:  '1',
      height: '1',
      videoId: TRACKS[0].id,
      playerVars: {
        autoplay:       0,
        controls:       0,
        disablekb:      1,
        fs:             0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline:    1,
        rel:            0,
        origin:         location.origin || 'https://localhost',
      },
      events: {
        onReady:       onPlayerReady,
        onStateChange: onStateChange,
        onError:       onPlayerError,
      },
    });
  };

  function onPlayerReady() {
    if (pendingPlay) {
      pendingPlay = false;
      ytPlayer.playVideo();
    }
  }

  function onStateChange(e) {
    if (e.data === YT.PlayerState.PLAYING) {
      setUI(true);
    } else if (e.data === YT.PlayerState.PAUSED) {
      setUI(false);
    } else if (e.data === YT.PlayerState.ENDED) {
      nextTrack(true);
    } else if (e.data === YT.PlayerState.BUFFERING) {
      trackSub.textContent = '♪ Загрузка...';
    }
  }

  function onPlayerError(e) {
    // Код 101/150 — правообладатель запретил embed
    if (e.data === 101 || e.data === 150) {
      trackSub.textContent = '⚠ Трек недоступен для встройки';
      setUI(false);
    }
  }

  /* ── UI ── */
  function setUI(playing) {
    isPlaying = playing;
    vinyl.classList.toggle('spinning', playing);
    needle.classList.toggle('playing', playing);
    ctrlPlay.innerHTML = playing ? '❚❚' : '▶';
    if (playing) trackSub.textContent = '♪ Играет...';
    else if (trackSub.textContent === '♪ Играет...') trackSub.textContent = '♪ Пауза';
  }

  /* ── Выбор трека ── */
  function selectTrack(index, autoplay) {
    currentTrack = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    const t = TRACKS[currentTrack];

    trackTitle.textContent = t.title;
    trackNum.textContent   = String(currentTrack + 1).padStart(2, '0') + ' / ' + String(TRACKS.length).padStart(2, '0');
    trackSub.textContent   = '♪ Нажми play';
    trackItems.forEach((li, i) => li.classList.toggle('active', i === currentTrack));
    setUI(false);

    if (!ytReady || !ytPlayer) {
      if (autoplay) pendingPlay = true;
      return;
    }

    if (autoplay) {
      ytPlayer.loadVideoById(t.id);
      setUI(true);
      trackSub.textContent = '♪ Загрузка...';
    } else {
      ytPlayer.cueVideoById(t.id);
    }
  }

  function togglePlay() {
    if (!ytReady || !ytPlayer) { pendingPlay = true; return; }
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
      trackSub.textContent = '♪ Загрузка...';
    }
  }

  function nextTrack(auto) { selectTrack(currentTrack + 1, auto !== false); }
  function prevTrack()      { selectTrack(currentTrack - 1, isPlaying); }

  ctrlPlay.addEventListener('click', togglePlay);
  ctrlNext.addEventListener('click', () => nextTrack(isPlaying));
  ctrlPrev.addEventListener('click', prevTrack);
  trackItems.forEach((li, i) => {
    li.addEventListener('click', () => selectTrack(i, true));
  });

  selectTrack(0, false);
})();

/* ───────────────────────────────────────────────
   9. REASONS CAROUSEL — 108 причин
─────────────────────────────────────────────── */
(function () {
  const REASONS = [
    { icon: '🌹', text: 'Твоя улыбка освещает весь мой день' },
    { icon: '❤️', text: 'Ты добра и искренна с теми, кого любишь' },
    { icon: '✨', text: 'Рядом с тобой я чувствую себя собой' },
    { icon: '🌸', text: 'Ты вдохновляешь меня быть лучше' },
    { icon: '💫', text: 'Твой смех — лучшая музыка на свете' },
    { icon: '🥰', text: 'Ты делаешь жизнь по-настоящему яркой' },
    { icon: '🌺', text: 'Ты умеешь любить по-настоящему' },
    { icon: '💖', text: 'Ты красива — и снаружи, и изнутри' },
    { icon: '🌙', text: 'Ты моя первая мысль с утра' },
    { icon: '⭐', text: 'Ты моя последняя мысль перед сном' },
    { icon: '🌹', text: 'Расстояние не гасит то, что я чувствую' },
    { icon: '💝', text: 'Ты сделала меня счастливее' },
    { icon: '🎀', text: 'Ты умеешь слушать и понимать' },
    { icon: '🌟', text: 'Твои глаза — целая вселенная' },
    { icon: '🦋', text: 'Ты легка и свободна как бабочка' },
    { icon: '🌈', text: 'Ты приносишь цвет в мой мир' },
    { icon: '💕', text: 'С тобой я не боюсь быть уязвимым' },
    { icon: '🌻', text: 'Ты тянешься к свету, как подсолнух' },
    { icon: '🍀', text: 'Ты моя удача и везение' },
    { icon: '🎶', text: 'Твой голос — моя любимая мелодия' },
    { icon: '🌹', text: 'Ты помнишь мелочи, которые важны мне' },
    { icon: '💗', text: 'Ты умеешь прощать — и это так красиво' },
    { icon: '🌸', text: 'Ты пахнешь весной и теплом' },
    { icon: '✨', text: 'С тобой молчание тоже комфортно' },
    { icon: '🥂', text: 'Ты умеешь радоваться маленькому' },
    { icon: '💫', text: 'Твоя энергия заряжает всё вокруг' },
    { icon: '🌙', text: 'Ты не боишься быть собой' },
    { icon: '❤️', text: 'Ты храбрее, чем думаешь' },
    { icon: '🌺', text: 'Ты заслуживаешь всего лучшего' },
    { icon: '🎁', text: 'Ты сама по себе — лучший подарок' },
    { icon: '🌹', text: 'Когда ты рядом — всё встаёт на место' },
    { icon: '💖', text: 'Ты умеешь любить, не требуя взамен' },
    { icon: '🦋', text: 'Ты растёшь и меняешься — и это восхищает' },
    { icon: '🌟', text: 'Твоя искренность — редкость в этом мире' },
    { icon: '🌸', text: 'Ты умеешь находить красоту в простом' },
    { icon: '💝', text: 'Рядом с тобой я хочу быть лучше' },
    { icon: '🍀', text: 'Ты моя опора, даже на расстоянии' },
    { icon: '🌈', text: 'После грусти ты — мой выход к свету' },
    { icon: '💕', text: 'Ты делаешь дни особенными' },
    { icon: '🎶', text: 'Ты появляешься в мыслях под каждую песню' },
    { icon: '🌹', text: 'Твоя нежность меня разоружает' },
    { icon: '✨', text: 'Ты смелая — даже когда страшно' },
    { icon: '❤️', text: 'Ты моё спокойствие' },
    { icon: '🌺', text: 'Ты умеешь мечтать — и это заразительно' },
    { icon: '🥰', text: 'С тобой время летит незаметно' },
    { icon: '💫', text: 'Ты никогда не бываешь жестокой' },
    { icon: '🌙', text: 'Ты светишь ярче любых звёзд' },
    { icon: '🦋', text: 'Ты лёгкая — без тяжести и драмы' },
    { icon: '🌟', text: 'Твоя внимательность к деталям восхищает' },
    { icon: '💗', text: 'Ты умеешь поддержать одним словом' },
    { icon: '🌸', text: 'Ты пришла — и мир стал уютнее' },
    { icon: '🍀', text: 'С тобой я хочу делиться всем' },
    { icon: '🎀', text: 'Ты умеешь радовать просто так' },
    { icon: '💖', text: 'Ты не боишься любить по-настоящему' },
    { icon: '🌹', text: 'Ты идеальна в своей неидеальности' },
    { icon: '🌈', text: 'Ты меняешь мой мир к лучшему каждый день' },
    { icon: '💝', text: 'Твои черты мне не надоедают — никогда' },
    { icon: '🎶', text: 'Ты вдохновляешь меня на лучшее' },
    { icon: '🥂', text: 'Ты умеешь создавать праздник из ничего' },
    { icon: '💕', text: 'Ты — мой любимый человек на планете' },
    { icon: '🌹', text: 'Каждое сообщение от тебя — как подарок' },
    { icon: '✨', text: 'Ты умеешь любить молча' },
    { icon: '❤️', text: 'Ты моя самая близкая душа' },
    { icon: '🌺', text: 'Ты умеешь быть нежной и сильной одновременно' },
    { icon: '🥰', text: 'Ты моя родная — даже издалека' },
    { icon: '💫', text: 'С тобой я хочу встретить рассвет' },
    { icon: '🌙', text: 'С тобой я хочу смотреть на звёзды' },
    { icon: '🦋', text: 'Ты делаешь меня спокойным изнутри' },
    { icon: '🌟', text: 'Ты — моя любимая причина улыбаться' },
    { icon: '💗', text: 'Ты — лучшее, что случилось со мной' },
    { icon: '🌸', text: 'Ты умеешь любить по-настоящему сильно' },
    { icon: '🍀', text: 'Ты всегда в моих мыслях' },
    { icon: '🎀', text: 'Ты особенная — и ты это знаешь' },
    { icon: '💖', text: 'Ты моя муза и моё вдохновение' },
    { icon: '🌹', text: 'Мы далеко — но ты всегда рядом в сердце' },
    { icon: '🌈', text: 'Расстояние только делает сильнее то, что я чувствую' },
    { icon: '💝', text: 'Каждый день без тебя — напоминание как сильно скучаю' },
    { icon: '🎶', text: 'Каждая песня напоминает мне о тебе' },
    { icon: '🥂', text: 'Ты — мой любимый человек на любом расстоянии' },
    { icon: '💕', text: 'Я люблю тебя — просто так, без причины' },
    { icon: '🌹', text: 'Твоя улыбка стоит тысячи слов' },
    { icon: '✨', text: 'Ты стоишь любого расстояния' },
    { icon: '❤️', text: 'Ты моя единственная и неповторимая' },
    { icon: '💫', text: 'Ты моя тихая гавань в шторм' },
    { icon: '🌸', text: 'Я жду тебя — всегда' },
    { icon: '🌺', text: 'Ты лучшее, что есть в моей жизни' },
    { icon: '💖', text: 'Ты умеешь любить так, что чувствуешь кожей' },
    { icon: '🌹', text: 'Ты — то, о чём я мечтал' },
    { icon: '🌟', text: 'Ты терпелива — и это восхищает' },
    { icon: '💝', text: 'Ты не держишь зла — и это сила' },
    { icon: '🎶', text: 'Ты моя любимая история' },
    { icon: '🍀', text: 'Ты — моё самое любимое совпадение' },
    { icon: '💗', text: 'Ты показываешь мне, что любовь существует' },
    { icon: '🦋', text: 'Твоя свобода вдохновляет меня' },
    { icon: '🌙', text: 'Ты думаешь о людях — это красиво' },
    { icon: '🥰', text: 'Твоя забота ощущается даже издалека' },
    { icon: '🌹', text: 'Ты моё всё, Аделина' },
    { icon: '❤️', text: 'Я скучаю по тебе каждый день' },
    { icon: '🌸', text: 'Ты пахнешь счастьем' },
    { icon: '💫', text: 'Ты умеешь ценить момент' },
    { icon: '🌺', text: 'Ты живёшь полной грудью' },
    { icon: '💖', text: 'Ты моя любовь — навсегда' },
    { icon: '🌟', text: 'С тобой даже скучный день особенный' },
    { icon: '💕', text: 'Люблю тебя больше всего на свете' },
    { icon: '🌹', text: 'Люблю тебя, Аделина ❤️' },
  ];

  const total   = REASONS.length;
  let current   = 0;
  let autoTimer = null;

  const wrapper  = document.querySelector('.reasons-carousel-wrapper');
  const btnPrev  = document.getElementById('rcPrev');
  const btnNext  = document.getElementById('rcNext');
  const counter  = document.getElementById('rcCounter');
  const carousel = document.getElementById('reasonsCarousel');

  // Прогресс-бар
  let progressWrap = document.querySelector('.rc-progress');
  if (!progressWrap) {
    progressWrap = document.createElement('div');
    progressWrap.className = 'rc-progress';
    progressWrap.innerHTML = '<div class="rc-progress-fill" id="rcProgressFill"></div>';
    counter.insertAdjacentElement('afterend', progressWrap);
  }
  const progressFill = progressWrap.querySelector('.rc-progress-fill');

  // Строим карточки
  carousel.innerHTML = '';
  REASONS.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <div class="reason-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="reason-icon">${r.icon}</div>
      <p class="reason-text">${r.text}</p>
    `;
    card.addEventListener('click', () => { goTo(i); resetAuto(); });
    carousel.appendChild(card);
  });

  const cards = Array.from(carousel.querySelectorAll('.reason-card'));
  const POSITIONS = ['pos-center','pos-left1','pos-right1','pos-left2','pos-right2','pos-hidden'];

  function getPos(i) {
    const diff = ((i - current) % total + total) % total;
    if (diff === 0)         return 'pos-center';
    if (diff === 1)         return 'pos-right1';
    if (diff === total - 1) return 'pos-left1';
    if (diff === 2)         return 'pos-right2';
    if (diff === total - 2) return 'pos-left2';
    return 'pos-hidden';
  }

  function updateCarousel() {
    cards.forEach((card, i) => {
      card.classList.remove(...POSITIONS);
      card.classList.add(getPos(i));
    });
    counter.textContent = `${current + 1} / ${total}`;
    if (progressFill) {
      progressFill.style.width = ((current + 1) / total * 100) + '%';
    }
  }

  function goTo(i) {
    current = ((i % total) + total) % total;
    updateCarousel();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  btnNext.addEventListener('click', () => { next(); resetAuto(); });
  btnPrev.addEventListener('click', () => { prev(); resetAuto(); });

  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetAuto(); }
  });

  wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
  wrapper.addEventListener('mouseleave', () => startAuto());

  updateCarousel();
  startAuto();
})();

/* ───────────────────────────────────────────────
   11. WISHES → Telegram
─────────────────────────────────────────────── */
(function () {
  const BOT_TOKEN = '9183796818:AAGkSmRGsVIJCvgSAXmHji-Qhs8rePriOSI';
  const CHAT_ID   = '7188346620';
  const API_URL   = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const textarea  = document.getElementById('wishText');
  const btn       = document.getElementById('wishBtn');
  const counter   = document.getElementById('wishCounter');
  const status    = document.getElementById('wishStatus');
  const btnText   = btn.querySelector('.wish-btn__text');
  const btnLoader = btn.querySelector('.wish-btn__loading');

  // Счётчик символов
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / 500`;
    counter.style.color = len > 450 ? 'var(--rose-light)' : '';
  });

  // Отправка
  btn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) {
      showStatus('Напиши что-нибудь ✨', 'error');
      textarea.focus();
      return;
    }

    // UI — loading
    btn.disabled    = true;
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    status.className = 'wish-status';
    status.textContent = '';

    const message = `🌙 *Новое желание*\n\n${text}\n\n_— Анонимно ✨_`;

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    CHAT_ID,
          text:       message,
          parse_mode: 'Markdown',
        }),
      });

      const data = await res.json();

      if (data.ok) {
        textarea.value = '';
        counter.textContent = '0 / 500';
        showStatus('Желание отправлено 🌙✨', 'success');
        // Маленький взрыв сердечек
        triggerBurst();
      } else {
        showStatus('Что-то пошло не так, попробуй ещё раз', 'error');
      }
    } catch (e) {
      showStatus('Ошибка соединения, попробуй ещё раз', 'error');
    } finally {
      btn.disabled    = false;
      btnText.style.display   = 'inline';
      btnLoader.style.display = 'none';
    }
  });

  function showStatus(msg, type) {
    status.textContent  = msg;
    status.className    = `wish-status ${type}`;
    setTimeout(() => {
      status.textContent = '';
      status.className   = 'wish-status';
    }, 5000);
  }

  function triggerBurst() {
    const card = document.querySelector('.wish-form-card');
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const syms  = ['✨','🌙','💫','🌹','❤️','💖'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div');
      el.textContent = syms[Math.floor(Math.random() * syms.length)];
      const angle = (i / 12) * 360;
      const dist  = randomBetween(60, 140);
      const rad   = (angle * Math.PI) / 180;
      const dx    = Math.cos(rad) * dist;
      const dy    = Math.sin(rad) * dist;
      Object.assign(el.style, {
        position: 'fixed', left: cx + 'px', top: cy + 'px',
        fontSize: randomBetween(1, 2) + 'rem',
        pointerEvents: 'none', zIndex: 9999,
        transition: `transform ${randomBetween(0.6, 1.1)}s ease-out, opacity 0.9s ease`,
        transform: 'translate(-50%,-50%)', opacity: 1,
      });
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`;
        el.style.opacity   = '0';
      }));
      setTimeout(() => el.remove(), 1200);
    }
  }
})();

/* ───────────────────────────────────────────────
   12. HEARTS row hover
─────────────────────────────────────────────── */
document.querySelectorAll('.hearts-row span').forEach(span => {
  span.style.cursor = 'pointer';
  span.addEventListener('mouseenter', () => {
    span.style.transform  = 'scale(1.6)';
    span.style.transition = 'transform 0.2s ease';
  });
  span.addEventListener('mouseleave', () => { span.style.transform = 'scale(1)'; });
});
